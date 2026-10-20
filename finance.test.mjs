import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {aggregate,cacheEligible,decompose,filterRecords,gatewayEconomics,forecast,computeEconomics,capitalAllocation,customerWatch} from '../lib/finance.js';
const records=JSON.parse(fs.readFileSync(new URL('../data/usage.json',import.meta.url),'utf8'));
const current=filterRecords(records,'2026-09','All','AI inference');
const previous=filterRecords(records,'2026-08','All','AI inference');
const almost=(actual,expected,eps=.015)=>assert.ok(Math.abs(actual-expected)<eps,`${actual} ≠ ${expected}`);
test('CSV and JSON baseline preserves the original analysis',()=>{
 assert.equal(records.length,2160);assert.equal(new Set(records.map(r=>r.customer_id)).size,60);
 almost(aggregate(current).cost,8968.43);almost(aggregate(previous).cost,7403.71);
 almost(cacheEligible(current),2039.86,.1);
});
test('volume and average-cost attribution exactly reconcile',()=>{
 const d=decompose(current,previous);
 almost(d.delta,1564.72);almost(d.volume+d.rate,d.delta,.0001);
 almost(d.volume,580.31,.1);almost(d.rate,984.41,.1);
});
test('all possible cohorts and workloads reconcile',()=>{
 for(const segment of ['All',...new Set(records.map(r=>r.segment))]){
  for(const workload of new Set(records.map(r=>r.workload))){
   const x=decompose(filterRecords(records,'2026-09',segment,workload),filterRecords(records,'2026-08',segment,workload));
   almost(x.volume+x.rate,x.delta,.00001);
  }
 }
});
test('gateway cache and routing avoid double-counting',()=>{
 const m=gatewayEconomics(current,{cacheHit:60,routable:25,routingSave:20,monthlyOverhead:150,implementation:3000});
 almost(m.cacheSaving,cacheEligible(current)*.6);
 almost(m.routingSaving,(aggregate(current).cost-m.cacheSaving)*.25*.2);
 almost(m.net,m.cacheSaving+m.routingSaving-150);
 assert.ok(m.payback>0&&m.year1>0);
});
test('forecast starts at true synthetic baseline and combines cohorts',()=>{
 const b=aggregate(current),f=forecast(b,{humanGrowth:6,agentGrowth:18,agentMix:55,priceDecline:4,passThrough:35,providerCostShare:75,fluidEfficiency:1});
 almost(f.start.cost,b.cost,.00001);almost(f.start.revenue,b.revenue,.00001);
 assert.equal(f.rows.length,13);assert.equal(f.end.month,'Sep');assert.equal(f.end.year,2027);
 assert.ok(f.end.cost>f.start.cost&&f.end.revenue>f.start.revenue);
 assert.ok(Number.isFinite(f.yearProfit));
});
test('fluid active-CPU scenario is lower than full wall-time comparator',()=>{
 const m=computeEconomics({monthlyRequests:285674});assert.ok(m.comparisonCost>m.fluidCost);assert.ok(m.activeHours<m.workloadHours);
});
test('capital options have valid cashflows and discounted values',()=>{
 const ops=capitalAllocation(cacheEligible(current));assert.equal(ops.length,2);
 for (const option of ops){assert.equal(option.cashflows.length,37);assert.ok(Number.isFinite(option.npv));assert.ok(option.npv<=option.undiscounted);}
});
test('spend watches are mutually exclusive and threshold-responsive',()=>{
 const watch=customerWatch(records);assert.equal(watch.length,60);
 const flagged=customerWatch(records,'2026-09','2026-08','All',0,0);
 assert.ok(flagged.every(r=>r.status==='Over cap'));
});
