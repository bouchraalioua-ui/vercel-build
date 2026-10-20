# CloudMargin 3.0 — Agentic Infrastructure Finance Lab

**Independent, interactive Next.js financial simulator**, built to demonstrate how the finance rotations at an agentic infrastructure business could reason about usage, cost, gross margins, demand forecasts, efficiency, governance, and capital allocation.

This is an independent portfolio project, **not affiliated with or endorsed by Vercel**, and it contains **no nonpublic Vercel operating or financial information**. All customer IDs, operating dollars, request counts, margins, allocations and investment assumptions are synthetic. Public Vercel announcements are explicitly identified and linked in-app.

## What's new in 3.0

1. **Command center**: Finance-oriented thesis, sourced market signals from Vercel Ship 2026 and the October 2026 AI Gateway Production Index, underlying synthetic P&L and rotation-aligned decisions.
2. **FP&A diagnostics**: A reconciled exact cost bridge (`volume × baseline unit cost` and `current usage × unit cost delta`), filters, customer variance and gross margins.
3. **AI Gateway optimization**: Interactive, non-overlapping caching and routing hypotheses; savings, gross margin and payback. Not a live Vercel AI Gateway bill.
4. **Agentic demand forecast**: Twelve months of monthly modeled revenue, provider expenses and platform expenses, using editable deployment growth, initial agent demand mix, token-cost decline, pass-through and efficiency assumptions.
5. **Fluid compute**: A stand-alone illustrative active CPU versus wall-time cost calculator. **Its unit rates are NOT actual Vercel pricing**; it intentionally doesn't reconcile into the synthetic dataset's infrastructure cost.
6. **Capital allocation**: Build versus buy with effectiveness, realized benefit, implementation lag, monthly operating expense, 12–60 month evaluation horizon and annual discount rate.
7. **Enterprise controls**: Fictional customer-level spend caps, anomaly alerts and gross-margin watchlist.
8. **Export**: Download the full scenario model and computed metrics as JSON.

## Deploy to your EXISTING Vercel site

The current public URL is `https://vercelrotationalproject.vercel.app/`. Download this package and **update the existing repository linked to that Vercel project**, rather than creating a new Vercel project, if you want that URL to stay the same.

If GitHub is linked to your Vercel deployment:

1. Unzip this package and copy **the contents** of this folder into your GitHub repository's project root. Make sure `app/`, `data/`, `lib/`, `test/`, `package.json`, and `README.md` are at the project root.
2. Commit and push the files to the branch configured as your Vercel Production Branch (commonly `main`).
3. In Vercel **Project → Deployments**, review the new deployment and ensure the build passes. The existing domain will serve the new build automatically after production deployment.

If you haven't linked GitHub:

1. Create a new GitHub repository from the files inside this folder.
2. On Vercel choose **Add New → Project**, import the repo and accept Next.js defaults. No environment variables, backend services or API keys are required.
3. To preserve the old custom hostname, connect the existing Vercel project to the repo instead of setting up a second project.

### Local verification

```bash
npm install
npm test
npm run build
npm run dev
```

Requires Node.js 20+. Open http://localhost:3000. The app runs as a client-side interactive Next.js page with a bundled JSON dataset.

## Data honesty and accounting notes

- `data/usage.json` is the original 2,160-record synthetic dataset supplied by the author (60 fictional customers × 3 workloads × 12 months); `data/analysis.json` preserves the original Python-exported analytical snapshot.
- As of **October 20, 2026**, October–December 2026 rows in the original synthetic dataset are future synthetic values. The v3 historical trend therefore ends **September 2026**; the new projection independently models October 2026–September 2027 from September base, without treating future rows as observed history.
- The demand forecast is an illustrative weighted cohort formula. It does **not** infer Vercel's monthly growth from the published 28× increase in agent-triggered deployments.
- The `providerCostShare` split is **assumed** because the data doesn't contain provider bills. The revenue pass-through, efficiency, discount rate, savings realization and procurement costs are likewise assumptions.
- AI infrastructure cost and revenue are provided by the source dataset. They do not necessarily represent real Vercel pricing, AI Gateway pass-through, or platform revenue recognition.
- Cross-workload usage units are not directly comparable. The FP&A cost bridge is restricted to a single workload. Company-level totals are revenue and infrastructure cost amounts only.
- Scenario cost avoidance does not imply a validated customer outcome, or incorporate model quality, failure modes, reliability, lock-in, discounts, contractual issues, taxes or future financing.
- Capital allocation is a hypothetical technology buy-versus-build decision, **not** a target-company valuation, acquisition, or Vercel investment recommendation.

## Public research sources (as of October 20, 2026)

- [Vercel Ship 2026 recap (Oct 15, 2026)](https://vercel.com/blog/vercel-ship-2026-recap): agent-triggered deployments, Sandbox/Drives, AI Gateway budgets, enterprise controls.
- [AI Gateway Production Index — October 2026 (Oct 15, 2026)](https://vercel.com/blog/ai-gateway-production-index-october-2026): 13× estimated gateway spend, 47% decline in average price/token, 71.5% open-weight token share.
- [Vercel for Enterprise (Oct 15, 2026)](https://vercel.com/blog/vercel-for-enterprise): centralized governance and enterprise adoption.
- [How AI Gateway runs on Fluid compute (Nov 6, 2025)](https://vercel.com/blog/how-ai-gateway-runs-on-fluid-compute): historical 1,200 active CPU hours versus 16,000 runtime hours case study.

## File map

- `app/page.jsx` — dashboard tabs, inputs, charts, data tables and research citations.
- `app/globals.css` — responsive UI theme.
- `lib/finance.js` — pure finance functions, calculations and public research metadata.
- `test/finance.test.mjs` — model reconciliation and edge case tests.
- `data/usage.json` — original fictional operating records.
- `data/analysis.json` — source analysis snapshot for traceability.

## Positioning for an interview

> I built a synthetic-data finance lab after researching Vercel's shift toward agentic infrastructure. It models the questions I would want to answer in each finance rotation: why margin changes, how inference demand and prices could change unit economics, and whether an efficiency investment earns its cost of capital. I used Vercel's public product and industry signals as prompts, not as private company financial data.
