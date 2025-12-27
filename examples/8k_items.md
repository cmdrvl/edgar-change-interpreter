# Example: 8-K Items

## Mocked filing excerpt (current 8-K)
```
Current Report (Form 8-K)
Item 1.01 Entry into a Material Definitive Agreement
On September 4, 2025, the Company entered into a Supply Agreement with Orion Components. The agreement requires minimum annual purchases of $120 million and includes a 3-year term.

Item 2.03 Creation of a Direct Financial Obligation
On September 5, 2025, the Company issued $50 million of senior secured notes due 2028 with a fixed coupon of 9.5%.

Item 2.05 Costs Associated with Exit or Disposal Activities
The Company approved a restructuring plan to close its Dayton facility, with expected charges between $12 million and $15 million, primarily severance and lease termination.
```

## Good output (follows template)
# EDGAR Change Interpreter Output

## 1. Material Changes (Top 5–10)
- Change: Entered a new supply agreement with minimum purchase commitments.
  Evidence (<=25 words): "entered into a Supply Agreement with Orion Components"
  Fact: A supply agreement with minimum annual purchases of $120 million was signed.
  Interpretation: The company is locking in supply at the cost of volume commitments.
  Alternative explanations: Securing capacity for anticipated demand growth.
  Confidence: High
- Change: Issued $50 million of senior secured notes with a 9.5% coupon.
  Evidence (<=25 words): "issued $50 million of senior secured notes due 2028"
  Fact: The company issued $50 million of senior secured notes due 2028.
  Interpretation: Financing costs increased due to high fixed coupon.
  Alternative explanations: Opportunistic financing to extend maturities.
  Confidence: High
- Change: Approved restructuring to close the Dayton facility with charges.
  Evidence (<=25 words): "approved a restructuring plan to close its Dayton facility"
  Fact: The Dayton facility will be closed with expected charges of $12–$15 million.
  Interpretation: Operational footprint is being reduced.
  Alternative explanations: Consolidation for efficiency rather than demand weakness.
  Confidence: High

## 2. Silent Risk Signals
- Signal: Minimum purchase commitment of $120 million.
  Evidence (<=25 words): "requires minimum annual purchases of $120 million"
  Why it matters: Commitments could pressure margins if demand softens.
  Confidence: Med

## 3. Numbers that moved (and what they might not mean)
- Metric: Restructuring charges.
  Evidence (<=25 words): "expected charges between $12 million and $15 million"
  Change summary: Restructuring charges of $12–$15 million are expected.
  What it might not mean: A long-term decline if closure is a one-time optimization.
  Confidence: Med
- Metric: New secured notes issuance.
  Evidence (<=25 words): "issued $50 million of senior secured notes due 2028"
  Change summary: $50 million of secured debt added at 9.5%.
  What it might not mean: Immediate liquidity strain if proceeds fund restructuring.
  Confidence: Med

## 4. 8-K Item Summary (if 8-K)
- Item: 1.01 Entry into a Material Definitive Agreement.
  Evidence (<=25 words): "entered into a Supply Agreement with Orion Components"
  Impact summary: Adds minimum purchase commitments for three years.
  Confidence: High
- Item: 2.03 Creation of a Direct Financial Obligation.
  Evidence (<=25 words): "issued $50 million of senior secured notes due 2028"
  Impact summary: Adds secured debt with a 9.5% fixed coupon.
  Confidence: High
- Item: 2.05 Costs Associated with Exit or Disposal Activities.
  Evidence (<=25 words): "approved a restructuring plan to close its Dayton facility"
  Impact summary: Closure expected to incur $12–$15 million charges.
  Confidence: High

## 5. Follow-up Checklist (next 30 minutes)
- Task: Review the supply agreement for pricing or indexation terms.
  Why: Minimum purchases may include pricing escalators.
- Task: Confirm use of proceeds for the secured notes.
  Why: Determine whether financing supports restructuring or growth.
- Task: Identify timeline and severance assumptions for the Dayton closure.
  Why: Validate restructuring cost range.

## 6. Open Questions / Missing Evidence
- Question: Are there termination penalties or change-of-control clauses in the supply agreement?
  Missing evidence needed: Detailed contract terms.

## 7. Appendix: Change Map
- Section: Item 1.01
  Change notes: New supply agreement with minimum purchases.
  Evidence (<=25 words): "Supply Agreement with Orion Components"
- Section: Item 2.03
  Change notes: New secured notes issued.
  Evidence (<=25 words): "issued $50 million of senior secured notes"
- Section: Item 2.05
  Change notes: Facility closure and restructuring charges.
  Evidence (<=25 words): "restructuring plan to close its Dayton facility"
