import assert from 'node:assert/strict';
import {breakEvenModel} from './businessMath';
const sample=breakEvenModel({price:100,variableCost:60,fixedCosts:4000,capacity:80});
assert.deepEqual(sample,{unitContribution:40,contributionRatio:0.4,breakEvenUnits:100,resultAtCapacity:-800,reachesBreakEven:false});
assert.equal(breakEvenModel({price:100,variableCost:64,fixedCosts:4000,capacity:80}).breakEvenUnits,112);
assert.equal(breakEvenModel({price:250,variableCost:160,fixedCosts:5400,capacity:24}).breakEvenUnits,60);
assert.equal(breakEvenModel({price:0,variableCost:10,fixedCosts:100,capacity:5}).breakEvenUnits,null);
assert.equal(breakEvenModel({price:100,variableCost:100,fixedCosts:0,capacity:5}).breakEvenUnits,0);
assert.equal(breakEvenModel({price:1,variableCost:2,fixedCosts:0,capacity:5}).breakEvenUnits,0);
assert.equal(breakEvenModel({price:1,variableCost:2,fixedCosts:0,capacity:5}).reachesBreakEven,false);
assert.equal(breakEvenModel({price:0.3,variableCost:0.2,fixedCosts:0.3,capacity:3}).resultAtCapacity,0);
for(const value of [NaN,Infinity,-1,1.001,1_000_001])assert.throws(()=>breakEvenModel({price:value,variableCost:0,fixedCosts:1,capacity:1}));
assert.throws(()=>breakEvenModel({price:1,variableCost:0,fixedCosts:1,capacity:0.5}));
// Independent whole-unit property: the first feasible count covers cost, one less does not.
for(const price of [1.99,100,250])for(const variableCost of [0,0.25,1.98])for(const fixedCosts of [0,1,4000]){
 const r=breakEvenModel({price,variableCost,fixedCosts,capacity:100});
 const n=r.breakEvenUnits!;const c=Math.round(price*100)-Math.round(variableCost*100),f=Math.round(fixedCosts*100);
 assert.ok(n*c>=f);if(n>0)assert.ok((n-1)*c<f);
}
console.log('Business model fixtures, monetary validation, no-contribution cases and whole-unit boundaries passed.');
