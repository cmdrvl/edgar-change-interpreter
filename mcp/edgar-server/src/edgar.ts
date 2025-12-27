import path from "node:path";
import { fileURLToPath } from "node:url";
import { ResponseCache } from "./cache.js";
import { normalizeHtmlToText } from "./normalizer.js";
import { normalizeCik, readJsonFile, sleep, stripLeadingZeros } from "./utils.js";

export type CompanyResolution = {
  cik: string;
  ticker: string | null;
  name: string | null;
  source: string;
};

export type FilingMetadata = {
  cik: string;
  form_type: string;
  filing_date: string;
  accession_number: string;
  primary_document: string;
  index_url: string;
  primary_doc_url: string;
};

export type FilingTextResult = {
  url: string;
  content_type: string;
  text: string;
  truncated: boolean;
  warnings: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_MAX_CHARS = 200000;

export class EdgarClient {
  private cache: ResponseCache;
  private userAgent: string;
  private maxRps: number;
  private lastRequestAt = 0;

  constructor() {
    const name = process.env.SEC_USER_AGENT_NAME ?? "EDGAR MCP Server";
    const email = process.env.SEC_USER_AGENT_EMAIL ?? "unknown@example.com";
    this.userAgent = `${name} (${email})`;
    this.maxRps = Number(process.env.SEC_MAX_RPS ?? "2");
    const cacheEnv = process.env.SEC_CACHE_DIR;
    const cacheDir =
      cacheEnv === "off" || cacheEnv === "false" ? null : cacheEnv ?? path.resolve(__dirname, "..", ".cache");
    this.cache = new ResponseCache(cacheDir);
  }

  async resolveCompany(tickerOrCik: string): Promise<CompanyResolution> {
    const trimmed = tickerOrCik.trim();
    if (!trimmed) {
      throw new Error("ticker_or_cik is required");
    }
    if (/^\d+$/.test(trimmed)) {
      return {
        cik: normalizeCik(trimmed),
        ticker: null,
        name: null,
        source: "provided-cik",
      };
    }
    const ticker = trimmed.toUpperCase();
    const tickerMapPath = path.resolve(__dirname, "..", "data", "ticker_cik.json");
    const tickerMap = await readJsonFile<Record<string, string>>(tickerMapPath);
    const cik = tickerMap[ticker];
    if (!cik) {
      throw new Error(`Unknown ticker: ${ticker}. Add it to data/ticker_cik.json.`);
    }
    return {
      cik: normalizeCik(cik),
      ticker,
      name: null,
      source: "ticker-map",
    };
  }

  async latestFiling(cik: string, formType: string, index = 0): Promise<FilingMetadata> {
    const normalizedCik = normalizeCik(cik);
    const submission = await this.fetchJson<CompanySubmission>(
      `https://data.sec.gov/submissions/CIK${normalizedCik}.json`
    );
    const recent = submission.filings?.recent;
    if (!recent) {
      throw new Error(`No recent filings found for CIK ${normalizedCik}`);
    }
    const matches = collectRecentFilings(recent, formType);
    if (matches.length <= index) {
      throw new Error(`No ${formType} filings found for CIK ${normalizedCik}`);
    }
    const filing = matches[index];
    const accessionNumber = filing.accessionNumber;
    const accessionNoDashes = accessionNumber.replace(/-/g, "");
    const cikNoZeros = stripLeadingZeros(normalizedCik);
    const indexUrl = `https://www.sec.gov/Archives/edgar/data/${cikNoZeros}/${accessionNoDashes}/${accessionNumber}-index.html`;
    const primaryDocUrl = `https://www.sec.gov/Archives/edgar/data/${cikNoZeros}/${accessionNoDashes}/${filing.primaryDocument}`;
    return {
      cik: normalizedCik,
      form_type: filing.form,
      filing_date: filing.filingDate,
      accession_number: accessionNumber,
      primary_document: filing.primaryDocument,
      index_url: indexUrl,
      primary_doc_url: primaryDocUrl,
    };
  }

  async fetchFilingText(url: string, maxChars = DEFAULT_MAX_CHARS): Promise<FilingTextResult> {
    const warnings: string[] = [];
    const response = await this.fetchText(url);
    const contentType = response.contentType ?? "application/octet-stream";
    let text = response.body;

    if (contentType.includes("html")) {
      text = normalizeHtmlToText(text);
    } else if (contentType.includes("text")) {
      text = text.replace(/\r\n/g, "\n");
    } else {
      warnings.push(`Unexpected content type: ${contentType}`);
    }

    let truncated = false;
    if (text.length > maxChars) {
      text = text.slice(0, maxChars);
      truncated = true;
    }

    if (!text.trim()) {
      warnings.push("No text extracted from filing.");
    }

    return {
      url,
      content_type: contentType,
      text,
      truncated,
      warnings,
    };
  }

  async buildSkillPrompt(
    company: CompanyResolution,
    current: FilingMetadata & FilingTextResult,
    prior: (FilingMetadata & FilingTextResult) | null
  ) {
    const templatePath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "skills",
      "edgar-change-interpreter",
      "templates",
      "user_input_template.md"
    );
    const { readFile } = await import("node:fs/promises");
    const template = await readFile(templatePath, "utf8");
    const filled = template
      .replace("Company name:", `Company name: ${company.name ?? ""}`)
      .replace("Ticker (optional):", `Ticker (optional): ${company.ticker ?? ""}`)
      .replace(
        "Filing type (10-K / 10-Q / 8-K):",
        `Filing type (10-K / 10-Q / 8-K): ${current.form_type}`
      )
      .replace("Filing date:", `Filing date: ${current.filing_date}`)
      .replace("[CURRENT_FILING_TEXT]", current.text)
      .replace("[PRIOR_FILING_TEXT]", prior ? prior.text : "");
    return filled;
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const textResponse = await this.fetchText(url);
    return JSON.parse(textResponse.body) as T;
  }

  private async fetchText(url: string): Promise<{ body: string; contentType: string | null }> {
    const cached = await this.cache.get(url);
    if (cached) {
      return { body: cached.body, contentType: cached.contentType };
    }

    const response = await this.fetchWithRateLimit(url);
    const body = await response.text();
    const contentType = response.headers.get("content-type");
    const payload = { url, body, contentType };
    await this.cache.set(payload);
    return { body, contentType };
  }

  private async fetchWithRateLimit(url: string, attempt = 0): Promise<Response> {
    const now = Date.now();
    const minInterval = 1000 / Math.max(this.maxRps, 1);
    const waitFor = Math.max(0, this.lastRequestAt + minInterval - now);
    if (waitFor > 0) {
      await sleep(waitFor);
    }
    this.lastRequestAt = Date.now();

    const response = await fetch(url, {
      headers: {
        "User-Agent": this.userAgent,
        Accept: "application/json,text/html,text/plain;q=0.9,*/*;q=0.8",
      },
    });

    if ([429, 503].includes(response.status) && attempt < 3) {
      const backoff = Math.pow(2, attempt) * 1000;
      await sleep(backoff);
      return this.fetchWithRateLimit(url, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${url}`);
    }

    return response;
  }
}

type CompanySubmission = {
  filings?: {
    recent?: {
      accessionNumber: string[];
      filingDate: string[];
      form: string[];
      primaryDocument: string[];
    };
  };
};

type RecentFiling = {
  accessionNumber: string;
  filingDate: string;
  form: string;
  primaryDocument: string;
};

const collectRecentFilings = (recent: NonNullable<CompanySubmission["filings"]>["recent"], formType: string) => {
  const filings: RecentFiling[] = [];
  if (!recent) {
    return filings;
  }
  for (let i = 0; i < recent.form.length; i += 1) {
    const form = recent.form[i];
    if (form !== formType) {
      continue;
    }
    filings.push({
      accessionNumber: recent.accessionNumber[i],
      filingDate: recent.filingDate[i],
      form,
      primaryDocument: recent.primaryDocument[i],
    });
  }
  return filings;
};

export const buildPrimaryDocUrl = (cik: string, accessionNumber: string, primaryDocument: string) => {
  const cikNoZeros = stripLeadingZeros(normalizeCik(cik));
  const accessionNoDashes = accessionNumber.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cikNoZeros}/${accessionNoDashes}/${primaryDocument}`;
};

export const buildIndexUrl = (cik: string, accessionNumber: string) => {
  const cikNoZeros = stripLeadingZeros(normalizeCik(cik));
  const accessionNoDashes = accessionNumber.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cikNoZeros}/${accessionNoDashes}/${accessionNumber}-index.html`;
};
