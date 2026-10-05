/* Accounts, sign-in, and keeping devices in step with the database.
   What each person may read and change is enforced by the database
   (security-v3.sql); this file only asks. */

/* invite links: everything the device needs, in one URL */
function inviteLink(role,id){
 /* a person's own access, never the company's master key */
 var pid=role==='manager'?'office':(id||'');
 var m=(memberList||[]).filter(function(x){return x.person_id===pid&&x.active})[0];
 if(m)return memberLink(m.token);
 var base=location.origin+location.pathname;
 return base+'#j='+encodeURIComponent(btoa(JSON.stringify({u:cloud.url,k:cloud.key,w:cloud.ws,r:role,i:id||''})));
}
function readInvite(){
 var m=(location.hash||'').match(/j=([^&]+)/);
 if(!m)return false;
 try{
  var o=JSON.parse(atob(decodeURIComponent(m[1])));
  cloud.url=o.u;cloud.key=o.k;cloud.ws=o.w;cloud.on=true;cloud.status='on';
  cloudSaveCfg();
  if(history.replaceState)history.replaceState(null,'',location.pathname);
  pendingRole=o.r;pendingId=o.i;
  return true;
 }catch(e){return false}
}
function authBase(){return cloud.url.replace(/\/+$/,'')+'/auth/v1'}
function authReady(){return !!(cloud.url&&cloud.key)}

/* --- Google --- */
function googleSignIn(){
 if(!authReady()){toast(u('au_needcloud'));return}
 var back=location.origin+location.pathname;
 location.href=authBase()+'/authorize?provider=google&redirect_to='+encodeURIComponent(back);
}
function readAuthRedirect(){
 var h=location.hash||'';
 var m=h.match(/access_token=([^&]+)/);
 if(!m)return false;
 var token=decodeURIComponent(m[1]);
 saveJwt(token);
 try{localStorage.setItem('cleanos:token',token)}catch(e){}
 if(history.replaceState)history.replaceState(null,'',location.pathname);
 /* first ask the database who this is; fall back to matching locally */
 resolveMembership(function(mem){
  if(mem)return enterAsMember(mem);
  fetchAuthUser(token);
 });
 return true;
}
function fetchAuthUser(token){
 if(!authReady())return;
 fetch(authBase()+'/user',{headers:{'apikey':cloud.key,'Authorization':'Bearer '+token}})
 .then(function(r){return r.json()})
 .then(function(us){
   if(!us||!us.id){toast(u('au_failed'));return}
   authUser={id:us.id,email:us.email||'',phone:us.phone||''};
   try{localStorage.setItem('cleanos:user',JSON.stringify(authUser))}catch(e){}
   matchAndEnter();
 }).catch(function(){toast(u('au_failed'))});
}
function loadAuthUser(){
 try{var v=localStorage.getItem('cleanos:user');if(v)authUser=JSON.parse(v)}catch(e){}
}
function authSignOut(){
 authUser=null;
 try{localStorage.removeItem('cleanos:user');localStorage.removeItem('cleanos:token')}catch(e){}
 signOut();
}

/* --- phone verification --- */
function otpStart(){
 if(!authReady()){toast(u('au_needcloud'));return}
 var p=(otpPhone||'').replace(/[^0-9+]/g,'');
 if(p.length<8){toast(u('au_badphone'));return}
 if(p[0]!=='+')p='+'+p;
 otpPhone=p;
 fetch(authBase()+'/otp',{method:'POST',headers:{'apikey':cloud.key,'Content-Type':'application/json'},
  body:JSON.stringify({phone:p})})
 .then(function(r){if(!r.ok)return r.json().then(function(j){throw new Error(j.msg||j.error_description||('HTTP '+r.status))});
   otpPhase='code';render();toast(u('au_sent'))})
 .catch(function(e){toast(u('au_smsfail')+' '+e.message)});
}
function otpVerify(){
 fetch(authBase()+'/verify',{method:'POST',headers:{'apikey':cloud.key,'Content-Type':'application/json'},
  body:JSON.stringify({type:'sms',phone:otpPhone,token:(otpCode||'').trim()})})
 .then(function(r){return r.json()})
 .then(function(d){
   if(!d.access_token)throw new Error(d.msg||u('au_badcode'));
   saveJwt(d.access_token);
   try{localStorage.setItem('cleanos:token',d.access_token)}catch(e){}
   authUser={id:(d.user&&d.user.id)||'',email:(d.user&&d.user.email)||'',phone:otpPhone};
   try{localStorage.setItem('cleanos:user',JSON.stringify(authUser))}catch(e){}
   otpPhase=null;otpCode='';
   resolveMembership(function(mem){if(mem)return enterAsMember(mem);matchAndEnter()});
 }).catch(function(e){toast(String(e.message||e))});
}
function otpSet(k,v){if(k==='phone')otpPhone=v;else otpCode=v}
function otpOpen(){if(!authReady()){toast(u('au_needcloud'));return}otpPhase='phone';render()}
function otpCancel(){otpPhase=null;otpCode='';render()}
function matchAndEnter(){
 if(!authUser){render();return}
 var em=(authUser.email||'').toLowerCase(), ph=digits(authUser.phone);
 var st=S();
 if(em&&st.managerEmail&&em===String(st.managerEmail).toLowerCase()){signIn('manager',null);toast(u('au_welcome'));return}
 var hit=null;
 crew().forEach(function(c){
  if(em&&c.email&&em===String(c.email).toLowerCase())hit=c;
  if(ph&&digits(c.phone)&&digits(c.phone)===ph)hit=c;
 });
 if(hit){signIn('cleaner',hit.id);toast(u('au_welcome')+' '+hit.name.split(' ')[0]);return}
 var cuHit=null;
 customers().forEach(function(cu){
  if(em&&cu.email&&em===String(cu.email).toLowerCase())cuHit=cu;
  if(ph&&digits(cu.phone)&&digits(cu.phone)===ph)cuHit=cu;
 });
 if(cuHit){signIn('customer',cuHit.id);toast(u('au_welcome')+' '+cuHit.name);return}
 if(em&&st.customerEmail&&em===String(st.customerEmail).toLowerCase()){signIn('customer',customers()[0]?customers()[0].id:null);toast(u('au_welcome'));return}
 render();
 toast(u('au_nomatch'));
}

/* A Google user with no company creates one: the database makes the
   workspace and makes them its manager, keyed to their own address. */
function wsSlug(name){
 var b=String(name||'company').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'company';
 return b+'-'+Math.random().toString(36).slice(2,6);
}
function createCloudCompany(){
 toast(u('gs_creating'));
 var ws=wsSlug(db.company);
 fetch(cloudBase()+'/rpc/create_my_company',{method:'POST',headers:jwtHeaders(),
  body:JSON.stringify({p_ws:ws,p_name:db.company,p_data:db})})
 .then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d}})})
 .then(function(res){
   var row=Array.isArray(res.d)?res.d[0]:res.d;
   if(!res.ok||!row||!row.token){
    /* the database said no: keep the company on this device rather than lose it */
    toast(u('gs_localonly'));signIn('manager',null);return;
   }
   cloud.ws=row.workspace_id;cloud.on=true;cloud.status='on';
   setCurrentWs(row.workspace_id);saveToken(row.token);cloudSaveCfg();
   cloudPollAdaptive();
   signIn('manager',null);
   toast(u('gs_created'));
 })
 .catch(function(){toast(u('gs_localonly'));signIn('manager',null)});
}
function currentWs(){
 try{return localStorage.getItem(WS_KEY)||''}catch(e){return ''}
}
function setCurrentWs(id){
 try{localStorage.setItem(WS_KEY,id||'')}catch(e){}
}
/* every company gets its own drawer, so nothing bleeds across */
function dataKey(){var w=currentWs();return w?('cleanos:v4:'+w):'cleanos:v4'}
function photoKey(){var w=currentWs();return w?('cleanos:ph:'+w):'cleanos:photos'}

/* switching company clears everything belonging to the old one */
function switchCompany(){
 if(!confirm(u('mt_switchask')))return;
 session=null;memberToken='';photos={};photoIndex={};
 try{
  localStorage.removeItem('cleanos:token2');
  localStorage.removeItem('cleanos:cloud');
  localStorage.removeItem('cleanos:user');
  localStorage.removeItem(WS_KEY);
 }catch(e){}
 cloud={url:'',key:'',ws:'',secret:'',on:false,rev:0,status:'off',busy:false,pending:false,timer:null};
 db=seed();
 render();toast(u('mt_switched'));
}
/* a token is only good for the company it was issued to */
function verifyWorkspace(cb){
 if(!cloud.on||!memberToken){cb&&cb(true);return}
 whoAmI(function(m){
  if(!m){toast(u('tk_bad'));signOut();cb&&cb(false);return}
  if(cloud.ws&&m.workspace_id&&m.workspace_id!==cloud.ws){
   /* the link belongs to a different company than this device is set up for */
   toast(u('mt_wrongws'));signOut();cb&&cb(false);return;
  }
  cb&&cb(true);
 });
}
function saveJwt(t){authJwt=t||'';try{localStorage.setItem('cleanos:jwt',authJwt)}catch(e){}}
function loadJwt(){try{authJwt=localStorage.getItem('cleanos:jwt')||''}catch(e){}}
function jwtHeaders(){
 return {'apikey':cloud.key,'Authorization':'Bearer '+authJwt,'Content-Type':'application/json'};
}
/* ask the database who the signed-in person is */
function resolveMembership(cb){
 if(!cloud.url||!cloud.key||!authJwt){cb&&cb(null);return}
 fetch(cloudBase()+'/rpc/my_membership',{method:'POST',headers:jwtHeaders(),body:'{}'})
 .then(function(r){return r.json()})
 .then(function(rows){cb&&cb(rows&&rows[0]?rows[0]:null)})
 .catch(function(){cb&&cb(null)});
}
function enterAsMember(m){
 cloud.role=m.role;cloud.person=m.person_id;
 cloud.ws=m.workspace_id;cloud.on=true;cloud.status='on';
 setCurrentWs(m.workspace_id);saveToken(m.token);cloudSaveCfg();
 cloudPullThen(function(){
  if(m.role==='manager')signIn('manager',null);
  else if(m.role==='cleaner')signIn('cleaner',m.person_id);
  else signIn('customer',m.person_id);
  toast(u('au_welcome')+' '+(m.name||''));
 });
}
/* pull the company down before showing anything, so the screen is not empty */
function cloudPullThen(cb){
 if(!cloud.on){cb&&cb();return}
 remoteFull().then(function(full){
   if(full&&full.data&&(full.data.jobs||full.data.company)){cloud.dirty=false;cloudApply(full)}
   cloudPollAdaptive();cb&&cb();
 }).catch(function(){cb&&cb()});
}
/* the office links a person to the address they will sign in with */
function linkAddress(token,personId){
 var v=prompt(u('gl_ask'));
 if(v===null)return;
 v=String(v).trim();
 var body=(v.indexOf('@')>-1)?{email:v}:{phone:v.replace(/[^0-9+]/g,'')};
 fetch(cloudBase()+'/members?token=eq.'+encodeURIComponent(token),
  {method:'PATCH',headers:memberHeaders(),body:JSON.stringify(body)})
 .then(function(r){
   if(!r.ok)throw new Error('rejected');
   memberList.forEach(function(m){if(m.token===token){m.email=body.email||m.email;m.phone=body.phone||m.phone}});
   render();toast(v?u('gl_linked'):u('gl_unlinked'));
 })
 .catch(function(){toast(u('mb_failed'))});
}
function signUpEmail(){
 var f=emailFields();
 if(!f.email||f.email.indexOf('@')<0){emailErr=u('em_bademail');render();return}
 if(f.pass.length<8){emailErr=u('em_shortpass');render();return}
 if(!cloud.url||!cloud.key){emailErr=u('em_nocloud');render();return}
 emailErr='';toast(u('em_creating'));
 fetch(authBase()+'/signup',{method:'POST',
  headers:{'apikey':cloud.key,'Content-Type':'application/json'},
  body:JSON.stringify({email:f.email,password:f.pass})})
 .then(function(r){return r.json()})
 .then(function(d){
   if(d.error||d.msg||d.error_description){
    emailErr=d.msg||d.error_description||d.error;render();return}
   if(d.access_token){saveJwt(d.access_token);afterEmailAuth(f.email);return}
   /* the project is set to confirm addresses first */
   emailMode='check';render();
 }).catch(function(){emailErr=u('em_failed');render()});
}
function signInEmail(){
 var f=emailFields();
 if(!f.email||!f.pass){emailErr=u('em_bothneeded');render();return}
 if(!cloud.url||!cloud.key){emailErr=u('em_nocloud');render();return}
 emailErr='';
 fetch(authBase()+'/token?grant_type=password',{method:'POST',
  headers:{'apikey':cloud.key,'Content-Type':'application/json'},
  body:JSON.stringify({email:f.email,password:f.pass})})
 .then(function(r){return r.json()})
 .then(function(d){
   if(!d.access_token){emailErr=d.error_description||d.msg||u('em_wrong');render();return}
   saveJwt(d.access_token);afterEmailAuth(f.email);
 }).catch(function(){emailErr=u('em_failed');render()});
}
/* a link in an email, no password at all */
function magicLink(){
 var f=emailFields();
 if(!f.email){emailErr=u('em_bademail');render();return}
 fetch(authBase()+'/otp',{method:'POST',
  headers:{'apikey':cloud.key,'Content-Type':'application/json'},
  body:JSON.stringify({email:f.email,create_user:false,
   options:{email_redirect_to:location.origin+location.pathname}})})
 .then(function(){emailMode='sent';render()})
 .catch(function(){emailErr=u('em_failed');render()});
}
function resetPassword(){
 var f=emailFields();
 if(!f.email){emailErr=u('em_bademail');render();return}
 fetch(authBase()+'/recover',{method:'POST',
  headers:{'apikey':cloud.key,'Content-Type':'application/json'},
  body:JSON.stringify({email:f.email})})
 .then(function(){emailMode='reset';render()})
 .catch(function(){emailErr=u('em_failed');render()});
}
function afterEmailAuth(addr){
 authUser={id:'',email:addr,phone:''};
 try{localStorage.setItem('cleanos:user',JSON.stringify(authUser))}catch(e){}
 emailMode=null;
 resolveMembership(function(m){
  if(m)return enterAsMember(m);
  /* signed in, but nobody has linked this address to a company yet */
  render();
 });
}
function appleSignIn(){
 if(!authReady()){toast(u('au_needcloud'));return}
 var back=location.origin+location.pathname;
 location.href=authBase()+'/authorize?provider=apple&redirect_to='+encodeURIComponent(back);
}

/* ---- 5. work done with no signal has to survive ---- */
function queuedOps(){db.pendingOps=db.pendingOps||[];return db.pendingOps}
function queueOp(kind,detail){
 queuedOps().push({at:Date.now(),kind:kind,detail:detail});
 if(queuedOps().length>200)db.pendingOps=queuedOps().slice(-200);
}
function flushQueue(){
 if(!online)return 0;
 var n=queuedOps().length;
 if(!n)return 0;
 /* the data is already in db; the queue exists so a reconnect forces one clean push */
 db.pendingOps=[];
 try{localStorage.setItem(dataKey(),JSON.stringify(db))}catch(e){}
 if(cloud.on)cloudPushNow(true);
 render();
 if(n)toast(n+' '+u('q_synced'));
 return n;
}
function evictSyncedPhotos(){
 if(!cloud.on){toast(u('ph_needcloud'));return}
 var keep={},freed=0;
 /* keep anything from the last two days on the device for speed */
 db.jobs.forEach(function(j){
  if(jobDate(j)>=addDays(todayStr(),-2))(j.photos||[]).forEach(function(p){keep[p.id]=1});
 });
 Object.keys(photos).forEach(function(id){
  if(!keep[id]){freed+=String(photos[id]||'').length;delete photos[id]}
 });
 try{localStorage.setItem(photoKey(),JSON.stringify(photos))}catch(e){}
 render();
 toast(Math.round(freed/1024)+u('ph_freed'));
}
function loadToken(){try{memberToken=localStorage.getItem('cleanos:token2')||''}catch(e){}}
function saveToken(t){memberToken=t||'';try{localStorage.setItem('cleanos:token2',memberToken)}catch(e){}}

/* every request identifies the person, not just the company */
function memberHeaders(extra){
 var h={'apikey':cloud.key,'Authorization':'Bearer '+cloud.key,'Content-Type':'application/json'};
 if(memberToken)h['x-member-token']=memberToken;
 if(cloud.secret)h['x-workspace-secret']=cloud.secret;
 if(extra)for(var k in extra)h[k]=extra[k];
 return h;
}
/* the database tells us who this token belongs to */
function whoAmI(cb){
 if(!cloud.on||!memberToken){cb&&cb(null);return}
 fetch(cloudBase()+'/members?select=person_id,role,name,workspace_id&token=eq.'+encodeURIComponent(memberToken),
  {headers:memberHeaders()})
 .then(function(r){return r.json()})
 .then(function(rows){cb&&cb(rows&&rows[0]?rows[0]:null)})
 .catch(function(){cb&&cb(null)});
}
function signInWithToken(){
 whoAmI(function(m){
  if(!m){toast(u('tk_bad'));return}
  cloud.ws=m.workspace_id;cloud.role=m.role;cloud.person=m.person_id;cloudSaveCfg();
  if(m.role==='manager')signIn('manager',null);
  else if(m.role==='cleaner')signIn('cleaner',m.person_id);
  else signIn('customer',m.person_id);
  toast(u('au_welcome')+' '+(m.name||''));
 });
}
/* the manager hands out one link per person, each with that person's token */
function memberLink(token){
 return location.origin+location.pathname+'#m='+encodeURIComponent(btoa(JSON.stringify({
  u:cloud.url,k:cloud.key,w:cloud.ws,t:token})));
}
function readMemberLink(){
 var m=(location.hash||'').match(/m=([^&]+)/);
 if(!m)return false;
 try{
  var o=JSON.parse(atob(decodeURIComponent(m[1])));
  cloud.url=o.u;cloud.key=o.k;cloud.ws=o.w;cloud.on=true;cloud.status='on';
  setCurrentWs(o.w);cloudSaveCfg();saveToken(o.t);
  if(history.replaceState)history.replaceState(null,'',location.pathname);
  return true;
 }catch(e){return false}
}
function loadMembers(){
 if(!cloud.on){toast(u('mb_needcloud'));return}
 fetch(cloudBase()+'/members?select=token,person_id,role,name,active&workspace_id=eq.'+encodeURIComponent(cloud.ws),
  {headers:memberHeaders()})
 .then(function(r){return r.json()})
 .then(function(rows){memberList=rows||[];render();toast(memberList.length+' '+u('mb_loaded'))})
 .catch(function(e){toast(u('mb_failed'))});
}
function addMember(personId,role,name){
 if(!cloud.on){toast(u('mb_needcloud'));return}
 fetch(cloudBase()+'/members',
  {method:'POST',headers:memberHeaders({'Prefer':'return=representation'}),
   body:JSON.stringify({workspace_id:cloud.ws,person_id:personId,role:role,name:name})})
 .then(function(r){return r.json()})
 .then(function(rows){if(rows&&rows[0])memberList.unshift(rows[0]);render();toast(u('mb_added'))})
 .catch(function(){toast(u('mb_failed'))});
}
function revokeMember(token){
 if(!confirm(u('mb_confirm')))return;
 fetch(cloudBase()+'/members?token=eq.'+encodeURIComponent(token),
  {method:'PATCH',headers:memberHeaders(),body:JSON.stringify({active:false})})
 .then(function(){memberList.forEach(function(m){if(m.token===token)m.active=false});render();toast(u('mb_revoked'))})
 .catch(function(){toast(u('mb_failed'))});
}
function seedMembers(){
 if(!cloud.on){toast(u('mb_needcloud'));return}
 var want=[{id:'office',role:'manager',name:db.company}];
 crew().forEach(function(c){want.push({id:c.id,role:'cleaner',name:c.name})});
 customers().forEach(function(c){want.push({id:c.id,role:'customer',name:c.name})});
 var have={};memberList.forEach(function(m){have[m.person_id]=1});
 var todo=want.filter(function(w){return !have[w.id]});
 if(!todo.length){toast(u('mb_allthere'));return}
 var done=0;
 todo.forEach(function(w){
  fetch(cloudBase()+'/members',
   {method:'POST',headers:memberHeaders({'Prefer':'return=representation'}),
    body:JSON.stringify({workspace_id:cloud.ws,person_id:w.id,role:w.role,name:w.name})})
  .then(function(r){return r.json()})
  .then(function(rows){if(rows&&rows[0])memberList.push(rows[0]);done++;
   if(done===todo.length){render();toast(done+' '+u('mb_made'))}})
  .catch(function(){done++});
 });
}

/* ---- photographs stored in the database, fetched only when looked at ---- */
function photoInCloud(id){return !!(photoIndex&&photoIndex[id])}
function markInCloud(id){photoIndex[id]=1;try{localStorage.setItem('cleanos:phidx',JSON.stringify(photoIndex))}catch(e){}}
function loadPhotoIndex(){try{photoIndex=safeParse(localStorage.getItem('cleanos:phidx')||'{}',{})}catch(e){photoIndex={}}}
/* Photos go to Supabase Storage as real image files when the person signed
   in with Google or email (they carry a verified token). PIN-only devices
   fall back to the database table. Either way the photo is safe off the phone. */
function storageBase(){return cloud.url.replace(/\/+$/,'')+'/storage/v1'}
function photoPath(id){return encodeURIComponent(cloud.ws)+'/'+encodeURIComponent(id)+'.jpg'}
function dataToBlob(data){
 var parts=String(data).split(','),bin=atob(parts[1]||''),arr=new Uint8Array(bin.length);
 for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
 return new Blob([arr],{type:'image/jpeg'});
}
function blobToData(blob,cb){
 try{var fr=new FileReader();fr.onload=function(){cb(fr.result)};fr.onerror=function(){cb(null)};fr.readAsDataURL(blob)}
 catch(e){cb(null)}
}
function uploadPhoto(id,data,jobId,area){
 if(!cloud.on)return;
 if(authJwt){
  fetch(storageBase()+'/object/job-photos/'+photoPath(id),{method:'POST',
   headers:{'apikey':cloud.key,'Authorization':'Bearer '+authJwt,'Content-Type':'image/jpeg','x-upsert':'false'},
   body:dataToBlob(data)})
  .then(function(r){if(r.ok){photoIndex[id]='s';markInCloud(id)}else uploadPhotoTable(id,data,jobId,area)})
  .catch(function(){uploadPhotoTable(id,data,jobId,area)});
  return;
 }
 uploadPhotoTable(id,data,jobId,area);
}
function uploadPhotoTable(id,data,jobId,area){
 fetch(cloudBase()+'/workspace_photos',
  {method:'POST',headers:memberHeaders({'Prefer':'resolution=merge-duplicates'}),
   body:JSON.stringify({id:id,workspace_id:cloud.ws,job_id:String(jobId||''),area:area||'',
    taken_by:(session&&session.id)||'office',data:data})})
 .then(function(r){if(r.ok)markInCloud(id)})
 .catch(function(){});
}
function fetchStoragePhoto(id,cb){
 fetch(storageBase()+'/object/authenticated/job-photos/'+photoPath(id),
  {headers:{'apikey':cloud.key,'Authorization':'Bearer '+authJwt}})
 .then(function(r){if(!r.ok)throw new Error('missing');return r.blob()})
 .then(function(b){blobToData(b,cb)})
 .catch(function(){cb(null)});
}
function fetchPhoto(id,cb){
 if(photos[id])return cb&&cb(photos[id]);
 if(!cloud.on)return cb&&cb(null);
 var keep=function(d){
  if(d){photos[id]=d;markInCloud(id);try{localStorage.setItem(photoKey(),JSON.stringify(photos))}catch(e){}render()}
  cb&&cb(d);
 };
 var fromTable=function(){
  fetch(cloudBase()+'/workspace_photos?select=data&workspace_id=eq.'+encodeURIComponent(cloud.ws)+'&id=eq.'+encodeURIComponent(id),{headers:memberHeaders()})
  .then(function(r){return r.json()})
  .then(function(rows){keep(rows&&rows[0]?rows[0].data:null)})
  .catch(function(){cb&&cb(null)});
 };
 if(authJwt)fetchStoragePhoto(id,function(d){if(d)keep(d);else fromTable()});
 else fromTable();
}
function freeSpace(){
 if(!cloud.on){toast(u('ph_needcloud'));return}
 var keep={},freed=0,skipped=0;
 db.jobs.forEach(function(j){
  if(jobDate(j)>=addDays(todayStr(),-2))(j.photos||[]).forEach(function(p){keep[p.id]=1});
 });
 Object.keys(photos).forEach(function(id){
  if(keep[id])return;
  if(!photoInCloud(id)){skipped++;return}   /* never drop what is not safely uploaded */
  freed+=String(photos[id]||'').length;delete photos[id];
 });
 try{localStorage.setItem(photoKey(),JSON.stringify(photos))}catch(e){}
 render();
 toast(Math.round(freed/1024)+u('ph_freed')+(skipped?' · '+skipped+' '+u('ph_kept'):''));
}
function photoStats(){
 var local=0,n=0;
 for(var k in photos){local+=String(photos[k]||'').length;n++}
 var total=0;db.jobs.forEach(function(j){total+=(j.photos||[]).length});
 var up=0;for(var k2 in photoIndex)up++;
 return {onDevice:n,kb:Math.round(local/1024),total:total,inCloud:up};
}
function touched(){lastTouch=Date.now()}
function pollGap(){
 if(typeof document!=='undefined'&&document.hidden)return 60000;   /* back tab */
 var busy=db.jobs&&db.jobs.some(function(j){return j.status==='progress'});
 var active=Date.now()-lastTouch<120000;
 if(busy&&active)return 2500;    /* someone is mid-job and watching */
 if(busy||active)return 6000;
 return 20000;                    /* nothing happening */
}
function cloudPollAdaptive(){
 if(cloud.timer)clearTimeout(cloud.timer);
 loadBase();
 var tick=function(){
  if(!cloud.on){cloud.timer=null;return}
  if(cloud.busy||open){cloud.timer=setTimeout(tick,pollGap());return}
  remoteRev().then(function(rv){
    if(rv!=null&&rv>(cloud.rev||0))return remoteFull().then(function(full){if(full)cloudApply(full)});
  }).catch(function(){})
  .then(function(){cloud.timer=setTimeout(tick,pollGap())});
 };
 cloud.timer=setTimeout(tick,pollGap());
}
/* things everyone else needs to see immediately go straight up */
function pushNow(){
 if(!cloud.on)return;
 if(pushTimer){clearTimeout(pushTimer);pushTimer=null}
 cloudPushNow(true);
}
function sendAccessRequest(){
 var n=((document.getElementById('ar-name')||{}).value||'').trim();
 var w=((document.getElementById('ar-ws')||{}).value||'').trim();
 if(!n||!w){toast(u('req_need'));return}
 var req={id:'AR'+Date.now(),at:Date.now(),name:n,ws:w,
  email:((document.getElementById('ar-email')||{}).value||'').trim(),
  phone:((document.getElementById('ar-phone')||{}).value||'').replace(/[^0-9+]/g,''),
  prop:((document.getElementById('ar-prop')||{}).value||'').trim(),
  status:'waiting'};
 /* if this device can reach the company, file it there; otherwise keep it
    locally so the office picks it up when they next open the app */
 if(cloud.url&&cloud.key){
  fetch(cloudBase()+'/rpc/request_access',{method:'POST',
   headers:{'apikey':cloud.key,'Authorization':'Bearer '+cloud.key,'Content-Type':'application/json'},
   body:JSON.stringify({p_ws:w,p_req:req})})
  .then(function(r){return r.json()})
  .then(function(okv){if(okv===true){askAccess='done';render()}else toast(u('req_nocompany'))})
  .catch(function(){toast(u('req_failed'))});
 } else {
  accessRequests().unshift(req);save();askAccess='done';render();
 }
}
function revokeMemberQuiet(token){
 fetch(cloudBase()+'/members?token=eq.'+encodeURIComponent(token),
  {method:'PATCH',headers:memberHeaders(),body:JSON.stringify({active:false,email:null,phone:null})}).catch(function(){});
}
function pushSupported(){
 return typeof navigator!=='undefined'&&('serviceWorker' in navigator)&&typeof window!=='undefined'&&('PushManager' in window)&&('Notification' in window);
}
function pushOn(){try{return localStorage.getItem('cleanos:push')==='1'}catch(e){return false}}
function b64urlToBytes(b){
 var p='='.repeat((4-b.length%4)%4),raw=atob((b+p).replace(/-/g,'+').replace(/_/g,'/')),out=new Uint8Array(raw.length);
 for(var i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;
}
function enablePush(){
 if(!APP_PUSH_KEY){toast(u('ps_nokey'));return}
 if(!pushSupported()){toast(u('ps_unsupported'));return}
 if(!cloud.on||!memberToken){toast(u('ps_needaccount'));return}
 Notification.requestPermission().then(function(p){
  if(p!=='granted'){toast(u('ps_denied'));return}
  return navigator.serviceWorker.ready.then(function(reg){
   return reg.pushManager.getSubscription().then(function(sub){
    return sub||reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64urlToBytes(APP_PUSH_KEY)});
   });
  }).then(function(sub){
   var j=sub.toJSON();
   return fetch(cloudBase()+'/push_subs',{method:'POST',headers:memberHeaders({'Prefer':'resolution=merge-duplicates'}),
    body:JSON.stringify({endpoint:j.endpoint,keys:j.keys,workspace_id:cloud.ws,
     person_id:cloud.person||(session.role==='manager'?'office':session.id),role:syncRole()})});
  }).then(function(r){
   if(r&&!r.ok)throw new Error('refused');
   try{localStorage.setItem('cleanos:push','1')}catch(e){}
   render();toast(u('ps_on'));
  });
 }).catch(function(){toast(u('ps_failed'))});
}
function disablePush(){
 if(!pushSupported())return;
 navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription()})
 .then(function(sub){
  if(!sub)return;
  var ep=sub.endpoint;
  return sub.unsubscribe().then(function(){
   return fetch(cloudBase()+'/push_subs?endpoint=eq.'+encodeURIComponent(ep),{method:'DELETE',headers:memberHeaders()});
  });
 }).catch(function(){})
 .then(function(){try{localStorage.removeItem('cleanos:push')}catch(e){};render();toast(u('ps_off'))});
}
function functionsBase(){return cloud.url.replace(/\/+$/,'')+'/functions/v1'}
function sendPush(kind,text,to){
 if(!cloud.on||!memberToken||!cloud.url)return;
 fetch(functionsBase()+'/notify',{method:'POST',
  headers:{'apikey':cloud.key,'Authorization':'Bearer '+cloud.key,'Content-Type':'application/json','x-member-token':memberToken},
  body:JSON.stringify({kind:kind,title:db.company,text:text,to:to||null})}).catch(function(){});
}
function googlePane(){
 var pts=db.props.filter(function(p){return p.lat&&p.lng});
 if(!pts.length)return '';
 var live=db.jobs.filter(function(j){return j.status==='progress'})[0];
 var chosen=(gPick&&property(gPick))||(live&&property(live.prop))||pts[0];
 var h='<div style="position:relative">'+
  '<iframe title="map" src="'+gEmbed(chosen)+'" style="width:100%;height:440px;border:0;display:block" '+
  'loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>';
 h+='<div style="display:flex;gap:6px;flex-wrap:wrap;padding:9px 13px;border-top:1px solid var(--line)">';
 pts.forEach(function(p){
  var on=chosen&&p.name===chosen.name;
  h+='<button class="btn '+(on?'':'ghost')+'" style="font-size:11.5px" onclick="pickG(\''+jarg(p.name)+'\')">'+esc(p.name.split('—')[0].trim())+'</button>';
 });
 return h+'</div>';
}
function cloudLoadCfg(){
 try{var c=localStorage.getItem('cleanos:cloud');if(c){var o=JSON.parse(c);
  cloud.url=o.url||'';cloud.key=o.key||'';cloud.ws=o.ws||'';cloud.secret=o.secret||'';
  cloud.on=!!o.on;cloud.rev=o.rev||0;cloud.role=o.role||'';cloud.person=o.person||''}}catch(e){}
 /* nothing saved on this device yet: use the built-in database */
 if(!cloud.url&&APP_CLOUD.url){cloud.url=APP_CLOUD.url;cloud.key=APP_CLOUD.key}
}
function cloudSaveCfg(){
 try{localStorage.setItem('cleanos:cloud',JSON.stringify({url:cloud.url,key:cloud.key,
  ws:cloud.ws,secret:cloud.secret,on:cloud.on,rev:cloud.rev,role:cloud.role||'',person:cloud.person||''}))}catch(e){}
}
function cloudHeaders(extra){return memberHeaders(extra)}
function cloudBase(){return cloud.url.replace(/\/+$/,'')+'/rest/v1'}
function cloudConnect(){
 cloud.url=document.getElementById('cl-url').value.trim();
 cloud.key=document.getElementById('cl-key').value.trim();
 cloud.ws=document.getElementById('cl-ws').value.trim();
 cloud.secret=document.getElementById('cl-secret').value.trim();
 if(!cloud.url||!cloud.key||!cloud.ws||!cloud.secret){toast(u('cl_missing'));return}
 cloud.status='connecting';render();
 fetch(cloudBase()+'/workspaces?id=eq.'+encodeURIComponent(cloud.ws)+'&select=rev,data',
  {headers:cloudHeaders()})
 .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
 .then(function(rows){
   if(!rows.length)throw new Error('workspace not found or wrong secret');
   cloud.on=true;cloud.status='on';cloudSaveCfg();
   var remote=rows[0];
   if(remote.data&&remote.data.jobs){
     if(confirm(u('cl_pullask'))){cloudApply(remote)}
     else{cloud.rev=remote.rev;cloudPush(true)}
   } else cloudPush(true);
   cloudPollAdaptive();
   toast(u('cl_connected'));
   render();
 })
 .catch(function(e){cloud.status='error:'+e.message;render();toast(u('cl_failed')+' '+e.message)});
}
function cloudDisconnect(){
 cloud.on=false;cloud.status='off';
 if(cloud.timer){clearInterval(cloud.timer);cloud.timer=null}
 cloudSaveCfg();render();toast(u('cl_off'));
}

/* ============================================================
   SYNC v3
   Who reads what is now decided by the database:
     manager   reads and writes the company record directly
     cleaner   reads a trimmed copy, saves through member_save
     customer  reads only their own things, saves through member_save
   Two people saving at once no longer overwrite each other: the
   manager's save only succeeds against the version it started
   from, and on a clash the two versions are merged item by item.
   ============================================================ */
function syncRole(){
 if(cloud.role)return cloud.role;
 if(session&&session.role&&memberToken)return session.role;
 return 'manager';
}
function baseKey(){return 'cleanos:base:'+(cloud.ws||'')}
function loadBase(){try{var v=localStorage.getItem(baseKey());cloud.base=v?JSON.parse(v):null}catch(e){cloud.base=null}}
function setBase(d){cloud.base=JSON.parse(JSON.stringify(d||{}));try{localStorage.setItem(baseKey(),JSON.stringify(cloud.base))}catch(e){}}

/* ---- three-way merge: what changed here, what changed there, keep both ---- */
function same(a,b){return JSON.stringify(a)===JSON.stringify(b)}
function idKey(arr){
 for(var i=0;arr&&i<arr.length;i++){var o=arr[i];
  if(o&&typeof o==='object'&&!Array.isArray(o)){
   if('id' in o)return 'id';if('name' in o)return 'name';if('at' in o)return 'at';return null}}
 return null;
}
function indexBy(arr,k){var m={};(arr||[]).forEach(function(x){if(x&&typeof x==='object')m[String(x[k])]=x});return m}
function bumpId(id,taken){
 if(typeof id==='number'){var mx=0;taken.forEach(function(t){if(typeof t==='number'&&t>mx)mx=t});return mx+1}
 var m=String(id).match(/^(.*?)(\d+)$/);
 if(!m)return String(id)+'-'+Math.random().toString(36).slice(2,6);
 var hi=0;taken.forEach(function(t){var mm=String(t).match(/^(.*?)(\d+)$/);if(mm&&mm[1]===m[1])hi=Math.max(hi,+mm[2])});
 return m[1]+(hi+1);
}
function merge3(b,l,r){
 if(same(l,r))return l;
 if(b!==undefined&&same(b,l))return r;
 if(b!==undefined&&same(b,r))return l;
 if(Array.isArray(l)&&Array.isArray(r)){
  var B=Array.isArray(b)?b:[];
  var prim=l.concat(r).every(function(x){return x===null||typeof x!=='object'});
  if(prim){
   /* append-only lists (ratings) keep every addition from both sides */
   if(same(l.slice(0,B.length),B)&&same(r.slice(0,B.length),B))
    return B.concat(l.slice(B.length),r.slice(B.length));
   /* otherwise a set: keep additions from both, honour removals from either */
   var out=[];
   l.forEach(function(x){if(out.indexOf(x)<0&&!(B.indexOf(x)>-1&&r.indexOf(x)<0))out.push(x)});
   r.forEach(function(x){if(out.indexOf(x)<0&&B.indexOf(x)<0)out.push(x)});
   return out;
  }
  var k=idKey(l)||idKey(r)||idKey(B);
  if(!k)return l;
  var bm=indexBy(B,k),lm=indexBy(l,k),rm=indexBy(r,k),order=[],seen={};
  l.forEach(function(x){var id=String(x[k]);if(!seen[id]){seen[id]=1;order.push(id)}});
  r.forEach(function(x){var id=String(x[k]);if(!seen[id]){seen[id]=1;order.push(id)}});
  var res=[],taken=l.concat(r).map(function(x){return x[k]});
  order.forEach(function(id){
   var inB=id in bm,inL=id in lm,inR=id in rm;
   if(inL&&inR){
    if(!inB&&!same(lm[id],rm[id])&&k==='id'){
     /* both sides created a new item with the same number: keep both */
     res.push(rm[id]);
     var copy=JSON.parse(JSON.stringify(lm[id]));copy.id=bumpId(lm[id].id,taken);taken.push(copy.id);
     res.push(copy);
    } else res.push(merge3(inB?bm[id]:undefined,lm[id],rm[id]));
   }
   else if(inL){if(!(inB&&same(bm[id],lm[id])))res.push(lm[id])}   /* else: deleted there */
   else if(inR){if(!(inB&&same(bm[id],rm[id])))res.push(rm[id])}   /* else: deleted here */
  });
  return res;
 }
 if(l&&r&&typeof l==='object'&&typeof r==='object'&&!Array.isArray(l)&&!Array.isArray(r)){
  var bb=(b&&typeof b==='object'&&!Array.isArray(b))?b:{},o={},ks={};
  Object.keys(l).concat(Object.keys(r)).forEach(function(kk){ks[kk]=1});
  Object.keys(ks).forEach(function(kk){
   var inL=kk in l,inR=kk in r;
   if(inL&&inR){
    if(/^seq/.test(kk)&&typeof l[kk]==='number'&&typeof r[kk]==='number')o[kk]=Math.max(l[kk],r[kk]);
    else o[kk]=merge3(bb[kk],l[kk],r[kk]);
   }
   else if(inL){if(!(kk in bb&&same(bb[kk],l[kk])))o[kk]=l[kk]}
   else{if(!(kk in bb&&same(bb[kk],r[kk])))o[kk]=r[kk]}
  });
  return o;
 }
 return l;   /* the same single value changed on both: this device wins */
}
function fixSeqs(d){
 function hiNum(arr,re){var h=0;(arr||[]).forEach(function(x){var v=x&&x.id;
  if(typeof v==='number')h=Math.max(h,v);else if(re){var m=String(v||'').match(re);if(m)h=Math.max(h,+m[1])}});return h}
 d.seqJob=Math.max(d.seqJob||1,hiNum(d.jobs)+1);
 d.seqIssue=Math.max(d.seqIssue||1,hiNum(d.issues)+1);
 d.seqTask=Math.max(d.seqTask||1,hiNum(d.tasks,/^T-(\d+)$/)+1);
 d.seqReq=Math.max(d.seqReq||1,hiNum(d.requests,/^B-(\d+)$/)+1);
 return d;
}

/* ---- reading ---- */
function remoteRev(){
 if(syncRole()==='manager')
  return fetch(cloudBase()+'/workspaces?id=eq.'+encodeURIComponent(cloud.ws)+'&select=rev',{headers:memberHeaders()})
   .then(function(r){return r.json()}).then(function(rows){return rows&&rows[0]?rows[0].rev:null});
 return fetch(cloudBase()+'/rpc/member_rev',{method:'POST',headers:memberHeaders(),body:'{}'})
  .then(function(r){return r.json()}).then(function(v){return typeof v==='number'?v:null});
}
function remoteFull(){
 if(syncRole()==='manager')
  return fetch(cloudBase()+'/workspaces?id=eq.'+encodeURIComponent(cloud.ws)+'&select=rev,data',{headers:memberHeaders()})
   .then(function(r){return r.json()}).then(function(rows){return rows&&rows[0]?rows[0]:null});
 return fetch(cloudBase()+'/rpc/member_view',{method:'POST',headers:memberHeaders(),body:'{}'})
  .then(function(r){return r.json()}).then(function(v){return v&&v.data?v:null});
}
function cloudApply(remote){
 if(!remote||!remote.data)return;
 var incoming=remote.data;
 /* local changes not yet saved are merged in, not thrown away */
 if(cloud.dirty&&cloud.base)db=fixSeqs(merge3(cloud.base,db,incoming));
 else db=incoming;
 cloud.rev=remote.rev;setBase(incoming);cloudSaveCfg();
 try{localStorage.setItem(dataKey(),JSON.stringify(db))}catch(e){}
 cloudFetchPhotos();
 render();
}
function cloudPush(silent){
 if(!cloud.on)return;
 cloud.dirty=true;
 if(pushTimer)clearTimeout(pushTimer);
 pushTimer=setTimeout(function(){pushTimer=null;cloudPushNow(silent)},900);
}
function cloudPushNow(silent,tries){
 if(!cloud.on)return;
 if(cloud.busy){cloud.pending=true;return}
 cloud.busy=true;tries=tries||0;
 var done=function(){cloud.busy=false;if(cloud.pending){cloud.pending=false;cloudPushNow(true)}};
 if(syncRole()!=='manager'){
  /* cleaners and customers: the database keeps only what they may change */
  fetch(cloudBase()+'/rpc/member_save',{method:'POST',headers:memberHeaders(),body:JSON.stringify({p_data:db})})
  .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
  .then(function(){cloud.dirty=false;cloud.status='on';return remoteFull()})
  .then(function(full){if(full){cloud.rev=full.rev;db=full.data;setBase(full.data);
    try{localStorage.setItem(dataKey(),JSON.stringify(db))}catch(e){};render()}})
  .catch(function(e){cloud.status='error:'+e.message})
  .then(done);
  return;
 }
 /* manager: only overwrite the version this device last saw */
 fetch(cloudBase()+'/workspaces?id=eq.'+encodeURIComponent(cloud.ws)+'&rev=eq.'+encodeURIComponent(cloud.rev||0),
  {method:'PATCH',headers:memberHeaders({'Prefer':'return=representation'}),body:JSON.stringify({data:db})})
 .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
 .then(function(rows){
   if(rows&&rows[0]){
    cloud.rev=rows[0].rev;cloud.dirty=false;setBase(db);cloud.status='on';cloudSaveCfg();
    if(!silent&&session&&session.role==='manager')updateCloudBadge();
    return;
   }
   /* someone else saved first: merge their version with ours, then try again */
   return remoteFull().then(function(remote){
    if(!remote)throw new Error('could not read the latest version');
    db=fixSeqs(merge3(cloud.base||{},db,remote.data));
    cloud.rev=remote.rev;setBase(remote.data);
    try{localStorage.setItem(dataKey(),JSON.stringify(db))}catch(e){}
    render();
    if(tries<4){cloud.busy=false;cloudPushNow(true,tries+1);cloud.busy=true}
   });
 })
 .catch(function(e){cloud.status='error:'+e.message})
 .then(done);
}
function cloudPoll(){
 if(cloud.timer)clearInterval(cloud.timer);
 cloud.timer=setInterval(function(){
  if(!cloud.on||cloud.busy||open)return;
  fetch(cloudBase()+'/workspaces?id=eq.'+encodeURIComponent(cloud.ws)+'&select=rev',
   {headers:cloudHeaders()})
  .then(function(r){return r.json()})
  .then(function(rows){
    if(!rows||!rows.length)return;
    if(rows[0].rev>cloud.rev){
     fetch(cloudBase()+'/workspaces?id=eq.'+encodeURIComponent(cloud.ws)+'&select=rev,data',
      {headers:cloudHeaders()})
     .then(function(r){return r.json()})
     .then(function(full){if(full&&full[0])cloudApply(full[0])});
    }
  }).catch(function(){});
 },8000);
}
function cloudPushPhoto(id,data){uploadPhoto(id,data,'','')}
function cloudFetchPhotos(){
 if(!cloud.on)return;
 var need=[];
 db.jobs.forEach(function(j){(j.photos||[]).forEach(function(p){if(!photos[p.id])need.push(p.id)})});
 if(!need.length)return;
 need=need.slice(0,40);
 if(authJwt){need.slice(0,12).forEach(function(id){fetchPhoto(id)});return}
 fetch(cloudBase()+'/workspace_photos?workspace_id=eq.'+encodeURIComponent(cloud.ws)+'&id=in.('+need.map(encodeURIComponent).join(',')+')&select=id,data',
  {headers:memberHeaders()})
 .then(function(r){return r.json()})
 .then(function(rows){
   if(!rows||!rows.length)return;
   rows.forEach(function(r2){photos[r2.id]=r2.data;markInCloud(r2.id)});
   try{localStorage.setItem(photoKey(),JSON.stringify(photos))}catch(e){}
   render();
 }).catch(function(){});
}
function updateCloudBadge(){}
function cloudLabel(){
 if(!cloud.on)return u('cl_offline');
 if(cloud.status.indexOf('error')===0)return u('cl_error');
 return u('cl_live')+' · r'+cloud.rev;
}
function copyMemberLink(token){
 var l=memberLink(token);
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(l);toast(u('a_copied'))}
  else{open={type:'link',link:l};render()}}catch(e){open={type:'link',link:l};render()}
}
