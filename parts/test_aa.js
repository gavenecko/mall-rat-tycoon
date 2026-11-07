(async()=>{
 const shot31=async n=>{if(SHOTS&&mode==='file'&&W===412){await sleep(450);await p.screenshot({path:'shots/v31_'+n+'.png'})}};
 await G(()=>{closeSheet();__game.go('mall');S.ui.rm=false;applyUI();liveMallSheet()});
 // Touch-type PointerEvents exercise the actual registered canvas handlers. Never invoke go/toast in gesture assertions.
 const gestures=await G(async()=>{
  const wait=()=>new Promise(r=>setTimeout(r,50));let id=80;
  const send=(type,x,y)=>{const c=$('#livemall');c.dispatchEvent(new PointerEvent(type,{pointerId:id,pointerType:'touch',isPrimary:true,button:0,clientX:x,clientY:y,bubbles:true}))};
  function point(sp){const c=$('#livemall'),b=c.getBoundingClientRect();return{x:b.left+(sp.r[0]-LM.st.cam+sp.r[2]/2)*b.width/(Math.min(370,innerWidth-48)),y:b.top+(sp.r[1]+sp.r[3]/2)*b.height/(Math.min(400,Math.floor(innerHeight*.52)))}}
  let sp=LM.st.shops.filter(q=>q.open&&!q.park)[0],q=point(sp);send('pointerdown',q.x,q.y);send('pointerup',q.x,q.y);const entered=screen==='mall'&&sub===sp.s.id;
  liveMallSheet();await wait();sp=LM.st.shops[0];q=point(sp);id++;send('pointerdown',q.x,q.y);send('pointermove',q.x-50,q.y);send('pointerup',q.x-50,q.y);const dragged=!!$('#livemall')&&LM.st.cam>=45;
  id++;q=point(LM.st.shops[1]);send('pointerdown',q.x,q.y);send('pointercancel',q.x,q.y);send('pointerup',q.x,q.y);const cancelled=!!$('#livemall')&&!LM.st.drag;
  id++;const b=$('#livemall').getBoundingClientRect();send('pointerdown',b.left+10,b.top+50);send('pointerup',b.right+100,b.top+50);const edge=!!$('#livemall');
  const closed=LM.st.shops.filter(q=>!q.open)[0];LM.st.cam=Math.min(LM.st.maxCam,closed.x-10);$('#lmleft').click();$('#lmright').click();await wait();q=point(closed);id++;send('pointerdown',q.x,q.y);send('pointerup',q.x,q.y);
  const info=$('#lmselected').textContent;const closedOK=!!$('#livemall')&&info.includes(closed.s.name)&&info.includes('in-game day '+closed.next);
  const directory=$('#lmshops').textContent,full=LM.st.shops.every(q=>directory.includes(q.s.name));return{entered,dragged,cancelled,edge,closedOK,full}
 });ok(Object.values(gestures).every(Boolean),'v31 real canvas pointer tap/drag/cancel/edge/closed navigation '+JSON.stringify(gestures));
 await G(()=>liveMallSheet());
 const tapPosition=await G(()=>{const sp=LM.st.shops.filter(q=>q.open&&!q.park)[0],c=$('#livemall');return{id:sp.s.id,x:(sp.r[0]+sp.r[2]/2)*c.getBoundingClientRect().width/Math.min(370,innerWidth-48),y:(sp.r[1]+sp.r[3]/2)*c.getBoundingClientRect().height/Math.min(400,Math.floor(innerHeight*.52))}});
 await f.locator('#livemall').tap({position:{x:tapPosition.x,y:tapPosition.y}});
 ok(await G(id=>screen==='mall'&&sub===id,tapPosition.id),'v31 Playwright touchscreen tap enters open store');
 await G(()=>{liveMallSheet();$('#lmdirectory').open=true});await sleep(100);await shot31('storefronts');
 const motion=await G(async()=>{const wait=()=>new Promise(r=>setTimeout(r,100));S.ui.rm=true;closeSheet();liveMallSheet();const st=LM.st,t=st.t;await wait();const reduced=st.t===t&&LM.iv===null;$('#lmright').click();const staticScroll=st.cam>0;$('#lmpause').click();await wait();const running=st.t>t;window.__vis(false);const hiddenT=st.t;await wait();const hidden=st.t===hiddenT&&LM.iv===null;window.__vis(true);await wait();const resumed=st.t>hiddenT;const old=st,oldCam=st.cam;closeSheet();await wait();const stopped=LM.iv===null&&LM.st===null&&LM.cleanup===null;document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));const dead=old.cam===oldCam;S.ui.rm=false;return{reduced,staticScroll,running,hidden,resumed,stopped,dead}});
 ok(Object.values(motion).every(Boolean),'v31 motion pause/reduced/hidden/lifecycle '+JSON.stringify(motion));
 await p.emulateMedia({reducedMotion:'reduce'});
 ok(await G(()=>{closeSheet();liveMallSheet();return LM.iv===null&&$('#lmpause').textContent==='Play ambience'}),'v31 OS reduced-motion preference starts static');
 await p.emulateMedia({reducedMotion:'no-preference'});
 const rates=await G(()=>{const st=LM.st,c=$('#livemall'),x=c.getContext('2d'),n=st.npcs[0],orig=n.wx,v=n.vx;n.wx=500;st.dt=1/60;for(let i=0;i<60;i++)lmDrawWorld(x,320,400,st);const a=n.wx;n.wx=500;st.dt=1/120;for(let i=0;i<120;i++)lmDrawWorld(x,320,400,st);const b=n.wx;n.wx=orig;st.dt=0;return Math.abs(a-b)<.001});ok(rates,'v31 time-based movement agrees at 60/120 Hz');
 // Validate corrupt data without replacing the current save; import always creates a recoverable previous save.
 const safety=await G(()=>{closeSheet();const good=exportCode(),old=S;const origCash=S.cash;const raw=JSON.parse(b64d(good.slice(5)));let rejected=0;
  const bad=['bad','MRT4:'+good.slice(5),'MRTH:'+good.slice(5),'MRT3:'+b64e('{}')];const future=Object.assign({},raw,{v:999});bad.push('MRT3:'+b64e(JSON.stringify(future)));const malformed=Object.assign({},raw,{owned:[]});bad.push('MRT3:'+b64e(JSON.stringify(malformed)));
  bad.forEach(c=>{try{importCode(c)}catch(e){if(S===old&&S.cash===origCash)rejected++}});
  raw.char.name='Imported31';raw.cash=321;const code='MRT3:'+b64e(JSON.stringify(raw));importConfirm31(code);const notYet=S===old;$('#import-cancel').click();const cancelled=S===old;importConfirm31(code);return{rejected,total:bad.length,notYet,cancelled,code,original:good}});
 ok(safety.rejected===safety.total&&safety.notYet&&safety.cancelled,'v31 corrupt/future/wrong-format rejected and cancel preserves save');
 await shot31('import_confirmation');
 const imported=await G(()=>{const before=JSON.stringify(S);$('#import-confirm').click();const ok=S.char.name==='Imported31'&&S.cash===321;const backup=store.get(SAVE_BACKUP31)===before;const candidate=saveCandidate31(exportCode());const round=candidate.char.name==='Imported31'&&candidate.cash===321;go('me');const recovery=!!$('#recover-save');return{ok,backup,round,recovery,storage:storageOK}});
 ok(imported.ok&&imported.backup&&imported.round&&imported.recovery,'v31 transaction backup/export roundtrip and recovery '+JSON.stringify(imported));
 const slot=await G(()=>{store.set(slotKey(1),JSON.stringify(S));go('me');const before=S;$('#view [data-load="1"]').click();const noOverwrite=S===before&&!!$('#import-confirm');$('#import-cancel').click();return noOverwrite});ok(slot,'v31 slot load also requires confirmation');
 const dialog=await G(()=>{go('mall');const trigger=$('#qaMap');trigger.focus();trigger.click();const d=$('#sheet [role="dialog"]'),first=$('#shx'),aria=d.getAttribute('aria-modal')==='true'&&!!d.getAttribute('aria-labelledby'),focused=document.activeElement===first;
 const buttons=[...d.querySelectorAll('button')].filter(e=>e.getClientRects().length);const last=buttons[buttons.length-1];last.focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));const wrap=document.activeElement===first;
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));const restored=document.activeElement===trigger&&$('#sheet').hidden;return{aria,focused,wrap,restored}});
 ok(Object.values(dialog).every(Boolean),'v31 dialog focus/Tab/Escape/restore '+JSON.stringify(dialog));
 const clipping=await G(async()=>{S.ui.ts=2;S.dark=true;applyUI();applyTheme();liveMallSheet();await new Promise(r=>setTimeout(r,400));const b=$('#sheet .sheetbox'),c=$('#livemall').getBoundingClientRect();const br=b.getBoundingClientRect();const fit=b.scrollWidth<=b.clientWidth+2&&c.right<=innerWidth+1&&br.top>=0&&br.bottom<=innerHeight+1;closeSheet();openMore();await new Promise(r=>setTimeout(r,400));const box=$('#sheet .sheetbox');return{fit,menu:box.scrollWidth<=box.clientWidth+2,bg:getComputedStyle(box).backgroundColor}});
 ok(clipping.fit&&clipping.menu&&clipping.bg!=='rgb(255, 255, 255)','v31 extra-large mobile sheets / dark menu '+JSON.stringify(clipping));await shot31('dark_menu');
 await G(()=>{closeSheet();S.ui.ts=0;S.dark=false;applyUI();applyTheme();go('mall');hubShow('today')});
 ok(await G(()=>$('#view').scrollHeight<3200),'v31 Today <3200px');
})();
