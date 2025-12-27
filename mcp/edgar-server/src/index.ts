import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { EdgarClient } from "./edgar.js";

const server = new Server(
  {
    name: "edgar-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const client = new EdgarClient();

server.tool(
  "edgar.resolve_company",
  {
    inputSchema: z.object({
      ticker_or_cik: z.string(),
    }),
  },
  async ({ ticker_or_cik }) => {
    const result = await client.resolveCompany(ticker_or_cik);
    return { content: [{ type: "json", json: result }] };
  }
);

server.tool(
  "edgar.latest_filing",
  {
    inputSchema: z.object({
      cik: z.string(),
      form_type: z.enum(["10-K", "10-Q", "8-K"]),
    }),
  },
  async ({ cik, form_type }) => {
    const result = await client.latestFiling(cik, form_type);
    return { content: [{ type: "json", json: result }] };
  }
);

server.tool(
  "edgar.fetch_filing_text",
  {
    inputSchema: z.object({
      primary_doc_url: z.string().url(),
      max_chars: z.number().int().positive().optional().default(200000),
    }),
  },
  async ({ primary_doc_url, max_chars }) => {
    const result = await client.fetchFilingText(primary_doc_url, max_chars);
    return { content: [{ type: "json", json: result }] };
  }
);

server.tool(
  "edgar.get_and_prepare_for_skill",
  {
    inputSchema: z.object({
      ticker_or_cik: z.string(),
      form_type: z.enum(["10-K", "10-Q", "8-K"]),
      include_prior: z.boolean().optional().default(false),
      max_chars_each: z.number().int().positive().optional().default(200000),
    }),
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

    return {
      content: [
        {
          type: "json",
          json: {
            company: {
              cik: company.cik,
              ticker: company.ticker,
              name: company.name,
            },
            current,
            prior,
            skill_prompt_markdown: skillPromptMarkdown,
          },
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
