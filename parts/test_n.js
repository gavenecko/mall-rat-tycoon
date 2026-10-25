(async()=>{ await G(()=>{closeSheet();if(__game.shift)__game.endShift()});
 const shot18=async n=>{if(SHOTS&&mode==='file'&&W===412)await p.screenshot({path:'shots/v18_'+n+'.png'})};
 // N1 sleeves follow arms in power stance
 const n1=await G(()=>{const S=__game.S,top=__game.ITEMS.filter(i=>i.shape==='sweater'&&!i.fake)[0];const ch=S.char;const px=(eq)=>{const c=document.createElement('canvas');c.width=150;c.height=200;const x=c.getContext('2d');x.translate(75,4);drawAvatar(x,Object.assign({},ch,{fitT:3}),eq);return x};
   const a=px({tops:top.id});const b=BODIES[ch.body]||BODIES.average;const pt=(X,Y)=>a.getImageData(75+X,4+Y,1,1).data;const elbow=pt(Math.round(b.sh+11),100),low=pt(Math.round(b.sh+3),112);const tc=parseInt(top.color.slice(1),16);const near=d=>Math.abs(d[0]-(tc>>16&255))+Math.abs(d[1]-(tc>>8&255))+Math.abs(d[2]-(tc&255))<90;return{elbow:near(elbow),oldSleeveGone:!near(low),a:elbow[3]}});
 ok(n1.elbow&&n1.oldSleeveGone&&n1.a===255,'power stance sleeves follow bent arms '+JSON.stringify(n1));
 // N2 tour codes include all rooms + surfaces; old v17 code still imports
 const n2=await G(()=>{const S=__game.S;closeSheet();if(S.home.have.indexOf('kitchen')<0&&ROOM_DEFS.length>1)S.home.have.push(ROOM_DEFS[1].k);const k2=S.home.have.filter(k=>k!==S.home.cur)[0];const wp=__game.ITEMS.filter(i=>i.surf==='wall')[0];S.owned[wp.id]=1;S.home.rooms[k2]={room:[],wall:wp.id,floor:null};
   const code=tourCode(),o=tourParse(code);const old='MRTH:'+b64e(JSON.stringify({n:'Old',ch:S.char,eq:{},room:S.room.slice(0,2),rows:10,cur:'bed',ft:0}));openMore();document.querySelector('#mTour').click();document.querySelector('#tin').value=code;document.querySelector('#tview').click();
   const tabs=document.querySelectorAll('[data-tr]').length;const t=document.querySelector('[data-tr="'+k2+'"]');if(t)t.click();const c=document.querySelector('#tcv').getContext('2d').getImageData(10,10,1,1).data;const n=tourView(old);return{rooms:Object.keys(o.rooms).length,wall:o.rooms[k2].wall===wp.id,tabs:tabs,oldOk:n>=0,px:c[3]}});
 ok(n2.rooms>=2&&n2.wall&&n2.tabs>=2&&n2.oldOk&&n2.px===255,'MRTH tours carry every room + wallpaper; v17 codes still view '+JSON.stringify(n2));
 await G(()=>{tourView(tourCode())});await shot18('tour');
 // N3 weather → outdoor plants
 const n3=await G(()=>{const S=__game.S,it=__game.ITEMS.filter(i=>i.cat==='outdoor'&&i.plant)[0],ip=__game.ITEMS.filter(i=>i.cat==='plants')[0];S.owned[it.id]=1;S.owned[ip.id]=1;const r={};
   S.wxOverride='rain';S.home.water[it.id]=S.day-5;S.home.water[ip.id]=S.day-5;r.rain=wiltOf(it)===0&&S.home.water[it.id]===S.day&&wiltOf(ip)===1;
   S.wxOverride='heat';S.home.water[it.id]=S.day-1;r.heat=wiltOf(it)===1;S.wxOverride='sun';r.sun=wiltOf(it)===0;S.wxOverride='snow';S.home.water[it.id]=S.day-9;r.snow=wiltOf(it)===0;
   const c=document.createElement('canvas');c.width=c.height=60;const x=c.getContext('2d');HOME_DRAW.bush(x,it,0,0,60,60);let wh=0;const D=x.getImageData(0,0,60,60).data;for(let i=0;i<D.length;i+=4)if(D[i]>250&&D[i+1]>250&&D[i+2]>250&&D[i+3]===255)wh++;r.caps=wh>20;delete S.wxOverride;return r});
 ok(n3.rain&&n3.heat&&n3.sun&&n3.snow&&n3.caps,'weather: rain waters yard plants, heatwave wilts, snow dormant + snow caps '+JSON.stringify(n3));
 // N4 small furniture side views: opaque + different from front
 const n4=await G(()=>{const out={bad:[],n:0};['chair','fishtank','laptop','speaker','gamingpc','console','vr','alexuh','roomburr','tv','poster','painting'].forEach(s=>{const it=__game.ITEMS.filter(i=>i.shape===s&&!i.fake)[0];if(!it)return;out.n++;const mk=r=>{const cv=document.createElement('canvas');cv.width=cv.height=60;drawPlaced(cv.getContext('2d'),it,{id:it.id,x:0,y:0,r:r},48,0,0);return cv.getContext('2d').getImageData(0,0,48,48).data};const A=mk(1),F=mk(0);let s1=0,op=0,d=0;for(let i=3;i<A.length;i+=4){if(A[i]){s1++;if(A[i]>240)op++}if(Math.abs(A[i]-F[i])>60)d++}
   if(!(s1>20&&op/s1>.6&&d>40))out.bad.push(s+':'+s1+'/'+(op/s1).toFixed(2)+'/'+d)});return out});
 ok(n4.n>=8&&!n4.bad.length,'small furniture has opaque side-view art (alpha test) '+JSON.stringify(n4));
 // N5 coupons
 const n5=await G(()=>{const S=__game.S;const C=coupToday();C.clip=[0];const it=__game.ITEMS.filter(i=>i.store===C.c[0].s&&!i.fake&&!i.rare&&i.price>=20)[0];if(!it)return{skip:1};const full=_priceOf18(it),p=priceOf(it);S.cash=1e6;__game.buy(it.id);const after=priceOf(it);return{off:C.c[0].off,full:full,p:p,used:C.c[0].used,after:after,saved:C.saved}});
 ok(n5.skip||(n5.p<n5.full&&n5.used===1&&n5.after===n5.full&&n5.saved>0),'coupon clipped → discount once → used '+JSON.stringify(n5));
 // N6 fountain: never profitable, once a day
 const n6=await G(()=>{const S=__game.S;S.fount.day=0;S.cash=100;const a=fountToss(),c1=S.cash,b=fountToss();return{a:!!a,b:b,c1:c1}});
 ok(n6.a&&n6.b===null&&n6.c1<=100,'fountain: $1 fortune, one per day, never pays out '+JSON.stringify(n6));
 // N7 robocall + receipt
 const n7=await G(()=>{const S=__game.S;S.enc={day:S.day,k:'robocall',done:0};const o=encChoose(0);return{msg:o.msg,h:S.hungUp,r:rcptFt()>0}});
 ok(/hung up/.test(n7.msg)&&n7.h>=1&&n7.r,'robocall hang-up + CVSee receipt grows '+JSON.stringify(n7));
 await G(async()=>{closeSheet();__game.go('mall');await new Promise(r=>setTimeout(r,300));const e=document.querySelector('#coupbtn');if(e)e.scrollIntoView({block:'center'})});await sleep(300);
 const n8=await G(()=>{const B=['#coupbtn','#fntbtn'].map(s=>document.querySelector(s));if(B.some(b=>!b))return{missing:1};const a=B[0].getBoundingClientRect(),b=B[1].getBoundingClientRect();return{ov:!(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top),inW:a.left>=0&&b.right<=innerWidth}});
 ok(!n8.missing&&!n8.ov&&n8.inW,'concourse buttons present, no overlap '+JSON.stringify(n8));await shot18('concourse');
 await G(()=>coupSheet());await sleep(200);await shot18('coupons');await G(()=>closeSheet());
})();
