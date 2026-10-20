# Put CloudMargin 3.0 at the existing Vercel URL

Existing public address: https://vercelrotationalproject.vercel.app/

**The source code is ready, but the public URL is NOT changed by this ZIP.** Deployment requires access to the repository or Vercel project.

## Safest update: the same project, not a duplicate

1. On vercel.com open the existing project whose production domain is `vercelrotationalproject.vercel.app`.
2. Go to **Settings → Git** to identify the linked GitHub repository and its production branch.
3. Open that repository. Replace its old `app/`, `data/`, `package.json`, and `README.md` with the matching contents of this ZIP, and add `lib/` and `test/`.
4. Commit to the connected production branch. If GitHub is connected to Vercel, Vercel builds and deploys automatically.
5. Confirm **Deployments → Latest** is production/ready, and open the existing public address in an incognito tab to confirm that **CloudMargin 3.0** appears.

## If you prefer Git CLI

In a local clone of your EXISTING linked GitHub repo, copy all files from the unzipped `cloudmargin-3/` folder into the repo root, then:

```
npm install
npm test
npm run build
git add .
git commit -m "Revamp CloudMargin as agentic finance lab"
git push origin main
```

Replace `main` with the actual production branch. Only proceed once you know which repository is attached to the Vercel production project. Do **not** commit secrets or `.env` files.

No API keys are needed. This prototype performs computations in the browser using bundled fictional JSON data.

## Suggested two-minute recruiter walkthrough

1. **Command center:** Public October 15 Vercel signals show agent-triggered deployments increasing 28×, AI Gateway spend expanding, and average token costs declining. These observations motivate the financial questions but are not this company's synthetic financial data.
2. **Margin diagnostics:** Explain the exact $1,564.72 increase in fictional August→September AI cost: about $580 from demand and $984 from average unit-cost change.
3. **Agentic growth engine:** Use the three scenario buttons to test how faster agent demand, token-cost compression and customer pass-through could change revenue and gross margin.
4. **Capital allocation:** Show why a hypothetical efficiency initiative with a seemingly higher nominal savings rate may still lose on NPV if implementation, benefit realization and timing differ.

## Status of checks

- Passed all eight automated finance unit tests with Node.
- JSX parsed successfully using TypeScript's compiler API.
- **Not** validated with a full Next.js production build here because this environment cannot fetch npm dependencies. Run `npm run build` in the connected GitHub/Vercel environment before sharing as live.
