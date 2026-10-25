(async()=>{
 await G(()=>{const o=document.getElementById('phov');if(o)o.remove();closeSheet();AV.mood='smile'});
 // G1 each facial hair style is opaque, outlined and drawn where expected
 const g1=await G(()=>{const P={mustache:[-6,60.8],handlebar:[-2.5,60.3],goatee:[0,74],soul:[0,70.8],chinstrap:[0,76],full:[0,82],wizard:[-4,95],mutton:[-27,52]};const bad=[];const col='#7b4fd6';
   const mk=bd=>{const c=document.createElement('canvas');c.width=600;c.height=700;const x=c.getContext('2d');x.translate(300,20);x.scale(3,3);drawAvatar(x,{gender:'female',body:'average',skin:SKINS[1],hair:'buzz',hairColor:'#1f1410',beard:bd,beardColor:col},{});return x};
   const base=mk('none'),hex=[0x7b,0x4f,0xd6];
   Object.keys(P).forEach(k=>{const x=mk(k),q=P[k],d=x.getImageData(300+q[0]*3,20+q[1]*3,1,1).data;if(d[3]!==255||Math.abs(d[0]-hex[0])+Math.abs(d[1]-hex[1])+Math.abs(d[2]-hex[2])>6)bad.push(k+':'+[].slice.call(d))});
   const s=mk('stubble').getImageData(300-60,20+190,120,40).data;let n=0;for(let i=0;i<s.length;i+=4)if(s[i+3]===255&&Math.abs(s[i]-hex[0])+Math.abs(s[i+1]-hex[1])+Math.abs(s[i+2]-hex[2])<6)n++;if(n<200)bad.push('stubble '+n);
   // outline present just outside the full beard chin
   const o=mk('full').getImageData(300,20+90*3-1,1,1).data;if(!(o[0]<120&&o[3]===255))bad.push('outline '+[].slice.call(o));
   // match-hair colour
   const c2=document.createElement('canvas');c2.width=600;c2.height=700;const x2=c2.getContext('2d');x2.translate(300,20);x2.scale(3,3);drawAvatar(x2,{gender:'male',body:'broad',skin:SKINS[1],hair:'short',hairColor:'#e6c27a',beard:'full',beardColor:null},{});const m=x2.getImageData(300,20+82*3,1,1).data;if(!(m[0]===0xe6&&m[1]===0xc2))bad.push('match '+[].slice.call(m));
   return {bad:bad,n:Object.keys(BEARDS).length}});
 ok(g1.bad.length===0&&g1.n===10,'10 facial hair styles: opaque, outlined, match-hair colour '+JSON.stringify(g1));
 // G2 creator chips + edit
 const g2=await G(async()=>{draft=null;__game.go('create');await new Promise(r=>setTimeout(r,100));
   const chips=document.querySelectorAll('#fh .chip').length,sws=document.querySelectorAll('#fc .sw').length;document.querySelector('#fh [data-k="goatee"]').click();document.querySelector('#fc .sw').click();document.querySelector('#g [data-k="female"]').click();
   const kept=draft.beard==='goatee';document.querySelector('#done').click();await new Promise(r=>setTimeout(r,100));return{chips,sws,kept,b:__game.S.char.beard,c:__game.S.char.beardColor}}).catch(e=>({err:e.message}));
 ok(g2.chips===10&&g2.sws>=10&&g2.kept&&g2.b==='goatee'&&g2.c,'creator facial hair chips + colour, survives gender swap '+JSON.stringify(g2));
 // G3 barber fee
 const g3=await G(async()=>{const S=__game.S;__game.go('mall');await new Promise(r=>setTimeout(r,100));S.cash=100;const sp0=S.spent;document.querySelector('#barberbtn').click();
   const pick=(k,v)=>document.querySelector('[data-bk="'+k+'"][data-v="'+v+'"]').click();pick('beard','mutton');pick('hair','mohawk');const t=document.querySelector('#bpay').textContent;document.querySelector('#bpay').click();
   return{t,cash:S.cash,sp:S.spent-sp0,b:S.char.beard,h:S.char.hair,cuts:S.stats11.cuts,free:barberCost(S.char,Object.assign({},S.char))}});
 ok(g3.sp===32&&g3.cash<=68+50&&g3.b==='mutton'&&g3.h==='mohawk'&&g3.cuts===1&&g3.free===0,'barber charges only for changes '+JSON.stringify(g3));
 // G4 beard visible in room, fit check, shoot
 const g4=await G(async()=>{const S=__game.S;S.char.beard='wizard';S.char.beardColor='#ff6fb5';const hasPink=(c)=>{const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>200&&d[i+1]>70&&d[i+1]<140&&d[i+2]>140&&d[i+2]<210&&d[i]-d[i+1]>100)n++;return n};
   __game.go('room');await new Promise(r=>setTimeout(r,200));const room=Math.max.apply(null,[].map.call(document.querySelectorAll('#view canvas'),hasPink));
   const fc=avatarCanvas(150,190,S.char,S.equipped);const fit=hasPink(fc);
   const sc=document.createElement('canvas');sc.width=300;sc.height=400;const sx=sc.getContext('2d');sx.translate(150,10);drawAvatar(sx,S.char,S.equipped);const shoot=hasPink(sc)&&(String(makeShoot)+(typeof _makeShoot==='function'?String(_makeShoot):'')).indexOf('drawAvatar')>=0;
   return{room,fit,shoot}});
 ok(g4.room>20&&g4.fit>50&&g4.shoot,'beard drawn in room / fit-check / shoot '+JSON.stringify(g4));
 // G5 emotes
 const g5=await G(async()=>{const b=document.querySelectorAll('[data-em]');b[2].click();const m=AV.mood;const st=__game.S.stats11.emotes;return{n:b.length,m,st}});
 ok(g5.n===6&&g5.m==='sad'&&g5.st>=1,'room emote bar sets mood '+JSON.stringify(g5));await sleep(2700);ok(await G(()=>AV.mood==='smile'),'emote resets');
 // G6 gifting
 const g6=await G(()=>{const S=__game.S;S.cash=500;const it=__game.ITEMS.filter(i=>i.cat==='plants')[0];S.owned[it.id]=(S.owned[it.id]||0)+1;const before=homeScore();const p1=giveGift('gretchen',it.id,'fancy');const again=giveGift('gretchen',it.id,'bag');
   S.friends.gretchen=10;S.friends.chad=10;const after=homeScore();neighborSheet();const btn=document.querySelectorAll('[data-gf]').length;closeSheet();return{p1,again,cash:S.cash,bonus:friendBonus(),btn,before,after}});
 ok(g6.p1===5&&g6.again===false&&g6.bonus===5&&g6.btn===5,'neighbor gifting + wrap + daily limit + friendship bonus '+JSON.stringify(g6));
 // G7 trends
 const g7=await G(()=>{const t=trend(),it=__game.ITEMS.filter(i=>i.shape===t.hot)[0],o=__game.ITEMS.filter(i=>i.shape===t.out)[0];return{hot:trendMult(it),out:trendMult(o),diff:t.hot!==t.out&&t.hot!==t.hot2,card:!!trendCard()}});
 ok(g7.hot===1.6&&g7.out===.6&&g7.diff,'weekly trend report changes resale demand '+JSON.stringify(g7));
 // G8 claw machine
 const g8=await G(async()=>{const S=__game.S;S.cash=50;arcadeSheet();await new Promise(r=>setTimeout(r,150));const cv=document.querySelector('#clawcv');const ok1=cv&&cv.width>0;const own=Object.keys(S.owned).length;
   document.querySelector('#clawgo').click();const paid=S.cash===47;clawDone(true);const won=S.stats11.claw===1;closeSheet();return{ok1,paid,won,r:[clawResult(5,.1),clawResult(30,.1),clawResult(5,.9)],pool:clawPrizePool().length}});
 ok(g8.ok1&&g8.paid&&g8.won&&g8.r.join()==='true,false,false'&&g8.pool>5,'claw machine pays, wins decor '+JSON.stringify(g8));
 // screenshots: facial hair lineup
 if(SHOTS&&mode==='file'&&W===412){await G(()=>{AV.mood='smile';const o=document.createElement('div');o.id='phov';o.style.cssText='position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-wrap:wrap;align-content:flex-start;gap:4px;padding:6px;overflow:auto';
   const looks=[['stubble','male','#5a3825',null],['mustache','male','#1f1410',null],['handlebar','nb','#a0522d',null],['goatee','female','#ff6fb5',null],['chinstrap','male','#1f1410','#c9c9c9'],['full','male','#d9692b',null],['wizard','nb','#c9c9c9',null],['mutton','male','#5a3825',null],['soul','female','#3fa9f5',null],['none','female','#7b4fd6',null]];
   looks.forEach((l,i)=>{const ch=Object.assign(defaultChar(l[1]),{beard:l[0],hairColor:l[2],beardColor:l[3],skin:SKINS[i%SKINS.length],name:'x'});const w=document.createElement('div');w.style.cssText='text-align:center;font:bold 12px sans-serif';w.appendChild(avatarCanvas(126,160,ch,{}));w.appendChild(document.createTextNode(BEARDS[l[0]]));o.appendChild(w)});document.body.appendChild(o)});
   await sleep(300);await shot('beards');await G(()=>document.getElementById('phov').remove());
   await G(()=>{__game.S.cash=200;barbDraft=null;__game.go('mall');document.querySelector('#barberbtn').click();document.querySelector('[data-bk="beard"][data-v="handlebar"]').click()});await sleep(200);await shot('barber');
   await G(()=>{closeSheet();__game.go('mall')});await sleep(200);await G(()=>document.querySelector('#trendcard').scrollIntoView());await shot('mall');
   await G(()=>{__game.go('room')});await sleep(300);await G(()=>{document.querySelectorAll('[data-em]')[4].click();document.querySelector('#emo').scrollIntoView({block:'end'});window.scrollBy(0,70)});await sleep(100);await shot('emote');
   await G(()=>{arcadeSheet()});await sleep(500);await shot('claw');await G(()=>{closeSheet();neighborSheet();document.querySelector('[data-gf]').scrollIntoView()});await sleep(200);await shot('gifts');await G(()=>closeSheet())}
})()
