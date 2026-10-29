(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shotV=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v24x_'+n+'.png'})};
 // T1 progress + unlock at 20 (calls + encounter cons)
 const t1=await G(()=>{const S=__game.S;S.vill=null;villT();S.conned=0;const c=callT();c.st.fooled=17;__game.go('mall');hubShow('social');const card=document.querySelector('#phonecard').textContent;
   S.enc={day:S.day,k:'kioskq',done:0};const e=ENC.filter(q=>q.k==='kioskq')[0];const sv=e.r[1];e.r[1]=()=>({msg:'buffer',cash:-20});encChoose(1);e.r[1]=sv;const after1=fooledTotal();S.cash=5000;c.pend={k:'irs',d:S.day};callAnswer(0);const pre=S.vill.on;c.pend={k:'pkg',d:S.day};callAnswer(0);
   return{card:/17\/20/.test(card),after1,pre,on:S.vill.on,tot:fooledTotal(),notif:S.inbox.some(m=>/VILLAIN ARC/.test(m.msg))}});
 ok(t1.card&&t1.after1===18&&!t1.pre&&t1.on&&t1.tot===20&&t1.notif,'villain arc: progress x/20, encounter cons count, unlocks at 20 '+JSON.stringify(t1));
 await G(()=>{__game.go('mall');hubShow('social');phoneSheet();document.querySelector('#villbox').scrollIntoView()});await sleep(250);await shotV('unlock');
 // T2 disclaimer gating
 const t2=await G(()=>{const S=__game.S;const blocked=vDial()===null;closeSheet();vOpen();const d=document.querySelector('#vdisc');const okb=d.querySelector('#vdok');const dis=okb.disabled;const txt=d.textContent;const R=d.getBoundingClientRect(),B=d.querySelector('.vdbox').getBoundingClientRect();
   return{blocked,disc:!!d,dis,ftc:/reportfraud\.ftc\.gov/.test(txt),crime:/serious crime/.test(txt)&&/seniors/.test(txt),full:R.width>=innerWidth-1&&R.height>=innerHeight-1,fit:B.left>=0&&B.right<=innerWidth+1,sheet:!document.querySelector('#sheet .sheetbox #vtarget')}});
 ok(t2.blocked&&t2.disc&&t2.dis&&t2.ftc&&t2.crime&&t2.full&&t2.fit,'disclaimer full-screen, gated by checkbox, mentions crime/seniors/FTC '+JSON.stringify(t2));
 await sleep(200);await shotV('disclaimer');
 const t3=await G(()=>{const d=document.querySelector('#vdisc');d.querySelector('#vdchk').click();const en=!d.querySelector('#vdok').disabled;d.querySelector('#vdok').click();return{en,ack:__game.S.vill.ack,gone:!document.querySelector('#vdisc'),hot:/Scam Hotline/.test(document.querySelector('#sheet').textContent)}});
 ok(t3.en&&t3.ack&&t3.gone&&t3.hot,'acknowledge opens hotline '+JSON.stringify(t3));
 // T4 dials: fee once/day, 3 per day, pitch odds by target, cop fines
 const t4=await G(()=>{const S=__game.S;S.cash=1000;const v=vDay();v.dials=0;v.paid=false;v.cur=null;v.heat=0;const c0=S.cash;const k1=vDial();const fee=c0-S.cash;const same=vDial()===k1;
   v.cur='cop';const cop=vPitch(0,0);v.cur='gertie';const w=vPitch(2,0);const gertieOdds=Math.round(vOdds(2,V_TGT[0])*100);vDial();vPitch(2,0);vDial();vPitch(2,0);const fourth=vDial();
   return{fee,same,cop:cop.win===false&&cop.d===-40,w:w.win&&w.d===40,gertieOdds,fourth,dials:v.dials}});
 ok(t4.fee===15&&t4.same&&t4.cop&&t4.w&&t4.gertieOdds===60&&t4.fourth===null&&t4.dials===3,'hotline: $15 burner/day, 3 dials, target-modified odds, cop fines '+JSON.stringify(t4));
 // T5 heat -> mall cop investigation
 const t5=await G(()=>{const S=__game.S;S.cash=1000;const v=vDay();v.heat=95;v.cur='earl';const r=vPitch(2,0);return{bust:r.bust,heat:v.heat,busts:v.st.busts}});
 ok(t5.bust&&t5.heat===30&&t5.busts>=1,'heat 100 triggers Mall Cop fine '+JSON.stringify(t5));
 // T6 EV sim
 const t6=await G(()=>({p0:vSim(100000,0),p1:vSim(100000,1),p2:vSim(100000,2),best:vSim(100000,'best')}));console.log('    villainEV/day',JSON.stringify(t6));
 ok(t6.best<1&&t6.best>-10&&t6.p0<0&&t6.p1<0&&t6.p2<0,'scamming EV per day ~break-even or negative '+JSON.stringify(t6));
 // T7 pitch screen fits + screenshot
 const t7=await G(()=>{const S=__game.S;S.cash=1000;const v=vDay();v.cur='tech';v.heat=40;vSheet();const T=document.querySelector('#vtarget');const bs=[...T.querySelectorAll('[data-vp]')].map(b=>b.getBoundingClientRect());return{n:bs.length,fit:bs.every(b=>b.left>=0&&b.right<=innerWidth),pct:/%/.test(T.textContent)}});
 ok(t7.n===3&&t7.fit&&t7.pct,'pitch options fit the phone screen '+JSON.stringify(t7));
 await G(()=>document.querySelector('#vtarget').scrollIntoView());await sleep(250);await shotV('pitch');
 // T8 go straight
 const t8=await G(()=>{const S=__game.S;S.cash=1000;const c0=S.cash,a0=Object.keys(S.ach).length;const r=vStraight();checkAch();const paid=c0-S.cash+(Object.keys(S.ach).length-a0)*ACH_REWARD;const no=vDial();closeSheet();return{r,paid,ach:!!S.ach.straight,no,locked:S.vill.straight}});
 ok(t8.r&&t8.paid===50&&t8.ach&&t8.no===null&&t8.locked,'go straight: $50 donation, achievement, hotline closed '+JSON.stringify(t8));
 // T9 portrait in any room
 const t9=await G(()=>{const S=__game.S;const has=S.home.have.filter(k=>k!=='bed')[0];if(!has)return{skip:true};switchRoom(has);glamSheet('mall');document.querySelector('#glamhang').click();closeSheet();const ok=S.portraitRoom===has;switchRoom('bed');return{ok}});
 ok(t9.skip||t9.ok,'portrait can hang in any room '+JSON.stringify(t9));
 const t10=await G(()=>{__game.go('mall');hubShow('today');return document.querySelector('#view').scrollHeight});ok(t10<3200,'page length ok '+t10);
})();
