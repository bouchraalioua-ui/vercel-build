/** CloudMargin analytical engine. All input operating records are fictional. */
export const REPORTING_MONTH = '2026-09';
export const COMPARISON_MONTH = '2026-08';
export const sourceLinks = [
  {name:'Ship 2026: Agentic infrastructure',date:'Oct 15, 2026',url:'https://vercel.com/blog/vercel-ship-2026-recap',metric:'28×',label:'Growth in agent-triggered deployments, trailing year'},
  {name:'October AI Gateway Production Index',date:'Oct 15, 2026',url:'https://vercel.com/blog/ai-gateway-production-index-october-2026',metric:'13×',label:'September gateway spend vs. previous December'},
  {name:'October AI Gateway Production Index',date:'Oct 15, 2026',url:'https://vercel.com/blog/ai-gateway-production-index-october-2026',metric:'−47%',label:'Change in average price per token vs. December'},
  {name:'October AI Gateway Production Index',date:'Oct 15, 2026',url:'https://vercel.com/blog/ai-gateway-production-index-october-2026',metric:'71.5%',label:'Open-weight share of tokens (23% of spend)'},
  {name:'Vercel for Enterprise',date:'Oct 15, 2026',url:'https://vercel.com/blog/vercel-for-enterprise',metric:'4×',label:'Enterprise AI Gateway token growth in 3 months'},
  {name:'How AI Gateway runs on Fluid',date:'Nov 6, 2025',url:'https://vercel.com/blog/how-ai-gateway-runs-on-fluid-compute',metric:'<8%',label:'CPU work share of runtime in historical case study'}
];
export const n = v => Number(v || 0);
export const sum = (rows, key) => rows.reduce((t,r)=>t+n(r[key]),0);
export function filterRecords(records,month,segment='All',workload='All') {
 return records.filter(r=>r.month===month && (segment==='All'||r.segment===segment) && (workload==='All'||r.workload===workload));
}
export function aggregate(rows) {
 const usage=sum(rows,'usage_units'),revenue=sum(rows,'revenue_usd'),cost=sum(rows,'infrastructure_cost_usd');
 return {usage,revenue,cost,profit:revenue-cost,margin:revenue?(revenue-cost)/revenue:0,unitCost:usage?cost/usage:0};
}
export function decompose(current,previous){
 const c=aggregate(current),p=aggregate(previous);
 const volume=(c.usage-p.usage)*p.unitCost;
 const rate=c.usage*(c.unitCost-p.unitCost);
 return {volume,rate,delta:c.cost-p.cost,reconciliationError:volume+rate-(c.cost-p.cost),current:c,prior:p};
}
export function cacheEligible(rows){return rows.reduce((v,r)=>v+n(r.infrastructure_cost_usd)*n(r.cache_eligible_share),0);}
export function gatewayEconomics(rows,{cacheHit=60,routable=25,routingSave=20,monthlyOverhead=150,implementation=3000}={}){
 const base=aggregate(rows),eligible=cacheEligible(rows),cacheSaving=eligible*cacheHit/100;
 const remaining=Math.max(0,base.cost-cacheSaving);
 const routingSaving=remaining*routable/100*routingSave/100;
 const gross=cacheSaving+routingSaving,net=gross-monthlyOverhead;
 return {base,eligible,cacheSaving,routingSaving,gross,net,year1:12*net-implementation,payback:net>0?implementation/net:null,
 afterCost:Math.max(0,base.cost-gross),afterMargin:base.revenue?(base.revenue-base.cost+gross-monthlyOverhead)/base.revenue:0,
 // First-year net break-even cache effectiveness with routing held fixed; useful as sensitivity, not exact solved IRR.
 firstYearBreakevenGross:monthlyOverhead+implementation/12};
}
export function forecast(base,{humanGrowth=4,agentGrowth=10,agentMix=50,priceDecline=3,passThrough=35,providerCostShare=75,fluidEfficiency=1}={}){
 const rows=[];
 for(let t=0;t<=12;t++){
  const agent=agentMix/100;
  const demand=(1-agent)*Math.pow(1+humanGrowth/100,t)+agent*Math.pow(1+agentGrowth/100,t);
  const revenue=base.revenue*demand*Math.pow(1-(priceDecline/100)*(passThrough/100),t);
  const providerCost=base.cost*(providerCostShare/100)*demand*Math.pow(1-priceDecline/100,t);
  const platformCost=base.cost*(1-providerCostShare/100)*demand*Math.pow(1-fluidEfficiency/100,t);
  const cost=providerCost+platformCost;
  const dt=new Date(Date.UTC(2026,8+t,1));
  rows.push({month:dt.toLocaleString('en-US',{month:'short',timeZone:'UTC'}),year:dt.getUTCFullYear(),t,demand,usage:base.usage*demand,revenue,cost,providerCost,platformCost,profit:revenue-cost,margin:revenue?(revenue-cost)/revenue:0});
 }
 const forward=rows.slice(1),start=rows[0],end=rows[12];
 return {rows,start,end,yearRevenue:sum(forward,'revenue'),yearCost:sum(forward,'cost'),yearProfit:sum(forward,'profit'),
 yoyRunRateRevenue:end.revenue/start.revenue-1,yoyRunRateCost:end.cost/start.cost-1};
}
export function computeEconomics({monthlyRequests=285674,avgSeconds=4.2,activePct=8,concurrency=12,cpuRate=0.18,memoryRate=0.012,gbPerTask=1}={}){
 const workloadHours=monthlyRequests*avgSeconds/3600,activeHours=workloadHours*activePct/100;
 const memoryHours=workloadHours/Math.max(1,concurrency)*gbPerTask;
 const activeCpuCost=activeHours*cpuRate,comparisonCpuCost=workloadHours*cpuRate, memoryCost=memoryHours*memoryRate;
 return {workloadHours,activeHours,memoryHours,activeCpuCost,comparisonCpuCost,memoryCost,
 fluidCost:activeCpuCost+memoryCost,comparisonCost:comparisonCpuCost+memoryCost,
 modeledSavings:comparisonCpuCost-activeCpuCost,
 improvement:comparisonCpuCost+memoryCost>0?(comparisonCpuCost-activeCpuCost)/(comparisonCpuCost+memoryCost):0};
}
export function capitalAllocation(eligible,{horizon=36,discount=12,buildEff=65,buyEff=80,buildUp=5000,buyUp=8500,buildOp=150,buyOp=350,buildLag=2,buyLag=1,buildRealization=85,buyRealization=92}={}) {
 const options=[{id:'build',label:'Build internally',effect:buildEff/100,up:buildUp,op:buildOp,lag:buildLag,realization:buildRealization/100},
 {id:'buy',label:'Buy a routing solution',effect:buyEff/100,up:buyUp,op:buyOp,lag:buyLag,realization:buyRealization/100}];
 const monthRate=Math.pow(1+discount/100,1/12)-1;
 return options.map(o=>{
  let undiscounted=-o.up,npv=-o.up,cumulative=-o.up,payback=null;
  const cashflows=[-o.up];
  for(let t=1;t<=horizon;t++){
   const cash=t>o.lag?eligible*o.effect*o.realization-o.op:0;
   undiscounted+=cash;npv+=cash/Math.pow(1+monthRate,t);cumulative+=cash;cashflows.push(cash);
   if(payback===null&&cumulative>=0)payback=t;
  }
  return {...o,monthlyNet:eligible*o.effect*o.realization-o.op,npv,undiscounted,payback,cashflows};
 });
}
export function customerWatch(records,month=REPORTING_MONTH,previous=COMPARISON_MONTH,segment='All',cap=250,alertPct=25){
 const current=filterRecords(records,month,segment,'AI inference'),prior=filterRecords(records,previous,segment,'AI inference');
 const map=new Map(prior.map(r=>[r.customer_id,r]));
 return current.map(r=>{
  const p=map.get(r.customer_id),cost=n(r.infrastructure_cost_usd),last=p?n(p.infrastructure_cost_usd):0;
  const delta=last?(cost-last)/last:0;
  return {id:r.customer_id,segment:r.segment,cost,previous:last,delta,revenue:n(r.revenue_usd),margin:r.revenue_usd?(r.revenue_usd-cost)/r.revenue_usd:0,
  status:cost>cap?'Over cap':delta>alertPct/100?'Spend spike':'In range'};
 }).sort((a,b)=>b.cost-a.cost);
}
