/* ===== v11: facial hair, Supercutz barber & glam, emotes, neighbor gifting, trend report, claw arcade ===== */
const BEARDS={none:'None',stubble:'Stubble',mustache:'Mustache',handlebar:'Handlebar',goatee:'Goatee',chinstrap:'Chin strap',full:'Full beard',wizard:'Wizard beard',mutton:'Mutton chops',soul:'Soul patch'};
HAIR_COLORS.push(['Ginger','#d9692b'],['Platinum','#f1ead2'],['Teal','#1fa59a'],['Cherry','#c2185b'],['Mint','#7fe0b8']);
HAIRS.mohawk='Mohawk';HAIRS.mullet='Mullet';HAIRS.pigtails='Pigtails';
const LIPS=[['None',''],['Rose','#d84a6b'],['Red','#c62828'],['Plum','#7b2a5a'],['Nude','#c98a76'],['Black','#2b2b2b']];
function beardCol(ch){return ch.beardColor||ch.hairColor}
function v11Mus(x,w,y){x.beginPath();x.moveTo(-w,y+2.5);x.quadraticCurveTo(-6,y-2.6,0,y);x.quadraticCurveTo(6,y-2.6,w,y+2.5);x.quadraticCurveTo(6,y+1.6,0,y+2.6);x.quadraticCurveTo(-6,y+1.6,-w,y+2.5);x.closePath()}
function v11Full(x,bot){x.beginPath();x.moveTo(-30,50);x.lineTo(-29,61);x.quadraticCurveTo(-27,bot>100?100:86,0,bot);x.quadraticCurveTo(27,bot>100?100:86,29,61);x.lineTo(30,50);x.lineTo(25,52);
  x.quadraticCurveTo(21,64,12,67);x.quadraticCurveTo(0,72.5,-12,67);x.quadraticCurveTo(-21,64,-25,52);x.closePath()}
function v11Stroke(x,c,w,fn){x.strokeStyle=OUT;x.lineWidth=w+2.4;x.lineCap='round';fn();x.stroke();x.strokeStyle=c;x.lineWidth=w;fn();x.stroke()}
function drawBeard(x,ch){const s=ch&&ch.beard;if(!s||s==='none'||!BEARDS[s])return;const c=beardCol(ch);x.save();x.globalAlpha=1;x.lineJoin='round';
  const fill=()=>{x.fillStyle=c;x.fill();x.strokeStyle=OUT;x.lineWidth=1.2;x.stroke()};
  if(s==='stubble'){v11Full(x,84);x.save();x.clip();x.fillStyle=c;for(let yy=48;yy<86;yy+=2.6)for(let xx=-30;xx<31;xx+=2.6){const j=((xx*7+yy*13)|0)%3;x.fillRect(xx+j*.4,yy+(j-1)*.4,1.2,1.2)}x.restore()}
  else if(s==='mustache'){v11Mus(x,11,59.5);fill()}
  else if(s==='handlebar'){v11Stroke(x,c,2.6,()=>{x.beginPath();x.moveTo(-12,61.5);x.quadraticCurveTo(-18,62,-19,57.5);x.arc(-16.5,57.5,2.5,Math.PI,Math.PI*1.9)});
    v11Stroke(x,c,2.6,()=>{x.beginPath();x.moveTo(12,61.5);x.quadraticCurveTo(18,62,19,57.5);x.arc(16.5,57.5,2.5,0,-Math.PI*.9,true)});v11Mus(x,13,59);fill()}
  else if(s==='goatee'){v11Mus(x,10,59.5);fill();x.beginPath();x.moveTo(-7,68.5);x.quadraticCurveTo(0,66.5,7,68.5);x.lineTo(5.5,77.5);x.quadraticCurveTo(0,81.5,-5.5,77.5);x.closePath();fill()}
  else if(s==='chinstrap'){v11Stroke(x,c,4,()=>{x.beginPath();x.arc(0,48,28,Math.PI*.04,Math.PI*.96)})}
  else if(s==='full'||s==='wizard'){v11Full(x,s==='wizard'?138:90);fill();if(s==='wizard'){x.strokeStyle=tint(c,.75);x.lineWidth=1;[-8,0,8].forEach(d=>{x.beginPath();x.moveTo(d*1.4,82);x.quadraticCurveTo(d,105,d*.4,125);x.stroke()})}v11Mus(x,13,59);fill()}
  else if(s==='mutton'){[-1,1].forEach(f=>{x.beginPath();x.moveTo(f*30.5,44);x.lineTo(f*30,60);x.quadraticCurveTo(f*28,72,f*17,69);x.quadraticCurveTo(f*13,64,f*19,61);x.lineTo(f*23.5,44);x.closePath();fill()});v11Mus(x,13,59.5);fill()}
  else if(s==='soul'){x.beginPath();x.moveTo(-3,68.5);x.lineTo(3,68.5);x.lineTo(0,74.5);x.closePath();fill()}
  x.restore()}
function drawLips(x,ch){if(!ch||!ch.lip||AV.mood==='happy'||AV.mood==='love'||AV.mood==='dance')return;x.save();x.globalAlpha=1;x.fillStyle=ch.lip;x.strokeStyle=OUT;x.lineWidth=.8;
  if(AV.mood==='wow'){ell(x,0,66,3.6,4.4);x.fill();x.stroke();x.fillStyle='#5a1a1a';ell(x,0,66,2,2.6);x.fill()}
  else{x.beginPath();x.moveTo(-5.5,64);x.quadraticCurveTo(-2.5,61.6,0,62.8);x.quadraticCurveTo(2.5,61.6,5.5,64);x.quadraticCurveTo(0,68.4,-5.5,64);x.closePath();x.fill();x.stroke()}
  x.restore()}
/* emote faces layered over the base face */
const EMOTES=[['happy','😄','Happy'],['wow','😮','Wow'],['sad','😢','Sad'],['angry','😠','Mad'],['love','😍','Love'],['dance','💃','Dance']];
const _drawHead=drawHead;
drawHead=function(x,ch){const m=AV.mood,nm=m==='sad'||m==='angry'||m==='love'||m==='dance';if(nm)AV.mood=m==='love'||m==='dance'?'happy':'smile';_drawHead(x,ch);AV.mood=m;
  x.save();x.globalAlpha=1;
  if(m==='sad'||m==='angry'){x.fillStyle=ch.skin;ell(x,0,65.5,6.5,3.6);x.fill();x.strokeStyle='#8a3b2b';x.lineWidth=1.8;x.lineCap='round';x.beginPath();if(m==='sad')x.arc(0,69,4.5,1.2*Math.PI,1.8*Math.PI);else{x.moveTo(-4.5,65.5);x.lineTo(4.5,65.5)}x.stroke()}
  if(m==='sad'){[-1,1].forEach(f=>{x.fillStyle='#4fc3f7';x.strokeStyle=OUT;x.lineWidth=.8;x.beginPath();x.moveTo(f*13,61);x.quadraticCurveTo(f*15.5,66,f*13,67);x.quadraticCurveTo(f*10.5,66,f*13,61);x.fill();x.stroke()})}
  if(m==='angry'){[-1,1].forEach(f=>{x.strokeStyle='#2b2b2b';x.lineWidth=2.6;x.lineCap='round';line(x,f*5,50,f*15,46)})}
  if(m==='love'){[-1,1].forEach(f=>{const ex=f*11,ey=56;x.fillStyle='#e91e63';x.strokeStyle=OUT;x.lineWidth=.9;x.beginPath();x.moveTo(ex,ey+5);x.bezierCurveTo(ex-8,ey-1,ex-3,ey-6,ex,ey-2);x.bezierCurveTo(ex+3,ey-6,ex+8,ey-1,ex,ey+5);x.fill();x.stroke()})}
  x.restore();drawLips(x,ch)};
const _drawAvatar=drawAvatar;
drawAvatar=function(x,ch,eq){const bob=AV.mood==='dance'?Math.sin(Date.now()/90)*3:0;if(bob){x.save();x.translate(0,bob);x.rotate(Math.sin(Date.now()/180)*.06)}
  const h=eq&&eq.hats,hf=hairFront;hairFront=function(x2,c2){drawBeard(x2,c2);hf(x2,c2)};try{_drawAvatar(x,ch,eq)}finally{hairFront=hf}if(bob)x.restore()};
/* extra hairstyles */
const _hairBack=hairBack,_hairFront=hairFront;
hairBack=function(x,ch){const h=ch.hair;if(h==='mullet'){x.fillStyle=ch.hairColor;x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;rr(x,-27,46,54,40,12);x.fill();x.stroke();return}
  if(h==='pigtails'){x.fillStyle=ch.hairColor;x.strokeStyle='rgba(0,0,0,.25)';[-1,1].forEach(f=>{x.beginPath();x.ellipse(f*38,60,8,18,f*.35,0,Math.PI*2);x.fill();x.stroke()});return}
  if(h==='mohawk')return;_hairBack(x,ch)};
hairFront=function(x,ch){const h=ch.hair;if(h==='mohawk'){x.fillStyle=tint(ch.hairColor,.8);x.beginPath();x.arc(0,48,31,Math.PI*1.1,Math.PI*1.9);x.closePath();x.fill();
    x.fillStyle=ch.hairColor;x.strokeStyle=OUT;x.lineWidth=1.2;x.beginPath();x.moveTo(-6,22);[[-5,4],[-2,14],[0,-2],[2,14],[5,4],[6,22]].forEach(p=>x.lineTo(p[0],p[1]));x.quadraticCurveTo(0,20,-6,22);x.closePath();x.fill();x.stroke();return}
  _hairFront(x,Object.assign({},ch,{hair:h==='mullet'?'short':h==='pigtails'?'bob':h}))};
/* ---------- Supercutz barber & glam ---------- */
const BARBER={beard:12,beardColor:8,hair:20,hairColor:25,lip:10};
function barberCost(a,b){let t=0;Object.keys(BARBER).forEach(k=>{if((a[k]||'')!==(b[k]||'')&&!(k==='beard'&&(a[k]||'none')===(b[k]||'none')))t+=BARBER[k]});return t}
function barberCard(){return'<div class="card row" id="barbercard" style="background:linear-gradient(120deg,#37474f,#e53935);color:#fff"><span style="font-size:34px">💈</span><div style="flex:1"><b>Supercutz & Glam</b><div class="small" style="color:#fff">Beards, cuts, dye & lipstick. Pay only for what you change.</div></div><button class="btn alt" id="barberbtn">Walk in</button></div>'+
  '<div class="card row" id="arcadecard" style="background:linear-gradient(120deg,#311b92,#00bcd4);color:#fff"><span style="font-size:34px">🕹️</span><div style="flex:1"><b>Dave & Busted Arcade</b><div class="small" style="color:#fff">Claw machine: '+money(CLAW_COST)+' a try. Win real decor (sometimes).</div></div><button class="btn alt" id="arcadebtn">Play</button></div>'}
let barbDraft=null;
function barberSheet(){if(!S.char)return;if(!barbDraft)barbDraft=Object.assign({beard:'none',beardColor:null,lip:''},S.char);const d=barbDraft,cost=barberCost(S.char,d);
  const chips=(obj,key)=>Object.keys(obj).map(k=>'<button class="chip '+((d[key]||'none')===k||(d[key]===k)?'on':'')+'" data-bk="'+key+'" data-v="'+k+'">'+(typeof obj[k]==='string'?obj[k]:k)+'</button>').join('');
  const sws=(list,key,match)=>(match?'<button class="chip '+(!d[key]?'on':'')+'" data-bk="'+key+'" data-v="">'+match+'</button>':'')+list.map(h=>h[1]?'<button class="sw '+(d[key]===h[1]?'on':'')+'" title="'+h[0]+'" style="background:'+h[1]+'" data-bk="'+key+'" data-v="'+h[1]+'"></button>':'').join('');
  sheet('<h3>💈 Supercutz & Glam</h3><div class="small">"We cut hair. Sometimes on purpose." Beard '+money(BARBER.beard)+' · beard dye '+money(BARBER.beardColor)+' · cut '+money(BARBER.hair)+' · dye '+money(BARBER.hairColor)+' · lipstick '+money(BARBER.lip)+'</div><div class="center" id="bpv"></div>'+
   '<div class="lbl">🧔 Facial hair</div><div class="chips" id="bbd">'+chips(BEARDS,'beard')+'</div><div class="lbl">Beard color</div><div class="sws" id="bbc">'+sws(HAIR_COLORS,'beardColor','Match hair')+'</div>'+
   '<div class="lbl">✂️ Hairstyle</div><div class="chips" id="bhs">'+chips(HAIRS,'hair')+'</div><div class="lbl">🎨 Hair dye</div><div class="sws" id="bhc">'+sws(HAIR_COLORS,'hairColor')+'</div>'+
   '<div class="lbl">💄 Lipstick</div><div class="sws" id="blp">'+sws(LIPS,'lip','None')+'</div>'+
   '<button class="btn big" id="bpay" style="margin-top:10px" '+(cost?'':'disabled')+'>'+(cost?'Pay '+money(cost)+' & keep the look':'Pick a change')+'</button>');
  $('#bpv').appendChild(avatarCanvas(150,190,d,S.equipped));
  onAll($('#sheet'),'[data-bk]',b=>{d[b.dataset.bk]=b.dataset.v||(b.dataset.bk==='beardColor'?null:'');sfx('click');barberSheet()});
  $('#bpay').onclick=()=>{const c=barberCost(S.char,d);if(!c||!payCash(c,'the barber'))return;S.char=Object.assign({},d);barbDraft=null;S.stats11.cuts++;sfx('level');toast('💈 Fresh look! -'+money(c));avMood('happy');closeSheet();save();rerender()}}
/* ---------- claw machine ---------- */
const CLAW_COST=3;
function clawPrizePool(){return ITEMS.filter(i=>!i.slot&&(i.cat==='decor'||i.cat==='plants')&&i.price<=45&&!i.drop&&!i.rare)}
function clawResult(dx,roll){return Math.abs(dx)<=16&&roll<.55}
function arcadeSheet(){const W=Math.min(300,window.innerWidth-60),H=210;sheet('<h3>🕹️ Dave & Busted: Claw-some</h3><div class="small">Tap DROP when the claw is over a plushie. Grip strength: "emotionally unavailable". '+money(CLAW_COST)+' per try. Wins: '+S.stats11.claw+'</div><div class="center"><canvas id="clawcv" style="border-radius:14px;touch-action:none"></canvas></div><button class="btn big" id="clawgo">▼ DROP ('+money(CLAW_COST)+')</button>');
  const cv=$('#clawcv'),x=setupCanvas(cv,W,H),cols=['#ff8a80','#ffd54f','#81d4fa','#a5d6a7','#ce93d8'],prizes=[0,1,2,3,4].map(i=>({x:30+i*(W-60)/4,c:cols[i]}));let st={cx:W/2,y:20,ph:'move',t0:Date.now(),hold:null,res:null};
  function plush(px,py,c){x.save();x.globalAlpha=1;x.fillStyle=c;x.strokeStyle=OUT;x.lineWidth=1.5;circ(x,px-9,py-14,6);x.fill();x.stroke();circ(x,px+9,py-14,6);x.fill();x.stroke();circ(x,px,py,15);x.fill();x.stroke();
    x.fillStyle='#2b2b2b';circ(x,px-5,py-3,2);x.fill();circ(x,px+5,py-3,2);x.fill();x.fillStyle='#fff';ell(x,px,py+5,4,3);x.fill();x.restore()}
  function frame(){if(!document.body.contains(cv))return;const t=(Date.now()-st.t0)/1000;x.globalAlpha=1;x.fillStyle='#1a237e';x.fillRect(0,0,W,H);x.fillStyle='#283593';for(let i=0;i<W;i+=20)x.fillRect(i,0,10,H);x.fillStyle='#0d1440';x.fillRect(0,H-26,W,26);
    if(st.ph==='move')st.cx=W/2+Math.sin(t*1.7)*(W/2-28);else if(st.ph==='drop'){st.y+=5;if(st.y>=H-60){st.ph='up';const near=prizes.filter(p=>!p.gone).sort((a,b)=>Math.abs(a.x-st.cx)-Math.abs(b.x-st.cx))[0];if(near&&clawResult(near.x-st.cx,Math.random())){st.hold=near;near.gone=1}}}
    else if(st.ph==='up'){st.y-=4;if(st.y<=20){st.ph='done';clawDone(st.hold)}}
    prizes.forEach(p=>{if(!p.gone)plush(p.x,H-42,p.c)});
    x.strokeStyle='#cfd8dc';x.lineWidth=3;line(x,st.cx,0,st.cx,st.y);x.fillStyle='#b0bec5';x.strokeStyle=OUT;x.lineWidth=1.5;rr(x,st.cx-10,st.y-4,20,9,3);x.fill();x.stroke();
    x.strokeStyle='#cfd8dc';x.lineWidth=3;line(x,st.cx-8,st.y+5,st.cx-13,st.y+18);line(x,st.cx+8,st.y+5,st.cx+13,st.y+18);if(st.hold)plush(st.cx,st.y+30,st.hold.c);
    if(st.ph!=='done')requestAnimationFrame(frame)}
  frame();$('#clawgo').onclick=()=>{if(st.ph!=='move')return;if(!payCash(CLAW_COST,'the claw'))return;S.stats11.plays++;st.ph='drop';$('#clawgo').disabled=true;sfx('click')}}
function clawDone(won){if(won){const pool=clawPrizePool(),it=pool[Math.floor(Math.random()*pool.length)];if(it){S.owned[it.id]=(S.owned[it.id]||0)+1;S.stats11.claw++;sfx('level');burst&&burst(14);toast('🧸 WON: '+it.name+'! Check your room')}}else{sfx('bad');toast(pick(['The claw said no.','So close. The claw is a liar.','Rigged? Never. (Yes.)']))}
  save();setTimeout(()=>{if(!$('#sheet').hidden&&$('#clawcv'))arcadeSheet()},900)}
/* ---------- trend report ---------- */
const TREND_SHAPES=['blazer','hoodie','tank','puffer','joggers','shorts','skirt','jeans','boots','heels','loafers','slides','chain','sunglasses','handbag','scarf','cowboy','cap','beanie','tee','sweater','sneakers','watch','bucket','tophat'];
const TREND_LINES=['TikTak says it\'s giving main character.','Seen on 3 influencers and 1 confused dad.','A celebrity wore it to a gas station.','Fashion week but make it the food court.'];
function trend(){const w=weekNo(),r=rng(hash('trend')+w*104729);const a=TREND_SHAPES.slice(),pk=()=>a.splice(Math.floor(r()*a.length),1)[0];return{hot:pk(),hot2:pk(),out:pk(),line:TREND_LINES[Math.floor(r()*TREND_LINES.length)]}}
function trendMult(it){if(!it||!it.slot)return 1;const t=trend();return it.shape===t.hot?1.6:it.shape===t.hot2?1.3:it.shape===t.out?.6:1}
const _demand=demand;demand=function(it){return _demand(it)*trendMult(it)};
function trendCard(){const t=trend(),cap=s=>s.charAt(0).toUpperCase()+s.slice(1)+(/s$/.test(s)?'':'s');return'<div class="card" id="trendcard" style="background:linear-gradient(120deg,#ff6f00,#ffca28);color:#3b2730"><b>📈 Trend Report · week '+weekNo()+'</b><div class="small" style="color:#3b2730">🔥 <b>'+cap(t.hot)+'</b> are IN (resale demand ×1.6) · ✨ '+cap(t.hot2)+' rising (×1.3) · 🧊 '+cap(t.out)+' are OUT (×0.6). '+t.line+'</div></div>'}
const _renderHustle=renderHustle;renderHustle=function(v){_renderHustle(v);const h=v.querySelector('.bhead');if(h)h.insertAdjacentHTML('afterend',trendCard())};
/* ---------- neighbor gifting ---------- */
const WRAPS=[{k:'bag',n:'Grocery bag',em:'🛍️',p:0,m:1},{k:'paper',n:'Wrapping paper',em:'🎁',p:5,m:1.3},{k:'fancy',n:'Fancy box + bow',em:'🎀',p:25,m:1.8}];
function nbLikes(n,it){const l=n.likes;return l==='expensive'?it.price>=150:l==='electronics'?it.cat==='electronics':l==='plants'?it.cat==='plants':l==='outdoor'?(it.cat==='outdoor'||it.cat==='exterior'):l==='few'?it.price<=30:false}
function giftScore(n,it,wrap){const w=WRAPS.filter(x=>x.k===wrap)[0]||WRAPS[0];let pts=1;if(nbLikes(n,it))pts+=2;if(trendMult(it)>1)pts+=1;return Math.max(1,Math.round(pts*w.m))}
function friendBonus(){let t=0;NEIGHBORS.forEach(n=>{t+=Math.floor((S.friends[n.k]||0)/2)});return Math.min(5,t)}
const _homeScore=homeScore;homeScore=function(){return Math.min(100,_homeScore()+(S.friends?friendBonus():0))};
function giveGift(k,id,wrap){const n=NEIGHBORS.filter(x=>x.k===k)[0],it=ITEM[id],w=WRAPS.filter(x=>x.k===wrap)[0];if(!n||!it||!w||!S.owned[id])return false;
  if(S.giftDay[k]===S.day){toast(n.name.split(' ')[0]+' already got a gift today');return false}if(w.p&&!payCash(w.p,'wrapping'))return false;
  const pts=giftScore(n,it,wrap);removeOne(id);S.giftDay[k]=S.day;S.friends[k]=Math.min(10,(S.friends[k]||0)+pts);S.stats11.gifts++;
  const back=nbLikes(n,it)?Math.round(it.price*.25*w.m):0;if(back){S.cash+=back;S.earned+=back}
  const msg=n.face+' '+n.name.split(' ')[0]+': '+(nbLikes(n,it)?pick(['OMG how did you KNOW?!','This is literally my whole personality.','I\'m framing the wrapping too.']):pick(['Oh! A… thing. Thank you!','I will treasure it. Probably.','How thoughtful. What is it?']))+' (+'+pts+' ❤️'+(back?', they slipped you '+money(back)+' "for gas"':'')+')';
  notify(msg);sfx('level');toast(msg);save();return pts}
function giftSheet(k){const n=NEIGHBORS.filter(x=>x.k===k)[0];let wrap=giftSheet.w||'paper';const own=Object.keys(S.owned).map(id=>ITEM[id]).filter(i=>i&&!i.fake).sort((a,b)=>nbLikes(n,b)-nbLikes(n,a));
  sheet('<h3>🎁 Gift for '+n.face+' '+esc(n.name)+'</h3><div class="small">Friendship: '+'❤️'.repeat(Math.ceil((S.friends[k]||0)/2))+' '+(S.friends[k]||0)+'/10. Every 2 ❤️ across the block = +1 home rating (max +5). Likes: <b>'+n.likes+'</b>. One gift per neighbor per day.</div>'+
   '<div class="lbl">Wrap it</div><div class="chips">'+WRAPS.map(w=>'<button class="chip '+(w.k===wrap?'on':'')+'" data-wr="'+w.k+'">'+w.em+' '+w.n+(w.p?' '+money(w.p):' free')+'</button>').join('')+'</div>'+
   '<div class="lbl">Pick something you own</div><div class="grid">'+(own.length?own.slice(0,40).map(it=>'<div class="item"><img alt="" src="'+thumb(it)+'"><div class="nm">'+esc(it.name)+'</div><div class="small">'+(nbLikes(n,it)?'💖 they\'d love it':'meh?')+'</div><button class="btn" data-gi="'+it.id+'">Give</button></div>').join(''):'<div class="card">Nothing to give yet.</div>')+'</div>');
  onAll($('#sheet'),'[data-wr]',b=>{giftSheet.w=b.dataset.wr;giftSheet(k)});onAll($('#sheet'),'[data-gi]',b=>{if(giveGift(k,b.dataset.gi,giftSheet.w||'paper'))neighborSheet()})}
const _neighborSheet=neighborSheet;neighborSheet=function(){_neighborSheet();const bx=$('#sheet .sheetbox');if(!bx)return;
  bx.insertAdjacentHTML('beforeend','<div class="lbl">🎁 Gifts & friendship (+'+friendBonus()+' home rating)</div>'+NEIGHBORS.map(n=>'<div class="slot"><span>'+n.face+' '+'❤️'.repeat(Math.ceil((S.friends[n.k]||0)/2))+' '+(S.friends[n.k]||0)+'/10</span><button class="btn green" data-gf="'+n.k+'" '+(S.giftDay[n.k]===S.day?'disabled':'')+'>'+(S.giftDay[n.k]===S.day?'Gifted today':'Give gift')+'</button></div>').join(''));
  onAll(bx,'[data-gf]',b=>giftSheet(b.dataset.gf))};
/* ---------- emote bar in the room ---------- */
function emoteBar(){return'<div class="chips" id="emo" style="margin-top:6px">'+EMOTES.map(e=>'<button class="chip" data-em="'+e[0]+'" aria-label="'+e[2]+'">'+e[1]+' '+e[2]+'</button>').join('')+'</div>'}
function bindEmotes(draw){onAll(document,'[data-em]',b=>{const m=b.dataset.em;AV.mood=m;S.stats11.emotes++;sfx('click');clearTimeout(bindEmotes.t);clearInterval(bindEmotes.i);
  if(m==='dance')bindEmotes.i=setInterval(()=>{if(document.body.contains(b))draw();else clearInterval(bindEmotes.i)},60);draw();
  bindEmotes.t=setTimeout(()=>{clearInterval(bindEmotes.i);AV.mood='smile';if(document.body.contains(b))draw()},m==='dance'?3000:2500)})}
function bindV11(){const b=$('#barberbtn');if(b)b.onclick=()=>{barbDraft=null;barberSheet()};const a=$('#arcadebtn');if(a)a.onclick=arcadeSheet}
function v11Fix(s){if(s.char){if(!s.char.beard)s.char.beard='none';if(s.char.beardColor===undefined)s.char.beardColor=null;if(s.char.lip===undefined)s.char.lip=''}
  if(!s.friends)s.friends={};if(!s.giftDay)s.giftDay={};if(!s.stats11)s.stats11={cuts:0,gifts:0,claw:0,plays:0,emotes:0}}
ACH.push(['barber','Fresh Cut 💈','Get a look at Supercutz',s=>s.stats11&&s.stats11.cuts>=1],['bestie','Block Bestie 🎁','Max a neighbor\'s friendship',s=>s.friends&&Object.keys(s.friends).some(k=>s.friends[k]>=10)],
 ['claw','Claw-some 🧸','Win 3 claw machine prizes',s=>s.stats11&&s.stats11.claw>=3]);
