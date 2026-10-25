/* ============================== v9 ==============================
   Pets (Petcough), daily login streak + daily quests, seasonal calendar
   (pop-up shop + room decor), Influencer Photoshoot job, UI polish.
   profileSnapshot() is the single public "who am I" record: future
   leaderboards / home visits should consume it rather than raw S. */
(function(){const st=document.createElement('style');st.textContent=
 '#toast{top:72px!important;bottom:auto!important}'+
 '#rsw{flex-wrap:wrap;overflow:visible}#rsw button{flex:1 1 calc(33% - 6px);min-width:0;padding:6px 6px;font-size:12px;min-height:36px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
 '.v9q{display:flex;align-items:center;gap:8px;margin:6px 0}.v9q .bar{flex:1;margin:0}.v9row{display:flex;gap:8px;overflow-x:auto;padding:4px 0}.v9row .item{min-width:120px;max-width:130px}'+
 '.petbar{height:8px;border-radius:6px;background:#eee;overflow:hidden}.petbar>div{height:100%}';
 document.head.appendChild(st)})();
function v9Fix(s){if(!s.pet)s.pet=null;if(!s.login)s.login={last:'',streak:0,best:0};if(!s.quests)s.quests={day:0,list:[],done:0,chest:0};
  if(!s.stats9)s.stats9={shoots:0,petFed:0,seasonal:0};if(s.pet&&!s.pet.acc)s.pet.acc={}}
function profileSnapshot(){return{v:15,story:S.miles?Object.keys(S.miles).length:0,car:S.car?S.car.k:'',fit:S.fit?S.fit.lvl:0,beard:S.char?S.char.beard||'none':'none',friends:S.friends?Object.keys(S.friends).length:0,name:S.char?S.char.name:'',day:S.day,cash:S.cash,earned:S.earned,home:typeof homeScore==='function'?homeScore():0,drip:dripScore(),
  ach:Object.keys(S.ach).length,coll:Object.keys(S.coll||{}).length,apt:S.apt?S.apt.k:'',credit:S.credit?S.credit.score:0,pet:S.pet?{k:S.pet.k,name:S.pet.name,acc:Object.keys(S.pet.acc)}:null,streak:S.login.best}}

/* ---------- seasons ---------- */
const POPUP_STORE={id:'popup',name:'Seasonal Pop-Up',tag:'Here for a good time, not a long time',color:'#ff7043',emoji:'🎪',cats:['tops','hats','decor'],tier:[20,900],drop:true};
STORES.push(POPUP_STORE);
const SEASONS=[
 {k:'spooky',name:'Spooky Szn',emoji:'🎃',g:'#ff7043,#6a1b9a',fx:['🎃','🦇','🕸️'],items:[['Pumpkin Spice','sweater','tops','Orange',95],['Witchy','tophat','hats','Black',70],['Haunted','lamp','decor','Purple',140],['Jack-o-Lantern','plant','decor','Orange',45],['Ghostly','rug','decor','White',160],['Creepy Portrait','painting','decor','Black',220]]},
 {k:'thanks',name:'Thanksgrabbing',emoji:'🦃',g:'#a1887f,#e65100',fx:['🍂','🍁','🌽'],items:[['Cozy Harvest','sweater','tops','Brown',85],['Pilgrim-core','cowboy','hats','Brown',60],['Cornucopia','plant','decor','Gold',55],['Plaid Throw','rug','decor','Red',120],['Gravy Boat','fishtank','decor','Brown',300],['Turkey Day','poster','decor','Orange',25]]},
 {k:'holly',name:'Holly-Daze',emoji:'❄️',g:'#1565c0,#c62828',fx:['❄️','🎄','🎁'],items:[['Ugly Holiday','sweater','tops','Red',75],['Elf-ish','beanie','hats','Green',40],['Tinsel','lamp','decor','Silver',110],['Mini Tree','plant','decor','Green',180],['Snowflake','rug','decor','White',150],['Mistle-Toe','wallshelf','decor','Green',90]]},
 {k:'galentine',name:'Galentine\'s',emoji:'💘',g:'#ec407a,#ff8a80',fx:['💘','💖','🌹'],items:[['Heart-Eyes','tee','tops','Pink',55],['Cupid','bucket','hats','Red',50],['Rose','plant','decor','Red',65],['Love Seat','sofa','furniture','Pink',650],['XOXO','poster','decor','Hot Pink',30],['Heart','rug','decor','Pink',130]]},
 {k:'spring',name:'Spring Fling',emoji:'🌸',g:'#81c784,#f48fb1',fx:['🌸','🌷','🦋'],items:[['Blossom','tank','tops','Pink',45],['Garden Party','bucket','hats','Lime',55],['Tulip','plant','decor','Yellow',40],['Picnic','table','furniture','White',320],['Bunny','poster','decor','Lavender',25],['Petal','rug','decor','Pink',120]]},
 {k:'summer',name:'Summer Splurge',emoji:'☀️',g:'#ffb300,#29b6f6',fx:['☀️','🌴','🍉'],items:[['Tiki','tee','tops','Aqua',40],['Beach Bum','bucket','hats','Yellow',35],['Palm','plant','decor','Green',90],['Pool Float','sofa','furniture','Aqua',480],['Surf\'s Up','poster','decor','Blue',25],['Tropical','rug','decor','Lime',110]]}];
(function(){SEASONS.forEach((se,si)=>{se.list=[];se.items.forEach((d,j)=>{const c=COLORS.filter(q=>q[0]===d[3])[0]||COLORS[(si*6+j)%COLORS.length];const base=BASES[d[2]].filter(b=>b.key===d[1])[0];
  const it={id:'s9-'+se.k+'-'+j,store:'popup',name:d[0]+' '+base.name,cat:d[2],slot:(d[2]==='tops'||d[2]==='hats')?d[2]:null,shape:d[1],price:d[4],color:c[1],colorName:c[0],pattern:base.plain?'':(j%2?'dots':'stripes'),rare:true,stock:12,
    w:base.w||1,h:base.h||1,layer:base.layer||'floor',drop:true,season:se.k};ITEMS.push(it);ITEM[it.id]=it;se.list.push(it)})})})();
const SEASON_WEEKS=2;
function season(d){return SEASONS[Math.floor(weekNo(d)/SEASON_WEEKS)%SEASONS.length]}
function seasonLeft(){return SEASON_WEEKS*7-((S.day-1)%(SEASON_WEEKS*7))}
function seasonCard(){const se=season(),l=seasonLeft();return'<div class="card" id="seasoncard" style="background:linear-gradient(120deg,'+se.g+');color:#fff"><b>'+se.emoji+' '+se.name+' Pop-Up</b> <span class="small" style="color:#fff">· limited, gone in '+l+' day'+(l>1?'s':'')+'</span>'+
  '<div class="v9row">'+se.list.map(it=>{const own=S.owned[it.id],left=stockLeft(it);return'<div class="item" style="color:var(--ink)"><img alt="" src="'+thumb(it)+'"><div class="nm">'+esc(it.name)+'</div><div class="small">'+money(priceOf(it))+' · '+left+' left</div><button class="btn" data-sbuy="'+it.id+'" '+(left?'':'disabled')+'>'+(own?'Own '+own+' · +1':'Buy')+'</button></div>'}).join('')+'</div></div>'}
function seasonFX(x,c){const se=season(),W=c*COLS,H=c*ROWS,r=rng(S.day*31+7);x.save();x.font=Math.round(c*.38)+'px serif';x.textAlign='center';x.textBaseline='middle';
  for(let i=0;i<COLS*2;i++){x.globalAlpha=.85;x.fillText(se.fx[i%se.fx.length],(i+.5)*W/(COLS*2),c*.22+(i%2)*c*.12)}
  x.globalAlpha=.5;x.font=Math.round(c*.3)+'px serif';for(let i=0;i<6;i++)x.fillText(se.fx[i%se.fx.length],r()*W,c*(WALL+.3)+r()*(H-c*(WALL+.6)));x.restore()}

/* ---------- pets ---------- */
const PETS=[{k:'hamster',e:'🐹',name:'Hamster',price:150,tip:6},{k:'cat',e:'🐈',name:'Cat',price:600,tip:12},{k:'pug',e:'🐶',name:'Pug',price:1200,tip:18},
 {k:'axolotl',e:'🦎',name:'"Axolotl" (it\'s a lizard)',price:2500,tip:25},{k:'capy',e:'🦫',name:'Capybara',price:8000,tip:45}];
const PET_ACC=[{k:'bow',e:'🎀',name:'Bow',price:40},{k:'bandana',e:'🧣',name:'Bandana',price:25},{k:'sunnies',e:'🕶️',name:'Tiny Sunnies',price:80},{k:'crown',e:'👑',name:'Tiny Crown',price:400},{k:'collar',e:'📿',name:'Goochie Collar',price:1800}];
const PET_FOOD=[{k:'kibble',e:'🥣',name:'Kibbles \'n Bills',price:12,full:35,joy:0},{k:'gourmet',e:'🍣',name:'Gourmet Feast',price:60,full:80,joy:10},{k:'toy',e:'🧸',name:'Squeaky Toy',price:35,full:0,joy:30}];
const PET_NAMES=['Sir Barksalot','Princess Nugget','Chairman Meow','Gucci Mane-Coon','Biscuit','Sprinkles','Kevin','Lady Fluffington','Tater Tot','Beans'];
const petDef=()=>S.pet&&PETS.filter(p=>p.k===S.pet.k)[0];
function petMood(){const p=S.pet;if(!p)return'';if(p.away)return'🏚️ staying at the neighbor\'s';if(p.full<25)return'😿 hungry';if(p.joy<35)return'😐 bored';return p.joy>75&&p.full>60?'🥰 thriving':'🙂 fine'}
function payCash(p,why){if(S.cash<p){toast('Need '+money(p)+' cash for '+why);sfx('bad');return false}S.cash-=p;S.spent+=p;bumpCash&&bumpCash();return true}
function petCard(){const p=S.pet,d=petDef();return'<div class="card row" id="petcard" style="background:linear-gradient(120deg,#26a69a,#80cbc4);color:#fff">'+(d?'<img alt="" src="'+petThumb(d.k,S.pet.wear)+'" style="width:52px;height:52px;background:#fff;border-radius:12px">':'<span style="font-size:40px">🐾</span>')+'<div style="flex:1"><b>🐾 Petcough</b><div class="small" style="color:#fff">'+
  (p?esc(p.name)+' · '+petMood():'Pets, food & tiny luxury accessories. Adopt a sidekick.')+'</div></div><button class="btn" id="petgo">'+(p?'Care':'Adopt')+'</button></div>'}
function petSheet(){const p=S.pet;if(!p){sheet('<h3>🐾 Petcough — Adopt</h3><div class="small">Adoption fee includes one (1) participation-trophy collar. Your pet lives in your room, needs food daily, and earns "pet influencer" tips when happy.</div>'+
    PETS.map(d=>'<div class="slot"><span><img alt="" src="'+petThumb(d.k)+'" style="width:44px;height:44px;vertical-align:middle"> <b>'+d.name+'</b><br><span class="small">'+money(d.price)+' · tips ~'+money(d.tip)+'/day when happy</span></span><button class="btn" data-adopt="'+d.k+'">Adopt</button></div>').join(''));
    onAll($('#sheet'),'[data-adopt]',b=>{const d=PETS.filter(q=>q.k===b.dataset.adopt)[0];if(!payCash(d.price,'adoption'))return;S.pet={k:d.k,name:pick(PET_NAMES),full:80,joy:80,acc:{},wear:null,day:S.day,fedDay:0,away:0,starve:0,x:2,y:WALL+1};
      sfx('level');notify('🐾 You adopted '+S.pet.name+' the '+d.name+'! Feed them daily from Petcough.');save();petSheet();rerender()});return}
  const d=petDef(),bar=(v,c)=>'<div class="petbar"><div style="width:'+Math.max(0,Math.min(100,v))+'%;background:'+c+'"></div></div>';
  if(p.away){sheet('<h3>🏚️ '+esc(p.name)+' moved out</h3><div>'+esc(p.name)+' got hungry and moved in with the neighbors "until you get your life together".</div><button class="btn big" id="petback">Bribe them back ($100)</button>');
    $('#petback').onclick=()=>{if(!payCash(100,'the bribe'))return;p.away=0;p.full=60;p.joy=50;p.starve=0;sfx('level');save();petSheet();rerender()};return}
  sheet('<h3><img alt="" src="'+petThumb(d.k,p.wear)+'" style="width:56px;height:56px;vertical-align:middle"> '+esc(p.name)+'</h3><div class="small">'+d.name+' · '+petMood()+' · adopted day '+p.day+'</div><div class="small">Fullness</div>'+bar(p.full,'#ff9800')+'<div class="small">Happiness</div>'+bar(p.joy,'#e91e63')+
   '<div class="lbl">Food & toys</div>'+PET_FOOD.map(f=>'<div class="slot"><span>'+f.e+' <b>'+f.name+'</b><br><span class="small">'+money(f.price)+(f.full?' · +'+f.full+' full':'')+(f.joy?' · +'+f.joy+' joy':'')+'</span></span><button class="btn green" data-feed="'+f.k+'">Give</button></div>').join('')+
   '<div class="lbl">Accessories (tap to wear)</div>'+PET_ACC.map(a=>{const own=p.acc[a.k];return'<div class="slot"><span>'+a.e+' <b>'+a.name+'</b><br><span class="small">'+(own?(p.wear===a.k?'Wearing':'Owned'):money(a.price))+'</span></span><button class="btn'+(own?' alt':'')+'" data-acc="'+a.k+'">'+(own?(p.wear===a.k?'Take off':'Wear'):'Buy')+'</button></div>'}).join('')+
   '<button class="btn alt" id="petname">✏️ Rename</button>');
  onAll($('#sheet'),'[data-feed]',b=>{const f=PET_FOOD.filter(q=>q.k===b.dataset.feed)[0];if(!payCash(f.price,f.name))return;p.full=Math.min(100,p.full+f.full);p.joy=Math.min(100,p.joy+f.joy);if(f.full){p.fedDay=S.day;S.stats9.petFed++}sfx('coin');toast((f.full?'Nom nom!':'Squeak squeak!'));save();petSheet()});
  onAll($('#sheet'),'[data-acc]',b=>{const a=PET_ACC.filter(q=>q.k===b.dataset.acc)[0];if(!p.acc[a.k]){if(!payCash(a.price,a.name))return;p.acc[a.k]=1;p.wear=a.k;p.joy=Math.min(100,p.joy+15);sfx('level')}else p.wear=p.wear===a.k?null:a.k;save();petSheet()});
  $('#petname').onclick=()=>{const n=prompt('New name?',p.name);if(n&&n.trim()){p.name=n.trim().slice(0,20);save();petSheet()}}}
function petObj(x,c){const p=S.pet;if(!p||p.away)return null;const d=petDef();const px=Math.max(0,Math.min(COLS-1,S.avatar.x+(S.avatar.x<COLS-1?1:-1))),py=Math.max(WALL,S.avatar.y);
  return{z:py+1,f:()=>{const cx=(px+.5)*c,cy=(py+.75)*c,bob=Math.sin(Date.now()/300)*1.5;x.save();x.fillStyle='rgba(30,10,30,.2)';ell(x,cx,cy+c*.15,c*.3,c*.08);x.fill();x.font=Math.round(c*.95)+'px serif';x.textAlign='center';x.textBaseline='middle';
    if(p.k!=='axolotl'&&p.k!=='capy'&&px<S.avatar.x){x.translate(cx,0);x.scale(-1,1);x.translate(-cx,0)}x.fillText(d.e,cx,cy-c*.1+bob);x.restore();
    x.save();x.font=Math.round(c*.32)+'px serif';x.textAlign='center';x.textBaseline='middle';if(p.wear){const a=PET_ACC.filter(q=>q.k===p.wear)[0];x.fillText(a.e,cx,cy-c*.48+bob)}if(p.full<25||p.joy<35)x.fillText(p.full<25?'🍽️':'💤',cx+c*.35,cy-c*.5);x.restore()}}}
function petNewDay(){const p=S.pet;if(!p||p.away)return;p.full=Math.max(0,p.full-28);p.joy=Math.max(0,p.joy-(p.full<30?15:6));const d=petDef();
  if(p.full===0){p.starve++;if(p.starve>=3){p.away=1;notify('🏚️ '+p.name+' moved in with the neighbors. Visit Petcough to bribe them back.');return}notify('😿 '+p.name+' is starving! Feed them at Petcough.')}else p.starve=0;
  if(p.full>=40&&p.joy>=60){const t=d.tip+(p.wear?5:0)+Object.keys(p.acc).length*2;S.cash+=t;S.earned+=t;if(S.day%3===0)notify('📸 '+p.name+' went viral on PetTok. Tips: '+money(t)+'/day')}}

/* ---------- daily login streak + quests ---------- */
function todayKey(o){const d=new Date(Date.now()+(o||0)*864e5);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
const STREAK_PAY=[25,40,60,80,100,150,400];
function loginReady(){return S.login.last!==todayKey()}
function claimLogin(){if(!loginReady())return 0;S.login.streak=S.login.last===todayKey(-1)?S.login.streak+1:1;S.login.best=Math.max(S.login.best,S.login.streak);S.login.last=todayKey();
  const amt=STREAK_PAY[(S.login.streak-1)%7];S.cash+=amt;sfx('level');toast('🎁 Day '+S.login.streak+' streak: +'+money(amt));save();return amt}
const QPOOL=[
 {k:'shifts',t:n=>'Work '+n+' shifts',n:()=>2+rand(2),base:()=>S.shifts,cur:()=>S.shifts,rew:n=>40*n},
 {k:'earn',t:n=>'Earn '+money(n)+' at work',n:()=>Math.max(80,Math.round(Math.min(S.earned/Math.max(1,S.shifts),400)*2/10)*10),base:()=>S.earned,cur:()=>S.earned,rew:n=>Math.round(Math.min(150,30+n*.15))},
 {k:'brand',t:(n,q)=>'Buy '+n+' '+(STORES.filter(s=>s.id===q.store)[0]||{name:'?'}).name+' item'+(n>1?'s':''),n:()=>2+rand(2),store:()=>{const o=openStores().filter(s=>s.tier[0]<=Math.max(30,S.cash/4));return(o.length?pick(o):openStores()[0]).id},
   base:q=>brandOwned(q.store),cur:q=>brandOwned(q.store),rew:n=>35*n},
 {k:'photo',t:()=>'Take a 📸 fit check',n:()=>1,base:()=>S.stats8.photos,cur:()=>S.stats8.photos,rew:()=>40},
 {k:'feed',t:()=>'Feed your pet',n:()=>1,need:()=>S.pet&&!S.pet.away,base:()=>S.stats9.petFed,cur:()=>S.stats9.petFed,rew:()=>40},
 {k:'shoot',t:n=>'Nail '+n+' influencer photoshoot poses',n:()=>5+rand(6),need:()=>S.shifts>=6,base:()=>S.stats9.shoots,cur:()=>S.stats9.shoots,rew:n=>12*n},
 {k:'hustle',t:()=>'Resell 1 item on Hustle',n:()=>1,base:()=>S.stats8.resold,cur:()=>S.stats8.resold,rew:()=>60}];
function brandOwned(st){let n=0;Object.keys(S.owned).forEach(id=>{const it=ITEM[id];if(it&&it.store===st)n+=S.owned[id]});return n}
const QD=k=>QPOOL.filter(q=>q.k===k)[0];
function genQuests(){const pool=shuffle(QPOOL.filter(q=>!q.need||q.need()));const pk=[QD('brand')].concat(pool.filter(q=>q.k!=='brand').slice(0,2));
  S.quests.day=S.day;S.quests.chest=0;S.quests.list=pk.map(d=>{const q={k:d.k,n:d.n(),claimed:0};if(d.store)q.store=d.store();q.base=d.base(q);q.rew=d.rew(q.n);return q})}
function qProg(q){return Math.max(0,Math.min(q.n,QD(q.k).cur(q)-q.base))}
function questsFresh(){if(S.quests.day!==S.day||!S.quests.list.length)genQuests()}
function dailyCard(){questsFresh();const L=S.quests.list,all=L.every(q=>q.claimed);let h='<div class="card" id="dailycard"><div class="row sp"><b>📋 Daily quests</b><span class="small">🔥 '+S.login.streak+'-day streak</span></div>';
  if(loginReady())h+='<button class="btn big green" id="loginclaim" style="width:100%;margin:6px 0">🎁 Claim daily reward ('+money(STREAK_PAY[(S.login.last===todayKey(-1)?S.login.streak:0)%7])+')</button>';
  L.forEach((q,i)=>{const p=qProg(q),done=p>=q.n;h+='<div class="v9q"><span style="flex:1.4" class="small">'+(q.claimed?'✅ ':'')+esc(QD(q.k).t(q.n,q))+'<br>'+p+'/'+q.n+'</span><div class="bar"><div style="width:'+(p/q.n*100)+'%;background:#7c4dff"></div></div>'+
    (q.claimed?'':'<button class="btn'+(done?' green':' alt')+'" data-qc="'+i+'" '+(done?'':'disabled')+'>'+money(q.rew)+'</button>')+'</div>'});
  h+=all?(S.quests.chest?'<div class="small">🧰 Quest chest opened. New quests tomorrow (game day).</div>':'<button class="btn big" id="qchest" style="width:100%">🧰 Open quest chest (+$150)</button>'):'<div class="small">Finish all 3 for a 🧰 bonus chest.</div>';return h+'</div>'}
function bindV9(){const lc=$('#loginclaim');if(lc)lc.onclick=()=>{claimLogin();rerender()};
  onAll(document,'[data-qc]',b=>{const q=S.quests.list[+b.dataset.qc];if(q.claimed||qProg(q)<q.n)return;q.claimed=1;S.cash+=q.rew;S.quests.done++;sfx('coin');toast('📋 Quest done: +'+money(q.rew));save();rerender()});
  const qc=$('#qchest');if(qc)qc.onclick=()=>{if(S.quests.chest)return;S.quests.chest=1;S.cash+=150;sfx('level');burst&&burst(14);toast('🧰 Chest: +$150');save();rerender()};
  onAll(document,'[data-sbuy]',b=>{const it=ITEM[b.dataset.sbuy];if(!it||season().list.indexOf(it)<0)return;buy(it);setTimeout(rerender,50)});
  const pg=$('#petgo');if(pg)pg.onclick=petSheet}

/* ---------- Influencer Photoshoot job ---------- */
const SHOOT_F=[['golden','☀️','Golden hour','rgba(255,170,60,.35)'],['neon','🌃','Neon night','rgba(170,0,255,.35)'],['vintage','🎞️','Vintage','rgba(140,100,60,.4)'],['cool','❄️','Ice cool','rgba(60,160,255,.35)']];
const SHOOT_P=[['peace','✌️','Peace sign'],['flip','💁','Hair flip'],['selfie','🤳','Selfie'],['pose','🕺','Strike a pose']];
const BRIEFS=['for a sponsored post nobody asked for','for the brand deal (they paid in exposure)','to announce a hiatus nobody noticed','for a "candid" that took 400 tries','for a Goochie unboxing','for a "no makeup" makeup look'];
function makeShoot(el,api){el.innerHTML='<div class="card"><b>📋 Client brief</b><div id="brief"></div></div><div class="bar"><div id="pat"></div></div><canvas id="cv"></canvas><div class="small center">Filter</div><div class="pad" id="pf"></div><div class="small center">Pose</div><div class="pad" id="pp"></div>';
  const W=Math.min(window.innerWidth-24,420),H=190,x=setupCanvas(el.querySelector('#cv'),W,H);let want,f=null,p=null,t0,limit,n=0,likes=0,flash=0;
  function next(){n++;want={f:pick(SHOOT_F),p:pick(SHOOT_P)};f=null;p=null;limit=Math.max(2200,5200-n*120);t0=gnow();$('#brief').innerHTML=want.f[1]+' <b>'+want.f[2]+'</b> + '+want.p[1]+' <b>'+want.p[2]+'</b> <span class="small">'+pick(BRIEFS)+'</span>';draw()}
  function draw(){const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#fce4ec');g.addColorStop(1,'#e1bee7');x.fillStyle=g;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<6;i++){x.beginPath();x.arc(W*(i/5),H*.3+Math.sin(i)*20,18,0,7);x.fill()}
    const sc=(H-20)/170;x.save();x.translate(W/2,H-6-162*sc);x.scale(sc,sc);drawAvatar(x,S.char,S.equipped);x.restore();
    if(f){const F=SHOOT_F.filter(q=>q[0]===f)[0];x.fillStyle=F[3];x.fillRect(0,0,W,H)}
    x.font='28px serif';x.textAlign='center';if(p)x.fillText(SHOOT_P.filter(q=>q[0]===p)[0][1],W/2+48,60);
    if(flash>0){x.fillStyle='rgba(255,255,255,'+flash+')';x.fillRect(0,0,W,H)}
    x.fillStyle='#222';x.font='bold 14px sans-serif';x.textAlign='left';x.fillText('❤️ '+likes.toLocaleString()+' likes',8,18);x.textAlign='right';x.fillText('Drip '+dripScore(),W-8,18)}
  el._draw=draw;function check(){if(!f||!p)return;if(f===want.f[0]&&p===want.p[0]){const sp=Math.max(0,1-(gnow()-t0)/limit);api.pay(4+dripScore()/25+sp*4);S.stats9.shoots++;likes+=Math.round(50+dripScore()*20*(1+sp));flash=1;sfx('click')}
    else api.miss('📉 Off-brand! Client wanted '+want.f[2]+' + '+want.p[2]);next()}
  SHOOT_F.forEach(q=>padBtn($('#pf'),q[1]+'<br><span class="small">'+q[2]+'</span>',()=>{f=q[0];draw();check()}));
  SHOOT_P.forEach(q=>padBtn($('#pp'),q[1]+'<br><span class="small">'+q[2]+'</span>',()=>{p=q[0];draw();check()}));
  next();
  return{tick(dt){if(flash>0){flash=Math.max(0,flash-dt*3);draw()}const r=1-(gnow()-t0)/limit;if(r<=0){api.miss('⌛ The light is gone. Client ghosted.');next();return}setBar($('#pat'),r)},
   bot(){f=want.f[0];p=want.p[0];check()}}}

/* ---------- achievements + day hook ---------- */
ACH.push(['petparent','Pet Parent 🐾','Adopt a pet from Petcough',s=>!!s.pet],['petdiva','Pet Diva 👑','Own 3 pet accessories',s=>s.pet&&Object.keys(s.pet.acc||{}).length>=3],
 ['streak7','Streak Freak 🔥','7-day login streak',s=>s.login&&s.login.best>=7],['quester','Side Quest Enjoyer 📋','Complete 10 daily quests',s=>s.quests&&s.quests.done>=10],
 ['seasonal','Seasonal Depression Shopper 🎃','Own 5 seasonal pop-up items',s=>Object.keys(s.owned).filter(id=>ITEM[id]&&ITEM[id].season).length>=5],
 ['influencer','Influencer (Unpaid) 🤳','Nail 25 photoshoot poses',s=>s.stats9&&s.stats9.shoots>=25]);
function v9NewDay(){petNewDay();if(S.day>1&&(S.day-1)%(SEASON_WEEKS*7)===0){const se=season();notify(se.emoji+' '+se.name+' pop-up is open! Limited seasonal items + room decor.')}genQuests()}
