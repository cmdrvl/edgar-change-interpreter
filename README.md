# Edgar Change Interpreter

A Claude Skill for interpreting material change, silent risk, and disclosure traps in SEC filings. It focuses on what changed (and what disappeared) across 10-K, 10-Q, and 8-K filings so you can review deltas without missing subtle shifts.

- **What this focuses on:** material changes, omitted risks, and explicit evidence from filings
- **What this deliberately avoids:** generic summaries and trade advice

---

## Why change interpretation (not summaries)?

Summaries describe what exists in a single filing. Decisions hinge on what changed between periods, what quietly disappeared, and how risk language shifted. This skill is built to surface those deltas and make uncertainty explicit.

---

## Quickstart

```bash
mkdir -p ~/.claude/skills
cp -R skills/edgar-change-interpreter ~/.claude/skills/
```

Restart Claude, then ask:

```text
Compare the latest 10-K vs. prior year for material changes and silent risks in the Risk Factors section.
```

---

## What Does This Do?

When you're reviewing SEC filings, this skill helps Claude:
- **Spot material changes** between current and prior filings
- **Flag silent risks** — things that disappeared or changed without explanation
- **Quote evidence** directly from the filing text
- **Be explicit about uncertainty** — no hallucinated conclusions

---

## Quick Start

### Prerequisites

- **Node.js v20 or higher** (see [Appendix A](#appendix-a-installing-nodejs-with-nvm) if you don't have it)
- **Claude CLI** with MCP support (see [Appendix B](#appendix-b-setting-up-claude-cli))

### Step 1: Install the Claude Skill

Copy the skill folder to your Claude skills directory:

```bash
# Create the skills directory if it doesn't exist
mkdir -p ~/.claude/skills

# Copy the skill
cp -R skills/edgar-change-interpreter ~/.claude/skills/
```

The skill is now installed. Continue to Step 2 to set up automatic filing retrieval, or skip to [Usage Examples](#usage-examples) to use the skill by pasting filing text manually.

### Step 2: Set Up the MCP Server (Recommended)

The MCP server fetches SEC filings for you automatically — no more copy-pasting from the SEC website. Skip to [Usage Examples](#usage-examples) if you want to use the skill manually without the server.

```bash
# Navigate to the server directory
cd mcp/edgar-server

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit the `.env` file with your information (the SEC requires a user-agent for API access):

```bash
SEC_USER_AGENT_NAME="Your Name or Company"
SEC_USER_AGENT_EMAIL="your@email.com"
SEC_MAX_RPS=2
```

Build the server:

```bash
npm run build
```

Run it once to get your registration command:

```bash
npm start
```

The server will print something like this:

```
[edgar-mcp-server] Started successfully!

To add this server to Claude CLI, run:

claude mcp add-json edgar '{"type":"stdio","command":"node","args":["/path/to/dist/index.js"],"env":{...}}'
```

**Important:** Stop the server (Ctrl+C), then copy and run that `claude mcp add-json ...` command. Claude Code manages starting the server automatically — you don't need to keep it running manually.

### Step 3: Start Claude Code

Now start Claude Code:

```bash
claude
```

That's it! Claude will automatically start the MCP server in the background when needed.

### Step 4: Verify Everything Works

Run these quick checks to confirm your setup:

```bash
# Check that the MCP server is registered
claude mcp list
# Should show "edgar" in the list

# Check that the skill is installed
ls ~/.claude/skills/edgar-change-interpreter
# Should show the skill files
```

**Quick test prompt** — paste this into Claude Code to confirm both the skill and MCP server are working:

```text
Use the edgar tools to resolve the company "AAPL" and tell me their CIK number.
```

If you see a CIK number (like 0000320193), you're all set.

---

## Usage Examples

### Without MCP Server (Manual)

Just paste filing text directly into Claude:

```text
Analyze the material changes and silent risks in this 10-Q excerpt:

[PASTE FILING TEXT HERE]
```

### With MCP Server (Automatic)

Ask Claude to fetch the filing for you:

```text
Use the edgar tools to fetch Apple's latest 10-K and analyze it for material changes.
```

Or be more specific:

```text
Fetch AAPL's latest 10-K with the prior period included, then analyze the changes in their risk factors.
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `edgar.resolve_company` | Convert a ticker (AAPL) to a CIK number |
| `edgar.latest_filing` | Get metadata for the most recent filing |
| `edgar.fetch_filing_text` | Download and convert a filing to plain text |
| `edgar.get_and_prepare_for_skill` | All-in-one: fetch filing(s) and prepare for analysis |

---

## Troubleshooting

### Skill not being used

If Claude analyzes a filing without the structured output format (Material Changes, Silent Risks, etc.), the skill might not be installed correctly.

**Check the skill is installed:**
```bash
ls ~/.claude/skills/edgar-change-interpreter/skill.md
```

If the file doesn't exist, re-run Step 1 to copy the skill folder.

**Tip:** You can explicitly invoke the skill by typing `/edgar-change-interpreter` in Claude Code, or by mentioning "use the edgar change interpreter skill" in your prompt.

### "File content exceeds maximum allowed size"

The filing text was too large. Try asking for a smaller excerpt or specific sections:

```text
Fetch AAPL's 10-K but focus only on the Risk Factors section.
```

### MCP server not responding

1. Check that you registered it with Claude (`claude mcp list` should show "edgar")
2. Try removing and re-adding it: `claude mcp remove edgar`, then run the add command again
3. Check your `.env` file has valid SEC_USER_AGENT values

---

## About CMD+RVL

CMD+RVL builds decision-grade data, signals, and evidence for financial analysis. This skill is an open, standalone component of that work, designed to make interpretation and uncertainty explicit.

---

## Extending this skill

You can optionally pair this with historical filing packs or MCP/API fetchers for easier sourcing. It always works standalone with pasted text when you want a minimal, offline workflow.

---

## Disclaimer

This skill provides decision support only and does not offer investment advice. Always verify findings against the original SEC filings.

---

## Appendix A: Installing Node.js with nvm

[nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) is the easiest way to install and manage Node.js versions.

### macOS / Linux

Open Terminal and run:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Restart your terminal, then install Node.js
nvm install 20
nvm use 20

# Verify it worked
node --version  # Should show v20.x.x
```

### Windows

Use [nvm-windows](https://github.com/coreybutler/nvm-windows):

1. Download the installer from the [releases page](https://github.com/coreybutler/nvm-windows/releases)
2. Run the installer
3. Open a new Command Prompt and run:

```bash
nvm install 20
nvm use 20
node --version
```

---

## Appendix B: Setting Up Claude CLI

The Claude CLI lets you use Claude from your terminal with MCP tool support.

### Install Claude CLI

```bash
# macOS (using Homebrew)
brew install claude

# Or using npm (any platform)
npm install -g @anthropic-ai/claude-cli
```

### First-Time Setup

```bash
# Authenticate with your Anthropic account
claude login

# Verify it's working
claude --version
```

### Managing MCP Servers

```bash
# List registered MCP servers
claude mcp list

# Add a server (the edgar server prints this command for you)
claude mcp add-json edgar '{"type":"stdio","command":"node","args":["/path/to/index.js"]}'

# Remove a server
claude mcp remove edgar

# Test a server
claude mcp get edgar
```

### Using Claude with MCP Tools

Once the edgar server is registered, just start a conversation:

```bash
claude

# Then type your request:
> Fetch Apple's latest 10-K and summarize the key risk factors.
```

Claude will automatically use the edgar tools when needed.
