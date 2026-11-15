# Academy monthly membership - staged contract, NOT deployed

Approved pricing: US$35 or EC$94 per calendar month, access to all membership courses, cancellation or non-renewal at any time with access retained through the paid expiry.

Options considered: (1) automatic provider recurring collection; (2) prepaid calendar-month passes through Hub billing; (3) manual admin-granted memberships. Recommend the existing signed Hub billing service for verified prepaid passes as an interim, while retaining manual access and waiting for provider-supported recurring billing. Do not mislabel prepaid access as automatic recurring billing.

Red-team finding: Hub WiPay was sandbox TTD while Academy was XCD on 15 November 2026. Hub accepts only Academy course orders, not membership orders. No real payments or recurring checkout until merchant certification, correct live currency, signed membership order support, authoritative provider status, atomic receipt storage, and verified cancellation mechanism.

Staged monthlyMembershipPolicy.ts contains pure business rules only: exact USD/XCD prices, UTC calendar-month rollover, learner binding, live-paid-only verification, tamper/replay prevention, preserved course progress, preserved non-renewal preferences, and access until expiry. Policy cannot authenticate payment independently: callers must use signed Hub server order status, never browser data.

Before integration: approve merchant/provider and currency; implement Hub signed membership orders and idempotent paid status; enforce atomic learner saves and merchant transaction uniqueness; run negative and tenant checks on staging; review payment webhooks and expiry; deploy with encrypted rollback. This draft does not create subscriptions or charges.
