import fs from 'node:fs';
import { BUSINESS_VISUALS } from '../src/data/businessVisuals';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const dir='public/idea-to-advantage/images';fs.mkdirSync(dir,{recursive:true});
for(const [number,visual] of Object.entries(BUSINESS_VISUALS)){
 let drawing='';
 if(number==='1')drawing=visual.labels.map((label,i)=>`<text x="36" y="${130+i*48}" font-size="21">${escape(label)}</text><rect x="280" y="${110+i*48}" width="${(i===0?40:80)*6}" height="28" rx="4" fill="${i===0?'#8a471e':'#08796f'}"/>`).join('');
 else if(number==='3'){
  const x=(n:number)=>90+n/120*700,y=(n:number)=>470-n/12000*320;
  drawing='<path d="M90 150V470H790" fill="none" stroke="#47615a" stroke-width="2"/>';
  for(const q of [0,40,80,100,120])drawing+=`<text x="${x(q)}" y="502" text-anchor="middle" font-size="20">${q}</text>`;
  for(const value of [0,4000,8000,12000])drawing+=`<text x="78" y="${y(value)+6}" text-anchor="end" font-size="18">${value}</text>`;
  drawing+=`<path d="M${x(0)} ${y(0)} L${x(120)} ${y(12000)}" fill="none" stroke="#08796f" stroke-width="4"/><path d="M${x(0)} ${y(4000)} L${x(120)} ${y(11200)}" fill="none" stroke="#305b98" stroke-width="4"/><circle cx="${x(100)}" cy="${y(10000)}" r="6" fill="#193d35"/><text x="440" y="548" text-anchor="middle" font-size="22">Monthly units</text><text x="40" y="110" font-size="18">XCD</text><text x="280" y="110" fill="#08796f" font-size="20">Revenue</text><text x="480" y="110" fill="#305b98" font-size="20">Total listed cost</text>`;
 } else drawing=visual.labels.map((label,i)=>{
  const x=i===0||i===3?40:465,y=i<2?130:350;
  return `<rect x="${x}" y="${y}" width="395" height="130" rx="14" fill="#edf4ef" stroke="#b0c4b8"/><text x="${x+22}" y="${y+39}" font-size="17" fill="#46655b">STEP ${i+1}</text><text x="${x+22}" y="${y+83}" font-size="21">${escape(label)}</text>`;
 }).join('')+'<path d="M438 195H460M660 268V340M457 415H440" fill="none" stroke="#08796f" stroke-width="3" marker-end="url(#arrow)"/>';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 610" role="img" aria-labelledby="title desc"><title id="title">${escape(visual.title)}</title><desc id="desc">${escape(visual.caption)}</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#08796f"/></marker></defs><rect width="900" height="610" fill="#fff"/><g fill="#193d35" font-family="Arial, sans-serif"><text x="36" y="54" font-size="27" font-weight="700">${escape(visual.title)}</text><text x="36" y="584" font-size="16">V79 Academy · Teaching example · Text explanation and data accompany this visual</text>${drawing}</g></svg>\n`;
 fs.writeFileSync(`${dir}/study-module-${number}.svg`,svg);
}
console.log('Generated 12 precise business learning visuals; all illustrative data have text alternatives.');
