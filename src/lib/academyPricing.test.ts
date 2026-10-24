import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publicCoursePrice } from './academyPricing';

const testCourse = (pricingType: 'premium' | 'free' | 'subscription' | 'free_trial', price: number) => ({ pricingType, price });

const oneTime = publicCoursePrice(testCourse('premium', 249));
assert.equal(oneTime.isPaid, true);
assert.equal(oneTime.purchaseReady, true);
assert.equal(oneTime.priceDisplay, 'EC$249.00');
assert.equal(publicCoursePrice(testCourse('premium', 1000.5)).priceDisplay, 'EC$1,000.50');
assert.notEqual(oneTime.priceDisplay, '$49.99');

const zeroPrice = publicCoursePrice(testCourse('premium', 0));
assert.deepEqual(zeroPrice, { isPaid: true, purchaseReady: false, priceDisplay: 'PRICE PENDING' });

const invalidPrice = publicCoursePrice(testCourse('premium', Number.NaN));
assert.equal(invalidPrice.priceDisplay, 'PRICE PENDING');
assert.equal(invalidPrice.purchaseReady, false);

assert.deepEqual(publicCoursePrice(testCourse('subscription', 399)),
  { isPaid: true, purchaseReady: false, priceDisplay: 'MEMBERSHIP' });
assert.deepEqual(publicCoursePrice(testCourse('free_trial', 0)),
  { isPaid: true, purchaseReady: false, priceDisplay: 'MEMBERSHIP' });
assert.deepEqual(publicCoursePrice(testCourse('free', 499)),
  { isPaid: false, purchaseReady: false, priceDisplay: 'FREE' });

const read = (p: string) => readFileSync(new URL('../../' + p, import.meta.url), 'utf8');
const editor = read('src/components/CourseEditor.tsx');
const card = read('src/components/PublicCourseCard.tsx');
const liveCatalogue = read('src/components/AcademyLandingPage.tsx');
const portal = read('src/components/StudentPortal.tsx');
const billingClient = read('src/lib/billingClient.ts');

assert.match(editor, /<option value="premium">One-time course purchase/);
assert.match(editor, /Price \(XCD \/ EC\$\)/);
assert.doesNotMatch(editor, /Price \(USD\)/);
assert.match(card, /publicCoursePrice\(course\)/);
assert.doesNotMatch(card, /49\.99/);
// Regression: App.tsx renders AcademyLandingPage, not PublicCourseCard.
assert.match(liveCatalogue, /import \{ publicCoursePrice \} from '\.\.\/lib\/academyPricing'/);
assert.match(liveCatalogue, /aria-label="Course price"[^>]*>\{priceLabel\(c\)\}/);
assert.match(liveCatalogue, /aria-label="Course price"[^>]*>\{priceLabel\(detail\)\}/);
assert.match(liveCatalogue, /c\.pricingType === 'premium'/);
assert.doesNotMatch(liveCatalogue, /\$49\.99|Academy subscription/);
assert.match(portal, /publicCoursePrice\(course\)\.priceDisplay/);
assert.doesNotMatch(portal, /new Intl\.NumberFormat\('en-LC', \{ style: 'currency'/);
assert.match(portal, /Open WiPay sandbox test \(no course access\)/);
assert.match(portal, /test checkout currency may differ/);
assert.match(billingClient, /V79_HUB_BILLING_URL/);
assert.match(billingClient, /V79_ACADEMY_BILLING_SECRET/);
assert.doesNotMatch(billingClient, /WIPAY_API_KEY|WIPAY_ACCOUNT_NUMBER/);
console.log('PASS: truthful XCD one-time and membership prices; Hub-only WiPay credentials; sandbox clarity');
