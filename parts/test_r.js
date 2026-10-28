(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shot22=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v22x_'+n+'.png'})};
 // R1 frequency + pay sim
 const r1=await G(()=>({smart:callSim(520,'smart'),dec:callSim(520,'decline'),gul:callSim(520,'gullible')}));console.log('    calls',JSON.stringify(r1));
 ok(r1.smart.perWeek>0.7&&r1.smart.perWeek<=1.0&&r1.smart.maxIn7<=1&&r1.smart.netPerWeek>0&&r1.smart.netPerWeek<30&&r1.dec.netPerWeek===0&&r1.gul.netPerWeek<0,'calls ~1/week max, smart EV small+, decline safe, gullible loses '+JSON.stringify(r1));
 // R2 in-game: simulate 8 weeks of new days
 const r2=await G(()=>{const S=__game.S;const d0=S.day,c0=S.cash;S.call=null;callT();S.call.next=S.day+1;let rings=0,days=[];for(let i=0;i<56;i++){S.day++;const r=callNewDay();if(r&&r!=='blocked'){rings++;days.push(S.day);callMiss(true)}}let gap=99;for(let i=1;i<days.length;i++)gap=Math.min(gap,days[i]-days[i-1]);const out={rings,gap,cash:S.cash===c0,log:S.call.log.length};S.day=d0;return out});
 ok(r2.rings>=5&&r2.rings<=9&&r2.gap>=7&&r2.cash,'game-time calls ring about weekly, declining costs nothing '+JSON.stringify(r2));
 // R3 scam answer: gullible loses, smart safe
 const r3=await G(()=>{const S=__game.S;S.cash=1000;const c=callT();c.pend={k:'irs',d:S.day};const a=callAnswer(0);c.pend={k:'grandkid',d:S.day};const sm0=c.st.smart;const b=callAnswer(2);return{a:a.d,b:b.d,smart:c.st.smart-sm0,cash:S.cash}});
 ok(r3.a===-200&&r3.b===0&&r3.smart===1&&r3.cash>=800,'scam: gullible loses, smart is safe '+JSON.stringify(r3));
 // R4 real call pays, declining a real call misses it
 const r4=await G(()=>{const S=__game.S;const c=callT();const c0=S.cash,a0=Object.keys(S.ach).length;c.pend={k:'radio',d:S.day};const a=callAnswer(0);c.pend={k:'boss',d:S.day};const m0=c.st.missed;callMiss(true);return{a:a.d,gain:S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD,missed:c.st.missed-m0,pend:c.pend}});
 ok(r4.a===100&&r4.gain===100&&r4.missed===1&&r4.pend===null,'real call pays $100, decline misses real call '+JSON.stringify(r4));
 // R5 shield blocks scams only, bills weekly, cancel
 const r5=await G(()=>{const S=__game.S;S.cash=500;const c=callT();c.sub=false;c.until=0;const c0=S.cash,a0=Object.keys(S.ach).length;const ok1=shieldSub(true);checkAch();const paid=c0-S.cash+(Object.keys(S.ach).length-a0)*ACH_REWARD;const until=c.until;
   let blocked=0,realThrough=0;for(let d=0;d<SHIELD.days;d++){const day=S.day+d;const q=callPick(day);if(q.s&&day<=c.until)blocked++;}
   const d0=S.day;c.next=S.day;let scamDay=S.day;for(let t=0;t<200;t++){if(callPick(scamDay).s)break;scamDay++}const svD=S.day;S.day=scamDay;c.until=scamDay;c.next=scamDay;const r=callNewDay();
   let realDay=svD;for(let t=0;t<200;t++){if(!callPick(realDay).s)break;realDay++}S.day=realDay;c.until=realDay;c.next=realDay;c.pend=null;const r2=callNewDay();c.pend=null;
   S.day=svD;c.paidNext=S.day;const cb=S.cash;S.day=svD;c.sub=true;c.paidNext=S.day;c.next=S.day+50;callNewDay();const renew=cb-S.cash;shieldSub(false);c.paidNext=S.day;const cb2=S.cash;callNewDay();const after=cb2-S.cash;
   phoneSheet();const txt=document.querySelector('#sheet').textContent;closeSheet();return{ok1,paid,until:until-d0,r,real:r2&&r2!=='blocked',renew,after,sheet:/RoboNOcop/.test(txt)&&/Call log/.test(txt)}});
 ok(r5.ok1&&r5.paid===20&&r5.until===3&&r5.r==='blocked'&&r5.real&&r5.renew===20&&r5.after===0&&r5.sheet,'shield: $20/wk, blocks scams 4 days, real calls get through, cancel stops billing '+JSON.stringify(r5));
 // R6 ring overlay on phone screens: inside viewport, not over nav, buttons tappable
 const r6=await G(async()=>{const S=__game.S;const c=callT();c.pend={k:'macrosoft',d:S.day};__game.go('mall');await new Promise(r=>setTimeout(r,150));const o=document.querySelector('#callov');const R=o.getBoundingClientRect(),N=document.querySelector('#nav').getBoundingClientRect();
   const bt=[...o.querySelectorAll('button')].map(b=>b.getBoundingClientRect());const cv=o.querySelector('canvas').getContext('2d').getImageData(0,0,96,96).data;let op=0;for(let i=3;i<cv.length;i+=4)if(cv[i]===255)op++;
   return{inV:R.left>=0&&R.right<=innerWidth&&R.top>=0,overNav:!(R.bottom<=N.top+1),btnH:Math.min(...bt.map(b=>b.height)),btnIn:bt.every(b=>b.left>=R.left&&b.right<=R.right),op:op/(96*96)}});
 ok(r6.inV&&!r6.overNav&&r6.btnH>=30&&r6.btnIn&&r6.op===1,'incoming call overlay fits phone, clears nav, opaque art '+JSON.stringify(r6));
 await sleep(200);await shot22('ringing');
 await G(()=>callSheet());await sleep(250);await shot22('scam_call');
 await G(()=>{callAnswer(2);closeSheet();const c=callT();c.pend={k:'wallet',d:__game.S.day};callSheet()});await sleep(250);await shot22('real_call');
 await G(()=>{callAnswer(0);closeSheet();phoneSheet()});await sleep(250);await shot22('blocker');
 // R7 cards in right tab + page length + toasts capped
 const r7=await G(()=>{closeSheet();__game.go('mall');const e=document.getElementById('phonecard');const t=e&&e.closest('.hubp');hubShow('today');const H=document.querySelector('#view').scrollHeight;for(let i=0;i<5;i++)toast('t'+i);return{tab:t&&t.dataset.p,H,toasts:document.querySelector('#toast').children.length,ov:!document.querySelector('#callov')}});
 ok(r7.tab==='social'&&r7.H<3200&&r7.toasts<=2&&r7.ov,'phone card in Social, page short, max 2 toasts, overlay gone after call '+JSON.stringify(r7));
})();
