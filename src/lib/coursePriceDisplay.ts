import type { Course } from '../types';

type PricedCourse = Pick<Course, 'pricingType' | 'price'>;

/** Read-only label: never creates an order, changes access, or guesses a price. */
export function coursePriceDisplay(course: PricedCourse): string {
  if (course.pricingType === 'premium') {
    const amount = course.price;
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return 'PRICE PENDING';
    }
    return 'EC$' + new Intl.NumberFormat('en-LC', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  if (course.pricingType === 'subscription' || course.pricingType === 'free_trial') {
    return 'MEMBERSHIP';
  }
  return 'FREE';
}
