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

## Disclaimer
This skill provides decision support only and does not offer investment advice.
