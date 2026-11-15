import assert from 'node:assert/strict';
import {ACADEMY_MONTHLY_PLAN, monthlyPrice, nextCalendarMonth, grantVerifiedMonth, recordNonRenewal} from './monthlyMembershipPolicy';
const now = '2026-11-15T15:00:00.000Z';
const receipt = { id:'v79_receipt_12345678', transactionId:'wipay-test-12345',
 status:'paid', sourceApp:'academy', kind:'membership', externalReference:ACADEMY_MONTHLY_PLAN,
 subjectReference:'learner-a', providerEnvironment:'live', amount:94, currency:'XCD', paidAt:now };
const learner = {id:'learner-a', membershipStatus:'inactive', membershipExpiresAt:null, nonRenewalRequestedAt:null as string | null, courseProgress:{saved:1}};
assert.deepEqual(monthlyPrice('USD'), {planId:ACADEMY_MONTHLY_PLAN, amount:35, currency:'USD',automaticRenewal:false});
assert.deepEqual(monthlyPrice('XCD'), {planId:ACADEMY_MONTHLY_PLAN, amount:94,currency:'XCD',automaticRenewal:false});
assert.throws(() => monthlyPrice('TTD'));
assert.equal(nextCalendarMonth('2027-01-31T08:10:00.000Z'),'2027-02-28T08:10:00.000Z');
assert.equal(nextCalendarMonth('2028-01-31T08:10:00.000Z'),'2028-02-29T08:10:00.000Z');
const granted=grantVerifiedMonth(learner,receipt,now);
assert.equal(granted.applied,true);
assert.equal(granted.learner.membershipExpiresAt,'2026-12-15T15:00:00.000Z');
assert.equal(learner.membershipStatus,'inactive');
assert.deepEqual(granted.learner.courseProgress,{saved:1});
const cancelled=recordNonRenewal(granted.learner,'2026-11-20T12:00:00.000Z');
assert.equal(cancelled.membershipExpiresAt,granted.learner.membershipExpiresAt);
assert.equal(cancelled.nonRenewalRequestedAt,'2026-11-20T12:00:00.000Z');
assert.equal(recordNonRenewal(cancelled,now).nonRenewalRequestedAt,cancelled.nonRenewalRequestedAt);
assert.equal(grantVerifiedMonth(cancelled,receipt,now).applied,false);
const second=grantVerifiedMonth(cancelled,{...receipt,id:'v79_receipt_12345679',transactionId:'wipay-test-12346'},now);
assert.equal(second.learner.membershipExpiresAt,'2027-01-15T15:00:00.000Z');
assert.equal(second.learner.nonRenewalRequestedAt,cancelled.nonRenewalRequestedAt);
for(const change of [
 {status:'pending'}, {status:'refunded'}, {providerEnvironment:'sandbox'},
 {sourceApp:'tiquet'}, {kind:'course'}, {externalReference:'other-month'},
 {subjectReference:'learner-b'}, {amount:95}, {currency:'USD',amount:94},
 {id:'not-an-order'}, {transactionId:''}, {paidAt:'2027-01-01T00:00:00.000Z'}
])assert.throws(() => grantVerifiedMonth(learner,{...receipt,...change},now),
  'Unexpected grant: '+JSON.stringify(change));
assert.throws(() => grantVerifiedMonth(cancelled,{...receipt,id:'v79_receipt_12345680'},now),/Duplicate merchant transaction/);
console.log('MONTHLY_MEMBERSHIP_POLICY_NEGATIVE_AND_HAPPY_PATH=PASS');
