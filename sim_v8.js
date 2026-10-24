// v8 pay-vs-price balance sim. Base per-shift pay at level 1 measured from the job formulas (~$70 for an average human,
// 45s shift + ~15s overhead = 1 real minute). Player rotates 6 jobs. Spending: none (time-to-afford for a target).
const BASE=70;
function run(curve,K,mstep,cap){const xp={};let cash=0,t=0;const out={};const goals=[500,5000,25000,150000];let gi=0;
 for(let n=1;n<=2000&&gi<goals.length;n++){const j=n%6;xp[j]=(xp[j]||0);const lv=1+Math.floor(Math.sqrt(xp[j]/K));const m=Math.min(cap,1+mstep*(lv-1));
  cash+=BASE*m*curve;xp[j]+=75;while(gi<goals.length&&cash>=goals[gi]){out[goals[gi]]=n;gi++}}return out}
console.log('v7  (K=60,+25%/lvl, no cap)',JSON.stringify(run(1,60,.25,99)));
console.log('v8  (K=40,+30%/lvl, cap x4, base x1.15)',JSON.stringify(run(1.15,40,.30,4)));
console.log('shifts ≈ real minutes. Targets: $500 ~5-8 min, $5k ~45 min, $25k ~2.5h, $150k ~8-10h (plus stocks/resale/contest side income)');
