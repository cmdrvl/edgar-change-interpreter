#!/usr/bin/env python3
"""Assemble the EDGAR Change Interpreter prompt bundle.

Reads a current filing text file and an optional prior filing text file,
then fills prompts/user_template.md and prints system + user prompt to stdout.
"""

from __future__ import annotations

import argparse
from pathlib import Path


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip()


def build_prompt(system_path: Path, user_template_path: Path, current: str, prior: str) -> str:
    system_prompt = read_text(system_path)
    user_template = read_text(user_template_path)
    filled_user = (
        user_template.replace("[CURRENT_FILING_TEXT]", current)
        .replace("[PRIOR_FILING_TEXT]", prior)
    )
    return f"# System Prompt\n\n{system_prompt}\n\n# User Prompt\n\n{filled_user}\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Assemble EDGAR Change Interpreter prompts.")
    parser.add_argument("--current", required=True, help="Path to current filing text file.")
    parser.add_argument("--prior", help="Path to prior filing text file (optional).")
    parser.add_argument(
        "--system",
        default="prompts/system.txt",
        help="Path to system prompt (default: prompts/system.txt).",
    )
    parser.add_argument(
        "--template",
        default="prompts/user_template.md",
        help="Path to user template (default: prompts/user_template.md).",
    )
    args = parser.parse_args()

    current_text = read_text(Path(args.current))
    prior_text = read_text(Path(args.prior)) if args.prior else ""

    output = build_prompt(Path(args.system), Path(args.template), current_text, prior_text)
    print(output)


if __name__ == "__main__":
    main()
