import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coursePriceDisplay } from './coursePriceDisplay';

type PriceType = 'free' | 'free_trial' | 'premium' | 'subscription';
const price = (pricingType: PriceType, amount: number) =>
  coursePriceDisplay({ pricingType, price: amount });

assert.equal(price('premium', 249), 'EC$249.00');
assert.equal(price('premium', 1000.5), 'EC$1,000.50');
for (const missing of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
  assert.equal(price('premium', missing), 'PRICE PENDING');
}
assert.equal(price('subscription', 349), 'MEMBERSHIP');
assert.equal(price('free_trial', 0), 'MEMBERSHIP');
assert.equal(price('free', 499), 'FREE');

const source = (file: string) =>
  readFileSync(new URL('../../' + file, import.meta.url), 'utf8');
const app = source('src/App.tsx');
const page = source('src/components/AcademyLandingPage.tsx');
const card = source('src/components/PublicCourseCard.tsx');
const portal = source('src/components/StudentPortal.tsx');
assert.match(app, /AcademyLandingPage/);
assert.match(page, /coursePriceDisplay\(c\)/);
assert.match(page, /aria-label="Course price"[^>]*>\{priceLabel\(c\)\}/);
assert.match(page, /aria-label="Course price"[^>]*>\{priceLabel\(detail\)\}/);
assert.match(card, /coursePriceDisplay\(course\)/);
assert.match(portal, /coursePriceDisplay\(course\)/);
assert.doesNotMatch(card, /49\.99/);
assert.doesNotMatch(page, /Academy subscription/);
console.log('PASS: real catalogue, course details, cards and classroom show truthful EC$ or explicit access labels');
