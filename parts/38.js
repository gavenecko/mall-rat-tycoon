/* v31 launch polish: transactional imports, dialog lifecycle, menu contrast. No economy changes. */
function motionReduced(){return !!((S.ui&&S.ui.rm)||(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches))}
const _lmStop31=lmStop;lmStop=function(){if(LM.cleanup){const fn=LM.cleanup;LM.cleanup=null;fn()}_lmStop31()};
let sheetReturn31=null;
const _sheet31=sheet,_closeSheet31=closeSheet;
sheet=function(html){const host=$('#sheet');if(host.hidden||!host.contains(document.activeElement)){if(host.hidden)sheetReturn31=document.activeElement}lmStop();_sheet31(html);
 const box=host.querySelector('.sheetbox');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.tabIndex=-1;
 const h=box.querySelector('h3');if(h){h.id='dialog-title';box.setAttribute('aria-labelledby',h.id)}else box.setAttribute('aria-label','Game dialog');
 const btn=box.querySelector('#shx');btn.setAttribute('aria-label','Close dialog');btn.focus({preventScroll:true});
};
closeSheet=function(){lmStop();_closeSheet31();const ret=sheetReturn31;sheetReturn31=null;if(ret&&ret.isConnected)ret.focus({preventScroll:true})};
document.addEventListener('keydown',ev=>{const host=$('#sheet');if(!host||host.hidden||document.querySelector('#vdisc'))return;
 const box=host.querySelector('.sheetbox');if(!box)return;
 if(ev.key==='Escape'){ev.preventDefault();closeSheet();return}
 if(ev.key!=='Tab')return;
 const els=[...box.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea,select,summary,[tabindex="0"]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
 if(!els.length){ev.preventDefault();box.focus();return}const first=els[0],last=els[els.length-1];
 if(ev.shiftKey&&(document.activeElement===first||!box.contains(document.activeElement))){ev.preventDefault();last.focus()}
 else if(!ev.shiftKey&&(document.activeElement===last||!box.contains(document.activeElement))){ev.preventDefault();first.focus()}
});

const SAVE_BACKUP31='mrt31_before_import';
function saveCandidate31(code){
 code=String(code||'').trim().replace(/\s+/g,'');if(code.length>4000000)throw Error('Save code is too large');
 if(/^MRTH:/.test(code))throw Error('House tours are read-only. Use Menu → House tour code.');
 if(!/^MRT[23]:/.test(code))throw Error('Supported save formats: MRT2: and MRT3:');
 let o;try{o=JSON.parse(b64d(code.slice(5)))}catch(e){throw Error('Invalid or damaged save code')}
 const obj=q=>q&&typeof q==='object'&&!Array.isArray(q);
 if(!obj(o)||!Number.isFinite(o.cash)||o.cash<0||!obj(o.char)||typeof o.char.name!=='string'||!o.char.name.trim()||!obj(o.owned)||!obj(o.equipped)||!Array.isArray(o.room)||!Number.isFinite(o.day)||o.day<1)throw Error('Save is missing required player data');
 if(o.v!=null&&(!Number.isFinite(o.v)||o.v<2||o.v>31))throw Error('Unsupported save version; this game supports v2–v31');
 function scan(q,depth){if(depth>60)throw Error('Save nesting is too deep');if(typeof q==='number'&&!Number.isFinite(q))throw Error('Invalid number');if(q&&typeof q==='object')Object.keys(q).forEach(k=>{if(k==='__proto__'||k==='constructor'||k==='prototype')throw Error('Invalid save field');scan(q[k],depth+1)})}scan(o,0);
 Object.keys(o.owned).forEach(k=>{if(!Number.isSafeInteger(o.owned[k])||o.owned[k]<0)throw Error('Invalid inventory count')});
 ['orders','flea','bnpl','inbox'].forEach(k=>{if(o[k]!=null&&!Array.isArray(o[k]))throw Error('Invalid '+k)});
 // All normalization/migration occurs on a detached candidate, never the current save.
 return normalize(JSON.parse(JSON.stringify(o)));
}
function importCode(code){const next=saveCandidate31(code),prev=S,raw=JSON.stringify(S);store.set(SAVE_BACKUP31,raw);if(store.get(SAVE_BACKUP31)!==raw)throw Error('Could not preserve backup; current game has not changed. Export your save first.');try{S=next;save();if(store.get(KEY_AUTO)!==JSON.stringify(S))throw Error('Could not persist imported save')}catch(e){S=prev;store.set(KEY_AUTO,raw);throw Error('Import cancelled; previous save restored: '+e.message)}return true}
function importConfirm31(code){let next;try{next=saveCandidate31(code)}catch(e){toast(e.message);return false}
 const before=exportCode();sheet('<h3>Replace current progress?</h3><p>Import <b>'+esc(next.char.name)+'</b>, in-game day '+next.day+'. Your current progress will be backed up before replacement.</p><p class="small">'+(storageOK?'Backup survives reload in this browser.':'Storage is unavailable: this backup lasts only while this tab stays open. Copy your current export first.')+'</p><details><summary>Current save — copy as an extra backup</summary><textarea id="previous-export" readonly aria-label="Current save backup">'+esc(before)+'</textarea></details><button class="btn" id="import-confirm">Replace progress and keep backup</button><button class="btn alt" id="import-cancel">Cancel — keep current game</button>');
 $('#import-cancel').onclick=closeSheet;$('#import-confirm').onclick=()=>{try{importCode(code);closeSheet();applyTheme();go('me');toast('Imported. Previous save is available under Recover previous save.')}catch(e){toast(e.message)}};return true}
const _renderMe31=renderMe;renderMe=function(v){_renderMe31(v);const imp=$('#imp');if(imp)imp.onclick=()=>importConfirm31($('#code').value);
 v.querySelectorAll('[data-load]').forEach(old=>{const b=old.cloneNode(true);old.parentNode.replaceChild(b,old);b.onclick=()=>{const raw=store.get(slotKey(b.dataset.load));if(raw)importConfirm31('MRT3:'+b64e(raw))}});
 const area=$('#saves');if(area&&store.get(SAVE_BACKUP31)){const b=document.createElement('button');b.className='btn alt big';b.id='recover-save';b.textContent='Recover previous save (before last import)';area.appendChild(b);b.onclick=()=>importConfirm31('MRT3:'+b64e(store.get(SAVE_BACKUP31)))}
};
(function(){const style=document.createElement('style');style.textContent=
 'body.ts1 #sheet .sheetbox{max-height:calc(89dvh - 72px)!important}body.ts2 #sheet .sheetbox{max-height:calc(80dvh - 64px)!important}#sheet .sheetbox{box-sizing:border-box;overflow-x:hidden}#livemall{max-width:100%;height:auto;box-sizing:border-box}#lmsbar{flex-wrap:wrap}#lmsbar .btn{min-height:44px;font-size:13px}#lmshops .btn{white-space:normal;text-align:left;width:100%}#lmdirectory summary{padding:12px;cursor:pointer;min-height:44px;box-sizing:border-box}#lmselected{overflow-wrap:anywhere}#previous-export{width:100%;box-sizing:border-box;min-height:80px}button:focus-visible,summary:focus-visible,textarea:focus-visible{outline:3px solid #ff9800;outline-offset:2px}'+
 '[data-theme=dark] .sheetbox .card:not(#feudnote):not(#rivalnote){background:var(--card)!important;color:var(--ink)!important}[data-theme=dark] .sheetbox .small{color:var(--muted)}[data-theme=dark] .sheetbox .slot{border-color:var(--line)}';document.head.appendChild(style)})();
function v31Fix(s){}
