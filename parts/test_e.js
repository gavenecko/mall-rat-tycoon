(async()=>{
 await G(()=>{const o=document.getElementById('phov');if(o)o.remove();closeSheet()});
 // polish: toast vs photo button, room tabs fit
 const e1=await G(async()=>{const g=__game;const have=g.S.home.have;['closet','kitchen','patio','theater','penthouse'].forEach(k=>{if(have.indexOf(k)<0)have.push(k)});g.go('room');window.scrollTo(0,0);toast('🏆 Some Very Long Achievement Name Here (+$25)');await new Promise(r=>setTimeout(r,400));
   const t=document.querySelector('#toast').getBoundingClientRect(),p=document.querySelector('#rphoto').getBoundingClientRect();const ov=!(t.right<p.left||t.left>p.right||t.bottom<p.top||t.top>p.bottom);
   const bs=[].slice.call(document.querySelectorAll('#rsw button')).map(b=>b.getBoundingClientRect());return{ov,n:bs.length,fit:bs.every(r=>r.right<=innerWidth+.5&&r.left>=0),hs:document.documentElement.scrollWidth<=innerWidth+1}});
 ok(!e1.ov&&e1.n===6&&e1.fit&&e1.hs,'toast clears 📸 button; room tabs wrap to fit '+JSON.stringify(e1));
 await shot('roomtabs');
 // pets
 const e2=await G(async()=>{const g=__game;g.S.cash=1e5;g.go('mall');document.querySelector('#petgo').click();document.querySelector('[data-adopt="pug"]').click();const ad=!!g.S.pet;
   document.querySelector('[data-feed="kibble"]').click();const fed=g.S.pet.fedDay===g.S.day;document.querySelector('[data-acc="crown"]').click();document.querySelector('[data-acc="bow"]').click();document.querySelector('[data-acc="crown"]').click();closeSheet();
   g.go('room');const vis=!!petObj(null,40);const c0=g.S.cash;g.S.pet.full=90;g.S.pet.joy=90;nextDay();const tip=g.S.cash-c0;
   const snap=JSON.stringify(g.S.pet);for(let i=0;i<8;i++)nextDay();const away=g.S.pet.away;g.go('mall');document.querySelector('#petgo').click();document.querySelector('#petback').click();const back=!g.S.pet.away;closeSheet();
   return{ad,fed,vis,tip,away,back,acc:Object.keys(g.S.pet.acc).length,wear:g.S.pet.wear,ach:!!g.S.ach.petparent}});
 ok(e2.ad&&e2.fed&&e2.vis&&e2.tip>0&&e2.away&&e2.back&&e2.acc===2&&e2.wear==='crown'&&e2.ach,'pets: adopt, feed, accessories, tips, run away + bribe back '+JSON.stringify(e2));
 await G(()=>{const g=__game;g.S.pet.full=90;g.S.pet.joy=90;g.S.avatar.x=2;g.go('room');window.scrollTo(0,0)});await sleep(200);await shot('pet');
 // login streak + quests
 const e3=await G(async()=>{const g=__game;g.go('mall');const c0=g.S.cash;document.querySelector('#loginclaim').click();const s1=g.S.login.streak,got=g.S.cash-c0;const again=claimLogin();g.S.login.last=todayKey(-1);const ready=loginReady();claimLogin();const s2=g.S.login.streak;
   g.S.login.last=todayKey(-3);claimLogin();const s3=g.S.login.streak;
   genQuests();const q=g.S.quests.list[0];const its=g.ITEMS.filter(i=>i.store===q.store&&!i.rare);for(let i=0;i<q.n;i++)g.buy(its[i%its.length].id);g.go('mall');const btn=document.querySelector('[data-qc="0"]');const en=btn&&!btn.disabled;const c1=g.S.cash;btn.click();
   g.S.quests.list.forEach(q=>{q.base=-999});g.go('mall');[1,2].forEach(i=>{const b=document.querySelector('[data-qc="'+i+'"]');if(b)b.click()});g.go('mall');const ch=document.querySelector('#qchest');if(ch)ch.click();
   return{s1,got,again,ready,s2,s3,store:q.store,en,claimed:q.claimed,chest:g.S.quests.chest,done:g.S.quests.done}});
 ok(e3.s1===1&&e3.got===25&&e3.again===0&&e3.ready&&e3.s2===2&&e3.s3===1&&e3.en&&e3.claimed&&e3.chest===1&&e3.done===3,'login streak + daily quests + chest '+JSON.stringify(e3));
 // seasons
 const e4=await G(async()=>{const g=__game;const s0=season().k;g.go('mall');const b=document.querySelector('[data-sbuy]');const id=b.dataset.sbuy;b.click();await new Promise(r=>setTimeout(r,100));const own=!!g.S.owned[id];
   const d=g.S.day;g.S.day+=seasonLeft();const s1=season().k;g.S.day=d;const all=new Set();for(let i=0;i<84;i+=14)all.add(season(g.S.day+i).k);return{s0,s1,own,n:all.size,card:!!document.querySelector('#seasoncard')}});
 ok(e4.own&&e4.s0!==e4.s1&&e4.n===6&&e4.card,'seasonal pop-up + calendar rotation '+JSON.stringify(e4));
 await G(()=>{__game.go('mall');window.scrollTo(0,0)});await sleep(200);await shot('mall');
 // photoshoot job
 const e5=await G(async()=>{const g=__game;g.S.shifts=Math.max(g.S.shifts,6);closeSheet();g.go('work');const j=g.JOBS.filter(j=>j.id==='shoot')[0];g.startShift(j);await new Promise(r=>setTimeout(r,150));const s0=g.S.stats9.shoots;for(let i=0;i<4;i++)g.shift.game.bot();
   await new Promise(r=>setTimeout(r,200));return{earned:g.shift.earned,n:g.S.stats9.shoots-s0,pads:document.querySelectorAll('#pf button,#pp button').length}});
 ok(e5.earned>0&&e5.n===4&&e5.pads===8,'influencer photoshoot job '+JSON.stringify(e5));
 await shot('shoot');await G(()=>{__game.endShift();render()});
 const e6=await G(()=>{const p=profileSnapshot();return p.v===9&&!!p.pet&&typeof p.home==='number'});ok(e6,'profileSnapshot for future leaderboards');
})()
