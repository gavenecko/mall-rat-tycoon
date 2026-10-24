(async()=>{
 const d1=await G(async()=>{const g=__game;closeSheet();g.go('work');g.startShift(g.JOBS[0]);await new Promise(r=>setTimeout(r,300));const w=()=>parseFloat(document.querySelector('#pat').style.width);const w1=w(),m1=g.shift.count;
   window.__vis(false);window.__off+=4500;await new Promise(r=>setTimeout(r,300));window.__vis(true);await new Promise(r=>setTimeout(r,120));const w2=w();const r={w1,w2,alive:!!g.shift};g.endShift&&g.endShift();closeSheet();return r});
 ok(d1.alive&&d1.w1-d1.w2<12,'job mini-game timer pauses while hidden '+JSON.stringify(d1));
 const d2=await G(()=>{const g=__game;const have=g.S.home.have;['patio','theater','penthouse','closet','kitchen'].forEach(k=>{if(have.indexOf(k)<0)have.push(k)});const sig={};const cur=g.S.home.cur;
   ['bed','closet','kitchen','patio','theater','penthouse'].forEach(k=>{switchRoom(k);const c=roomBg(40);const x=c.getContext('2d');const p=x.getImageData(c.width*.5|0,c.height*.15|0,1,1).data;sig[k]=p[0]+','+p[1]+','+p[2]});switchRoom('patio');
   const p=sig.patio.split(',').map(Number);return{sig,sky:p[2]>p[0]&&p[2]>150,distinct:new Set(Object.values(sig)).size}});
 ok(d2.sky&&d2.distinct>=5,'patio outdoor sky + distinct room looks '+JSON.stringify(d2));
 await G(()=>{__game.go('room');window.scrollTo(0,0)});await sleep(300);await shot('patio');
 const d3=await G(async()=>{window.__forceDlBlock=1;const c=document.createElement('canvas');c.width=c.height=20;photoSheet(c.toDataURL('image/png'),'test');const h0=document.querySelector('#dlhelp').hidden;document.querySelector('#dl').click();await new Promise(r=>setTimeout(r,100));
   const auto=!!document.querySelector('#phov');const h1=!document.querySelector('#dlhelp').hidden;document.querySelector('#dlhelp').click();const ov=!!document.querySelector('#phov img');return{h0,auto,h1,ov,hint:/press and hold/i.test((document.querySelector('#phov')||{}).innerText||'')}});
 ok(d3.h0&&!d3.auto&&d3.h1&&d3.ov&&d3.hint,'fit-check: no auto overlay; "Didn\'t save?" button opens press-and-hold overlay '+JSON.stringify(d3));
 await G(()=>{const o=document.getElementById('phov');if(o)o.remove();closeSheet();window.__forceDlBlock=0;if(typeof fitCheck==='function'){const r=fitCheck();if(r&&r.then)return r}});await sleep(400);
 await G(()=>{window.__forceDlBlock=1;const b=document.querySelector('#dl');if(b)b.click();const h=document.querySelector('#dlhelp');if(h)h.click()});await sleep(200);await shot('fitsave');
 await G(()=>{const o=document.getElementById('phov');if(o)o.remove();closeSheet();window.__forceDlBlock=0});
})()
