(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shotU=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v25x_'+n+'.png'})};
 // U1 banners never cover sheet tops
 const u1=await G(async()=>{closeSheet();__game.go('mall');for(let i=0;i<3;i++)toast('🏆 Banner test '+i);walkSheet();const b=document.querySelector('#sheet .sheetbox');for(let i=0;i<20;i++)b.insertAdjacentHTML('beforeend','<p>filler</p>');await new Promise(r=>setTimeout(r,450));const t=document.querySelector('#toast').getBoundingClientRect(),s=b.getBoundingClientRect();closeSheet();return{tb:t.bottom,st:s.top,clear:s.top>=t.bottom-1}});
 ok(u1.clear,'achievement banners never cover the top of a tall sheet '+JSON.stringify(u1));
 // U2 caller ID
 const u2=await G(()=>{const S=__game.S;const c=callT();c.sub=true;c.until=S.day+4;const pick=k=>CALLS.filter(q=>q.k===k)[0];let right=0,n=0;for(let d=1;d<=400;d++){const sd=S.day;S.day=d;CALLS.forEach(q=>{n++;if(callIdGuess(q)===!!q.s)right++});S.day=sd}
   c.pend={k:'irs',d:S.day};callHide&&callHide();callShow();const el=document.querySelector('#callov .cid');const has=!!el;const R=document.querySelector('#callov').getBoundingClientRect();const fit=R.right<=innerWidth&&R.left>=0;callHide();c.sub=false;c.pend={k:'irs',d:S.day};callShow();const none=!document.querySelector('#callov .cid');callHide();c.pend=null;return{acc:right/n,has,none,fit}});
 ok(u2.acc>.85&&u2.acc<.95&&u2.has&&u2.none&&u2.fit,'Caller ID with shield, ~90% accurate, hidden without '+JSON.stringify(u2));
 // U3 gold frame
 const u3=await G(()=>{const S=__game.S;S.cash=500;S.goldFrame=0;S.portrait='laser';S.portraitRoom='bed';switchRoom('bed');const c=40,dp=window.devicePixelRatio||1;const g=()=>roomBg(c).getContext('2d').getImageData(0,0,c*COLS*dp,c*WALL*dp).data;const b0=g();glamSheet('laser');const a0=Object.keys(S.ach).length,c0=S.cash;document.querySelector('#goldframe').click();const paid=c0-S.cash;const dis=document.querySelector('#goldframe').disabled;closeSheet();const b1=g();let diff=0,op=0;for(let i=0;i<b1.length;i+=4){if(b1[i]!==b0[i]||b1[i+1]!==b0[i+1])diff++;if(b1[i+3]===255)op++}const again=buyGoldFrame();return{paid,dis,diff,op:op/(b1.length/4),again}});
 ok(u3.paid===30&&u3.dis&&u3.diff>200&&u3.op===1&&u3.again===false,'gold portrait frame $30 once, drawn opaque '+JSON.stringify(u3));
 await G(()=>{__game.go('room');window.scrollTo(0,0)});await sleep(300);await shotU('goldframe');
 // U4 walker medals
 const u4=await G(()=>{const S=__game.S;const w=walkT();w.laps=16;const a0=Object.keys(S.ach).length;checkAch();walkSheet();const m=document.querySelector('#walkmedals');const t=m.textContent;return{b:/🥉/.test(t),s:/🥈/.test(t),g:!/🥇/.test(t),ach:!!S.ach.walk5&&!S.ach.walk30}});
 ok(u4.b&&u4.s&&u4.g&&u4.ach,'mall walker medals by laps + achievement '+JSON.stringify(u4));
 await G(()=>document.querySelector('#walkmedals').scrollIntoView());await sleep(250);await shotU('medals');await G(()=>closeSheet());
 // U5 talent show
 const u5=await G(()=>{const S=__game.S;S.cash=500;S.pet={k:PETS[0].k,name:'Nugget',full:90,joy:90,acc:{},wear:null,day:1,fedDay:S.day,away:0,starve:0,x:2,y:WALL+1,tricks:{sit:2}};const none=talentGo(0);S.pet.tricks.shake=2;const c0=S.cash,a0=Object.keys(S.ach).length;const r=talentGo(0);const gain=S.cash-c0-(Object.keys(S.ach).length-a0)*ACH_REWARD;const again=talentGo(0);S.pet.showDay-=7;const c1=S.cash;const l=talentGo(.99);const loss=S.cash-c1;S.pet.showDay-=7;petSheet();const box=document.querySelector('#talentbox');const ok2=!!box&&!!box.querySelector('#talentgo');return{none,win:r&&r.win,gain,again,loss,ach:!!S.ach.talent,ok2,ev2:talentSim(2,100000),ev5:talentSim(5,100000)}});
 ok(u5.none===null&&u5.win&&u5.gain===30&&u5.again===null&&u5.loss===-10&&u5.ach&&u5.ok2&&u5.ev2<12&&u5.ev5<25&&u5.ev2>0,'pet talent show weekly, $10 entry, $40 prize, small EV '+JSON.stringify(u5));
 await G(()=>document.querySelector('#talentbox').scrollIntoView());await sleep(250);await shotU('talent');await G(()=>closeSheet());
 const u6=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(u6<3200,'page length ok '+u6);
})();
