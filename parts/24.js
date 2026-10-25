/* ===== v18.1: tidy atrium — quick actions + tabbed hub (Today / Earn / Fun / Social), consistent card style ===== */
(function(){const st=document.createElement('style');st.textContent=
'.qa{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 10px}.qa button{border:0;border-radius:14px;background:#fff;box-shadow:0 2px 8px #0001;padding:9px 2px 7px;font:800 12px/1.2 inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:3px;min-height:58px}.qa button i{font-style:normal;font-size:22px;line-height:1}'+
'.daybar{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#fff;border-radius:14px;padding:8px 12px;margin-bottom:10px;box-shadow:0 2px 8px #0001;font-size:14px}.daybar .small{text-align:right}'+
'.hubtabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:var(--bg2);border-radius:14px;padding:4px;margin-bottom:8px}.hubtabs button{border:0;border-radius:10px;background:transparent;padding:8px 2px;font:800 13px inherit;color:var(--muted);position:relative}.hubtabs button.on{background:#fff;color:var(--ink);box-shadow:0 1px 4px #0002}.hubtabs .n{display:inline-block;min-width:16px;margin-left:3px;border-radius:8px;background:var(--brand);color:#fff;font-size:10px;line-height:16px;padding:0 3px}'+
'.hubp{display:none}.hubp.on{display:block}.hubp>.small{background:#fff;border-radius:12px;padding:8px 12px;margin-bottom:8px}'+
'.hub .card{background:#fff!important;border:0!important;border-left:5px solid var(--ac,#ff3d81)!important;border-radius:14px!important;padding:10px 12px!important;margin:0 0 8px!important;box-shadow:0 2px 8px #0001!important;color:var(--ink)!important}'+
'.hub .card b,.hub .card .small,.hub .card div:not(.bar):not(.bar>div){color:inherit}.hub .card .small{color:var(--muted)!important}.hub .card.row>span:first-child{font-size:26px!important;width:34px;text-align:center;flex:none}'+
'.hub .card .btn{font-size:13px;padding:8px 12px}.hub .card>b:first-child,.hub .card .lbl:first-child{font-size:15px}'+
'.hubp[data-p=today]{--ac:#ff3d81}.hubp[data-p=earn]{--ac:#12a150}.hubp[data-p=fun]{--ac:#7c4dff}.hubp[data-p=social]{--ac:#f59e0b}'+
'.shopc{border-left:5px solid #ff9800!important;border-radius:14px!important;margin:0 0 8px!important}.hubp.on[data-p=fun],.hubp.on[data-p=earn]{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hubp[data-p=fun]>.card,.hubp[data-p=earn]>.card{margin:0!important;grid-column:1/-1}.hubp[data-p=fun]>.card.row,.hubp[data-p=earn]>.card.row{grid-column:auto;flex-direction:column;align-items:center;text-align:center;gap:6px!important;justify-content:space-between}.hubp>.card.row>div{flex:none!important;width:100%}.hubp[data-p=fun]>.card.row .small,.hubp[data-p=earn]>.card.row .small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px}.hubp[data-p=fun]>.card.row .btn,.hubp[data-p=earn]>.card.row .btn{width:100%}#wxcard .small:first-of-type{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}@media(max-width:440px){header #day{display:none}}.secth{font:800 16px inherit;margin:14px 2px 6px;color:var(--ink)}';document.head.appendChild(st)})();
const HUB_TABS=[['today','📅 Today'],['earn','💰 Earn'],['fun','🎉 Fun'],['social','👥 Social']];
function hubOf(el){const id=el.id||'',t=el.textContent||'';
 if(/^(seasoncard|dropcard)$/.test(id))return'shop';
 if(/^(dailycard|wxcard|enccard)$/.test(id)||/Concourse|Coupons/.test(t)&&/Fountain/.test(t)||el.classList.contains('small'))return'today';
 if(/^(pawncard|trendcard)$/.test(id)||/Shark Tonk/.test(t))return'earn';
 if(/^(rivalcard)$/.test(id))return'social';
 return'fun'}
let hubTab=null;
function hubShow(k){hubTab=k;try{S.hubTab=k}catch(e){}const h=$('#hub');if(!h)return;Array.prototype.forEach.call(h.querySelectorAll('.hubp'),p=>p.classList.toggle('on',p.dataset.p===k));Array.prototype.forEach.call(h.querySelectorAll('[data-hub]'),b=>b.classList.toggle('on',b.dataset.hub===k))}
function hubFor(sel){const e=$(sel);if(!e)return null;const p=e.closest('.hubp');if(p)hubShow(p.dataset.p);return e}
function tidyMall(v){const deals=v.querySelector('#deals');if(!deals)return;const kids=Array.from(v.children),di=kids.indexOf(deals);
 // header day card → slim bar; deals label stays with deals
 const dayCard=kids.filter(c=>c.classList.contains('sp')&&/Day/.test(c.textContent))[0];if(dayCard){dayCard.className='daybar';dayCard.id='daybar'}
 const dl=deals.previousElementSibling&&deals.previousElementSibling.classList.contains('lbl')?null:kids.filter((c,i)=>i<di&&c.classList.contains('lbl')&&/Daily Deals/.test(c.textContent))[0];
 const move=kids.filter((c,i)=>i<di&&c!==dayCard&&c!==dl&&(c.classList.contains('card')||c.classList.contains('small')));
 const P={shop:[]};HUB_TABS.forEach(t=>P[t[0]]=[]);move.forEach(c=>P[hubOf(c)].push(c));['fun','earn'].forEach(k=>{P[k]=P[k].filter(c=>!c.classList.contains('row')).concat(P[k].filter(c=>c.classList.contains('row')))});
 // social extras: shortcuts to tour + log (were buried in ⋯ More)
 const hub=document.createElement('div');hub.id='hub';hub.className='hub';
 hub.innerHTML='<div class="hubtabs" role="tablist">'+HUB_TABS.map(t=>'<button data-hub="'+t[0]+'" role="tab">'+t[1]+'</button>').join('')+'</div>'+HUB_TABS.map(t=>'<div class="hubp" data-p="'+t[0]+'"></div>').join('');
 HUB_TABS.forEach(t=>{const p=hub.querySelector('[data-p='+t[0]+']');P[t[0]].forEach(c=>p.appendChild(c))});
 hub.querySelector('[data-p=social]').insertAdjacentHTML('beforeend','<div class="card row" id="socialcard" style="gap:10px"><span>🏠</span><div style="flex:1"><b>House tours &amp; neighbors</b><div class="small">Share a read-only tour code or view a friend\'s place</div></div><button class="btn alt" id="hubtour">Tours</button></div>');
 const qa=document.createElement('div');qa.className='qa';qa.id='qa';qa.innerHTML='<button id="qaShops"><i>🛍️</i>Stores</button><button id="qaWork"><i>💼</i>Work</button><button id="qaRoom"><i>🏠</i>Room</button><button id="qaMap"><i>🗺️</i>Map</button>';
 const anchor=dayCard||v.firstChild;anchor.parentNode.insertBefore(qa,anchor.nextSibling);qa.parentNode.insertBefore(hub,qa.nextSibling);
 const sh=document.createElement('div');sh.className='secth';sh.id='shophead';sh.textContent='🛍️ Shop';hub.parentNode.insertBefore(sh,hub.nextSibling);let after=sh;P.shop.forEach(c=>{c.classList.add('shopc');after.parentNode.insertBefore(c,after.nextSibling);after=c});
 // counts
 HUB_TABS.forEach(t=>{const n=hub.querySelector('[data-p='+t[0]+']').children.length,b=hub.querySelector('[data-hub='+t[0]+']');if(t[0]==='today'&&$('#enccard'))b.insertAdjacentHTML('beforeend','<span class="n">!</span>');else if(!n)b.disabled=true});
 onAll(hub,'[data-hub]',b=>{sfx('click');hubShow(b.dataset.hub)});
 $('#hubtour').onclick=()=>{sfx('click');tourSheet()};
 $('#qaShops').onclick=()=>{sfx('click');const c=v.querySelector('.concourse');if(c)c.scrollIntoView({behavior:'smooth',block:'start'})};
 $('#qaWork').onclick=()=>{sfx('click');go('work')};$('#qaRoom').onclick=()=>{sfx('click');go('room')};
 $('#qaMap').onclick=()=>{const m=$('#mapbtn');if(m)m.click()};
 hubShow(hubTab||(typeof S!=='undefined'&&S.hubTab)||'today')}
const _renderMall181=renderMall;renderMall=function(v){const r=_renderMall181.apply(this,arguments);try{if(!sub&&v)tidyMall(v)}catch(e){console.warn(e)}return r};
const _mapGo181=mapGo;mapGo=function(q){try{const p=q&&q.e&&q.e.closest&&q.e.closest('.hubp');if(p&&!p.classList.contains('on'))hubShow(p.dataset.p)}catch(e){}return _mapGo181(q)};
