# From Idea to Advantage: self-study revision 2.1.0

Scope: 36 lessons in 12 existing modules. Preserve stable identifiers, existing quizzes, assignment and certificate requirements, prices, publication choices, accounts and learner records. Preserve a full pre-revision course snapshot. Only exact original teaching fingerprints qualify for automatic migration; edited content requires reconciliation.

## Teaching changes

Each lesson now includes objectives and prerequisites, a concept explanation, its own workplace scenario, guided practice, independent fictional practice, a model answer, feedback for every knowledge-check option, troubleshooting, a recap and primary references. Twelve original accessible SVGs explain relationships. Three finance lessons include an interactive price/cost/capacity calculator. Overseas references support general methods, not local legal requirements.

Corrected weak-category averaging, workbook evidence versus statistical confidence, direct versus variable costs, markup versus margin, reconciliation limitations, cash collection versus revenue and ABC criteria versus operational criticality. Removed unverified product feature assertions in favour of categories and official-documentation checks. Existing junior programmes retain their supervised workflows.

## Evidence so far

- Type check, complete unit suite, production build: passed.
- Existing account/access API and adult AI/networking course journeys: passed.
- Business API journey: 36 lessons, 12 assignments, 24-question final examination, certificate gates, persisted notes/progress and version history: passed using synthetic data.
- Editing teaching or a quiz invalidates source review and prevents protected-course publication until explicitly checked again: passed.
- Calculator: 500 cases independently compared with Python Decimal; passed. Boundary and invalid-input unit tests passed.
- Twelve SVGs: XML/title/description checks passed. Source material and examples reviewed; numbers are labelled illustrative.
- Browser, restored production data, rollback rehearsal and deployment: passed. See BUSINESS-RELEASE-20261115.md for exact provenance, evidence and recovery limits.

## Acceptance and release

Compare the complete restored store with the exact expected 36 lesson patches and course metadata; all other records must match. Learner-file bytes must match. Test the exact built image, perform browser/mobile/keyboard/reduced-motion checks, and rehearse the existing image against migrated data. Keep staging on server loopback only with no production identity or billing secrets and no event destination. Capture a quiesced encrypted checkpoint and validate it off-host before cutover. Preserve the stopped old container. Never run two writers against live data.

Run `python3 scripts/release-business.py stage`, complete browser checks and save a source-bound receipt in `release-private/browser-checks.json`, then `python3 scripts/accept-business-candidate.py`. Checkpoint and activation use the release script's acknowledged encrypted backup hash. Private receipts and data must never be committed.

## Remaining scope

144 prior lessons still require their full review/lab or junior-programme checks. This release does not assert that those programmes are source-checked. Payment collection remains blocked: current merchant evidence is sandbox TT/TTD with no verified live USD/XCD recurring-payment flow. US$35/EC$94 monthly unlimited access is the approved proposal, not an enabled charge. Existing dated access grants and cancellation expiry behaviour are preserved; no live payment or billing configuration is changed.
