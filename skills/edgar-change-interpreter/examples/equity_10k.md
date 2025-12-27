# Example: 10-K Single Filing (No Prior)

## Mocked filing excerpt (current 10-K)
```
Annual Report (Form 10-K)
Risk Factors
We now depend on a single third-party manufacturer for our core device, and any disruption could halt shipments for up to six months.

Liquidity and Capital Resources
We entered into a new $75.0 million term loan that matures in 2029 and bears interest at SOFR plus 450 basis points. The agreement requires maintaining a minimum liquidity balance of $20.0 million.

Note 8 — Debt
The term loan includes a springing financial covenant tied to minimum EBITDA if liquidity falls below $20.0 million.
```

## Good output (follows template)
# EDGAR Change Interpreter Output

## 1. Material Changes (Top 5–10)
- Change: Reliance on a single third-party manufacturer is emphasized as a key risk.
  Evidence (<=25 words): "depend on a single third-party manufacturer for our core device"
  Fact: The company depends on one manufacturer for its core device.
  Interpretation: Supply chain concentration increases operational risk.
  Alternative explanations: Temporary consolidation while onboarding additional suppliers.
  Confidence: Med
- Change: New term loan with specific pricing and liquidity requirement is disclosed.
  Evidence (<=25 words): "entered into a new $75.0 million term loan"
  Fact: A $75.0 million term loan exists with SOFR+450 bps pricing.
  Interpretation: Capital structure now includes a sizable term loan with covenant constraints.
  Alternative explanations: Proactive refinancing for growth initiatives.
  Confidence: High
- Change: Springing covenant tied to liquidity and EBITDA is specified.
  Evidence (<=25 words): "springing financial covenant tied to minimum EBITDA"
  Fact: The term loan adds a springing financial covenant triggered by low liquidity.
  Interpretation: Covenant risk increases if liquidity dips.
  Alternative explanations: Standard lender protection with low likelihood of trigger.
  Confidence: Med

## 2. Silent Risk Signals
- Signal: Minimum liquidity requirement of $20.0 million.
  Evidence (<=25 words): "requires maintaining a minimum liquidity balance of $20.0 million"
  Why it matters: Falling below this threshold could trigger covenants or lender actions.
  Confidence: Med

## 3. Numbers that moved (and what they might not mean)
- Metric: Term loan size and interest rate.
  Evidence (<=25 words): "new $75.0 million term loan" 
  Change summary: A $75.0 million term loan at SOFR+450 bps is in place.
  What it might not mean: Imminent distress if the loan funds planned investments.
  Confidence: Med

## 4. 8-K Item Summary (if 8-K)
- Item: Not applicable.
  Evidence (<=25 words): "Annual Report (Form 10-K)"
  Impact summary: This filing is a 10-K, so no 8-K items apply.
  Confidence: High

## 5. Follow-up Checklist (next 30 minutes)
- Task: Identify supplier concentration mitigation steps.
  Why: Assess whether alternate manufacturers are being qualified.
- Task: Review term loan use of proceeds.
  Why: Clarify whether debt funds growth or covers operating needs.
- Task: Confirm covenant trigger mechanics and testing frequency.
  Why: Understand how quickly a liquidity dip could restrict operations.

## 6. Open Questions / Missing Evidence
- Question: What portion of device volume is covered by backup suppliers?
  Missing evidence needed: Supplier diversification disclosures or procurement notes.

## 7. Appendix: Change Map
- Section: Risk Factors
  Change notes: Supply chain concentration highlighted.
  Evidence (<=25 words): "depend on a single third-party manufacturer"
- Section: Liquidity and Capital Resources
  Change notes: New term loan with liquidity covenant.
  Evidence (<=25 words): "new $75.0 million term loan"
- Section: Note 8 — Debt
  Change notes: Springing covenant tied to EBITDA when liquidity is low.
  Evidence (<=25 words): "springing financial covenant tied to minimum EBITDA"
