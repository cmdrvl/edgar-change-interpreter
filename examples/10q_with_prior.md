# Example: 10-Q with Prior Filing

## Mocked filing excerpt (current 10-Q)
```
Quarterly Report (Form 10-Q)
Liquidity and Capital Resources
We ended the quarter with $42.3 million in cash and cash equivalents, down from $58.7 million at year-end. Operating cash flow was negative $18.4 million, driven by higher inventory purchases. We drew $15.0 million on our revolving credit facility, which now has $35.0 million outstanding.

Risk Factors
We are now subject to a Department of Labor inquiry regarding wage practices at two distribution centers. An adverse outcome could require additional accruals.

Controls and Procedures
Management identified a material weakness in revenue cutoff controls related to bundled service contracts. Remediation is underway.
```

## Mocked filing excerpt (prior 10-K)
```
Liquidity and Capital Resources
We ended the year with $58.7 million in cash and cash equivalents. Operating cash flow was positive $6.2 million. We had no borrowings outstanding under our revolving credit facility.

Risk Factors
We face ongoing regulatory scrutiny in multiple jurisdictions.

Controls and Procedures
Management concluded that disclosure controls and procedures were effective as of year-end.
```

## Good output (follows template)
# EDGAR Change Interpreter Output

## 1. Material Changes (Top 5–10)
- Change: Cash balance declined and operating cash flow turned negative.
  Evidence (<=25 words): "ended the quarter with $42.3 million in cash and cash equivalents, down from $58.7 million"
  Fact: Cash and cash equivalents decreased to $42.3 million; operating cash flow is negative.
  Interpretation: Liquidity tightened versus year-end, potentially from inventory build.
  Alternative explanations: Seasonal working-capital needs; timing of customer receipts.
  Confidence: High
- Change: New borrowing under the revolver where prior period had none.
  Evidence (<=25 words): "drew $15.0 million on our revolving credit facility, which now has $35.0 million outstanding"
  Fact: Revolving credit balance is now $35.0 million outstanding.
  Interpretation: Company is relying more on debt to fund operations.
  Alternative explanations: Short-term bridge for planned purchases.
  Confidence: High
- Change: New specific regulatory inquiry disclosed.
  Evidence (<=25 words): "subject to a Department of Labor inquiry regarding wage practices"
  Fact: A Department of Labor inquiry is ongoing.
  Interpretation: Regulatory risk has become more specific and potentially escalated.
  Alternative explanations: Routine inquiry without material impact.
  Confidence: Med
- Change: Material weakness newly identified in revenue cutoff controls.
  Evidence (<=25 words): "identified a material weakness in revenue cutoff controls"
  Fact: Management identified a material weakness related to bundled service contracts.
  Interpretation: Control environment deteriorated versus prior conclusion of effectiveness.
  Alternative explanations: More rigorous testing uncovered issues previously undiscovered.
  Confidence: High

## 2. Silent Risk Signals
- Signal: Negative operating cash flow alongside higher inventory purchases.
  Evidence (<=25 words): "Operating cash flow was negative $18.4 million, driven by higher inventory purchases."
  Why it matters: Inventory build could signal demand uncertainty or potential obsolescence risk.
  Confidence: Med

## 3. Numbers that moved (and what they might not mean)
- Metric: Cash and cash equivalents.
  Evidence (<=25 words): "ended the quarter with $42.3 million in cash and cash equivalents"
  Change summary: Cash decreased from year-end $58.7 million to $42.3 million.
  What it might not mean: A sustained liquidity crisis if the decline is seasonal.
  Confidence: Med
- Metric: Revolving credit outstanding.
  Evidence (<=25 words): "now has $35.0 million outstanding"
  Change summary: Revolver balance increased from zero to $35.0 million.
  What it might not mean: Long-term leverage increase if repaid in subsequent quarters.
  Confidence: Med

## 4. 8-K Item Summary (if 8-K)
- Item: Not applicable.
  Evidence (<=25 words): "Quarterly Report (Form 10-Q)"
  Impact summary: This filing is a 10-Q, so no 8-K items apply.
  Confidence: High

## 5. Follow-up Checklist (next 30 minutes)
- Task: Locate details on inventory composition and aging.
  Why: Assess whether inventory build is strategic or indicates slow-moving stock.
- Task: Check revolver terms and covenants.
  Why: Increased borrowings may affect liquidity headroom.
- Task: Identify remediation plan milestones for the material weakness.
  Why: Control fixes impact revenue recognition reliability.

## 6. Open Questions / Missing Evidence
- Question: Has the Department of Labor inquiry resulted in any accrual or estimate range?
  Missing evidence needed: Notes on contingencies or legal proceedings.

## 7. Appendix: Change Map
- Section: Liquidity and Capital Resources
  Change notes: Cash down, operating cash flow negative, revolver balance added.
  Evidence (<=25 words): "cash and cash equivalents, down from $58.7 million at year-end"
- Section: Risk Factors
  Change notes: New specific Department of Labor inquiry disclosed.
  Evidence (<=25 words): "subject to a Department of Labor inquiry"
- Section: Controls and Procedures
  Change notes: Material weakness identified; prior period stated effectiveness.
  Evidence (<=25 words): "identified a material weakness in revenue cutoff controls"
