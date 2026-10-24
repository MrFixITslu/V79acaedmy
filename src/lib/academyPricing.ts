import type { Course } from '../types';

type CoursePricing = Pick<Course, 'pricingType' | 'price'>;

/** A presentation contract only. Never computes order amounts or grants access. */
export function publicCoursePrice(course: CoursePricing) {
  if (course.pricingType === 'premium') {
    const price = Number(course.price);
    const purchaseReady = Number.isFinite(price) && price > 0;
    return {
      isPaid: true,
      purchaseReady,
      priceDisplay: purchaseReady
        ? 'EC
        : 'PRICE PENDING',
    };
  }
  if (course.pricingType === 'subscription' || course.pricingType === 'free_trial') {
    return { isPaid: true, purchaseReady: false, priceDisplay: 'MEMBERSHIP' };
  }
  return { isPaid: false, purchaseReady: false, priceDisplay: 'FREE' };
}
 + new Intl.NumberFormat('en-LC', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
        : 'PRICE PENDING',
    };
  }
  if (course.pricingType === 'subscription' || course.pricingType === 'free_trial') {
    return { isPaid: true, purchaseReady: false, priceDisplay: 'MEMBERSHIP' };
  }
  return { isPaid: false, purchaseReady: false, priceDisplay: 'FREE' };
}
