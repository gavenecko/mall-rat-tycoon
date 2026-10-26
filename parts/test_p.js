(async()=>{ await G(()=>{closeSheet();__game.go('mall')});
 const shot20=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v20_'+n+'.png'})};
 // P1 wristband hidden under long sleeves, visible with tee
 const p1=await G(()=>{const S=__game.S;const red=s=>{const c=document.createElement('canvas');c.width=200;c.height=260;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,200,260);x.translate(100,0);x.scale(1.5,1.5);const t=__game.ITEMS.filter(q=>q.shape===s&&!q.fake)[0];drawAvatar(x,Object.assign({},S.char,{fitT:3}),{tops:t.id});const d=x.getImageData(0,0,200,260).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===229&&d[i+1]===57&&d[i+2]===53)n++;return n};return{tee:red('tee'),hoodie:red('hoodie'),sweater:red('sweater'),puffer:red('puffer')}});
 ok(['hoodie','sweater','puffer'].every(k=>p1[k]<p1.tee-60),'wristband hidden under long sleeves '+JSON.stringify(p1));
 // P2 mall walkers
 const p2=await G(()=>{const S=__game.S;S.walk={day:0,laps:0,streak:0};const a0=Object.keys(S.ach).length,c0=S.cash,f0=S.fit.lvl;const a=walkGo('brisk'),b=walkGo('power');checkAch();return{a,b,fit:S.fit.lvl-f0,laps:S.walk.laps,cash:S.cash-c0===(Object.keys(S.ach).length-a0)*ACH_REWARD}});
 ok(p2.a&&!p2.b&&p2.fit===1&&p2.laps===1&&p2.cash,'mall walkers once/day, +1 fitness, no cash '+JSON.stringify(p2));
 // P3 mattress nap
 const p3=await G(()=>{const S=__game.S;S.nap=null;const c0=S.cash,a0=Object.keys(S.ach).length;napSheet();const btns=document.querySelectorAll('[data-nap]').length;const a=napTry('plush'),b=napTry('firm');closeSheet();checkAch();return{btns,a,b,tried:Object.keys(S.nap.tried).length,cash:S.cash-c0===(Object.keys(S.ach).length-a0)*ACH_REWARD}});
 ok(p3.btns===4&&p3.a&&!p3.b&&p3.tried===1&&p3.cash,'mattress mart one free nap/day '+JSON.stringify(p3));
 // P4 kiosk encounter never pays
 const p4=await G(()=>{const S=__game.S;const e=ENC.filter(q=>q.k==='kioskq')[0];const o=[e.r[0](true),e.r[1](true),e.r[1](false)];S.enc={day:S.day,k:'kioskq',done:0};const d0=S.kioskDodge;const m=encChoose(0);return{ok:!!e,cash:o.map(q=>q.cash),dodge:S.kioskDodge-d0,m:!!(m&&m.msg)}});
 ok(p4.ok&&p4.cash.every(c=>c<=0)&&p4.dodge>=1&&p4.m,'kiosk guy encounter (never pays) '+JSON.stringify(p4));
 // P5 cards in right tabs
 const p5=await G(()=>{__game.go('mall');const t=id=>{const e=document.getElementById(id);const h=e&&e.closest('.hubp');return h&&h.dataset.p};return{walk:t('walkcard'),nap:t('napcard')}});
 ok(p5.walk==='fun'&&p5.nap==='fun','new cards in right tabs '+JSON.stringify(p5));
 // P6 credits
 const p6=await G(()=>{openMore();const b=document.querySelector('#mAbout');const bt=b&&b.textContent;b.click();const tx=document.querySelector('#sheet').textContent;return{bt:/Gavenecko/.test(bt),sheet:/Created by Gavenecko/.test(tx)}});
 ok(p6.bt&&p6.sheet,'menu credits Gavenecko '+JSON.stringify(p6));
 await sleep(200);await shot20('credits');
 await G(()=>{closeSheet();__game.S.walk.day=0;__game.go('mall');hubShow('fun');document.querySelector('#walkcard').scrollIntoView({block:'center'})});await sleep(250);await shot20('fun');await G(()=>walkSheet());await sleep(250);await shot20('walkers');await G(()=>closeSheet());
 await G(()=>{__game.S.nap=null;napSheet()});await sleep(250);await shot20('nap');
 await G(()=>{const S=__game.S;S.fit.lvl=100;sheet('<h3>💪 Long-sleeve check</h3><canvas id="slv" width="600" height="340" style="width:300px;height:170px"></canvas>');const x=document.querySelector('#slv').getContext('2d');x.fillStyle='#f5f2fb';x.fillRect(0,0,600,340);['tee','hoodie','sweater','puffer'].forEach((s,i)=>{const t=__game.ITEMS.filter(q=>q.shape===s&&!q.fake)[0];x.save();x.translate(75+i*150,-140);x.scale(2.6,2.6);drawAvatar(x,Object.assign({},S.char,{fitT:3}),{tops:t.id});x.restore()})});await sleep(300);await shot20('sleeves');
 await G(()=>{closeSheet();hubShow('today')});
})();
