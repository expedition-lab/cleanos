/* The business itself: jobs, people, properties, money, stock, schedules. */
function ic(n){return '<svg class="i" viewBox="0 0 24 24">'+(IC[n]||'')+'</svg>'}
function guessCountry(){
 /* the region in the browser locale is the best signal; time zone is the fallback */
 try{
  var loc=(navigator.language||'').split('-')[1];
  if(loc&&COUNTRIES[loc.toUpperCase()])return loc.toUpperCase();
  var tz=(Intl.DateTimeFormat().resolvedOptions().timeZone)||'';
  var map={'Indian/Mauritius':'MU','Asia/Dubai':'AE','Asia/Riyadh':'SA','Asia/Qatar':'QA',
   'Asia/Kuwait':'KW','Asia/Bahrain':'BH','Asia/Muscat':'OM','Europe/London':'GB','Europe/Paris':'FR',
   'Europe/Dublin':'IE','Europe/Madrid':'ES','Europe/Lisbon':'PT','Europe/Berlin':'DE','Europe/Rome':'IT',
   'Europe/Amsterdam':'NL','Europe/Brussels':'BE','Europe/Zurich':'CH','America/New_York':'US',
   'America/Chicago':'US','America/Denver':'US','America/Los_Angeles':'US','America/Toronto':'CA',
   'America/Vancouver':'CA','Australia/Sydney':'AU','Australia/Melbourne':'AU','Pacific/Auckland':'NZ',
   'Asia/Singapore':'SG','Asia/Kolkata':'IN','Asia/Karachi':'PK','Asia/Manila':'PH','Africa/Johannesburg':'ZA',
   'Africa/Nairobi':'KE','Africa/Lagos':'NG','Africa/Cairo':'EG','Africa/Casablanca':'MA','Asia/Tokyo':'JP','Asia/Hong_Kong':'HK','Asia/Ho_Chi_Minh':'VN','Asia/Dhaka':'BD','Asia/Colombo':'LK','Asia/Kathmandu':'NP','Asia/Amman':'JO','Asia/Beirut':'LB','Europe/Istanbul':'TR','Europe/Warsaw':'PL','Europe/Stockholm':'SE','America/Sao_Paulo':'BR','America/Mexico_City':'MX','Asia/Calcutta':'IN','Australia/Brisbane':'AU','Australia/Perth':'AU','America/Edmonton':'CA','America/Phoenix':'US','Indian/Reunion':'RE','Indian/Antananarivo':'MG','Africa/Tunis':'TN','Africa/Dakar':'SN','Africa/Abidjan':'CI',
   'Indian/Mahe':'SC','Indian/Maldives':'MV','Asia/Bangkok':'TH','Asia/Kuala_Lumpur':'MY','Asia/Jakarta':'ID'};
  if(map[tz]&&COUNTRIES[map[tz]])return map[tz];
  /* nothing matched: go by language rather than assume the Gulf */
  var lg=(navigator.language||'').slice(0,2).toLowerCase();
  var byLang={fr:'FR',ar:'AE',de:'DE',es:'ES',it:'IT',pt:'PT',nl:'NL',ja:'JP',tr:'TR',pl:'PL',sv:'SE',th:'TH',vi:'VN',id:'ID',ms:'MY'};
  if(byLang[lg])return byLang[lg];
 }catch(e){}
 return 'OT';
}
function u(k){
 var d=U[uiLang];
 if(d&&d[k])return d[k];
 return U.en[k]||FALLBACK_EN[k]||k;
}
function uiDir(){return (U[uiLang]&&U[uiLang].dir)||'ltr'}
function setUi(l){uiLang=l;if(db&&db.settings)db.settings.uiLang=l;save();render()}
function settingsFor(code,taxId,phone){
 var c=COUNTRIES[code]||COUNTRIES.AE;
 return {country:code,currency:c.cur,locale:c.loc,taxRate:c.tax,taxLabel:c.taxLabel,
  idLabel:c.idLabel,taxId:taxId||'',weekStart:c.week,dial:c.dial,officePhone:phone||(c.dial+'500000000')};
}
function S(){return (db&&db.settings)?db.settings:settingsFor('AE')}
function taxRate(){return S().taxRate||0}
function taxLabel(){var r=taxRate();return S().taxLabel+(r?' '+(r*100).toFixed(r*100%1?1:0)+'%':'')}
function money(n){
 var st=S();
 try{return new Intl.NumberFormat(st.locale,{style:'currency',currency:st.currency,
  maximumFractionDigits:(st.currency==='KWD'||st.currency==='BHD'||st.currency==='OMR'||st.currency==='TND')?3:0}).format(n||0)}
 catch(e){return st.currency+' '+Math.round(n||0).toLocaleString('en-US')}
}
function weekDays(short){
 var full=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 var sh=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 var src=short?sh:full,out=[],st=S().weekStart||0;
 for(var i=0;i<7;i++)out.push({d:(st+i)%7,label:src[(st+i)%7]});
 return out;
}
function mins(m){return Date.now()-m*MIN}
function seed(){return{
 company:'Sparkle Facilities LLC',setup:true,ratings:{},settings:settingsFor('AE','100472913800003','971500000000'),cleaners:JSON.parse(JSON.stringify(CLEANERS_DEFAULT)),
 customers:[
  {id:'cu1',name:'Marina Heights Tower',contact:'Reem Haddad',phone:'971504418822',email:''},
  {id:'cu2',name:'Frond K Holiday Homes',contact:'Yannis P.',phone:'971559031188',email:''},
  {id:'cu3',name:'Gulf Property Co',contact:'Imran S.',phone:'971521180044',email:''},
  {id:'cu4',name:'Bay Square Living',contact:'Dana K.',phone:'971562209911',email:''},
  {id:'cu5',name:'Bloom Residences',contact:'Front desk',phone:'971587710033',email:''},
  {id:'cu6',name:'Boulevard Homes',contact:'Concierge',phone:'971501234567',email:''},
  {id:'cu7',name:'Direct — H. Rashed',contact:'H. Rashed',phone:'971509876543',email:''}
 ],
 props:[
  {name:'Marina Gate 2 — 1204',area:'Dubai Marina',lat:25.0801,lng:55.1401,key:'Concierge desk, ask for 1204',park:'B2 bay 47',wifi:'MG2-1204 / marina2024',alarm:'—',note:'Cat inside, keep the balcony shut'},
  {name:'Palm Villa Frond K-12',area:'Palm Jumeirah',lat:25.1122,lng:55.1381,key:'Lockbox left gate, code 4417',park:'Driveway',wifi:'PalmK12 / guestpalm',alarm:'Disarm 8890 at the front panel',note:'Pool not included in standard'},
  {name:'Cluster N — 3706',area:'JLT',lat:25.0691,lng:55.1423,key:'Security desk, ID required',park:'Visitor P3',wifi:'—',alarm:'—',note:'Lift 2 only'},
  {name:'Bay Square 4 — 2205',area:'Business Bay',lat:25.1842,lng:55.2791,key:'Agent meets on site',park:'Street after 10:00',wifi:'BSQ_2205 / bay22050',alarm:'—',note:'Tenant works nights, not before 11:00'},
  {name:'Bloom Heights B-909',area:'JVC',lat:25.0583,lng:55.2102,key:'Key with building manager',park:'Any visitor bay',wifi:'—',alarm:'—',note:''},
  {name:'Marina Gate 2 — 0708',area:'Dubai Marina',lat:25.0803,lng:55.1399,key:'Concierge desk',park:'B2 visitor',wifi:'—',alarm:'—',note:'Boxes in bedroom 2, do not move'},
  {name:'The Address Blvd — 3401',area:'Downtown',lat:25.1951,lng:55.2742,key:'Concierge, register 24h ahead',park:'P4',wifi:'—',alarm:'—',note:''},
  {name:'Al Barsha Villa 22',area:'Al Barsha',lat:25.1123,lng:55.2001,key:'Gate code 2280',park:'Driveway',wifi:'—',alarm:'—',note:'Dog in the yard, keep the gate closed'}],
 jobs:[
  {id:4471,prop:'Marina Gate 2 — 1204',customer:'Marina Heights Tower',service:'Standard',tier:'standard',cleaner:'c1',time:'11:00',price:165,status:'progress',started:mins(43),finished:null,checked:['living','bedrooms','bathrooms','kitchen','floors','windows','dusting'],photos:[],rating:0,signed:false,onWay:null,geo:null},
  {id:4472,prop:'Palm Villa Frond K-12',customer:'Frond K Holiday Homes',service:'Turnover',tier:'premium',cleaner:'c4',time:'09:00',price:527,status:'progress',started:mins(97),finished:null,checked:CHECK_KEYS.slice(0,9),photos:[],rating:0,signed:false,onWay:mins(104),geo:{dist:31,at:mins(97)}},
  {id:4468,prop:'Cluster N — 3706',customer:'Gulf Property Co',service:'Standard',tier:'standard',cleaner:'c2',time:'07:40',price:150,status:'done',started:mins(318),finished:mins(197),checked:CHECK_KEYS.slice(),photos:[],rating:5,signed:true,onWay:mins(326),geo:{dist:12,at:mins(318)}},
  {id:4467,prop:'Bay Square 4 — 2205',customer:'Bay Square Living',service:'Move-out',tier:'premium',tierNote:true,cleaner:'c2',time:'06:15',price:806,status:'done',started:mins(437),finished:mins(322),checked:CHECK_KEYS.slice(),photos:[],rating:4,signed:true,onWay:null,geo:{dist:8,at:mins(437)}},
  {id:4469,prop:'Bloom Heights B-909',customer:'Bloom Residences',service:'Standard',tier:'standard',cleaner:'c3',time:'08:30',price:150,status:'done',started:mins(268),finished:mins(196),checked:CHECK_KEYS.slice(0,8),photos:[],rating:0,signed:false,onWay:null,geo:null},
  {id:4473,prop:'Marina Gate 2 — 0708',customer:'Marina Heights Tower',service:'Standard',tier:'standard',cleaner:'c3',time:'13:15',price:165,status:'sched',started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null},
  {id:4474,prop:'Al Barsha Villa 22',customer:'Direct — H. Rashed',service:'Deep clean',tier:'premium',cleaner:'c5',time:'14:00',price:442,status:'sched',started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null},
  {id:4466,prop:'The Address Blvd — 3401',customer:'Boulevard Homes',service:'Standard',tier:'standard',cleaner:'c1',time:'07:00',price:180,status:'problem',started:mins(472),finished:null,checked:['living'],photos:[],rating:0,signed:false,onWay:null,geo:null},
  {id:4470,prop:'Cluster N — 3706',customer:'Gulf Property Co',service:'Standard',tier:'standard',cleaner:'c5',time:'12:30',price:150,status:'cancelled',started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null}],
 tasks:[
  {id:'T-882',prop:'Marina Gate 2 — 1204',customer:'Marina Heights Tower',type:'bins',fee:25,status:'open',by:null,at:mins(18),done:null,photo:null},
  {id:'T-881',prop:'Bay Square 4 — 2205',customer:'Bay Square Living',type:'heavy',fee:60,status:'taken',by:'c2',at:mins(64),done:null,photo:null,note:'Sofa from lobby to 2205'},
  {id:'T-880',prop:'Palm Villa Frond K-12',customer:'Frond K Holiday Homes',type:'wait',fee:55,status:'open',at:mins(9),by:null,done:null,photo:null,note:'Furniture delivery between 14:00 and 16:00'},
  {id:'T-879',prop:'The Address Blvd — 3401',customer:'Boulevard Homes',type:'parcel',fee:30,status:'done',by:'c1',at:mins(210),done:mins(188),photo:null}],
 contracts:[
  {id:'R-01',prop:'Marina Gate 2 — 1204',customer:'Marina Heights Tower',service:'Standard',tier:'standard',cleaner:'c1',time:'11:00',price:165,freq:'weekly',days:[1,4]},
  {id:'R-02',prop:'Palm Villa Frond K-12',customer:'Frond K Holiday Homes',service:'Turnover',tier:'premium',cleaner:'c4',time:'09:00',price:527,freq:'weekly',days:[0,2,5]},
  {id:'R-03',prop:'Bay Square 4 — 2205',customer:'Bay Square Living',service:'Standard',tier:'standard',cleaner:'c2',time:'06:15',price:150,freq:'fortnightly',days:[3]}],
 requests:[{id:'B-31',customer:'Marina Heights Tower',prop:'Marina Gate 2 — 0708',when:'Tomorrow after 14:00',service:'Standard',tier:'premium',note:'Guest checks in at 18:00',at:mins(52),status:'pending',deposit:0}],
 issues:[
  {id:1184,job:4471,prop:'Marina Gate 2 — 1204',by:'c1',type:'broken',note:'Washing machine not draining, water on the floor',at:mins(22),priority:'Medium',open:true,photo:null},
  {id:1183,job:4466,prop:'The Address Blvd — 3401',by:'c1',type:'noaccess',note:'Concierge has no record of the visit',at:mins(468),priority:'High',open:true,photo:null}],
 stock:[
  {id:'s0',item:'Floor cleaner 5L',qty:11,min:6,unit:'bottles',cost:24,supplier:'Al Noor Supplies'},
  {id:'s1',item:'Toilet cleaner 1L',qty:7,min:6,unit:'bottles',cost:11,supplier:'Al Noor Supplies'},
  {id:'s2',item:'Microfibre cloth',qty:38,min:20,unit:'pcs',cost:6,supplier:'Al Noor Supplies'},
  {id:'s3',item:'Gloves (box)',qty:23,min:15,unit:'boxes',cost:18,supplier:'Gulf Hygiene'},
  {id:'s4',item:'Bin bags 90L',qty:4,min:10,unit:'rolls',cost:14,supplier:'Gulf Hygiene'},
  {id:'s5',item:'Laundry detergent 3L',qty:3,min:8,unit:'bottles',cost:32,supplier:'Gulf Hygiene'},
  {id:'s6',item:'Glass cleaner',qty:9,min:5,unit:'bottles',cost:13,supplier:'Al Noor Supplies'}],
 moves:[],orders:[],
 invoices:[
  {id:'INV-2026-0341',customer:'Marina Heights Tower',trn:'100294817300003',jobs:9,rate:165,payments:[{amt:1559,method:'Bank transfer',at:mins(3100)}],due:mins(2000)},
  {id:'INV-2026-0342',customer:'Frond K Holiday Homes',trn:'100558201900003',jobs:12,rate:527,payments:[],due:mins(-5760)},
  {id:'INV-2026-0343',customer:'Bay Square Living',trn:'100731044200003',jobs:3,rate:520,payments:[{amt:700,method:'Cash',at:mins(1500)}],due:mins(-14400)},
  {id:'INV-2026-0344',customer:'Gulf Property Co',trn:'100118762500003',jobs:6,rate:150,payments:[],due:mins(4300)}],
 feed:[{at:mins(9),k:'taskpost',v:{t:'Wait for a delivery',p:'Palm Villa Frond K-12'}},
  {at:mins(22),k:'problem',v:{a:'Ahmed',t:'Broken equipment',p:'Marina Gate 2 — 1204'}},
  {at:mins(52),k:'booking',v:{c:'Marina Heights',x:'Premium',p:'Marina Gate 2 — 0708'}},
  {at:mins(188),k:'taskdone',v:{t:'Collect parcel',p:'The Address Blvd — 3401',m:'AED 30'}},
  {at:mins(197),k:'done',v:{a:'Fatima',p:'Cluster N — 3706',d:'2h 1m'}}],
 read:0,seqIssue:1185,seqJob:4476,seqReq:32,seqTask:883};
}
function save(){
 if(!online){queued++;queueOp('save',null);try{localStorage.setItem(dataKey(),JSON.stringify(db))}catch(e){}return}
 try{localStorage.setItem(dataKey(),JSON.stringify(db))}
 catch(e){toast(u('st_full'))}
 try{localStorage.setItem(photoKey(),JSON.stringify(photos))}
 catch(e){toast(u('st_photofull'))}
 if(cloud.on)cloudPush(true);
}
function load(){
 try{
  var d=localStorage.getItem(dataKey());if(d)db=JSON.parse(d);
  var p=localStorage.getItem(photoKey());if(p)photos=safeParse(p,{});
 }catch(e){}
 return Promise.resolve();
}
function flush(){if(!queued)return;var n=queued;queued=0;save();toast(n+' change'+(n===1?'':'s')+' synced.')}
function crew(){return (db&&db.cleaners&&db.cleaners.length)?db.cleaners:(db&&db.cleaners?db.cleaners:CLEANERS_DEFAULT)}
function jobsDoneBy(c){
 var real=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&j.status==='done'}).length;
 return (c.done||0)+real;
}
function onTimeOf(c){
 var mine=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&j.status==='done'&&j.started});
 if(!mine.length)return (c.onTime!=null)?c.onTime:null;
 var ok=mine.filter(function(j){return j.started<=todayAt(j.time)+15*MIN}).length;
 return Math.round(ok/mine.length*100);
}
function ratingOf(c){
 var extra=(db.ratings&&db.ratings[c.id])||[];
 if(!extra.length)return c.rating||0;
 var sum=(c.rating||0)*(c.done||0)+extra.reduce(function(a,b){return a+b},0);
 return sum/((c.done||0)+extra.length);
}
function emptyDb(name,cc){return {company:name||'My company',setup:false,ratings:{},settings:settingsFor(cc||'AE'),cleaners:[],customers:[],
 props:[],jobs:[],tasks:[],contracts:[],requests:[],issues:[],
 stock:[],invoices:[],feed:[],read:0,seqIssue:1,seqJob:1001,seqReq:1,seqTask:1}}
function t(k){var d=T[lang]||T.en;return d[k]||T.en[k]||k}
function cleaner(id){for(var i=0;i<crew().length;i++)if(crew()[i].id===id)return crew()[i];return{name:'Unassigned',initials:'—',rate:0,lang:'en',phone:'',senior:false}}
function job(id){for(var i=0;i<db.jobs.length;i++)if(db.jobs[i].id===id)return db.jobs[i];return null}
function task(id){for(var i=0;i<db.tasks.length;i++)if(db.tasks[i].id===id)return db.tasks[i];return null}
function svc(name){var m=SVC_L[uiLang];return (m&&m[name])||name}
function ttName(x){if(!x)return '';if(uiLang==='fr'&&TT_FR[x.id])return TT_FR[x.id];return x.name}
function taskType(id){for(var i=0;i<TASK_TYPES.length;i++)if(TASK_TYPES[i].id===id)return TASK_TYPES[i];return{name:id,fee:0,mins:0}}
function property(n){for(var i=0;i<db.props.length;i++)if(db.props[i].name===n)return db.props[i];return null}
function jarg(x){return esc(String(x==null?'':x).replace(/\\/g,'\\\\').replace(/'/g,"\\'"))}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function aed(n){return money(n)}
function hhmm(ts){if(!ts)return '—';var d=new Date(ts);return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function dur(a,b){if(!a)return '—';var m=Math.floor(((b||Date.now())-a)/MIN);return m<60?m+'m':Math.floor(m/60)+'h '+(m%60)+'m'}
function hrs(a,b){return(!a||!b)?0:(b-a)/3600000}
function todayAt(hm){var p=hm.split(':'),d=new Date();d.setHours(+p[0],+p[1],0,0);return d.getTime()}
function lateBy(j){if(j.status!=='sched'||!isToday(j))return 0;var m=Math.floor((Date.now()-todayAt(j.time))/MIN);return m>10?m:0}
function metres(a,b,c,d2){var R=6371000,x=(c-a)*Math.PI/180,y=(d2-b)*Math.PI/180;
 var s=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)*Math.sin(y/2);
 return Math.round(R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)))}
function travel(a,b){var A=property(a),B=property(b);if(!A||!B)return null;
 return Math.max(5,Math.round(metres(A.lat,A.lng,B.lat,B.lng)/1000*2.2+6))}
function checklistFor(j){
 var own=propChecklist(j.prop);
 var base=own||checkFor(tradeOf(j));
 return base.concat(TIERS[j.tier||'standard'].extras);
}
function openIssues(){return db.issues.filter(function(i){return i.open})}
function lowStock(){return db.stock.filter(function(s){return s.qty<s.min})}
function pending(){return db.requests.filter(function(r){return r.status==='pending'})}
function unread(){return db.feed.filter(function(f){return f.at>db.read}).length}
function live(){return db.jobs.filter(function(j){return j.status!=='cancelled'&&isToday(j)})}
function lateJobs(){return db.jobs.filter(function(j){return lateBy(j)>0})}
function openTasks(){return db.tasks.filter(function(x){return x.status==='open'})}
function invTotal(v){return invNet(v)*(1+taxRate())}
function invPaid(v){return v.payments.reduce(function(a,p){return a+p.amt},0)}
function invDue(v){return invTotal(v)-invPaid(v)-invCredits(v)}
function photoOf(id){return photos[id]||null}
function jobPhotos(j){return (j.photos||[]).map(function(p){return{id:p.id,kind:p.kind,at:p.at,src:photoOf(p.id)}})}
function notify(k,v){
 db.feed.unshift({at:Date.now(),k:k,v:v||{}});if(db.feed.length>40)db.feed.length=40;
 if(PUSH_TO_OFFICE.indexOf(k)>-1&&syncRole()!=='manager')sendPush(k,feedText({k:k,v:v||{}}));
}
function feedText(f){
 if(f.text)return f.text;                       /* older entries */
 var s2=u('e_'+f.k),v=f.v||{};
 return s2.replace(/\{(\w+)\}/g,function(m,key){return v[key]!==undefined?v[key]:''});
}
function wa(p,x){return 'https://wa.me/'+p+'?text='+encodeURIComponent(x)}
function tierPill(j){var ti=j.tier||'standard';return ti==='premium'?'<span class="pill prem">Premium</span>':'<span class="pill">Standard</span>'}
function guaranteeLeft(j){var g=TIERS[j.tier||'standard'].guarantee;if(!g||!j.finished)return 0;
 var left=Math.round((j.finished+g*3600000-Date.now())/3600000);return left>0?left:0}
function pins(){db.pins=db.pins||{};return db.pins}
function hasPin(id){return !!pins()[id]}
function askPin(role,id){
 if(!hasPin(id||role)){signIn(role,id);return}
 pinFor={role:role,id:id};pinBuf='';render();
}
function pinKey(d){
 if(d==='del'){pinBuf=pinBuf.slice(0,-1);render();return}
 if(d==='x'){pinFor=null;pinBuf='';render();return}
 pinBuf+=d;
 if(pinBuf.length>=4){
  var want=pins()[pinFor.id||pinFor.role];
  if(pinBuf===want){var p=pinFor;pinFor=null;pinBuf='';signIn(p.role,p.id)}
  else{pinBuf='';toast(u('a_wrongpin'))}
 }
 render();
}
function setPin(id){
 var v=prompt(u('a_setpin'));
 if(v===null)return;
 v=String(v).replace(/[^0-9]/g,'');
 if(v&&v.length!==4){toast(u('a_pin4'));return}
 if(v)pins()[id]=v; else delete pins()[id];
 save();render();toast(v?u('a_pinset'):u('a_pincleared'));
}

/* --- match an account to a person in this workspace --- */
function digits(x){return String(x||'').replace(/[^0-9]/g,'')}
/* the office may hide the team list on a shared or public device */
function ownerDevice(){
 try{return localStorage.getItem('cleanos:owner')==='1'}catch(e){return false}
}
function showTeamOnDevice(){
 /* A device that created the company, and is not signed in through someone
    else's link, belongs to the office. Listing the team there is not a leak,
    it is the only way in. Everywhere else: nobody is listed. */
 try{
  var forced=localStorage.getItem('cleanos:showteam');
  if(forced==='1')return true;
  if(forced==='0')return false;
  return ownerDevice()&&!memberToken;
 }catch(e){return false}
}
function thisIsMyDevice(){
 try{localStorage.setItem('cleanos:showteam','1')}catch(e){}
 render();toast(u('mt_listshown'));
}
function toggleTeamList(){
 var on=showTeamOnDevice();
 if(!on&&!confirm(u('mt_warnlist')))return;
 try{localStorage.setItem('cleanos:showteam',on?'0':'1')}catch(e){}
 render();toast(showTeamOnDevice()?u('mt_listshown'):u('mt_listhidden'));
}
function openCodeEntry(){codeEntry=true;render()}
function closeCodeEntry(){codeEntry=false;render()}
function enterCompany(){
 var w=((document.getElementById('cd-ws')||{}).value||'').trim();
 var t=((document.getElementById('cd-token')||{}).value||'').trim();
 if(!w||!t){toast(u('mt_needboth'));return}
 cloud.ws=w;saveToken(t);setCurrentWs(w);cloudSaveCfg();
 codeEntry=false;
 signInWithToken();
}
function openEmail(mode){emailMode=mode||'in';emailErr='';render()}
function closeEmail(){emailMode=null;emailErr='';render()}
function emailFields(){
 return {
  email:((document.getElementById('em-addr')||{}).value||'').trim().toLowerCase(),
  pass:((document.getElementById('em-pass')||{}).value||'')
 };
}
function toggleMoreWays(){moreWays=!moreWays;render()}
function signIn(r,id){session={role:r,id:id};thread=null;draft='';
 if(r==='cleaner'){lang=cleaner(id).lang;tab='myday'}else if(r==='customer'){lang='en';tab='portal'}else{lang='en';tab='today'}render()}
function signOut(){session=null;open=null;thread=null;draft='';render()}
function issueLabel(type){
 if(type==='cancelreq')return u('it_cancelreq');
 if(type==='quality')return u('ins_failed');
 if(type==='customer')return u('q_disputed');
 var d=T[uiLang]||T.en;
 return d[type]||T.en[type]||type;
}
function issueBy(is){
 var cu=customers().filter(function(c){return c.id===is.by})[0];
 if(cu)return cu.name;
 var cl=crew().filter(function(c){return c.id===is.by})[0];
 return cl?cl.name:'—';
}


/* ============================================================
   Dates. Until now everything was "today". A manager plans
   Thursday on Monday.
   ============================================================ */
function ymd(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function todayStr(){return ymd(new Date())}
function addDays(str,n){var p=str.split('-');var d=new Date(+p[0],+p[1]-1,+p[2]);d.setDate(d.getDate()+n);return ymd(d)}
function jobDate(j){return j.date||todayStr()}
function isToday(j){return jobDate(j)===todayStr()}
function dayName(str){
 var p=str.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);
 var names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 if(str===todayStr())return u('cal_today');
 if(str===addDays(todayStr(),1))return u('cal_tomorrow');
 if(str===addDays(todayStr(),-1))return u('cal_yesterday');
 return names[d.getDay()]+' '+(+p[2])+'/'+(+p[1]);
}
function jobsOn(str){return db.jobs.filter(function(j){return jobDate(j)===str})}
function calFor(){return calDay||todayStr()}
function setCalDay(d){calDay=d;render()}
function calShift(n){calDay=addDays(calFor(),n);render()}
function calToday(){calDay=null;render()}
function newJobOn(d){newJob();jobForm.date=d;render()}
function generateOn(dstr){
 var p=dstr.split('-'),dow=new Date(+p[0],+p[1]-1,+p[2]).getDay(),made=0;
 db.contracts.forEach(function(r){
  if(r.days.indexOf(dow)===-1)return;
  if(jobsOn(dstr).some(function(j){return j.contract===r.id||(j.prop===r.prop&&j.time===r.time)}))return;
  db.jobs.push({id:db.seqJob++,prop:r.prop,customer:r.customer,service:r.service,tier:r.tier||'standard',
   cleaner:r.cleaner,time:r.time,date:dstr,contract:r.id,price:r.price,status:'sched',started:null,finished:null,
   checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null});made++;
 });
 save();render();
 toast(made?made+' '+u('cal_created')+' '+dayName(dstr):u('cal_nothingnew'));
}


/* ============================================================
   Availability and teams. Two things owners say break the
   business: double-booking a cleaner, and jobs that need
   more than one person.
   ============================================================ */
function estMins(service,tier,trade){
 var table=(TRADES[trade||trades()[0]]||TRADES.cleaning).mins;
 var base=table[service]||120;
 if(tier==='premium')base=Math.round(base*1.25);
 return base;
}
function jobStart(j){var p=jobDate(j).split('-'),t=(j.time||'09:00').split(':');
 return new Date(+p[0],+p[1]-1,+p[2],+t[0],+t[1]).getTime()}
function jobEnd(j){return jobStart(j)+estMins(j.service,j.tier,tradeOf(j))*MIN}
function teamOf(j){return [j.cleaner].concat(j.team||[]).filter(Boolean)}
function offDays(c){return c.off||[]}
function isOff(cid,dstr){var c=cleaner(cid);return offDays(c).indexOf(dstr)>-1}
function toggleOff(cid,dstr){
 var c=null;db.cleaners.forEach(function(x){if(x.id===cid)c=x});
 if(!c)return;
 c.off=c.off||[];
 var i=c.off.indexOf(dstr);
 if(i>-1)c.off.splice(i,1);else c.off.push(dstr);
 save();render();toast(i>-1?u('av_backon'):u('av_markedoff'));
}
/* who is already busy at that moment */
function clashes(cid,dstr,time,service,tier,ignoreId){
 var p=dstr.split('-'),t=(time||'09:00').split(':');
 var start=new Date(+p[0],+p[1]-1,+p[2],+t[0],+t[1]).getTime();
 var end=start+estMins(service,tier)*MIN;
 return db.jobs.filter(function(j){
  if(j.id===ignoreId||j.status==='cancelled')return false;
  if(teamOf(j).indexOf(cid)===-1)return false;
  if(jobDate(j)!==dstr)return false;
  return jobStart(j)<end&&jobEnd(j)>start;
 });
}
function availabilityNote(cid,dstr,time,service,tier,ignoreId){
 if(isOff(cid,dstr))return {bad:true,text:u('av_off')};
 var cl=clashes(cid,dstr,time,service,tier,ignoreId);
 if(cl.length)return {bad:true,text:u('av_busy')+' '+cl[0].time+' '+esc(cl[0].prop)};
 return {bad:false,text:u('av_free')};
}
function toggleTeam(id){
 if(!jobForm)return;
 jobForm.team=jobForm.team||[];
 var i=jobForm.team.indexOf(id);
 if(i>-1)jobForm.team.splice(i,1);else jobForm.team.push(id);
 render();
}
function teamPicker(){
 if(!jobForm)return '';
 var d=jobForm.date||todayStr();
 var h='<div class="field"><label>'+u('av_team')+'</label><div style="display:flex;gap:5px;flex-wrap:wrap">';
 crew().forEach(function(c){
  if(c.id===jobForm.cleaner)return;
  var on=(jobForm.team||[]).indexOf(c.id)>-1;
  var av=availabilityNote(c.id,d,jobForm.time,jobForm.serv,tierPick);
  h+='<button class="btn '+(on?'':'ghost')+'" style="font-size:11px'+(av.bad?';opacity:.55':'')+'" '+
   'onclick="toggleTeam(\''+c.id+'\')" title="'+esc(av.text)+'">'+esc(c.name.split(' ')[0])+
   (av.bad?' ⚠':'')+'</button>';
 });
 h+='</div>';
 var n=1+((jobForm.team||[]).length);
 if(n>1)h+='<p style="font-size:11px;color:var(--teal);margin:6px 0 0">'+n+' '+u('av_people')+' · '+
  Math.round(estMins(jobForm.serv,tierPick)/n)+u('av_eachmin')+'</p>';
 return h+'</div>';
}


/* ============================================================
   Inventory, properly. What each job actually consumes, who
   took what, what it costs, and purchase orders.
   ============================================================ */
function stock(){db.stock=db.stock||[];db.stock.forEach(function(x,i){if(!x.id)x.id='s'+i});return db.stock}
function stockById(id){var f=stock().filter(function(x){return x.id===id})[0];return f||null}
function moves(){db.moves=db.moves||[];return db.moves}
function orders(){db.orders=db.orders||[];return db.orders}
function matchItem(name){
 var n=name.toLowerCase();
 var hit=stock().filter(function(x){return x.item.toLowerCase().indexOf(n)===0||n.indexOf(x.item.toLowerCase().split(' ')[0])===0})[0];
 return hit||null;
}
function moveStock(itemId,delta,reason,jobId){
 var it=stockById(itemId);if(!it)return;
 it.qty=Math.round((it.qty+delta)*100)/100;
 if(it.qty<0)it.qty=0;
 moves().unshift({id:'mv'+Date.now()+Math.floor(Math.random()*99),at:Date.now(),item:itemId,
  delta:delta,reason:reason||'',by:session?(session.id||'office'):'office',job:jobId||null});
 if(moves().length>300)db.moves=moves().slice(0,300);
}
function consumeFor(j){
 var list=USAGE[j.service]||USAGE['Standard'],used=[],cost=0;
 list.forEach(function(pair){
  var it=matchItem(pair[0]);
  if(!it)return;
  var q=pair[1]*(1+((j.team||[]).length?0.35:0));
  moveStock(it.id,-q,'job',j.id);
  used.push({item:it.item,qty:q});
  cost+=q*(it.cost||0);
 });
 j.supplyCost=Math.round(cost*100)/100;
 return used;
}
function jobSupplyCost(j){return j.supplyCost||0}
function stockValue(){return stock().reduce(function(a,x){return a+x.qty*(x.cost||0)},0)}
function daysLeft(it){
 var used=moves().filter(function(m){return m.item===it.id&&m.delta<0&&m.at>Date.now()-14*86400000});
 if(!used.length)return null;
 var total=used.reduce(function(a,m){return a-m.delta},0);
 var perDay=total/14;
 return perDay>0?Math.round(it.qty/perDay):null;
}
function suggestQty(it){
 var d=daysLeft(it);
 var target=it.min*2;
 if(d!==null&&d<14)target=Math.max(target,it.min*3);
 return Math.max(1,Math.ceil(target-it.qty));
}

/* purchase orders */
function newOrder(){open={type:'order'};render()}
function saveOrder(){
 var lines=[];
 stock().forEach(function(it){
  var el=document.getElementById('po-'+it.id);
  var q=el?parseFloat(el.value||'0'):0;
  if(q>0)lines.push({item:it.id,qty:q,cost:(it.cost||0)*q});
 });
 if(!lines.length){toast(u('inv_nolines'));return}
 orders().unshift({id:'PO-'+(orders().length+1001),supplier:document.getElementById('po-sup').value.trim()||'—',
  lines:lines,status:'open',at:Date.now(),received:null});
 open=null;save();render();toast(u('inv_ordered'));
}
function receiveOrder(id){
 if(!managerOnly())return;
 var o=orders().filter(function(x){return x.id===id})[0];if(!o||o.status==='received')return;
 o.lines.forEach(function(l){moveStock(l.item,l.qty,'delivery '+o.id,null)});
 o.status='received';o.received=Date.now();
 notify('delivery',{o:o.id});
 save();render();toast(u('inv_received'));
}
function orderTotal(o){return o.lines.reduce(function(a,l){return a+(l.cost||0)},0)}

/* cleaners reporting from the field */
function reportUsed(){open={type:'used'};render()}
function saveUsed(){
 var any=false;
 stock().forEach(function(it){
  var el=document.getElementById('us-'+it.id);
  var q=el?parseFloat(el.value||'0'):0;
  if(q>0){moveStock(it.id,-q,'reported by cleaner',null);any=true}
 });
 if(!any){toast(u('inv_nothingused'));return}
 open=null;save();render();toast(u('inv_thanks'));
}
function requestItem(id){
 var it=stockById(id);if(!it)return;
 notify('supplyreq',{i:it.item,a:cleaner(session.id).name.split(' ')[0]});
 db.issues.unshift({id:db.seqIssue++,job:null,prop:'—',by:session.id,type:'nosupplies',
  note:u('inv_needs')+' '+it.item,at:Date.now(),priority:'Medium',open:true,photo:null});
 save();render();toast(u('inv_requested'));
}


/* ============================================================
   Money, properly: invoices built from the jobs that were
   actually done, expenses, and profit per customer.
   ============================================================ */
function expenses(){db.expenses=db.expenses||[];return db.expenses}
function invoiceJobs(v){return (v.jobIds||[]).map(function(id){return job(id)}).filter(Boolean)}
function invNet(v){
 if(v.jobIds&&v.jobIds.length)return invoiceJobs(v).reduce(function(a,j){return a+j.price},0)+(v.extra||0);
 return v.jobs*v.rate;
}
function unbilled(name){
 return db.jobs.filter(function(j){
  return j.customer===name&&(j.status==='done'||(j.status==='cancelled'&&j.cancel&&j.cancel.fee))&&!j.invoiced;
 });
}
function unbilledValue(name){
 return unbilled(name).reduce(function(a,j){return a+(j.status==='cancelled'?j.cancel.fee:j.price)},0);
}
function buildInvoice(name){
 if(!managerOnly())return;
 var list=unbilled(name);
 if(!list.length){toast(u('bill_nothing'));return}
 var cu=customerByName(name);
 var v={id:'INV-'+new Date().getFullYear()+'-'+(1000+db.invoices.length+1),customer:name,
  trn:(cu&&cu.trn)||'—',jobIds:list.map(function(j){return j.id}),
  jobs:list.length,rate:0,payments:[],credits:[],
  due:Date.now()+30*86400000,issued:Date.now()};
 list.forEach(function(j){j.invoiced=v.id});
 db.invoices.unshift(v);
 notify('invoiced',{c:name,m:aed(invNet(v)*(1+taxRate()))});
 save();render();toast(u('bill_made')+' '+v.id);
}
function addExpense(){open={type:'expense'};render()}
function saveExpense(){
 var amt=parseFloat(document.getElementById('ex-amt').value||'0');
 if(!(amt>0)){toast(u('ex_amount'));return}
 expenses().unshift({id:'ex'+Date.now(),at:Date.now(),date:todayStr(),
  kind:document.getElementById('ex-kind').value,
  amount:amt,note:document.getElementById('ex-note').value.trim(),
  by:document.getElementById('ex-by').value||null,
  job:null});
 open=null;save();render();toast(u('ex_added'));
}
function expenseTotal(){return expenses().reduce(function(a,x){return a+x.amount},0)}

/* what a job actually costs to deliver */
function labourCost(j){
 if(!j.started||!j.finished)return 0;
 var h=hrs(j.started,j.finished);
 return Math.round(teamOf(j).reduce(function(a,cid){return a+h*(cleaner(cid).rate||0)},0)*100)/100;
}
function jobProfit(j){return Math.round((j.price-labourCost(j)-jobSupplyCost(j))*100)/100}
function customerProfit(name){
 var js=db.jobs.filter(function(j){return j.customer===name&&j.status==='done'});
 var rev=js.reduce(function(a,j){return a+j.price},0);
 var lab=js.reduce(function(a,j){return a+labourCost(j)},0);
 var sup=js.reduce(function(a,j){return a+jobSupplyCost(j)},0);
 return {jobs:js.length,rev:rev,lab:lab,sup:sup,profit:rev-lab-sup,
  margin:rev?Math.round((rev-lab-sup)/rev*100):0};
}


/* ============================================================
   Per-property checklists, keys, equipment, and the working day.
   ============================================================ */
/* --- checklists that differ per property --- */
function propChecklist(name){
 var p=property(name);
 return (p&&p.list&&p.list.length)?p.list:null;
}
function editList(i){open={type:'list',idx:i};render()}
function toggleListItem(k){
 var p=db.props[open.idx];if(!p)return;
 p.list=p.list||CHECK_KEYS.slice();
 var i=p.list.indexOf(k);
 if(i>-1)p.list.splice(i,1);else p.list.push(k);
 save();render();
}
function addListItem(){
 var p=db.props[open.idx];if(!p)return;
 var v=(document.getElementById('li-new')||{}).value;
 v=(v||'').trim();
 if(!v)return;
 p.list=p.list||CHECK_KEYS.slice();
 p.extraItems=p.extraItems||{};
 var key='x'+Date.now();
 p.extraItems[key]=v;p.list.push(key);
 save();render();toast(u('cl_added'));
}
function removeListItem(k){
 var p=db.props[open.idx];if(!p)return;
 p.list=(p.list||CHECK_KEYS.slice()).filter(function(x){return x!==k});
 if(p.extraItems)delete p.extraItems[k];
 save();render();
}
function resetList(){
 var p=db.props[open.idx];if(!p)return;
 delete p.list;delete p.extraItems;save();render();toast(u('cl_reset'));
}
function itemLabel(k,propName){
 var p=property(propName||'');
 if(p&&p.extraItems&&p.extraItems[k])return p.extraItems[k];
 var v=t(k);
 if(v&&v!==k&&v!=='undefined')return v;
 /* unknown key: show it readably rather than as 'undefined' */
 var en=(T.en&&T.en[k])||'';
 if(en)return en;
 return String(k||'').replace(/_/g,' ').replace(/^./,function(c){return c.toUpperCase()});
}

/* --- who holds which key --- */
function keys(){db.keys=db.keys||[];return db.keys}
function keyFor(prop){return keys().filter(function(k){return k.prop===prop})}
function addKey(){open={type:'key'};render()}
function saveKey(){
 var prop=(document.getElementById('k-prop')||{}).value;
 if(!prop){toast(u('ky_needprop'));return}
 keys().unshift({id:'k'+Date.now(),prop:prop,label:(document.getElementById('k-label')||{}).value.trim()||u('ky_akey'),
  holder:(document.getElementById('k-holder')||{}).value||'office',since:Date.now(),log:[]});
 open=null;save();render();toast(u('ky_added'));
}
function handKey(id){open={type:'handkey',key:id};render()}
function moveKey(id,to){
 var k=keys().filter(function(x){return x.id===id})[0];if(!k)return;
 k.log=k.log||[];
 k.log.unshift({from:k.holder,to:to,at:Date.now(),by:session?session.id:'office'});
 if(k.log.length>20)k.log.length=20;
 k.holder=to;k.since=Date.now();
 notify('key',{p:k.prop,a:to==='office'?u('ky_office'):cleaner(to).name.split(' ')[0]});
 open=null;save();render();toast(u('ky_moved'));
}
function removeKey(id){
 snapshot(u('ky_title'));db.keys=keys().filter(function(k){return k.id!==id});save();render();toast(u('st_removed'))}
function holderName(h){return h==='office'?u('ky_office'):(h==='lost'?u('ky_lost'):cleaner(h).name)}

/* --- equipment, as distinct from consumables --- */
function gear(){db.gear=db.gear||[];return db.gear}
function addGear(){open={type:'gear'};render()}
function saveGear(){
 var n=(document.getElementById('g-name')||{}).value.trim();
 if(!n){toast(u('gr_needname'));return}
 gear().unshift({id:'g'+Date.now(),name:n,serial:(document.getElementById('g-serial')||{}).value.trim(),
  holder:(document.getElementById('g-holder')||{}).value||'office',
  bought:(document.getElementById('g-bought')||{}).value||todayStr(),
  service:(document.getElementById('g-service')||{}).value||'',status:'ok'});
 open=null;save();render();toast(u('gr_added'));
}
function moveGear(id,to){
 gear().forEach(function(g){if(g.id===id)g.holder=to});
 save();render();toast(u('gr_moved'));
}
function gearStatus(id,st){
 gear().forEach(function(g){if(g.id===id)g.status=st});
 if(st==='broken')notify('gearbroken',{i:gear().filter(function(g){return g.id===id})[0].name});
 save();render();toast(u('gr_updated'));
}
function serviceDue(g){
 if(!g.service)return false;
 return g.service<=addDays(todayStr(),14);
}

/* --- the working day, separate from job times --- */
function shifts(){db.shifts=db.shifts||[];
 if(db.shifts.length>400){var cut=addDays(todayStr(),-180);
  db.shifts=db.shifts.filter(function(x){return x.date>=cut})}
 return db.shifts}
function myShift(){
 var me=session?session.id:null,d=todayStr();
 return shifts().filter(function(s2){return s2.by===me&&s2.date===d&&!s2.out})[0]||null;
}
function clockIn(){
 if(myShift()){toast(u('sh_already'));return}
 var d=T[lang]||T.en;
 if(!navigator.geolocation){toast(d.nogps);return}
 toast(d.gettingpos);
 navigator.geolocation.getCurrentPosition(function(pos){
  shifts().unshift({id:'sh'+Date.now(),by:session.id,date:todayStr(),in:Date.now(),out:null,
   inAt:{lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy||0)},
   outAt:null});
  notify('clockin',{a:cleaner(session.id).name.split(' ')[0]});
  save();pushNow();render();toast(u('sh_in'));
 },function(err){
  /* no location, no clock-in — the record has to mean something */
  toast(d.needgps);
 },{enableHighAccuracy:true,timeout:15000,maximumAge:0});
}
function clockOut(){
 var s2=myShift();if(!s2){toast(u('sh_notin'));return}
 var d=T[lang]||T.en;
 var finish=function(pos){
  s2.out=Date.now();
  if(pos)s2.outAt={lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy||0)};
  notify('clockout',{a:cleaner(session.id).name.split(' ')[0],d:dur(s2.in,s2.out)});
  save();pushNow();render();toast(u('sh_out')+' '+dur(s2.in,s2.out));
 };
 if(!navigator.geolocation){finish(null);return}
 toast(d.gettingpos);
 navigator.geolocation.getCurrentPosition(finish,function(){finish(null)},
  {enableHighAccuracy:true,timeout:15000,maximumAge:0});
}
function shiftHours(cid,from){
 return shifts().filter(function(s2){return s2.by===cid&&s2.out&&(!from||s2.date>=from)})
  .reduce(function(a,s2){return a+hrs(s2.in,s2.out)},0);
}


/* ============================================================
   Before the job exists: enquiries, quotes, reminders, reviews,
   and a booking link anyone can open.
   ============================================================ */
function leads(){db.leads=db.leads||[];
 /* keep every open enquiry; drop closed ones once there are a lot */
 if(db.leads.length>400){
  var openOnes=db.leads.filter(function(l){return l.status!=='lost'&&l.status!=='won'});
  db.leads=openOnes.concat(db.leads.filter(function(l){return l.status==='lost'||l.status==='won'}).slice(0,100));
 }
 return db.leads}
function quotes(){db.quotes=db.quotes||[];return db.quotes}
function reminders(){db.reminders=db.reminders||[];
 if(db.reminders.length>300)db.reminders=db.reminders.slice(0,200);
 return db.reminders}
function reviews(){db.reviews=db.reviews||[];
 if(db.reviews.length>300)db.reviews=db.reviews.slice(0,200);
 return db.reviews}

/* --- enquiries: someone phones asking a price --- */
function addLead(){open={type:'lead'};render()}
function saveLead(){
 var n=(document.getElementById('ld-name')||{}).value.trim();
 if(!n){toast(u('sl_needname'));return}
 leads().unshift({id:'L'+Date.now(),at:Date.now(),name:n,
  phone:((document.getElementById('ld-phone')||{}).value||'').replace(/[^0-9]/g,''),
  prop:((document.getElementById('ld-prop')||{}).value||'').trim(),
  source:(document.getElementById('ld-source')||{}).value||'Phone',
  note:((document.getElementById('ld-note')||{}).value||'').trim(),
  status:'new'});
 open=null;save();render();toast(u('sl_added'));
}
function leadStatus(id,st){leads().forEach(function(l){if(l.id===id)l.status=st});save();render()}
function dropLead(id){
 snapshot(u('sl_title'));db.leads=leads().filter(function(l){return l.id!==id});save();render();toast(u('st_removed'))}
function qSet(k,v){quoteRooms[k]=v;render()}
function quotePrice(){
 var base=90+quoteRooms.beds*35+quoteRooms.baths*30;
 var sq=parseFloat(quoteRooms.size||'0');
 if(sq>0)base=Math.max(base,Math.round(sq*0.9));
 var mult={'Standard':1,'Deep clean':1.75,'Move-out':2.2,'Turnover':1.25}[quoteRooms.service]||1;
 var t2=TIERS[quoteRooms.tier]?TIERS[quoteRooms.tier].mult:1;
 var freq={one:1,weekly:0.88,fortnightly:0.94}[quoteRooms.freq]||1;
 return Math.round(base*mult*t2*freq/5)*5;
}
function newQuote(lead){
 quoteRooms={beds:2,baths:1,size:'',service:'Standard',tier:'standard',freq:'one'};
 open={type:'quote',lead:lead||null};render();
}
function saveQuote(){
 var who=((document.getElementById('q-who')||{}).value||'').trim();
 var prop=((document.getElementById('q-prop')||{}).value||'').trim();
 if(!who||!prop){toast(u('qt_need'));return}
 quotes().unshift({id:'Q-'+(1000+quotes().length+1),at:Date.now(),who:who,phone:((document.getElementById('q-phone')||{}).value||'').replace(/[^0-9]/g,''),
  prop:prop,beds:quoteRooms.beds,baths:quoteRooms.baths,size:quoteRooms.size,
  service:quoteRooms.service,tier:quoteRooms.tier,freq:quoteRooms.freq,
  price:quotePrice(),status:'sent',lead:open.lead||null,
  valid:addDays(todayStr(),14)});
 if(open.lead)leadStatus(open.lead,'quoted');
 notify('quoted',{c:who,m:aed(quotePrice())});
 open=null;save();render();toast(u('qt_sent'));
}
function quoteText(q){
 return db.company+'\n'+u('qt_for')+' '+q.prop+'\n'+
  q.service+' — '+TIERS[q.tier].name+'\n'+
  q.beds+' '+u('qt_bed')+', '+q.baths+' '+u('qt_bath')+'\n'+
  aed(q.price)+(q.freq!=='one'?' '+u('qt_pervisit'):'')+'\n'+
  u('qt_validto')+' '+q.valid;
}
function acceptQuote(id){
 if(!managerOnly())return;
 var q=quotes().filter(function(x){return x.id===id})[0];if(!q)return;
 q.status='accepted';
 if(!customerByName(q.who))customers().push({id:'cu'+Date.now(),name:q.who,contact:'',phone:q.phone||'',email:''});
 if(!property(q.prop))db.props.push({name:q.prop,area:'',lat:null,lng:null,key:'',park:'',wifi:'—',alarm:'—',note:''});
 db.jobs.push({id:db.seqJob++,prop:q.prop,customer:q.who,service:q.service,tier:q.tier,
  cleaner:null,team:[],time:'09:00',date:addDays(todayStr(),1),price:q.price,status:'sched',
  started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null});
 if(q.freq!=='one'){
  db.contracts.push({id:'R-'+('0'+(db.contracts.length+1)).slice(-2),prop:q.prop,customer:q.who,
   service:q.service,tier:q.tier,cleaner:null,time:'09:00',price:q.price,
   freq:q.freq==='weekly'?'weekly':'fortnightly',days:[new Date().getDay()]});
 }
 notify('quoteaccepted',{c:q.who,m:aed(q.price)});
 save();render();toast(u('qt_accepted'));
}
function rejectQuote(id){quotes().forEach(function(q){if(q.id===id)q.status='lost'});save();render()}

/* --- reminders the day before --- */
function dueReminders(){
 var tom=addDays(todayStr(),1);
 return db.jobs.filter(function(j){
  return jobDate(j)===tom&&j.status==='sched'&&!reminders().some(function(r){return r.job===j.id});
 });
}
function reminderText(j){
 var p=property(j.prop),c=j.cleaner?cleaner(j.cleaner):null;
 return db.company+'\n'+u('rm_hello')+'\n'+j.prop+'\n'+u('rm_tomorrow')+' '+j.time+
  (c?'\n'+u('rm_cleaner')+' '+c.name:'')+
  (p&&p.key?'\n'+u('rm_access')+' '+p.key:'')+'\n\n'+u('rm_reply');
}
function markReminded(id){
 reminders().unshift({job:id,at:Date.now()});
 save();render();toast(u('rm_sent'));
}
function remindAll(){
 var list=dueReminders();
 if(!list.length){toast(u('rm_none'));return}
 list.forEach(function(j){reminders().unshift({job:j.id,at:Date.now()})});
 save();render();toast(list.length+' '+u('rm_marked'));
}

/* --- asking for a review --- */
function reviewText(j){
 return db.company+'\n'+u('rv_thanks')+' '+j.prop+'.\n'+u('rv_ask');
}
function askReview(id){
 var j=job(id);if(!j)return;
 reviews().unshift({job:id,at:Date.now(),customer:j.customer});
 save();render();toast(u('rv_sent'));
}
function reviewDue(){
 return db.jobs.filter(function(j){
  return j.status==='done'&&j.signed&&j.rating>=4&&!reviews().some(function(r){return r.job===j.id});
 });
}

/* --- a link anyone can open to request a clean --- */
function bookingLink(){
 return location.origin+location.pathname+'#book='+encodeURIComponent(btoa(JSON.stringify({
  u:cloud.url,k:cloud.key,w:cloud.ws,s:cloud.secret})));
}
function readBookingLink(){
 var m=(location.hash||'').match(/book=([^&]+)/);
 if(!m)return false;
 try{
  var o=JSON.parse(atob(decodeURIComponent(m[1])));
  cloud.url=o.u;cloud.key=o.k;cloud.ws=o.w;cloud.secret=o.s;cloud.on=true;cloud.status='on';
  cloudSaveCfg();
  if(history.replaceState)history.replaceState(null,'',location.pathname);
  publicBooking=true;
  return true;
 }catch(e){return false}
}
function sendPublicBooking(){
 var n=((document.getElementById('pb-name')||{}).value||'').trim();
 var p=((document.getElementById('pb-prop')||{}).value||'').trim();
 if(!n||!p){toast(u('pb_need'));return}
 leads().unshift({id:'L'+Date.now(),at:Date.now(),name:n,
  phone:((document.getElementById('pb-phone')||{}).value||'').replace(/[^0-9]/g,''),
  prop:p,source:'Website',
  note:((document.getElementById('pb-when')||{}).value||'')+' · '+
       ((document.getElementById('pb-serv')||{}).value||'')+' · '+
       ((document.getElementById('pb-note')||{}).value||''),
  status:'new'});
 notify('lead',{c:n});
 save();
 publicBooking='done';render();
}
function copyBookingLink(){
 var l=bookingLink();
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(l);toast(u('a_copied'))}
  else{open={type:'link',link:l};render()}}catch(e){open={type:'link',link:l};render()}
}


/* only the office can do these, whatever screen you came from */
function managerOnly(){
 if(session&&(session.role==='manager'))return true;
 toast(u('sec_manager'));return false;
}


/* ============================================================
   People: leave, documents, payroll.
   Compliance: incidents, safety sheets, insurance.
   Money: period statements and recurring invoicing.
   ============================================================ */
function leave(){db.leave=db.leave||[];return db.leave}
function docs(){db.docs=db.docs||[];return db.docs}
function incidents(){db.incidents=db.incidents||[];return db.incidents}
function sheets(){db.sheets=db.sheets||[];return db.sheets}

/* --- leave balances --- */
function leaveEntitlement(c){return c.leaveDays||30}
function leaveTaken(cid,year){
 var y=year||String(new Date().getFullYear());
 return leave().filter(function(l){return l.by===cid&&l.from.indexOf(y)===0&&l.status!=='refused'})
  .reduce(function(a,l){return a+l.days},0);
}
function leaveLeft(c){return leaveEntitlement(c)-leaveTaken(c.id)}
function addLeave(cid){open={type:'leave',who:cid};render()}
function saveLeave(){
 var from=(document.getElementById('lv-from')||{}).value||todayStr();
 var days=parseInt((document.getElementById('lv-days')||{}).value||'1',10);
 if(!(days>0)){toast(u('lv_days'));return}
 var cid=open.who;
 leave().unshift({id:'lv'+Date.now(),by:cid,from:from,days:days,
  kind:(document.getElementById('lv-kind')||{}).value||'Annual',
  note:((document.getElementById('lv-note')||{}).value||'').trim(),status:'approved'});
 /* block those days out on the rota too */
 for(var i=0;i<days;i++)
  db.cleaners.forEach(function(c){if(c.id===cid){c.off=c.off||[];var d=addDays(from,i);
   if(c.off.indexOf(d)===-1)c.off.push(d)}});
 notify('leave',{a:cleaner(cid).name.split(' ')[0],d:days});
 open=null;save();render();toast(u('lv_added'));
}
function cancelLeave(id){
 var l=leave().filter(function(x){return x.id===id})[0];if(!l)return;
 db.cleaners.forEach(function(c){if(c.id===l.by&&c.off)
  for(var i=0;i<l.days;i++){var d=addDays(l.from,i),j=c.off.indexOf(d);if(j>-1)c.off.splice(j,1)}});
 db.leave=leave().filter(function(x){return x.id!==id});
 save();render();toast(u('lv_cancelled'));
}
function addDoc(cid){open={type:'doc',who:cid||null};render()}
function saveDoc(){
 var exp=(document.getElementById('dc-exp')||{}).value;
 if(!exp){toast(u('dc_needdate'));return}
 docs().unshift({id:'dc'+Date.now(),by:(document.getElementById('dc-who')||{}).value||'company',
  kind:(document.getElementById('dc-kind')||{}).value,
  ref:((document.getElementById('dc-ref')||{}).value||'').trim(),expires:exp,note:''});
 open=null;save();render();toast(u('dc_added'));
}
function removeDoc(id){
 snapshot(u('dc_title'));db.docs=docs().filter(function(d){return d.id!==id});save();render();toast(u('st_removed'))}
function docDaysLeft(d){
 var a=new Date(d.expires),b=new Date(todayStr());
 return Math.round((a-b)/86400000);
}
function expiringDocs(){return docs().filter(function(d){return docDaysLeft(d)<=60}).sort(function(a,b){return docDaysLeft(a)-docDaysLeft(b)})}

/* --- payroll --- */
function payrollRows(from,to){
 return crew().map(function(c){
  var jobs=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&j.finished&&
    jobDate(j)>=from&&jobDate(j)<=to});
  var jobHrs=jobs.reduce(function(a,j){return a+hrs(j.started,j.finished)},0);
  var clockHrs=shifts().filter(function(x){return x.by===c.id&&x.out&&x.date>=from&&x.date<=to})
   .reduce(function(a,x){return a+hrs(x.in,x.out)},0);
  var tasks=db.tasks.filter(function(x){return x.by===c.id&&x.status==='done'});
  var bonus=tasks.reduce(function(a,x){return a+x.fee*(x.worker_share||0.6)},0);
  var hours=Math.max(jobHrs,clockHrs);
  return {c:c,jobs:jobs.length,jobHrs:jobHrs,clockHrs:clockHrs,hours:hours,
   basic:Math.round(hours*(c.rate||0)*100)/100,bonus:Math.round(bonus*100)/100,
   total:Math.round((hours*(c.rate||0)+bonus)*100)/100};
 });
}
function payPeriod(){return {from:payFrom||addDays(todayStr(),-30),to:payTo||todayStr()}}
function setPayFrom(v){payFrom=v;render()}
function setPayTo(v){payTo=v;render()}
function exportPayroll(){
 var p=payPeriod(),rows=[['Cleaner','Phone','Jobs','Hours on jobs','Hours clocked','Hours paid','Rate','Basic','Task share','Total']];
 payrollRows(p.from,p.to).forEach(function(r){
  rows.push([r.c.name,r.c.phone,r.jobs,r.jobHrs.toFixed(2),r.clockHrs.toFixed(2),
   r.hours.toFixed(2),r.c.rate,r.basic,r.bonus,r.total]);
 });
 downloadCsv(rows,'payroll-'+p.from+'-to-'+p.to+'.csv');
}
function exportWPS(){
 /* the UAE wage protection layout, one row per employee */
 var p=payPeriod(),rows=[['Employee ID','Employee name','Bank/agent ID','IBAN','Pay start','Pay end','Days','Fixed pay','Variable pay','Total']];
 payrollRows(p.from,p.to).forEach(function(r){
  rows.push([r.c.id,r.c.name,'',r.c.iban||'',p.from,p.to,
   Math.max(1,Math.round(r.hours/8)),r.basic,r.bonus,r.total]);
 });
 downloadCsv(rows,'wps-'+p.from+'-to-'+p.to+'.csv');
 toast(u('py_wpsnote'));
}
function downloadCsv(rows,name){
 var csv=rows.map(function(r){return r.map(function(c){var x=String(c==null?'':c);
  return /[",]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x}).join(',')}).join('\n');
 try{var b=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(b),a2=document.createElement('a');
  a2.href=url;a2.download=name;document.body.appendChild(a2);a2.click();document.body.removeChild(a2);
  setTimeout(function(){URL.revokeObjectURL(url)},1200);toast(u('st_exported'))}
 catch(e){open={type:'csv',csv:csv};render()}
}
function addIncident(){open={type:'incident'};render()}
function saveIncident(){
 var what=((document.getElementById('in-what')||{}).value||'').trim();
 if(!what){toast(u('in_needwhat'));return}
 incidents().unshift({id:'IN-'+(1000+incidents().length+1),at:Date.now(),date:todayStr(),
  kind:(document.getElementById('in-kind')||{}).value,
  who:(document.getElementById('in-who')||{}).value||null,
  prop:((document.getElementById('in-prop')||{}).value||'').trim(),
  what:what,action:((document.getElementById('in-action')||{}).value||'').trim(),
  reported:(document.getElementById('in-reported')||{}).checked||false,
  by:session?session.id:'office',status:'open'});
 notify('incident',{k:(document.getElementById('in-kind')||{}).value});
 open=null;save();render();toast(u('in_added'));
}
function closeIncident(id){incidents().forEach(function(x){if(x.id===id)x.status='closed'});save();render();toast(u('in_closed'))}

/* --- chemical safety sheets --- */
function addSheet(){open={type:'sheet'};render()}
function saveSheet(){
 var n=((document.getElementById('sh-name')||{}).value||'').trim();
 if(!n){toast(u('sf_needname'));return}
 sheets().unshift({id:'sf'+Date.now(),name:n,
  hazard:(document.getElementById('sh-hazard')||{}).value,
  ppe:((document.getElementById('sh-ppe')||{}).value||'').trim(),
  first:((document.getElementById('sh-first')||{}).value||'').trim(),
  link:((document.getElementById('sh-link')||{}).value||'').trim(),
  at:Date.now()});
 open=null;save();render();toast(u('sf_added'));
}
function removeSheet(id){
 snapshot(u('sf_title'));db.sheets=sheets().filter(function(x){return x.id!==id});save();render()}
function setStWho(v){stWho=v;render()}
function statementFor(name,from,to){
 var js=db.jobs.filter(function(j){return j.customer===name&&jobDate(j)>=from&&jobDate(j)<=to&&
   (j.status==='done'||(j.status==='cancelled'&&j.cancel&&j.cancel.fee))});
 var invs=db.invoices.filter(function(v){return v.customer===name&&
   (!v.issued||ymd(new Date(v.issued))>=from)});
 var billed=invs.reduce(function(a,v){return a+invTotal(v)},0);
 var paid=invs.reduce(function(a,v){return a+invPaid(v)},0);
 var credited=invs.reduce(function(a,v){return a+invCredits(v)},0);
 return {jobs:js,invoices:invs,work:js.reduce(function(a,j){return a+(j.status==='cancelled'?j.cancel.fee:j.price)},0),
  billed:billed,paid:paid,credited:credited,due:billed-paid-credited};
}
function exportStatement(){
 var who=stWho||(customers()[0]||{}).name,from=stFrom||addDays(todayStr(),-30),to=stTo||todayStr();
 var st=statementFor(who,from,to);
 var rows=[['Statement for',who],['From',from],['To',to],[],['Date','Property','Service','Status','Amount']];
 st.jobs.forEach(function(j){rows.push([jobDate(j),j.prop,j.service,j.status,
   j.status==='cancelled'?j.cancel.fee:j.price])});
 rows.push([],['Work in period',Math.round(st.work)],['Invoiced',Math.round(st.billed)],
  ['Paid',Math.round(st.paid)],['Credited',Math.round(st.credited)],['Outstanding',Math.round(st.due)]);
 downloadCsv(rows,'statement-'+who.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.csv');
}

/* --- recurring invoicing --- */
function billingRuns(){db.runs=db.runs||[];return db.runs}
function setAutoBill(name,day){
 var r=billingRuns().filter(function(x){return x.customer===name})[0];
 if(!day){db.runs=billingRuns().filter(function(x){return x.customer!==name});save();render();toast(u('rb_off'));return}
 if(r)r.day=day; else billingRuns().unshift({customer:name,day:day,last:null});
 save();render();toast(u('rb_on')+' '+day);
}
function dueBillingRuns(){
 var dom=new Date().getDate();
 return billingRuns().filter(function(r){
  return r.day<=dom && (!r.last||ymd(new Date(r.last))<ymd(new Date(new Date().getFullYear(),new Date().getMonth(),1)))
   && unbilled(r.customer).length;
 });
}
function runBilling(){
 if(!managerOnly())return;
 var due=dueBillingRuns();
 if(!due.length){toast(u('rb_nothing'));return}
 var made=0;
 due.forEach(function(r){
  buildInvoice(r.customer);
  r.last=Date.now();made++;
 });
 save();render();toast(made+' '+u('rb_made'));
}


/* ---- 1. a damaged saved record must not take the whole app down ---- */
function safeParse(raw,fallback){
 try{var v=JSON.parse(raw);return (v&&typeof v==='object')?v:fallback}
 catch(e){return fallback}
}

/* ---- 2. editing a job after it exists ---- */
function editJob(id){
 var j=job(id);if(!j)return;
 tierPick=j.tier||'standard';
 jobForm={prop:j.prop,cust:j.customer,serv:j.service,cleaner:j.cleaner,time:j.time,
  price:Math.round(j.price/(TIERS[j.tier||'standard'].mult)),tier:j.tier||'standard',
  from:null,lat:null,lng:null,date:jobDate(j),team:(j.team||[]).slice(),editing:id};
 var p=property(j.prop);
 if(p&&p.lat){jobForm.lat=p.lat;jobForm.lng=p.lng}
 open={type:'job'};render();
}
function applyEdit(){
 var f=jobForm,j=job(f.editing);if(!j)return;
 var base=parseInt(f.price||'150',10)||150;
 var before=j.time+j.date+j.cleaner;
 j.prop=(f.prop||j.prop).trim();j.customer=(f.cust||'').trim()||j.customer;
 j.service=f.serv||j.service;j.tier=tierPick||j.tier;
 j.cleaner=f.cleaner||null;j.team=(f.team||[]).slice();
 j.time=(f.time||'').trim()||j.time;j.date=f.date||jobDate(j);
 j.price=Math.round(base*TIERS[j.tier].mult);
 if(before!==j.time+j.date+j.cleaner)notify('changed',{p:j.prop});
 jobForm=null;open=null;save();render();toast(u('ed_saved'));
}
function setFind(v){findQ=v;render()}
function clearFind(){findQ='';render()}
function findAll(){
 var q=(findQ||'').trim().toLowerCase();
 if(q.length<2)return null;
 var hit=function(x){return String(x||'').toLowerCase().indexOf(q)>-1};
 return {
  jobs:db.jobs.filter(function(j){return hit(j.prop)||hit(j.customer)||hit(j.service)||hit(String(j.id))}).slice(0,8),
  props:db.props.filter(function(p){return hit(p.name)||hit(p.area)||hit(p.key)}).slice(0,6),
  customers:customers().filter(function(c){return hit(c.name)||hit(c.contact)||hit(c.phone)}).slice(0,6),
  crew:crew().filter(function(c){return hit(c.name)||hit(c.phone)}).slice(0,6),
  invoices:db.invoices.filter(function(v){return hit(v.id)||hit(v.customer)}).slice(0,5),
  tasks:db.tasks.filter(function(x){return hit(taskTitle(x))||hit(x.prop)}).slice(0,5)
 };
}

/* ---- 4. a nudge when nothing has been backed up in a while ---- */
function lastBackup(){try{return parseInt(localStorage.getItem('cleanos:backup')||'0',10)}catch(e){return 0}}
function markBackup(){try{localStorage.setItem('cleanos:backup',String(Date.now()))}catch(e){}}
function backupOverdue(){
 if(cloud.on)return false;              /* synced to the cloud, no nudge needed */
 var last=lastBackup();
 if(!last)return db.jobs.length>12;     /* leave a brand new setup alone */
 return Date.now()-last>7*86400000;
}
function backupNow(){
 var payload={exported:new Date().toISOString(),company:db.company,data:db,photos:photos};
 try{
  var b=new Blob([JSON.stringify(payload)],{type:'application/json'});
  var url=URL.createObjectURL(b),a2=document.createElement('a');
  a2.href=url;a2.download='backup-'+todayStr()+'.json';
  document.body.appendChild(a2);a2.click();document.body.removeChild(a2);
  setTimeout(function(){URL.revokeObjectURL(url)},1500);
  markBackup();render();toast(u('bu_done'));
 }catch(e){toast(u('bu_failed'))}
}
function restoreAll(ev){
 var f=ev.target.files&&ev.target.files[0];if(!f)return;
 var rd=new FileReader();
 rd.onload=function(){
  var p=safeParse(rd.result,null);
  if(!p||!p.data||!p.data.jobs){toast(u('bu_badfile'));return}
  if(!confirm(u('bu_confirm')))return;
  db=p.data;photos=p.photos||{};
  save();render();toast(u('bu_restored'));
 };
 rd.readAsText(f);
}

/* ---- 5. telling us something is broken ---- */
function reportBug(){open={type:'bug'};render()}
function sendBug(){
 var what=((document.getElementById('bg-what')||{}).value||'').trim();
 if(!what){toast(u('bg_need'));return}
 var ctx=[db.company,'build 38',session?session.role:'-',tab,uiLang,
  db.jobs.length+' jobs',navigator.onLine?'online':'offline'].join(' · ');
 var msg=u('bg_subject')+'\n'+what+'\n\n---\n'+ctx;
 var to=S().supportPhone||'23054960101';
 open=null;render();
 try{window.open(wa(to,msg),'_blank')}catch(e){}
 toast(u('bg_sent'));
}

/* ---- 6. bringing customers in from a spreadsheet ---- */
function importCustomers(ev){
 var f=ev.target.files&&ev.target.files[0];if(!f)return;
 var rd=new FileReader();
 rd.onload=function(){
  var lines=String(rd.result).split(/\r?\n/).filter(function(l){return l.trim()});
  var added=0,skipped=0;
  lines.forEach(function(l,i){
   var c=l.split(',').map(function(x){return x.trim().replace(/^"|"$/g,'')});
   if(i===0&&/name/i.test(c[0]))return;
   if(!c[0])return;
   if(customerByName(c[0])){skipped++;return}
   customers().push({id:'cu'+Date.now()+i,name:c[0],contact:c[1]||'',
    phone:(c[2]||'').replace(/[^0-9]/g,''),email:c[3]||''});
   added++;
  });
  save();render();
  toast(added+' '+u('ic_added')+(skipped?' · '+skipped+' '+u('ic_skipped'):''));
 };
 rd.readAsText(f);
}


/* ---- the day on paper: what a manager pins up or hands over ---- */
function printDay(dstr){
 var d=dstr||calFor(),list=jobsOn(d).filter(function(j){return j.status!=='cancelled'})
  .sort(function(a,b){return a.time.localeCompare(b.time)});
 var rows=list.map(function(j){
  var p=property(j.prop),c=j.cleaner?cleaner(j.cleaner):null;
  return '<tr><td>'+j.time+'</td><td><b>'+esc(j.prop)+'</b>'+(p&&p.area?'<br><span class="s">'+esc(p.area)+'</span>':'')+'</td>'+
   '<td>'+esc(j.customer)+'</td><td>'+esc(svc(j.service))+'<br><span class="s">'+TIERS[j.tier||'standard'].name+'</span></td>'+
   '<td>'+(c?esc(c.name):'—')+((j.team&&j.team.length)?'<br><span class="s">+'+j.team.map(function(x){return esc(cleaner(x).name.split(' ')[0])}).join(', ')+'</span>':'')+'</td>'+
   '<td>'+(p&&p.key?esc(p.key):'—')+'</td><td class="r">'+aed(j.price)+'</td>'+
   '<td class="sig"></td></tr>';
 }).join('');
 var total=list.reduce(function(a,j){return a+j.price},0);
 var w=window.open('','_blank');
 if(!w){toast(u('pr_blocked'));return}
 w.document.write('<!doctype html><meta charset="utf-8"><title>'+esc(db.company)+' — '+dayName(d)+'</title>'+
  '<style>body{font:12px -apple-system,system-ui,sans-serif;color:#111;margin:26px}'+
  'h1{font-size:17px;margin:0 0 2px}.sub{color:#666;font-size:12px;margin-bottom:16px}'+
  'table{width:100%;border-collapse:collapse}th{text-align:left;font-size:10px;text-transform:uppercase;'+
  'letter-spacing:.04em;color:#666;border-bottom:1.5px solid #111;padding:6px 7px}'+
  'td{border-bottom:1px solid #ddd;padding:8px 7px;vertical-align:top}'+
  '.s{color:#777;font-size:10.5px}.r{text-align:right}.sig{width:88px;border-bottom:1px solid #ddd}'+
  'tfoot td{font-weight:600;border-top:1.5px solid #111;border-bottom:0}'+
  '@media print{body{margin:12mm}}</style>'+
  '<h1>'+esc(db.company)+'</h1><div class="sub">'+dayName(d)+' · '+d+' · '+list.length+' '+u('c_jobs')+'</div>'+
  '<table><thead><tr><th>'+u('f_time')+'</th><th>'+u('f_property')+'</th><th>'+u('h_customer')+'</th>'+
  '<th>'+u('f_service')+'</th><th>'+u('h_cleaner')+'</th><th>'+u('f_key')+'</th><th class="r">'+u('h_price')+'</th>'+
  '<th>'+u('pr_signed')+'</th></tr></thead><tbody>'+rows+'</tbody>'+
  '<tfoot><tr><td colspan="6">'+u('h_total')+'</td><td class="r">'+aed(total)+'</td><td></td></tr></tfoot></table>');
 w.document.close();
 setTimeout(function(){try{w.print()}catch(e){}},350);
}

/* ---- who to call when something runs out ---- */
function suppliers(){
 var m={};
 stock().forEach(function(it){
  if(!it.supplier)return;
  m[it.supplier]=m[it.supplier]||{name:it.supplier,phone:it.supplierPhone||'',items:[]};
  m[it.supplier].items.push(it);
  if(it.supplierPhone)m[it.supplier].phone=it.supplierPhone;
 });
 return Object.keys(m).map(function(k){return m[k]});
}
function setSupplierPhone(name){
 var v=prompt(u('sp_ask')+' '+name);
 if(v===null)return;
 var p=String(v).replace(/[^0-9]/g,'');
 stock().forEach(function(it){if(it.supplier===name)it.supplierPhone=p});
 save();render();toast(p?u('sp_saved'):u('sp_cleared'));
}
function orderText(sup){
 var low=sup.items.filter(function(it){return it.qty<it.min});
 var lines=(low.length?low:sup.items).map(function(it){
  return '• '+it.item+' × '+(it.qty<it.min?suggestQty(it):1)});
 return db.company+'\n'+u('sp_order')+'\n'+lines.join('\n');
}

/* ---- telling the customer when the cleaner will actually arrive ---- */
function etaText(j,mins){
 var p=property(j.prop);
 return db.company+'\n'+u('eta_line1')+' '+esc(j.prop)+'\n'+
  u('eta_line2')+' '+mins+' '+u('eta_mins')+'\n'+
  (j.cleaner?u('rm_cleaner')+' '+cleaner(j.cleaner).name+'\n':'')+
  u('eta_line3');
}
function sendEta(id,mins){
 var j=job(id);if(!j)return;
 j.eta={mins:mins,at:Date.now()};
 var cu=customerByName(j.customer);
 notify('eta',{p:j.prop,m:mins});
 save();render();
 if(cu&&cu.phone){try{window.open(wa(cu.phone,etaText(j,mins)),'_blank')}catch(e){}}
 toast(u('eta_sent'));
}


/* ---- 1. the evening summary a manager reads without opening the app ---- */
function daySummary(dstr){
 var d=dstr||todayStr();
 var js=db.jobs.filter(function(j){return jobDate(j)===d});
 var done=js.filter(function(j){return j.status==='done'});
 var probs=js.filter(function(j){return j.status==='problem'});
 var running=js.filter(function(j){return j.status==='progress'});
 var money=js.filter(function(j){return j.status!=='cancelled'}).reduce(function(a,j){return a+j.price},0);
 var tom=addDays(d,1);
 var tomJobs=db.jobs.filter(function(j){return jobDate(j)===tom&&j.status!=='cancelled'});
 var unassigned=tomJobs.filter(function(j){return !j.cleaner});
 var low=lowStock();
 var owed=db.invoices.reduce(function(a,v){return a+Math.max(0,invDue(v))},0);
 var L=[];
 L.push(db.company+' — '+dayName(d));
 L.push('');
 L.push(u('ds_done')+' '+done.length+'/'+js.filter(function(j){return j.status!=='cancelled'}).length);
 if(running.length)L.push(u('ds_running')+' '+running.length);
 if(probs.length)L.push('⚠ '+u('ds_problems')+' '+probs.length);
 L.push(u('ds_booked')+' '+aed(money));
 if(owed>0.5)L.push(u('ds_owed')+' '+aed(owed));
 L.push('');
 L.push(u('ds_tomorrow')+' '+tomJobs.length+' '+u('c_jobs'));
 if(unassigned.length)L.push('⚠ '+unassigned.length+' '+u('ds_unassigned'));
 if(low.length)L.push('⚠ '+u('ds_low')+' '+low.map(function(x){return x.item}).join(', '));
 var exp=expiringDocs().filter(function(x){return docDaysLeft(x)<=30});
 if(exp.length)L.push('⚠ '+exp.length+' '+u('ds_docs'));
 return L.join('\n');
}
function sendSummary(){
 var to=S().officePhone;
 if(!to){toast(u('ds_nophone'));return}
 try{window.open(wa(to,daySummary()),'_blank')}catch(e){}
 db.lastSummary=Date.now();save();
}

/* ---- 2. proof a manager can forward to their client ---- */
function proofText(j){
 var p=property(j.prop),cl=checklistFor(j);
 var L=[db.company];
 L.push(u('pf_job')+' '+j.prop);
 L.push(dayName(jobDate(j))+(j.started?' · '+u('pf_arrived')+' '+hhmm(j.started):''));
 if(j.finished)L.push(u('pf_left')+' '+hhmm(j.finished)+' ('+dur(j.started,j.finished)+')');
 if(j.geo)L.push(u('pf_gps')+' '+j.geo.dist+'m');
 L.push(u('pf_items')+' '+j.checked.length+'/'+cl.length);
 var pa=photoAreas(j),keys=Object.keys(pa);
 if(keys.length)L.push(u('pf_photos')+' '+keys.map(function(k){return (T.en[k]||k)+' '+pa[k]}).join(', '));
 if(j.rating)L.push(u('pf_rated')+' '+j.rating+'/5');
 return L.join('\n');
}
function shareProof(id){
 var j=job(id);if(!j)return;
 var cu=customerByName(j.customer),txt=proofText(j);
 open={type:'proof',job:id,txt:txt,phone:cu&&cu.phone,email:cu&&cu.email};render();
}
function startWizard(){
 wiz={step:1,company:'',country:guessCountry(),crew:[],props:[],cust:[]};
 open=null;render();
}
function wizSet(k,v){if(wiz)wiz[k]=v}
function wizNext(){
 if(!wiz)return;
 if(wiz.step===1){
  var n=((document.getElementById('wz-name')||{}).value||'').trim();
  if(!n){toast(u('wz_needname'));return}
  wiz.company=n;
  wiz.country=(document.getElementById('wz-country')||{}).value||'AE';
 }
 if(wiz.step===2){
  var raw=((document.getElementById('wz-crew')||{}).value||'').trim();
  wiz.crew=raw.split(/\n/).map(function(l){return l.trim()}).filter(Boolean).map(function(l){
   var p=l.split(',').map(function(x){return x.trim()});
   return {name:p[0],phone:(p[1]||'').replace(/[^0-9]/g,''),lang:(p[2]||'en').toLowerCase()};
  });
  if(!wiz.crew.length){toast(u('wz_needcrew'));return}
 }
 if(wiz.step===3){
  var rp=((document.getElementById('wz-props')||{}).value||'').trim();
  wiz.props=rp.split(/\n/).map(function(l){return l.trim()}).filter(Boolean).map(function(l){
   var p=l.split(',').map(function(x){return x.trim()});
   return {name:p[0],area:p[1]||'',customer:p[2]||''};
  });
 }
 wiz.step++;
 if(wiz.step>4)return wizFinish();
 render();
}
function wizCancel(){wiz=null;open=null;render()}
function wizBack(){if(wiz&&wiz.step>1){wiz.step--;render()}}
function wizFinish(){
 db=emptyDb(wiz.company,wiz.country);
 db.settings=settingsFor(wiz.country);
 wiz.crew.forEach(function(c,i){
  db.cleaners.push({id:'c'+(i+1),name:c.name,initials:c.name.split(' ').map(function(w){return w[0]}).join('').slice(0,2).toUpperCase(),
   phone:c.phone,email:'',lang:(T[c.lang]?c.lang:'en'),rate:0,senior:i===0,off:[]});
 });
 var seenCu={};
 wiz.props.forEach(function(p){
  db.props.push({name:p.name,area:p.area,lat:null,lng:null,key:'',park:'',wifi:'—',alarm:'—',note:''});
  if(p.customer&&!seenCu[p.customer]){
   seenCu[p.customer]=1;
   db.customers.push({id:'cu'+Date.now()+Math.floor(Math.random()*999),name:p.customer,contact:'',phone:'',email:''});
  }
 });
 db.setup=false;
 try{localStorage.setItem('cleanos:owner','1')}catch(e){}
 var viaGoogle=!!(authJwt&&cloud.url&&cloud.key);
 wiz=null;open=null;save();
 if(viaGoogle){createCloudCompany();return}
 signIn('manager',null);
 toast(u('wz_done'));
}
function snapshot(label){
 try{
  undoStack.push({label:label,at:Date.now(),data:JSON.stringify(db)});
  if(undoStack.length>10)undoStack.shift();
 }catch(e){}
}
function canUndo(){return undoStack.length>0}
function lastUndo(){return undoStack[undoStack.length-1]}
function undoLast(){
 var u2=undoStack.pop();
 if(!u2){toast(u('un_nothing'));return}
 var back=safeParse(u2.data,null);
 if(!back){toast(u('un_failed'));return}
 db=back;save();render();
 toast(u('un_done')+' '+u2.label);
}

/* ---- 6. once photos are in the cloud they need not sit on the phone ---- */
function localPhotoBytes(){
 var n=0;for(var k in photos)n+=String(photos[k]||'').length;
 return n;
}
function pickJob(id){
 if(picked[id])delete picked[id];else picked[id]=1;
 render();
}
function pickedIds(){return Object.keys(picked).map(Number)}
function clearPicked(){picked={};render()}
function bulkAssign(cid){
 var ids=pickedIds();if(!ids.length)return;
 snapshot(u('bk_assigned'));
 ids.forEach(function(id){var j=job(id);if(j&&j.status==='sched'){j.cleaner=cid||null;j.team=[]}});
 picked={};save();render();toast(ids.length+' '+u('bk_assigned'));
}
function bulkMove(d){
 var ids=pickedIds();if(!ids.length)return;
 snapshot(u('bk_moved'));
 ids.forEach(function(id){var j=job(id);if(j&&j.status==='sched')j.date=d});
 picked={};save();render();toast(ids.length+' '+u('bk_moved')+' '+dayName(d));
}
function bulkCancel(){
 var ids=pickedIds();if(!ids.length)return;
 if(!confirm(ids.length+' '+u('bk_confirmcancel')))return;
 snapshot(u('bk_cancelled'));
 ids.forEach(function(id){var j=job(id);if(j&&j.status!=='done'){j.status='cancelled';
  j.cancel={at:Date.now(),reason:u('bk_bulk'),pct:0,fee:0}}});
 picked={};save();render();toast(ids.length+' '+u('bk_cancelled'));
}

/* ---- 13. copying a whole day onto another day ---- */
function copyDay(from,to){
 var list=jobsOn(from).filter(function(j){return j.status!=='cancelled'});
 if(!list.length){toast(u('cp_nothing'));return}
 if(!confirm(list.length+' '+u('cp_confirm')+' '+dayName(to)+'?'))return;
 snapshot(u('cp_done'));
 list.forEach(function(j){
  db.jobs.push({id:db.seqJob++,prop:j.prop,customer:j.customer,service:j.service,tier:j.tier||'standard',
   cleaner:j.cleaner,team:(j.team||[]).slice(),time:j.time,date:to,price:j.price,status:'sched',
   started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null});
 });
 save();render();toast(list.length+' '+u('cp_done')+' '+dayName(to));
}

/* ---- 14. what this property normally costs ---- */
function usualPrice(propName,service,tier){
 var past=db.jobs.filter(function(j){
  return j.prop===propName&&j.status!=='cancelled'&&(!service||j.service===service);
 }).sort(function(a,b){return b.id-a.id}).slice(0,5);
 if(!past.length)return null;
 var base=past.map(function(j){return j.price/(TIERS[j.tier||'standard'].mult)});
 var avg=base.reduce(function(a,b){return a+b},0)/base.length;
 return {avg:Math.round(avg),last:Math.round(base[0]),n:past.length,
  suggested:Math.round(avg*TIERS[tier||'standard'].mult)};
}


/* ---- 9. quick tasks that come back every week ---- */
function taskPlans(){db.taskPlans=db.taskPlans||[];return db.taskPlans}
function addPlan(){open={type:'plan'};render()}
function savePlan(){
 var days=[];
 for(var i=0;i<7;i++)if(document.getElementById('pl-d'+i)&&document.getElementById('pl-d'+i).checked)days.push(i);
 if(!days.length){toast(u('pn_needday'));return}
 var prop=((document.getElementById('pl-prop')||{}).value||'').trim();
 if(!prop){toast(u('m_typeaddress'));return}
 taskPlans().unshift({id:'pl'+Date.now(),type:(document.getElementById('pl-type')||{}).value,
  custom:((document.getElementById('pl-custom')||{}).value||'').trim(),
  prop:prop,customer:((document.getElementById('pl-cust')||{}).value||'').trim()||'Direct',
  days:days,fee:parseFloat((document.getElementById('pl-fee')||{}).value||'0')||0,
  mode:(document.getElementById('pl-fee')&&parseFloat(document.getElementById('pl-fee').value)>0)?'fixed':'offers',
  last:null});
 open=null;save();render();toast(u('pn_added'));
}
function removePlan(id){snapshot(u('pn_title'));db.taskPlans=taskPlans().filter(function(p){return p.id!==id});save();render()}
function runPlans(){
 var dow=new Date().getDay(),made=0,today=todayStr();
 taskPlans().forEach(function(p){
  if(p.days.indexOf(dow)===-1)return;
  if(p.last===today)return;
  db.tasks.unshift({id:'T-'+(db.seqTask++),prop:p.prop,customer:p.customer,
   type:p.custom?'other':p.type,custom:p.custom,mode:p.mode,fee:p.fee,offers:[],
   status:'open',by:null,at:Date.now(),done:null,photo:null,from:null,to:null,
   note:u('pn_auto')});
  p.last=today;made++;
 });
 if(made){save();render();toast(made+' '+u('pn_created'))}
 else toast(u('pn_none'));
}
function showCustomer(id){openCu=id;render()}
function closeCustomer(){openCu=null;render()}
function addCuNote(id){
 var v=prompt(u('cn_ask'));
 if(v===null||!v.trim())return;
 var c=customerById(id);if(!c)return;
 c.notes=c.notes||[];
 c.notes.unshift({at:Date.now(),by:session?session.role:'office',text:v.trim()});
 if(c.notes.length>40)c.notes.length=40;
 save();render();toast(u('cn_added'));
}

/* ---- 11. before against after, side by side ---- */
function comparePhotos(id){open={type:'compare',job:id};render()}

/* ---- 12. who is actually doing the work well ---- */
function leaderboard(){
 return crew().map(function(c){
  var done=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&j.status==='done'});
  var ot=done.filter(function(j){return j.started&&j.started<=todayAt(j.time)+15*MIN}).length;
  var ph=done.reduce(function(a,j){return a+(j.photos||[]).length},0);
  var disp=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&j.disputed}).length;
  var tasks=db.tasks.filter(function(x){return x.by===c.id&&x.status==='done'}).length;
  var score=(ratingOf(c)*14)+(done.length?ot/done.length*22:0)+(done.length*1.6)+(tasks*1.1)-(disp*9);
  return {c:c,done:done.length,onTime:done.length?Math.round(ot/done.length*100):0,
   photos:done.length?(ph/done.length).toFixed(1):'0',disputes:disp,tasks:tasks,
   rating:ratingOf(c),score:Math.round(score)};
 }).sort(function(a,b){return b.score-a.score});
}

/* ---- 15. handing the books to an accountant ---- */
function exportLedger(){
 var rows=[['Date','Type','Reference','Customer or supplier','Description','Net','Tax','Gross','Paid','Outstanding']];
 db.invoices.forEach(function(v){
  var net=invNet(v),tax=net*taxRate();
  rows.push([v.issued?ymd(new Date(v.issued)):todayStr(),'Sales invoice',v.id,v.customer,
   (v.jobIds?v.jobIds.length+' jobs':v.jobs+' jobs'),net.toFixed(2),tax.toFixed(2),
   invTotal(v).toFixed(2),invPaid(v).toFixed(2),Math.max(0,invDue(v)).toFixed(2)]);
  (v.credits||[]).forEach(function(c){
   rows.push([ymd(new Date(c.at)),'Credit note',c.ref,v.customer,c.reason,
    (-c.amt).toFixed(2),'0.00',(-c.amt).toFixed(2),'0.00','0.00']);
  });
  v.payments.forEach(function(p){
   rows.push([ymd(new Date(p.at)),'Receipt',v.id,v.customer,p.method||'payment',
    '0.00','0.00','0.00',p.amt.toFixed(2),'0.00']);
  });
 });
 expenses().forEach(function(x){
  rows.push([x.date||ymd(new Date(x.at)),'Expense','',x.kind,x.note||'',
   (-x.amount).toFixed(2),'0.00',(-x.amount).toFixed(2),(-x.amount).toFixed(2),'0.00']);
 });
 orders().filter(function(o){return o.status==='received'}).forEach(function(o){
  rows.push([ymd(new Date(o.received||o.at)),'Purchase',o.id,o.supplier,o.lines.length+' items',
   (-orderTotal(o)).toFixed(2),'0.00',(-orderTotal(o)).toFixed(2),'0.00','0.00']);
 });
 var p=payPeriod();
 payrollRows(p.from,p.to).forEach(function(r){
  if(!r.total)return;
  rows.push([p.to,'Wages','',r.c.name,r.hours.toFixed(2)+' hours',
   (-r.total).toFixed(2),'0.00',(-r.total).toFixed(2),'0.00','0.00']);
 });
 downloadCsv(rows,'ledger-'+todayStr()+'.csv');
}
function haveToken(){return !!memberToken}


/* ============================================================
   Route optimisation.
   Competitors either lack this entirely or put it on plans at
   $119-$299 a month. It is also the one change that pays for
   itself: fewer kilometres between stops means more jobs in
   the same day.
   ============================================================ */
function haversine(a,b){
 if(!a||!b||a.lat==null||b.lat==null)return 0;
 var R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;
 var la1=a.lat*Math.PI/180,la2=b.lat*Math.PI/180;
 var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.sin(dLng/2)*Math.sin(dLng/2)*Math.cos(la1)*Math.cos(la2);
 return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
function jobPoint(j){var p=property(j.prop);return (p&&p.lat!=null)?{lat:p.lat,lng:p.lng}:null}
function routeLength(list){
 var km=0;
 for(var i=1;i<list.length;i++)km+=haversine(jobPoint(list[i-1]),jobPoint(list[i]));
 return km;
}
/* nearest stop first, then untangle any crossings */
function optimiseOrder(list){
 var pts=list.filter(jobPoint),noloc=list.filter(function(j){return !jobPoint(j)});
 if(pts.length<3)return pts.concat(noloc);
 var out=[pts[0]],rest=pts.slice(1);
 while(rest.length){
  var last=out[out.length-1],bi=0,bd=Infinity;
  rest.forEach(function(j,i){var d=haversine(jobPoint(last),jobPoint(j));if(d<bd){bd=d;bi=i}});
  out.push(rest.splice(bi,1)[0]);
 }
 /* 2-opt: reverse any segment that shortens the whole run */
 var improved=true,guard=0;
 while(improved&&guard<40){
  improved=false;guard++;
  for(var i=1;i<out.length-1;i++){
   for(var k=i+1;k<out.length;k++){
    var before=routeLength(out);
    var trial=out.slice(0,i).concat(out.slice(i,k+1).reverse(),out.slice(k+1));
    if(routeLength(trial)<before-0.01){out=trial;improved=true}
   }
  }
 }
 return out.concat(noloc);
}
function routeFor(cid,dstr){
 return db.jobs.filter(function(j){
  return teamOf(j).indexOf(cid)>-1&&jobDate(j)===(dstr||todayStr())&&j.status!=='cancelled';
 }).sort(function(a,b){return a.time.localeCompare(b.time)});
}
function routeSaving(cid,dstr){
 var cur=routeFor(cid,dstr);
 if(cur.length<3)return null;
 var now=routeLength(cur),best=routeLength(optimiseOrder(cur));
 if(now<=best+0.05)return null;
 return {now:now,best:best,km:now-best,mins:Math.round((now-best)/28*60),
  pct:Math.round((now-best)/now*100)};
}
/* reorder the day by moving the times, keeping the same slots */
function applyRoute(cid,dstr){
 var d=dstr||todayStr(),cur=routeFor(cid,d);
 if(cur.length<3){toast(u('ro_toofew'));return}
 var slots=cur.map(function(j){return j.time}).sort();
 var order=optimiseOrder(cur);
 var before=routeLength(cur);
 snapshot(u('ro_title'));
 order.forEach(function(j,i){j.time=slots[i]});
 var after=routeLength(routeFor(cid,d));
 notify('route',{a:cleaner(cid).name.split(' ')[0],k:Math.round(before-after)});
 save();render();
 toast(u('ro_done')+' '+(before-after).toFixed(1)+' km');
}
function trades(){
 var t=S().trades;
 if(!t||!t.length)return ['cleaning'];
 return t.filter(function(x){return TRADES[x]});
}
function tradeOf(j){return (j&&j.trade&&TRADES[j.trade])?j.trade:trades()[0]}
function multiTrade(){return false}
function servicesFor(tr){return (TRADES[tr]||TRADES.cleaning).services}
function checkFor(tr){return (TRADES[tr]||TRADES.cleaning).check}
function toggleTrade(k){
 var t=trades().slice(),i=t.indexOf(k);
 if(i>-1){if(t.length===1){toast(u('td_keepone'));return}t.splice(i,1)}
 else t.push(k);
 S().trades=t;save();render();
 toast(u('td_now')+' '+t.map(function(x){return TRADES[x].name}).join(' + '));
}
function setReading(id,k,v){
 var j=job(id);if(!j)return;
 j.readings=j.readings||{};
 if(v==='')delete j.readings[k];else j.readings[k]=v;
 save();
}
function readingsLine(j){
 var r=j.readings;
 if(!r)return '';
 var bits=[];
 if(r.tempin&&r.tempout)bits.push('Δ'+(Math.round((r.tempin-r.tempout)*10)/10)+'°C');
 if(r.gas)bits.push(r.gas+' psi');
 if(r.amps)bits.push(r.amps+' A');
 return bits.length?'<span>'+bits.join(' · ')+'</span>':'';
}


/* ============================================================
   What air-conditioning work needs that cleaning does not:
   the units themselves, a service schedule per unit, and the
   annual contract that pays for it.
   ============================================================ */
function assets(){db.assets=db.assets||[];return db.assets}
function assetsAt(prop){return assets().filter(function(a){return a.prop===prop})}
function assetById(id){return assets().filter(function(a){return a.id===id})[0]||null}
function addAsset(prop){open={type:'asset',prop:prop||''};render()}
function saveAsset(){
 var prop=((document.getElementById('as-prop')||{}).value||'').trim();
 var label=((document.getElementById('as-label')||{}).value||'').trim();
 if(!prop||!label){toast(u('as_need'));return}
 assets().unshift({id:'a'+Date.now(),prop:prop,label:label,
  kind:(document.getElementById('as-kind')||{}).value||'Split unit',
  make:((document.getElementById('as-make')||{}).value||'').trim(),
  model:((document.getElementById('as-model')||{}).value||'').trim(),
  serial:((document.getElementById('as-serial')||{}).value||'').trim(),
  installed:(document.getElementById('as-installed')||{}).value||'',
  every:parseInt((document.getElementById('as-every')||{}).value||'6',10)||6,
  last:(document.getElementById('as-last')||{}).value||'',
  notes:''});
 open=null;save();render();toast(u('as_added'));
}
function removeAsset(id){snapshot(u('as_title'));db.assets=assets().filter(function(a){return a.id!==id});save();render()}
function assetDue(a){
 if(!a.last)return {due:true,when:null,over:0};
 var next=addMonths(a.last,a.every||6);
 var days=Math.round((new Date(next)-new Date(todayStr()))/86400000);
 return {due:days<=14,when:next,over:days<0?-days:0,days:days};
}
function addMonths(dstr,n){
 var p=dstr.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);
 d.setMonth(d.getMonth()+n);return ymd(d);
}
function assetsDue(){
 return assets().filter(function(a){return assetDue(a).due})
  .sort(function(x,y){return (assetDue(x).days||0)-(assetDue(y).days||0)});
}
/* a service visit records which units were worked on */
function serviceHistory(id){
 return db.jobs.filter(function(j){return (j.assets||[]).indexOf(id)>-1&&j.finished})
  .sort(function(a,b){return b.finished-a.finished});
}
function toggleJobAsset(jobId,assetId){
 var j=job(jobId);if(!j)return;
 j.assets=j.assets||[];
 var i=j.assets.indexOf(assetId);
 if(i>-1)j.assets.splice(i,1);else j.assets.push(assetId);
 /* servicing a unit resets its clock */
 if(j.finished){var a=assetById(assetId);if(a&&i===-1)a.last=jobDate(j)}
 save();render();
}
/* raise the visits that are due, as jobs */
function planMaintenance(){
 if(!managerOnly())return;
 var due=assetsDue();
 if(!due.length){toast(u('as_nonedue'));return}
 var byProp={};
 due.forEach(function(a){(byProp[a.prop]=byProp[a.prop]||[]).push(a)});
 var made=0;
 Object.keys(byProp).forEach(function(prop){
  var list=byProp[prop];
  var already=db.jobs.some(function(j){
   return j.prop===prop&&j.status==='sched'&&(j.assets||[]).length&&jobDate(j)>=todayStr();
  });
  if(already)return;
  var cu=(db.jobs.filter(function(j){return j.prop===prop})[0]||{}).customer||'Direct';
  db.jobs.push({id:db.seqJob++,prop:prop,customer:cu,service:'Deep clean',trade:trades()[0],
   tier:'standard',cleaner:null,team:[],time:'09:00',date:addDays(todayStr(),3),
   price:Math.max(120,list.length*90),status:'sched',started:null,finished:null,
   checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null,
   assets:list.map(function(a){return a.id})});
  made++;
 });
 save();render();
 toast(made?(made+' '+u('as_planned')):u('as_alreadyplanned'));
}

/* ---- the annual contract Dubai runs on ---- */
function amcs(){db.amcs=db.amcs||[];return db.amcs}
function amcFor(name){return amcs().filter(function(a){return a.customer===name&&a.active!==false})[0]||null}
function amcUsed(a){
 return db.jobs.filter(function(j){
  if(j.customer!==a.customer||j.status!=='done')return false;
  if(jobDate(j)<a.from||jobDate(j)>a.to)return false;
  /* a contract covers one trade. A cleaning visit must not consume an
     air-conditioning contract, and a free re-clean is not a visit at all. */
  if(a.trade&&a.trade!=='any'&&tradeOf(j)!==a.trade)return false;
  if(j.rework)return false;
  return true;
 }).length;
}
function amcLeft(a){return Math.max(0,a.visits-amcUsed(a))}
function addAmc(){open={type:'amc'};render()}
function saveAmc(){
 var cu=(document.getElementById('am-cust')||{}).value||'';
 if(!cu){toast(u('am_needcust'));return}
 amcs().unshift({id:'AMC-'+(1000+amcs().length+1),customer:cu,
  from:(document.getElementById('am-from')||{}).value||todayStr(),
  to:(document.getElementById('am-to')||{}).value||addMonths(todayStr(),12),
  trade:(document.getElementById('am-trade')||{}).value||'any',
  visits:parseInt((document.getElementById('am-visits')||{}).value||'4',10)||4,
  value:parseFloat((document.getElementById('am-value')||{}).value||'0')||0,
  covers:((document.getElementById('am-covers')||{}).value||'').trim(),active:true});
 open=null;save();render();toast(u('am_added'));
}
function endAmc(id){snapshot(u('am_title'));amcs().forEach(function(a){if(a.id===id)a.active=false});save();render()}


/* ============================================================
   A customer asking for their own access, and a sidebar that
   does not present twenty-two things at once.
   ============================================================ */
function accessRequests(){db.accessReqs=db.accessReqs||[];return db.accessReqs}
function openAskAccess(){askAccess=true;render()}
function closeAskAccess(){askAccess=false;render()}
function approveAccess(id){
 if(!managerOnly())return;
 var r=accessRequests().filter(function(x){return x.id===id})[0];if(!r)return;
 var cu=customerByName(r.name);
 if(!cu){
  cu={id:'cu'+Date.now(),name:r.name,contact:'',phone:r.phone||'',email:r.email||''};
  customers().push(cu);
 }
 if(r.prop&&!property(r.prop))
  db.props.push({name:r.prop,area:'',lat:null,lng:null,key:'',park:'',wifi:'—',alarm:'—',note:''});
 r.status='approved';
 if(cloud.on)addMember(cu.id,'customer',cu.name);
 save();render();
 toast(u('req_approved')+' '+(cloud.on?u('req_sendlink'):u('req_setpin')));
}
function refuseAccess(id){
 accessRequests().forEach(function(x){if(x.id===id)x.status='refused'});
 save();render();
}
function waitingAccess(){return accessRequests().filter(function(x){return x.status==='waiting'})}
function groupOf(tabId){
 for(var i=0;i<GROUPS.length;i++)if(GROUPS[i][1].indexOf(tabId)>-1)return GROUPS[i][0];
 return 'g_work';
}
function groupsShown(){
 if(openGroups)return openGroups;
 try{var v=localStorage.getItem('cleanos:groups');if(v)return (openGroups=JSON.parse(v))}catch(e){}
 return (openGroups={});
}
function toggleGroup(g){
 var o=groupsShown();
 o[g]=!o[g];
 try{localStorage.setItem('cleanos:groups',JSON.stringify(o))}catch(e){}
 render();
}


/* ============================================================
   Inspections.
   The cleaner ticks their own list — that is a claim. A
   supervisor walking the room afterwards is the check. Kept as
   two separate records on purpose: one says what was done, the
   other says whether it passed.
   ============================================================ */
function inspections(){db.inspections=db.inspections||[];return db.inspections}
function inspectionFor(jobId){
 return inspections().filter(function(x){return x.job===jobId})
  .sort(function(a,b){return b.at-a.at})[0]||null;
}
function needsInspection(){
 return db.jobs.filter(function(j){
  return j.status==='done'&&!inspectionFor(j.id)&&jobDate(j)>=addDays(todayStr(),-3);
 }).sort(function(a,b){return (b.finished||0)-(a.finished||0)});
}
function startInspection(jobId){
 var j=job(jobId);if(!j)return;
 insp={job:jobId,marks:{},photos:[],at:Date.now()};
 open={type:'inspect'};render();
}
function markItem(k,v){
 if(!insp)return;
 if(insp.marks[k]===v)delete insp.marks[k];else insp.marks[k]=v;
 render();
}
function markAllPass(){
 if(!insp)return;
 var j=job(insp.job);if(!j)return;
 checklistFor(j).forEach(function(k){if(!insp.marks[k])insp.marks[k]='pass'});
 render();
}
function inspScore(marks,total){
 var pass=0,fail=0;
 for(var k in marks){if(marks[k]==='pass')pass++;else if(marks[k]==='fail')fail++}
 var judged=pass+fail;
 return {pass:pass,fail:fail,judged:judged,left:total-judged,
  score:judged?Math.round(pass/judged*100):null};
}
function inspShoot(ev){
 var f=ev.target.files&&ev.target.files[0];if(!f||!insp)return;
 shrink(f,function(data){
  var pid='ip'+Date.now()+Math.floor(Math.random()*999);
  photos[pid]=data;uploadPhoto(pid,data,insp.job,'inspection');
  insp.photos.push(pid);save();render();
 });
}
function saveInspection(){
 if(!insp)return;
 var j=job(insp.job);if(!j)return;
 var cl=checklistFor(j),sc=inspScore(insp.marks,cl.length);
 if(!sc.judged){toast(u('ins_markone'));return}
 var rec={id:'INS'+Date.now(),job:insp.job,prop:j.prop,cleaner:j.cleaner,
  by:(session&&session.id)||'office',at:Date.now(),marks:insp.marks,
  photos:insp.photos.slice(),
  notes:(document.getElementById('ins-note')?document.getElementById('ins-note').value.trim():''),
  score:sc.score,pass:sc.pass,fail:sc.fail};
 inspections().unshift(rec);
 if(inspections().length>400)db.inspections=inspections().slice(0,400);
 j.inspected=rec.score;
 if(sc.fail){
  var items=Object.keys(insp.marks).filter(function(k){return insp.marks[k]==='fail'})
   .map(function(k){return itemLabel(k,j.prop)}).join(', ');
  db.issues.unshift({id:db.seqIssue++,job:j.id,prop:j.prop,by:j.cleaner,type:'quality',
   note:u('ins_failed')+': '+items,at:Date.now(),priority:sc.score<60?'High':'Medium',
   open:true,photo:insp.photos[0]||null});
  notify('inspectfail',{p:j.prop,n:sc.fail});
 } else notify('inspectpass',{p:j.prop,s:sc.score});
 insp=null;open=null;save();pushNow();render();
 toast(u('ins_saved')+' '+sc.score+'%');
}
function redoFromInspection(jobId){
 var j=job(jobId);if(!j)return;
 var rec=inspectionFor(jobId);
 snapshot(u('ins_redo'));
 db.jobs.push({id:db.seqJob++,prop:j.prop,customer:j.customer,service:j.service,
  trade:tradeOf(j),tier:j.tier||'standard',cleaner:j.cleaner,team:(j.team||[]).slice(),
  time:j.time,date:todayStr(),price:0,status:'sched',started:null,finished:null,
  checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null,rework:j.id,
  redoItems:rec?Object.keys(rec.marks).filter(function(k){return rec.marks[k]==='fail'}):[]});
 save();render();toast(u('ins_redone'));
}
function inspAvg(filterFn){
 var list=inspections().filter(filterFn);
 if(!list.length)return null;
 return Math.round(list.reduce(function(a,x){return a+x.score},0)/list.length);
}
function cleanerScore(cid){return inspAvg(function(x){return x.cleaner===cid})}
function propScore(prop){return inspAvg(function(x){return x.prop===prop})}
function opMode(){return S().mode||'field'}
function setMode(m){S().mode=m;save();render();toast(u('md_now')+' '+MODES[m].name)}
function supervisorOnly(){return opMode()==='supervisor'}
function roomState(prop){var p=property(prop);return (p&&p.state)||'dirty'}
function setRoomState(prop,st){
 var p=property(prop);if(!p)return;
 p.state=st;p.stateAt=Date.now();p.stateBy=(session&&session.id)||'office';
 save();pushNow();render();
}
function roomCounts(){
 var c={};ROOM_STATES.forEach(function(x){c[x[0]]=0});
 db.props.forEach(function(p){c[p.state||'dirty']++});
 return c;
}
/* in supervisor mode nobody signs in as a cleaner; the supervisor records it */
function markDoneFor(jobId){
 var j=job(jobId);if(!j)return;
 j.status='done';j.started=j.started||(Date.now()-45*MIN);j.finished=Date.now();
 if(!j.checked.length)j.checked=checklistFor(j).slice();
 setRoomState(j.prop,'clean');
 save();pushNow();render();toast(u('md_recorded'));
}


/* ============================================================
   Getting paid, and email.
   No payment provider is built in, on purpose: Stripe, PayPal,
   MIPS, Peach, MCB Juice and bank transfer are each available in
   some countries and not others. The company pastes whatever it
   already uses, and every invoice carries it.
   ============================================================ */
function payCfg(){var st=S();st.pay=st.pay||{};return st.pay}
function savePayCfg(){
 if(!managerOnly())return;
 var p=payCfg(),g=function(id){return ((document.getElementById(id)||{}).value||'').trim()};
 p.link=g('py-link');p.bank=g('py-bank');p.holder=g('py-holder');p.account=g('py-account');
 p.swift=g('py-swift');p.mobile=g('py-mobile');p.note=g('py-note');
 save();render();toast(u('st_saved'));
}
function invRef(v){return v.id}
function invLinkFor(v,amt){
 var p=payCfg();if(!p.link)return '';
 var c=S().currency,dp=(c==='KWD'||c==='BHD'||c==='OMR'||c==='TND')?3:0,f=Math.pow(10,dp);
 return p.link.replace(/\{amount\}/g,String(Math.round(amt*f)/f))
  .replace(/\{ref\}/g,encodeURIComponent(invRef(v))).replace(/\{currency\}/g,S().currency||'');
}
function payLink(invId,amt){
 var v=db.invoices.filter(function(x){return x.id===invId})[0];
 return v?invLinkFor(v,amt):'';
}
function payLines(v,amt){
 var p=payCfg(),L=[];
 var link=invLinkFor(v,amt);
 if(link)L.push(u('gp_paynow')+': '+link);
 if(p.account){
  L.push(u('gp_bybank')+':');
  if(p.holder)L.push('  '+u('gp_holder')+': '+p.holder);
  if(p.bank)L.push('  '+u('gp_bankname')+': '+p.bank);
  L.push('  '+u('gp_account')+': '+p.account);
  if(p.swift)L.push('  SWIFT/BIC: '+p.swift);
  L.push('  '+u('gp_ref')+': '+invRef(v));
 }
 if(p.mobile)L.push(u('gp_mobile')+': '+p.mobile);
 if(p.note)L.push(p.note);
 return L;
}
function payMessage(v){
 var due=invDue(v);
 return [db.company,'',u('gp_invoice')+' '+v.id+' — '+aed(due)+' '+u('gp_due')+(v.due?' '+dayName(ymd(new Date(v.due))):''),'']
  .concat(payLines(v,due)).concat(['',u('gp_thanks')]).join('\n');
}
function hasPayWay(){var p=payCfg();return !!(p.link||p.account||p.mobile)}

/* email without a mail server: opens the person's own mail app, already written */
function mailto(to,subject,body){
 return 'mailto:'+encodeURIComponent(to||'')+'?subject='+encodeURIComponent(subject||'')+'&body='+encodeURIComponent(body||'');
}
function custContact(name){return customers().filter(function(c){return c.name===name})[0]||{}}
function askPayment(invId,how){
 var v=db.invoices.filter(function(x){return x.id===invId})[0];if(!v)return;
 if(!hasPayWay()){toast(u('gp_setfirst'));go('settings');return}
 var c=custContact(v.customer),msg=payMessage(v);
 if(how==='mail'){
  if(!c.email){toast(u('gp_noemail'));return}
  try{window.open(mailto(c.email,db.company+' — '+u('gp_invoice')+' '+v.id,msg),'_blank')}catch(e){}
 } else {
  if(!c.phone){toast(u('gp_nophone'));return}
  try{window.open(wa(c.phone,msg),'_blank')}catch(e){}
 }
 v.asked=(v.asked||[]).concat([{at:Date.now(),how:how}]);
 save();render();toast(u('gp_sent'));
}
function openLegal(){legalOpen=true;render()}
function closeLegal(){legalOpen=false;render()}

/* everything held about one person, in one file */
function personRefs(kind,id){
 var out={kind:kind,exported:new Date().toISOString(),company:db.company};
 if(kind==='cleaner'){
  var c=crew().filter(function(x){return x.id===id})[0]||{};
  var rec=JSON.parse(JSON.stringify(c));delete rec.pin;
  out.person=rec;
  out.jobs=db.jobs.filter(function(j){return teamOf(j).indexOf(id)>-1}).map(function(j){
   return {id:j.id,date:jobDate(j),time:j.time,prop:j.prop,status:j.status,started:j.started,finished:j.finished,geo:j.geo}});
  out.shifts=(db.shifts||[]).filter(function(x){return x.by===id});
  out.leave=(db.leave||[]).filter(function(x){return x.by===id});
  out.documents=(db.docs||[]).filter(function(x){return x.who===id||x.by===id});
  out.messages=(db.msgs||[]).filter(function(m){return m.from===id||m.to===id});
  out.problems=(db.issues||[]).filter(function(x){return x.by===id});
  out.ratings=(db.ratings||{})[id]||[];
  out.inspections=(db.inspections||[]).filter(function(x){return x.cleaner===id});
 } else {
  var cu=customers().filter(function(x){return x.id===id})[0]||{},nm=cu.name;
  out.person=cu;
  out.jobs=db.jobs.filter(function(j){return j.customer===nm});
  out.properties=db.props.filter(function(p){return db.jobs.some(function(j){return j.customer===nm&&j.prop===p.name})});
  out.invoices=db.invoices.filter(function(v){return v.customer===nm});
  out.requests=(db.requests||[]).filter(function(x){return x.customer===nm});
  out.messages=(db.msgs||[]).filter(function(m){return m.from===id||m.to===id});
  out.quotes=(db.quotes||[]).filter(function(x){return x.name===nm||x.customer===nm});
 }
 return out;
}
function exportPerson(kind,id){
 var data=personRefs(kind,id);
 var name=String((data.person&&data.person.name)||id).replace(/[^a-z0-9]+/gi,'-').toLowerCase();
 try{
  var b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(b),a2=document.createElement('a');
  a2.href=url;a2.download='data-'+name+'-'+todayStr()+'.json';
  document.body.appendChild(a2);a2.click();document.body.removeChild(a2);
  setTimeout(function(){URL.revokeObjectURL(url)},1500);
  toast(u('pd_exported'));
 }catch(e){toast(u('bu_failed'))}
}
/* Erasing keeps what the law requires a business to keep — invoices for a
   customer, pay records for staff — and removes everything else. */
function erasePerson(kind,id){
 if(!managerOnly())return;
 if(!confirm(u(kind==='cleaner'?'pd_confirmstaff':'pd_confirmcust')))return;
 snapshot(u('pd_erase'));
 if(kind==='cleaner'){
  var c=crew().filter(function(x){return x.id===id})[0];if(!c)return;
  var tag=u('pd_formerstaff')+' '+String(id).toUpperCase();
  c.name=tag;c.initials='—';c.phone='';c.email='';c.erased=Date.now();c.off=[];
  if(db.pins)delete db.pins[id];
  db.docs=(db.docs||[]).filter(function(x){return x.who!==id&&x.by!==id});
  (db.msgs||[]).forEach(function(m){if(m.from===id||m.to===id)m.text='['+u('pd_removed')+']'});
  (db.shifts||[]).forEach(function(x){if(x.by===id){delete x.inGeo;delete x.outGeo}});
  db.jobs.forEach(function(j){if(teamOf(j).indexOf(id)>-1&&j.geo)j.geo={dist:j.geo.dist}});
  if(cloud.on&&memberList)memberList.filter(function(m){return m.person_id===id&&m.active}).forEach(function(m){revokeMemberQuiet(m.token)});
 } else {
  var cu=customers().filter(function(x){return x.id===id})[0];if(!cu)return;
  var nm=cu.name;
  cu.contact='';cu.phone='';cu.email='';cu.notes=[];cu.erased=Date.now();
  (db.msgs||[]).forEach(function(m){if(m.from===id||m.to===id)m.text='['+u('pd_removed')+']'});
  db.props.forEach(function(p){
   var theirs=db.jobs.some(function(j){return j.customer===nm&&j.prop===p.name});
   var others=db.jobs.some(function(j){return j.customer!==nm&&j.prop===p.name});
   if(theirs&&!others){p.key='';p.alarm='—';p.wifi='—';p.note='';p.park=''}
  });
  db.quotes=(db.quotes||[]).filter(function(x){return x.name!==nm});
  db.leads=(db.leads||[]).filter(function(x){return x.name!==nm});
  db.accessReqs=(db.accessReqs||[]).filter(function(x){return x.name!==nm});
  if(cloud.on&&memberList)memberList.filter(function(m){return m.person_id===id&&m.active}).forEach(function(m){revokeMemberQuiet(m.token)});
 }
 save();pushNow();render();toast(u('pd_erased'));
}
function personDataModal(kind,id){open={type:'pdata',kind:kind,id:id};render()}
function lng2px(lng,z){return (lng+180)/360*Math.pow(2,z)*TS}
function lat2px(lat,z){
 var r=lat*Math.PI/180;
 return (1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*Math.pow(2,z)*TS;
}
function fitZoom(pts,w,h){
 if(pts.length<2)return 15;
 for(var z=18;z>=2;z--){
  var xs=pts.map(function(p){return lng2px(p.lng,z)}),ys=pts.map(function(p){return lat2px(p.lat,z)});
  if(Math.max.apply(null,xs)-Math.min.apply(null,xs)<w*0.82 &&
     Math.max.apply(null,ys)-Math.min.apply(null,ys)<h*0.82)return z;
 }
 return 2;
}
function mapCentreOf(pts){
 if(!pts.length)return {lat:25.08,lng:55.14};
 if(mapCentre)return mapCentre;
 return {lat:pts.reduce(function(a,p){return a+p.lat},0)/pts.length,
         lng:pts.reduce(function(a,p){return a+p.lng},0)/pts.length};
}
function zoomBy(d){
 var pts=db.props.filter(function(p){return p.lat});
 mapCentre=mapCentreOf(pts);
 mapZoom=Math.max(2,Math.min(19,(mapZoom||fitZoom(pts,W_MAP,H_MAP))+d));
 render();
}
function resetMap(){mapZoom=null;mapCentre=null;render()}
function tileMap(){
 var pts=db.props.filter(function(p){return p.lat&&p.lng});
 var crewPos=crew().filter(function(c){return c.pos}).map(function(c){return {lat:c.pos.lat,lng:c.pos.lng,c:c}});
 var all=pts.concat(crewPos);
 if(!all.length)return '';
 var z=mapZoom||fitZoom(all,W_MAP,H_MAP);
 var c=mapCentreOf(all);
 var cx=lng2px(c.lng,z),cy=lat2px(c.lat,z);
 var left=cx-W_MAP/2, top=cy-H_MAP/2;
 var x0=Math.floor(left/TS),x1=Math.floor((left+W_MAP)/TS);
 var y0=Math.floor(top/TS),y1=Math.floor((top+H_MAP)/TS);
 var n=Math.pow(2,z),h='';
 h+='<div style="position:relative;width:100%;height:'+H_MAP+'px;overflow:hidden;background:#0F141A">';
 h+='<div style="position:absolute;inset:0;filter:grayscale(0.35) brightness(0.82) contrast(1.05)">';
 for(var ty=y0;ty<=y1;ty++)for(var tx=x0;tx<=x1;tx++){
  var wx=((tx%n)+n)%n;
  if(ty<0||ty>=n)continue;
  h+='<img alt="" loading="lazy" src="https://tile.openstreetmap.org/'+z+'/'+wx+'/'+ty+'.png" '+
     'style="position:absolute;width:'+TS+'px;height:'+TS+'px;left:'+(tx*TS-left)+'px;top:'+(ty*TS-top)+'px" '+
     'onerror="this.style.visibility=\'hidden\'">';
 }
 h+='</div>';
 /* routes */
 h+='<svg viewBox="0 0 '+W_MAP+' '+H_MAP+'" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">';
 crew().forEach(function(cl){
  var mine=db.jobs.filter(function(j){return j.cleaner===cl.id&&j.status!=='cancelled'})
   .sort(function(a,b){return a.time.localeCompare(b.time)})
   .map(function(j){return property(j.prop)}).filter(function(p){return p&&p.lat});
  if(mine.length<2)return;
  var d='M'+mine.map(function(p){
    return (lng2px(p.lng,z)-left).toFixed(1)+' '+(lat2px(p.lat,z)-top).toFixed(1)}).join(' L');
  h+='<path d="'+d+'" fill="none" stroke="#2DD4BF" stroke-width="2" stroke-dasharray="7 5" opacity="0.75"/>';
 });
 h+='</svg>';
 /* markers */
 pts.forEach(function(p){
  var jobs=db.jobs.filter(function(j){return j.prop===p.name&&j.status!=='cancelled'});
  var col=jobs.some(function(j){return j.status==='problem'})?'#E5484D':
          jobs.some(function(j){return j.status==='progress'})?'#2DD4BF':
          jobs.length?'#E4E9EF':'#7E8794';
  var x=lng2px(p.lng,z)-left,y=lat2px(p.lat,z)-top;
  if(x<-40||x>W_MAP+40||y<-40||y>H_MAP+40)return;
  var tip=p.name+(jobs.length?' — '+jobs.map(function(j){return j.time+' '+cleaner(j.cleaner).name}).join(', '):'');
  h+='<a href="'+navLink(p)+'" target="_blank" rel="noopener" title="'+esc(tip)+'" '+
   'style="position:absolute;left:'+x+'px;top:'+y+'px;transform:translate(-50%,-50%);text-decoration:none">'+
   '<span style="display:block;width:13px;height:13px;border-radius:50%;background:'+col+
   ';border:2px solid #0C0F13;box-shadow:0 0 0 3px rgba(12,15,19,.55)"></span>'+
   '<span style="position:absolute;left:50%;top:-20px;transform:translateX(-50%);white-space:nowrap;'+
   'font-size:10.5px;color:#E4E9EF;background:rgba(12,15,19,.78);padding:1px 5px;border-radius:3px">'+
   esc(p.name.split('—')[0].trim())+'</span></a>';
 });
 crewPos.forEach(function(cp){
  var x=lng2px(cp.lng,z)-left,y=lat2px(cp.lat,z)-top;
  h+='<span title="'+esc(cp.c.name)+'" style="position:absolute;left:'+x+'px;top:'+y+'px;'+
   'transform:translate(-50%,-50%);width:13px;height:13px;border-radius:50%;background:#C9A227;'+
   'border:2px solid #0C0F13;box-shadow:0 0 0 6px rgba(201,162,39,.22)"></span>';
 });
 /* controls + attribution */
 h+='<div style="position:absolute;top:9px;'+(uiDir()==='rtl'?'left':'right')+':9px;display:flex;flex-direction:column;gap:4px">'+
  '<button class="btn ghost" style="background:rgba(12,15,19,.8);padding:4px 9px" onclick="zoomBy(1)">+</button>'+
  '<button class="btn ghost" style="background:rgba(12,15,19,.8);padding:4px 9px" onclick="zoomBy(-1)">&minus;</button>'+
  '<button class="btn ghost" style="background:rgba(12,15,19,.8);padding:4px 6px;font-size:10px" onclick="resetMap()">fit</button></div>';
 h+='<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(12,15,19,.72);'+
  'font-size:9.5px;color:#8B95A5;padding:2px 7px">&copy; OpenStreetMap contributors &middot; z'+z+'</div>';
 return h+'</div>';
}
function setMapMode(m){mapMode=m;render()}
function pickG(name){gPick=name;render()}
function gEmbed(p,z){
 return 'https://www.google.com/maps?q='+p.lat+','+p.lng+'&z='+(z||15)+'&output=embed';
}
function gRoute(cid){
 var stops=db.jobs.filter(function(j){return j.cleaner===cid&&j.status!=='cancelled'})
  .sort(function(a,b){return a.time.localeCompare(b.time)})
  .map(function(j){return property(j.prop)}).filter(function(p){return p&&p.lat});
 if(stops.length<2)return null;
 var o=stops[0],d=stops[stops.length-1],mid=stops.slice(1,-1);
 var url='https://www.google.com/maps/dir/?api=1&travelmode=driving'+
  '&origin='+o.lat+','+o.lng+'&destination='+d.lat+','+d.lng;
 if(mid.length)url+='&waypoints='+mid.map(function(p){return p.lat+','+p.lng}).join('%7C');
 return url;
}
function routeLinks(){
 var h='';
 crew().forEach(function(c){
  var url=gRoute(c.id);
  if(!url)return;
  var n=db.jobs.filter(function(j){return j.cleaner===c.id&&j.status!=='cancelled'}).length;
  h+='<div class="row"><div class="av">'+c.initials+'</div><div class="grow">'+
   '<div class="name">'+esc(c.name)+'</div><div class="meta"><span>'+n+' '+u('stops')+'</span></div></div>'+
   '<a class="wa" href="'+url+'" target="_blank" rel="noopener">'+ic('pin')+u('m_gday')+'</a>'+
   '<a class="wa" href="'+wa(c.phone,url)+'" target="_blank" rel="noopener">'+ic('wa')+u('m_sendroute')+'</a></div>';
 });
 return h?('<div class="card"><div class="card-h">'+ic('pin')+'<h3>'+u('m_routes')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('m_routenote')+'</span></div></div>'+h+'</div>'):'';
}


/* ---- pin a location anywhere: search, current position, or coordinates ---- */
function useMyLocation(){
 var p=db.props[open.idx];if(!p)return;
 if(!navigator.geolocation){toast(u('m_nogeo'));return}
 toast(u('m_gettingpos'));
 navigator.geolocation.getCurrentPosition(function(pos){
  p.lat=pos.coords.latitude;p.lng=pos.coords.longitude;
  save();render();toast(u('m_pinned')+' '+p.lat.toFixed(5)+', '+p.lng.toFixed(5));
 },function(){toast(u('m_denied'))},{enableHighAccuracy:true,timeout:12000});
}
function setCoords(){
 var p=db.props[open.idx];if(!p)return;
 var raw=(document.getElementById('x-coords')?document.getElementById('x-coords').value:'').trim();
 var m=raw.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
 if(!m){toast(u('m_badcoords'));return}
 var la=parseFloat(m[1]),ln=parseFloat(m[2]);
 if(la<-90||la>90||ln<-180||ln>180){toast(u('m_badcoords'));return}
 p.lat=la;p.lng=ln;save();render();toast(u('m_pinned')+' '+la.toFixed(5)+', '+ln.toFixed(5));
}
function clearCoords(){
 var p=db.props[open.idx];if(!p)return;
 p.lat=null;p.lng=null;save();render();toast(u('m_cleared'));
}
function geocode(q,cb){
 geoQueue.push([q,cb]);
 if(geoBusy)return;
 geoBusy=true;
 (function next(){
  if(!geoQueue.length){geoBusy=false;return}
  var item=geoQueue.shift();
  fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(item[0]))
   .then(function(r){return r.json()})
   .then(function(d){item[1](d&&d[0]?{lat:parseFloat(d[0].lat),lng:parseFloat(d[0].lon)}:null)})
   .catch(function(){item[1](null)})
   .then(function(){setTimeout(next,1100)});   /* 1 req/sec, their rule */
 })();
}
function findOnMap(){
 var p=db.props[open.idx];if(!p)return;
 var typed=(document.getElementById('x-addr')?document.getElementById('x-addr').value.trim():'');
 var q=typed||(p.name+', '+(p.area||''));
 toast(u('m_searching'));
 geocode(q,function(r){
  if(r){place(r);return}
  /* nothing? widen the search with the country before giving up */
  geocode(q+', '+(COUNTRIES[S().country]||{name:''}).name,function(r2){
   if(!r2){toast(u('m_notfound'));return}
   place(r2);
  });
 });
 function place(r){
  p.lat=r.lat;p.lng=r.lng;save();render();
  toast(u('m_found')+' '+r.lat.toFixed(5)+', '+r.lng.toFixed(5));
 }
}
function geocodeAll(){
 var todo=db.props.filter(function(p){return !p.lat});
 if(!todo.length){toast(u('m_allplaced'));return}
 toast(u('m_placing')+' '+todo.length);
 var done=0;
 todo.forEach(function(p){
  geocode(p.name+', '+(p.area||'')+', '+(COUNTRIES[S().country]||{name:''}).name,function(r){
   if(r){p.lat=r.lat;p.lng=r.lng}
   done++;
   if(done===todo.length){save();render();toast(u('m_placed'))}
  });
 });
}
function bounds(pts){
 var la=pts.map(function(p){return p.lat}),ln=pts.map(function(p){return p.lng});
 var minLa=Math.min.apply(null,la),maxLa=Math.max.apply(null,la);
 var minLn=Math.min.apply(null,ln),maxLn=Math.max.apply(null,ln);
 var padLa=(maxLa-minLa)*0.15||0.01,padLn=(maxLn-minLn)*0.15||0.01;
 return {minLa:minLa-padLa,maxLa:maxLa+padLa,minLn:minLn-padLn,maxLn:maxLn+padLn};
}
function mapsLink(p){return 'https://www.google.com/maps/search/?api=1&query='+p.lat+','+p.lng}
function navLink(p){return 'https://www.google.com/maps/dir/?api=1&destination='+p.lat+','+p.lng+'&travelmode=driving'}
function shareLocation(on){
 var c=cleaner(session.id);
 if(!on){ if(watchId!==null&&navigator.geolocation.clearWatch)navigator.geolocation.clearWatch(watchId);
  watchId=null; toast(u('m_stopped')); render(); return; }
 if(!navigator.geolocation){toast(u('m_nogeo'));return}
 watchId=navigator.geolocation.watchPosition(function(pos){
   for(var i=0;i<db.cleaners.length;i++)if(db.cleaners[i].id===session.id)
     db.cleaners[i].pos={lat:pos.coords.latitude,lng:pos.coords.longitude,at:Date.now()};
   save();
 },function(){toast(u('m_denied'))},{enableHighAccuracy:true,maximumAge:30000,timeout:12000});
 toast(u('m_sharing'));render();
}

/* auto messages, written in the recipient's own language */
function msgFor(kind,o){
 o=o||{};
 var L=o.c?(o.c.lang||'en'):uiLang, D=T[L]||T.en;
 var co=db.company;
 if(kind==='day'){
  var mine=db.jobs.filter(function(j){return j.cleaner===o.c.id&&j.status!=='cancelled'})
   .sort(function(a,b){return a.time.localeCompare(b.time)});
  return D.today+' — '+o.c.name.split(' ')[0]+'\n'+
   mine.map(function(j){var p=property(j.prop);
    return j.time+'  '+j.prop+(p&&p.key?'\n   '+D.access+': '+p.key:'')}).join('\n')+
   '\n\n'+co;
 }
 if(kind==='where')return (T[(o.c&&o.c.lang)||'en']||T.en).today+' — '+
   ((o.c&&o.c.lang==='ar')?'أين أنت الآن؟':(o.c&&o.c.lang==='ur')?'آپ اس وقت کہاں ہیں؟':
    (o.c&&o.c.lang==='hi')?'आप अभी कहाँ हैं?':(o.c&&o.c.lang==='tl')?'Nasaan ka na?':'Where are you right now?');
 if(kind==='onway')return (o.name||'')+' — '+D.onway+'. '+co;
 if(kind==='late')return (o.name||'')+' — '+
   ((uiLang==='ar')?('نعتذر، سيتأخر الفريق حوالي '+(o.mins||15)+' دقيقة.'):
    ('Sorry — the team is running about '+(o.mins||15)+' minutes late.'))+' '+co;
 if(kind==='done'){var j=o.job,ps=jobPhotos(j).length,cl=checklistFor(j);
  return (uiLang==='ar'?
   (co+'\n'+j.prop+'\nانتهى في '+hhmm(j.finished)+' ('+dur(j.started,j.finished)+')\n'+
    j.checked.length+' من '+cl.length+' بنود · '+ps+' صور'):
   (co+'\n'+j.prop+'\nFinished '+hhmm(j.finished)+' ('+dur(j.started,j.finished)+')\n'+
    j.checked.length+' of '+cl.length+' items · '+ps+' photos'));
 }
 if(kind==='invoice'){var iv=db.invoices.filter(function(x){return x.id===o.id})[0];return iv?payMessage(iv):co+'\n'+o.id+' — '+o.amount}
 if(kind==='quote')return co+'\n'+(o.text||'');
 return co;
}
function messageBox(job){open={type:'messages',job:job};render()}


/* ============================================================
   Metrics. What a manager checks on a Sunday, and what an
   investor asks for. Same numbers.
   ============================================================ */
function stats(){
 var js=db.jobs, live=js.filter(function(j){return j.status!=='cancelled'});
 var done=js.filter(function(j){return j.status==='done'});
 var cancelled=js.filter(function(j){return j.status==='cancelled'});
 var disputed=js.filter(function(j){return j.disputed});
 var rework=js.filter(function(j){return j.rework});
 var withPhotos=done.filter(function(j){return (j.photos||[]).length>=TIERS[j.tier||'standard'].photos});
 var onTime=done.filter(function(j){return j.started&&j.started<=todayAt(j.time)+15*MIN});
 /* a job left running all night is a data-entry mistake, not a 14-hour clean */
 var timed=done.filter(function(j){
  if(!j.started||!j.finished)return false;
  var m=(j.finished-j.started)/MIN;return m>0&&m<=600;
 });
 var mins=timed.reduce(function(a,j){return a+(j.finished-j.started)/MIN},0);
 var skipped=done.length-timed.length;
 var booked=live.reduce(function(a,j){return a+j.price},0);
 var taskRev=db.tasks.filter(function(x){return x.status==='done'}).reduce(function(a,x){return a+x.fee},0);
 var cxFees=cancelled.reduce(function(a,j){return a+((j.cancel&&j.cancel.fee)||0)},0);
 var collected=db.invoices.reduce(function(a,v){return a+invPaid(v)},0);
 var credited=db.invoices.reduce(function(a,v){return a+invCredits(v)},0);
 var outstanding=db.invoices.reduce(function(a,v){return a+Math.max(0,invDue(v))},0);
 var mrr=db.contracts.reduce(function(a,r){return a+r.price*r.days.length*(r.freq==='weekly'?4.33:2.17)},0);
 var supplies=done.reduce(function(a,j){return a+jobSupplyCost(j)},0);
 var labour=done.reduce(function(a,j){return a+labourCost(j)},0);
 var exp=expenseTotal();
 var profit=Math.round((booked+taskRev+cxFees-labour-supplies-exp)*100)/100;
 var prem=live.filter(function(j){return j.tier==='premium'});
 return {
  jobs:live.length,done:done.length,cancelled:cancelled.length,
  completion:live.length?Math.round(done.length/live.length*100):0,
  onTime:done.length?Math.round(onTime.length/done.length*100):0,
  avgMins:timed.length?Math.round(mins/timed.length):0,skippedLong:skipped,
  photoOk:done.length?Math.round(withPhotos.length/done.length*100):0,
  disputes:disputed.length,disputeRate:done.length?Math.round(disputed.length/done.length*100):0,
  rework:rework.length,
  booked:booked,taskRev:taskRev,cxFees:cxFees,collected:collected,credited:credited,
  outstanding:outstanding,mrr:mrr,
  supplies:supplies,stockValue:stockValue(),labour:labour,expenses:exp,profit:profit,
  margin:(booked+taskRev+cxFees)?Math.round(profit/(booked+taskRev+cxFees)*100):0,
  premShare:live.length?Math.round(prem.length/live.length*100):0,
  avgJob:live.length?booked/live.length:0
 };
}
function archiveOld(){
 snapshot(u('ar_title'));
 if(!managerOnly())return;
 var cut=addDays(todayStr(),-90);
 var old=db.jobs.filter(function(j){return jobDate(j)<cut&&(j.status==='done'||j.status==='cancelled')});
 if(!old.length){toast(u('ar_none'));return}
 if(!confirm(old.length+' '+u('ar_confirm')))return;
 /* export first so nothing is lost */
 var rows=[['Job','Date','Property','Customer','Service','Cleaner','Started','Finished','Price','Status']];
 old.forEach(function(j){rows.push([j.id,jobDate(j),j.prop,j.customer,j.service,
   j.cleaner?cleaner(j.cleaner).name:'',hhmm(j.started),hhmm(j.finished),j.price,j.status])});
 var csv=rows.map(function(r){return r.map(function(c){var x=String(c);
  return /[",]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x}).join(',')}).join('\n');
 try{var b=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(b),a2=document.createElement('a');
  a2.href=url;a2.download='archive-'+todayStr()+'.csv';document.body.appendChild(a2);a2.click();
  document.body.removeChild(a2);setTimeout(function(){URL.revokeObjectURL(url)},1200)}catch(e){}
 var ids={};old.forEach(function(j){ids[j.id]=1;(j.photos||[]).forEach(function(p){delete photos[p.id]})});
 db.jobs=db.jobs.filter(function(j){return !ids[j.id]});
 save();render();toast(old.length+' '+u('ar_done'));
}
function exportMetrics(){
 var m=stats(),rows=[['Metric','Value']];
 [['Jobs',m.jobs],['Completed',m.done],['Cancelled',m.cancelled],['Completion %',m.completion],
  ['On time %',m.onTime],['Average minutes on site',m.avgMins],['Photo compliance %',m.photoOk],
  ['Disputes',m.disputes],['Dispute rate %',m.disputeRate],['Free re-cleans',m.rework],
  ['Booked',Math.round(m.booked)],['Quick task revenue',Math.round(m.taskRev)],
  ['Cancellation fees',Math.round(m.cxFees)],['Collected',Math.round(m.collected)],
  ['Credited back',Math.round(m.credited)],['Outstanding',Math.round(m.outstanding)],
  ['Recurring per month',Math.round(m.mrr)],['Supplies consumed',Math.round(m.supplies)],['Stock on hand',Math.round(m.stockValue)],['Premium share %',m.premShare],
  ['Average job value',Math.round(m.avgJob)]].forEach(function(r){rows.push(r)});
 var csv=rows.map(function(r){return r.join(',')}).join('\n');
 try{var b=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(b),a2=document.createElement('a');
  a2.href=url;a2.download='metrics-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(a2);a2.click();document.body.removeChild(a2);
  setTimeout(function(){URL.revokeObjectURL(url)},1200);toast(u('st_exported'))}
 catch(e){open={type:'csv',csv:csv};render()}
}

/* ---------------- cleaner ---------------- */

/* what is coming next for this cleaner, so a new job shows up straight away */
function upcomingFor(me){
 var later=db.jobs.filter(function(j){
   return teamOf(j).indexOf(me)>-1&&j.status==='sched'&&jobDate(j)>todayStr();
 }).sort(function(a,b){return (jobDate(a)+a.time).localeCompare(jobDate(b)+b.time)});
 var d=T[lang]||T.en;
 if(!later.length)return '';
 var h='<div class="card" style="max-width:380px;margin:12px auto 0"><div class="card-h">'+ic('clock')+
  '<h3>'+d.coming+'</h3></div>';
 later.slice(0,8).forEach(function(j){
  var p=property(j.prop);
  h+='<div class="row"><span class="dot"></span><div class="grow">'+
   '<div class="name">'+esc(j.prop)+'</div><div class="meta"><span>'+dayName(jobDate(j))+'</span>'+
   '<span>'+j.time+'</span><span>'+esc(svc(j.service))+'</span></div></div>'+
   (p&&p.lat?'<a class="wa" href="'+navLink(p)+'" target="_blank" rel="noopener">'+ic('pin')+'</a>':'')+'</div>';
 });
 return h+'</div>';
}


/* what this cleaner has actually worked */
function myHours(){
 var me=session.id,d=T[lang]||T.en;
 var week=[];for(var i=0;i<7;i++)week.push(addDays(todayStr(),-i));
 var mine=shifts().filter(function(x){return x.by===me&&week.indexOf(x.date)>-1})
  .sort(function(a,b){return (b.date+String(b.in)).localeCompare(a.date+String(a.in))});
 var total=mine.reduce(function(a,x){return a+hrs(x.in,x.out||Date.now())},0);
 var paid=total*(cleaner(me).rate||0);
 var h='<div class="card" style="max-width:380px;margin:12px auto 0" dir="'+d.dir+'"><div class="card-h">'+ic('clock')+
  '<h3>'+d.myhours+'</h3><div class="right"><span class="mono" style="color:var(--teal)">'+total.toFixed(1)+'h</span></div></div>';
 if(!mine.length)h+='<div class="empty"><b>'+d.nohours+'</b>'+d.nohourssub+'</div>';
 else {
  var byDay={};
  mine.forEach(function(x){(byDay[x.date]=byDay[x.date]||[]).push(x)});
  Object.keys(byDay).sort().reverse().forEach(function(date){
   var day=byDay[date];
   var dt=day.reduce(function(a,x){return a+hrs(x.in,x.out||Date.now())},0);
   h+='<div class="row"><span class="dot'+(day.some(function(x){return !x.out})?' run':'')+'"></span>'+
    '<div class="grow"><div class="name">'+dayName(date)+'</div><div class="meta">'+
    day.map(function(x){return '<span>'+d.inat+' '+hhmm(x.in)+
      (x.inAt?' '+d.pinned:'')+' · '+(x.out?d.outat+' '+hhmm(x.out):d.stillon)+'</span>'}).join('')+
    '</div></div><span class="mono">'+dt.toFixed(1)+'h</span></div>';
  });
  h+='<div class="row"><div class="grow"><div class="name" style="font-weight:400">'+d.thisweek+'</div>'+
   '<div class="meta"><span>'+(cleaner(me).rate||0)+'/h</span></div></div>'+
   '<span class="mono" style="color:var(--teal)">'+aed(paid)+'</span></div>';
 }
 h+='</div>';
 /* time spent on jobs, which is a different number */
 var jobsDone=db.jobs.filter(function(j){return teamOf(j).indexOf(me)>-1&&j.finished&&week.indexOf(jobDate(j))>-1});
 if(jobsDone.length){
  var jh=jobsDone.reduce(function(a,j){return a+hrs(j.started,j.finished)},0);
  h+='<div class="card" style="max-width:380px;margin:12px auto 0" dir="'+d.dir+'"><div class="card-h">'+ic('list')+
   '<h3>'+d.onjobs+'</h3><div class="right"><span class="mono">'+jh.toFixed(1)+'h</span></div></div>';
  jobsDone.slice(0,10).forEach(function(j){
   h+='<div class="row"><span class="dot"></span><div class="grow"><div class="name">'+esc(j.prop)+'</div>'+
    '<div class="meta"><span>'+dayName(jobDate(j))+'</span><span>'+hhmm(j.started)+' – '+hhmm(j.finished)+'</span></div></div>'+
    '<span class="mono">'+dur(j.started,j.finished)+'</span></div>';
  });
  h+='</div>';
 }
 return h;
}
function msgs(){db.msgs=db.msgs||[];return db.msgs}
function myId(){return session.role==='cleaner'?session.id:session.role==='customer'?session.id:'office'}
function threadKey(a,b){return [a,b].sort().join('|')}
function threadsFor(){
 var me=myId(),seen={},out=[];
 if(session.role==='manager'){
  crew().forEach(function(c){seen[c.id]=1;out.push({id:c.id,name:c.name,initials:c.initials})});
  customers().forEach(function(cu){out.push({id:cu.id,name:cu.name,
   initials:cu.name.split(' ').map(function(w){return w[0]}).join('').slice(0,2)})});
 } else out.push({id:'office',name:db.company,initials:'OF'});
 return out;
}
function threadMsgs(other){
 var me=myId(),k=threadKey(me,other);
 return msgs().filter(function(m){return threadKey(m.from,m.to)===k})
   .sort(function(a,b){return a.at-b.at});
}
function unreadFrom(other){
 var me=myId();
 return msgs().filter(function(m){return m.to===me&&m.from===other&&!m.read}).length;
}
function unreadTotal(){
 var me=myId();
 return msgs().filter(function(m){return m.to===me&&!m.read}).length;
}
function openThread(id){
 thread=id;draft='';
 var me=myId();
 msgs().forEach(function(m){if(m.to===me&&m.from===id)m.read=true});
 save();render();
}
function setDraft(v){draft=v}
function sendMsg(){
 var txt=(draft||'').trim();
 if(!txt||!thread)return;
 msgs().push({id:'m'+Date.now()+Math.floor(Math.random()*99),at:Date.now(),
  from:myId(),to:thread,text:txt,read:false});
 if(msgs().length>400)db.msgs=msgs().slice(-400);
 draft='';save();render();
}
function quickInsert(kind){
 var c=thread&&thread!=='customer'&&thread!=='office'?cleaner(thread):null;
 var j=db.jobs.filter(function(x){return c?x.cleaner===c.id:true})[0];
 if(kind==='day'&&c)draft=msgFor('day',{c:c});
 else if(kind==='where'&&c)draft=msgFor('where',{c:c});
 else if(kind==='onway'&&j)draft=msgFor('onway',{name:j.prop});
 else if(kind==='late'&&j)draft=msgFor('late',{name:j.prop,mins:20});
 else if(kind==='done'&&j&&j.finished)draft=msgFor('done',{job:j});
 render();
}


/* ---- open jobs: unassigned work any free cleaner can take ---- */
function openJobs(){return db.jobs.filter(function(j){return !j.cleaner&&j.status==='sched'&&jobDate(j)>=todayStr()})}
function claimJob(id){
 var j=job(id);if(!j)return;
 if(j.cleaner){toast(u('p_taken'));return}
 var c=cleaner(session.id);
 if(TIERS[j.tier||'standard'].requiresSenior&&!c.senior){toast(u('p_seniorsonly'));return}
 j.cleaner=session.id;
 notify('claimed',{a:c.name.split(' ')[0],p:j.prop});
 save();pushNow();render();toast(u('p_claimed'));
}
function reassign(id){open={type:'assign',job:id};render()}
function doAssign(v){
 var j=job(open.job);if(!j)return;
 j.cleaner=v||null;
 notify('assigned',{p:j.prop,a:v?cleaner(v).name.split(' ')[0]:u('p_unassigned')});
 if(v)sendPush('assigned',u('ps_newjob')+' '+j.prop+' — '+dayName(jobDate(j))+' '+j.time,v);
 open=null;save();render();toast(v?u('p_assigned'):u('p_pooled'));
}


/* ---- customers ---- */
function customers(){db.customers=db.customers||[];return db.customers}
function customerById(id){var f=customers().filter(function(c){return c.id===id})[0];return f||null}
function customerByName(n){var f=customers().filter(function(c){return c.name===n})[0];return f||null}
function myCustomer(){
 if(!session||session.role!=='customer')return null;
 return customerById(session.id)||customers()[0]||null;
}
function customerName(){var c=myCustomer();return c?c.name:''}
function custJobs(name){return db.jobs.filter(function(j){return j.customer===name})}
function custOutstanding(name){
 return db.invoices.filter(function(v){return v.customer===name})
  .reduce(function(a,v){return a+Math.max(0,invDue(v))},0);
}
function addCustomer(){open={type:'customer'};render()}
function saveCustomer(){
 var n=document.getElementById('cu-name').value.trim();
 if(!n){toast(u('cu_needname'));return}
 customers().push({id:'cu'+Date.now(),name:n,
  contact:document.getElementById('cu-contact').value.trim(),
  phone:document.getElementById('cu-phone').value.trim().replace(/[^0-9]/g,''),
  email:document.getElementById('cu-email').value.trim()});
 open=null;save();render();toast(u('cu_added'));
}
function removeCustomer(id){
 snapshot(u('cu_title'));
 if(!managerOnly())return;
 var c=customerById(id);if(!c)return;
 if(custJobs(c.name).length){toast(u('cu_hasjobs'));return}
 db.customers=customers().filter(function(x){return x.id!==id});
 save();render();toast(u('st_removed'));
}
function photoAreas(j){
 var by={};
 (j.photos||[]).forEach(function(p){var k=p.area||'other';by[k]=(by[k]||0)+1});
 return by;
}
function coverageGaps(j){
 var by=photoAreas(j),need=['kitchen','bathrooms'],gaps=[];
 need.forEach(function(k){if(!by[k])gaps.push(k)});
 return gaps;
}
function setShotArea(a){shotArea=a;render()}

/* ---- job not done right ---- */
function raiseDispute(id,reason){
 var j=job(id);if(!j)return;
 j.disputed={at:Date.now(),reason:reason||'',state:'open'};
 db.issues.unshift({id:db.seqIssue++,job:j.id,prop:j.prop,by:j.cleaner,type:'customer',
  note:(reason||u('q_notright')),at:Date.now(),priority:'High',open:true,photo:null});
 notify('dispute',{p:j.prop});
 save();pushNow();render();toast(u('q_raised'));
}
function customerDispute(id){
 var why=prompt(u('q_whatwrong'));
 if(why===null)return;
 raiseDispute(id,why);
 open=null;render();
}
function bookRework(id){
 var j=job(id);if(!j)return;
 db.jobs.push({id:db.seqJob++,prop:j.prop,customer:j.customer,service:j.service,tier:j.tier||'standard',
  cleaner:j.cleaner,time:j.time,price:0,status:'sched',started:null,finished:null,checked:[],photos:[],
  rating:0,signed:false,onWay:null,geo:null,rework:j.id});
 if(j.disputed)j.disputed.state='rework';
 notify('rework',{p:j.prop});
 open=null;save();pushNow();render();toast(u('q_reworked'));
}
function closeDispute(id,outcome){
 var j=job(id);if(!j||!j.disputed)return;
 j.disputed.state=outcome;
 db.issues.forEach(function(i){if(i.job===j.id&&i.open)i.open=false});
 save();render();toast(u('q_closed'));
}

/* ---- cancellation ---- */
function cancelPolicy(j){
 if(!j)return {pct:0,label:"—"};
 var mins=Math.round((todayAt(j.time)-Date.now())/MIN);
 if(j.status==='done')return {pct:100,label:u('cx_after')};
 if(j.status==='progress')return {pct:100,label:u('cx_started')};
 if(mins>=24*60)return {pct:0,label:u('cx_free')};
 if(mins>=120)return {pct:50,label:u('cx_late')};
 return {pct:100,label:u('cx_verylate')};
}
function cancelJob(id){
 if(session&&session.role==='customer'){askCancel(id);return}
 open={type:'cancel',job:id};render();
}
function askCancel(id){
 var j=job(id);if(!j)return;
 var why=prompt(u('cr_why'));
 if(why===null)return;
 db.issues=db.issues||[];
 db.issues.unshift({id:'CR'+Date.now(),job:j.id,prop:j.prop,by:session.id,type:'cancelreq',
  note:why.trim()||u('cr_default'),at:Date.now(),priority:'High',open:true,photo:null});
 msgs().push({id:'m'+Date.now()+Math.floor(Math.random()*99),at:Date.now(),from:myId(),to:'office',
  text:u('cr_msg')+' '+j.prop+' — '+dayName(jobDate(j))+' '+j.time+(why.trim()?' — '+why.trim():''),read:false});
 notify('cancelreq',{p:j.prop});
 save();pushNow();render();toast(u('cr_sent'));
}
function doCancel(){
 if(!managerOnly())return;
 snapshot(u('cx_title'));
 var j=job(open.job);if(!j)return;
 var pol=cancelPolicy(j);
 var why=document.getElementById('cx-why')?document.getElementById('cx-why').value.trim():'';
 var charge=Math.round(j.price*pol.pct/100);
 j.status='cancelled';j.cancel={at:Date.now(),reason:why,pct:pol.pct,fee:charge};
 notify('cancelled',{p:j.prop,m:charge?aed(charge):u('cx_nofee')});
 open=null;save();render();
 toast(charge?u('cx_charged')+' '+aed(charge):u('cx_nocharge'));
}

/* ---- refunds and credit notes ---- */
function refund(invId){open={type:'refund',inv:invId};render()}
function doRefund(){
 if(!managerOnly())return;
 var v=null;db.invoices.forEach(function(x){if(x.id===open.inv)v=x});
 if(!v)return;
 var amt=parseInt(document.getElementById('rf-amt').value||'0',10);
 if(amt<=0){toast(u('rf_amount'));return}
 v.credits=v.credits||[];
 v.credits.push({amt:amt,reason:document.getElementById('rf-why').value.trim()||'—',
  at:Date.now(),ref:'CN-'+(v.credits.length+1)+'-'+v.id.slice(-4)});
 notify('refund',{m:aed(amt),c:v.customer});
 open=null;save();render();toast(u('rf_done')+' '+aed(amt));
}
function invCredits(v){return (v.credits||[]).reduce(function(a,c){return a+c.amt},0)}
function applyCountry(cc){
 var keep=document.getElementById('s-taxid')?document.getElementById('s-taxid').value.trim():S().taxId;
 var phone=document.getElementById('s-phone')?document.getElementById('s-phone').value.trim():S().officePhone;
 db.settings=settingsFor(cc,keep,phone);
 save();render();toast(COUNTRIES[cc].name+' — '+money(1234)+', '+taxLabel()+'.');
}
function saveRegion(){
 if(!managerOnly())return;
 var st=S();
 st.currency=document.getElementById('s-cur').value.trim().toUpperCase()||st.currency;
 st.taxLabel=document.getElementById('s-taxlabel').value.trim()||st.taxLabel;
 st.taxRate=Math.max(0,parseFloat(document.getElementById('s-taxrate').value||'0'))/100;
 st.idLabel=document.getElementById('s-idlabel').value.trim()||st.idLabel;
 st.taxId=document.getElementById('s-taxid').value.trim();
 st.officePhone=document.getElementById('s-phone').value.trim().replace(/[^0-9]/g,'');
 if(document.getElementById('s-memail'))st.managerEmail=document.getElementById('s-memail').value.trim();
 if(document.getElementById('s-cemail'))st.customerEmail=document.getElementById('s-cemail').value.trim();
 st.weekStart=parseInt(document.getElementById('s-week').value,10)||0;
 db.settings=st;save();render();toast('Saved. '+money(1234)+' · '+taxLabel()+'.');
}
function exportAll(){
 var blobData=JSON.stringify({exported_at:new Date().toISOString(),company:db.company,
  settings:S(),data:db,photos:photos},null,1);
 try{var b=new Blob([blobData],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download=(db.company||'company').replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'-export.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(u)},1500);toast('Exported. Everything, including photos.')}
 catch(e){toast('Export failed on this browser.')}
}
function eraseAll(){
 if(!managerOnly())return;
 if(!confirm('Delete all data permanently? This cannot be undone.'))return;
 if(!confirm('Last check. Everything on this device will be gone.'))return;
 try{localStorage.removeItem(KEY);localStorage.removeItem(PKEY)}catch(e){}
 db=emptyDb('My company',S().country);photos={};save();
 session=null;open=null;tab='today';render();toast(u('st_deleted'));
}
function inviteRows(){
 var list=[['manager',null,'Layla Mansour',S().officePhone]];
 crew().forEach(function(c){list.push(['cleaner',c.id,c.name,c.phone])});
 list.push(['customer',null,'Marina Heights Tower',S().officePhone]);
 var h='';
 list.forEach(function(x){
  var role=x[0],id=x[1],name=x[2],phone=x[3],key=id||role;
  var link=inviteLink(role,id);
  h+='<div class="row"><div class="av">'+esc(name.split(' ').map(function(w){return w[0]}).join('').slice(0,2))+'</div>'+
   '<div class="grow"><div class="name">'+esc(name)+'<span class="pill">'+u('l_'+role)+'</span>'+
   (hasPin(key)?'<span class="pill prem">'+u('a_pin')+' ••••</span>':'')+'</div>'+
   '<div class="meta"><span>'+(hasPin(key)?'':'<span style="color:var(--amber)">'+u('a_setpinfirst')+'</span>')+'</span></div></div>'+
   '<button class="btn ghost" onclick="setPin(\''+key+'\')">'+u('a_pin')+'</button>'+
   '<button class="btn ghost" onclick="copyInvite(\''+role+'\',\''+(id||'')+'\')">'+u('a_copy')+'</button>'+
   (phone?'<a class="wa" href="'+wa(phone,link)+'" target="_blank" rel="noopener">'+ic('wa')+u('a_send')+'</a>':'')+
   '</div>';
 });
 return h;
}
function copyInvite(role,id){
 var link=inviteLink(role,id||null);
 try{
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link);toast(u('a_copied'))}
  else{open={type:'link',link:link};render()}
 }catch(e){open={type:'link',link:link};render()}
}
function saveCompany(){
 if(!managerOnly())return;
 var n=document.getElementById('s-co').value.trim();
 if(!n){toast('The company needs a name.');return}
 db.company=n;db.trn=document.getElementById('s-trn').value.trim();
 save();render();toast('Saved. Their name is on every screen now.');
}
function addCleaner(){open={type:'cleaner'};render()}
function saveCleaner(){
 var n=document.getElementById('c-name').value.trim();
 if(!n){toast('Name?');return}
 var parts=n.split(' ');
 db.cleaners.push({id:'c'+Date.now(),name:n,
  initials:(parts[0][0]+(parts[1]?parts[1][0]:'')).toUpperCase(),
  phone:document.getElementById('c-phone').value.trim().replace(/[^0-9]/g,''),
  email:(document.getElementById('c-email')?document.getElementById('c-email').value.trim():''),
  done:0,rating:0,onTime:100,lang:(T[document.getElementById('c-lang').value]?document.getElementById('c-lang').value:'en'),
  rate:parseInt(document.getElementById('c-rate').value||'22',10),
  senior:document.getElementById('c-senior').checked});
 open=null;save();render();toast(n+' added.');
}
function removeCleaner(i){
 snapshot(u('nav_team'));
 var c=crew()[i];if(!c)return;
 if(db.jobs.some(function(j){return j.cleaner===c.id&&j.status!=='done'&&j.status!=='cancelled'})){
  toast('They still have open jobs. Reassign those first.');return}
 db.cleaners.splice(i,1);save();render();toast(u('st_removed'));
}
function splitCsvLine(line){
 var out=[],cur='',q=false;
 for(var i=0;i<line.length;i++){var ch=line[i];
  if(q){if(ch==='"'){if(line[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}
  else{if(ch==='"')q=true;else if(ch===','){out.push(cur);cur=''}else cur+=ch}}
 out.push(cur);return out.map(function(x){return x.trim()});
}
function importCsv(ev){
 var f=ev.target.files&&ev.target.files[0];if(!f)return;
 var rd=new FileReader();
 rd.onload=function(e){
  var lines=String(e.target.result).split(/\r?\n/).filter(function(l){return l.trim()});
  if(!lines.length){toast('That file is empty.');return}
  if(/name/i.test(lines[0])&&/area|address/i.test(lines[0]))lines.shift();
  var added=0,skipped=0;
  lines.forEach(function(l){
   var c=splitCsvLine(l);
   if(!c[0]){skipped++;return}
   if(db.props.some(function(p){return p.name===c[0]})){skipped++;return}
   db.props.push({name:c[0],area:c[1]||'',lat:null,lng:null,
    key:c[2]||'',park:c[3]||'',wifi:c[4]||'—',alarm:c[5]||'—',note:c[6]||''});
   added++});
  save();render();
  toast(added+' propert'+(added===1?'y':'ies')+' imported'+(skipped?', '+skipped+' skipped':'')+'.');
 };
 rd.onerror=function(){toast('Could not read that file.')};
 rd.readAsText(f);ev.target.value='';
}
function sampleCsv(){
 var csv='name,area,access key,parking,wifi,alarm,note\n'+
 'Marina Gate 2 — 1204,Dubai Marina,Concierge desk,B2 bay 47,MG2 / marina2024,,Cat inside\n'+
 'Palm Villa Frond K-12,Palm Jumeirah,Lockbox code 4417,Driveway,,Disarm 8890,Pool not included\n';
 try{var b=new Blob([csv],{type:'text/csv'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download='properties-template.csv';document.body.appendChild(a);a.click();
  document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(u)},1200);toast('Template downloaded.')}
 catch(e){open={type:'csv',csv:csv};render()}
}
function resetDemo(){
 if(!managerOnly())return;
 if(!confirm('Wipe everything and reload the sample company?'))return;
 db=seed();photos={};save();tab='today';open=null;render();toast('Back to the demo company.');
}
function startEmpty(){
 if(!managerOnly())return;
 if(!confirm('Clear everything and set up a real company?'))return;
 db=emptyDb('My company');photos={};save();tab='settings';open=null;render();
 toast('Empty. Start with the company name.');
}
function setupSteps(){
 var steps=[
  [u('o_name'),db.company&&db.company!=='My company',"go('settings')"],
  [u('o_addcleaners'),crew().length>0,"go('settings')"],
  [u('o_addcust'),customers().length>0,"go('customers')"],
  [u('o_addprops'),db.props.length>0,"go('settings')"],
  [u('o_firstjob'),db.jobs.length>0,'newJob()']];
 var done=steps.filter(function(s){return s[1]}).length;
 if(done===steps.length){db.setup=true;save();return ''}
 var h='<div class="card"><div class="card-h">'+ic('zap')+'<h3>'+u('o_setup')+' — '+done+' '+u('of')+' '+steps.length+'</h3>'+
 '<div class="right"><button class="btn ghost" onclick="skipSetup()">'+u('b_hide')+'</button></div></div>';
 steps.forEach(function(s){
  h+='<div class="row"><div class="box'+(s[1]?'':'')+'" style="'+(s[1]?'background:var(--teal);border-color:var(--teal);color:#0A0D10':'')+'">✓</div>'+
  '<div class="grow"><div class="name" style="'+(s[1]?'color:var(--faint);font-weight:400':'')+'">'+s[0]+'</div></div>'+
  (s[1]?'<span class="st">'+u('s_done')+'</span>':'<button class="btn" onclick="'+s[2]+'">'+u('b_doit')+'</button>')+'</div>'});
 return h+'</div>';
}
function skipSetup(){db.setup=true;save();render();toast('Hidden. Find everything under Settings.')}

/* ---------------- actions ---------------- */
function onWay(id){var j=job(id);if(!j)return;j.onWay=Date.now();
 notify('onway',{a:cleaner(j.cleaner).name.split(' ')[0],p:j.prop});save();pushNow();render();
 toast('Customer told you are on the way.')}
function startJob(id){
 var j=job(id);if(!j)return;var p=property(j.prop);
 function begin(dist){
  j.status='progress';j.started=Date.now();
  if(dist!==null)j.geo={dist:dist,at:Date.now()};
  notify('checkin',{a:cleaner(j.cleaner).name.split(' ')[0],p:j.prop+(dist!==null?' ('+dist+'m)':'')});
  save();pushNow();render();toast(dist!==null?'Checked in, '+dist+'m from the property.':'Checked in without location.')}
 if(typeof navigator!=='undefined'&&navigator.geolocation&&p){
  navigator.geolocation.getCurrentPosition(
   function(pos){begin(metres(pos.coords.latitude,pos.coords.longitude,p.lat,p.lng))},
   function(){begin(null)},{timeout:6000,maximumAge:60000});
 } else begin(null)}
function toggle(id,k){var j=job(id);if(!j)return;var i=j.checked.indexOf(k);
 if(i>-1)j.checked.splice(i,1);else j.checked.push(k);save();render()}
function completeJob(id){var j=job(id);if(!j)return;
 var cl=checklistFor(j),ti=TIERS[j.tier||'standard'],ps=(j.photos||[]).length;
 var gaps=coverageGaps(j);
 if(ps<ti.photos&&!confirm(ti.name+' needs '+ti.photos+' photos and you have '+ps+'. Finish anyway?'))return;
 if(gaps.length&&!confirm(u('q_missingrooms')+' '+gaps.map(function(g){return T.en[g]}).join(', ')+'. '+u('q_anyway')))return;
 if(j.checked.length<cl.length&&!confirm((cl.length-j.checked.length)+' items not ticked. Finish anyway?'))return;
 j.status='done';j.finished=Date.now();
 (j.assets||[]).forEach(function(aid){var a=assetById(aid);if(a)a.last=jobDate(j)});
 consumeFor(j);
 notify('done',{a:cleaner(j.cleaner).name.split(' ')[0],p:j.prop,d:dur(j.started,j.finished)});
 save();pushNow();render();toast(u('st_completed'))}
function shoot(ev,id){var f=ev.target.files&&ev.target.files[0];if(!f)return;var j=job(id);if(!j)return;
 var rd=new FileReader();
 rd.onload=function(e){var img=new Image();
  img.onload=function(){var sc=Math.min(1,520/img.width),cv=document.createElement('canvas');
   cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);
   cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
   var data;try{data=cv.toDataURL('image/jpeg',0.55)}catch(err){data=e.target.result}
   var pid='ph'+Date.now()+Math.floor(Math.random()*999);photos[pid]=data;uploadPhoto(pid,data,j.id,shotArea);
   j.photos=j.photos||[];
   j.photos.push({id:pid,kind:j.checked.length>=checklistFor(j).length/2?'after':'before',at:Date.now(),area:shotArea});
   save();render();toast('Photo stamped '+hhmm(Date.now()))};
  img.onerror=function(){toast('Not an image.')};img.src=e.target.result};
 rd.onerror=function(){toast('Could not read that photo.')};rd.readAsDataURL(f);ev.target.value=''}
function reportProblem(id){open={type:'problem',job:id};probPick=null;render()}
function pickProb(p){probPick=p;render()}
function saveProblem(){if(!probPick){toast(t('whatwrong'));return}
 var j=job(open.job),note=document.getElementById('pb-note').value.trim();
 db.issues.unshift({id:db.seqIssue++,job:j.id,prop:j.prop,by:j.cleaner,type:probPick,note:note||'—',
  at:Date.now(),priority:document.getElementById('pb-pri').value,open:true,photo:null});
 if(probPick==='noaccess'||probPick==='damage')j.status='problem';
 notify('problem',{a:cleaner(j.cleaner).name.split(' ')[0],t:t(probPick),p:j.prop});
 open=null;save();pushNow();render();toast(u('st_sent'))}
function resolve(id){db.issues.forEach(function(i){if(String(i.id)===String(id)){i.open=false;
 var j=job(i.job);if(j&&j.status==='problem')j.status='progress'}});save();render();toast(u('st_closed'))}
function restock(item){db.stock.forEach(function(s){if(s.item===item)s.qty+=20});
 notify('stock',{i:item});save();render();toast(u('st_ordered'))}
function jf(k,v){if(jobForm)jobForm[k]=v}
function lastJobAt(name){
 var m=db.jobs.filter(function(j){return j.prop===name}).sort(function(a,b){return b.id-a.id});
 return m[0]||null;
}
function pickProp(name){
 if(!jobForm)return;
 jobForm.prop=name;
 var prev=lastJobAt(name);
 var pr=property(name);
 jobForm.lat=pr&&pr.lat?pr.lat:null;jobForm.lng=pr&&pr.lng?pr.lng:null;
 if(prev){
  jobForm.cust=prev.customer;
  /* only reuse the service if it belongs to the trade being booked */
  var tr=jobForm.trade||trades()[0];
  if(servicesFor(tr).indexOf(prev.service)>-1)jobForm.serv=prev.service;
  if(prev.trade&&!jobForm.trade)jobForm.trade=prev.trade;jobForm.cleaner=prev.cleaner;
  jobForm.time=prev.time;jobForm.tier=prev.tier||'standard';
  jobForm.price=Math.round(prev.price/(TIERS[prev.tier||'standard'].mult));
  jobForm.from=prev.id;
 } else {
  var p=property(name);
  if(p&&p.customer)jobForm.cust=p.customer;
  jobForm.from=null;
 }
 tierPick=jobForm.tier;
 render();
}

/* ---- pin the location while creating the job ---- */
function jobPlace(r){
 if(!jobForm)return;
 jobForm.lat=r.lat;jobForm.lng=r.lng;render();
 toast(u('m_pinned')+' '+r.lat.toFixed(5)+', '+r.lng.toFixed(5));
}
function jobFind(){
 if(!jobForm)return;
 var typed=(document.getElementById('j-addr')?document.getElementById('j-addr').value.trim():'');
 var q=typed||jobForm.prop;
 if(!q){toast(u('m_typeaddress'));return}
 toast(u('m_searching'));
 geocode(q,function(r){
  if(r)return jobPlace(r);
  geocode(q+', '+(COUNTRIES[S().country]||{name:''}).name,function(r2){
   if(!r2){toast(u('m_notfound'));return}
   jobPlace(r2);
  });
 });
}
function jobHere(){
 if(!jobForm)return;
 if(!navigator.geolocation){toast(u('m_nogeo'));return}
 toast(u('m_gettingpos'));
 navigator.geolocation.getCurrentPosition(function(pos){
  jobPlace({lat:pos.coords.latitude,lng:pos.coords.longitude});
 },function(){toast(u('m_denied'))},{enableHighAccuracy:true,timeout:12000});
}
function jobCoords(){
 if(!jobForm)return;
 var raw=(document.getElementById('j-coords')?document.getElementById('j-coords').value:'').trim();
 var m=raw.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
 if(!m){toast(u('m_badcoords'));return}
 var la=parseFloat(m[1]),ln=parseFloat(m[2]);
 if(la<-90||la>90||ln<-180||ln>180){toast(u('m_badcoords'));return}
 jobPlace({lat:la,lng:ln});
}
function jobClearPin(){if(!jobForm)return;jobForm.lat=null;jobForm.lng=null;render();toast(u('m_cleared'))}
function duplicateJob(id){
 var j=job(id);if(!j)return;
 db.jobs.push({id:db.seqJob++,prop:j.prop,customer:j.customer,service:j.service,tier:j.tier||'standard',
  cleaner:j.cleaner,time:j.time,date:addDays(todayStr(),1),price:j.price,status:'sched',started:null,finished:null,
  checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null});
 open=null;save();render();toast(u('j_duped'));
}
function newJob(){
 tierPick='standard';
 jobForm={prop:'',cust:'',serv:'Standard',cleaner:(crew()[0]||{}).id||'',time:'',price:165,tier:'standard',from:null,lat:null,lng:null,date:todayStr()};
 open={type:'job'};render();
}
function pickTier(x){tierPick=x;render()}
function saveJob(){
 var f=jobForm||{};
 var name=(f.prop==='__new'?'':f.prop||'').trim();
 if(!name){toast(u('j_pickprop'));return}
 var base=parseInt(f.price||'150',10)||150;
 if(f.cleaner){
  var av=availabilityNote(f.cleaner,f.date||todayStr(),f.time,f.serv,tierPick);
  if(av.bad&&!confirm(cleaner(f.cleaner).name+' — '+av.text+'. '+u('av_anyway')))return;
 }
 db.jobs.push({id:db.seqJob++,prop:name,customer:(f.cust||'').trim()||'Direct',date:f.date||todayStr(),
  service:f.serv||servicesFor(f.trade||trades()[0])[0],trade:f.trade||trades()[0],
  tier:tierPick||'standard',cleaner:f.cleaner||null,team:(f.team||[]).slice(),
  time:(f.time||'').trim()||'09:00',price:Math.round(base*TIERS[tierPick||'standard'].mult),
  status:'sched',started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null});
 var pr=property(name);
 if(!pr){db.props.push({name:name,area:'',lat:f.lat||null,lng:f.lng||null,key:'',park:'',wifi:'—',alarm:'—',note:''});}
 else if(f.lat&&(!pr.lat||pr.lat!==f.lat)){pr.lat=f.lat;pr.lng=f.lng}
 jobForm=null;open=null;save();render();
 toast(u('st_scheduled')+' '+TIERS[tierPick||'standard'].name);
}
function editProp(i){open={type:'prop',idx:i};render()}
function saveProp(){var p=db.props[open.idx];if(!p)return;
 p.key=document.getElementById('x-key').value.trim();p.park=document.getElementById('x-park').value.trim();
 p.alarm=document.getElementById('x-alarm').value.trim();p.wifi=document.getElementById('x-wifi').value.trim();
 p.note=document.getElementById('x-note').value.trim();open=null;save();render();toast('Updated.')}
function newContract(){dayPick=[1];tierPick='standard';open={type:'contract'};render()}
function toggleDay(d){var i=dayPick.indexOf(d);if(i>-1)dayPick.splice(i,1);else dayPick.push(d);render()}
function saveContract(){var prop=document.getElementById('r-prop').value.trim();
 if(!prop){toast('Which property?');return}if(!dayPick.length){toast('Pick a day.');return}
 var base=parseInt(document.getElementById('r-price').value||'150',10);
 db.contracts.push({id:'R-'+('0'+(db.contracts.length+1)).slice(-2),prop:prop,
  customer:document.getElementById('r-cust').value.trim()||'Direct',service:document.getElementById('r-serv').value,
  tier:tierPick,cleaner:document.getElementById('r-clean').value,time:document.getElementById('r-time').value||'09:00',
  price:Math.round(base*TIERS[tierPick].mult),freq:document.getElementById('r-freq').value,days:dayPick.slice()});
 open=null;save();render();toast('Contract added.')}
function delContract(id){db.contracts=db.contracts.filter(function(r){return r.id!==id});save();render();toast(u('st_removed'))}
function generate(){var dow=new Date().getDay(),made=0;
 db.contracts.forEach(function(r){if(r.days.indexOf(dow)===-1)return;
  if(db.jobs.some(function(j){return j.prop===r.prop&&j.time===r.time}))return;
  db.jobs.push({id:db.seqJob++,prop:r.prop,customer:r.customer,service:r.service,tier:r.tier||'standard',
   cleaner:r.cleaner,time:r.time,price:r.price,status:'sched',started:null,finished:null,checked:[],photos:[],
   rating:0,signed:false,onWay:null,geo:null});made++});
 save();render();toast(made?made+' job'+(made===1?'':'s')+' created.':'Nothing new due.')}
function bf(k,v){if(bookForm)bookForm[k]=v;render()}
function bookClean(){
 tierPick='standard';
 bookForm={date:addDays(todayStr(),1),time:'09:00',serv:'Standard',prop:'',note:'',deposit:true};
 open={type:'book'};render();
}
function saveBooking(){
 var f=bookForm||{};
 var prop=(f.prop==='__new'?(f.prop2||''):(f.prop||''));
 if(!prop&&document.getElementById('b-prop'))prop=(document.getElementById('b-prop').value||'').trim();
 prop=(prop||'').trim();
 if(!prop||prop==='__new'){toast(u('m_typeaddress'));return}
 var dep=f.deposit?Math.round(165*TIERS[tierPick].mult*0.3):0;
 db.requests.unshift({id:'B-'+(db.seqReq++),customer:customerName(),prop:prop,
  date:f.date||addDays(todayStr(),1),time:f.time||'09:00',
  when:dayName(f.date||addDays(todayStr(),1))+' '+(f.time||'09:00'),
  service:f.serv||'Standard',tier:tierPick,
  note:(f.note||'').trim()||'—',at:Date.now(),status:'pending',deposit:dep});
 notify('booking',{c:customerName(),x:TIERS[tierPick].name,p:prop});
 bookForm=null;open=null;save();render();
 toast(dep?u('bk_sentdep')+' '+aed(dep):u('bk_sent'));
}
function acceptReq(id){db.requests.forEach(function(r){if(r.id===id){r.status='accepted';
 db.jobs.push({id:db.seqJob++,prop:r.prop,customer:r.customer,service:r.service,tier:r.tier||'standard',
  cleaner:null,team:[],time:r.time||'14:00',date:r.date||todayStr(),price:Math.round(165*TIERS[r.tier||'standard'].mult),
  status:'sched',started:null,finished:null,checked:[],photos:[],rating:0,signed:false,onWay:null,geo:null})}});
 save();render();toast(u('st_scheduled'))}
function declineReq(id){db.requests.forEach(function(r){if(r.id===id)r.status='declined'});save();render();toast('Declined.')}
function setStar(n){starPick=n;render()}
function signOff(id){var j=job(id);if(!j)return;
 if(!starPick){toast('Pick a rating.');return}
 j.rating=starPick;j.signed=true;
 if(j.cleaner){db.ratings=db.ratings||{};db.ratings[j.cleaner]=(db.ratings[j.cleaner]||[]).concat([starPick])}
 notify('signoff',{p:j.prop,r:starPick});
 starPick=0;save();pushNow();render();toast(u('st_signed'))}

/* ---- quick tasks: any kind of task, and cleaners can name their price ---- */
function taskTitle(x){return x.custom||ttName(taskType(x.type))}
function taskOffers(x){return x.offers||[]}
function bestOffer(x){var o=taskOffers(x);if(!o.length)return null;
 return o.slice().sort(function(a,b){return a.price-b.price})[0]}
function myOffer(x){var me=session?session.id:null;
 return taskOffers(x).filter(function(o){return o.by===me})[0]||null}
function makeOffer(id){open={type:'offer',task:id};render()}
function saveOffer(){
 var x=task(open.task);if(!x)return;
 var p=parseFloat(document.getElementById('of-price').value||'0');
 if(!(p>0)){toast(u('of_price'));return}
 x.offers=x.offers||[];
 var mine=myOffer(x);
 if(mine){mine.price=p;mine.note=document.getElementById('of-note').value.trim();mine.at=Date.now()}
 else x.offers.push({by:session.id,price:p,note:document.getElementById('of-note').value.trim(),at:Date.now()});
 notify('offer',{a:cleaner(session.id).name.split(' ')[0],t:taskTitle(x),m:aed(p)});
 open=null;save();pushNow();render();toast(u('of_sent'));
}
function acceptOffer(taskId,cleanerId){
 var x=task(taskId);if(!x)return;
 var o=taskOffers(x).filter(function(y){return y.by===cleanerId})[0];
 if(!o)return;
 x.status='taken';x.by=cleanerId;x.fee=o.price;x.agreed=Date.now();
 notify('taskclaim',{a:cleaner(cleanerId).name.split(' ')[0],t:taskTitle(x),p:x.prop});
 open=null;save();pushNow();render();toast(u('of_accepted')+' '+aed(o.price));
}
function viewOffers(id){open={type:'offers',task:id};render()}
function pickTaskKind(v){taskKind=v;render()}
function setTaskMode(m){taskMode=m;render()}
function tpSet(which,r){taskPlace[which]=r;render()}
function tpFind(which){
 var el=document.getElementById('tp-'+which);
 var q=((el&&el.value)||'').trim();
 if(!q){toast(u('tp_type'));return}
 toast(u('m_searching'));
 geocode(q,function(r){
  if(r)return tpSet(which,{name:q,lat:r.lat,lng:r.lng});
  geocode(q+', '+(COUNTRIES[S().country]||{name:''}).name,function(r2){
   if(!r2){tpSet(which,{name:q,lat:null,lng:null});toast(u('tp_saved_noloc'));return}
   tpSet(which,{name:q,lat:r2.lat,lng:r2.lng});
  });
 });
}
function tpHere(which){
 if(!navigator.geolocation){toast(u('m_nogeo'));return}
 toast(u('m_gettingpos'));
 navigator.geolocation.getCurrentPosition(function(pos){
  var el=document.getElementById('tp-'+which);
  tpSet(which,{name:((el&&el.value)||'').trim()||u('tp_hereis'),lat:pos.coords.latitude,lng:pos.coords.longitude});
 },function(){toast(u('m_denied'))},{enableHighAccuracy:true,timeout:12000});
}
function tpClear(which){taskPlace[which]=null;render()}
function tpBlock(which,label){
 var v=taskPlace[which];
 return '<div class="field"><label for="tp-'+which+'">'+label+
  (v&&v.lat?' <span style="color:var(--run)">'+v.lat.toFixed(4)+', '+v.lng.toFixed(4)+'</span>':'')+'</label>'+
  '<input id="tp-'+which+'" placeholder="'+u('tp_example')+'" value="'+esc(v?v.name:'')+'">'+
  '<div style="display:flex;gap:5px;margin-top:6px;flex-wrap:wrap">'+
  '<button class="btn ghost" style="font-size:11px" onclick="tpFind(\''+which+'\')">'+ic('pin')+u('m_find')+'</button>'+
  '<button class="btn ghost" style="font-size:11px" onclick="tpHere(\''+which+'\')">'+ic('pin')+u('m_here')+'</button>'+
  (v?'<button class="btn ghost" style="font-size:11px" onclick="tpClear(\''+which+'\')">'+u('m_clear')+'</button>':'')+
  '</div></div>';
}
function taskRoute(x){
 if(!x.from||!x.to||!x.from.lat||!x.to.lat)return null;
 return 'https://www.google.com/maps/dir/?api=1&travelmode=driving&origin='+
  x.from.lat+','+x.from.lng+'&destination='+x.to.lat+','+x.to.lng;
}
function taskLegs(x){
 if(!x.from&&!x.to)return '';
 var d=(session&&session.role==='cleaner')?(T[lang]||T.en):null;
 var L=function(k,fallback){return d&&d[k]?d[k]:u(fallback)};
 var h='<div style="font-size:11px;color:var(--muted);margin-top:5px">';
 if(x.from)h+='<div>'+L('tfrom','tp_from')+' '+esc(x.from.name)+
   (x.from.lat?' <a href="'+navLink(x.from)+'" target="_blank" rel="noopener" style="color:var(--run)">'+L('tgo','tp_go')+'</a>':'')+'</div>';
 if(x.to)h+='<div>'+L('tto','tp_to')+' '+esc(x.to.name)+
   (x.to.lat?' <a href="'+navLink(x.to)+'" target="_blank" rel="noopener" style="color:var(--run)">'+L('tgo','tp_go')+'</a>':'')+'</div>';
 var r=taskRoute(x);
 if(r)h+='<div><a href="'+r+'" target="_blank" rel="noopener" style="color:var(--run)">'+L('troute','tp_route')+'</a></div>';
 return h+'</div>';
}
function newTask(){taskKind='bins';taskMode='offers';taskPlace={from:null,to:null};open={type:'task'};render()}
function saveTask(){
 var prop=document.getElementById('t-prop').value.trim();
 if(!prop){toast(u('m_typeaddress'));return}
 var custom=(taskKind==='custom'&&document.getElementById('t-custom'))?document.getElementById('t-custom').value.trim():'';
 if(taskKind==='custom'&&!custom){toast(u('tk_needtitle'));return}
 var def=taskType(taskKind);
 var fee=parseFloat((document.getElementById('t-fee')||{}).value||def.fee||0);
 db.tasks.unshift({id:'T-'+(db.seqTask++),prop:prop,
  customer:session.role==='customer'?customerName():((document.getElementById('t-cust')||{}).value||'').trim()||'Direct',
  type:taskKind==='custom'?'other':taskKind,custom:custom,
  mode:taskMode,fee:taskMode==='offers'?0:fee,offers:[],
  status:'open',by:null,at:Date.now(),done:null,photo:null,
  from:taskPlace.from,to:taskPlace.to,
  note:(document.getElementById('t-note')||{}).value.trim()||''});
 notify('taskpost',{t:custom||def.name,p:prop});
 open=null;save();render();
 toast(taskMode==='offers'?u('tk_askedprice'):u('st_posted'));
}
function claimTask(id){var x=task(id);if(!x)return;
 if(x.mode==='offers'){makeOffer(id);return}
 x.status='taken';x.by=session.id;
 notify('taskclaim',{a:cleaner(session.id).name.split(' ')[0],t:ttName(taskType(x.type)),p:x.prop});
 save();pushNow();render();toast(u('st_yours'))}
function finishTask(id){var x=task(id);if(!x)return;x.status='done';x.done=Date.now();
 notify('taskdone',{t:ttName(taskType(x.type)),p:x.prop,m:aed(x.fee)});
 save();pushNow();render();toast('Done. '+aed(x.fee*0.6)+' added to your pay.')}
function takePayment(id){open={type:'pay',inv:id};render()}
function savePayment(){
 if(!managerOnly())return;var v=null;db.invoices.forEach(function(x){if(x.id===open.inv)v=x});if(!v)return;
 var amt=parseInt(document.getElementById('p-amt').value||'0',10);
 if(amt<=0){toast('Enter an amount.');return}
 v.payments.push({amt:amt,method:document.getElementById('p-method').value,at:Date.now()});
 notify('pay',{m:aed(amt),c:v.customer});open=null;save();render();toast('Recorded.')}
function reportHtml(j){
 var c=cleaner(j.cleaner),ps=jobPhotos(j),cl=checklistFor(j),p=property(j.prop);
 var rtl=uiDir()==='rtl';
 var rows=cl.map(function(k){return '<li>'+(j.checked.indexOf(k)>-1?'\u2713':'\u2717')+' '+
  ((U[uiLang]&&T[uiLang]&&T[uiLang][k])?T[uiLang][k]:T.en[k])+'</li>'}).join('');
 var imgs=ps.map(function(x){return '<figure><img src="'+(x.src||'')+'"><figcaption>'+
  x.kind+' \u00b7 '+hhmm(x.at)+'</figcaption></figure>'}).join('');
 function row(k,v){return '<tr><td>'+k+'</td><td>'+v+'</td></tr>'}
 return '<!doctype html><html lang="'+uiLang+'" dir="'+(rtl?'rtl':'ltr')+'"><meta charset="utf-8">'+
 '<title>'+u('r_title')+' '+j.id+'</title>'+
 '<style>body{font-family:'+(rtl?'\'Noto Sans Arabic\',':'')+'Helvetica,Arial,sans-serif;color:#111;margin:28px;font-size:12px;direction:'+(rtl?'rtl':'ltr')+'}'+
 'h1{font-size:17px;margin:0}h2{font-size:12px;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.5px;color:#666}'+
 'table{border-collapse:collapse;width:100%;margin-top:10px}td{padding:4px 0;border-bottom:1px solid #eee;text-align:'+(rtl?'right':'left')+'}'+
 'td:first-child{color:#666;width:38%}ul{columns:2;padding-'+(rtl?'right':'left')+':16px;margin:0;list-style-position:inside}li{margin:2px 0}'+
 'figure{display:inline-block;margin:0 8px 8px 0;width:150px}img{width:150px;height:110px;object-fit:cover;border:1px solid #ddd}'+
 'figcaption{font-size:9px;color:#666;margin-top:2px}'+
 '.f{margin-top:22px;font-size:10px;color:#888;border-top:1px solid #ddd;padding-top:8px}</style>'+
 '<h1>'+esc(db.company)+' \u2014 '+u('r_title')+'</h1>'+
 '<div style="color:#666;font-size:11px">'+u('r_job')+' '+j.id+' \u00b7 '+esc(S().idLabel)+' '+esc(S().taxId||'\u2014')+'</div>'+
 '<table>'+
 row(u('r_property'), esc(j.prop)+(p?', '+esc(p.area):'')) +
 row(u('r_customer'), esc(j.customer)) +
 row(u('r_service'), esc(svc(j.service))+' \u2014 '+TIERS[j.tier||'standard'].name) +
 row(u('r_cleaner'), esc(c.name)) +
 row(u('r_scheduled'), j.time) +
 row(u('r_arrived'), hhmm(j.started)+(j.geo?' \u2014 '+u('r_verified')+', '+j.geo.dist+'m '+u('r_from'):'')) +
 row(u('r_finished'), hhmm(j.finished)) +
 row(u('r_onsite'), dur(j.started,j.finished)) +
 row(u('r_checklist'), j.checked.length+' '+u('r_of')+' '+cl.length+' '+u('r_completed')) +
 row(u('r_photos'), ps.length+' '+u('r_taken')) +
 (j.signed?row(u('r_signed'), u('r_rated')+' '+j.rating+'/5'):'') +
 row(u('r_price'), aed(j.price)+' '+u('r_incl')+' '+esc(S().taxLabel)) +
 '</table>'+
 '<h2>'+u('r_checklist')+'</h2><ul>'+rows+'</ul>'+
 '<h2>'+u('r_photos')+'</h2>'+(imgs||'<div style="color:#888">'+u('r_none')+'</div>')+
 '<div class="f">'+u('r_foot')+' '+u('r_generated')+' '+new Date().toLocaleString(S().locale||'en')+'.</div></html>'}
function printReport(id){var j=job(id);if(!j)return;
 try{var w=window.open('','_blank');
  if(!w)throw new Error('blocked');
  w.document.write(reportHtml(j));w.document.close();
  setTimeout(function(){try{w.print()}catch(e){}},400);
  toast('Report opened — print or save as PDF.')}
 catch(e){open={type:'report',job:id};render()}}
function exportCsv(){
 var rows=[['Job','Property','Customer','Service','Tier','Cleaner','Scheduled','Arrived','Verified m','Finished','Minutes','Items','Photos','Status','Price AED','Signed','Rating']];
 db.jobs.forEach(function(j){rows.push([j.id,j.prop,j.customer,j.service,TIERS[j.tier||'standard'].name,
  cleaner(j.cleaner).name,j.time,hhmm(j.started),j.geo?j.geo.dist:'',hhmm(j.finished),
  j.started&&j.finished?Math.round((j.finished-j.started)/MIN):'',j.checked.length,(j.photos||[]).length,
  j.status,j.price,j.signed?'yes':'no',j.rating||''])});
 db.tasks.forEach(function(x){rows.push([x.id,x.prop,x.customer,ttName(taskType(x.type)),'Task',
  x.by?cleaner(x.by).name:'',hhmm(x.at),'','',hhmm(x.done),'','','',x.status,x.fee,'',''])});
 var csv=rows.map(function(r){return r.map(function(c){var s=String(c);
  return /[",]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}).join(',')}).join('\n');
 try{var b=new Blob([csv],{type:'text/csv'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download='operations-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(u)},1500);toast(u('st_exported'))}
 catch(e){open={type:'csv',csv:csv};render()}}
function setLang(l){lang=l;render()}
function toast(m){var o=document.querySelector('.toast');if(o)o.remove();
 var e=document.createElement('div');e.className='toast';e.textContent=m;
 document.body.appendChild(e);setTimeout(function(){if(e.parentNode)e.remove()},2800)}
function cleanerOptions(s){var h='';crew().forEach(function(c){
 h+='<option value="'+c.id+'"'+(c.id===s?' selected':'')+'>'+c.name+(c.senior?' (senior)':'')+'</option>'});return h}
function tierPicker(){
 var h='<div class="tiers">';
 ['standard','premium'].forEach(function(k){var ti=TIERS[k];
  h+='<button class="tier'+(tierPick===k?' on':'')+(k==='premium'?' prem':'')+'" onclick="pickTier(\''+k+'\')">'+
  '<b>'+ti.name+'</b><div class="p">'+(k==='premium'?'+55% · ':'')+ti.blurb+'</div><ul>'+
  '<li>'+ti.arrive+' '+u('t_arrival')+'</li><li>'+ti.photos+' '+u('t_minphotos')+'</li>'+
  (ti.senior?'<li>'+u('t_senior')+'</li>':'<li>'+u('t_anyclean')+'</li>')+
  (ti.guarantee?'<li>'+ti.guarantee+'h '+u('t_guarantee')+'</li>':'<li>'+u('t_noguarantee')+'</li>')+
  (ti.extras.length?'<li>'+ti.extras.length+' '+u('t_extras')+'</li>':'')+'</ul></button>'});
 return h+'</div>'}
function go(x){tab=x;var w=document.querySelector('.wrap');if(w)w.scrollTop=0;render()}
function migrateBins(){
 if(!db||!db.jobs)return;
 db.jobs.forEach(function(j){
  if(j.checked)j.checked=j.checked.map(function(k){return k==='bins'?'rubbish':k});
  if(j.redoItems)j.redoItems=j.redoItems.map(function(k){return k==='bins'?'rubbish':k});
 });
 (db.props||[]).forEach(function(p){
  if(p.checklist)p.checklist=p.checklist.map(function(k){return k==='bins'?'rubbish':k});
 });
}
