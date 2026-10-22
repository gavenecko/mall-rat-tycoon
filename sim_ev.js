// Monte Carlo: EV of a shoplift attempt vs working, using the v4.1 formulas from parts/8.js
const WAGE=60, SHIFT_MIN=1.0, ATTEMPT_MIN=0.25; // $/45s shift (level-1 human, conservative), real minutes
function sec(price,hi){const a=Math.min(1,Math.log(hi)/Math.log(30000)),b=Math.min(1,Math.log(Math.max(1,price))/Math.log(50000));return Math.max(.05,Math.min(1,a*.6+b*.4))}
function sim(price,hi,{seenRate=.3,N=200000,resale}={}){let tot=0,min=0;const lux=hi>=2000;
 for(let n=0;n<N;n++){let heat=0,prior=0,val=0,t=0,storeOff=0;
  // one "career" = 8 attempts at this store tier (one per week), heat decays 5%/day-1 over 7 days between
  for(let k=0;k<8;k++){t+=ATTEMPT_MIN;const s=sec(price,hi);const p=Math.random()<seenRate?.95:Math.min(.9,.25+.3*s+heat/250);
   if(Math.random()<p){const fee=100+100*prior,fine=Math.max(30,Math.round(price*(3+prior)))+fee,cs=Math.min(15,Math.max(4+2*prior,Math.ceil(fine/60)));
     let cost;if(prior>=2)cost=fine+cs*WAGE;else if(fine>600)cost=fine;else cost=Math.min(fine,cs*WAGE);
     if(prior<2&&fine<=600&&cs*WAGE<fine)t+=cs*SHIFT_MIN; if(prior>=2)t+=cs*SHIFT_MIN;
     val-=cost;prior++;heat=Math.min(100,heat+15+20*s)}
   else{val+=resale?price*resale:price;heat=Math.min(100,heat+6+12*s)}
   for(let d=0;d<7;d++){heat=Math.max(0,heat*.95-1);if(heat>=60&&Math.random()<(heat-50)/80){val-=500+15*heat;heat-=15;t+=4*SHIFT_MIN}}}
  tot+=val;min+=t}
 return{evPerAttempt:tot/N/8,evPerMin:tot/min,workPerMin:WAGE/SHIFT_MIN}}
const cases=[['Wally\'s Mart $15 socks',15,60],['Wally\'s Mart $60 item',60,60],['mid store $150',150,400],['Worst Buy $800 console',800,2500],['Hermeez $5,000 bag',5000,25000],['Hermeez $20,000',20000,25000]];
console.log('wage assumption: $'+WAGE+' per 45s shift (~$'+WAGE+'/real min incl. overhead)');
for(const [n,p,hi] of cases){const a=sim(p,hi),b=sim(p,hi,{resale:.1});
 console.log(n.padEnd(26),'keep@retail EV/attempt',('$'+a.evPerAttempt.toFixed(0)).padStart(8),' EV/min',('$'+a.evPerMin.toFixed(0)).padStart(7),'| cash-out(10% pawn) EV/attempt',('$'+b.evPerAttempt.toFixed(0)).padStart(8),' | work $/min',a.workPerMin)}
console.log('\nBest case: single first-ever attempt, perfect timing, 0 heat, item kept at full retail:');
for(const [n,p,hi] of cases){const s=sec(p,hi),c=.25+.3*s,fine=Math.round(p*3)+100,cost=fine>600?fine:Math.min(fine,Math.ceil(fine/60)*60);
 console.log(n.padEnd(26),'catch',(c*100).toFixed(0)+'%','EV',('$'+((1-c)*p-c*cost).toFixed(0)).padStart(8),' (as fraction of price',(((1-c)*p-c*cost)/p).toFixed(2)+')')}
