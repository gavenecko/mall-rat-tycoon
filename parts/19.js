/* ===== v14: fitness looks, uniforms/promotions, photo album, Shark Tonk, mall map, overlap fixes ===== */
function fitTier(){const l=(S&&S.fit&&S.fit.lvl)||0;return l>=80?3:l>=50?2:l>=25?1:0}
function drawFit(x,b,ch,t,eq){const sk=ch.skin||'#f1c27d';x.save();x.lineCap='round';
  [-1,1].forEach(f=>{x.strokeStyle=tint(sk,.68);x.lineWidth=1.3;x.beginPath();x.moveTo(f*(b.sh+3.6),103);x.quadraticCurveTo(f*(b.sh+5.6),108,f*(b.sh+5.2),114);x.stroke();
    if(t>=2){oCirc(x,f*(b.sh+6.5),120,5.6,sk)}
    if(t>=3){oRect(x,f*(b.sh+6)-5.5,110,11,6,2,'#e53935');x.fillStyle='#fff';x.fillRect(f*(b.sh+6)-5,112.3,10,1.4)}});
  if(t>=3&&!(eq&&eq.hats&&ITEM[eq.hats])){oRect(x,-29,27,58,8,3,'#e53935');x.fillStyle='#ffffff';x.fillRect(-27,30.3,54,1.6)}
  x.restore()}
const UNI_COLS=['#1e88e5','#e53935','#43a047','#fb8c00','#8e24aa','#00897b','#6d4c41','#3949ab','#d81b60'];
function drawUni(x,b,u){x.save();x.beginPath();const p=torsoPts(b,.6);x.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)x.lineTo(p[i],p[i+1]);x.closePath();x.clip();
  x.fillStyle=u.c;x.fillRect(-40,78,36,50);x.fillRect(4,78,36,50);x.restore();
  x.save();x.strokeStyle=OUT;x.lineWidth=1.4;line(x,-4,82,-4,121);line(x,4,82,4,121);x.restore();
  oRect(x,6,92,11,7,1.5,'#ffffff');x.fillStyle=u.c;for(let i=0;i<Math.min(4,u.r);i++)x.fillRect(7.5+i*2.4,96,1.6,2)}
const _dA14=drawAvatar;drawAvatar=function(x,ch,eq){if(!ch)return _dA14(x,ch,eq);
  const t=ch.fitT!=null?ch.fitT:(typeof S!=='undefined'&&S&&ch===S.char?fitTier():0),k=BODIES[ch.body]?ch.body:'average',o=BODIES[k];let r;
  if(t>0)BODIES[k]={label:o.label,sh:o.sh+t*.9,hip:o.hip};
  try{r=_dA14(x,ch,eq);const b=BODIES[k];if(ch._uni)drawUni(x,b,ch._uni);if(t>0)drawFit(x,b,ch,t,eq)}finally{BODIES[k]=o}return r};
/* corner reaction popup -> tiny face inside the toast strip (never floats over buttons) */
const _avMood14=avMood;avMood=function(m,ms){const r=_avMood14(m,ms);const p=document.getElementById('avpop');if(p){p.remove();const t=document.querySelector('#toast .tq:last-child');
  if(t&&!t.querySelector('canvas')&&S&&S.char){const c=avatarCanvas(24,30,S.char,S.equipped,false);c.classList.remove('blinky');c.style.cssText='display:inline-block;width:24px;height:30px;vertical-align:middle;margin:-6px 4px -6px 0';t.insertBefore(c,t.firstChild)}}return r};
/* careers */
const RANKS=[[1,'Trainee'],[3,'Associate'],[6,'Shift Lead'],[10,'Manager'],[15,'Regional Overlord']];
function rankOf(id){const l=jobLevel(id);let r=0;RANKS.forEach((q,i)=>{if(l>=q[0])r=i});return r}
function uniOf(id){const i=JOBS.findIndex(j=>j.id===id);return{c:UNI_COLS[(i<0?0:i)%UNI_COLS.length],r:rankOf(id)+1}}
const _endShift14=endShift;endShift=function(){const id=shift&&shift.job&&shift.job.id,b=id?rankOf(id):0;const r=_endShift14.apply(this,arguments);
  if(id){const a=rankOf(id);if(a>b){S.career=S.career||{};S.career[id]=a;toast('🎖️ Promoted to '+RANKS[a][1]+'! New uniform in 💼 Career');sfx('level');save()}}return r};
function careerSheet(){const js=JOBS.filter(j=>!j.cs&&jobState(j.id).shifts>0);
  sheet('<h3>💼 Career</h3><div class="small">Level up a job to climb the ladder. Each rank gets a fancier vest and more stripes on your name tag. Pay already grows with job level.</div>'+(js.length?'':'<div class="card">Work a shift first!</div>')+'<div id="carl"></div>');
  js.forEach(j=>{const r=rankOf(j.id),n=RANKS[r+1],d=document.createElement('div');d.className='card row';d.style.gap='10px';
    const ch=Object.assign({},S.char,{_uni:uniOf(j.id),fitT:fitTier()});d.appendChild(avatarCanvas(64,82,ch,S.equipped));
    d.insertAdjacentHTML('beforeend','<div style="flex:1"><b>'+esc(j.name)+'</b><div>'+'⭐'.repeat(r+1)+' '+RANKS[r][1]+'</div><div class="small">Lv '+jobLevel(j.id)+(n?' · '+n[1]+' at Lv '+n[0]:' · top of the ladder!')+'</div></div>');$('#carl').appendChild(d)})}
/* photo album */
function albumAdd(){S.album=S.album||[];const e={d:S.day,ch:JSON.parse(JSON.stringify(S.char)),eq:JSON.parse(JSON.stringify(S.equipped)),m:S.fitMood||'smile',ft:fitTier(),sc:dripScore()};
  const l=S.album[S.album.length-1];if(l&&l.d===e.d&&JSON.stringify(l.eq)===JSON.stringify(e.eq)){S.album[S.album.length-1]=e}else S.album.push(e);while(S.album.length>24)S.album.shift();save()}
const _fitCheck14=fitCheck;fitCheck=function(){const r=_fitCheck14.apply(this,arguments);try{albumAdd()}catch(e){}return r};
function albumSheet(){const A=S.album||[];sheet('<h3>📸 Fit album</h3><div class="small">Every Fit Check gets saved here ('+A.length+'/24). Tap a photo to re-wear it.</div>'+(A.length?'':'<div class="card">No photos yet. Do a 📸 Fit Check!</div>')+'<div class="grid" id="alb" style="grid-template-columns:repeat(3,1fr)"></div>');
  A.slice().reverse().forEach((e,ri)=>{const i=A.length-1-ri,d=document.createElement('button');d.className='card';d.style.cssText='padding:4px;text-align:center';const m=AV.mood;AV.mood=e.m;d.appendChild(avatarCanvas(84,108,Object.assign({},e.ch,{fitT:e.ft}),e.eq));AV.mood=m;
    d.insertAdjacentHTML('beforeend','<div class="small">Day '+e.d+' · drip '+e.sc+'</div>');d.onclick=()=>albumView(i);$('#alb').appendChild(d)})}
function albumView(i){const e=S.album[i];if(!e)return;const own=Object.keys(e.eq).filter(k=>e.eq[k]&&(S.owned[e.eq[k]]||0)>0);
  sheet('<h3>📸 Day '+e.d+'</h3><div class="center" id="albig"></div><div class="small center">Drip '+e.sc+' · '+own.length+'/'+Object.keys(e.eq).filter(k=>e.eq[k]).length+' pieces still in your closet</div><div class="row" style="gap:6px"><button class="btn big" id="alwear">👕 Wear this fit</button><button class="btn alt" id="aldel">🗑️ Delete</button><button class="btn alt" id="alback">◀ Album</button></div>');
  const m=AV.mood;AV.mood=e.m;$('#albig').appendChild(avatarCanvas(180,232,Object.assign({},e.ch,{fitT:e.ft}),e.eq));AV.mood=m;
  $('#alwear').onclick=()=>{own.forEach(k=>S.equipped[k]=e.eq[k]);save();toast('👕 Wearing your Day '+e.d+' fit ('+own.length+' pieces)');albumSheet()};
  $('#aldel').onclick=()=>{S.album.splice(i,1);save();albumSheet()};$('#alback').onclick=albumSheet}
/* Shark Tonk */
const PITCHES=[
 ['Uber for Hugs','Strangers hug you on demand. Surge pricing at funerals.',{gender:'male',body:'slim',skin:'#e0ac69',hair:'spiky',hairColor:'#2b1b14',beard:'stubble'}],
 ['Blockchain Toaster','Every slice of toast is an NFT. Burns bread AND the planet.',{gender:'female',body:'average',skin:'#f1c27d',hair:'bob',hairColor:'#e53935',beard:'none'}],
 ['Kombucha for Dogs','Fermented tea, but the dog is the influencer.',{gender:'nb',body:'curvy',skin:'#8d5524',hair:'afro',hairColor:'#2b1b14',beard:'none'}],
 ['Air in a Can','Bottled mall air. "Notes of pretzel and regret."',{gender:'male',body:'broad',skin:'#ffdbac',hair:'buzz',hairColor:'#e6c27a',beard:'goatee'}],
 ['SmartFork™','A fork that requires a subscription to stab.',{gender:'female',body:'slim',skin:'#c68642',hair:'long',hairColor:'#4a2c1a',beard:'none'}],
 ['Rent-a-Grandma','She judges your outfit and gives you $5.',{gender:'female',body:'round',skin:'#f1c27d',hair:'bun',hairColor:'#bdbdbd',beard:'none'}],
 ['Vape-flavored Gum','For people who want the vibe without the lungs.',{gender:'male',body:'average',skin:'#8d5524',hair:'curly',hairColor:'#2b1b14',beard:'none'}],
 ['Metaverse Mall','Buy pixels of jeans for real money. Wait…',{gender:'nb',body:'average',skin:'#ffdbac',hair:'mohawk',hairColor:'#7c4dff',beard:'none'}]];
const TONK_OUT=[[0,35,'went bankrupt 💀'],[.5,20,'pivoted to crypto, half your money survived'],[1,15,'broke even, "it was a learning experience"'],[1.5,15,'got acquired by Clamazon!'],[2,10,'went viral on Facenook!'],[6,5,'became a UNICORN 🦄']];
function tonkRoll(r){let a=0;for(const o of TONK_OUT){a+=o[1];if(r*100<a)return o}return TONK_OUT[0]}
function tonkPitch(){return PITCHES[(S.day*5+3)%PITCHES.length]}
function tonkInvest(amt,roll){const T=S.tonk;if(T.last===S.day){toast('One deal a day, champ');return false}if(!payCash(amt,'Shark Tonk'))return false;
  const p=tonkPitch(),o=tonkRoll(roll==null?Math.random():roll);T.inv.push({n:p[0],a:amt,due:S.day+3,m:o[0],t:o[2]});T.last=S.day;T.n=(T.n||0)+1;sfx('cash');toast('🦈 You invested '+money(amt)+' in '+p[0]+'. Results in 3 days.');save();return true}
function tonkResolve(){const T=S.tonk;if(!T)return;T.inv=T.inv.filter(v=>{if(S.day<v.due)return true;const g=Math.round(v.a*v.m);S.cash+=g;S.earned+=Math.max(0,g-v.a);T.hist=(T.hist||[]).concat([{n:v.n,a:v.a,g:g}]).slice(-8);toast('🦈 '+v.n+' '+v.t+' → '+money(g));return false})}
const _v10NewDay14=v10NewDay;v10NewDay=function(){_v10NewDay14();tonkResolve()};
function tonkSheet(){const T=S.tonk,p=tonkPitch(),done=T.last===S.day;
  sheet('<h3>🦈 Shark Tonk</h3><div class="small">Mall atrium, 2pm. Desperate founders. Your money. Pay off in 3 days… maybe.</div><div class="card row" style="gap:10px"><div id="tkav"></div><div style="flex:1"><b style="font-size:17px">'+esc(p[0])+'</b><div style="font-size:14px">"'+esc(p[1])+'"</div></div></div>'+
   (done?'<div class="card center">✅ You already made a deal today.</div>':'<div class="row" style="gap:6px"><button class="btn big green" data-tk="25">Invest $25</button><button class="btn big" data-tk="100">Invest $100</button></div><button class="btn alt big" id="tkout">🙅 "I\'m out."</button>')+
   '<div class="lbl">Portfolio</div>'+(T.inv.length?T.inv.map(v=>'<div class="slot"><span>'+esc(v.n)+'</span><b>'+money(v.a)+' · day '+v.due+'</b></div>').join(''):'<div class="small">No open deals.</div>')+
   ((T.hist||[]).length?'<div class="lbl">Past deals</div>'+T.hist.slice().reverse().map(h=>'<div class="slot"><span>'+esc(h.n)+'</span><b style="color:'+(h.g>=h.a?'#2e7d32':'#c62828')+'">'+money(h.a)+' → '+money(h.g)+'</b></div>').join(''):''));
  const pa=Object.assign({},p[2],{lip:'',pierce:'none',ftat:'none'});$('#tkav').appendChild(avatarCanvas(70,90,pa,{}));
  Array.prototype.forEach.call(document.querySelectorAll('[data-tk]'),b=>b.onclick=()=>{if(tonkInvest(+b.dataset.tk))tonkSheet()});const o=$('#tkout');if(o)o.onclick=()=>{closeSheet();toast('🦈 "For those reasons… I\'m out."')}}
/* mall map + fast travel */
function mapTargets(){return Array.prototype.filter.call(document.querySelectorAll('#view .lbl, #view .card > b:first-child'),e=>e.offsetParent&&e.textContent.trim()).slice(0,14).map(e=>({e:e,t:e.textContent.replace(/\s+/g,' ').trim().slice(0,22)}))}
function mapSheet(){const T=mapTargets();window.__mapT=T;const W=Math.min(330,window.innerWidth-50),cols=2,rh=34,H=Math.ceil(T.length/cols)*rh+40;
  sheet('<h3>🗺️ Mall map</h3><div class="small">Tap a wing to fast-travel there.</div><div class="center"><canvas id="mapcv" style="border-radius:12px"></canvas></div>');
  const cv=$('#mapcv'),x=setupCanvas(cv,W,H);oRect(x,1,1,W-2,H-2,12,'#fff3e0');x.fillStyle='#8d6e63';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText('🚪 ENTRANCE',W/2,H-8);
  const cw=(W-24)/cols;T.forEach((q,i)=>{const cx=10+(i%cols)*(cw+4),cy=10+Math.floor(i/cols)*rh;oRect(x,cx,cy,cw,rh-6,6,['#bbdefb','#f8bbd0','#c8e6c9','#ffe0b2','#d1c4e9'][i%5]);x.fillStyle='#3b2730';x.font='bold 12px sans-serif';x.fillText(q.t,cx+cw/2,cy+18,cw-8);q.r=[cx,cy,cw,rh-6]});
  cv.onclick=ev=>{const b=cv.getBoundingClientRect(),px=ev.clientX-b.left,py=ev.clientY-b.top;const q=T.filter(q=>px>=q.r[0]&&px<=q.r[0]+q.r[2]&&py>=q.r[1]&&py<=q.r[1]+q.r[3])[0];if(q)mapGo(q)}}
function mapGo(q){closeSheet();const hh=(document.querySelector('header')||{offsetHeight:60}).offsetHeight;window.scrollTo(0,Math.max(0,q.e.getBoundingClientRect().top+window.scrollY-hh-50));sfx('click')}
const _v12Cards14=v12Cards;v12Cards=function(){return _v12Cards14()+'<div class="card"><b>🧭 Atrium</b><div class="row" style="margin-top:6px;gap:6px"><button class="btn alt" id="mapbtn">🗺️ Mall map</button><button class="btn alt" id="tonkbtn">🦈 Shark Tonk'+(S.tonk.last===S.day?' ✓':'')+'</button></div></div>'};
const _bindV13_14=bindV13;bindV13=function(){_bindV13_14();const m=$('#mapbtn'),t=$('#tonkbtn');if(m)m.onclick=mapSheet;if(t)t.onclick=tonkSheet};
const _openMore14=openMore;openMore=function(){_openMore14();const h=$('#mStory');if(h){h.insertAdjacentHTML('afterend','<button class="btn alt big" id="mAlbum">📸 Fit album</button><button class="btn alt big" id="mCareer">💼 Career</button>');$('#mAlbum').onclick=albumSheet;$('#mCareer').onclick=careerSheet}};
function v14Fix(s){if(!s.album)s.album=[];if(!s.tonk)s.tonk={inv:[],last:0,n:0,hist:[]};if(!s.career)s.career={}}
ACH.push(['sharky','Mr. Wonderful-ish 🦈','Make 3 Shark Tonk deals',s=>s.tonk&&s.tonk.n>=3],['swole','Swole Patrol 💪','Reach fitness 80',s=>s.fit&&s.fit.lvl>=80],['promoted','Climbing the Ladder 🎖️','Reach Shift Lead in any job',s=>s.jobs&&Object.keys(s.jobs).some(k=>jobLevel(k)>=6)]);
