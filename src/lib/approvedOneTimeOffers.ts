import type { Course } from '../types';
import { coursePriceDisplay } from './coursePriceDisplay';

/** Founder-approved XCD one-time offer catalogue (not an order or entitlement ledger).
 * Never substitute these future offer prices into the existing pricingType/price
 * fields: enrolled users keep their current access until a separate paid rollout.
 */
const ONE_TIME_OFFERS_XCD = Object.freeze({
  'course-from-idea-to-advantage-01': 150,
  'course-junior-ai-academy-01': 150,
  'course-junior-networking-academy-01': 195,
  'course-data-engineering-dp700-01': 325,
} as const);

export const OFFER_CHECKOUT_ENABLED = false as const;
export const OFFER_NOTE = 'One-time price · Checkout coming soon. Current access unchanged.';

type CourseOffer = Readonly<{ priceXcd: number; label: string; checkoutEnabled: false }>;

export function upcomingOneTimeOffer(courseId: string): CourseOffer | null {
  if (!Object.prototype.hasOwnProperty.call(ONE_TIME_OFFERS_XCD, courseId)) return null;
  const priceXcd = ONE_TIME_OFFERS_XCD[courseId as keyof typeof ONE_TIME_OFFERS_XCD];
  return Object.freeze({
    priceXcd,
    label: 'EC$' + new Intl.NumberFormat('en-LC', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(priceXcd),
    checkoutEnabled: OFFER_CHECKOUT_ENABLED,
  });
}

/** The display may advertise an upcoming offer, never silently grant paid access. */
export function catalogPriceLabel(course: Pick<Course, 'id' | 'pricingType' | 'price'>): string {
  return upcomingOneTimeOffer(course.id)?.label || coursePriceDisplay(course);
}
