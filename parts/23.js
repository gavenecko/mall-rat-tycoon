/* ===== v18: rough-edge fixes (stance sleeves, full-house tours, plant weather, small side views) + coupons, fountain, robocall, CVSee receipt ===== */
/* ---- 1) power stance: sleeves follow the bent arms ---- */
const _dA18=drawAvatar;drawAvatar=function(x,ch,eq){const t=ch?(ch.fitT!=null?ch.fitT:(typeof S!=='undefined'&&S&&ch===S.char?fitTier():0)):0;if(!ch||t<3)return _dA18(x,ch,eq);
 const top=eq&&eq.tops&&ITEM[eq.tops]?ITEM[eq.tops]:null,sv=sleeves;sleeves=function(){};let r;try{r=_dA18(x,ch,eq)}finally{sleeves=sv}
 if(top&&top.shape!=='tank'){const b=BODIES[ch.body]||BODIES.average,hip=b.hip+3.2,long=top.shape!=='tee',w=top.shape==='puffer'?12:9.5;
  [-1,1].forEach(f=>{const P=[[f*(b.sh+1),86],[f*(b.sh+11),100]];if(long)P.push([f*(hip-1),112]);x.save();x.lineCap='round';x.lineJoin='round';
   const path=()=>{x.beginPath();x.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)x.lineTo(P[i][0],P[i][1])};
   path();x.strokeStyle=OUT;x.lineWidth=w+3;x.stroke();path();x.strokeStyle=fillOf(x,top);x.lineWidth=w;x.stroke();
   const e=P[P.length-1];oCirc(x,e[0],e[1],w*.45,tint(top.color,.85));x.restore()});
  // re-draw hands on hips over the cuffs
  [-1,1].forEach(f=>oCirc(x,f*hip,115,3.6,ch.skin||'#f1c27d'))}
 return r};
/* ---- 2) MRTH v2 tour codes: every room + wallpaper/floor ---- */
function roomRows(k){return(!k||k==='bed')?10+2*(S.home?S.home.size:0):(roomDef(k).rows||10)}
tourCode=function(){S.toured=1;syncRows();const R=allRooms(),rooms={};Object.keys(R).forEach(k=>{rooms[k]={room:R[k].room,wall:R[k].wall||null,floor:R[k].floor||null,rows:roomRows(k)}});
 return'MRTH:'+b64e(JSON.stringify({tv:2,n:S.char.name,ch:S.char,eq:S.equipped,room:S.room,rows:ROWS,cur:S.home.cur||'bed',ft:fitTier(),wall:S.home.wall||null,floor:S.home.floor||null,rooms:rooms}))};
function tourRooms(o){if(o.rooms&&typeof o.rooms==='object'){const ks=Object.keys(o.rooms).filter(k=>o.rooms[k]&&Array.isArray(o.rooms[k].room));if(ks.length)return ks.map(k=>({k:k,room:o.rooms[k].room,wall:o.rooms[k].wall,floor:o.rooms[k].floor,rows:o.rooms[k].rows}))}
 return[{k:o.cur||'bed',room:o.room,wall:o.wall||null,floor:o.floor||null,rows:o.rows}]}
tourDraw=function(cv,o,k){const L=tourRooms(o),R=L.filter(r=>r.k===k)[0]||L.filter(r=>r.k===o.cur)[0]||L[0];const c=24,rows=Math.max(6,Math.min(20,R.rows||10)),W=c*COLS,H=c*rows;cv.width=W*2;cv.height=H*2;cv.style.width=W+'px';cv.style.height=H+'px';const x=cv.getContext('2d');x.scale(2,2);
 const PL=(roomDef(R.k).pal)||['#f3d3e4','#fde8f1','#d9b48a','#b98d62'],wi=R.wall&&ITEM[R.wall],fi=R.floor&&ITEM[R.floor];
 if(wi)drawSurface(x,wi,0,0,W,WALL*c,c);else{x.fillStyle=PL[0];x.fillRect(0,0,W,WALL*c)}
 if(fi)drawSurface(x,fi,0,WALL*c,W,H-WALL*c,c);else{x.fillStyle=PL[2];x.fillRect(0,WALL*c,W,H-WALL*c);x.strokeStyle=PL[3];x.lineWidth=1;for(let y=WALL*c;y<H;y+=c/2)line(x,0,y,W,y)}
 x.strokeStyle=OUT;x.lineWidth=2;line(x,0,WALL*c,W,WALL*c);
 const its=(R.room||[]).filter(p=>ITEM[p.id]).map(p=>({p:p,it:ITEM[p.id]}));const LY={rug:0,wall:1,floor:2};its.sort((a,b)=>(LY[a.it.layer]||2)-(LY[b.it.layer]||2)||(a.p.y-b.p.y));its.forEach(q=>{try{drawPlaced(x,q.it,q.p,c)}catch(e){}});
 if(R.k===(o.cur||R.k)){const sc=c*2.2/170,ax=COLS-1.5,ay=rows-1;x.save();x.translate(ax*c,ay*c-150*sc);x.scale(sc,sc);try{drawAvatar(x,Object.assign({},o.ch,{fitT:o.ft||0}),o.eq||{})}catch(e){}x.restore()}return its.length};
tourView=function(code){const out=$('#tout');try{const o=tourParse(code),L=tourRooms(o);let cur=(L.filter(r=>r.k===o.cur)[0]||L[0]).k;const total=L.reduce((a,r)=>a+(r.room||[]).filter(p=>ITEM[p.id]).length,0);
 out.innerHTML='<div class="card"><b>🏠 '+esc(o.n||'Someone')+'\'s place</b> <span class="small">(read-only tour · '+L.length+' room'+(L.length>1?'s':'')+')</span>'+(L.length>1?'<div class="tabs" id="ttabs" style="margin:6px 0;flex-wrap:wrap">'+L.map(r=>{const d=roomDef(r.k);return'<button data-tr="'+esc(r.k)+'">'+d.emoji+' '+esc(d.name.split(' ').pop())+'</button>'}).join('')+'</div>':'')+'<div class="center"><canvas id="tcv" style="border-radius:10px;max-width:100%"></canvas></div><div class="small" id="tcount"></div></div>';
 const show=k=>{cur=k;const n=tourDraw($('#tcv'),o,k);Array.prototype.forEach.call(out.querySelectorAll('[data-tr]'),b=>b.classList.toggle('on',b.dataset.tr===k));$('#tcount').textContent=roomDef(k).name+': '+n+' items · '+total+' in the whole house. Rate it 10/10 to stay friends.'};
 onAll(out,'[data-tr]',b=>show(b.dataset.tr));show(cur);return total}catch(e){out.innerHTML='<div class="card small" style="color:#c62828">'+esc(e.message||'Bad code')+'</div>';return -1}};
/* ---- 3) weather affects outdoor plants ---- */
function yardPlant(it){return!!(it&&it.plant&&it.cat==='outdoor')}
const _wilt18=wiltOf;wiltOf=function(it){if(!yardPlant(it)||typeof S==='undefined'||!S.home||!S.owned[it.id])return _wilt18(it);const w=wxNow(),W=S.home.water;
 if(w==='rain'){if(W[it.id]!==S.day){W[it.id]=S.day;S.rainWatered=(S.rainWatered||0)+1}return 0}if(w==='snow'){if(W[it.id]===undefined)W[it.id]=S.day;return 0}
 if(W[it.id]===undefined)W[it.id]=S.day;return S.day-W[it.id]>=(w==='heat'?1:3)?1:0};
function plantWx(it){if(!yardPlant(it))return'';const w=wxNow();return w==='rain'?'🌧️ Rain watered it for free':w==='snow'?'❄️ Dormant — can\'t wilt in snow':w==='heat'?'🥵 Heatwave: needs water daily':''}
['tree','bush','flowerbed'].forEach(k=>{const f=HOME_DRAW[k];if(!f)return;HOME_DRAW[k]=function(x,it,X,Y,W,H){f.apply(this,arguments);let w='sun';try{w=wxNow()}catch(e){}
 if(w==='snow'){const n=k==='tree'?4:3;for(let i=0;i<n;i++){const cx=X+W*(.25+.5*i/(n-1||1)),cy=Y+H*(k==='flowerbed'?.42:k==='tree'?.18+(i%2)*.1:.3);x.fillStyle='#ffffff';x.beginPath();x.ellipse(cx,cy,W*.13,H*.06,0,Math.PI,0);x.closePath();x.fill();x.strokeStyle=OUT;x.lineWidth=1;x.stroke()}}
 else if(w==='rain'){for(let i=0;i<3;i++)oCirc(x,X+W*(.3+i*.2),Y+H*(.25+(i%2)*.15),Math.max(1.5,W*.03),'#4fc3f7')}}});
/* ---- 4) side views for small furniture & decor ---- */
const SYM18=['plant','lamp','pot','cactus','monstera','bonsai','succulent','fiddle','hanging','plushbear','squish','funko','labooboo','dino','ecan','biggulp','airtree','umbrella','clock','sushiplush','hotroll','gaspump','jerky'];
Object.assign(SIDE,{
 chair:(x,it,w,h)=>{oRect(x,w*.12,-h*.42,w*.12,h*.56,3,it.color);oRect(x,-w*.28,0,w*.52,h*.14,3,it.color);x.strokeStyle='#4e342e';x.lineWidth=Math.max(2,w*.06);x.lineCap='round';line(x,-w*.22,h*.14,-w*.26,h*.44);line(x,w*.18,h*.14,w*.2,h*.44)},
 fishtank:(x,it,w,h)=>{oRect(x,-w*.2,h*.14,w*.4,h*.32,3,it.color);oRect(x,-w*.22,-h*.36,w*.44,h*.5,3,'#81d4fa');oCirc(x,0,-h*.1,w*.06,'#ff9800')},
 laptop:(x,it,w,h)=>{oRect(x,-w*.3,h*.2,w*.6,h*.08,2,it.color);x.save();x.translate(w*.28,h*.2);x.rotate(-1.2);oRect(x,0,-h*.04,w*.55,h*.06,2,it.color);x.restore()},
 speaker:(x,it,w,h)=>{oRect(x,-w*.18,-h*.36,w*.36,h*.8,4,it.color);oRect(x,w*.12,-h*.3,w*.08,h*.68,2,tint(it.color,.6))},
 gamingpc:(x,it,w,h)=>{oRect(x,-w*.32,-h*.4,w*.64,h*.84,4,'#263238');oRect(x,-w*.24,-h*.3,w*.48,h*.5,3,'#7c4dff');[0,1,2].forEach(i=>oCirc(x,-w*.08+i*w*.08,-h*.05,w*.05,['#ff4081','#00e5ff','#76ff03'][i]))},
 console:(x,it,w,h)=>{oRect(x,-w*.14,-h*.3,w*.28,h*.7,4,it.color);oRect(x,w*.1,-h*.24,w*.06,h*.56,2,tint(it.color,.7))},
 vr:(x,it,w,h)=>{oRect(x,-w*.3,-h*.12,w*.42,h*.3,6,it.color);x.strokeStyle=OUT;x.lineWidth=2;x.beginPath();x.arc(w*.12,0,w*.2,-1.4,1.4);x.stroke()},
 phone:(x,it,w,h)=>{oRect(x,-w*.04,-h*.3,w*.08,h*.6,2,it.color)},pphone:(x,it,w,h)=>{oRect(x,-w*.04,-h*.3,w*.08,h*.6,2,it.color)},
 alexuh:(x,it,w,h)=>{oRect(x,-w*.18,-h*.3,w*.36,h*.66,w*.1,it.color);oRect(x,-w*.18,-h*.32,w*.36,h*.08,3,'#4fc3f7')},
 roomburr:(x,it,w,h)=>{oRect(x,-w*.38,h*.12,w*.76,h*.16,4,it.color);oCirc(x,-w*.26,h*.3,w*.06,'#424242');oCirc(x,w*.26,h*.3,w*.06,'#424242')},
 wheelz:(x,it,w,h)=>{oRect(x,-w*.34,-h*.02,w*.68,h*.16,4,it.color);oCirc(x,-w*.2,h*.2,w*.08,'#212121');oCirc(x,w*.2,h*.2,w*.08,'#212121')}});
['gstation','xboxx','nswitch'].forEach(k=>SIDE[k]=SIDE.console);
const _side18=sideView;sideView=function(x,it,w,h){if(SIDE[it.shape])return SIDE[it.shape](x,it,w,h);if(SYM18.indexOf(it.shape)>=0||it.plant)return drawFurn(x,it,-w/2,-h/2,w,h);
 if(it.w===1&&it.h===1){oRect(x,w*.02,-h*.36,w*.2,h*.76,3,tint(it.color||'#9e9e9e',.65));x.save();x.translate(-w*.12,0);x.scale(.5,1);drawFurn(x,it,-w/2,-h/2,w,h);x.restore();return}
 return _side18(x,it,w,h)};
/* ---- 5) Extreme Clippin' coupon book ---- */
function coupToday(){if(!S.coup||S.coup.day!==S.day){const r=rng(hash('coup')+S.day*131),st=STORES.filter(s=>!s.fake&&s.id!=='circlej'),c=[];while(c.length<3&&st.length){const s=st.splice(Math.floor(r()*st.length),1)[0];c.push({s:s.id,off:[10,15,20,25][Math.floor(r()*4)],used:0})}
 S.coup={day:S.day,c:c,clip:[],saved:(S.coup&&S.coup.saved)||0,n:(S.coup&&S.coup.n)||0}}return S.coup}
function coupFor(it){if(!it||!it.store||typeof S==='undefined'||!S||!S.coup||S.coup.day!==S.day)return null;return S.coup.c.filter((q,i)=>!q.used&&S.coup.clip.indexOf(i)>=0&&q.s===it.store)[0]||null}
const _priceOf18=priceOf;priceOf=function(it){const p=_priceOf18(it);try{const q=coupFor(it);if(q)return Math.max(1,Math.round(p*(100-q.off)/100))}catch(e){}return p};
const _grant18=grant;grant=function(it,p){try{const q=coupFor(it);if(q){q.used=1;const full=_priceOf18(it);S.coup.saved+=Math.max(0,full-p);S.coup.n++;S.rcpt=(S.rcpt||0)+1.5}}catch(e){}try{S.rcpt=(S.rcpt||0)+.6+Math.min(3,(p||0)/400)}catch(e){}return _grant18.apply(this,arguments)};
function storeName(id){const s=STORES.filter(s=>s.id===id)[0];return s?s.name:id}
function coupSheet(){const C=coupToday();sheet('<h3>✂️ Extreme Clippin\'</h3><div class="small">Today\'s coupon book. Clip up to 2 — they apply automatically at checkout, one item each. Expires at midnight (mall time).</div><div class="center"><canvas id="coupcv" width="280" height="90" style="width:140px;height:45px"></canvas></div>'+
 C.c.map((q,i)=>{const on=C.clip.indexOf(i)>=0;return'<div class="card row" style="gap:8px;border:2px dashed #3b2730"><span style="font-size:22px">✂️</span><div style="flex:1"><b>'+q.off+'% off</b> at '+esc(storeName(q.s))+'<div class="small">'+(q.used?'Redeemed. You are a savings god.':on?'Clipped — buy anything there':'Not clipped')+'</div></div>'+(q.used?'<b class="small">USED</b>':'<button class="btn'+(on?' alt':'')+'" data-cp="'+i+'">'+(on?'Unclip':'Clip')+'</button>')+'</div>'}).join('')+
 '<div class="slot"><span>Lifetime saved</span><b>'+money(C.saved)+'</b></div><div class="slot"><span>Coupons redeemed</span><b>'+C.n+'</b></div>');
 const cv=$('#coupcv');if(cv){const x=cv.getContext('2d');oRect(x,10,10,260,70,8,'#fff59d');x.setLineDash([6,4]);x.strokeStyle=OUT;x.lineWidth=2;rr(x,18,18,244,54,6);x.stroke();x.setLineDash([]);x.fillStyle=OUT;x.font='bold 22px sans-serif';x.textAlign='center';x.fillText('SAVE $$$',140,54);oCirc(x,30,45,8,'#b0bec5')}
 onAll($('#sheet'),'[data-cp]',b=>{const i=+b.dataset.cp,k=C.clip.indexOf(i);if(k>=0)C.clip.splice(k,1);else{if(C.clip.length>=2){toast('Max 2 clipped. This isn\'t TLC.');return}C.clip.push(i)}sfx('click');save();coupSheet()})}
/* ---- 6) Wishing fountain (no cash prizes, just vibes) ---- */
const FORTUNES=['You will find a parking spot near the entrance. Then lose it.','A sale is coming. It is 5% off. Act surprised.','Someone at the food court will ask for your sample. Say no.','Your next shirt will shrink in the wash. Destiny.','The escalator will be broken. Take the stairs, champion.','You will reply-all. It will be fine.','A stranger compliments your shoes. They want the shoes.','Your cart has a wobbly wheel. It builds character.','You will forget why you came to the mall. Buy a pretzel anyway.','The fitting room line will be short. Savor it.'];
function fountToss(){S.fount=S.fount||{day:0,n:0,back:0,seen:{}};const f=S.fount;if(f.day===S.day){toast('One wish a day. The fountain has a union.');return null}if(S.cash<1){toast('You need $1. Check the couch cushions.');return null}
 S.cash-=1;f.day=S.day;f.n++;const r=rng(hash('fount')+S.day*977)(),i=Math.floor(r*FORTUNES.length);f.seen[i]=1;let back=false;if(((S.day*7)%5)===0){S.cash+=1;f.back++;back=true}
 const msg='⛲ '+FORTUNES[i]+(back?' (A kid fished your dollar out and handed it back, wet.)':'');sfx('coin');toast(msg);save();return{i:i,back:back,msg:msg}}
function fountSheet(){S.fount=S.fount||{day:0,n:0,back:0,seen:{}};const f=S.fount;sheet('<h3>⛲ Mall wishing fountain</h3><div class="small">Toss $1, get a fortune. It never pays out — it\'s a fountain, not a slot machine. 1 wish per day.</div><div class="center"><canvas id="fntcv" width="240" height="140" style="width:120px;height:70px"></canvas></div><button class="btn" id="ftoss" style="width:100%"'+(f.day===S.day?' disabled':'')+'>'+(f.day===S.day?'Come back tomorrow':'🪙 Toss $1')+'</button><div id="fout" class="card small">'+(f.last?esc(f.last):'The water smells faintly of Cinnabon.')+'</div><div class="slot"><span>Wishes made</span><b>'+f.n+'</b></div><div class="slot"><span>Fortunes collected</span><b>'+Object.keys(f.seen).length+'/'+FORTUNES.length+'</b></div>');
 const x=$('#fntcv').getContext('2d');oRect(x,20,80,200,50,20,'#90a4ae');oRect(x,34,88,172,26,12,'#4fc3f7');oRect(x,110,30,20,60,4,'#b0bec5');oCirc(x,120,28,14,'#cfd8dc');[0,1,2].forEach(i=>oCirc(x,80+i*40,100,5,'#ffd54f'));
 $('#ftoss').onclick=()=>{const o=fountToss();if(o){f.last=o.msg;save();fountSheet()}}}
/* ---- 7) Extended-warranty robocall encounter ---- */
NPCS.robocall={n:'"Car Warranty Dept." (on your phone)',ch:{gender:'male',body:'average',skin:'#e0ac69',hair:'short',hairColor:'#5d4037',beard:'mustache'}};
ENC.push({k:'robocall',line:'*ring* "We\'ve been trying to reach you concerning your vehicle\'s extended warranty. Press 1 to—"',a:['Hang up','Press 1'],r:[g=>(S.hungUp=(S.hungUp||0)+1,{msg:'You hung up. Your phone gained +5 respect.',cash:0}),g=>g?{msg:'You got a human, kept them on hold for 40 min. They hung up on YOU. Victory.',cash:0}:{msg:'You bought a "warranty" for a car you rent. -$25',cash:-25}]});
/* ---- 8) CVSee receipt length ---- */
function rcptFt(){return Math.round((S.rcpt||0)*10)/10}
function rcptCard(){const f=rcptFt();return'<div class="card row" id="rcptcard" style="gap:10px"><canvas id="rcptcv" width="40" height="96" style="width:20px;height:48px"></canvas><div style="flex:1"><b>🧾 CVSee receipt: '+f+' ft</b><div class="small">Every purchase adds coupons nobody asked for. '+(f>=10?'It\'s now a scarf.':f>=3?'Longer than your arm.':'Still pocket-sized. For now.')+'</div></div></div>'}
function rcptDraw(){const c=$('#rcptcv');if(!c)return;const x=c.getContext('2d'),L=Math.min(90,10+rcptFt()*6);oRect(x,6,3,28,L,2,'#fafafa');x.strokeStyle='#9e9e9e';x.lineWidth=1;for(let y=10;y<L;y+=6)line(x,10,y,30,y)}
/* ---- wiring ---- */
const _v12Cards18=v12Cards;v12Cards=function(){return _v12Cards18()+'<div class="card"><b>🛍️ Concourse</b><div class="row" style="margin-top:6px;gap:6px"><button class="btn alt" id="coupbtn">✂️ Coupons'+(S.coup&&S.coup.day===S.day&&S.coup.clip.length?' · '+S.coup.clip.length:'')+'</button><button class="btn alt" id="fntbtn">⛲ Fountain'+(S.fount&&S.fount.day===S.day?' ✓':'')+'</button></div></div>'+rcptCard()};
const _bindV13_18=bindV13;bindV13=function(){_bindV13_18();const a=$('#coupbtn');if(a)a.onclick=()=>{sfx('click');coupSheet()};const b=$('#fntbtn');if(b)b.onclick=()=>{sfx('click');fountSheet()};rcptDraw()};
function v18Fix(s){if(!s.fount)s.fount={day:0,n:0,back:0,seen:{}};if(s.rcpt==null)s.rcpt=0;if(s.hungUp==null)s.hungUp=0;if(s.rainWatered==null)s.rainWatered=0}
ACH.push(['coupon','Extreme Clipper ✂️','Redeem 5 coupons',s=>s.coup&&s.coup.n>=5],['fountain','Fountain Regular ⛲','Make 7 wishes',s=>s.fount&&s.fount.n>=7],['hangup','Not Today, Warranty 📵','Hang up on the robocall',s=>s.hungUp>=1],['receipt','Receipt Scarf 🧾','Grow a 10 ft CVSee receipt',s=>(s.rcpt||0)>=10],['rainy2','Let It Rain 🌧️','Have rain water your yard plants',s=>(s.rainWatered||0)>=1]);
WX.rain.d+=' Yard plants get watered for free.';WX.snow.d+=' Yard plants go dormant (no wilting).';WX.heat.d+=' Yard plants wilt after 1 day without water.';
