import React,{useState} from 'react';
import {breakEvenModel} from '../lib/businessMath';

export function BusinessFinanceLab(){
 const initial={price:'100',variableCost:'60',fixedCosts:'4000',capacity:'80'};
 const [values,setValues]=useState(initial);
 let result:ReturnType<typeof breakEvenModel>|null=null,error='';
 try{if(Object.values(values).some(v=>String(v).trim()===''))throw Error('Complete all four fields.');result=breakEvenModel({price:Number(values.price),variableCost:Number(values.variableCost),fixedCosts:Number(values.fixedCosts),capacity:Number(values.capacity)});}catch(e:any){error=e.message;}
 const money=(n:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'XCD'}).format(n);
 return <section className="study-lab" aria-label="Break-even learning calculator">
  <h3>Test price, costs and capacity</h3>
  <p>Illustrative monthly single-offer model. Use consistent units. All money is XCD; these inputs are teaching data, not a price recommendation.</p>
  <div className="study-fields">{([['price','Price per unit'],['variableCost','Variable cost per unit'],['fixedCosts','Monthly fixed costs'],['capacity','Monthly capacity in whole units']] as const).map(([key,label])=><label key={key}>{label}<input type="number" min="0" max="1000000" step={key==='capacity'?'1':'0.01'} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}</div>
  {error?<p role="status">{error}</p>:result&&<>
   <p role="status">{result.unitContribution<=0 ? (result.breakEvenUnits===null?'Positive fixed costs cannot be covered by a zero or negative unit contribution.':'With no fixed costs, zero activity breaks even. Zero contribution never creates profit; negative contribution makes each additional unit a loss.') : `Break-even: ${result.breakEvenUnits!.toLocaleString('en-GB')} whole units. ${result.reachesBreakEven?'Capacity can reach that volume; demand still needs evidence.':'The stated capacity is below break-even.'}`}</p>
   <div className="study-table-wrap"><table><caption>Calculated results for the entered assumptions</caption><tbody>
    <tr><th scope="row">Contribution per unit</th><td>{money(result.unitContribution)}</td></tr>
    <tr><th scope="row">Contribution ratio</th><td>{result.contributionRatio===null?'Undefined at a zero selling price':`${(100*result.contributionRatio).toFixed(2)}%`}</td></tr>
    <tr><th scope="row">Result at stated capacity</th><td>{money(result.resultAtCapacity)}</td></tr>
   </tbody></table></div>
  </>}
  <button className="study-secondary" type="button" onClick={()=>setValues(initial)}>Reset teaching example</button>
  <p>Change only one driver at a time, predict the effect, then explain the result in your notes. Fixed costs and variable costs are different classifications from direct and indirect costs. Avoid counting the same salary twice. The model assumes constant unit price/cost within the stated range and excludes unlisted tax, finance and cash-timing effects.</p>
 </section>;
}
