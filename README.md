# EDGAR Change Interpreter

EDGAR Change Interpreter is a prompt bundle that prioritizes **change over summary** and **evidence over narrative** for SEC filings. Paste a filing excerpt (10-K/10-Q/8-K) and get a structured, auditable “material change” analysis with quotes, confidence ratings, and follow-up questions.

## Quickstart
1. Open `prompts/system.txt` and `prompts/user_template.md`.
2. Paste `system.txt` into Claude as the system prompt.
3. Paste the filled `user_template.md` into Claude as the user message (include filing text).
4. Receive output that follows `prompts/output_template.md`.

## Using it with or without a prior filing
- **With prior filing:** Paste the prior filing excerpt into the `Prior filing text` block. The skill will compare and highlight deltas.
- **Without prior filing:** Leave the prior block empty. The skill will avoid claiming changes vs. a missing prior period and treat the filing as a single snapshot.

## Optional manifest packs (decision evidence)
The repository includes an **optional** manifest schema at `manifest_optional/cmdrvl_manifest.schema.json`. It is **not required** for the skill to work. Use it only if you want to attach a structured “decision evidence pack” alongside the prompt to standardize metadata like lineage, refresh cadence, and known failure modes.

## Optional CLI (prompt assembler)
A tiny Python CLI assembles the system prompt + user template into a single markdown output. It does **not** call any APIs.

```bash
python tools/cli/edgar_prompt.py --current path/to/current.txt --prior path/to/prior.txt > prompt.md
```

Without a prior filing:

```bash
python tools/cli/edgar_prompt.py --current path/to/current.txt > prompt.md
```

## Contributing: add new profiles later
To extend this skill for other asset-class profiles (e.g., credit, macro, sector-specific overlays):
1. Add a new prompt bundle in `prompts/` (e.g., `system_credit.txt`, `user_template_credit.md`).
2. Add an output template aligned to the new system prompt.
3. Provide at least one example in `examples/` and update the rubric if new evaluation criteria are needed.

## Disclaimer
This project is for informational purposes only and is **not investment advice**.
