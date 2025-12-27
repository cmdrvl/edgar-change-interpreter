import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { EdgarClient } from "./edgar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (one level up from dist/)
loadEnv({ path: path.resolve(__dirname, "..", ".env") });

const server = new McpServer({
  name: "edgar-mcp-server",
  version: "0.1.0",
});

// Print setup instructions to stderr (won't interfere with MCP protocol on stdout)
const printSetupInstructions = () => {
  const scriptPath = __filename;
  const userAgentName = process.env.SEC_USER_AGENT_NAME ?? "Your Name";
  const userAgentEmail = process.env.SEC_USER_AGENT_EMAIL ?? "your@email.com";

  const config = {
    type: "stdio",
    command: "node",
    args: [scriptPath],
    env: {
      SEC_USER_AGENT_NAME: userAgentName,
      SEC_USER_AGENT_EMAIL: userAgentEmail,
    },
  };

  const configJson = JSON.stringify(config);
  console.error("\n[edgar-mcp-server] Started successfully!");
  console.error("\nTo add this server to Claude CLI, run:");
  console.error(`\nclaude mcp add-json edgar '${configJson}'\n`);
};

printSetupInstructions();

const client = new EdgarClient();

server.tool(
  "edgar.resolve_company",
  "Resolve a company ticker or CIK to a normalized company record",
  { ticker_or_cik: z.string() },
  async ({ ticker_or_cik }) => {
    const result = await client.resolveCompany(ticker_or_cik);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "edgar.latest_filing",
  "Get the latest filing metadata for a company",
  {
    cik: z.string(),
    form_type: z.enum(["10-K", "10-Q", "8-K"]),
  },
  async ({ cik, form_type }) => {
    const result = await client.latestFiling(cik, form_type);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "edgar.fetch_filing_text",
  "Fetch the text content of a filing document",
  {
    primary_doc_url: z.string().url(),
    max_chars: z.number().int().positive().optional().default(200000),
  },
  async ({ primary_doc_url, max_chars }) => {
    const result = await client.fetchFilingText(primary_doc_url, max_chars);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "edgar.get_and_prepare_for_skill",
  "Fetch filings and prepare a skill prompt for EDGAR change interpretation. Returns only the skill prompt markdown (filing text is embedded within it).",
  {
    ticker_or_cik: z.string(),
    form_type: z.enum(["10-K", "10-Q", "8-K"]),
    include_prior: z.boolean().optional().default(false),
    max_chars_each: z.number().int().positive().optional().default(100000),
  },
  async ({ ticker_or_cik, form_type, include_prior, max_chars_each }) => {
    const company = await client.resolveCompany(ticker_or_cik);
    const currentMeta = await client.latestFiling(company.cik, form_type, 0);
    const currentText = await client.fetchFilingText(currentMeta.primary_doc_url, max_chars_each);

    let priorMeta: typeof currentMeta | null = null;
    let priorText: typeof currentText | null = null;

    if (include_prior) {
      priorMeta = await client.latestFiling(company.cik, form_type, 1);
      priorText = await client.fetchFilingText(priorMeta.primary_doc_url, max_chars_each);
    }

    const current = { ...currentMeta, ...currentText };
    const prior = priorMeta && priorText ? { ...priorMeta, ...priorText } : null;

    const skillPromptMarkdown = await client.buildSkillPrompt(company, current, prior);

    // Only return metadata (not the raw text) since it's already embedded in skill_prompt_markdown
    const result = {
      company: {
        cik: company.cik,
        ticker: company.ticker,
        name: company.name,
      },
      current_filing: {
        form_type: currentMeta.form_type,
        filing_date: currentMeta.filing_date,
        accession_number: currentMeta.accession_number,
        index_url: currentMeta.index_url,
        truncated: currentText.truncated,
        warnings: currentText.warnings,
      },
      prior_filing: priorMeta && priorText ? {
        form_type: priorMeta.form_type,
        filing_date: priorMeta.filing_date,
        accession_number: priorMeta.accession_number,
        index_url: priorMeta.index_url,
        truncated: priorText.truncated,
        warnings: priorText.warnings,
      } : null,
      skill_prompt_markdown: skillPromptMarkdown,
    };

    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
