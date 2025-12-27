# Edgar Change Interpreter

Edgar Change Interpreter is a Claude Skill implemented using the official Skills format. It helps Claude identify material changes, silent risks, and interpretation traps in SEC filings (10-K, 10-Q, 8-K) using evidence-based, structured outputs.

## Install locally
Copy the skill folder into your Claude skills directory:

```bash
mkdir -p ~/.claude/skills
cp -R skills/edgar-change-interpreter ~/.claude/skills/
```

## How Claude decides to load it
Claude loads this skill when the user provides SEC filing text and asks about changes, risks, or interpretation. The skill’s system instructions guide change-focused analysis, evidence quotes, and explicit uncertainty.

## Minimal usage example
Provide a filing excerpt and request a change-focused review:

```text
Analyze the material changes and silent risks in this 10-Q excerpt:

[PASTE FILING TEXT]
```

If you also have a prior filing, include it in the user input template at:
`skills/edgar-change-interpreter/templates/user_input_template.md`.

## Optional MCP server (EDGAR helper)
This repo includes an optional MCP server that can resolve tickers, fetch the latest filings, download EDGAR documents, and normalize them into plain text suitable for the Claude Skill. The skill itself still works without the MCP server.

### Run locally
```bash
cd mcp/edgar-server
npm install
npm run build
npm start
```

Environment configuration (create a `.env` based on `.env.example`):
```bash
SEC_USER_AGENT_NAME="CMD+RVL Edgar Skill"
SEC_USER_AGENT_EMAIL="you@example.com"
SEC_MAX_RPS=2
```

### Example MCP tool calls
Resolve a ticker to CIK:
```json
{"tool":"edgar.resolve_company","input":{"ticker_or_cik":"AAPL"}}
```

Fetch the latest 10-K metadata:
```json
{"tool":"edgar.latest_filing","input":{"cik":"0000320193","form_type":"10-K"}}
```

Fetch and normalize the filing text:
```json
{"tool":"edgar.fetch_filing_text","input":{"primary_doc_url":"https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930x10k.htm"}}
```

### Example flow: fetch latest 10-K and paste into the skill
1. Call `edgar.get_and_prepare_for_skill`:
   ```json
   {"tool":"edgar.get_and_prepare_for_skill","input":{"ticker_or_cik":"AAPL","form_type":"10-K","include_prior":true}}
   ```
2. Copy the `skill_prompt_markdown` field into the Claude conversation using the skill.

## Disclaimer
This skill provides decision support only and does not offer investment advice.
