/** Pure Academy monthly-membership policy. This does not charge customers or enable checkout. */
export const ACADEMY_MONTHLY_PLAN = 'academy-monthly-v1';
export const ACADEMY_MONTHLY_PRICES = Object.freeze({ USD: 35, XCD: 94 });

export type Currency = keyof typeof ACADEMY_MONTHLY_PRICES;
export interface Membership {
  id: string;
  membershipStatus?: string;
  membershipExpiresAt?: string | null;
  nonRenewalRequestedAt?: string | null;
  paidMembershipReceipts?: Array<{ orderId: string; transactionId: string; expiresAt: string }>;
}
export interface VerifiedPaidOrder {
  id: string; transactionId: string; status: string;
  sourceApp: string; kind: string; externalReference: string; subjectReference: string;
  providerEnvironment: string; amount: number; currency: string; paidAt: string;
}
export function monthlyPrice(currency: string) {
  if (currency !== 'USD' && currency !== 'XCD') throw new Error('Unsupported currency');
  return { planId: ACADEMY_MONTHLY_PLAN, amount: ACADEMY_MONTHLY_PRICES[currency], currency, automaticRenewal: false };
}
export function nextCalendarMonth(iso: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid membership date');
  const y = date.getUTCFullYear(), m = date.getUTCMonth();
  const lastDay = new Date(Date.UTC(y, m + 2, 0)).getUTCDate();
  return new Date(Date.UTC(y, m + 1, Math.min(date.getUTCDate(), lastDay),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())).toISOString();
}
/**
 * Accept only server-verified LIVE Hub payment details; never browser-supplied
 * status. The integration must serialize updates and persist receipt + expiry
 * atomically before responding. Replays never grant additional months.
 */
export function grantVerifiedMonth<T extends Membership>(learner: T, order: VerifiedPaidOrder, nowIso: string):
  { learner: T; applied: boolean } {
  const now = Date.parse(nowIso), paidAt = Date.parse(order?.paidAt);
  if (!learner || !Number.isFinite(now) || !Number.isFinite(paidAt) || paidAt > now + 300000)
    throw new Error('Invalid payment context');
  const quote = monthlyPrice(order.currency);
  if (order.status !== 'paid' || order.sourceApp !== 'academy' || order.kind !== 'membership' ||
      order.externalReference !== ACADEMY_MONTHLY_PLAN || order.subjectReference !== learner.id ||
      order.providerEnvironment !== 'live' || order.amount !== quote.amount ||
      !/^v79_[A-Za-z0-9_]{6,60}$/.test(order.id) ||
      !/^[A-Za-z0-9_-]{6,160}$/.test(order.transactionId))
    throw new Error('Verified live membership payment required');
  const receipts = learner.paidMembershipReceipts || [];
  if (receipts.some(p => p.orderId === order.id)) return { learner, applied: false };
  if (receipts.some(p => p.transactionId === order.transactionId))
    throw new Error('Duplicate merchant transaction');
  const previous = learner.membershipStatus === 'active' ? Date.parse(learner.membershipExpiresAt || '') : NaN;
  const base = new Date(Math.max(now, paidAt, Number.isFinite(previous) ? previous : 0)).toISOString();
  const expiresAt = nextCalendarMonth(base);
  return {
    learner: { ...learner, membershipStatus: 'active', membershipExpiresAt: expiresAt,
      paidMembershipReceipts: [...receipts, { orderId: order.id, transactionId: order.transactionId, expiresAt }] },
    applied: true,
  };
}
/** Non-renewal never removes paid access; expiry is the only access boundary. */
export function recordNonRenewal<T extends Membership>(learner: T, nowIso: string): T {
  if (!Number.isFinite(Date.parse(nowIso))) throw new Error('Invalid cancellation time');
  return { ...learner, nonRenewalRequestedAt: learner.nonRenewalRequestedAt || new Date(nowIso).toISOString() };
}
