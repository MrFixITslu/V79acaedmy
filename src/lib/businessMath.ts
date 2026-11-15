export type BusinessModel = { price: number; variableCost: number; fixedCosts: number; capacity: number };

export function breakEvenModel(input: BusinessModel) {
  for (const key of ['price','variableCost','fixedCosts'] as const) {
    const value=input[key];
    if (!Number.isFinite(value) || value<0 || value>1_000_000 || Math.abs(value*100-Math.round(value*100))>0.000001) {
      throw new Error('Enter money values from 0 to 1,000,000 with no more than two decimal places.');
    }
  }
  if (!Number.isInteger(input.capacity) || input.capacity<0 || input.capacity>1_000_000) throw new Error('Capacity must be a whole number from 0 to 1,000,000.');
  const price=Math.round(input.price*100), variable=Math.round(input.variableCost*100), fixed=Math.round(input.fixedCosts*100);
  const contribution=price-variable;
  const breakEvenUnits=fixed===0 ? 0 : contribution>0 ? Math.ceil(fixed/contribution) : null;
  return { unitContribution:contribution/100, contributionRatio:price>0 ? contribution/price : null,
    breakEvenUnits, resultAtCapacity:(input.capacity*contribution-fixed)/100,
    reachesBreakEven:input.capacity*contribution-fixed>=0 };
}
