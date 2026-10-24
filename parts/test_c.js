(async()=>{
 // C8 weekly events
 const c8=await G(async()=>{const g=__game;closeSheet();g.S.cash=1e6;const out={};for(const k of ['stampede','clearance','collab']){let d=1;while(true){g.S.day=d;if(weekEvent()&&weekEvent().k===k)break;d++}out[k]=d}
   g.S.day=out.stampede;g.go('mall');out.banner=!!document.querySelector('#wev');const it=g.ITEMS.filter(i=>MALL_STORE[i.store]&&!i.rare&&i.price>100)[0];out.off=offOf(it)>=25;
   window.__stampedeWin=1;document.querySelector('#stampede').click();await new Promise(r=>setTimeout(r,150));document.querySelector('#stgo').click();document.querySelector('#stok').click();await new Promise(r=>setTimeout(r,100));
   document.querySelector('[data-door]').click();out.doors=g.S.stats8.doors;
   g.S.day=out.clearance;g.go('mall');const n0=Object.keys(g.S.owned).length;document.querySelector('[data-bin="20"]').click();document.querySelector('#rok').click();out.bins=g.S.stats8.bins;
   g.S.day=out.collab;g.go('mall');out.drops=weeklyDrops().length;return out});
 ok(c8.banner&&c8.off&&c8.doors===1&&c8.bins===1&&c8.drops===2,'weekly events: stampede/doorbuster, clearance bin, collab early drop '+JSON.stringify(c8));
 await G(()=>{let d=1;while(true){__game.S.day=d;if(weekEvent()&&weekEvent().k==='stampede')break;d++}__game.go('mall')});await shot('event');
 // C9 neighbors
 const c9=await G(async()=>{const g=__game;g.go('room');document.querySelector('#homeblock').click();const rows=document.querySelectorAll('#sheet .slot').length;document.querySelector('[data-nb="gary"]').click();await new Promise(r=>setTimeout(r,100));
   const t=document.querySelector('#sheet').innerText;const c0=g.S.cash,w0=g.S.stats8.wins;g.S.nb.week=weekNo();g.S.day+=7;v8NewDay();return{rows,rate:/rate YOUR place/i.test(t),canvas:!!document.querySelector('#nbc'),inbox:g.S.inbox[0]&&g.S.inbox.slice(0,3).map(m=>m.msg).join('|').indexOf('Block')>=0}});
 ok(c9.rows>=10&&c9.rate&&c9.canvas&&c9.inbox,'neighbors visit/rate + weekly contest '+JSON.stringify(c9));
 await shot('neighbor');await G(()=>closeSheet());
 // C10 stonks
 const c10=await G(async()=>{const g=__game;onTab='stonks';g.go('online');const p0=JSON.stringify(mkt().px);g.S.mkt.t-=10;mktTick();const moved=JSON.stringify(mkt().px)!==p0;const c0=g.S.cash;trade('CLMZ',10);const held=mkt().hold.CLMZ.n;trade('CLMZ',-10);return{moved,held,cards:document.querySelectorAll('canvas[data-sp]').length,after:!mkt().hold.CLMZ}});
 ok(c10.moved&&c10.held===10&&c10.after&&c10.cards===5,'stonks move + buy/sell '+JSON.stringify(c10));
 await G(()=>{onTab='stonks';__game.go('online');window.scrollTo(0,0)});await shot('stonks');
 // C11 hustle
 const c11=await G(async()=>{const g=__game;const it=DROPS[3];g.S.owned[it.id]=1;listHustle(it,1.1,'flea');const l=g.S.hustle[g.S.hustle.length-1];let tries=0;while(!l.sold&&tries<200){l.last-=15000;hustleTick();tries++}
   onTab='hustle';g.go('online');return{sold:!!l.sold,msgs:l.msgs.length,resold:g.S.stats8.resold,owned:!!g.S.owned[it.id]}});
 ok(c11.sold&&c11.msgs>=2&&c11.resold===1&&!c11.owned,'resale hustle sells w/ buyer messages '+JSON.stringify(c11));
 await G(()=>{const g=__game;const it=g.ITEMS.filter(i=>i.cat==='tops'&&!i.rare)[2];g.S.owned[it.id]=1;listHustle(it,1.6,'fb');const l=g.S.hustle[g.S.hustle.length-1];for(let i=0;i<6;i++){l.last-=15000}l.sold=0;hustleTick();if(l.sold){l.sold=0;}onTab='hustle';g.go('online');window.scrollTo(0,0)});await shot('hustle');
 // C12 achievements + title
 const c12=await G(()=>{const g=__game;g.save();g.go('me');const has=['therapist','doorbuster','goblin','hype','stonks','hustler','realty'].filter(k=>!!g.S.ach[k]);const sel=document.querySelector('#titlesel');return{has,opts:sel?sel.options.length:0,n:ACH.length}});
 ok(c12.opts>3&&c12.n>=45&&c12.has.indexOf('goblin')<0&&c12.has.indexOf('doorbuster')>=0,'achievements + title picker '+JSON.stringify(c12));
 // C13 muzak
 const c13=await G(async()=>{const g=__game;const off0=g.S.muzak;setMuzak(true);const on=!!MZ.iv;setMuzak(false);return{off0,on,off:!MZ.iv,sfx:!!SFX.ding}});
 ok(c13.off0===false&&c13.on&&c13.off,'muzak off by default, toggles '+JSON.stringify(c13));
})()
