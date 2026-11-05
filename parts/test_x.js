(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shot8=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v28x_'+n+'.png'})};
 // X1 garage chooser
 const x1=await G(()=>{const S=__game.S;const ids=Object.keys(ITEM).filter(k=>ITEM[k].price>=20&&!ITEM[k].slot).slice(10,17);ids.forEach(k=>S.owned[k]=(S.owned[k]||0)+2);gsaleT().day=-99;hoardSheet();const cs=[...document.querySelectorAll('[data-gs]')];const def=cs.filter(c=>c.checked).length;cs.forEach(c=>{if(c.checked){c.checked=false;c.onchange()}});const pickId=cs[cs.length-1].dataset.gs;cs[cs.length-1].checked=true;cs[cs.length-1].onchange();const lbl=document.querySelector('#gsalego').textContent;const price=gsaleSpares().filter(q=>q.id===pickId)[0].price;const n0=S.owned[pickId],c0=S.cash;document.querySelector('#gsalego').click();const sold=n0-(S.owned[pickId]||0);const gain=S.cash-c0;
   gsaleT().day=-99;hoardSheet();const cs2=[...document.querySelectorAll('[data-gs]')];const capped=cs2.filter(c=>c.disabled).length===Math.max(0,cs2.length-GSALE.max);const au=!!document.querySelector('#gsaleauto');closeSheet();return{n:cs.length,def,lbl:lbl.includes(money(price)),sold,gain:gain>=price,capped,au}});
 ok(x1.n>5&&x1.def===5&&x1.lbl&&x1.sold===1&&x1.gain&&x1.capped&&x1.au,'garage sale: choose items (max 5), auto-pick default '+JSON.stringify(x1));
 await G(()=>{gsaleT().day=-99;hoardSheet();document.querySelector('#gsalebox').scrollIntoView()});await sleep(250);await shot8('garage_pick');await G(()=>closeSheet());
 // X2 junk trade
 const x2=await G(()=>{const S=__game.S;const b=bagT();BAG.tiers[0].items.forEach(i=>b.got[i]=1);const none=junkTrade();b.got[BAG.tiers[0].items[0]]=4;b.got[BAG.tiers[0].items[1]]=3;const c0=S.cash,a0=Object.keys(S.ach).length;const r=junkTrade();const gain=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const keep=BAG.tiers[0].items.every(i=>b.got[i]>=1);bagSheet();const box=!!document.querySelector('#junktrade');let sim=0;const N=200000;for(let i=0;i<N;i++){const r=Math.random();let a=0;for(const q of BAG.tiers){a+=q.p;if(r<a){sim+=q.cash+(q.k==='junk'?TRADE.pay/TRADE.need:0);break}}sim-=BAG.cost}closeSheet();return{none,r,gain,keep,spare:junkSpare(),box,ev:bagEV28(),sim:sim/N}});
 ok(x2.none===null&&x2.r===4&&x2.gain===4&&x2.keep&&x2.spare===0&&x2.box&&x2.ev<0&&x2.sim<0,'junk trade-in 5 → $4, bag EV still negative '+JSON.stringify(x2));
 // X3 pretzel shield
 const x3=await G(async()=>{const S=__game.S;const b=bagT();b.got['Signed Pretzel']=1;escSheet();const tip=/equipped/.test(document.querySelector('#escshield').textContent);document.querySelector('#escgo').click();await new Promise(r=>setTimeout(r,2500));const saved=S.escSaved||0;closeSheet();delete b.got['Signed Pretzel'];return{tip,sh:escShield(),saved}});
 ok(x3.tip&&x3.sh===0,'pretzel shield tip + only with Signed Pretzel '+JSON.stringify(x3));
 // X4 truce
 const x4=await G(()=>{const S=__game.S;const f=feudT();f.peace=4;const off=truceOn();f.peace=5;const c0=S.cash,a0=Object.keys(S.ach).length;const r=feudDay(true);checkAch();const gain=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const no=f.pranked&&feudPrank('glitter')===null;const nx=f.next-S.day;feudSheet();const t=document.querySelector('#trucebox').textContent;return{off,r,gain,no,nx,t:/Truce/.test(t),ach:!!S.ach.truce}});
 ok(x4.off===false&&x4.r&&x4.gain===5&&x4.no&&x4.nx===7&&x4.t&&x4.ach,'Brayden truce at 5 peace: $5/week coupon, no pranks '+JSON.stringify(x4));
 await G(()=>window.scrollTo(0,0));await sleep(250);await shot8('truce');await G(()=>closeSheet());
 // X5 museum
 const x5=await G(()=>{const S=__game.S;S.museum=null;const p0=museumPay(59),p1=museumPay(60),p2=museumPay(1000);const c0=S.cash,a0=Object.keys(S.ach).length;const exp=museumPay();const r=museumOpen();const gain=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const again=museumOpen();hoardSheet();const box=!!document.querySelector('#museumbox');return{p0,p1,p2,r,exp,gain,again,box,ach:!!S.ach.museum}});
 ok(x5.p0===0&&x5.p1===3&&x5.p2===12&&x5.r===x5.exp&&x5.gain===x5.exp&&x5.again===null&&x5.box&&x5.ach,'hoard museum weekly $1/20 pts max $12 '+JSON.stringify(x5));
 await G(()=>document.querySelector('#museumbox').scrollIntoView());await sleep(250);await shot8('museum');await G(()=>closeSheet());
 const x6=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(x6<3200,'page length ok '+x6);
})();
