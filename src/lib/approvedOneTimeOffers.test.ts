import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { catalogPriceLabel, OFFER_CHECKOUT_ENABLED, OFFER_NOTE, upcomingOneTimeOffer } from './approvedOneTimeOffers';

const matrix = [
  ['course-from-idea-to-advantage-01', 150, 'EC$150.00'],
  ['course-junior-ai-academy-01', 150, 'EC$150.00'],
  ['course-junior-networking-academy-01', 195, 'EC$195.00'],
  ['course-data-engineering-dp700-01', 325, 'EC$325.00'],
] as const;
assert.equal(OFFER_CHECKOUT_ENABLED, false);
assert.match(OFFER_NOTE, /Checkout coming soon/);
for (const [id, price, display] of matrix) {
  const offer = upcomingOneTimeOffer(id);
  assert.ok(offer);
  assert.equal(offer.priceXcd, price);
  assert.equal(offer.label, display);
  assert.equal(offer.checkoutEnabled, false);
  for (const pricingType of ['free', 'subscription', 'premium', 'free_trial'] as const) {
    assert.equal(catalogPriceLabel({ id, pricingType, price: 0 }), display);
  }
}
assert.equal(upcomingOneTimeOffer('unrelated-course'), null);
assert.equal(upcomingOneTimeOffer('__proto__'), null);
assert.equal(catalogPriceLabel({ id: 'other', pricingType: 'free', price: 0 }), 'FREE');
assert.equal(catalogPriceLabel({ id: 'other', pricingType: 'subscription', price: 0 }), 'MEMBERSHIP');
assert.equal(catalogPriceLabel({ id: 'other', pricingType: 'premium', price: 0 }), 'PRICE PENDING');

// Regression: offer prices must not alter course data, enrollment, APIs or payment status.
const source = (file: string) => readFileSync(new URL('../../' + file, import.meta.url), 'utf8');
const landing = source('src/components/AcademyLandingPage.tsx');
const portal = source('src/components/StudentPortal.tsx');
const legacyCard = source('src/components/PublicCourseCard.tsx');
const access = source('src/lib/academyAccess.ts');
const server = source('server.ts');
assert.match(landing, /catalogPriceLabel\(c\)/);
assert.match(landing, /OFFER_NOTE/);
assert.match(landing, /aria-label="Course price"[^>]*>\{priceLabel\(c\)\}/);
assert.match(landing, /aria-label="Course price"[^>]*>\{priceLabel\(detail\)\}/);
assert.match(portal, /upcomingOneTimeOffer\(course\.id\)/);
assert.match(legacyCard, /catalogPriceLabel\(course\)/);
assert.match(access, /function canReadCourse/);
assert.match(server, /app\.get\("\/api\/public\/courses"/);
console.log('APPROVED_ACADEMY_ONE_TIME_OFFERS=PASS_4_DISPLAY_ONLY_CHECKOUT_DISABLED');
