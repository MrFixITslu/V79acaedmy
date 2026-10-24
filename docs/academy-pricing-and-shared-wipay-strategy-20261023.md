# Vision79 Academy — pricing and shared WiPay strategy v1
**Prepared 23 October 2026 · Proposal for owner approval · NOT a change to live prices or payments**

## Decision
Reuse the **existing Vision79 Hub WiPay account and billing ledger** for all Academy course checkout. Academy has **no independent WiPay merchant account, API key, settlement endpoint or response-hash verifier**. Its existing HMAC server-to-server client sends course order/status requests to Hub; Hub owns merchant configuration, hosted checkout, callback verification and payment status. The dedicated `V79_ACADEMY_BILLING_SECRET` must be present (the same secret value in Hub and Academy) but is **not** the WiPay API key. Keep `WIPAY_ENV=sandbox` until an independently authorized production merchant/currency cutover.

## Three paths and /REDTEAM
1. **Separate WiPay configuration inside Academy — reject:** duplicated sensitive credentials, callback drift, hard-to-reconcile sales and refunds, wider breach impact.
2. **Charge a monthly membership now — reject:** `subscription` is currently an *access label*, not a complete recurring biller with renewals, card tokenization, cancellation, dunning, disputes and proration. Do not label it a live renewable product.
3. **Chosen: one-time `premium` purchases via Hub + free acquisition courses; membership gated but not sold.** Hub alone verifies a *live* settled order bound to the signed-in learner and course before permanent ownership can be recorded. Sandbox success **never unlocks** paid content. Neither Academy browser redirects nor payment claims are authority to grant access.

### Pricing catalogue — proposed XCD (EC$), not live updates

| Offer | Canonical course / proposed product | XCD | Entitlement | Commercial status |
| --- | --- | ---: | --- | --- |
| Free AI starter + prompting guide | Intro modules / lead magnet | 0 | Free, no card | Free-content review |
| Short business AI/productivity masterclass | New standalone 60–120 min course (not yet a verified published SKU) | 99 | One-time, per learner | Future course |
| Junior AI Academy, 16 missions | `course-junior-ai-academy-01` | 249 | One-time, per learner with parent/guardian account rules | Content & minor-safety review |
| Junior Networking Academy, 20 missions | `course-junior-networking-academy-01` | 299 | One-time, per learner with parent/guardian account rules | Content & minor-safety review |
| From Idea to Advantage, 12 modules | `course-from-idea-to-advantage-01` | 249 | One-time, per learner | **Owner-approved launch price (23 Oct 2026); activation pending payment/release gates** |
| Data Engineering / DP-700-aligned foundations | Verify the exact data-engineering course ID and outcomes before pricing | 499 | One-time, per learner | Assessment/certification-claim review |
| Corporate/school cohorts | Team training, per-client scope | Custom quote | Manual approved agreement only | **No automated group-seat billing** |

**Other prices are catalogue suggestions only; the EC$249 *From Idea to Advantage* introductory offer is owner-approved for the pilot. Approval is for the price, not for charging customers or publishing the course.** Do not migrate existing records, flip `pricingType`, reprice linked website entries, grant access or advertise certification without the appropriate owner/content approvals. “DP-700-aligned” must never imply Microsoft certification or official partnership.

### Segmentation and packaging
- Free: a practical prompt guide + introductory lessons, with explicit newsletter consent and no forced payment; measure guide-to-course transitions.
- Entry EC$99: fast work improvement, 1–2-hour outcome-driven lessons.
- Youth EC$249/299: complete practical self-paced programmes, parent/guardian controls, no automated recurring fees.
- SMB professional EC$249: owner-approved introductory one-time price for *From Idea to Advantage*, with diagnostic, workbook, implementation deliverables and assessed learning; link to Vision79 ICT consultation.
- Technical advanced EC$499: deeper guided projects, hands-on evidence and curriculum review; no job/certification guarantees.
- Corporate: quote separately by cohort size, facilitated time, support and content customisation. Do not give group access automatically on one individual purchase.

### Commercial controls
- Display and store proposed catalogue prices in **XCD**, with `V79_ACADEMY_BILLING_CURRENCY=XCD`. Do not mix USD labels with XCD stored amounts. No exchange conversion is implemented by this proposal.
- Hub WiPay sandbox documentation defaults use **TTD**, not XCD; the sandbox payment form may use the same *number* in a different **test currency**. Clearly label this as a noncommercial test, not a converted XCD checkout. It cannot unlock a course.
- **Before live activation**, obtain written WiPay confirmation of the V79 merchant's country, endpoint, account, transaction/settlement currency, fees and refunds. Hub blocks live source-currency mismatch. If WiPay cannot settle in XCD, design and independently test a signed server-side FX quotation, minor units, fees, receipt and reconciliation contract, rather than relabeling prices or silently converting. No live self-service launch now.
- Keep one-time orders distinct from future recurring memberships; existing `premium` route is one-time, `subscription` is not a recurring checkout. Avoid granting any course through sandbox, redirect or a manually marked UI status.
- Fee and tax treatment: configure actual merchant fees, required taxes, refunds and invoice disclosures after verification; the proposed gross prices are **not** stated net revenue or a tax-inclusive commitment.
- Youth programmes: obtain guardian/age-appropriate account and data permissions, carefully review privacy, peer visibility and certificates before external sale.
- Public availability, pricing, payment access and published course status are **four distinct owner approval gates**.

### Launch experiment (internal first, then separate commercial release)
1. Verify Academy deployed code includes existing signed billing client, the Hub endpoint and the approved price display fix; preserve `data/store.json`, existing user records and rollback image.
2. In isolated test Academy, use one `premium` disposable course priced 99 XCD. Confirm checkout is routed to Hub **sandbox** (provider may show TTD), callback is authenticated, and `SANDBOX_PAYMENT_VERIFIED` **does not** create course ownership. Confirm amount/currency/status are clearly labeled.
3. Repeat with wrong signing secret, foreign learner, foreign course, duplicate callback, expired session and malicious return-path; confirm fail closed without access.
4. Test learner registration, legitimate enrolment and course progress; exercise free courses and membership-gated access separately; no live student PII in test.
5. Once WiPay live country/currency, finance/legal policies, backup/rollback and exact image parity are accepted, propose a separately authorized low-value real payment before allowing paid course sales. Approval of this document alone is **not** approval to go live.
6. Track anonymous aggregate funnel measures weekly: free guide visitors, signups with consent, course-detail viewers, checkout starts, verified purchases, refunds, course completion and real support burden. Test price elasticity after at least 30 relevant course-detail visits and 5 qualified purchase conversations; these are decision thresholds, **not** claims of achieved sales. Avoid invented conversion rates.

### Competitive context (directional, not identical products)
- Satoms shows **XCD $399** for an online IT Network Essentials course in Gros Islet: https://satoms.com/course/it-network-fundamentals/saint-lucia/gros-islet/
- UWI-ROYTEC/CaribbeanAIM lists a **TT$1,500**, 12-contact-hour *live* AI Foundations course, a different format and currency: https://caribbeanaim.com/
- PC Clinic Academy lists a **US$135** 90-minute *live* AI Essentials class: https://www.pcclinictt.com/pc-clinic-academy/
- WiPay's current country sandbox hosts and merchant requirements: https://docs.wipayfinancial.com/platforms-and-environments

These offer rough market positioning, not evidence that Vision79 customers will pay the proposed amounts. Do not convert TT$/US$ benchmarks into XCD without a sourced exchange rate.

### Existing integration and release notes
- Academy: `src/lib/billingClient.ts`, `V79_HUB_BILLING_URL`, `V79_ACADEMY_BILLING_SECRET`, `V79_ACADEMY_BILLING_CURRENCY=XCD`.
- Hub: `server.ts` internal billing routes and `server/wipay-provider.mjs` hold WiPay key/account/return verification. Hub callback return origin should be `https://academy.v79sl.com` via `ACADEMY_PUBLIC_URL` (legacy `v79academy.v79sl.com` in older runbooks is outdated).
- The current UI candidate makes `premium` selectable for one-time purchase, corrects misleading USD/fallback displays, and labels sandbox testing. This proposal **does not** edit any merchant settings, course database, prices, permissions, store, deployment, WiPay environment or customer data.
- Owner states Marketing currently has no provider account limit. Earlier failed provider deliveries must remain historical evidence, not be automatically retried.
