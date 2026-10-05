/* What is drawn on screen. Each v-something function returns the HTML
   for one screen; render() picks which. */
function vPin(){
 var who=pinFor.id?cleaner(pinFor.id).name:(pinFor.role==='manager'?'Layla Mansour':'Marina Heights Tower');
 var dots='';for(var i=0;i<4;i++)dots+='<span style="width:11px;height:11px;border-radius:50%;display:inline-block;margin:0 5px;'+
  'background:'+(i<pinBuf.length?'var(--teal)':'#2C343E')+'"></span>';
 var h='<div class="login"><div class="lbox"><div class="lhead"><h1>'+esc(who)+'</h1><p>'+u('a_enterpin')+'</p></div>'+
  '<div class="box" style="text-align:center;padding:18px 0 6px">'+dots+'</div>'+
  '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px">';
 ['1','2','3','4','5','6','7','8','9','x','0','del'].forEach(function(k){
  var lbl=k==='del'?'&larr;':k==='x'?'&times;':k;
  h+='<button class="btn '+(k==='x'||k==='del'?'ghost':'')+'" style="padding:15px;font-size:17px" onclick="pinKey(\''+k+'\')">'+lbl+'</button>';
 });
 return h+'</div></div></div>';
}
function vAuthPending(){
 return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('gs_welcome')+'</h1>'+
  '<p>'+u('gs_signedas')+' '+esc(authUser.email||authUser.phone)+'</p></div>'+
  '<button class="btn" style="width:100%;padding:13px" onclick="startWizard()">'+u('gs_create')+'</button>'+
  '<p style="font-size:11.5px;color:var(--faint);margin:8px 0 18px;text-align:center">'+u('gs_createnote')+'</p>'+
  '<div class="panel" style="font-size:12.5px;color:var(--muted)"><b style="color:var(--text)">'+u('gs_employee')+'</b><br>'+
  u('gs_employeenote')+' <span class="mono" style="color:var(--text)">'+esc(authUser.email||authUser.phone)+'</span></div>'+
  '<button class="btn ghost" style="width:100%;margin-top:12px;padding:12px" onclick="authSignOut()">'+u('b_signout')+'</button>'+
  '</div></div>';
}
function vOtp(){
 var h='<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('au_phone')+'</h1>'+
  '<p>'+(otpPhase==='code'?u('au_entercode')+' '+esc(otpPhone):u('au_enterphone'))+'</p></div>'+
  '<div class="panel">';
 if(otpPhase==='phone'){
  h+='<input placeholder="+971 50 000 0000" value="'+esc(otpPhone)+'" oninput="otpSet(\'phone\',this.value)">'+
   '<button class="btn" style="width:100%;margin-top:10px;padding:12px" onclick="otpStart()">'+u('au_sendcode')+'</button>';
 } else {
  h+='<input placeholder="123456" inputmode="numeric" value="'+esc(otpCode)+'" oninput="otpSet(\'code\',this.value)">'+
   '<button class="btn" style="width:100%;margin-top:10px;padding:12px" onclick="otpVerify()">'+u('au_verify')+'</button>';
 }
 h+='<button class="btn ghost" style="width:100%;margin-top:8px" onclick="otpCancel()">'+u('b_cancel')+'</button>';
 return h+'</div></div></div>';
}
function vCodeEntry(){
 return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('mt_signin')+'</h1>'+
  '<p>'+u('mt_signinsub')+'</p></div>'+
  '<div class="panel">'+
  '<div class="field"><label for="cd-ws">'+u('cl_ws')+'</label><input id="cd-ws" placeholder="gulfshine"></div>'+
  '<div class="field"><label for="cd-token">'+u('mt_yourcode')+'</label><input id="cd-token" type="password"></div>'+
  '<button class="btn big" onclick="enterCompany()">'+u('mt_enter')+'</button>'+
  '<button class="btn ghost big" style="margin-top:8px" onclick="closeCodeEntry()">'+u('b_cancel')+'</button>'+
  '<p style="font-size:11px;color:var(--faint);margin:11px 0 0">'+u('mt_asknote')+'</p>'+
  '</div></div></div>';
}
function vEmail(){
 if(emailMode==='check')
  return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('em_checkmail')+'</h1>'+
   '<p>'+u('em_checksub')+'</p></div>'+
   '<button class="btn ghost big" style="width:100%" onclick="closeEmail()">'+u('b_close')+'</button></div></div>';
 if(emailMode==='sent')
  return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('em_linksent')+'</h1>'+
   '<p>'+u('em_linksentsub')+'</p></div>'+
   '<button class="btn ghost big" style="width:100%" onclick="closeEmail()">'+u('b_close')+'</button></div></div>';
 if(emailMode==='reset')
  return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('em_resetsent')+'</h1>'+
   '<p>'+u('em_resetsentsub')+'</p></div>'+
   '<button class="btn ghost big" style="width:100%" onclick="closeEmail()">'+u('b_close')+'</button></div></div>';
 var up=emailMode==='up';
 return '<div class="login"><div class="lbox">'+
  '<div class="lhead"><h1>'+u(up?'em_create':'em_signin')+'</h1><p>'+u(up?'em_createsub':'em_signinsub')+'</p></div>'+
  '<div class="panel">'+
  '<div class="field"><label for="em-addr">'+u('f_email')+'</label>'+
  '<input id="em-addr" type="email" autocomplete="email" placeholder="you@company.com"></div>'+
  '<div class="field"><label for="em-pass">'+u('em_password')+'</label>'+
  '<input id="em-pass" type="password" autocomplete="'+(up?'new-password':'current-password')+'"></div>'+
  (up?'<p style="font-size:11px;color:var(--faint);margin:-4px 0 10px">'+u('em_passrule')+'</p>':'')+
  (emailErr?'<p style="font-size:11.5px;color:var(--stop);margin:0 0 10px">'+esc(emailErr)+'</p>':'')+
  '<button class="btn big" style="width:100%" onclick="'+(up?'signUpEmail()':'signInEmail()')+'">'+
  u(up?'em_create':'em_signin')+'</button>'+
  '<div style="display:flex;gap:6px;margin-top:8px">'+
  '<button class="btn ghost" style="flex:1;font-size:11.5px" onclick="magicLink()">'+u('em_magic')+'</button>'+
  (up?'':'<button class="btn ghost" style="flex:1;font-size:11.5px" onclick="resetPassword()">'+u('em_forgot')+'</button>')+
  '</div>'+
  '<button class="btn ghost" style="width:100%;margin-top:8px;font-size:11.5px" onclick="openEmail(\''+(up?'in':'up')+'\')">'+
  u(up?'em_haveaccount':'em_noaccount')+'</button>'+
  '<button class="btn ghost" style="width:100%;margin-top:6px" onclick="closeEmail()">'+u('b_cancel')+'</button>'+
  '</div></div></div>';
}
function vLogin(){
 var named=showTeamOnDevice();
 var h='<div class="login"><div class="lbox">'+
  '<div class="lhead"><h1>'+esc(named?db.company:u('mt_apptitle'))+'</h1>'+
  '<p>'+u('l_operations')+'</p></div>';

 /* One way in, chosen for the person most likely to be here.
    Everything else folds away until it is asked for. */
 if(authReady()){
  h+='<button class="btn" style="width:100%;padding:13px;display:flex;align-items:center;justify-content:center;gap:9px" onclick="googleSignIn()">'+
   '<svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>'+
   u('au_google')+'</button>';
 } else {
  h+='<button class="btn" style="width:100%;padding:13px" onclick="openCodeEntry()">'+u('mt_signin')+'</button>';
 }

 if(authReady()){
  h+='<button class="btn ghost" style="width:100%;padding:11px;margin-top:7px;font-size:12px" '+
   'onclick="toggleMoreWays()">'+u('l_otherways')+' '+(moreWays?'&#9662;':'&#9656;')+'</button>';
  if(moreWays){
   h+='<div style="margin-top:7px">'+
    '<button class="btn ghost" style="width:100%;padding:11px;margin-bottom:6px" onclick="openEmail(\'in\')">'+u('em_withemail')+'</button>'+
    '<button class="btn ghost" style="width:100%;padding:11px;margin-bottom:6px" onclick="appleSignIn()">'+u('au_apple')+'</button>'+
    '<button class="btn ghost" style="width:100%;padding:11px;margin-bottom:6px" onclick="otpOpen()">'+u('au_phonebtn')+'</button>'+
    '<button class="btn ghost" style="width:100%;padding:11px" onclick="openCodeEntry()">'+u('mt_signin')+'</button></div>';
  }
 }

 /* Two quiet links at the bottom, for the two people who are not
    signing in: a new company, and a customer asking for access. */
 h+='<div style="display:flex;gap:14px;justify-content:center;margin-top:18px;font-size:11.5px">'+
  '<a href="#" onclick="event.preventDefault();startWizard()" style="color:var(--muted)">'+u('wz_start')+'</a>'+
  '<span style="color:var(--line2)">·</span>'+
  '<a href="#" onclick="event.preventDefault();openAskAccess()" style="color:var(--muted)">'+u('req_short')+'</a>'+
  '</div>'+
  '<p style="font-size:11px;color:var(--faint);margin:14px 0 0;text-align:center;line-height:1.5">'+
   u('mt_privacy')+'</p>'+
  '<p style="text-align:center;margin:10px 0 0"><a href="#" onclick="event.preventDefault();openLegal()" style="font-size:11px;color:var(--faint)">'+u('lg_link')+'</a></p>';

 if(named){
  h+='<div style="font-size:11px;color:var(--faint);margin:18px 0 7px">'+u('au_ordevice')+'</div>'+
   '<button class="who" onclick="askPin(\'manager\',null)"><div class="av">'+
   esc((db.company||'  ').slice(0,2).toUpperCase())+'</div><div><div style="font-weight:500">'+u('l_manager')+'</div>'+
   '<div style="font-size:11px;color:var(--faint)">'+u('l_opsmanager')+'</div></div>'+
   '<span class="r">'+u('l_manager')+'</span></button>';
  crew().forEach(function(c){
   h+='<button class="who" onclick="askPin(\'cleaner\',\''+c.id+'\')"><div class="av">'+c.initials+'</div><div>'+
    '<div style="font-weight:500">'+esc(c.name)+'</div>'+
    '<div style="font-size:11px;color:var(--faint)">'+(T[c.lang]||T.en).name+'</div></div>'+
    '<span class="r">'+u('l_cleaner')+'</span></button>';
  });
  customers().forEach(function(cu){
   h+='<button class="who" onclick="askPin(\'customer\',\''+cu.id+'\')"><div class="av">'+
    esc(cu.name.split(' ').map(function(w){return w[0]}).join('').slice(0,2))+'</div><div>'+
    '<div style="font-weight:500">'+esc(cu.name)+'</div>'+
    '<div style="font-size:11px;color:var(--faint)">'+u('l_customer')+'</div></div>'+
    '<span class="r">'+u('l_portal')+'</span></button>';
  });
 }
 return h+'</div></div>';
}

/* ---------------- shared rows ---------------- */
function jobRow(j){
 var selectable=(tab==='jobs'&&session&&session.role==='manager'&&j.status==='sched');
 var c=j.cleaner?cleaner(j.cleaner):{name:u('p_unassigned'),initials:'?'},late=lateBy(j),cl=checklistFor(j);
 var pct=Math.round(j.checked.length/cl.length*100),np=(j.photos||[]).length,st,dot='';
 if(j.status==='progress'){st='<span class="st run">'+u('s_running')+' '+dur(j.started,null)+'</span>';dot='run'}
 else if(j.status==='done')st='<span class="st">'+(j.inspected!=null?j.inspected+'% · ':'')+u('s_done')+' '+hhmm(j.finished)+' · '+dur(j.started,j.finished)+'</span>';
 else if(j.status==='problem'){st='<span class="st bad">'+u('s_problem')+'</span>';dot='prob'}
 else if(j.status==='cancelled')st='<span class="st">'+u('s_cancelled')+'</span>';
 else if(j.onWay){st='<span class="st run">'+u('s_onway')+'</span>';dot='run'}
 else st=late?'<span class="st bad">'+late+u('s_late')+'</span>':'<span class="st">'+u('s_due')+' '+j.time+'</span>';
 return '<div class="row click'+(late?' late':'')+'"'+(selectable?'':' onclick="openJob('+j.id+')"')+'>'+
  (selectable?'<button class="btn '+(picked[j.id]?'':'ghost')+'" style="padding:4px 9px;font-size:11px" onclick="pickJob('+j.id+')">'+(picked[j.id]?'&#10003;':'&#9675;')+'</button>'+
   '<span class="grow" onclick="openJob('+j.id+')" style="display:contents"></span>':'')+
 '<span class="dot '+dot+'"></span><div class="av">'+c.initials+'</div><div class="grow">'+
 '<div class="name">'+esc(j.prop)+tierPill(j)+'<span style="color:var(--faint);font-weight:400">'+esc(svc(j.service))+'</span></div>'+
 '<div class="meta"><span class="id">'+j.id+'</span>'+(multiTrade()?'<span>'+TRADES[tradeOf(j)].name+'</span>':'')+readingsLine(j)+'<span>'+esc(c.name)+((j.team&&j.team.length)?' +'+j.team.length:'')+'</span><span>'+(isToday(j)?'':dayName(jobDate(j))+' ')+j.time+'</span>'+
 (np?'<span>'+np+' photo'+(np===1?'':'s')+'</span>':'')+
 (j.geo?'<span>checked in '+j.geo.dist+'m away</span>':'')+
 (j.signed?'<span>signed '+j.rating+'★</span>':'')+'</div>'+
 (j.status==='progress'||j.status==='problem'?'<div class="prog'+(pct<50?' low':'')+'"><i style="width:'+pct+'%"></i></div>':'')+
 '</div>'+st+'<span class="mono" style="color:var(--faint);font-size:11.5px">'+aed(j.price)+'</span></div>'}
function issueRow(is){
 var pr={High:u('high_p'),Medium:u('med_p'),Low:u('low_p')}[is.priority]||is.priority;
 return '<div class="row"><span class="dot prob"></span><div class="grow">'+
 '<div class="name">'+esc(issueLabel(is.type))+'<span style="color:var(--faint);font-weight:400">'+esc(is.prop)+'</span></div>'+
 '<div class="meta"><span class="mono">'+esc(String(is.id))+'</span><span>'+esc(is.note)+'</span><span>'+esc(issueBy(is))+' · '+hhmm(is.at)+'</span></div></div>'+
 '<span class="st'+(is.priority==='High'?' bad':'')+'">'+esc(pr)+'</span>'+
 (is.type==='cancelreq'&&is.open&&job(is.job)&&job(is.job).status==='sched'?
   '<button class="btn" onclick="event.stopPropagation();cancelJob('+is.job+')">'+u('cx_cancel')+'</button>':'')+
 (is.open?'<button class="btn ghost" onclick="event.stopPropagation();resolve(\''+jarg(String(is.id))+'\')">'+u('b_resolve')+'</button>':'')+'</div>'}
function taskRow(x,forCleaner){
 var ty=taskType(x.type),c=x.by?cleaner(x.by):null,best=bestOffer(x);
 return '<div class="row"><span class="dot'+(x.status==='open'?' gold':x.status==='taken'?' run':'')+'"></span>'+
 '<div class="grow"><div class="name">'+esc(taskTitle(x))+
 (x.mode==='offers'&&x.status==='open'?'<span class="pill prem">'+u('tk_offers')+'</span>':'')+
 '<span style="color:var(--faint);font-weight:400">'+esc(x.prop)+'</span></div>'+
 '<div class="meta"><span class="id">'+x.id+'</span>'+((x.custom||x.mode==='offers')?'':'<span>~'+ty.mins+' min</span>')+
 (x.mode==='offers'&&x.status==='open'?'<span>'+taskOffers(x).length+' '+u('tk_bids')+
   (best?' · '+u('tk_from')+' '+aed(best.price):'')+'</span>':'')+
 (x.note?'<span>'+esc(x.note)+'</span>':'')+(c?'<span>'+esc(c.name)+'</span>':'')+
 (x.done?'<span>'+u('w_doneat')+' '+hhmm(x.done)+'</span>':'')+'</div>'+taskLegs(x)+'</div>'+
 (x.mode==='offers'&&x.status==='open'?
  (best?'<span class="mono" style="color:var(--money);font-size:12px">'+u('tk_from')+' '+aed(best.price)+'</span>':'')
  :'<span class="mono" style="color:var(--money);font-size:12px">'+aed(x.fee)+'</span>')+
 (forCleaner&&x.status==='open'?'<button class="btn gold" onclick="claimTask(\''+x.id+'\')">'+
   (x.mode==='offers'?(myOffer(x)?u('tk_changebid'):u('tk_bid')):t('claim'))+'</button>':'')+
 (!forCleaner&&x.status==='open'&&x.mode==='offers'&&taskOffers(x).length?
   '<button class="btn" onclick="viewOffers(\''+x.id+'\')">'+u('tk_seebids')+'</button>':'')+
 (forCleaner&&x.status==='taken'&&x.by===session.id?'<button class="btn" onclick="finishTask(\''+x.id+'\')">'+t('finish')+'</button>':'')+
 (!forCleaner&&x.status==='open'?'<span class="st">'+u('s_unclaimed')+'</span>':'')+'</div>'}
function vSchedule(){
 var start=todayStr(),days=[];
 for(var i=-1;i<7;i++)days.push(addDays(start,i));
 var sel=calFor();
 var h='<div class="card"><div class="card-h">'+ic('clock')+'<h3>'+u('cal_week')+'</h3><div class="right">'+
  '<button class="btn ghost" onclick="calShift(-1)">&larr;</button>'+
  '<button class="btn ghost" onclick="calToday()">'+u('cal_today')+'</button>'+
  '<button class="btn ghost" onclick="calShift(1)">&rarr;</button>'+
  '<button class="btn ghost" onclick="printDay(\''+sel+'\')">'+u('pr_btn')+'</button>'+
  '<select onchange="if(this.value)copyDay(\''+sel+'\',this.value);this.value=\'\'" style="width:auto;font-size:11.5px;padding:5px">'+
  '<option value="">'+u('cp_btn')+'</option>'+
  [1,2,3,4,5,6,7].map(function(k){var d=addDays(sel,k);
    return '<option value="'+d+'">'+dayName(d)+'</option>'}).join('')+'</select>'+
  '<button class="btn" onclick="newJobOn(\''+sel+'\')">'+u('b_addjob')+'</button></div></div>'+
  '<div style="display:flex;gap:5px;padding:11px 13px;overflow-x:auto">';
 days.forEach(function(d){
  var n=jobsOn(d).filter(function(j){return j.status!=='cancelled'}).length;
  var money=jobsOn(d).filter(function(j){return j.status!=='cancelled'}).reduce(function(a,j){return a+j.price},0);
  h+='<button class="btn '+(d===sel?'':'ghost')+'" style="flex:1;min-width:96px;padding:9px 7px;text-align:center" '+
   'onclick="setCalDay(\''+d+'\')">'+
   '<div style="font-size:11px">'+dayName(d)+'</div>'+
   '<div style="font-size:15px;font-weight:600;margin-top:2px">'+n+'</div>'+
   '<div style="font-size:9.5px;opacity:.7">'+(money?aed(money):'—')+'</div></button>';
 });
 h+='</div></div>';

 var list=jobsOn(sel).sort(function(a,b){return a.time.localeCompare(b.time)});
 h+='<div class="card"><div class="card-h"><h3>'+dayName(sel)+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+list.length+' '+u('c_jobs')+'</span></div></div>';
 if(!list.length)h+='<div class="empty"><b>'+u('cal_empty')+'</b>'+u('cal_emptysub')+'</div>';
 else list.forEach(function(j){h+=jobRow(j)});
 h+='</div>';

 /* what the contracts would put on this day */
 var p=sel.split('-'),dow=new Date(+p[0],+p[1]-1,+p[2]).getDay();
 var due=db.contracts.filter(function(r){return r.active!==false&&r.days.indexOf(dow)>-1});
 if(due.length){
  var missing=due.filter(function(r){return !jobsOn(sel).some(function(j){return j.contract===r.id||(j.prop===r.prop&&j.time===r.time)})});
  h+='<div class="card"><div class="card-h">'+ic('repeat')+'<h3>'+u('cal_contracts')+'</h3><div class="right">'+
   (missing.length?'<button class="btn" onclick="generateOn(\''+sel+'\')">'+u('cal_generate')+' ('+missing.length+')</button>':
     '<span style="font-size:11px;color:var(--teal)">'+u('cal_allmade')+'</span>')+'</div></div>';
  due.forEach(function(r){
   var made=!missing.some(function(x){return x.id===r.id});
   h+='<div class="row"><span class="dot'+(made?' run':'')+'"></span><div class="grow">'+
    '<div class="name">'+esc(r.prop)+'</div><div class="meta"><span>'+r.time+'</span>'+
    '<span>'+esc(cleaner(r.cleaner).name)+'</span><span>'+(made?u('cal_made'):u('cal_notmade'))+'</span></div></div>'+
    '<span class="mono" style="color:var(--faint);font-size:11.5px">'+aed(r.price)+'</span></div>';
  });
  h+='</div>';
 }
 return h;
}
function vAvailability(){
 var days=[];for(var i=0;i<7;i++)days.push(addDays(todayStr(),i));
 var h='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('av_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('av_note')+'</span></div></div>'+
  '<table><tr><th>'+u('h_cleaner')+'</th>'+days.map(function(d){
   return '<th class="num" style="font-size:10px">'+dayName(d).slice(0,3)+'</th>'}).join('')+'</tr>';
 crew().forEach(function(c){
  h+='<tr><td>'+esc(c.name)+'</td>';
  days.forEach(function(d){
   var off=isOff(c.id,d);
   var n=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&jobDate(j)===d&&j.status!=='cancelled'}).length;
   h+='<td class="num"><button class="btn '+(off?'':'ghost')+'" style="font-size:10.5px;padding:3px 7px;'+
    (off?'background:var(--red);color:#fff':'')+'" onclick="toggleOff(\''+c.id+'\',\''+d+'\')">'+
    (off?u('av_offshort'):(n||'·'))+'</button></td>';
  });
  h+='</tr>';
 });
 h+='</table></div>';
 /* anything already double-booked */
 var bad=[];
 db.jobs.forEach(function(j){
  if(j.status==='cancelled')return;
  teamOf(j).forEach(function(cid){
   var cl=clashes(cid,jobDate(j),j.time,j.service,j.tier,j.id);
   cl.forEach(function(o){if(o.id>j.id)bad.push([cleaner(cid).name,j,o])});
   if(isOff(cid,jobDate(j)))bad.push([cleaner(cid).name,j,null]);
  });
 });
 h+='<div class="card'+(bad.length?' alert':'')+'"><div class="card-h">'+ic('alert')+
  '<h3'+(bad.length?' style="color:var(--red)"':'')+'>'+u('av_conflicts')+'</h3></div>';
 if(!bad.length)h+='<div class="empty"><b>'+u('av_none')+'</b>'+u('av_nonesub')+'</div>';
 else bad.forEach(function(b){
  h+='<div class="row"><span class="dot prob"></span><div class="grow">'+
   '<div class="name">'+esc(b[0])+'</div><div class="meta"><span>'+dayName(jobDate(b[1]))+'</span>'+
   '<span>'+b[1].time+' '+esc(b[1].prop)+'</span>'+
   (b[2]?'<span style="color:var(--red)">'+u('av_overlaps')+' '+b[2].time+' '+esc(b[2].prop)+'</span>'
        :'<span style="color:var(--red)">'+u('av_offthatday')+'</span>')+'</div></div>'+
   '<button class="btn ghost" onclick="openJob('+b[1].id+')">'+u('b_edit')+'</button></div>';
 });
 return h+'</div>';
}
function vSupplies(){
 var h='<div class="card"><div class="card-h">'+ic('box')+'<h3>'+u('inv_mykit')+'</h3><div class="right">'+
  '<button class="btn" onclick="reportUsed()">'+u('inv_report')+'</button></div></div>';
 stock().forEach(function(it){
  var low=it.qty<it.min;
  h+='<div class="row"><span class="dot'+(low?' prob':'')+'"></span><div class="grow">'+
   '<div class="name">'+esc(it.item)+'</div><div class="meta"><span>'+it.qty+' '+esc(it.unit||'')+
   (low?' · '+u('inv_low'):'')+'</span></div></div>'+
   '<button class="btn ghost" onclick="requestItem(\''+it.id+'\')">'+u('inv_ask')+'</button></div>';
 });
 return h+'</div>';
}
function vStatement(id){open={type:'statement',inv:id};render()}
function vMoney(){
 var h='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('bill_ready')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('bill_note')+'</span></div></div>';
 var any=false;
 customers().forEach(function(cu){
  var val=unbilledValue(cu.name),n=unbilled(cu.name).length;
  if(!n)return;any=true;
  h+='<div class="row"><span class="dot gold"></span><div class="grow">'+
   '<div class="name">'+esc(cu.name)+'</div><div class="meta"><span>'+n+' '+u('bill_jobs')+'</span>'+
   '<span>'+unbilled(cu.name).slice(0,3).map(function(j){return dayName(jobDate(j))+' '+esc(j.prop.split('—')[0].trim())}).join(', ')+
   (n>3?' +'+(n-3):'')+'</span></div></div>'+
   '<span class="mono" style="color:var(--teal)">'+aed(val)+'</span>'+
   '<button class="btn" onclick="buildInvoice(\''+jarg(cu.name)+'\')">'+u('bill_create')+'</button></div>';
 });
 if(!any)h+='<div class="empty"><b>'+u('bill_allbilled')+'</b>'+u('bill_allbilledsub')+'</div>';
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('board')+'<h3>'+u('pf_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('pf_note')+'</span></div></div><table>'+
  '<tr><th>'+u('h_customer')+'</th><th class="num">'+u('h_done')+'</th><th class="num">'+u('pf_rev')+'</th>'+
  '<th class="num">'+u('pf_lab')+'</th><th class="num">'+u('pf_sup')+'</th><th class="num">'+u('pf_profit')+'</th>'+
  '<th class="num">'+u('pf_margin')+'</th></tr>';
 customers().forEach(function(cu){
  var p=customerProfit(cu.name);
  if(!p.jobs)return;
  h+='<tr><td>'+esc(cu.name)+'</td><td class="num mono">'+p.jobs+'</td>'+
   '<td class="num mono">'+aed(p.rev)+'</td>'+
   '<td class="num mono" style="color:var(--faint)">'+aed(p.lab)+'</td>'+
   '<td class="num mono" style="color:var(--faint)">'+aed(p.sup)+'</td>'+
   '<td class="num mono"'+(p.profit<0?' style="color:var(--red)"':'')+'>'+aed(p.profit)+'</td>'+
   '<td class="num mono"'+(p.margin<25?' style="color:var(--amber)"':'')+'>'+p.margin+'%</td></tr>';
 });
 h+='</table></div>';

 var who=stWho||(customers()[0]||{}).name||'';
 var sf=stFrom||addDays(todayStr(),-30),st2=stTo||todayStr();
 var stat=who?statementFor(who,sf,st2):null;
 h+='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('sm_title')+'</h3><div class="right">'+
  '<select onchange="setStWho(this.value)" style="width:auto;font-size:11.5px;padding:5px">'+
  customers().map(function(c){return '<option'+(who===c.name?' selected':'')+'>'+esc(c.name)+'</option>'}).join('')+'</select>'+
  '<button class="btn ghost" onclick="exportStatement()">'+u('b_export')+'</button></div></div>';
 if(stat){
  h+='<div class="row"><div class="grow"><div class="meta" style="margin:0">'+
   '<span>'+u('sm_work')+' <b class="mono" style="color:var(--text)">'+aed(stat.work)+'</b></span>'+
   '<span>'+u('sm_billed')+' <b class="mono" style="color:var(--text)">'+aed(stat.billed)+'</b></span>'+
   '<span>'+u('d_paid')+' <b class="mono" style="color:var(--teal)">'+aed(stat.paid)+'</b></span>'+
   '<span>'+u('c_outstanding')+' <b class="mono" style="color:var(--amber)">'+aed(stat.due)+'</b></span></div></div></div>';
  stat.jobs.slice(0,12).forEach(function(j){
   h+='<div class="row"><span class="dot"></span><div class="grow"><div class="name" style="font-weight:400">'+
    esc(j.prop)+'</div><div class="meta"><span>'+dayName(jobDate(j))+'</span><span>'+esc(svc(j.service))+'</span></div></div>'+
    '<span class="mono">'+aed(j.status==='cancelled'?j.cancel.fee:j.price)+'</span></div>';
  });
 }
 h+='</div>';

 var runs=billingRuns(),dueRuns=dueBillingRuns();
 h+='<div class="card"><div class="card-h">'+ic('repeat')+'<h3>'+u('rb_title')+'</h3><div class="right">'+
  (dueRuns.length?'<button class="btn" onclick="runBilling()">'+u('rb_run')+' ('+dueRuns.length+')</button>':
   '<span style="font-size:11px;color:var(--faint)">'+u('rb_none')+'</span>')+'</div></div>';
 customers().forEach(function(c){
  var r=runs.filter(function(x){return x.customer===c.name})[0];
  h+='<div class="row"><span class="dot'+(r?' run':'')+'"></span><div class="grow">'+
   '<div class="name">'+esc(c.name)+'</div><div class="meta">'+
   (r?'<span>'+u('rb_onday')+' '+r.day+'</span>'+(r.last?'<span>'+u('rb_last')+' '+ymd(new Date(r.last))+'</span>':''):
      '<span>'+u('rb_manual')+'</span>')+'</div></div>'+
   '<select onchange="setAutoBill(\''+jarg(c.name)+'\',parseInt(this.value,10))" style="width:auto;font-size:11.5px;padding:5px">'+
   '<option value="0">'+u('rb_manual')+'</option>'+
   [1,15,25,28].map(function(d){return '<option value="'+d+'"'+(r&&r.day===d?' selected':'')+'>'+u('rb_day')+' '+d+'</option>'}).join('')+
   '</select></div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('card')+'<h3>'+u('ex_title')+'</h3><div class="right">'+
  '<span class="mono" style="color:var(--faint)">'+aed(expenseTotal())+'</span>'+
  '<button class="btn" onclick="addExpense()">'+u('ex_add')+'</button></div></div>';
 if(!expenses().length)h+='<div class="empty"><b>'+u('ex_none')+'</b>'+u('ex_nonesub')+'</div>';
 else expenses().slice(0,20).forEach(function(x){
  h+='<div class="row"><span class="dot"></span><div class="grow">'+
   '<div class="name">'+esc(x.kind)+(x.note?'<span style="color:var(--faint);font-weight:400">'+esc(x.note)+'</span>':'')+'</div>'+
   '<div class="meta"><span>'+dayName(x.date||todayStr())+'</span>'+
   (x.by?'<span>'+esc(cleaner(x.by).name)+'</span>':'')+'</div></div>'+
   '<span class="mono">'+aed(x.amount)+'</span></div>';
 });
 return h+'</div>';
}
function vKeys(){
 var h='<div class="card"><div class="card-h">'+ic('key')+'<h3>'+u('ky_title')+'</h3><div class="right">'+
  '<button class="btn" onclick="addKey()">'+u('ky_add')+'</button></div></div>';
 if(!keys().length)h+='<div class="empty"><b>'+u('ky_none')+'</b>'+u('ky_nonesub')+'</div>';
 else keys().forEach(function(k){
  var out=k.holder!=='office';
  h+='<div class="row"><span class="dot'+(k.holder==='lost'?' prob':(out?' gold':''))+'"></span>'+
   '<div class="grow"><div class="name">'+esc(k.prop)+'<span style="color:var(--faint);font-weight:400">'+esc(k.label)+'</span></div>'+
   '<div class="meta"><span>'+u('ky_with')+' '+esc(holderName(k.holder))+'</span>'+
   '<span>'+u('ky_since')+' '+dayName(ymd(new Date(k.since)))+'</span>'+
   (k.log&&k.log.length?'<span>'+k.log.length+' '+u('ky_moves')+'</span>':'')+'</div></div>'+
   '<button class="btn ghost" onclick="handKey(\''+k.id+'\')">'+u('ky_hand')+'</button>'+
   '<button class="btn ghost" onclick="removeKey(\''+k.id+'\')">'+u('b_remove')+'</button></div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('box')+'<h3>'+u('gr_title')+'</h3><div class="right">'+
  '<button class="btn" onclick="addGear()">'+u('gr_add')+'</button></div></div>';
 if(!gear().length)h+='<div class="empty"><b>'+u('gr_none')+'</b>'+u('gr_nonesub')+'</div>';
 else gear().forEach(function(g){
  h+='<div class="row"><span class="dot'+(g.status==='broken'?' prob':'')+'"></span>'+
   '<div class="grow"><div class="name">'+esc(g.name)+
   (g.status==='broken'?'<span class="pill" style="color:var(--red);border-color:#3E2226">'+u('gr_broken')+'</span>':'')+
   (serviceDue(g)?'<span class="pill prem">'+u('gr_servicedue')+'</span>':'')+'</div>'+
   '<div class="meta">'+(g.serial?'<span class="mono">'+esc(g.serial)+'</span>':'')+
   '<span>'+u('ky_with')+' '+esc(holderName(g.holder))+'</span>'+
   (g.service?'<span>'+u('gr_service')+' '+g.service+'</span>':'')+'</div></div>'+
   '<select onchange="moveGear(\''+g.id+'\',this.value)" style="width:auto;font-size:11.5px;padding:5px">'+
   '<option value="office"'+(g.holder==='office'?' selected':'')+'>'+u('ky_office')+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'"'+(g.holder===c.id?' selected':'')+'>'+esc(c.name)+'</option>'}).join('')+
   '</select>'+
   '<button class="btn ghost" onclick="gearStatus(\''+g.id+'\',\''+(g.status==='broken'?'ok':'broken')+'\')">'+
   (g.status==='broken'?u('gr_fixed'):u('gr_report'))+'</button></div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('clock')+'<h3>'+u('sh_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('sh_note')+'</span></div></div><table>'+
  '<tr><th>'+u('h_cleaner')+'</th><th class="num">'+u('sh_today')+'</th><th class="num">'+u('sh_week')+'</th>'+
  '<th class="num">'+u('sh_jobs')+'</th><th>'+u('sh_status')+'</th></tr>';
 crew().forEach(function(c){
  var today=shifts().filter(function(s2){return s2.by===c.id&&s2.date===todayStr()});
  var open2=today.filter(function(s2){return !s2.out})[0];
  var th=today.reduce(function(a,s2){return a+hrs(s2.in,s2.out||Date.now())},0);
  var wh=shiftHours(c.id,addDays(todayStr(),-6));
  var jh=db.jobs.filter(function(j){return teamOf(j).indexOf(c.id)>-1&&j.finished&&isToday(j)})
   .reduce(function(a,j){return a+hrs(j.started,j.finished)},0);
  h+='<tr><td>'+esc(c.name)+'</td><td class="num mono">'+th.toFixed(1)+'</td>'+
   '<td class="num mono">'+wh.toFixed(1)+'</td>'+
   '<td class="num mono" style="color:var(--faint)">'+jh.toFixed(1)+'</td>'+
   '<td>'+(open2?'<span class="st run">'+u('sh_working')+' '+hhmm(open2.in)+'</span>'+
     (open2.inAt?' <a class="wa" style="padding:2px 7px;font-size:10.5px" href="https://www.google.com/maps?q='+
       open2.inAt.lat+','+open2.inAt.lng+'" target="_blank" rel="noopener">'+u('sh_where')+'</a>':
       ' <span class="st" style="color:var(--faint)">'+u('sh_nopin')+'</span>')
    :'<span class="st">'+u('sh_notworking')+'</span>')+'</td></tr>';
 });
 return h+'</table></div>';
}
function vPublicBook(){
 return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+esc(db.company)+'</h1>'+
  '<p>'+u('pb_title')+'</p></div>'+
  '<div class="panel">'+
  '<div class="field"><label for="pb-name">'+u('pb_name')+'</label><input id="pb-name"></div>'+
  '<div class="field"><label for="pb-phone">'+u('f_whatsapp')+'</label><input id="pb-phone"></div>'+
  '<div class="field"><label for="pb-prop">'+u('pb_where')+'</label><input id="pb-prop"></div>'+
  '<div class="field"><label for="pb-when">'+u('f_when')+'</label><input id="pb-when" placeholder="'+u('pb_whenex')+'"></div>'+
  '<div class="field"><label for="pb-serv">'+u('f_service')+'</label><select id="pb-serv">'+
  '<option>Standard</option><option>Deep clean</option><option>Move-out</option><option>Turnover</option></select></div>'+
  '<div class="field"><label for="pb-note">'+u('f_anything')+'</label><textarea id="pb-note"></textarea></div>'+
  '<button class="btn big" onclick="sendPublicBooking()">'+u('pb_send')+'</button></div></div></div>';
}
function vSales(){
 var h='';
 var due=dueReminders(),rvd=reviewDue();
 if(due.length){
  h+='<div class="card"><div class="card-h">'+ic('bell')+'<h3>'+u('rm_title')+'</h3><div class="right">'+
   '<button class="btn" onclick="remindAll()">'+u('rm_markall')+'</button></div></div>';
  due.forEach(function(j){
   var cu=customerByName(j.customer);
   h+='<div class="row"><span class="dot gold"></span><div class="grow">'+
    '<div class="name">'+esc(j.prop)+'</div><div class="meta"><span>'+esc(j.customer)+'</span><span>'+j.time+'</span></div></div>'+
    (cu&&cu.phone?'<a class="wa" href="'+wa(cu.phone,reminderText(j))+'" target="_blank" rel="noopener" onclick="markReminded('+j.id+')">'+ic('wa')+u('rm_send')+'</a>':'')+
    (cu&&cu.email?'<a class="btn ghost" href="'+esc(mailto(cu.email,db.company+' — '+u('rm_title'),reminderText(j)))+'" onclick="markReminded('+j.id+')">'+u('gp_email')+'</a>':'')+
    (!(cu&&(cu.phone||cu.email))?'<button class="btn ghost" onclick="markReminded('+j.id+')">'+u('rm_done')+'</button>':'')+'</div>';
  });
  h+='</div>';
 }
 if(rvd.length){
  h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('rv_title')+'</h3></div>';
  rvd.slice(0,6).forEach(function(j){
   var cu=customerByName(j.customer);
   h+='<div class="row"><span class="dot"></span><div class="grow">'+
    '<div class="name">'+esc(j.prop)+'<span class="pill prem">'+j.rating+'★</span></div>'+
    '<div class="meta"><span>'+esc(j.customer)+'</span></div></div>'+
    (cu&&cu.phone?'<a class="wa" href="'+wa(cu.phone,reviewText(j))+'" target="_blank" rel="noopener" onclick="askReview('+j.id+')">'+ic('wa')+u('rv_ask_btn')+'</a>':'')+
    '<button class="btn ghost" onclick="askReview('+j.id+')">'+u('rv_done')+'</button></div>';
  });
  h+='</div>';
 }

 h+='<div class="card"><div class="card-h">'+ic('zap')+'<h3>'+u('sl_title')+'</h3><div class="right">'+
  (cloud.on?'<button class="btn ghost" onclick="copyBookingLink()">'+u('pb_link')+'</button>':'')+
  '<button class="btn" onclick="addLead()">'+u('sl_add')+'</button></div></div>';
 var open2=leads().filter(function(l){return l.status!=='lost'&&l.status!=='won'});
 if(!open2.length)h+='<div class="empty"><b>'+u('sl_none')+'</b>'+u('sl_nonesub')+'</div>';
 else open2.forEach(function(l){
  h+='<div class="row"><span class="dot'+(l.status==='new'?' gold':'')+'"></span><div class="grow">'+
   '<div class="name">'+esc(l.name)+'<span class="pill">'+esc(l.source)+'</span></div>'+
   '<div class="meta">'+(l.prop?'<span>'+esc(l.prop)+'</span>':'')+
   (l.note?'<span>'+esc(l.note)+'</span>':'')+'<span>'+dayName(ymd(new Date(l.at)))+'</span></div></div>'+
   (l.phone?'<a class="wa" href="'+wa(l.phone,db.company)+'" target="_blank" rel="noopener">'+ic('wa')+'</a>':'')+
   '<button class="btn" onclick="newQuote(\''+l.id+'\')">'+u('qt_quote')+'</button>'+
   '<button class="btn ghost" onclick="dropLead(\''+l.id+'\')">'+u('sl_drop')+'</button></div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('qt_title')+'</h3><div class="right">'+
  '<button class="btn" onclick="newQuote(null)">'+u('qt_new')+'</button></div></div>';
 if(!quotes().length)h+='<div class="empty"><b>'+u('qt_none')+'</b>'+u('qt_nonesub')+'</div>';
 else quotes().forEach(function(q){
  h+='<div class="row"><span class="dot'+(q.status==='accepted'?' run':q.status==='lost'?' prob':' gold')+'"></span>'+
   '<div class="grow"><div class="name">'+esc(q.who)+'<span style="color:var(--faint);font-weight:400">'+esc(q.prop)+'</span></div>'+
   '<div class="meta"><span class="mono">'+q.id+'</span><span>'+esc(q.service)+' · '+TIERS[q.tier].name+'</span>'+
   '<span>'+q.beds+'b '+q.baths+'ba</span><span>'+u('qt_validto')+' '+q.valid+'</span>'+
   '<span>'+esc(q.status)+'</span></div></div>'+
   '<span class="mono" style="color:var(--teal)">'+aed(q.price)+'</span>'+
   (q.phone?'<a class="wa" href="'+wa(q.phone,quoteText(q))+'" target="_blank" rel="noopener">'+ic('wa')+'</a>':'')+
   (q.status==='sent'?'<button class="btn" onclick="acceptQuote(\''+q.id+'\')">'+u('qt_won')+'</button>'+
     '<button class="btn ghost" onclick="rejectQuote(\''+q.id+'\')">'+u('qt_lost')+'</button>':'')+'</div>';
 });
 return h+'</div>';
}
function vPeople(){
 var p=payPeriod();
 var h='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('lv_title')+'</h3></div><table>'+
  '<tr><th>'+u('h_cleaner')+'</th><th class="num">'+u('lv_allowance')+'</th><th class="num">'+u('lv_taken')+'</th>'+
  '<th class="num">'+u('lv_left')+'</th><th></th></tr>';
 crew().forEach(function(c){
  var left=leaveLeft(c);
  h+='<tr><td>'+esc(c.name)+'</td><td class="num mono">'+leaveEntitlement(c)+'</td>'+
   '<td class="num mono">'+leaveTaken(c.id)+'</td>'+
   '<td class="num mono"'+(left<5?' style="color:var(--amber)"':'')+'>'+left+'</td>'+
   '<td class="num"><button class="btn ghost" onclick="addLeave(\''+c.id+'\')">'+u('lv_book')+'</button></td></tr>';
 });
 h+='</table>';
 if(leave().length){
  leave().slice(0,10).forEach(function(l){
   h+='<div class="row"><span class="dot"></span><div class="grow">'+
    '<div class="name">'+esc(cleaner(l.by).name)+'<span class="pill">'+esc(l.kind)+'</span></div>'+
    '<div class="meta"><span>'+l.from+'</span><span>'+l.days+' '+u('lv_days_l')+'</span>'+
    (l.note?'<span>'+esc(l.note)+'</span>':'')+'</div></div>'+
    '<button class="btn ghost" onclick="cancelLeave(\''+l.id+'\')">'+u('b_cancel')+'</button></div>';
  });
 }
 h+='</div>';

 var exp=expiringDocs();
 h+='<div class="card'+(exp.some(function(d){return docDaysLeft(d)<0})?' alert':'')+'"><div class="card-h">'+ic('receipt')+
  '<h3'+(exp.length?' style="color:var(--amber)"':'')+'>'+u('dc_title')+'</h3><div class="right">'+
  '<button class="btn" onclick="addDoc(null)">'+u('dc_add')+'</button></div></div>';
 if(!docs().length)h+='<div class="empty"><b>'+u('dc_none')+'</b>'+u('dc_nonesub')+'</div>';
 else docs().slice().sort(function(a,b){return docDaysLeft(a)-docDaysLeft(b)}).forEach(function(d){
  var left=docDaysLeft(d);
  h+='<div class="row"><span class="dot'+(left<0?' prob':(left<=60?' gold':''))+'"></span><div class="grow">'+
   '<div class="name">'+esc(d.kind)+'<span style="color:var(--faint);font-weight:400">'+
   esc(d.by==='company'?db.company:cleaner(d.by).name)+'</span></div>'+
   '<div class="meta">'+(d.ref?'<span class="mono">'+esc(d.ref)+'</span>':'')+
   '<span>'+u('dc_expires')+' '+d.expires+'</span>'+
   '<span style="color:'+(left<0?'var(--red)':(left<=60?'var(--amber)':'var(--faint)'))+'">'+
   (left<0?u('dc_expired')+' '+(-left)+' '+u('dc_daysago'):left+' '+u('dc_daysleft'))+'</span></div></div>'+
   '<button class="btn ghost" onclick="removeDoc(\''+d.id+'\')">'+u('b_remove')+'</button></div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('card')+'<h3>'+u('py_title')+'</h3><div class="right">'+
  '<input type="date" value="'+p.from+'" onchange="setPayFrom(this.value)" style="width:auto;font-size:11.5px;padding:5px">'+
  '<input type="date" value="'+p.to+'" onchange="setPayTo(this.value)" style="width:auto;font-size:11.5px;padding:5px">'+
  '<button class="btn ghost" onclick="exportPayroll()">'+u('py_csv')+'</button>'+
  '<button class="btn" onclick="exportWPS()">'+u('py_wps')+'</button></div></div><table>'+
  '<tr><th>'+u('h_cleaner')+'</th><th class="num">'+u('h_done')+'</th><th class="num">'+u('py_jobhrs')+'</th>'+
  '<th class="num">'+u('py_clockhrs')+'</th><th class="num">'+u('py_basic')+'</th>'+
  '<th class="num">'+u('py_tasks')+'</th><th class="num">'+u('h_total')+'</th></tr>';
 var tot=0;
 payrollRows(p.from,p.to).forEach(function(r){
  tot+=r.total;
  h+='<tr><td>'+esc(r.c.name)+'</td><td class="num mono">'+r.jobs+'</td>'+
   '<td class="num mono">'+r.jobHrs.toFixed(1)+'</td>'+
   '<td class="num mono" style="color:var(--faint)">'+r.clockHrs.toFixed(1)+'</td>'+
   '<td class="num mono">'+aed(r.basic)+'</td>'+
   '<td class="num mono" style="color:var(--gold)">'+(r.bonus?aed(r.bonus):'—')+'</td>'+
   '<td class="num mono">'+aed(r.total)+'</td></tr>';
 });
 h+='<tr><td style="color:var(--faint)">'+u('h_total')+'</td><td></td><td></td><td></td><td></td><td></td>'+
  '<td class="num mono" style="color:var(--teal)">'+aed(tot)+'</td></tr></table></div>';
 return h;
}
function vSafety(){
 var open2=incidents().filter(function(x){return x.status==='open'});
 var h='<div class="card'+(open2.length?' alert':'')+'"><div class="card-h">'+ic('alert')+
  '<h3'+(open2.length?' style="color:var(--red)"':'')+'>'+u('in_title')+'</h3><div class="right">'+
  '<button class="btn red" onclick="addIncident()">'+u('in_add')+'</button></div></div>';
 if(!incidents().length)h+='<div class="empty"><b>'+u('in_none')+'</b>'+u('in_nonesub')+'</div>';
 else incidents().forEach(function(x){
  h+='<div class="row"><span class="dot'+(x.status==='open'?' prob':'')+'"></span><div class="grow">'+
   '<div class="name">'+esc(x.kind)+'<span style="color:var(--faint);font-weight:400">'+esc(x.prop||'—')+'</span>'+
   (x.reported?'<span class="pill prem">'+u('in_reported')+'</span>':'')+'</div>'+
   '<div class="meta"><span class="mono">'+x.id+'</span><span>'+x.date+'</span>'+
   (x.who?'<span>'+esc(cleaner(x.who).name)+'</span>':'')+
   '<span>'+esc(x.what)+'</span>'+(x.action?'<span style="color:var(--teal)">'+esc(x.action)+'</span>':'')+'</div></div>'+
   (x.status==='open'?'<button class="btn ghost" onclick="closeIncident(\''+x.id+'\')">'+u('in_close')+'</button>':
     '<span class="st">'+u('in_closed_l')+'</span>')+'</div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('box')+'<h3>'+u('sf_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('sf_note')+'</span>'+
  '<button class="btn" onclick="addSheet()">'+u('sf_add')+'</button></div></div>';
 if(!sheets().length)h+='<div class="empty"><b>'+u('sf_none')+'</b>'+u('sf_nonesub')+'</div>';
 else sheets().forEach(function(x){
  h+='<div class="row"><span class="dot'+(x.hazard==='Corrosive'||x.hazard==='Toxic'?' prob':'')+'"></span>'+
   '<div class="grow"><div class="name">'+esc(x.name)+'<span class="pill">'+esc(x.hazard)+'</span></div>'+
   '<div class="meta">'+(x.ppe?'<span>'+u('sf_ppe')+': '+esc(x.ppe)+'</span>':'')+
   (x.first?'<span>'+u('sf_first')+': '+esc(x.first)+'</span>':'')+'</div></div>'+
   (x.link?'<a class="wa" href="'+esc(x.link)+'" target="_blank" rel="noopener">'+u('sf_open')+'</a>':'')+
   '<button class="btn ghost" onclick="removeSheet(\''+x.id+'\')">'+u('b_remove')+'</button></div>';
 });
 return h+'</div>';
}
function vFind(){
 var r=findAll();
 var h='<div class="card"><div class="card-h">'+ic('list')+'<h3>'+u('fd_title')+'</h3>'+
  '<div class="right"><button class="btn ghost" onclick="clearFind()">'+u('b_close')+'</button></div></div>'+
  '<div style="padding:11px 13px"><input id="fd-q" placeholder="'+u('fd_ph')+'" value="'+esc(findQ)+'" oninput="setFind(this.value)"></div>';
 if(!r)return h+'<div class="empty"><b>'+u('fd_type')+'</b>'+u('fd_typesub')+'</div></div>';
 var total=r.jobs.length+r.props.length+r.customers.length+r.crew.length+r.invoices.length+r.tasks.length;
 if(!total)return h+'<div class="empty"><b>'+u('fd_nothing')+'</b>'+u('fd_nothingsub')+'</div></div>';
 h+='</div>';
 if(r.jobs.length){h+='<div class="card"><div class="card-h"><h3>'+u('nav_jobs')+'</h3></div>';
  r.jobs.forEach(function(j){h+=jobRow(j)});h+='</div>'}
 if(r.tasks.length){h+='<div class="card"><div class="card-h"><h3>'+u('nav_tasks')+'</h3></div>';
  r.tasks.forEach(function(x){h+=taskRow(x)});h+='</div>'}
 if(r.customers.length){h+='<div class="card"><div class="card-h"><h3>'+u('cu_title')+'</h3></div>';
  r.customers.forEach(function(c){h+='<div class="row"><div class="av">'+esc(c.name.slice(0,2))+'</div>'+
   '<div class="grow"><div class="name">'+esc(c.name)+'</div><div class="meta">'+
   (c.contact?'<span>'+esc(c.contact)+'</span>':'')+'<span>'+custJobs(c.name).length+' '+u('c_jobs')+'</span></div></div>'+
   (c.phone?'<a class="wa" href="'+wa(c.phone,db.company)+'" target="_blank" rel="noopener">'+ic('wa')+'</a>':'')+'</div>'});
  h+='</div>'}
 if(r.props.length){h+='<div class="card"><div class="card-h"><h3>'+u('nav_props')+'</h3></div>';
  r.props.forEach(function(p){h+='<div class="row"><span class="dot"></span><div class="grow">'+
   '<div class="name">'+esc(p.name)+'</div><div class="meta"><span>'+esc(p.area||'')+'</span>'+
   (p.key?'<span>'+esc(p.key)+'</span>':'')+'</div></div>'+
   (p.lat?'<a class="wa" href="'+navLink(p)+'" target="_blank" rel="noopener">'+ic('pin')+'</a>':'')+'</div>'});
  h+='</div>'}
 if(r.crew.length){h+='<div class="card"><div class="card-h"><h3>'+u('nav_team')+'</h3></div>';
  r.crew.forEach(function(c){h+='<div class="row"><div class="av">'+c.initials+'</div><div class="grow">'+
   '<div class="name">'+esc(c.name)+'</div><div class="meta"><span>'+ratingOf(c).toFixed(2)+'★</span></div></div>'+
   '<a class="wa" href="'+wa(c.phone,db.company)+'" target="_blank" rel="noopener">'+ic('wa')+'</a></div>'});
  h+='</div>'}
 if(r.invoices.length){h+='<div class="card"><div class="card-h"><h3>'+u('nav_invoices')+'</h3></div>';
  r.invoices.forEach(function(v){h+='<div class="row"><span class="dot'+(invDue(v)>0.5?' gold':'')+'"></span>'+
   '<div class="grow"><div class="name">'+v.id+'<span style="color:var(--faint);font-weight:400">'+esc(v.customer)+'</span></div>'+
   '<div class="meta"><span>'+aed(invTotal(v))+'</span></div></div>'+
   '<span class="mono">'+aed(invDue(v))+'</span></div>'});
  h+='</div>'}
 return h;
}
function etaBar(j){
 if(j.status!=='sched')return '';
 return '<div style="display:flex;gap:5px;align-items:center;padding:9px 13px;border-top:1px solid var(--line)">'+
  '<span style="font-size:11px;color:var(--muted);flex:1">'+
  (j.eta?u('eta_told')+' '+j.eta.mins+' '+u('eta_mins')+' ('+hhmm(j.eta.at)+')':u('eta_ask'))+'</span>'+
  [15,30,60].map(function(m){return '<button class="btn ghost" style="font-size:11px" onclick="sendEta('+j.id+','+m+')">'+m+'m</button>'}).join('')+
  '</div>';
}
function vWizard(){
 var h='',st=wiz.step;
 h+='<div class="setup-steps">'+
  [1,2,3,4].map(function(n){return '<i class="'+(n<=st?'on':'')+'"></i>'}).join('')+'</div>';
 if(st===1){
  h+='<div class="field"><label for="wz-name">'+u('wz_company')+'</label>'+
   '<input id="wz-name" value="'+esc(wiz.company)+'" placeholder="'+u('wz_companyex')+'"></div>'+
   '<div class="field"><label for="wz-country">'+u('s_country')+'</label><select id="wz-country">'+
   Object.keys(COUNTRIES).map(function(k){return '<option value="'+k+'"'+(wiz.country===k?' selected':'')+'>'+
     COUNTRIES[k].name+' — '+COUNTRIES[k].cur+'</option>'}).join('')+'</select></div>'+
   '<p style="font-size:11.5px;color:var(--faint);margin:0">'+u('wz_note1')+'</p>';
 }
 if(st===2){
  h+='<p style="font-size:12px;color:var(--muted);margin:0 0 9px">'+u('wz_crewnote')+'</p>'+
   '<div class="field"><textarea id="wz-crew" rows="6" placeholder="'+u('wz_crewex')+'">'+
   esc(wiz.crew.map(function(c){return c.name+', '+c.phone+', '+c.lang}).join('\n'))+'</textarea></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('wz_langs')+'</p>';
 }
 if(st===3){
  h+='<p style="font-size:12px;color:var(--muted);margin:0 0 9px">'+u('wz_propnote')+'</p>'+
   '<div class="field"><textarea id="wz-props" rows="6" placeholder="'+u('wz_propex')+'">'+
   esc(wiz.props.map(function(p){return p.name+', '+p.area+', '+p.customer}).join('\n'))+'</textarea></div>';
 }
 if(st===4){
  h+='<div class="panel">'+
   '<div class="kv"><span>'+u('wz_company')+'</span><span>'+esc(wiz.company)+'</span></div>'+
   '<div class="kv"><span>'+u('s_country')+'</span><span>'+esc((COUNTRIES[wiz.country]||{}).name||'')+
   ' · '+esc((COUNTRIES[wiz.country]||{}).cur||'')+'</span></div>'+
   '<div class="kv"><span>'+u('nav_team')+'</span><span>'+wiz.crew.length+'</span></div>'+
   '<div class="kv"><span>'+u('nav_props')+'</span><span>'+wiz.props.length+'</span></div></div>'+
   '<p style="font-size:11.5px;color:var(--muted);margin:11px 0 0">'+u('wz_ready')+'</p>';
 }
 return h;
}
function bulkBar(){
 var n=pickedIds().length;
 if(!n)return '';
 return '<div class="card" style="border-color:#1E4433"><div class="card-h">'+ic('list')+
  '<h3>'+n+' '+u('bk_selected')+'</h3><div class="right">'+
  '<select onchange="bulkAssign(this.value)" style="width:auto;font-size:11.5px;padding:5px">'+
  '<option value="">'+u('bk_assignto')+'</option>'+
  '<option value="">'+u('p_leaveopen')+'</option>'+
  crew().map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join('')+'</select>'+
  '<select onchange="bulkMove(this.value)" style="width:auto;font-size:11.5px;padding:5px">'+
  '<option value="">'+u('bk_moveto')+'</option>'+
  [0,1,2,3,4,5,6].map(function(k){var d=addDays(todayStr(),k);
    return '<option value="'+d+'">'+dayName(d)+'</option>'}).join('')+'</select>'+
  '<button class="btn ghost" onclick="bulkCancel()">'+u('cx_cancel')+'</button>'+
  '<button class="btn ghost" onclick="clearPicked()">'+u('bk_clear')+'</button></div></div></div>';
}
function vCustomer(){
 var c=customerById(openCu);
 if(!c)return vCustomers();
 var js=custJobs(c.name).sort(function(a,b){return (jobDate(b)+b.time).localeCompare(jobDate(a)+a.time)});
 var p=customerProfit(c.name);
 var invs=db.invoices.filter(function(v){return v.customer===c.name});
 var h='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+esc(c.name)+'</h3><div class="right">'+
  (c.phone?'<a class="wa" href="'+wa(c.phone,db.company)+'" target="_blank" rel="noopener">'+ic('wa')+'</a>':'')+
  '<button class="btn ghost" onclick="addCuNote(\''+c.id+'\')">'+u('cn_add')+'</button>'+
  '<button class="btn ghost" onclick="personDataModal(\'customer\',\''+c.id+'\')">'+u('pd_btn')+'</button>'+
  '<button class="btn ghost" onclick="closeCustomer()">'+u('b_close')+'</button></div></div>'+
  '<div class="stats" style="padding:11px 13px">'+
  kpi(u('h_done'),p.jobs,'')+kpi(u('pf_rev'),aed(p.rev),'')+
  kpi(u('pf_profit'),aed(p.profit),p.margin+'%',p.profit<0?'var(--stop)':'var(--done)')+
  kpi(u('c_outstanding'),aed(custOutstanding(c.name)),'')+'</div>';
 if(c.contact||c.phone||c.email)
  h+='<div class="row"><div class="grow"><div class="meta" style="margin:0">'+
   (c.contact?'<span>'+esc(c.contact)+'</span>':'')+(c.phone?'<span>'+esc(c.phone)+'</span>':'')+
   (c.email?'<span>'+esc(c.email)+'</span>':'')+'</div></div></div>';
 h+='</div>';
 var amc=amcFor(c.name);
 if(amc){
  h+='<div class="card"><div class="card-h">'+ic('repeat')+'<h3>'+u('am_title')+'</h3></div>'+
   '<div class="row"><span class="dot'+(amcLeft(amc)?' run':' prob')+'"></span><div class="grow">'+
   '<div class="name">'+amc.id+'</div><div class="meta"><span>'+amc.from+' → '+amc.to+'</span>'+
   '<span>'+amcUsed(amc)+' / '+amc.visits+' '+u('am_visitsused')+'</span>'+
   (amc.value?'<span>'+aed(amc.value)+'</span>':'')+'</div></div>'+
   '<span class="mono" style="color:'+(amcLeft(amc)?'var(--done)':'var(--stop)')+'">'+amcLeft(amc)+' '+u('am_left')+'</span></div></div>';
 }
 if((c.notes||[]).length){
  h+='<div class="card"><div class="card-h">'+ic('list')+'<h3>'+u('cn_title')+'</h3></div>';
  c.notes.forEach(function(n){
   h+='<div class="row"><span class="dot"></span><div class="grow">'+
    '<div class="name" style="font-weight:400">'+esc(n.text)+'</div>'+
    '<div class="meta"><span>'+dayName(ymd(new Date(n.at)))+' '+hhmm(n.at)+'</span></div></div></div>';
  });
  h+='</div>';
 }
 h+='<div class="card"><div class="card-h">'+ic('list')+'<h3>'+u('cn_history')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+js.length+' '+u('c_jobs')+'</span></div></div>';
 if(!js.length)h+='<div class="empty"><b>'+u('cn_nojobs')+'</b></div>';
 else js.slice(0,20).forEach(function(j){h+=jobRow(j)});
 h+='</div>';
 if(invs.length){
  h+='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('nav_invoices')+'</h3></div>';
  invs.forEach(function(v){
   h+='<div class="row"><span class="dot'+(invDue(v)>0.5?' gold':'')+'"></span><div class="grow">'+
    '<div class="name">'+v.id+'</div><div class="meta"><span>'+aed(invTotal(v))+'</span>'+
    '<span>'+u('d_paid')+' '+aed(invPaid(v))+'</span></div></div>'+
    '<span class="mono">'+aed(invDue(v))+'</span>'+
    '<button class="btn ghost" onclick="vStatement(\''+v.id+'\')">'+u('bill_lines')+'</button></div>';
  });
  h+='</div>';
 }
 return h;
}
function vLeaderboard(){
 var rows=leaderboard();
 var h='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('lb_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('lb_note')+'</span></div></div>';
 rows.forEach(function(r,i){
  var medal=i===0?'var(--money)':i===1?'#9AA4B0':i===2?'#A9743F':'var(--line2)';
  h+='<div class="row"><span style="width:20px;text-align:center;font-weight:600;color:'+medal+'">'+(i+1)+'</span>'+
   '<div class="av">'+r.c.initials+'</div><div class="grow">'+
   '<div class="name">'+esc(r.c.name)+(r.c.senior?'<span class="pill">'+u('t_senior')+'</span>':'')+'</div>'+
   '<div class="meta"><span>'+r.rating.toFixed(2)+'★</span><span>'+r.done+' '+u('c_done')+'</span>'+
   '<span>'+r.onTime+'% '+u('k_ontimeshort')+'</span><span>'+r.photos+' '+u('k_photos')+'</span>'+
   (r.tasks?'<span>'+r.tasks+' '+u('nav_tasks')+'</span>':'')+
   (r.disputes?'<span style="color:var(--stop)">'+r.disputes+' '+u('k_disputesshort')+'</span>':'')+'</div></div>'+
   '<span class="mono" style="color:'+medal+'">'+r.score+'</span></div>';
 });
 return h+'</div>';
}
function vRoutePlan(){
 var d=calFor();
 var h='<div class="card"><div class="card-h">'+ic('pin')+'<h3>'+u('ro_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+dayName(d)+'</span></div></div>';
 var any=false,totalKm=0,totalSave=0;
 crew().forEach(function(c){
  var list=routeFor(c.id,d);
  if(!list.length)return;
  any=true;
  var km=routeLength(list),sv=routeSaving(c.id,d);
  totalKm+=km;if(sv)totalSave+=sv.km;
  var placed=list.filter(jobPoint).length;
  h+='<div class="row"><div class="av">'+c.initials+'</div><div class="grow">'+
   '<div class="name">'+esc(c.name)+
   (sv?'<span class="pill prem">'+u('ro_save')+' '+sv.km.toFixed(1)+' km</span>':'')+'</div>'+
   '<div class="meta"><span>'+list.length+' '+u('ro_stops')+'</span>'+
   '<span>'+km.toFixed(1)+' km</span>'+
   (placed<list.length?'<span style="color:var(--late)">'+(list.length-placed)+' '+u('ro_nopin')+'</span>':'')+
   '<span>'+list.map(function(j){return j.time}).join(' → ')+'</span></div></div>'+
   (sv?'<span class="mono" style="color:var(--done);font-size:11.5px">-'+sv.mins+' min</span>'+
     '<button class="btn" onclick="applyRoute(\''+c.id+'\',\''+d+'\')">'+u('ro_fix')+'</button>'
    :'<span class="st">'+u('ro_good')+'</span>')+
   (gRoute(c.id)?'<a class="wa" href="'+gRoute(c.id)+'" target="_blank" rel="noopener">'+ic('pin')+'</a>':'')+
   '</div>';
 });
 if(!any)return h+'<div class="empty"><b>'+u('ro_none')+'</b>'+u('ro_nonesub')+'</div></div>';
 h+='<div class="row"><div class="grow"><div class="name" style="font-weight:400">'+u('ro_total')+'</div>'+
  '<div class="meta"><span>'+u('ro_driving')+'</span></div></div>'+
  '<span class="mono">'+totalKm.toFixed(1)+' km</span>'+
  (totalSave>0.1?'<span class="mono" style="color:var(--done)">-'+totalSave.toFixed(1)+' km</span>':'')+'</div>';
 return h+'</div>';
}
function readingsBlock(j){
 if(!TRADES[tradeOf(j)].readings)return '';
 var d=T[lang]||T.en,r=j.readings||{};
 return '<div style="border-top:1px solid var(--line);margin-top:11px;padding-top:11px">'+
  '<div style="font-size:10.5px;color:var(--muted);margin-bottom:7px">'+d.readings+'</div>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">'+
  READINGS.map(function(x){
   return '<div class="field" style="margin:0"><label for="rd-'+x[0]+'">'+d[x[0]]+' ('+x[1]+')</label>'+
    '<input id="rd-'+x[0]+'" type="number" step="0.1" value="'+esc(r[x[0]]||'')+'" '+
    'oninput="setReading('+j.id+',\''+x[0]+'\',this.value)"></div>';
  }).join('')+'</div>'+
  ((r.tempin&&r.tempout)?'<p style="font-size:11.5px;color:var(--teal);margin:8px 0 0">'+
    d.tempdrop+' '+(Math.round((r.tempin-r.tempout)*10)/10)+'°C'+
    ((r.tempin-r.tempout)<8?' — '+d.weakcooling:'')+'</p>':'')+
  '</div>';
}
function vAssets(){
 var due=assetsDue();
 var h='';
 if(due.length){
  h+='<div class="card alert"><div class="card-h">'+ic('alert')+'<h3 style="color:var(--late)">'+u('as_due')+'</h3>'+
   '<div class="right"><button class="btn" onclick="planMaintenance()">'+u('as_plan')+'</button></div></div>';
  due.forEach(function(a){
   var d=assetDue(a);
   h+='<div class="row"><span class="dot'+(d.over?' prob':' gold')+'"></span><div class="grow">'+
    '<div class="name">'+esc(a.label)+'<span style="color:var(--faint);font-weight:400">'+esc(a.prop)+'</span></div>'+
    '<div class="meta"><span>'+esc(a.kind)+'</span>'+
    (a.last?'<span>'+u('as_last')+' '+a.last+'</span>':'<span style="color:var(--late)">'+u('as_never')+'</span>')+
    (d.over?'<span style="color:var(--stop)">'+d.over+' '+u('as_overdue')+'</span>':
      (d.days!=null?'<span>'+u('as_in')+' '+d.days+' '+u('dc_daysleft')+'</span>':''))+'</div></div></div>';
  });
  h+='</div>';
 }
 h+='<div class="card"><div class="card-h">'+ic('box')+'<h3>'+u('as_title')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+assets().length+' '+u('as_units')+'</span>'+
  '<button class="btn" onclick="addAsset(\'\')">'+u('as_add')+'</button></div></div>';
 if(!assets().length)h+='<div class="empty"><b>'+u('as_none')+'</b>'+u('as_nonesub')+'</div>';
 else {
  var byProp={};
  assets().forEach(function(a){(byProp[a.prop]=byProp[a.prop]||[]).push(a)});
  Object.keys(byProp).sort().forEach(function(prop){
   h+='<div class="row" style="background:#161A21"><div class="grow"><div class="name">'+esc(prop)+'</div>'+
    '<div class="meta"><span>'+byProp[prop].length+' '+u('as_units')+'</span></div></div>'+
    '<button class="btn ghost" onclick="addAsset(\''+jarg(prop)+'\')">'+u('b_add')+'</button></div>';
   byProp[prop].forEach(function(a){
    var hist=serviceHistory(a.id);
    h+='<div class="row"><span class="dot"></span><div class="grow">'+
     '<div class="name" style="font-weight:400">'+esc(a.label)+
     '<span class="pill">'+esc(a.kind)+'</span></div>'+
     '<div class="meta">'+(a.make?'<span>'+esc(a.make)+' '+esc(a.model||'')+'</span>':'')+
     (a.serial?'<span class="id">'+esc(a.serial)+'</span>':'')+
     '<span>'+u('as_every')+' '+a.every+' '+u('as_months')+'</span>'+
     (hist.length?'<span>'+hist.length+' '+u('as_visits')+'</span>':'')+'</div></div>'+
     '<button class="btn ghost" onclick="removeAsset(\''+a.id+'\')">'+u('b_remove')+'</button></div>';
   });
  });
 }
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('repeat')+'<h3>'+u('am_title')+'</h3><div class="right">'+
  '<button class="btn" onclick="addAmc()">'+u('am_add')+'</button></div></div>';
 var live=amcs().filter(function(a){return a.active!==false});
 if(!live.length)h+='<div class="empty"><b>'+u('am_none')+'</b>'+u('am_nonesub')+'</div>';
 else live.forEach(function(a){
  var left=amcLeft(a),used=amcUsed(a);
  h+='<div class="row"><span class="dot'+(left?'':' prob')+'"></span><div class="grow">'+
   '<div class="name">'+esc(a.customer)+'<span class="pill">'+a.id+'</span></div>'+
   '<div class="meta"><span>'+used+' / '+a.visits+' '+u('am_visitsused')+'</span>'+
   '<span>'+a.from+' → '+a.to+'</span>'+
   (a.value?'<span>'+aed(a.value)+'</span>':'')+
   (a.covers?'<span>'+esc(a.covers)+'</span>':'')+
   (left?'':'<span style="color:var(--stop)">'+u('am_exhausted')+'</span>')+'</div></div>'+
   '<span class="mono" style="color:'+(left?'var(--done)':'var(--stop)')+'">'+left+' '+u('am_left')+'</span>'+
   '<button class="btn ghost" onclick="endAmc(\''+a.id+'\')">'+u('am_end')+'</button></div>';
 });
 return h+'</div>';
}
function vAskAccess(){
 if(askAccess==='done')
  return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('req_sent')+'</h1>'+
   '<p>'+u('req_sentsub')+'</p></div>'+
   '<button class="btn ghost big" style="width:100%" onclick="closeAskAccess()">'+u('b_close')+'</button></div></div>';
 return '<div class="login"><div class="lbox"><div class="lhead"><h1>'+u('req_title')+'</h1>'+
  '<p>'+u('req_sub')+'</p></div><div class="panel">'+
  '<div class="field"><label for="ar-ws">'+u('req_which')+'</label><input id="ar-ws" placeholder="gulfshine"></div>'+
  '<div class="field"><label for="ar-name">'+u('req_yourname')+'</label><input id="ar-name"></div>'+
  '<div class="two"><div class="field"><label for="ar-email">'+u('f_email')+'</label><input id="ar-email"></div>'+
  '<div class="field"><label for="ar-phone">'+u('f_whatsapp')+'</label><input id="ar-phone"></div></div>'+
  '<div class="field"><label for="ar-prop">'+u('req_prop')+'</label><input id="ar-prop"></div>'+
  '<button class="btn big" style="width:100%" onclick="sendAccessRequest()">'+u('req_send')+'</button>'+
  '<button class="btn ghost big" style="width:100%;margin-top:8px" onclick="closeAskAccess()">'+u('b_cancel')+'</button>'+
  '</div></div></div>';
}
function vInspect(){
 var todo=needsInspection();
 var h='<div class="card"><div class="card-h">'+ic('alert')+'<h3>'+u('ins_towalk')+'</h3>'+
  '<div class="right"><span style="font-size:11px;color:var(--faint)">'+u('ins_towalknote')+'</span></div></div>';
 if(!todo.length)h+='<div class="empty"><b>'+u('ins_allwalked')+'</b>'+u('ins_allwalkedsub')+'</div>';
 else todo.forEach(function(j){
  var c=j.cleaner?cleaner(j.cleaner):{name:u('p_unassigned')};
  h+='<div class="row"><span class="dot gold"></span><div class="grow">'+
   '<div class="name">'+esc(j.prop)+'</div><div class="meta">'+
   '<span>'+esc(c.name)+'</span><span>'+u('s_done')+' '+hhmm(j.finished)+'</span>'+
   '<span>'+j.checked.length+'/'+checklistFor(j).length+' '+u('ins_claimed')+'</span>'+
   '<span>'+(j.photos||[]).length+' '+u('k_photos')+'</span></div></div>'+
   '<button class="btn" onclick="startInspection('+j.id+')">'+u('ins_walk')+'</button></div>';
 });
 h+='</div>';
 var recent=inspections().slice(0,20),all=inspAvg(function(){return true});
 h+='<div class="card"><div class="card-h">'+ic('list')+'<h3>'+u('ins_recent')+'</h3><div class="right">'+
  (all!=null?'<span class="mono" style="color:var(--faint)">'+u('ins_average')+' '+all+'%</span>':'')+'</div></div>';
 if(!recent.length)h+='<div class="empty"><b>'+u('ins_nonedone')+'</b>'+u('ins_nonedonesub')+'</div>';
 else recent.forEach(function(x){
  var col=x.score>=90?'var(--done)':x.score>=70?'var(--late)':'var(--stop)';
  h+='<div class="row"><span class="dot'+(x.fail?' prob':'')+'"></span><div class="grow">'+
   '<div class="name">'+esc(x.prop)+'</div><div class="meta">'+
   '<span>'+esc(x.cleaner?cleaner(x.cleaner).name:'—')+'</span>'+
   '<span>'+dayName(ymd(new Date(x.at)))+' '+hhmm(x.at)+'</span>'+
   '<span>'+x.pass+' '+u('ins_passed')+(x.fail?' · '+x.fail+' '+u('ins_failedshort'):'')+'</span>'+
   (x.notes?'<span>'+esc(x.notes)+'</span>':'')+'</div></div>'+
   '<span class="mono" style="color:'+col+'">'+x.score+'%</span>'+
   (x.fail?'<button class="btn ghost" onclick="redoFromInspection('+x.job+')">'+u('ins_redo')+'</button>':'')+'</div>';
 });
 h+='</div>';
 h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('ins_byperson')+'</h3></div><table>'+
  '<tr><th>'+u('h_cleaner')+'</th><th class="num">'+u('ins_walked')+'</th>'+
  '<th class="num">'+u('ins_avgscore')+'</th><th class="num">'+u('ins_fails')+'</th></tr>';
 crew().forEach(function(c){
  var mine=inspections().filter(function(x){return x.cleaner===c.id});
  if(!mine.length)return;
  var avg=cleanerScore(c.id),fails=mine.reduce(function(a,x){return a+x.fail},0);
  h+='<tr><td>'+esc(c.name)+'</td><td class="num mono">'+mine.length+'</td>'+
   '<td class="num mono" style="color:'+(avg>=90?'var(--done)':avg>=70?'var(--late)':'var(--stop)')+'">'+avg+'%</td>'+
   '<td class="num mono"'+(fails?' style="color:var(--stop)"':'')+'>'+fails+'</td></tr>';
 });
 return h+'</table></div>';
}
function vRooms(){
 var c=roomCounts();
 var h='<div class="stats">'+ROOM_STATES.map(function(x){
   return kpi(u(x[1]),c[x[0]],'',STATE_COLOUR[x[0]])}).join('')+'</div>';
 h+='<div class="card"><div class="card-h">'+ic('board')+'<h3>'+u('ro_board')+'</h3>'+
  '<div class="right"><span style="font-size:11px;color:var(--faint)">'+u('ro_tap')+'</span></div></div>';
 if(!db.props.length)return h+'<div class="empty"><b>'+u('ro_norooms')+'</b>'+u('ro_noroomssub')+'</div></div>';
 db.props.slice().sort(function(a,b){return a.name.localeCompare(b.name)}).forEach(function(p){
  var st=p.state||'dirty';
  var j=db.jobs.filter(function(x){return x.prop===p.name&&isToday(x)})[0];
  var ins=j?inspectionFor(j.id):null;
  h+='<div class="row"><span class="dot" style="background:'+STATE_COLOUR[st]+'"></span><div class="grow">'+
   '<div class="name">'+esc(p.name)+(p.area?'<span style="color:var(--faint);font-weight:400">'+esc(p.area)+'</span>':'')+'</div>'+
   '<div class="meta">'+
   (p.stateAt?'<span>'+u('ro_since')+' '+hhmm(p.stateAt)+'</span>':'')+
   (p.stateBy&&p.stateBy!=='office'?'<span>'+esc(cleaner(p.stateBy).name)+'</span>':'')+
   (ins?'<span style="color:'+(ins.score>=90?'var(--done)':'var(--late)')+'">'+ins.score+'%</span>':'')+
   '</div></div>'+
   '<div style="display:flex;gap:4px;flex-wrap:wrap">'+
   ROOM_STATES.map(function(x){
    return '<button class="btn '+(st===x[0]?'':'ghost')+'" style="font-size:10.5px;padding:4px 8px'+
     (st===x[0]?';background:'+STATE_COLOUR[x[0]]+';border-color:transparent;color:#0A0D10':'')+'" '+
     'onclick="setRoomState(\''+jarg(p.name)+'\',\''+x[0]+'\')">'+u(x[1])+'</button>';
   }).join('')+'</div>'+
   (j&&j.status==='done'&&!ins?'<button class="btn" onclick="startInspection('+j.id+')">'+u('ins_walk')+'</button>':'')+
   '</div>';
 });
 return h+'</div>';
}
function vPayCfg(){
 var p=payCfg();
 return '<div class="card"><div class="card-h">'+ic('card')+'<h3>'+u('gp_title')+'</h3></div><div style="padding:13px">'+
  '<p style="font-size:11.5px;color:var(--muted);margin:0 0 11px">'+u('gp_intro')+'</p>'+
  '<div class="field"><label for="py-link">'+u('gp_linklabel')+'</label>'+
  '<input id="py-link" value="'+esc(p.link||'')+'" placeholder="https://paypal.me/yourcompany/{amount}"></div>'+
  '<p style="font-size:10.5px;color:var(--faint);margin:-5px 0 11px">'+u('gp_linkhelp')+'</p>'+
  '<div class="two"><div class="field"><label for="py-holder">'+u('gp_holder')+'</label><input id="py-holder" value="'+esc(p.holder||'')+'"></div>'+
  '<div class="field"><label for="py-bank">'+u('gp_bankname')+'</label><input id="py-bank" value="'+esc(p.bank||'')+'"></div></div>'+
  '<div class="two"><div class="field"><label for="py-account">'+u('gp_account')+'</label><input id="py-account" value="'+esc(p.account||'')+'"></div>'+
  '<div class="field"><label for="py-swift">SWIFT / BIC</label><input id="py-swift" value="'+esc(p.swift||'')+'"></div></div>'+
  '<div class="field"><label for="py-mobile">'+u('gp_mobile')+'</label><input id="py-mobile" value="'+esc(p.mobile||'')+'" placeholder="MCB Juice 5 xxx xxxx"></div>'+
  '<div class="field"><label for="py-note">'+u('gp_notelabel')+'</label><input id="py-note" value="'+esc(p.note||'')+'"></div>'+
  '<button class="btn" onclick="savePayCfg()">'+u('b_save')+'</button></div></div>';
}
function vLegal(){
 var co=esc(db.company||u('lg_thecompany')),st=S();
 var contact=[st.officePhone?'+'+esc(st.officePhone):'',esc(st.officeEmail||'')].filter(Boolean).join(' · ');
 var sec=function(t,b){return '<h3 style="font-size:13px;margin:18px 0 6px">'+t+'</h3><p style="font-size:12.5px;color:var(--muted);line-height:1.6;margin:0">'+b+'</p>'};
 return '<div class="login" style="align-items:start"><div class="lbox" style="max-width:640px">'+
  '<div class="lhead"><h1>'+u('lg_title')+'</h1><p>'+co+(contact?' · '+contact:'')+'</p></div>'+
  '<div class="panel">'+
  '<p style="font-size:11.5px;color:var(--faint);margin:0 0 6px">'+u('lg_template')+'</p>'+
  sec(u('lg_who_t'),u('lg_who').replace('{c}',co))+
  sec(u('lg_what_t'),u('lg_what'))+
  sec(u('lg_why_t'),u('lg_why'))+
  sec(u('lg_where_t'),u('lg_where'))+
  sec(u('lg_keep_t'),u('lg_keep'))+
  sec(u('lg_rights_t'),u('lg_rights').replace('{c}',co)+(contact?' '+contact+'.':''))+
  '<h2 style="font-size:15px;margin:26px 0 4px">'+u('lg_terms_t')+'</h2>'+
  sec(u('lg_use_t'),u('lg_use'))+
  sec(u('lg_photos_t'),u('lg_photos'))+
  sec(u('lg_liab_t'),u('lg_liab').replace('{c}',co))+
  '</div>'+
  '<button class="btn ghost big" style="width:100%;margin-top:12px" onclick="closeLegal()">'+u('b_close')+'</button>'+
  '</div></div>';
}
function vPushRow(){
 var supported=pushSupported();
 return '<div class="row"><div class="grow"><div class="name">'+u('ps_title')+'</div>'+
  '<div class="meta"><span>'+(pushOn()?u('ps_onnote'):supported?u('ps_offnote'):u('ps_unsupported'))+'</span>'+
  '<span>'+u('ps_ios')+'</span></div></div>'+
  (supported?(pushOn()?'<button class="btn ghost" onclick="disablePush()">'+u('ps_turnoff')+'</button>'
                      :'<button class="btn" onclick="enablePush()">'+u('ps_turnon')+'</button>'):'')+'</div>';
}

/* ---------------- manager ---------------- */
function vToday(){
 var h=db.setup?'':setupSteps();
 if(openIssues().length||lateJobs().length){
  h+='<div class="card alert"><div class="card-h">'+ic('alert')+'<h3 style="color:var(--red)">'+u('needs_you')+'</h3></div>';
  openIssues().forEach(function(i){h+=issueRow(i)});
  lateJobs().forEach(function(j){h+=jobRow(j)});h+='</div>'}
 if(pending().length){
  h+='<div class="card"><div class="card-h"><h3>'+u('booking_requests')+'</h3></div>';
  pending().forEach(function(r){h+='<div class="row"><span class="dot"></span><div class="grow">'+
   '<div class="name">'+esc(r.prop)+(r.tier==='premium'?'<span class="pill prem">Premium</span>':'<span class="pill">Standard</span>')+'</div>'+
   '<div class="meta"><span>'+esc(r.customer)+'</span><span>'+(r.date?dayName(r.date)+' '+u('bk_at')+' '+r.time:esc(r.when))+'</span><span>'+esc(r.note)+'</span>'+
   (r.deposit?'<span style="color:var(--teal)">deposit '+aed(r.deposit)+' paid</span>':'<span>no deposit</span>')+'</div></div>'+
   '<button class="btn" onclick="acceptReq(\''+r.id+'\')">'+u('b_schedule')+'</button>'+
   '<button class="btn ghost" onclick="declineReq(\''+r.id+'\')">'+u('b_decline')+'</button></div>'});
  h+='</div>'}
 if(openTasks().length){
  h+='<div class="card"><div class="card-h">'+ic('zap')+'<h3>'+u('tasks_waiting')+'</h3><div class="right">'+
   '<button class="btn ghost" onclick="newTask()">'+u('b_posttask')+'</button></div></div>';
  openTasks().forEach(function(x){h+=taskRow(x,false)});h+='</div>'}
 var savings=crew().map(function(c){return routeSaving(c.id,todayStr())}).filter(Boolean);
 if(savings.length){
  var km=savings.reduce(function(a,x){return a+x.km},0);
  var mins=savings.reduce(function(a,x){return a+x.mins},0);
  h+='<div class="card"><div class="card-h">'+ic('pin')+'<h3>'+u('ro_title')+'</h3><div class="right">'+
   '<span style="font-size:11px;color:var(--faint)">'+km.toFixed(1)+' km · '+mins+' min</span>'+
   '<button class="btn" onclick="go(\'routes\')">'+u('ro_look')+'</button></div></div>'+
   '<div style="padding:10px 13px;font-size:12px;color:var(--muted)">'+u('ro_note')+'</div></div>';
 }
 if(waitingAccess().length){
  h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('req_waiting')+'</h3></div>';
  waitingAccess().forEach(function(r){
   h+='<div class="row"><span class="dot gold"></span><div class="grow">'+
    '<div class="name">'+esc(r.name)+'</div><div class="meta">'+
    (r.prop?'<span>'+esc(r.prop)+'</span>':'')+(r.email?'<span>'+esc(r.email)+'</span>':'')+
    (r.phone?'<span>'+esc(r.phone)+'</span>':'')+'</div></div>'+
    '<button class="btn" onclick="approveAccess(\''+r.id+'\')">'+u('req_approve')+'</button>'+
    '<button class="btn ghost" onclick="refuseAccess(\''+r.id+'\')">'+u('req_refuse')+'</button></div>';
  });
  h+='</div>';
 }
 if(canUndo()){
  h+='<div class="card" style="border-color:#3A3320"><div class="card-h">'+ic('clock')+
   '<h3 style="color:var(--late)">'+u('un_title')+'</h3><div class="right">'+
   '<span style="font-size:11px;color:var(--faint)">'+esc(lastUndo().label)+' · '+hhmm(lastUndo().at)+'</span>'+
   '<button class="btn" onclick="undoLast()">'+u('un_btn')+'</button></div></div></div>';
 }
 h+='<div class="card"><div class="card-h">'+ic('bell')+'<h3>'+u('ds_title')+'</h3><div class="right">'+
  '<button class="btn" onclick="sendSummary()">'+ic('wa')+u('ds_send')+'</button></div></div>'+
  '<pre style="margin:0;padding:12px 14px;white-space:pre-wrap;font-family:inherit;font-size:12px;color:var(--muted);line-height:1.6">'+
  esc(daySummary())+'</pre></div>';
 if(backupOverdue()){
  h+='<div class="card alert"><div class="card-h">'+ic('alert')+'<h3 style="color:var(--late)">'+u('bu_title')+'</h3>'+
   '<div class="right"><button class="btn" onclick="backupNow()">'+u('bu_now')+'</button></div></div>'+
   '<div style="padding:11px 13px;font-size:12px;color:var(--muted)">'+u('bu_note')+'</div></div>';
 }
 if(openJobs().length){
  h+='<div class="card"><div class="card-h">'+ic('zap')+'<h3 style="color:var(--gold)">'+u('p_open')+'</h3>'+
   '<div class="right"><span style="font-size:11px;color:var(--faint)">'+u('p_waiting')+'</span></div></div>';
  openJobs().forEach(function(j){h+=jobRow(j)});
  h+='</div>';
 }
 var today=db.jobs.filter(isToday);
 var running=today.filter(function(j){return j.status==='progress'});
 if(running.length){h+='<div class="card"><div class="card-h"><h3>'+u('running_now')+'</h3></div>';
  running.forEach(function(j){h+=jobRow(j)});h+='</div>'}
 var rest=today.filter(function(j){return j.status!=='progress'}),ord={problem:0,sched:1,done:2,cancelled:3};
 rest.sort(function(a,b){return ord[a.status]-ord[b.status]||a.time.localeCompare(b.time)});
 h+='<div class="card"><div class="card-h"><h3>'+u('rest_today')+'</h3><div class="right">'+
 '<button class="btn ghost" onclick="exportCsv()">'+ic('down')+u('b_export')+'</button>'+
 '<button class="btn ghost" onclick="generate()">'+u('b_generate')+'</button>'+
 '<button class="btn" onclick="newJob()">'+u('b_addjob')+'</button></div></div>';
 rest.forEach(function(j){h+=jobRow(j)});return h+'</div>'}
function vTasks(){
 var earned=db.tasks.filter(function(x){return x.status==='done'}).reduce(function(s,x){return s+x.fee},0);
 var h='<div class="card"><div class="card-h">'+ic('zap')+'<h3>'+u('quick_tasks')+'</h3><div class="right">'+
 '<span style="font-size:11.5px;color:var(--faint)">'+u('tk_subtitle')+' · '+aed(earned)+' '+u('tk_earnedtoday')+'</span>'+
 '<button class="btn ghost" onclick="addPlan()">'+u('pn_add')+'</button>'+
 (taskPlans().length?'<button class="btn ghost" onclick="runPlans()">'+u('pn_run')+'</button>':'')+
 '<button class="btn" onclick="newTask()">'+u('b_posttask')+'</button></div></div>';
 if(!db.tasks.length)h+='<div class="empty"><b>'+u('e_noposts')+'</b>Bin runs, parcels, heavy lifts.</div>';
 var ord={open:0,taken:1,done:2};
 db.tasks.slice().sort(function(a,b){return ord[a.status]-ord[b.status]||b.at-a.at}).forEach(function(x){h+=taskRow(x,false)});
 h+='</div>';
 if(taskPlans().length){
  h+='<div class="card"><div class="card-h">'+ic('repeat')+'<h3>'+u('pn_title')+'</h3><div class="right">'+
   '<button class="btn" onclick="runPlans()">'+u('pn_run')+'</button></div></div>';
  taskPlans().forEach(function(p){
   h+='<div class="row"><span class="dot run"></span><div class="grow">'+
    '<div class="name">'+esc(p.custom||ttName(taskType(p.type)))+
    '<span style="color:var(--faint);font-weight:400">'+esc(p.prop)+'</span></div>'+
    '<div class="meta"><span>'+p.days.map(function(d){return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]}).join(' ')+'</span>'+
    '<span>'+(p.fee?aed(p.fee):u('tk_askprice'))+'</span>'+
    (p.last?'<span>'+u('pn_last')+' '+p.last+'</span>':'<span style="color:var(--late)">'+u('pn_notyet')+'</span>')+
    '</div></div>'+
    '<button class="btn ghost" onclick="removePlan(\''+p.id+'\')">'+u('b_remove')+'</button></div>';
  });
  h+='</div>';
 }
 h+='<div class="card"><div class="card-h"><h3>'+u('what_charge')+'</h3></div><table>'+
 '<tr><th>'+u('h_task')+'</th><th class="num">'+u('h_fee')+'</th><th class="num">'+u('h_minutes')+'</th><th class="num">'+u('h_perhour')+'</th></tr>';
 TASK_TYPES.forEach(function(ty){h+='<tr><td>'+ttName(ty)+'</td><td class="num mono">'+aed(ty.fee)+'</td>'+
  '<td class="num mono" style="color:var(--faint)">'+ty.mins+'</td>'+
  '<td class="num mono" style="color:var(--teal)">'+aed(ty.fee/ty.mins*60)+'</td></tr>'});
 return h+'</table></div>'}
function vJobs(){var h='<div class="card"><div class="card-h"><h3>'+u('all_jobs')+'</h3><div class="right">'+
 '<button class="btn ghost" onclick="exportCsv()">'+ic('down')+u('b_export')+'</button>'+
 '<button class="btn" onclick="newJob()">'+u('b_addjob')+'</button></div></div>';
 db.jobs.forEach(function(j){h+=jobRow(j)});return h+'</div>'}
function vRoutes(){
 var h='<div class="card"><div class="card-h">'+ic('clock')+'<h3>'+u('route_check')+'</h3><div class="right">'+
 '<span style="font-size:11px;color:var(--faint)">Straight-line drive estimate between stops</span></div></div>',any=false;
 crew().forEach(function(c){
  var mine=db.jobs.filter(function(j){return j.cleaner===c.id&&j.status!=='cancelled'}).sort(function(a,b){return a.time.localeCompare(b.time)});
  if(mine.length<2)return;any=true;
  h+='<div class="row"><div class="av">'+c.initials+'</div><div class="grow"><div class="name">'+esc(c.name)+'</div>'+
  '<div class="meta"><span>'+mine.length+' '+u('stops')+'</span></div></div></div>';
  for(var k=1;k<mine.length;k++){
   var mn=travel(mine[k-1].prop,mine[k].prop),gap=Math.floor((todayAt(mine[k].time)-todayAt(mine[k-1].time))/MIN);
   var tight=mn!==null&&gap<mn+60,a=property(mine[k-1].prop),b=property(mine[k].prop);
   h+='<div class="row" style="padding-left:44px"><div class="grow">'+
   '<div class="name" style="font-weight:400;font-size:12.5px">'+esc(a?a.area:'?')+' → '+esc(b?b.area:'?')+'</div>'+
   '<div class="meta"><span>'+mine[k-1].time+' → '+mine[k].time+'</span><span>'+gap+'m apart</span></div></div>'+
   '<span class="st'+(tight?' bad':'')+'">'+(mn===null?'—':'~'+mn+'m drive')+'</span>'+(tight?'<span class="st bad">too tight</span>':'')+'</div>'}});
 if(!any)h+='<div class="empty"><b>'+u('e_nocheck')+'</b></div>';return h+'</div>'}
function vContracts(){var D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 var mrr=db.contracts.reduce(function(s,r){return s+r.price*r.days.length*(r.freq==='weekly'?4.33:2.17)},0);
 var h='<div class="card"><div class="card-h">'+ic('repeat')+'<h3>'+u('recurring')+'</h3><div class="right">'+
 '<span class="mono" style="color:var(--teal);font-size:13px">'+aed(mrr)+'<span style="color:var(--faint)">/mo</span></span>'+
 '<button class="btn ghost" onclick="generate()">'+u('b_generate')+'</button><button class="btn" onclick="newContract()">'+u('b_add')+'</button></div></div>';
 if(!db.contracts.length)return h+'<div class="empty"><b>'+u('e_nocontracts')+'</b></div></div>';
 db.contracts.forEach(function(r){h+='<div class="row"><span class="dot"></span><div class="av">'+cleaner(r.cleaner).initials+'</div>'+
 '<div class="grow"><div class="name">'+esc(r.prop)+(r.tier==='premium'?'<span class="pill prem">Premium</span>':'')+
 '<span style="color:var(--faint);font-weight:400">'+esc(r.service)+'</span></div>'+
 '<div class="meta"><span class="mono">'+r.id+'</span><span>'+esc(r.customer)+'</span>'+
 '<span>'+r.freq+' · '+r.days.map(function(d){return D[d]}).join(' ')+'</span><span>'+r.time+'</span></div></div>'+
 '<span class="mono" style="color:var(--faint);font-size:11.5px">'+aed(r.price)+'/visit</span>'+
 '<button class="btn ghost" onclick="delContract(\''+r.id+'\')">'+u('b_remove')+'</button></div>'});
 return h+'</div>'}
function vProps(){var h='<div class="card"><div class="card-h">'+ic('key')+'<h3>'+u('props_access')+'</h3>'+
 '<div class="right"><span style="font-size:11px;color:var(--faint)">'+u('s_shown')+'</span></div></div>';
 db.props.forEach(function(p,i){h+='<div class="row click" onclick="editProp('+i+')"><span class="dot"></span><div class="grow">'+
 '<div class="name">'+esc(p.name)+'<span style="color:var(--faint);font-weight:400">'+esc(p.area)+'</span></div>'+
 '<div class="meta"><span>'+esc(p.key)+'</span>'+(p.park?'<span>'+esc(p.park)+'</span>':'')+
 (p.note?'<span style="color:var(--muted)">'+esc(p.note)+'</span>':'')+'</div></div>'+
 '<button class="btn ghost" onclick="event.stopPropagation();editList('+i+')">'+u('cl_btn')+
 ((p.list&&p.list.length)?' ('+p.list.length+')':'')+'</button>'+
 '<button class="btn ghost" onclick="event.stopPropagation();editProp('+i+')">'+u('b_edit')+'</button></div>'});
 return h+'</div>'}
function vTeam(){
 var h='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('team')+'</h3></div>';
 crew().forEach(function(c){
  var mine=db.jobs.filter(function(j){return j.cleaner===c.id&&j.status!=='cancelled'});
  var tk=db.tasks.filter(function(x){return x.by===c.id&&x.status==='done'});
  var bonus=tk.reduce(function(s,x){return s+x.fee*0.6},0);
  var msg='Hi '+c.name.split(' ')[0]+', today: '+mine.map(function(j){return j.time+' '+j.prop}).join(', ');
  h+='<div class="row"><div class="av">'+c.initials+'</div><div class="grow">'+
  '<div class="name">'+esc(c.name)+(c.senior?'<span class="pill prem">'+u('t_seniorshort')+'</span>':'')+'</div>'+
  '<div class="meta"><span>'+jobsDoneBy(c)+' '+u('c_jobs')+'</span>'+(ratingOf(c)?'<span>'+ratingOf(c).toFixed(2)+'★</span>':'<span>'+u('w_norating')+'</span>')+(onTimeOf(c)!=null?'<span>'+onTimeOf(c)+'% '+u('k_ontimeshort')+'</span>':'')+
  '<span>'+mine.length+' '+u('w_today')+'</span>'+(tk.length?'<span style="color:var(--gold)">'+tk.length+' '+u('w_tasks')+' · '+aed(bonus)+'</span>':'')+
  '<span>'+(T[c.lang]||T.en).name+'</span></div></div>'+
  (c.phone?'<a class="wa" href="'+wa(c.phone,msg)+'" target="_blank" rel="noopener">'+ic('wa')+u('b_send')+'</a>':'')+
  '<button class="btn ghost" onclick="personDataModal(\'cleaner\',\''+c.id+'\')">'+u('pd_btn')+'</button></div>'});
 h+='</div><div class="card"><div class="card-h">'+ic('clock')+'<h3>'+u('hours_pay')+'</h3><div class="right">'+
 '<span style="font-size:11px;color:var(--faint)">'+u('w_fromrecorded')+'</span></div></div><table>'+
 '<tr><th>'+u('h_cleaner')+'</th><th>'+u('h_done')+'</th><th class="num">'+u('h_hours')+'</th><th class="num">'+u('h_rate')+'</th><th class="num">'+u('h_taskshare')+'</th><th class="num">'+u('h_pay')+'</th></tr>';
 var tH=0,tP=0;
 crew().forEach(function(c){
  var fin=db.jobs.filter(function(j){return j.cleaner===c.id&&j.finished});
  var hh=fin.reduce(function(s,j){return s+hrs(j.started,j.finished)},0);
  var bonus=db.tasks.filter(function(x){return x.by===c.id&&x.status==='done'}).reduce(function(s,x){return s+x.fee*0.6},0);
  var pay=hh*c.rate+bonus;tH+=hh;tP+=pay;
  h+='<tr><td>'+esc(c.name)+'</td><td class="mono">'+fin.length+'</td><td class="num mono">'+hh.toFixed(1)+'</td>'+
  '<td class="num mono" style="color:var(--faint)">'+c.rate+'/h</td>'+
  '<td class="num mono" style="color:var(--gold)">'+(bonus?aed(bonus):'—')+'</td>'+
  '<td class="num mono">'+aed(pay)+'</td></tr>'});
 h+='<tr><td style="color:var(--faint)">'+u('h_total')+'</td><td></td><td class="num mono">'+tH.toFixed(1)+'</td><td></td><td></td>'+
 '<td class="num mono" style="color:var(--teal)">'+aed(tP)+'</td></tr></table></div>';return h}
function vIssues(){var h='<div class="card"><div class="card-h">'+ic('alert')+'<h3>'+u('problems')+'</h3></div>';
 if(!db.issues.length)return h+'<div class="empty"><b>'+u('e_nothing')+'</b></div></div>';
 db.issues.slice().sort(function(a,b){return (b.open?1:0)-(a.open?1:0)||b.at-a.at}).forEach(function(i){h+=issueRow(i)});
 return h+'</div>'}
function vStock(){
 var h='';
 if(lowStock().length){
  h+='<div class="card alert"><div class="card-h">'+ic('alert')+'<h3 style="color:var(--red)">'+u('below_min')+'</h3>'+
   '<div class="right"><button class="btn" onclick="newOrder()">'+u('inv_neworder')+'</button></div></div>';
  lowStock().forEach(function(it){
   var d=daysLeft(it);
   h+='<div class="row"><span class="dot prob"></span><div class="grow">'+
    '<div class="name">'+esc(it.item)+'</div><div class="meta"><span>'+it.qty+' '+esc(it.unit||'')+
    ' · '+u('h_min')+' '+it.min+'</span>'+(d!==null?'<span style="color:var(--red)">'+u('inv_runsout')+' '+d+' '+u('inv_days')+'</span>':'')+
    (it.supplier?'<span>'+esc(it.supplier)+'</span>':'')+'</div></div>'+
    '<span class="mono" style="color:var(--faint);font-size:11.5px">'+u('inv_order')+' '+suggestQty(it)+'</span>'+
    '<button class="btn" onclick="restock(\''+jarg(it.item)+'\')">'+u('inv_quickadd')+'</button></div>';
  });
  h+='</div>';
 }
 h+='<div class="card"><div class="card-h">'+ic('box')+'<h3>'+u('inventory')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('inv_value')+' '+aed(stockValue())+'</span>'+
  '<button class="btn ghost" onclick="newOrder()">'+u('inv_neworder')+'</button></div></div><table>'+
  '<tr><th>'+u('h_item')+'</th><th class="num">'+u('h_stock')+'</th><th class="num">'+u('h_min')+'</th>'+
  '<th class="num">'+u('inv_cost')+'</th><th class="num">'+u('inv_worth')+'</th><th class="num">'+u('inv_left')+'</th>'+
  '<th>'+u('inv_supplier')+'</th></tr>';
 stock().forEach(function(it){
  var d=daysLeft(it);
  h+='<tr><td>'+esc(it.item)+'</td>'+
   '<td class="num mono"'+(it.qty<it.min?' style="color:var(--red)"':'')+'>'+it.qty+'</td>'+
   '<td class="num mono" style="color:var(--faint)">'+it.min+'</td>'+
   '<td class="num mono" style="color:var(--faint)">'+aed(it.cost||0)+'</td>'+
   '<td class="num mono">'+aed(it.qty*(it.cost||0))+'</td>'+
   '<td class="num mono"'+(d!==null&&d<14?' style="color:var(--amber)"':'')+'>'+(d===null?'—':d+'d')+'</td>'+
   '<td style="color:var(--faint)">'+esc(it.supplier||'—')+'</td></tr>';
 });
 h+='</table></div>';

 var sup=suppliers();
 if(sup.length){
  h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('sp_title')+'</h3></div>';
  sup.forEach(function(x){
   var low=x.items.filter(function(it){return it.qty<it.min});
   h+='<div class="row"><span class="dot'+(low.length?' prob':'')+'"></span><div class="grow">'+
    '<div class="name">'+esc(x.name)+(low.length?'<span class="pill" style="color:var(--stop);border-color:#4A2226">'+low.length+' '+u('sp_low')+'</span>':'')+'</div>'+
    '<div class="meta"><span>'+x.items.length+' '+u('sp_items')+'</span>'+
    (x.phone?'<span>'+esc(x.phone)+'</span>':'<span style="color:var(--late)">'+u('sp_nonumber')+'</span>')+'</div></div>'+
    '<button class="btn ghost" onclick="setSupplierPhone(\''+jarg(x.name)+'\')">'+u('sp_number')+'</button>'+
    (x.phone?'<a class="wa" href="'+wa(x.phone,orderText(x))+'" target="_blank" rel="noopener">'+ic('wa')+u('sp_send')+'</a>':'')+'</div>';
  });
  h+='</div>';
 }
 if(orders().length){
  h+='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('inv_orders')+'</h3></div>';
  orders().forEach(function(o){
   h+='<div class="row"><span class="dot'+(o.status==='received'?'':' gold')+'"></span><div class="grow">'+
    '<div class="name">'+o.id+'<span style="color:var(--faint);font-weight:400">'+esc(o.supplier)+'</span></div>'+
    '<div class="meta"><span>'+o.lines.length+' '+u('inv_lines')+'</span><span>'+hhmm(o.at)+'</span>'+
    '<span>'+o.lines.map(function(l){var it=stockById(l.item);return (it?esc(it.item):'?')+' ×'+l.qty}).join(', ')+'</span></div></div>'+
    '<span class="mono" style="color:var(--faint)">'+aed(orderTotal(o))+'</span>'+
    (o.status==='open'?'<button class="btn" onclick="receiveOrder(\''+o.id+'\')">'+u('inv_receive')+'</button>'
      :'<span class="st">'+u('inv_receivedshort')+'</span>')+'</div>';
  });
  h+='</div>';
 }

 if(moves().length){
  h+='<div class="card"><div class="card-h">'+ic('clock')+'<h3>'+u('inv_moves')+'</h3></div>';
  moves().slice(0,25).forEach(function(m){
   var it=stockById(m.item);
   h+='<div class="row"><span class="dot'+(m.delta>0?' run':'')+'"></span><div class="grow">'+
    '<div class="name" style="font-weight:400">'+(it?esc(it.item):'?')+
    ' <span class="mono" style="color:'+(m.delta>0?'var(--teal)':'var(--muted)')+'">'+
    (m.delta>0?'+':'')+Math.round(m.delta*100)/100+'</span></div>'+
    '<div class="meta"><span>'+esc(m.reason||'')+'</span>'+
    (m.job?'<span class="mono">'+m.job+'</span>':'')+
    (m.by&&m.by!=='office'?'<span>'+esc(cleaner(m.by).name)+'</span>':'')+'</div></div>'+
    '<span class="st mono">'+hhmm(m.at)+'</span></div>';
  });
  h+='</div>';
 }
 return h;
}
function vInvoices(){var out=0,over=0,got=0;
 db.invoices.forEach(function(v){var b=invDue(v);got+=invPaid(v);if(b>0.5){out+=b;if(v.due<Date.now())over+=b}});
 var h='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('invoices')+'</h3><div class="right">'+
 '<span style="font-size:11.5px;color:var(--faint)">'+(S().taxId?esc(S().idLabel||'')+' '+esc(S().taxId)+' · ':'')+esc(taxLabel())+'</span></div></div>'+
 '<div class="row"><div class="grow"><div class="meta" style="margin:0">'+
 '<span>'+u('c_outstanding')+' <b class="mono" style="color:var(--text)">'+aed(out)+'</b></span>'+
 '<span>'+u('c_overdue')+' <b class="mono" style="color:var(--red)">'+aed(over)+'</b></span>'+
 '<span>'+u('c_collected')+' <b class="mono" style="color:var(--text)">'+aed(got)+'</b></span></div></div></div>'+
 '<table><tr><th>'+u('h_invoice')+'</th><th>'+u('h_customer')+'</th><th>'+u('h_qty')+'</th><th class="num">'+u('h_net')+'</th><th class="num">'+esc(S().taxLabel||'VAT')+'</th><th class="num">'+u('h_total')+'</th><th class="num">'+u('h_due')+'</th><th></th></tr>';
 db.invoices.forEach(function(v){var net=invNet(v),bal=invDue(v),late=v.due<Date.now()&&bal>0.5;
  h+='<tr><td class="mono" style="color:var(--faint)">'+v.id+'</td>'+
  '<td>'+esc(v.customer)+(v.trn?'<div style="font-size:10px;color:var(--faint)" class="mono">'+esc(S().idLabel||'')+' '+esc(v.trn)+'</div>':'')+'</td>'+
  '<td>'+v.jobs+'×'+v.rate+'</td><td class="num mono">'+aed(net)+'</td>'+
  '<td class="num mono" style="color:var(--faint)">'+aed(net*taxRate())+'</td><td class="num mono">'+aed(net*(1+taxRate()))+'</td>'+
  '<td class="num mono"'+(late?' style="color:var(--red)"':'')+'>'+(bal>0.5?aed(bal):'—')+'</td>'+
  '<td>'+(bal>0.5?'<button class="btn ghost" onclick="askPayment(\''+v.id+'\',\'wa\')">'+ic('wa')+u('gp_ask')+'</button>'+
   '<button class="btn ghost" onclick="askPayment(\''+v.id+'\',\'mail\')">'+u('gp_email')+'</button>'+
  '<button class="btn ghost" onclick="takePayment(\''+v.id+'\')">'+u('b_record')+'</button>':u('s_paid'))+
   '<button class="btn ghost" onclick="refund(\''+v.id+'\')">'+u('rf_btn')+'</button>'+
   '<button class="btn ghost" onclick="vStatement(\''+v.id+'\')">'+u('bill_lines')+'</button></td></tr>'});
 return h+'</table></div>'}
function vFeed(){db.read=Date.now();
 var h='<div class="card"><div class="card-h">'+ic('bell')+'<h3>'+u('activity')+'</h3></div>';
 if(!db.feed.length)return h+'<div class="empty"><b>'+u('e_noyet')+'</b></div></div>';
 db.feed.forEach(function(f){h+='<div class="row"><span class="dot"></span><div class="grow">'+
 '<div class="name" style="font-weight:400">'+esc(feedText(f))+'</div></div><span class="st mono">'+hhmm(f.at)+'</span></div>'});
 return h+'</div>'}
function vMap(){
 var pts=db.props.filter(function(p){return p.lat&&p.lng});
 var crewPos=crew().filter(function(c){return c.pos});
 if(!pts.length)return '<div class="card"><div class="empty"><b>'+u('m_nocoords')+'</b>'+u('m_addcoords')+'</div></div>';
 var b=bounds(pts.concat(crewPos.map(function(c){return c.pos}))),W=900,H=440;
 function X(lng){return ((lng-b.minLn)/(b.maxLn-b.minLn))*W}
 function Y(lat){return H-((lat-b.minLa)/(b.maxLa-b.minLa))*H}
 var svg='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block;background:#0F141A">';
 for(var g=0;g<=10;g++){
  svg+='<line x1="'+(g*W/10)+'" y1="0" x2="'+(g*W/10)+'" y2="'+H+'" stroke="#1A222B" stroke-width="1"/>'+
       '<line x1="0" y1="'+(g*H/10)+'" x2="'+W+'" y2="'+(g*H/10)+'" stroke="#1A222B" stroke-width="1"/>';
 }
 /* one route line per cleaner, in the order their jobs run */
 crew().forEach(function(c,i){
  var mine=db.jobs.filter(function(j){return j.cleaner===c.id&&j.status!=='cancelled'})
   .sort(function(a,z){return a.time.localeCompare(z.time)})
   .map(function(j){return property(j.prop)}).filter(function(p){return p&&p.lat});
  if(mine.length<2)return;
  var d='M'+mine.map(function(p){return X(p.lng).toFixed(1)+' '+Y(p.lat).toFixed(1)}).join(' L');
  svg+='<path d="'+d+'" fill="none" stroke="#2DD4BF" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.5"/>';
 });
 pts.forEach(function(p){
  var jobs=db.jobs.filter(function(j){return j.prop===p.name&&j.status!=='cancelled'});
  var col=jobs.some(function(j){return j.status==='problem'})?'#E5484D':
          jobs.some(function(j){return j.status==='progress'})?'#2DD4BF':
          jobs.length?'#7E8794':'#3A434E';
  svg+='<g><circle cx="'+X(p.lng)+'" cy="'+Y(p.lat)+'" r="7" fill="'+col+'" stroke="#0C0F13" stroke-width="2"/>'+
   '<text x="'+X(p.lng)+'" y="'+(Y(p.lat)-13)+'" fill="#8B95A5" font-size="11" text-anchor="middle" '+
   'font-family="Inter,sans-serif">'+esc(p.name.split('—')[0].trim())+'</text></g>';
 });
 crewPos.forEach(function(c){
  svg+='<g><circle cx="'+X(c.pos.lng)+'" cy="'+Y(c.pos.lat)+'" r="12" fill="#2DD4BF" opacity="0.16"/>'+
   '<circle cx="'+X(c.pos.lng)+'" cy="'+Y(c.pos.lat)+'" r="5" fill="#C9A227" stroke="#0C0F13" stroke-width="2"/>'+
   '<text x="'+X(c.pos.lng)+'" y="'+(Y(c.pos.lat)+18)+'" fill="#C9A227" font-size="10" text-anchor="middle" '+
   'font-family="Inter,sans-serif">'+esc(c.initials)+'</text></g>';
 });
 svg+='</svg>';

 var missing=db.props.filter(function(p){return !p.lat}).length;
 var h='<div class="card"><div class="card-h">'+ic('pin')+'<h3>'+u('nav_map')+'</h3><div class="right">'+
  (missing?'<button class="btn" onclick="geocodeAll()">'+u('m_place')+' ('+missing+')</button>':'')+
  '<span style="font-size:11px;color:var(--faint)">'+u('m_legend')+'</span></div></div>'+
  '<div style="display:flex;gap:5px;padding:9px 13px;border-bottom:1px solid var(--line)">'+
  '<button class="btn '+(mapMode==='google'?'':'ghost')+'" style="font-size:11.5px" onclick="setMapMode(\'google\')">Google</button>'+
  '<button class="btn '+(mapMode==='tiles'?'':'ghost')+'" style="font-size:11.5px" onclick="setMapMode(\'tiles\')">OpenStreetMap</button>'+
  '<span style="font-size:11px;color:var(--faint);align-self:center;margin-'+(uiDir()==='rtl'?'right':'left')+':auto">'+u('m_needsnet')+'</span></div>'+
  (mapMode==='google'?googlePane():tileMap())+'</div>'+routeLinks();

 h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('m_positions')+'</h3></div>';
 crew().forEach(function(c){
  var when=c.pos?hhmm(c.pos.at):null;
  h+='<div class="row"><div class="av">'+c.initials+'</div><div class="grow">'+
   '<div class="name">'+esc(c.name)+'</div><div class="meta">'+
   (when?'<span>'+u('m_lastseen')+' '+when+'</span>':'<span>'+u('m_nopos')+'</span>')+'</div></div>'+
   (c.pos?'<a class="wa" href="'+mapsLink(c.pos)+'" target="_blank" rel="noopener">'+ic('pin')+u('m_open')+'</a>':'')+
   '<a class="wa" href="'+wa(c.phone,msgFor('where',{c:c}))+'" target="_blank" rel="noopener">'+ic('wa')+u('m_ask')+'</a></div>';
 });
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('key')+'<h3>'+u('props_access')+'</h3></div>';
 db.props.forEach(function(p){
  if(!p.lat)return;
  h+='<div class="row"><span class="dot"></span><div class="grow"><div class="name">'+esc(p.name)+'</div>'+
   '<div class="meta"><span>'+esc(p.area)+'</span><span class="mono">'+p.lat.toFixed(4)+', '+p.lng.toFixed(4)+'</span></div></div>'+
   '<a class="wa" href="'+navLink(p)+'" target="_blank" rel="noopener">'+ic('pin')+u('m_navigate')+'</a></div>';
 });
 return h+'</div>';
}
function bar(label,val,max,colour,right){
 var pct=max?Math.max(2,Math.round(val/max*100)):0;
 return '<div style="padding:6px 13px;border-bottom:1px solid var(--line)">'+
  '<div style="display:flex;font-size:11.5px;margin-bottom:4px"><span>'+label+'</span>'+
  '<span class="mono" style="margin-'+(uiDir()==='rtl'?'right':'left')+':auto;color:var(--muted)">'+(right||val)+'</span></div>'+
  '<div style="height:6px;background:var(--line2);border-radius:3px;overflow:hidden">'+
  '<div style="height:100%;width:'+pct+'%;background:'+(colour||'var(--teal)')+'"></div></div></div>';
}
function kpi(label,value,note,colour){
 return '<div class="stat">'+
  '<div class="n mono"'+(colour?' style="color:'+colour+'"':'')+'>'+value+'</div>'+
  '<div class="l">'+label+'</div>'+
  (note?'<div style="font-size:10.5px;color:var(--faint);margin-top:3px">'+note+'</div>':'')+'</div>';
}
function vMetrics(){
 var m=stats();
 var h='<div class="stats">'+
  kpi(u('k_revenue'),aed(m.booked+m.taskRev+m.cxFees),u('k_revnote'))+
  kpi(u('k_mrr'),aed(m.mrr),u('k_mrrnote'),'var(--teal)')+
  kpi(u('k_completion'),m.completion+'%',m.done+' '+u('c_done')+' / '+m.jobs)+
  kpi(u('k_ontime'),m.onTime+'%',u('k_ontimenote'),m.onTime<85?'var(--red)':'')+
  kpi(u('k_avgtime'),m.avgMins+'m',m.skippedLong?m.skippedLong+' '+u('k_skipped'):u('k_avgnote'))+
  kpi(u('k_disputes'),m.disputeRate+'%',m.disputes+' '+u('k_of')+' '+m.done,m.disputeRate>5?'var(--red)':'')+
  kpi(u('pf_profit'),aed(m.profit),u('pf_after'),m.profit<0?'var(--red)':'var(--teal)')+
  kpi(u('pf_margin'),m.margin+'%',u('pf_marginnote'),m.margin<20?'var(--amber)':'')+
  '</div>';

 h+='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('k_money')+'</h3></div>';
 var mx=Math.max(m.booked,m.collected,m.outstanding,m.mrr,1);
 h+=bar(u('k_booked'),m.booked,mx,'var(--teal)',aed(m.booked));
 h+=bar(u('k_tasks'),m.taskRev,mx,'var(--gold)',aed(m.taskRev));
 h+=bar(u('k_cxfees'),m.cxFees,mx,'var(--amber)',aed(m.cxFees));
 h+=bar(u('c_collected'),m.collected,mx,'var(--teal)',aed(m.collected));
 h+=bar(u('c_outstanding'),m.outstanding,mx,'var(--red)',aed(m.outstanding));
 h+=bar(u('rf_credited'),m.credited,mx,'var(--red)',aed(m.credited));
 h+=bar(u('k_supplies'),m.supplies,mx,'var(--amber)',aed(m.supplies));
 h+=bar(u('pf_lab'),m.labour,mx,'var(--amber)',aed(m.labour));
 h+=bar(u('ex_title'),m.expenses,mx,'var(--amber)',aed(m.expenses));
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('alert')+'<h3>'+u('k_quality')+'</h3></div>';
 h+=bar(u('k_photook'),m.photoOk,100,m.photoOk<80?'var(--red)':'var(--teal)',m.photoOk+'%');
 h+=bar(u('k_ontime'),m.onTime,100,m.onTime<85?'var(--red)':'var(--teal)',m.onTime+'%');
 h+=bar(u('k_premshare'),m.premShare,100,'var(--gold)',m.premShare+'%');
 h+='<div class="row"><div class="grow"><div class="name">'+u('k_rework')+'</div>'+
  '<div class="meta"><span>'+u('k_reworknote')+'</span></div></div><span class="mono">'+m.rework+'</span></div>';
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('k_bycleaner')+'</h3></div><table>'+
  '<tr><th>'+u('h_cleaner')+'</th><th class="num">'+u('h_done')+'</th><th class="num">'+u('k_avg')+'</th>'+
  '<th class="num">'+u('k_ontimeshort')+'</th><th class="num">'+u('k_photos')+'</th>'+
  '<th class="num">'+u('k_disputesshort')+'</th><th class="num">'+u('h_pay')+'</th></tr>';
 crew().forEach(function(c){
  var mine=db.jobs.filter(function(j){return j.cleaner===c.id&&j.status==='done'});
  var mn=mine.reduce(function(a,j){return a+((j.finished-j.started)/MIN)},0);
  var ot=mine.filter(function(j){return j.started<=todayAt(j.time)+15*MIN}).length;
  var ph=mine.reduce(function(a,j){return a+(j.photos||[]).length},0);
  var dp=db.jobs.filter(function(j){return j.cleaner===c.id&&j.disputed}).length;
  var hh=mine.reduce(function(a,j){return a+hrs(j.started,j.finished)},0);
  var bonus=db.tasks.filter(function(x){return x.by===c.id&&x.status==='done'}).reduce(function(a,x){return a+x.fee*0.6},0);
  h+='<tr><td>'+esc(c.name)+'</td><td class="num mono">'+mine.length+'</td>'+
   '<td class="num mono">'+(mine.length?Math.round(mn/mine.length)+'m':'—')+'</td>'+
   '<td class="num mono">'+(mine.length?Math.round(ot/mine.length*100)+'%':'—')+'</td>'+
   '<td class="num mono">'+(mine.length?(ph/mine.length).toFixed(1):'—')+'</td>'+
   '<td class="num mono"'+(dp?' style="color:var(--red)"':'')+'>'+dp+'</td>'+
   '<td class="num mono">'+aed(hh*c.rate+bonus)+'</td></tr>';
 });
 h+='</table></div>';

 h+='<div class="card"><div class="card-h">'+ic('down')+'<h3>'+u('k_export')+'</h3>'+
  '<div class="right"><button class="btn ghost" onclick="exportMetrics()">'+u('b_export')+'</button></div></div>'+
  '<div style="padding:11px 13px;font-size:11.5px;color:var(--muted)">'+u('k_exportnote')+'</div></div>';
 return h;
}
function vMyDay(){
 var me=session.id,c=cleaner(me),d=T[lang]||T.en;
 var mine=db.jobs.filter(function(j){return teamOf(j).indexOf(me)>-1&&j.status!=='cancelled'&&isToday(j)}).sort(function(a,b){return a.time.localeCompare(b.time)});
 var active=mine.filter(function(j){return j.status==='progress'})[0],next=mine.filter(function(j){return j.status==='sched'})[0];
 var j=active||next;
 var myTasks=db.tasks.filter(function(x){return x.by===me&&x.status==='done'});
 var extra=myTasks.reduce(function(s,x){return s+x.fee*0.6},0);
 var h='<div class="phone" dir="'+d.dir+'"><div class="phone-h"><div class="av">'+c.initials+'</div>'+
 '<div><div style="font-weight:600">'+esc(c.name)+'</div>'+
 '<div style="font-size:11px;color:var(--faint)">'+d.today+' · '+mine.length+' '+d.jobs+
 (extra?' · '+d.earned+' '+aed(extra):'')+'</div></div>'+
 '<span class="st'+(active?' run':'')+'" style="margin-'+(d.dir==='rtl'?'right':'left')+':auto">'+(active?d.onjob:d.free)+'</span></div>'+
 '<div style="padding:9px 14px;border-bottom:1px solid var(--line);display:flex;gap:7px;align-items:center">'+
 (myShift()?'<span class="st run" style="flex:1">'+d.clockedin+' '+hhmm(myShift().in)+' · '+dur(myShift().in,null)+
   (myShift().inAt?' · '+ic('pin'):'')+'</span>'+
   '<button class="btn ghost" onclick="clockOut()">'+d.clockout+'</button>'
  :'<span class="st" style="flex:1">'+d.notclocked+'</span>'+
   '<button class="btn" onclick="clockIn()">'+d.clockin+'</button>')+'</div>';
 if(!j)return h+'<div class="empty"><b>'+d.nothing+'</b>'+d.alldone+'</div></div>'+upcomingFor(me);
 var p=property(j.prop),ti=TIERS[j.tier||'standard'],cl=checklistFor(j);
 h+='<div class="jobcard"><div style="font-size:11.5px;color:var(--faint)">'+j.time+' · '+j.id+'</div>'+
 '<div class="where">'+esc(j.prop)+'</div><div class="what">'+esc(svc(j.service))+' '+d.clean+
 (j.tier==='premium'?' · <span style="color:var(--gold)">Premium</span>':'')+(p?' · '+esc(p.area):'')+'</div>';
 if(p)h+='<div class="access"><h5>'+d.access+'</h5>'+
 '<div class="l"><span>Key</span><span>'+esc(p.key)+'</span></div>'+
 (p.park?'<div class="l"><span>Parking</span><span>'+esc(p.park)+'</span></div>':'')+
 (p.alarm&&p.alarm!=='—'?'<div class="l"><span>Alarm</span><span>'+esc(p.alarm)+'</span></div>':'')+
 (p.wifi&&p.wifi!=='—'?'<div class="l"><span>Wifi</span><span>'+esc(p.wifi)+'</span></div>':'')+
 (p.note?'<div class="l"><span>Note</span><span>'+esc(p.note)+'</span></div>':'')+'</div>';
 if(p&&p.lat&&p.lng){
  h+='<div style="border:1px solid var(--line2);border-radius:8px;overflow:hidden;margin-bottom:11px">'+
   '<iframe title="map" src="'+gEmbed(p,16)+'" style="width:100%;height:170px;border:0;display:block" '+
   'loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'+
   '<div style="display:flex;gap:6px;padding:8px">'+
   '<a class="wa" style="flex:1;justify-content:center" href="'+navLink(p)+'" target="_blank" rel="noopener">'+
   ic('pin')+d.navigate+'</a>'+
   '<a class="wa" style="flex:1;justify-content:center" href="'+mapsLink(p)+'" target="_blank" rel="noopener">'+
   ic('pin')+d.openmap+'</a></div></div>';
 } else if(p){
  h+='<div class="geo warn">'+ic('pin')+' '+d.nolocation+'</div>';
 }
 h+=readingsBlock(j);
 if(j.geo)h+='<div class="geo ok">'+ic('pin')+' Checked in '+j.geo.dist+'m from the property at '+hhmm(j.geo.at)+'</div>';
 if(!active){
  h+=(p&&p.lat?'<a class="btn ghost big" style="display:block;text-align:center;text-decoration:none;margin-bottom:8px" '+
     'href="'+navLink(p)+'" target="_blank" rel="noopener">'+ic('pin')+' '+d.navigate+'</a>':'')+
   (j.onWay?'<div class="geo ok">'+ic('pin')+' Customer told you are on the way ('+hhmm(j.onWay)+')</div>':
   '<button class="btn ghost big" style="margin-bottom:8px" onclick="onWay('+j.id+')">'+ic('pin')+' '+d.onway+'</button>')+
  '<button class="btn big" onclick="startJob('+j.id+')">'+d.checkin+'</button>'+
  '<p style="font-size:11px;color:var(--faint);text-align:center;margin:9px 0 0">'+d.startnote+'</p></div></div>'+upcomingFor(me);
  return h}
 h+='<div class="elapsed mono">'+dur(j.started,null)+'<span>'+d.since+' '+hhmm(j.started)+'</span></div>'+
  '<button class="btn ghost" style="width:100%;margin-top:8px" onclick="shareLocation('+(watchId===null?'true':'false')+')">'+
  ic('pin')+' '+(watchId===null?u('m_share'):u('m_stopsharing'))+'</button></div>';
 h+='<div style="border-top:1px solid var(--line)">';
 cl.forEach(function(k){var on=j.checked.indexOf(k)>-1,ex=EXTRA_KEYS.indexOf(k)>-1;
  h+='<div class="check'+(on?' on':'')+'" onclick="toggle('+j.id+',\''+k+'\')"><div class="box">✓</div>'+
  '<div class="lbl">'+itemLabel(k,j.prop)+'</div>'+(ex?'<span class="extra">PREMIUM</span>':'')+'</div>'});
 h+='</div><div class="jobcard" style="border-top:1px solid var(--line)">';
 var ps=jobPhotos(j),needed=ti.photos;
 h+='<div style="font-size:11px;color:'+(ps.length<needed?'var(--red)':'var(--faint)')+';margin-bottom:5px">'+
 d.photos+' '+ps.length+'/'+needed+'</div><div class="photos">';
 ps.forEach(function(x){h+='<div class="ph">'+(x.src?'<img src="'+x.src+'" alt="">':'')+'<em>'+(x.kind==='after'?d.after:d.before)+' '+hhmm(x.at)+'</em></div>'});
 h+='<label class="ph slot file-btn">+<input type="file" accept="image/*" capture="environment" onchange="shoot(event,'+j.id+')"></label></div>'+
 '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">'+
 PHOTO_AREAS.map(function(A){var n=photoAreas(j)[A]||0;
  return '<button class="btn '+(shotArea===A?'':'ghost')+'" style="font-size:10.5px;padding:4px 8px" '+
   'onclick="setShotArea(\''+A+'\')">'+t(A==='other'?'other':A)+(n?' '+n:'')+'</button>'}).join('')+'</div>'+
 (coverageGaps(j).length?'<p style="font-size:11px;color:var(--red);margin:7px 0 0">'+u('q_needphotos')+' '+
   coverageGaps(j).map(function(g){return t(g)}).join(', ')+'</p>':'')+
 '<div style="display:flex;gap:7px;margin-top:11px">'+
 '<label class="btn ghost file-btn" style="flex:1">'+d.addphoto+'<input type="file" accept="image/*" capture="environment" onchange="shoot(event,'+j.id+')"></label>'+
 '<button class="btn red" style="flex:1" onclick="reportProblem('+j.id+')">'+d.problem+'</button></div>'+
 '<button class="btn big" style="margin-top:8px" onclick="completeJob('+j.id+')">'+d.complete+'</button>'+
 '<p style="font-size:11px;color:var(--faint);text-align:center;margin:9px 0 0">'+j.checked.length+'/'+cl.length+' '+d.ticked+'</p>';
 var after=mine.filter(function(x){return x.status==='sched'&&x.id!==j.id})[0];
 if(after){var mn=travel(j.prop,after.prop),pa=property(after.prop);
  h+='<div style="border-top:1px solid var(--line);margin-top:12px;padding-top:10px;font-size:11.5px;color:var(--faint)">'+
  d.travel+' — '+esc(after.prop)+' · '+after.time+(mn?' · ~'+mn+'m':'')+
  (pa&&pa.lat?' <a href="'+navLink(pa)+'" target="_blank" rel="noopener" style="color:var(--teal)">'+d.navigate+'</a>':'')+
  '</div>'}
 return h+'</div></div>'+upcomingFor(me)}
function vCleanerTasks(){
 var d=T[lang]||T.en,me=session.id;
 var mineDone=db.tasks.filter(function(x){return x.by===me&&x.status==='done'});
 var extra=mineDone.reduce(function(s,x){return s+x.fee*0.6},0);
 var h='<div class="phone" dir="'+d.dir+'"><div class="phone-h"><div><div style="font-weight:600">'+d.tasks+'</div>'+
 '<div style="font-size:11px;color:var(--faint)">'+d.earned+': '+aed(extra)+'</div></div></div>';
 var list=db.tasks.filter(function(x){return x.status==='open'||x.by===me});
 if(!list.length)return h+'<div class="empty"><b>—</b></div></div>';
 var ord={taken:0,open:1,done:2};
 list.sort(function(a,b){return ord[a.status]-ord[b.status]||b.at-a.at}).forEach(function(x){h+=taskRow(x,true)});
 return h+'</div>'}
function vMine(){var mine=db.jobs.filter(function(j){return j.cleaner===session.id});
 var h='<div class="card"><div class="card-h"><h3>My jobs today</h3></div>';
 if(!mine.length)return h+'<div class="empty"><b>'+u('e_nojobs')+'</b></div></div>'+myHours();
 mine.forEach(function(j){h+=jobRow(j)});return h+'</div>'+myHours()}
function vChat(){
 var list=threadsFor();
 if(!thread&&list.length===1)thread=list[0].id;
 var h='';
 if(session.role==='manager'){
  h+='<div class="card"><div class="card-h">'+ic('wa')+'<h3>'+u('ch_threads')+'</h3></div>';
  list.forEach(function(x){
   var un=unreadFrom(x.id),last=threadMsgs(x.id).slice(-1)[0];
   h+='<div class="row click'+(thread===x.id?'':'')+'" onclick="openThread(\''+x.id+'\')" '+
    (thread===x.id?'style="background:#171C23"':'')+'>'+
    '<div class="av">'+esc(x.initials)+'</div><div class="grow">'+
    '<div class="name">'+esc(x.name)+(un?'<span class="pill prem">'+un+'</span>':'')+'</div>'+
    '<div class="meta"><span>'+(last?esc(last.text.slice(0,54)):u('ch_none'))+'</span></div></div>'+
    (last?'<span class="st mono">'+hhmm(last.at)+'</span>':'')+'</div>';
  });
  h+='</div>';
 }
 if(!thread)return h;
 var other=list.filter(function(x){return x.id===thread})[0]||{name:''};
 var ms=threadMsgs(thread),me=myId();
 h+='<div class="card"><div class="card-h">'+ic('wa')+'<h3>'+esc(other.name)+'</h3></div>'+
  '<div style="max-height:340px;overflow:auto;padding:11px 13px;display:flex;flex-direction:column;gap:7px">';
 if(!ms.length)h+='<div class="empty"><b>'+u('ch_none')+'</b>'+u('ch_start')+'</div>';
 ms.forEach(function(m){
  var mine=m.from===me;
  h+='<div style="align-self:'+(mine?'flex-end':'flex-start')+';max-width:78%;'+
   'background:'+(mine?'#14342F':'#1A2029')+';border:1px solid '+(mine?'#1E4433':'var(--line2)')+';'+
   'border-radius:10px;padding:8px 11px;white-space:pre-wrap;font-size:12.5px">'+
   esc(m.text)+'<div style="font-size:9.5px;color:var(--faint);margin-top:4px">'+hhmm(m.at)+
   (mine?(m.read?' · '+u('ch_read'):' · '+u('ch_sent')):'')+'</div></div>';
 });
 h+='</div>';
 if(session.role==='manager'&&thread&&thread.indexOf('c')===0&&thread.indexOf('cu')!==0){
  h+='<div style="display:flex;gap:5px;flex-wrap:wrap;padding:0 13px 9px">'+
   '<button class="btn ghost" style="font-size:11px" onclick="quickInsert(\'day\')">'+u('msg_day')+'</button>'+
   '<button class="btn ghost" style="font-size:11px" onclick="quickInsert(\'where\')">'+u('msg_where')+'</button></div>';
 }
 if(session.role!=='manager'||(thread&&thread.indexOf('cu')===0)){
  h+='<div style="display:flex;gap:5px;flex-wrap:wrap;padding:0 13px 9px">'+
   '<button class="btn ghost" style="font-size:11px" onclick="quickInsert(\'onway\')">'+u('msg_onway')+'</button>'+
   '<button class="btn ghost" style="font-size:11px" onclick="quickInsert(\'late\')">'+u('msg_late')+'</button></div>';
 }
 h+='<div style="display:flex;gap:7px;padding:11px 13px;border-top:1px solid var(--line)">'+
  '<input id="ch-in" placeholder="'+u('ch_write')+'" value="'+esc(draft)+'" '+
  'oninput="setDraft(this.value)" onkeydown="if(event.key===\'Enter\'){sendMsg()}">'+
  '<button class="btn" onclick="sendMsg()">'+u('ch_send')+'</button></div>';
 return h+'</div>';
}
function vPool(){
 var list=openJobs();
 var h='<div class="card"><div class="card-h">'+ic('zap')+'<h3>'+u('p_open')+'</h3><div class="right">'+
  '<span style="font-size:11px;color:var(--faint)">'+u('p_note')+'</span></div></div>';
 if(!list.length)return h+'<div class="empty"><b>'+u('p_none')+'</b>'+u('p_nonesub')+'</div></div>';
 list.sort(function(a,b){return a.time.localeCompare(b.time)}).forEach(function(j){
  var p=property(j.prop),ti=TIERS[j.tier||'standard'];
  h+='<div class="row"><span class="dot gold"></span><div class="grow">'+
   '<div class="name">'+esc(j.prop)+tierPill(j)+'</div>'+
   '<div class="meta"><span class="mono">'+j.id+'</span><span>'+j.time+'</span><span>'+esc(svc(j.service))+'</span>'+
   (p&&p.area?'<span>'+esc(p.area)+'</span>':'')+'</div></div>'+
   '<span class="mono" style="color:var(--faint);font-size:11.5px">'+aed(j.price)+'</span>'+
   '<button class="btn gold" onclick="claimJob('+j.id+')">'+u('p_take')+'</button></div>';
 });
 return h+'</div>';
}
function vCustomers(){
 var h='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('cu_title')+'</h3>'+
  '<div class="right"><button class="btn" onclick="addCustomer()">'+u('cu_add')+'</button></div></div>';
 if(!customers().length)return h+'<div class="empty"><b>'+u('cu_none')+'</b>'+u('cu_nonesub')+'</div></div>';
 customers().forEach(function(c){
  var js=custJobs(c.name),due=custOutstanding(c.name);
  var props=db.props.filter(function(p){return js.some(function(j){return j.prop===p.name})}).length;
  h+='<div class="row"><div class="av">'+esc(c.name.split(' ').map(function(w){return w[0]}).join('').slice(0,2))+'</div>'+
   '<div class="grow"><div class="name">'+esc(c.name)+(hasPin(c.id)?'<span class="pill prem">'+u('a_pin')+'</span>':'')+'</div>'+
   '<div class="meta">'+(c.contact?'<span>'+esc(c.contact)+'</span>':'')+
   '<span>'+props+' '+u('cu_props')+'</span><span>'+js.length+' '+u('c_jobs')+'</span>'+
   (due>0.5?'<span style="color:var(--amber)">'+aed(due)+' '+u('cu_due')+'</span>':'')+
   (c.email?'<span>'+esc(c.email)+'</span>':'')+'</div></div>'+
   '<button class="btn" onclick="showCustomer(\''+c.id+'\')">'+u('cn_open')+'</button>'+
   '<button class="btn ghost" onclick="setPin(\''+c.id+'\')">'+u('a_pin')+'</button>'+
   (cloud.on?'<button class="btn ghost" onclick="copyInvite(\'customer\',\''+c.id+'\')">'+u('a_copy')+'</button>':'')+
   (c.phone?'<a class="wa" href="'+wa(c.phone,db.company)+'" target="_blank" rel="noopener">'+ic('wa')+'</a>':'')+
   '<button class="btn ghost" onclick="removeCustomer(\''+c.id+'\')">'+u('b_remove')+'</button></div>';
 });
 return h+'</div>';
}

/* ---------------- customer ---------------- */
function vPortal(){return vPortalMain()+vPortalInvoices()}
function vPortalInvoices(){
 var name=customerName(),mine=db.invoices.filter(function(v){return v.customer===name});
 if(!mine.length)return '';
 var h='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('pi_title')+'</h3></div>';
 mine.slice().sort(function(a,b){return invDue(b)-invDue(a)}).forEach(function(v){
  var due=invDue(v),link=invLinkFor(v,due);
  h+='<div class="row"><span class="dot'+(due>0.5?' gold':'')+'"></span><div class="grow">'+
   '<div class="name">'+esc(v.id)+'</div><div class="meta"><span>'+aed(invTotal(v))+'</span>'+
   (due>0.5?'<span style="color:var(--amber)">'+aed(due)+' '+u('gp_due')+'</span>':'<span>'+u('s_paid')+'</span>')+'</div></div>'+
   (due>0.5&&link?'<a class="btn" href="'+esc(link)+'" target="_blank" rel="noopener">'+u('gp_paynow')+'</a>':'')+'</div>';
  if(due>0.5){
   var lines=payLines(v,due).filter(function(l){return l.indexOf(u('gp_paynow'))!==0});
   if(lines.length)h+='<pre style="margin:0;padding:8px 14px 12px;white-space:pre-wrap;font-family:inherit;font-size:11.5px;color:var(--muted)">'+esc(lines.join('\n'))+'</pre>';
  }
 });
 return h+'</div>';
}
function vPortalMain(){
 var who=customerName();
 var mine=db.jobs.filter(function(j){return j.customer===who});
 var j=mine.filter(function(x){return x.status==='progress'})[0]||
       mine.filter(function(x){return x.status==='sched'})[0]||mine[0];
 if(!j){
  var h0='<div class="phone"><div class="phone-h"><div><div style="font-weight:600">'+esc(who)+'</div>'+
   '<div style="font-size:11px;color:var(--faint)">'+esc(db.company)+'</div></div></div>'+
   '<div class="jobcard"><div class="empty" style="padding:16px 0"><b>'+u('po_nojobs')+'</b>'+u('po_nojobssub')+'</div>'+
   '<button class="btn big" onclick="bookClean()">'+u('b_bookmore')+'</button>'+
   '<button class="btn ghost big" style="margin-top:8px" onclick="newTask()">'+u('b_posttask')+'</button>'+
   '<a class="wa" style="justify-content:center;margin-top:8px" href="'+wa(S().officePhone,esc(who))+'" target="_blank" rel="noopener">'+
   ic('wa')+u('b_msgoffice')+'</a></div></div>';
  var rq=db.requests.filter(function(r){return r.customer===who});
  if(rq.length){
   h0+='<div class="card" style="max-width:380px;margin:12px auto 0"><div class="card-h"><h3>'+u('my_requests')+'</h3></div>';
   rq.forEach(function(r){h0+='<div class="row"><span class="dot"></span><div class="grow">'+
    '<div class="name">'+esc(r.prop)+'</div><div class="meta"><span>'+esc(r.when)+'</span></div></div>'+
    '<span class="st">'+r.status+'</span></div>'});
   h0+='</div>';
  }
  return h0;
 }
 var c=cleaner(j.cleaner),ps=jobPhotos(j),p=property(j.prop),g=guaranteeLeft(j);
 var h='<div class="phone"><div class="phone-h"><div><div style="font-weight:600">'+esc(j.prop)+'</div>'+
 '<div style="font-size:11px;color:var(--faint)">'+esc(p?p.area:'')+'</div></div>'+
 '<span style="margin-left:auto">'+tierPill(j)+'</span></div><div class="jobcard">';
 if(j.onWay&&j.status==='sched')h+='<div class="geo ok">'+ic('pin')+' '+esc(c.name.split(' ')[0])+' is on the way — told you at '+hhmm(j.onWay)+'</div>';
 h+='<div class="kv"><span>'+u('k_booked')+'</span><span>'+j.time+' · '+TIERS[j.tier||'standard'].arrive+'</span></div>'+
 '<div class="kv"><span>'+u('h_cleaner')+'</span><span>'+esc(c.name)+(c.senior?' · senior':'')+'</span></div>'+
 '<div class="kv"><span>'+u('k_arrived')+'</span><span class="mono">'+hhmm(j.started)+(j.geo?' · verified':'')+'</span></div>'+
 '<div class="kv"><span>'+u('k_finished')+'</span><span class="mono">'+hhmm(j.finished)+'</span></div>'+
 '<div class="kv"><span>'+u('k_onsite')+'</span><span class="mono">'+dur(j.started,j.finished)+'</span></div>'+
 '<div class="kv"><span>'+u('k_checklist')+'</span><span>'+j.checked.length+' of '+checklistFor(j).length+'</span></div>'+
 '<div class="kv"><span>'+u('h_price')+'</span><span class="mono">'+aed(j.price)+'</span></div>';
 if(g)h+='<div class="geo ok" style="margin-top:10px">Re-clean guarantee — '+g+'h left to raise a problem</div>';
 h+='<div style="font-size:11px;color:var(--faint);margin:12px 0 5px">'+u('photo_record')+'</div><div class="photos">';
 ps.forEach(function(x){h+='<div class="ph">'+(x.src?'<img src="'+x.src+'" alt="">':'')+'<em>'+x.kind+' '+hhmm(x.at)+'</em></div>'});
 if(!ps.length)h+='<span style="font-size:12px;color:var(--faint)">None yet.</span>';
 h+='</div>';
 var iss=db.issues.filter(function(x){return x.job===j.id});
 if(iss.length){h+='<div style="font-size:11px;color:var(--red);margin:12px 0 5px">'+u('reported_you')+'</div>';
  iss.forEach(function(x){h+='<div class="kv"><span>'+esc(T.en[x.type])+'</span><span>'+esc(x.note)+'</span></div>'})}
 if(j.status==='done'&&!j.signed){
  h+='<div style="border-top:1px solid var(--line);margin-top:12px;padding-top:11px">'+
  '<div style="font-size:11.5px;color:var(--muted);text-align:center">Happy with this clean?</div><div class="stars">';
  for(var s=1;s<=5;s++)h+='<button class="star'+(starPick>=s?' on':'')+'" onclick="setStar('+s+')">★</button>';
  h+='</div><button class="btn big" onclick="signOff('+j.id+')">'+u('b_signoff')+'</button>'+
  '<button class="btn red big" style="margin-top:7px" onclick="customerDispute('+j.id+')">'+u('q_nothappy')+'</button>'+
  (g?'<p style="font-size:11px;color:var(--faint);text-align:center;margin:7px 0 0">'+g+'h '+u('d_remaining')+'</p>':'')+'</div>'}
 else if(j.signed)h+='<div style="border-top:1px solid var(--line);margin-top:12px;padding-top:11px;text-align:center;font-size:12px;color:var(--muted)">Signed off · '+j.rating+'★</div>';
 h+=(j.status==='sched'?'<button class="btn ghost big" style="margin-top:8px" onclick="cancelJob('+j.id+')">'+u('cx_cancelmine')+'</button>':'')+
 '<button class="btn ghost big" style="margin-top:8px" onclick="printReport('+j.id+')">'+ic('down')+' '+u('b_download_report')+'</button>'+
 '<button class="btn big" style="margin-top:7px" onclick="bookClean()">'+u('b_bookmore')+'</button>'+
 '<a class="wa" style="justify-content:center;margin-top:7px" href="'+wa(S().officePhone,'Hi, about '+j.prop)+'" target="_blank" rel="noopener">'+ic('wa')+u('b_msgoffice')+'</a>';
 h+='</div></div>';
 h+='<div class="card" style="max-width:380px;margin:12px auto 0"><div class="card-h">'+ic('zap')+'<h3>'+u('need_small')+'</h3>'+
 '<div class="right"><button class="btn gold" onclick="newTask()">'+u('b_posttask')+'</button></div></div>';
 var myT=db.tasks.filter(function(x){return x.customer===who});
 if(!myT.length)h+='<div class="empty"><b>'+u('e_binsetc')+'</b>'+u('e_fromaed')+'</div>';
 else myT.forEach(function(x){h+=taskRow(x,false)});
 h+='</div>';
 var reqs=db.requests.filter(function(r){return r.customer===who});
 if(reqs.length){h+='<div class="card" style="max-width:380px;margin:12px auto 0"><div class="card-h"><h3>'+u('my_requests')+'</h3></div>';
  reqs.forEach(function(r){h+='<div class="row"><span class="dot"></span><div class="grow">'+
  '<div class="name">'+esc(r.prop)+(r.tier==='premium'?'<span class="pill prem">Premium</span>':'')+'</div>'+
  '<div class="meta"><span>'+esc(r.when)+'</span>'+(r.deposit?'<span style="color:var(--teal)">deposit paid</span>':'')+'</div></div>'+
  '<span class="st">'+r.status+'</span></div>'});h+='</div>'}
 return h}

/* ---------------- settings, onboarding, import ---------------- */
function vSettings(){
 var h='<div class="card"'+(cloud.on?' style="border-color:#1E4433"':'')+'><div class="card-h">'+ic('repeat')+
 '<h3>'+u('cl_title')+'</h3><div class="right"><span style="font-size:11.5px;color:'+
 (cloud.on?(cloud.status.indexOf('error')===0?'var(--red)':'var(--teal)'):'var(--faint)')+'">'+cloudLabel()+'</span></div></div>'+
 '<div style="padding:13px">'+
 (cloud.on?'':'<p style="font-size:11.5px;color:var(--muted);margin:0 0 11px">'+u('cl_help')+'</p>')+
 '<div class="field"><label for="cl-url">Supabase URL</label><input id="cl-url" placeholder="https://xxxx.supabase.co" value="'+esc(cloud.url)+'"></div>'+
 '<div class="field"><label for="cl-key">Anon key</label><input id="cl-key" placeholder="eyJhbGci..." value="'+esc(cloud.key)+'"></div>'+
 '<div class="two"><div class="field"><label for="cl-ws">'+u('cl_ws')+'</label><input id="cl-ws" placeholder="sparkle" value="'+esc(cloud.ws)+'"></div>'+
 '<div class="field"><label for="cl-secret">'+u('cl_secret')+'</label><input id="cl-secret" type="password" value="'+esc(cloud.secret)+'"></div></div>'+
 (cloud.on?
   '<button class="btn ghost" onclick="cloudDisconnect()">'+u('cl_disconnect')+'</button>'+
   '<button class="btn" style="margin-'+(uiDir()==='rtl'?'right':'left')+':6px" onclick="cloudPush()">'+u('cl_pushnow')+'</button>'
  :'<button class="btn" onclick="cloudConnect()">'+u('cl_connect')+'</button>')+
 (cloud.status.indexOf('error')===0?'<p style="font-size:11px;color:var(--red);margin:9px 0 0">'+esc(cloud.status)+'</p>':'')+
 '</div></div>'+
 '<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('a_invites')+'</h3></div>'+
 '<div style="padding:11px 13px;font-size:11.5px;color:var(--muted)">'+
 (cloud.on?u('a_invitenote'):'<span style="color:var(--red)">'+u('a_nocloud')+'</span>')+'</div>'+
 (cloud.on?inviteRows():'')+
 '</div>'+
 '<div class="card"><div class="card-h">'+ic('gear')+'<h3>'+u('company')+'</h3></div>'+
 '<div style="padding:13px">'+
 '<div class="field"><label for="s-co">'+u('s_company_name')+'</label>'+
 '<input id="s-co" value="'+esc(db.company)+'"></div>'+
 '<div class="field"><label for="s-trn">'+u('s_taxnum')+'</label>'+
 '<input id="s-trn" value="'+esc(db.trn||TRN)+'"></div>'+
 '<button class="btn" onclick="saveCompany()">'+u('b_save')+'</button></div></div>';

 h+=vPayCfg();
 h+='<div class="card"><div class="card-h">'+ic('receipt')+'<h3>'+u('country_tax')+'</h3></div>'+
 '<div style="padding:13px">'+
 '<div class="two"><div class="field"><label for="s-cc">'+u('s_country')+'</label><select id="s-cc" onchange="applyCountry(this.value)">'+
 Object.keys(COUNTRIES).map(function(k){return '<option value="'+k+'"'+(S().country===k?' selected':'')+'>'+COUNTRIES[k].name+'</option>'}).join('')+
 '</select></div>'+
 '<div class="field"><label for="s-cur">'+u('s_currency')+'</label><select id="s-cur">'+CURRENCIES.map(function(k){return '<option value="'+k+'"'+(S().currency===k?' selected':'')+'>'+k+'</option>'}).join('')+'</select></div></div>'+
 '<div class="two"><div class="field"><label for="s-taxlabel">'+u('s_taxname')+'</label><input id="s-taxlabel" value="'+esc(S().taxLabel)+'"></div>'+
 '<div class="field"><label for="s-taxrate">'+u('s_taxrate')+'</label><input id="s-taxrate" type="number" step="0.5" value="'+(S().taxRate*100)+'"></div></div>'+
 '<div class="two"><div class="field"><label for="s-idlabel">'+u('s_idlabel')+'</label><input id="s-idlabel" value="'+esc(S().idLabel)+'"></div>'+
 '<div class="field"><label for="s-taxid">'+esc(S().idLabel)+'</label><input id="s-taxid" value="'+esc(S().taxId)+'"></div></div>'+
 '<div class="two"><div class="field"><label for="s-phone">'+u('s_office')+'</label><input id="s-phone" value="'+esc(S().officePhone)+'"></div>'+
 '<div class="field"><label for="s-week">'+u('s_weekstart')+'</label><select id="s-week">'+
 '<option value="0"'+(S().weekStart===0?' selected':'')+''+u('s_sunday')+'</option>'+
 '<option value="1"'+(S().weekStart===1?' selected':'')+''+u('s_monday')+'</option></select></div></div>'+
 '<button class="btn" onclick="saveRegion()">'+u('b_save')+'</button>'+
 '<p style="font-size:11px;color:var(--faint);margin:9px 0 0">'+u('s_currently')+': '+esc(money(1234.5))+' · '+esc(taxLabel())+
 ' · week starts '+(S().weekStart?'Monday':'Sunday')+'</p></div></div>';

 h+='<div class="card"><div class="card-h">'+ic('users')+'<h3>'+u('cleaners')+'</h3><div class="right">'+
 '<button class="btn" onclick="addCleaner()">'+u('b_addcleaner')+'</button></div></div>';
 if(!crew().length)h+='<div class="empty"><b>'+u('s_nocleaners')+'</b>'+u('s_addteam')+'</div>';
 else crew().forEach(function(c,i){
  h+='<div class="row"><div class="av">'+esc(c.initials)+'</div><div class="grow">'+
  '<div class="name">'+esc(c.name)+(c.senior?'<span class="pill prem">'+u('t_seniorshort')+'</span>':'')+'</div>'+
  '<div class="meta"><span>'+esc(c.phone||'no number')+'</span><span>'+(T[c.lang]||T.en).name+'</span>'+
  '<span>'+aed(c.rate)+'/h</span><span>'+ratingOf(c).toFixed(2)+'★</span></div></div>'+
  '<button class="btn ghost" onclick="removeCleaner('+i+')">'+u('b_remove')+'</button></div>'});
 h+='</div>';

 h+='<div class="card"><div class="card-h">'+ic('key')+'<h3>'+u('import_props')+'</h3><div class="right">'+
 '<label class="btn file-btn">'+u('b_csv')+'<input type="file" accept=".csv,text/csv" onchange="importCsv(event)"></label>'+
 '<button class="btn ghost" onclick="sampleCsv()">'+u('b_template')+'</button></div></div>'+
 '<div style="padding:13px;font-size:12px;color:var(--muted)">'+
 ''+u('s_csvhelp')+'<br>'+
 '<span class="mono" style="color:var(--faint)">name, area, access key, parking, wifi, alarm, note</span><br><br>'+
 ''+u('s_csvnote')+''+
 '</div></div>';

 h+='<div class="card"><div class="card-h">'+ic('down')+'<h3>'+u('your_data')+'</h3></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('b_exportall')+'</div>'+
 '<div class="meta"><span>'+u('s_exportnote')+'</span></div></div>'+
 '<button class="btn ghost" onclick="exportAll()">'+u('b_export')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('b_deleteall')+'</div>'+
 '<div class="meta"><span>'+u('s_erasenote')+'</span></div></div>'+
 '<button class="btn red" onclick="eraseAll()">'+u('b_delete')+'</button></div></div>';

 h+='<div class="card alert"><div class="card-h"><h3 style="color:var(--red)">'+u('demo_controls')+'</h3></div>'+
 vPushRow()+
 '<div class="row"><div class="grow"><div class="name">'+u('lg_title')+'</div>'+
 '<div class="meta"><span>'+u('lg_settingsnote')+'</span></div></div>'+
 '<button class="btn ghost" onclick="openLegal()">'+u('cn_open')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('md_title')+'</div>'+
 '<div class="meta"><span>'+MODES[opMode()].name+'</span><span>'+u('md_note')+'</span></div></div>'+
 Object.keys(MODES).map(function(k){
   return '<button class="btn '+(opMode()===k?'':'ghost')+'" onclick="setMode(\''+k+'\')">'+
   MODES[k].name+'</button>'}).join('')+'</div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('mt_device')+'</div>'+
 '<div class="meta"><span>'+(currentWs()?u('mt_setupfor')+' '+esc(currentWs()):u('mt_nows'))+'</span>'+
 '<span>'+(showTeamOnDevice()?u('mt_listshown'):u('mt_listhidden'))+'</span></div></div>'+
 '<button class="btn ghost" onclick="toggleTeamList()">'+(showTeamOnDevice()?u('mt_hidelist'):u('mt_showlist'))+'</button>'+
 '<button class="btn ghost" onclick="switchCompany()">'+u('mt_switch')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('mb_title')+'</div>'+
 '<div class="meta"><span>'+(cloud.on?(memberList.length?memberList.filter(function(m){return m.active}).length+' '+u('mb_active'):u('mb_none')):u('mb_needcloud'))+'</span></div></div>'+
 (cloud.on?'<button class="btn ghost" onclick="loadMembers()">'+u('mb_load')+'</button>'+
   '<button class="btn" onclick="seedMembers()">'+u('mb_seed')+'</button>':'')+'</div>'+
 (memberList.length?memberList.map(function(m){
   return '<div class="row"><span class="dot'+(m.active?' run':' prob')+'"></span><div class="grow">'+
    '<div class="name">'+esc(m.name||m.person_id)+'<span class="pill">'+esc(m.role)+'</span>'+
    (m.active?'':'<span class="pill" style="color:var(--stop);border-color:#4A2226">'+u('mb_off')+'</span>')+'</div>'+
    '<div class="meta"><span class="id">'+esc(m.person_id)+'</span>'+
     (m.email?'<span>'+esc(m.email)+'</span>':'')+(m.phone?'<span>'+esc(m.phone)+'</span>':'')+'</div></div>'+
    (m.active?'<button class="btn ghost" onclick="linkAddress(\''+m.token+'\',\''+m.person_id+'\')">'+
      (m.email||m.phone?u('gl_linked_short'):u('gl_link'))+'</button>'+
      '<button class="btn ghost" onclick="copyMemberLink(\''+m.token+'\')">'+u('mb_link')+'</button>'+
      '<button class="btn ghost" onclick="revokeMember(\''+m.token+'\')">'+u('mb_revoke')+'</button>':'')+'</div>'
  }).join(''):'')+
 '<div class="row"><div class="grow"><div class="name">'+u('ph_title')+'</div>'+
 '<div class="meta"><span>'+photoStats().onDevice+' '+u('ph_ondevice')+' · '+photoStats().kb+' KB</span>'+
 '<span>'+photoStats().inCloud+' '+u('ph_incloud')+'</span></div></div>'+
 (cloud.on?'<button class="btn ghost" onclick="freeSpace()">'+u('ph_free')+'</button>':'')+'</div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('bu_export')+'</div>'+
 '<div class="meta"><span>'+(lastBackup()?u('bu_last')+' '+dayName(ymd(new Date(lastBackup()))):u('bu_never'))+'</span></div></div>'+
 '<button class="btn" onclick="backupNow()">'+u('bu_now')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('bu_restore')+'</div>'+
 '<div class="meta"><span>'+u('bu_restorenote')+'</span></div></div>'+
 '<label class="btn ghost file-btn">'+u('bu_choose')+'<input type="file" accept="application/json,.json" onchange="restoreAll(event)"></label></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('ic_title')+'</div>'+
 '<div class="meta"><span>'+u('ic_note')+'</span></div></div>'+
 '<label class="btn ghost file-btn">'+u('b_import')+'<input type="file" accept=".csv,text/csv" onchange="importCustomers(event)"></label></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('bg_title')+'</div>'+
 '<div class="meta"><span>'+u('bg_note')+'</span></div></div>'+
 '<button class="btn ghost" onclick="reportBug()">'+u('bg_btn')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('ar_title')+'</div>'+
 '<div class="meta"><span>'+u('ar_note')+'</span></div></div>'+
 '<button class="btn ghost" onclick="archiveOld()">'+u('ar_btn')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">'+u('b_resetdemo')+'</div>'+
 '<div class="meta"><span>'+u('s_resetnote')+'</span></div></div>'+
 '<button class="btn ghost" onclick="resetDemo()">'+u('b_reset')+'</button></div>'+
 '<div class="row"><div class="grow"><div class="name">Start empty</div>'+
 '<div class="meta"><span>'+u('s_emptynote')+'</span></div></div>'+
 '<button class="btn red" onclick="startEmpty()">'+u('b_startempty')+'</button></div></div>';
 return h;
}
function openJob(id){open={type:'detail',job:id};render()}
function closeModal(){open=null;if(wiz)wiz=null;render()}
function drawModal(){
 var o=document.querySelector('.mask');if(o)o.remove();if(!open)return;
 var head='',body='',foot='',d=T[lang]||T.en;
 if(open.type==='problem'){head=d.problem;body='<div class="probs">';
  PROB_KEYS.forEach(function(k){body+='<button class="prob'+(probPick===k?' on':'')+'" onclick="pickProb(\''+k+'\')">'+t(k)+'</button>'});
  body+='</div><div class="field" style="margin-top:12px"><label for="pb-note">'+d.whatwrong+'</label><textarea id="pb-note"></textarea></div>'+
  '<div class="field"><label for="pb-pri">'+d.priority+'</label><select id="pb-pri">'+
  '<option value="Low">'+d.low+'</option><option value="Medium" selected>'+d.med+'</option><option value="High">'+d.high+'</option></select></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+d.cancel+'</button><button class="btn red" onclick="saveProblem()">'+d.send+'</button>'}
 else if(open.type==='job'){head=jobForm.editing?u('ed_title'):u('m_schedjob');
  var names=db.props.map(function(p){return p.name});
  var known=names.indexOf(jobForm.prop)>-1;
  body='<div class="field"><label for="j-prop">'+u('f_property')+'</label>'+
   '<select id="j-prop" onchange="pickProp(this.value)">'+
   '<option value=""'+(jobForm.prop?'':' selected')+'>'+u('j_choose')+'</option>'+
   names.map(function(n){return '<option value="'+esc(n)+'"'+(jobForm.prop===n?' selected':'')+'>'+esc(n)+'</option>'}).join('')+
   '<option value="__new"'+((jobForm.prop&&!known)?' selected':'')+'>'+u('j_other')+'</option></select></div>'+
   ((jobForm.prop==='__new'||(jobForm.prop&&!known))?
     '<div class="field"><input id="j-newprop" placeholder="'+u('j_newname')+'" value="'+
      esc(jobForm.prop==='__new'?'':jobForm.prop)+'" oninput="jf(\'prop\',this.value)"></div>':'')+
   (jobForm.from?'<p style="font-size:11px;color:var(--teal);margin:-4px 0 10px">'+u('j_filled')+' '+jobForm.from+'</p>':'')+
   tierPicker()+
   '<div class="field" style="margin-top:12px"><label for="j-cust">'+u('f_customer')+'</label>'+
   '<select id="j-cust" onchange="jf(\'cust\',this.value)">'+
   customers().map(function(cu){return '<option'+(jobForm.cust===cu.name?' selected':'')+'>'+esc(cu.name)+'</option>'}).join('')+
   '<option value="Direct"'+(jobForm.cust==='Direct'?' selected':'')+'>'+u('cu_direct')+'</option></select></div>'+
   (multiTrade()?'<div class="field"><label>'+u('td_which')+'</label><div style="display:flex;gap:5px">'+
     trades().map(function(tr){return '<button class="btn '+((jobForm.trade||trades()[0])===tr?'':'ghost')+
      '" style="flex:1;font-size:11.5px" onclick="jf(\'trade\',\''+tr+'\');jf(\'serv\',servicesFor(\''+tr+'\')[0]);render()">'+
      TRADES[tr].name+'</button>'}).join('')+'</div></div>':'')+
   '<div class="two"><div class="field"><label for="j-serv">'+u('f_service')+'</label>'+
   '<select id="j-serv" onchange="jf(\'serv\',this.value)">'+
   servicesFor(jobForm.trade||trades()[0]).map(function(x){
     return '<option value="'+x+'"'+(jobForm.serv===x?' selected':'')+'>'+svc(x)+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="j-clean">'+u('f_cleaner')+'</label>'+
   '<select id="j-clean" onchange="jf(\'cleaner\',this.value);render()">'+
   '<option value=""'+(jobForm.cleaner?'':' selected')+'>'+u('p_leaveopen')+'</option>'+
   crew().map(function(c){
     var av=availabilityNote(c.id,jobForm.date||todayStr(),jobForm.time,jobForm.serv,tierPick);
     return '<option value="'+c.id+'"'+(jobForm.cleaner===c.id?' selected':'')+'>'+
     esc(c.name)+(c.senior?' (senior)':'')+(av.bad?' — '+av.text:'')+'</option>'}).join('')+'</select></div></div>'+
   (jobForm.cleaner?(function(){
     var av=availabilityNote(jobForm.cleaner,jobForm.date||todayStr(),jobForm.time,jobForm.serv,tierPick);
     return av.bad?'<p style="font-size:11.5px;color:var(--red);margin:-4px 0 10px">⚠ '+esc(av.text)+'</p>':'';
   })():'')+
   teamPicker()+
   '<div class="field"><label for="j-date">'+u('cal_date')+'</label>'+
   '<div style="display:flex;gap:5px;flex-wrap:wrap">'+
   [0,1,2,3].map(function(n){var d=addDays(todayStr(),n);
     return '<button class="btn '+(jobForm.date===d?'':'ghost')+'" style="font-size:11px" onclick="jf(\'date\',\''+d+'\');render()">'+
     dayName(d)+'</button>'}).join('')+
   '<input id="j-date" type="date" value="'+esc(jobForm.date||todayStr())+'" oninput="jf(\'date\',this.value)" style="width:auto;flex:1;min-width:130px"></div></div>'+
   '<div class="two"><div class="field"><label for="j-time">'+u('f_time')+'</label>'+
   '<input id="j-time" placeholder="14:00" value="'+esc(jobForm.time)+'" oninput="jf(\'time\',this.value)"></div>'+
   '<div class="field"><label for="j-price">'+u('f_baseprice')+'</label>'+
   '<input id="j-price" type="number" value="'+jobForm.price+'" oninput="jf(\'price\',this.value)"></div></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0 0 4px">'+u('n_premmult')+'</p>'+
   '<div style="border-top:1px solid var(--line);margin:11px 0 0;padding-top:11px">'+
   '<div style="font-size:10.5px;color:var(--muted);margin-bottom:7px">'+u('m_where')+
   (jobForm.lat?' <span style="color:var(--teal)">'+jobForm.lat.toFixed(5)+', '+jobForm.lng.toFixed(5)+'</span>':'')+'</div>'+
   '<div class="field"><input id="j-addr" placeholder="'+u('m_anyaddress')+'"></div>'+
   '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px">'+
    '<button class="btn ghost" onclick="jobFind()">'+ic('pin')+u('m_find')+'</button>'+
    '<button class="btn ghost" onclick="jobHere()">'+ic('pin')+u('m_here')+'</button>'+
    (jobForm.lat?'<button class="btn ghost" onclick="jobClearPin()">'+u('m_clear')+'</button>':'')+'</div>'+
   '<div class="field"><label for="j-coords">'+u('m_coords')+'</label>'+
    '<div style="display:flex;gap:6px"><input id="j-coords" placeholder="25.08014, 55.14012" value="'+
    (jobForm.lat?jobForm.lat.toFixed(5)+', '+jobForm.lng.toFixed(5):'')+'">'+
    '<button class="btn" onclick="jobCoords()">'+u('m_setpin')+'</button></div></div>'+
   (jobForm.lat?'<iframe title="map" src="'+gEmbed({lat:jobForm.lat,lng:jobForm.lng},16)+'" style="width:100%;height:150px;border:1px solid var(--line2);border-radius:7px;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
      :'<p style="font-size:11px;color:var(--faint);margin:0">'+u('m_pinhint')+'</p>')+
   '</div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="'+(jobForm.editing?'applyEdit()':'saveJob()')+'">'+(jobForm.editing?u('ed_save'):u('b_schedule'))+'</button>'}
 else if(open.type==='task'){head=u('m_task');
  body='<div class="field"><label for="t-type">'+u('f_task')+'</label>'+
   '<select id="t-type" onchange="pickTaskKind(this.value)">'+
   TASK_TYPES.map(function(x){return '<option value="'+x.id+'"'+(taskKind===x.id?' selected':'')+'>'+
     x.name+'</option>'}).join('')+
   '<option value="custom"'+(taskKind==='custom'?' selected':'')+'>'+u('tk_custom')+'</option></select></div>'+
   (taskKind==='custom'?'<div class="field"><label for="t-custom">'+u('tk_what')+'</label>'+
     '<input id="t-custom" placeholder="'+u('tk_example')+'"></div>':'')+
   '<div class="field"><label for="t-prop">'+u('f_property')+'</label><input id="t-prop"></div>'+
   '<div style="border-top:1px solid var(--line);margin:11px 0;padding-top:11px">'+
   '<div style="font-size:10.5px;color:var(--muted);margin-bottom:8px">'+u('tp_title')+'</div>'+
   tpBlock('from',u('tp_pickup'))+tpBlock('to',u('tp_dropoff'))+
   ((taskPlace.from&&taskPlace.from.lat&&taskPlace.to&&taskPlace.to.lat)?
     '<iframe title="map" src="'+gEmbed(taskPlace.from,14)+'" style="width:100%;height:140px;border:1px solid var(--line2);border-radius:7px;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>':'')+
   '</div>'+
   (session.role==='customer'?'':'<div class="field"><label for="t-cust">'+u('f_customer')+'</label><input id="t-cust"></div>')+
   '<div class="field"><label>'+u('tk_pricing')+'</label><div style="display:flex;gap:6px">'+
   '<button class="btn '+(taskMode==='fixed'?'':'ghost')+'" style="flex:1;font-size:11.5px" onclick="setTaskMode(\'fixed\')">'+u('tk_fixed')+'</button>'+
   '<button class="btn '+(taskMode==='offers'?'':'ghost')+'" style="flex:1;font-size:11.5px" onclick="setTaskMode(\'offers\')">'+u('tk_askprice')+'</button></div></div>'+
   (taskMode==='fixed'?'<div class="field"><label for="t-fee">'+u('f_fee')+'</label>'+
     '<input id="t-fee" type="number" value="'+(taskKind==='custom'?'':taskType(taskKind).fee)+'"></div>'
    :'<p style="font-size:11px;color:var(--faint);margin:-4px 0 10px">'+u('tk_asknote')+'</p>')+
   '<div class="field"><label for="t-note">'+u('f_detail')+'</label><textarea id="t-note"></textarea></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('n_taskshare')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn gold" onclick="saveTask()">'+u('b_post')+'</button>'}
 else if(open.type==='offer'){
  var x=task(open.task),mine=myOffer(x);
  head=u('tk_bid')+' · '+esc(taskTitle(x));
  body='<div class="kv"><span>'+u('f_property')+'</span><span>'+esc(x.prop)+'</span></div>'+
   (x.note?'<div class="kv"><span>'+u('f_detail')+'</span><span>'+esc(x.note)+'</span></div>':'')+
   (taskOffers(x).length?'<div class="kv"><span>'+u('tk_bids')+'</span><span>'+taskOffers(x).length+
     (bestOffer(x)?' · '+u('tk_from')+' '+aed(bestOffer(x).price):'')+'</span></div>':'')+
   '<div class="field" style="margin-top:12px"><label for="of-price">'+u('tk_yourprice')+'</label>'+
   '<input id="of-price" type="number" step="5" value="'+(mine?mine.price:'')+'"></div>'+
   '<div class="field"><label for="of-note">'+u('tk_note')+'</label><input id="of-note" value="'+esc(mine?mine.note:'')+'"></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('tk_keepshare')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn gold" onclick="saveOffer()">'+(mine?u('tk_changebid'):u('tk_sendbid'))+'</button>'}
 else if(open.type==='offers'){
  var x2=task(open.task);
  head=u('tk_seebids')+' · '+esc(taskTitle(x2));
  var list=taskOffers(x2).slice().sort(function(a,b){return a.price-b.price});
  body=list.length?list.map(function(o){var c=cleaner(o.by);
   return '<div class="row" style="padding-left:0;padding-right:0"><div class="av">'+c.initials+'</div>'+
    '<div class="grow"><div class="name">'+esc(c.name)+'</div>'+
    '<div class="meta"><span>'+ratingOf(c).toFixed(2)+'★</span>'+
    (o.note?'<span>'+esc(o.note)+'</span>':'')+'<span>'+hhmm(o.at)+'</span></div></div>'+
    '<span class="mono" style="color:var(--gold)">'+aed(o.price)+'</span>'+
    '<button class="btn" onclick="acceptOffer(\''+x2.id+'\',\''+o.by+'\')">'+u('tk_accept')+'</button></div>'
   }).join(''):'<div class="empty"><b>'+u('tk_nobids')+'</b>'+u('tk_nobidssub')+'</div>';
  foot='<button class="btn" onclick="closeModal()">'+u('b_close')+'</button>'}
 else if(open.type==='prop'){var p=db.props[open.idx];head=u('m_access')+' — '+esc(p.name);
  body='<div class="field"><label for="x-key">'+u('f_key')+'</label><input id="x-key" value="'+esc(p.key)+'"></div>'+
  '<div class="field"><label for="x-park">'+u('f_parking')+'</label><input id="x-park" value="'+esc(p.park)+'"></div>'+
  '<div class="two"><div class="field"><label for="x-alarm">'+u('f_alarm')+'</label><input id="x-alarm" value="'+esc(p.alarm)+'"></div>'+
  '<div class="field"><label for="x-wifi">'+u('f_wifi')+'</label><input id="x-wifi" value="'+esc(p.wifi)+'"></div></div>'+
  '<div class="field"><label for="x-note">'+u('f_note')+'</label><textarea id="x-note">'+esc(p.note)+'</textarea></div>'+
  '<div style="border-top:1px solid var(--line);margin:12px 0 11px;padding-top:11px">'+
  '<div style="font-size:10.5px;color:var(--muted);margin-bottom:7px">'+u('m_where')+'</div>'+
  '<div class="field"><input id="x-addr" placeholder="'+u('m_anyaddress')+'"></div>'+
  '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px">'+
   '<button class="btn ghost" onclick="findOnMap()">'+ic('pin')+u('m_find')+'</button>'+
   '<button class="btn ghost" onclick="useMyLocation()">'+ic('pin')+u('m_here')+'</button>'+
   (p.lat?'<button class="btn ghost" onclick="clearCoords()">'+u('m_clear')+'</button>':'')+'</div>'+
  '<div class="field"><label for="x-coords">'+u('m_coords')+'</label>'+
   '<div style="display:flex;gap:6px"><input id="x-coords" placeholder="25.08014, 55.14012" value="'+
   (p.lat?p.lat.toFixed(5)+', '+p.lng.toFixed(5):'')+'">'+
   '<button class="btn" onclick="setCoords()">'+u('m_setpin')+'</button></div></div>'+
   (p.lat?'<iframe title="map" src="'+gEmbed(p,16)+'" style="width:100%;height:150px;border:1px solid var(--line2);border-radius:7px;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
        :'<p style="font-size:11px;color:var(--faint);margin:0">'+u('m_notonmap')+'</p>')+
  '</div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button><button class="btn" onclick="saveProp()">'+u('b_save')+'</button>'}
 else if(open.type==='contract'){head=u('m_contract');
  body=tierPicker()+'<div class="field" style="margin-top:12px"><label for="r-prop">'+u('f_property')+'</label><input id="r-prop"></div>'+
  '<div class="field"><label for="r-cust">'+u('f_customer')+'</label><input id="r-cust"></div>'+
  '<div class="two"><div class="field"><label for="r-serv">'+u('f_service')+'</label><select id="r-serv"><option>Standard</option><option>Deep clean</option><option>Turnover</option></select></div>'+
  '<div class="field"><label for="r-clean">'+u('f_cleaner')+'</label><select id="r-clean">'+cleanerOptions(null)+'</select></div></div>'+
  '<div class="two"><div class="field"><label for="r-freq">'+u('f_repeats')+'</label><select id="r-freq"><option value="weekly">'+u('f_weekly')+'</option><option value="fortnightly">'+u('f_fortnightly')+'</option></select></div>'+
  '<div class="field"><label for="r-time">'+u('f_time')+'</label><input id="r-time" placeholder="09:00"></div></div>'+
  '<div class="field"><label for="r-price">'+u('f_pervisit')+'</label><input id="r-price" type="number" placeholder="165"></div>'+
  '<div class="field"><label'+u('f_days')+'</label><div class="days">';
  weekDays(true).forEach(function(w){body+='<button class="day'+(dayPick.indexOf(w.d)>-1?' on':'')+'" onclick="toggleDay('+w.d+')">'+w.label.slice(0,2)+'</button>'});
  body+='</div></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button><button class="btn" onclick="saveContract()">'+u('b_add')+'</button>'}
 else if(open.type==='book'){head=u('m_book');
  var myProps=db.props.filter(function(p){
   return db.jobs.some(function(j){return j.prop===p.name&&j.customer===customerName()})});
  body=tierPicker()+
   '<div class="field" style="margin-top:12px"><label for="b-prop">'+u('f_property')+'</label>'+
   (myProps.length?
     '<select id="b-prop" onchange="bf(\'prop\',this.value)">'+
     myProps.map(function(p){return '<option'+(bookForm.prop===p.name?' selected':'')+'>'+esc(p.name)+'</option>'}).join('')+
     '<option value="__new">'+u('bk_other')+'</option></select>'
    :'<input id="b-prop" value="'+esc(bookForm.prop)+'" oninput="bf(\'prop\',this.value)">')+'</div>'+
   ((myProps.length&&bookForm.prop==='__new')?
     '<div class="field"><input id="b-newprop" placeholder="'+u('bk_address')+'" oninput="bf(\'prop2\',this.value)"></div>':'')+
   '<div class="field"><label>'+u('bk_day')+'</label>'+
   '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:7px">'+
   [1,2,3,4,5,6,7].map(function(n){var d=addDays(todayStr(),n);
     return '<button class="btn '+(bookForm.date===d?'':'ghost')+'" style="font-size:11px" onclick="bf(\'date\',\''+d+'\')">'+
     dayName(d)+'</button>'}).join('')+'</div>'+
   '<input id="b-date" type="date" min="'+todayStr()+'" value="'+bookForm.date+'" oninput="bf(\'date\',this.value)"></div>'+
   '<div class="field"><label>'+u('bk_time')+'</label><div style="display:flex;gap:4px;flex-wrap:wrap">'+
   SLOTS.map(function(x){return '<button class="btn '+(bookForm.time===x?'':'ghost')+'" style="font-size:11px;padding:6px 9px" '+
     'onclick="bf(\'time\',\''+x+'\')">'+x+'</button>'}).join('')+'</div></div>'+
   '<div class="field"><label for="b-serv">'+u('f_service')+'</label>'+
   '<select id="b-serv" onchange="bf(\'serv\',this.value)">'+
   ['Standard','Deep clean','Move-out','Turnover'].map(function(x){
     return '<option'+(bookForm.serv===x?' selected':'')+'>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="b-note">'+u('f_anything')+'</label>'+
   '<textarea id="b-note" oninput="bf(\'note\',this.value)">'+esc(bookForm.note)+'</textarea></div>'+
   '<label style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--muted)">'+
   '<input type="checkbox" id="b-dep"'+(bookForm.deposit?' checked':'')+' onchange="bf(\'deposit\',this.checked)" style="width:auto"> '+
   u('f_deposit')+'</label>'+
   '<div style="background:#171C23;border:1px solid var(--line2);border-radius:8px;padding:10px;margin-top:11px;font-size:12.5px">'+
   '<b>'+dayName(bookForm.date)+' '+u('bk_at')+' '+bookForm.time+'</b><br>'+
   '<span style="color:var(--muted)">'+esc(bookForm.serv)+' · '+TIERS[tierPick].name+' · '+TIERS[tierPick].arrive+'</span></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveBooking()">'+u('b_request')+'</button>'}
 else if(open.type==='pay'){var v=null;db.invoices.forEach(function(x){if(x.id===open.inv)v=x});
  var net=v.jobs*v.rate,bal=net*(1+taxRate())-invPaid(v);head=u('m_payment')+' · '+open.inv;
  body='<div class="kv"><span>'+u('h_net')+'</span><span class="mono">'+aed(net)+'</span></div>'+
  '<div class="kv"><span>'+taxLabel()+'</span><span class="mono">'+aed(net*taxRate())+'</span></div>'+
  '<div class="kv"><span>'+u('h_total')+'</span><span class="mono">'+aed(net*(1+taxRate()))+'</span></div>'+
  '<div class="kv"><span>'+u('d_paid')+'</span><span class="mono">'+aed(invPaid(v))+'</span></div>'+
  '<div class="kv"><span>'+u('d_balance')+'</span><span class="mono" style="color:var(--red)">'+aed(bal)+'</span></div>'+
  '<div class="field" style="margin-top:12px"><label for="p-amt">'+u('f_amount')+'</label><input id="p-amt" type="number" value="'+Math.round(bal)+'"></div>'+
  '<div class="field"><label for="p-method">'+u('f_method')+'</label><select id="p-method"><option>Payment link</option><option>Bank transfer</option><option>Cash</option><option>Card on site</option><option>Cheque</option></select></div>'+
  (payLink(v.id,bal)?'<p style="font-size:11px;color:var(--faint);margin:0">'+u('n_paylink')+': <span class="mono">'+esc(payLink(v.id,bal))+'</span></p>':'');
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button><button class="btn" onclick="savePayment()">'+u('b_record')+'</button>'}
 else if(open.type==='cleaner'){head=u('m_addcleaner');
  body='<div class="field"><label for="c-name">'+u('f_fullname')+'</label><input id="c-name" placeholder="Ahmed Hassan"></div>'+
  '<div class="field"><label for="c-phone">'+u('f_whatsapp')+'</label><input id="c-phone" placeholder="971 50 224 8871"></div>'+
  '<div class="two"><div class="field"><label for="c-lang">'+u('f_applang')+'</label><select id="c-lang">'+
  Object.keys(T).map(function(L){return '<option value="'+L+'">'+T[L].name+'</option>'}).join('')+'</select></div>'+
  '<div class="field"><label for="c-rate">'+u('f_hourly')+'</label><input id="c-rate" type="number" placeholder="22"></div></div>'+
  '<label style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--muted)">'+
  '<input type="checkbox" id="c-senior" style="width:auto"> '+u('f_senior_note')+'</label>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button><button class="btn" onclick="saveCleaner()">'+u('b_add')+'</button>'}
 else if(open.type==='messages'){
  var j=job(open.job),c=cleaner(j.cleaner),p=property(j.prop);
  head=u('msg_title')+' · '+esc(j.prop);
  var opts=[
   [u('msg_day'), c.phone, msgFor('day',{c:c})],
   [u('msg_where'), c.phone, msgFor('where',{c:c})],
   [u('msg_onway'), S().officePhone, msgFor('onway',{name:j.prop})],
   [u('msg_late'), S().officePhone, msgFor('late',{name:j.prop,mins:20})],
   [u('msg_done'), S().officePhone, msgFor('done',{job:j})]
  ];
  body=opts.map(function(o){
   return '<a class="wa" style="display:flex;width:100%;margin-bottom:7px;padding:10px 11px" href="'+
    wa(o[1],o[2])+'" target="_blank" rel="noopener">'+ic('wa')+'<span>'+o[0]+'</span></a>'}).join('')+
   '<p style="font-size:11px;color:var(--faint);margin:6px 0 0">'+u('msg_note')+'</p>';
  foot='<button class="btn" onclick="closeModal()">'+u('b_close')+'</button>'}
 else if(open.type==='link'){head=u('a_copy');
  body='<p style="font-size:12px;color:var(--muted);margin:0 0 9px">'+u('a_invitenote')+'</p>'+
   '<pre class="csv">'+esc(open.link)+'</pre>';
  foot='<button class="btn" onclick="closeModal()">'+u('b_done')+'</button>'}
 else if(open.type==='assign'){
  var j=job(open.job);
  head=u('p_reassign')+' · '+esc(j.prop);
  body='<div class="field"><label>'+u('f_cleaner')+'</label>'+
   '<select onchange="doAssign(this.value)">'+
   '<option value=""'+(j.cleaner?'':' selected')+'>'+u('p_leaveopen')+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'"'+(j.cleaner===c.id?' selected':'')+'>'+
     esc(c.name)+(c.senior?' (senior)':'')+' — '+db.jobs.filter(function(x){return x.cleaner===c.id&&x.status!=='cancelled'}).length+' '+u('c_jobs')+
     '</option>'}).join('')+'</select></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('p_assignnote')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'}
 else if(open.type==='customer'){
  head=u('cu_add');
  body='<div class="field"><label for="cu-name">'+u('f_customer')+'</label><input id="cu-name" placeholder="Marina Heights Tower"></div>'+
   '<div class="field"><label for="cu-contact">'+u('cu_contact')+'</label><input id="cu-contact"></div>'+
   '<div class="two"><div class="field"><label for="cu-phone">'+u('f_whatsapp')+'</label><input id="cu-phone"></div>'+
   '<div class="field"><label for="cu-email">'+u('f_email')+'</label><input id="cu-email"></div></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveCustomer()">'+u('b_add')+'</button>'}
 else if(open.type==='order'){
  head=u('inv_neworder');
  body='<div class="field"><label for="po-sup">'+u('inv_supplier_label')+'</label>'+
   '<input id="po-sup" value="'+esc((lowStock()[0]||{}).supplier||'')+'"></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0 0 9px">'+u('inv_ordernote')+'</p>'+
   stock().map(function(it){
    var sug=it.qty<it.min?suggestQty(it):0;
    return '<div style="display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)">'+
     '<div style="flex:1"><div style="font-size:12.5px">'+esc(it.item)+'</div>'+
     '<div style="font-size:10.5px;color:var(--faint)">'+it.qty+' '+esc(it.unit||'')+' · '+aed(it.cost||0)+'</div></div>'+
     '<input id="po-'+it.id+'" type="number" min="0" value="'+sug+'" style="width:76px">'+
     '</div>'}).join('');
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveOrder()">'+u('inv_neworder')+'</button>'}
 else if(open.type==='used'){
  head=u('inv_report');
  body='<p style="font-size:11.5px;color:var(--muted);margin:0 0 10px">'+u('inv_usednote')+'</p>'+
   stock().map(function(it){
    return '<div style="display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)">'+
     '<div style="flex:1;font-size:12.5px">'+esc(it.item)+
     '<div style="font-size:10.5px;color:var(--faint)">'+it.qty+' '+esc(it.unit||'')+'</div></div>'+
     '<input id="us-'+it.id+'" type="number" min="0" step="0.5" value="0" style="width:76px">'+
     '</div>'}).join('');
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveUsed()">'+u('b_save')+'</button>'}
 else if(open.type==='statement'){
  var v=null;db.invoices.forEach(function(x){if(x.id===open.inv)v=x});
  head=u('bill_lines')+' · '+open.inv;
  var js=invoiceJobs(v);
  body='<div class="kv"><span>'+u('h_customer')+'</span><span>'+esc(v.customer)+'</span></div>'+
   '<div class="kv"><span>'+esc(S().idLabel)+'</span><span class="mono">'+esc(v.trn||'—')+'</span></div>'+
   '<div class="kv"><span>'+u('bill_issued')+'</span><span>'+(v.issued?new Date(v.issued).toLocaleDateString(S().locale):'—')+'</span></div>'+
   '<div style="font-size:11px;color:var(--faint);margin:12px 0 5px">'+u('bill_lines')+'</div>';
  if(!js.length)body+='<p style="font-size:12px;color:var(--faint)">'+v.jobs+' × '+aed(v.rate)+'</p>';
  else js.forEach(function(j){
   body+='<div class="kv"><span>'+dayName(jobDate(j))+' · '+esc(j.prop)+
    (j.status==='cancelled'?' ('+u('cx_title')+')':'')+'</span>'+
    '<span class="mono">'+aed(j.status==='cancelled'?j.cancel.fee:j.price)+'</span></div>';
  });
  body+='<div style="border-top:1px solid var(--line);margin-top:9px;padding-top:9px">'+
   '<div class="kv"><span>'+u('h_net')+'</span><span class="mono">'+aed(invNet(v))+'</span></div>'+
   '<div class="kv"><span>'+taxLabel()+'</span><span class="mono">'+aed(invNet(v)*taxRate())+'</span></div>'+
   '<div class="kv"><span>'+u('h_total')+'</span><span class="mono">'+aed(invTotal(v))+'</span></div>'+
   '<div class="kv"><span>'+u('d_paid')+'</span><span class="mono">'+aed(invPaid(v))+'</span></div>'+
   (invCredits(v)?'<div class="kv"><span>'+u('rf_credited')+'</span><span class="mono">'+aed(invCredits(v))+'</span></div>':'')+
   '<div class="kv"><span>'+u('d_balance')+'</span><span class="mono" style="color:var(--amber)">'+aed(invDue(v))+'</span></div></div>';
  foot=(invDue(v)>0.5?'<button class="btn ghost" onclick="askPayment(\''+v.id+'\',\'wa\')">'+ic('wa')+u('gp_ask')+'</button>'+
   '<button class="btn ghost" onclick="askPayment(\''+v.id+'\',\'mail\')">'+u('gp_email')+'</button>':'')+
   '<button class="btn" onclick="closeModal()">'+u('b_close')+'</button>'}
 else if(open.type==='expense'){
  head=u('ex_add');
  body='<div class="two"><div class="field"><label for="ex-kind">'+u('ex_kind')+'</label>'+
   '<select id="ex-kind">'+EXP_KINDS.map(function(k){return '<option>'+k+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="ex-amt">'+u('ex_amountlabel')+'</label><input id="ex-amt" type="number" step="0.5"></div></div>'+
   '<div class="field"><label for="ex-by">'+u('ex_who')+'</label><select id="ex-by">'+
   '<option value="">'+u('ex_company')+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="ex-note">'+u('f_detail')+'</label><input id="ex-note"></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveExpense()">'+u('b_add')+'</button>'}
 else if(open.type==='list'){
  var p=db.props[open.idx];
  head=u('cl_btn')+' — '+esc(p.name);
  var cur=p.list||CHECK_KEYS.slice();
  body='<p style="font-size:11.5px;color:var(--muted);margin:0 0 10px">'+u('cl_note')+'</p>';
  CHECK_KEYS.forEach(function(k){
   var on=cur.indexOf(k)>-1;
   body+='<div class="check'+(on?' on':'')+'" onclick="toggleListItem(\''+k+'\')"><div class="box">✓</div>'+
    '<div class="lbl">'+T.en[k]+'</div></div>';
  });
  Object.keys(p.extraItems||{}).forEach(function(k){
   var on=cur.indexOf(k)>-1;
   body+='<div class="check'+(on?' on':'')+'"><div class="box" onclick="toggleListItem(\''+k+'\')">✓</div>'+
    '<div class="lbl">'+esc(p.extraItems[k])+'</div>'+
    '<button class="btn ghost" style="margin-left:auto;font-size:11px" onclick="removeListItem(\''+k+'\')">'+u('b_remove')+'</button></div>';
  });
  body+='<div class="field" style="margin-top:12px"><label for="li-new">'+u('cl_addown')+'</label>'+
   '<div style="display:flex;gap:6px"><input id="li-new" placeholder="'+u('cl_example')+'">'+
   '<button class="btn" onclick="addListItem()">'+u('b_add')+'</button></div></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+cur.length+' '+u('cl_items')+'</p>';
  foot='<button class="btn ghost" onclick="resetList()">'+u('cl_resetbtn')+'</button>'+
   '<button class="btn" onclick="closeModal()">'+u('b_done')+'</button>'}
 else if(open.type==='key'){
  head=u('ky_add');
  body='<div class="field"><label for="k-prop">'+u('f_property')+'</label><select id="k-prop">'+
   db.props.map(function(p){return '<option>'+esc(p.name)+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="k-label">'+u('ky_label')+'</label><input id="k-label" placeholder="'+u('ky_labelex')+'"></div>'+
   '<div class="field"><label for="k-holder">'+u('ky_with')+'</label><select id="k-holder">'+
   '<option value="office">'+u('ky_office')+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join('')+'</select></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveKey()">'+u('b_add')+'</button>'}
 else if(open.type==='handkey'){
  var k2=keys().filter(function(x){return x.id===open.key})[0];
  head=u('ky_hand')+' — '+esc(k2.prop);
  body='<div class="kv"><span>'+u('ky_with')+'</span><span>'+esc(holderName(k2.holder))+'</span></div>'+
   '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">'+
   '<button class="btn ghost" onclick="moveKey(\''+k2.id+'\',\'office\')">'+u('ky_office')+'</button>'+
   crew().map(function(c){return '<button class="btn '+(k2.holder===c.id?'':'ghost')+'" onclick="moveKey(\''+k2.id+'\',\''+c.id+'\')">'+esc(c.name.split(' ')[0])+'</button>'}).join('')+
   '<button class="btn red" onclick="moveKey(\''+k2.id+'\',\'lost\')">'+u('ky_lostbtn')+'</button></div>'+
   ((k2.log||[]).length?'<div style="font-size:11px;color:var(--faint);margin-top:12px">'+
     k2.log.map(function(l){return hhmm(l.at)+' · '+esc(holderName(l.from))+' → '+esc(holderName(l.to))}).join('<br>')+'</div>':'');
  foot='<button class="btn" onclick="closeModal()">'+u('b_close')+'</button>'}
 else if(open.type==='gear'){
  head=u('gr_add');
  body='<div class="field"><label for="g-name">'+u('gr_what')+'</label><input id="g-name" placeholder="'+u('gr_example')+'"></div>'+
   '<div class="two"><div class="field"><label for="g-serial">'+u('gr_serial')+'</label><input id="g-serial"></div>'+
   '<div class="field"><label for="g-bought">'+u('gr_bought')+'</label><input id="g-bought" type="date" value="'+todayStr()+'"></div></div>'+
   '<div class="two"><div class="field"><label for="g-holder">'+u('ky_with')+'</label><select id="g-holder">'+
   '<option value="office">'+u('ky_office')+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="g-service">'+u('gr_service')+'</label><input id="g-service" type="date"></div></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveGear()">'+u('b_add')+'</button>'}
 else if(open.type==='lead'){
  head=u('sl_add');
  body='<div class="field"><label for="ld-name">'+u('sl_who')+'</label><input id="ld-name"></div>'+
   '<div class="two"><div class="field"><label for="ld-phone">'+u('f_whatsapp')+'</label><input id="ld-phone"></div>'+
   '<div class="field"><label for="ld-source">'+u('sl_source')+'</label><select id="ld-source">'+
   ['Phone','WhatsApp','Website','Walk-in','Referral','Instagram'].map(function(x){return '<option>'+x+'</option>'}).join('')+
   '</select></div></div>'+
   '<div class="field"><label for="ld-prop">'+u('pb_where')+'</label><input id="ld-prop"></div>'+
   '<div class="field"><label for="ld-note">'+u('f_detail')+'</label><textarea id="ld-note"></textarea></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveLead()">'+u('b_add')+'</button>'}
 else if(open.type==='quote'){
  var ld=open.lead?leads().filter(function(l){return l.id===open.lead})[0]:null;
  head=u('qt_new');
  body='<div class="field"><label for="q-who">'+u('sl_who')+'</label><input id="q-who" value="'+esc(ld?ld.name:'')+'"></div>'+
   '<div class="two"><div class="field"><label for="q-phone">'+u('f_whatsapp')+'</label><input id="q-phone" value="'+esc(ld?ld.phone:'')+'"></div>'+
   '<div class="field"><label for="q-prop">'+u('f_property')+'</label><input id="q-prop" value="'+esc(ld?ld.prop:'')+'"></div></div>'+
   '<div style="display:flex;gap:8px;margin-bottom:10px">'+
   '<div style="flex:1"><label>'+u('qt_beds')+'</label><div style="display:flex;gap:4px">'+
   [0,1,2,3,4,5].map(function(n){return '<button class="btn '+(quoteRooms.beds===n?'':'ghost')+'" style="flex:1;padding:7px 0;font-size:11.5px" onclick="qSet(\'beds\','+n+')">'+n+'</button>'}).join('')+'</div></div></div>'+
   '<div style="display:flex;gap:8px;margin-bottom:10px"><div style="flex:1"><label>'+u('qt_baths')+'</label><div style="display:flex;gap:4px">'+
   [1,2,3,4].map(function(n){return '<button class="btn '+(quoteRooms.baths===n?'':'ghost')+'" style="flex:1;padding:7px 0;font-size:11.5px" onclick="qSet(\'baths\','+n+')">'+n+'</button>'}).join('')+'</div></div></div>'+
   '<div class="field"><label for="q-size">'+u('qt_size')+'</label>'+
   '<input id="q-size" type="number" value="'+esc(quoteRooms.size)+'" oninput="qSet(\'size\',this.value)"></div>'+
   '<div class="field"><label>'+u('f_service')+'</label><div style="display:flex;gap:4px;flex-wrap:wrap">'+
   ['Standard','Deep clean','Move-out','Turnover'].map(function(x){return '<button class="btn '+(quoteRooms.service===x?'':'ghost')+'" style="font-size:11.5px" onclick="qSet(\'service\',\''+x+'\')">'+x+'</button>'}).join('')+'</div></div>'+
   '<div class="field"><label>'+u('t_tier')+'</label><div style="display:flex;gap:4px">'+
   ['standard','premium'].map(function(x){return '<button class="btn '+(quoteRooms.tier===x?'':'ghost')+'" style="flex:1;font-size:11.5px" onclick="qSet(\'tier\',\''+x+'\')">'+TIERS[x].name+'</button>'}).join('')+'</div></div>'+
   '<div class="field"><label>'+u('f_repeats')+'</label><div style="display:flex;gap:4px">'+
   [['one',u('qt_once')],['weekly',u('f_weekly')],['fortnightly',u('f_fortnightly')]].map(function(x){
     return '<button class="btn '+(quoteRooms.freq===x[0]?'':'ghost')+'" style="flex:1;font-size:11.5px" onclick="qSet(\'freq\',\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div></div>'+
   '<div style="background:#171C23;border:1px solid var(--line2);border-radius:8px;padding:12px;text-align:center">'+
   '<div style="font-size:11px;color:var(--faint)">'+u('qt_price')+'</div>'+
   '<div class="mono" style="font-size:26px;color:var(--teal);font-weight:600">'+aed(quotePrice())+'</div>'+
   '<div style="font-size:11px;color:var(--faint)">'+(quoteRooms.freq==='one'?u('qt_onceoff'):u('qt_pervisit'))+'</div></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveQuote()">'+u('qt_save')+'</button>'}
 else if(open.type==='leave'){
  var c=cleaner(open.who);
  head=u('lv_book')+' — '+esc(c.name);
  body='<div class="kv"><span>'+u('lv_left')+'</span><span>'+leaveLeft(c)+' '+u('lv_days_l')+'</span></div>'+
   '<div class="two" style="margin-top:12px"><div class="field"><label for="lv-from">'+u('lv_from')+'</label>'+
   '<input id="lv-from" type="date" value="'+todayStr()+'"></div>'+
   '<div class="field"><label for="lv-days">'+u('lv_howmany')+'</label><input id="lv-days" type="number" value="1"></div></div>'+
   '<div class="field"><label for="lv-kind">'+u('lv_kind')+'</label><select id="lv-kind">'+
   ['Annual','Sick','Unpaid','Emergency'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="lv-note">'+u('f_detail')+'</label><input id="lv-note"></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('lv_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveLeave()">'+u('lv_book')+'</button>'}
 else if(open.type==='doc'){
  head=u('dc_add');
  body='<div class="field"><label for="dc-who">'+u('dc_whose')+'</label><select id="dc-who">'+
   '<option value="company">'+esc(db.company)+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'"'+(open.who===c.id?' selected':'')+'>'+esc(c.name)+'</option>'}).join('')+'</select></div>'+
   '<div class="two"><div class="field"><label for="dc-kind">'+u('dc_kind')+'</label><select id="dc-kind">'+
   DOC_KINDS.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="dc-exp">'+u('dc_expires')+'</label><input id="dc-exp" type="date"></div></div>'+
   '<div class="field"><label for="dc-ref">'+u('dc_ref')+'</label><input id="dc-ref"></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('dc_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveDoc()">'+u('b_add')+'</button>'}
 else if(open.type==='incident'){
  head=u('in_add');
  body='<div class="two"><div class="field"><label for="in-kind">'+u('in_kind')+'</label><select id="in-kind">'+
   INC_KINDS.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="in-who">'+u('in_who')+'</label><select id="in-who">'+
   '<option value="">'+u('in_nobody')+'</option>'+
   crew().map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join('')+'</select></div></div>'+
   '<div class="field"><label for="in-prop">'+u('f_property')+'</label><input id="in-prop"></div>'+
   '<div class="field"><label for="in-what">'+u('in_what')+'</label><textarea id="in-what"></textarea></div>'+
   '<div class="field"><label for="in-action">'+u('in_action')+'</label><textarea id="in-action"></textarea></div>'+
   '<label style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--muted)">'+
   '<input type="checkbox" id="in-reported" style="width:auto"> '+u('in_reportedq')+'</label>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn red" onclick="saveIncident()">'+u('in_add')+'</button>'}
 else if(open.type==='sheet'){
  head=u('sf_add');
  body='<div class="field"><label for="sh-name">'+u('sf_product')+'</label><input id="sh-name" placeholder="'+u('sf_example')+'"></div>'+
   '<div class="field"><label for="sh-hazard">'+u('sf_hazard')+'</label><select id="sh-hazard">'+
   ['Irritant','Corrosive','Flammable','Toxic','Harmful','Not classified'].map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="sh-ppe">'+u('sf_ppe')+'</label><input id="sh-ppe" placeholder="'+u('sf_ppeex')+'"></div>'+
   '<div class="field"><label for="sh-first">'+u('sf_first')+'</label><input id="sh-first" placeholder="'+u('sf_firstex')+'"></div>'+
   '<div class="field"><label for="sh-link">'+u('sf_link')+'</label><input id="sh-link" placeholder="https://"></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveSheet()">'+u('b_add')+'</button>'}
 else if(open.type==='wizard'){
  head=u('wz_title')+' · '+wiz.step+'/4';
  body=vWizard();
  foot=(wiz.step>1?'<button class="btn ghost" onclick="wizBack()">'+u('wz_back')+'</button>':
    '<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>')+
   '<button class="btn" onclick="wizNext()">'+(wiz.step===4?u('wz_finish'):u('wz_next'))+'</button>'}
 else if(open.type==='plan'){
  head=u('pn_add');
  body='<div class="field"><label for="pl-type">'+u('f_task')+'</label><select id="pl-type">'+
   TASK_TYPES.map(function(x){return '<option value="'+x.id+'">'+ttName(x)+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="pl-custom">'+u('pn_or')+'</label><input id="pl-custom" placeholder="'+u('tk_example')+'"></div>'+
   '<div class="two"><div class="field"><label for="pl-prop">'+u('f_property')+'</label><input id="pl-prop"></div>'+
   '<div class="field"><label for="pl-cust">'+u('f_customer')+'</label><input id="pl-cust"></div></div>'+
   '<div class="field"><label>'+u('f_days')+'</label>'+
   '<div style="display:flex;gap:5px;flex-wrap:wrap">'+
   ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(function(d,i){
     return '<label style="display:flex;gap:5px;align-items:center;font-size:11.5px;color:var(--muted)">'+
     '<input type="checkbox" id="pl-d'+i+'" style="width:auto"> '+d+'</label>'}).join('')+'</div></div>'+
   '<div class="field"><label for="pl-fee">'+u('pn_fee')+'</label><input id="pl-fee" type="number" placeholder="0"></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('pn_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="savePlan()">'+u('b_add')+'</button>'}
 else if(open.type==='compare'){
  var j=job(open.job);
  head=u('cm_btn')+' — '+esc(j.prop);
  var before=(j.photos||[]).filter(function(p){return p.kind==='before'});
  var after=(j.photos||[]).filter(function(p){return p.kind!=='before'});
  var strip=function(list,label){
   return '<div style="flex:1;min-width:0"><div style="font-size:10.5px;color:var(--faint);margin-bottom:5px">'+
    label+' ('+list.length+')</div>'+
    (list.length?'<div style="display:flex;gap:5px;flex-wrap:wrap">'+
      list.slice(0,6).map(function(p){return photos[p.id]?
        '<img src="'+photos[p.id]+'" style="width:78px;height:78px;object-fit:cover;border-radius:6px;border:1px solid var(--line2)">'
        :'<div style="width:78px;height:78px;border-radius:6px;border:1px dashed var(--line2)"></div>'}).join('')+'</div>'
     :'<div style="font-size:11.5px;color:var(--faint)">'+u('cm_none')+'</div>')+'</div>';
  };
  body='<div style="display:flex;gap:12px">'+strip(before,u('cm_before'))+strip(after,u('cm_after'))+'</div>'+
   '<p style="font-size:11px;color:var(--faint);margin:11px 0 0">'+u('cm_note')+'</p>';
  foot='<button class="btn" onclick="closeModal()">'+u('b_close')+'</button>'}
 else if(open.type==='asset'){
  head=u('as_add');
  body='<div class="two"><div class="field"><label for="as-prop">'+u('f_property')+'</label>'+
   '<select id="as-prop">'+db.props.map(function(p){return '<option'+(open.prop===p.name?' selected':'')+'>'+esc(p.name)+'</option>'}).join('')+'</select></div>'+
   '<div class="field"><label for="as-kind">'+u('as_kind')+'</label><select id="as-kind">'+
   ASSET_KINDS.map(function(k){return '<option>'+k+'</option>'}).join('')+'</select></div></div>'+
   '<div class="field"><label for="as-label">'+u('as_where')+'</label><input id="as-label" placeholder="'+u('as_whereex')+'"></div>'+
   '<div class="two"><div class="field"><label for="as-make">'+u('as_make')+'</label><input id="as-make" placeholder="Daikin"></div>'+
   '<div class="field"><label for="as-model">'+u('as_model')+'</label><input id="as-model"></div></div>'+
   '<div class="two"><div class="field"><label for="as-serial">'+u('as_serial')+'</label><input id="as-serial"></div>'+
   '<div class="field"><label for="as-installed">'+u('as_installed')+'</label><input id="as-installed" type="date"></div></div>'+
   '<div class="two"><div class="field"><label for="as-every">'+u('as_serviceevery')+'</label>'+
   '<select id="as-every"><option value="3">3</option><option value="6" selected>6</option><option value="12">12</option></select></div>'+
   '<div class="field"><label for="as-last">'+u('as_last')+'</label><input id="as-last" type="date"></div></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('as_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveAsset()">'+u('b_add')+'</button>'}
 else if(open.type==='amc'){
  head=u('am_add');
  body='<div class="field"><label for="am-cust">'+u('h_customer')+'</label><select id="am-cust">'+
   customers().map(function(c){return '<option>'+esc(c.name)+'</option>'}).join('')+'</select></div>'+
   '<div class="two"><div class="field"><label for="am-from">'+u('am_from')+'</label><input id="am-from" type="date" value="'+todayStr()+'"></div>'+
   '<div class="field"><label for="am-to">'+u('am_to')+'</label><input id="am-to" type="date" value="'+addMonths(todayStr(),12)+'"></div></div>'+
   '<div class="two"><div class="field"><label for="am-visits">'+u('am_visits')+'</label><input id="am-visits" type="number" value="4"></div>'+
   '<div class="field"><label for="am-value">'+u('am_value')+'</label><input id="am-value" type="number"></div></div>'+
   '<div class="field"><label for="am-trade">'+u('am_trade')+'</label><select id="am-trade">'+
   '<option value="any">'+u('am_anytrade')+'</option>'+
   Object.keys(TRADES).map(function(k){return '<option value="'+k+'">'+TRADES[k].name+'</option>'}).join('')+
   '</select></div>'+
   '<div class="field"><label for="am-covers">'+u('am_covers')+'</label><input id="am-covers" placeholder="'+u('am_coversex')+'"></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('am_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveAmc()">'+u('b_add')+'</button>'}
 else if(open.type==='inspect'){
  var j=job(insp.job),cl=checklistFor(j),sc=inspScore(insp.marks,cl.length);
  head=u('ins_walk')+' — '+esc(j.prop);
  body='<div class="kv"><span>'+u('h_cleaner')+'</span><span>'+esc(j.cleaner?cleaner(j.cleaner).name:'—')+'</span></div>'+
   '<div class="kv"><span>'+u('ins_claimed')+'</span><span>'+j.checked.length+' / '+cl.length+'</span></div>'+
   (sc.judged?'<div class="kv"><span>'+u('ins_score')+'</span><span class="mono" style="color:'+
     (sc.score>=90?'var(--done)':sc.score>=70?'var(--late)':'var(--stop)')+'">'+sc.score+'%'+
     (sc.left?' · '+sc.left+' '+u('ins_left'):'')+'</span></div>':'')+
   '<div style="display:flex;gap:6px;margin:11px 0 9px">'+
   '<button class="btn ghost" style="flex:1;font-size:11.5px" onclick="markAllPass()">'+u('ins_allpass')+'</button></div>';
  cl.forEach(function(k){
   var m=insp.marks[k],claimed=j.checked.indexOf(k)>-1;
   body+='<div style="display:flex;gap:7px;align-items:center;padding:7px 0;border-bottom:1px solid var(--line)">'+
    '<div style="flex:1;min-width:0;font-size:12.5px">'+itemLabel(k,j.prop)+
    (claimed?'':'<span class="pill" style="color:var(--late);border-color:#3A3320">'+u('ins_notclaimed')+'</span>')+'</div>'+
    '<button class="btn '+(m==='pass'?'':'ghost')+'" style="padding:5px 11px;font-size:11px'+
    (m==='pass'?';background:var(--done);border-color:var(--done);color:#08210D':'')+'" '+
    'onclick="markItem(\''+k+'\',\'pass\')">&#10003;</button>'+
    '<button class="btn '+(m==='fail'?'red':'ghost')+'" style="padding:5px 11px;font-size:11px" '+
    'onclick="markItem(\''+k+'\',\'fail\')">&#10007;</button></div>';
  });
  body+='<div class="field" style="margin-top:12px"><label for="ins-note">'+u('ins_note')+'</label>'+
   '<textarea id="ins-note" rows="2"></textarea></div>'+
   '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">'+
   insp.photos.map(function(p){return photos[p]?
     '<img src="'+photos[p]+'" style="width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid var(--line2)">':''}).join('')+
   '<label class="btn ghost file-btn">'+ic('cam')+u('ins_photo')+
   '<input type="file" accept="image/*" capture="environment" onchange="inspShoot(event)"></label></div>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="saveInspection()">'+u('ins_save')+'</button>'}
 else if(open.type==='proof'){
  head=u('pf_share');
  body='<pre style="margin:0;white-space:pre-wrap;font-family:inherit;font-size:12px;color:var(--muted);line-height:1.6">'+esc(open.txt)+'</pre>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_close')+'</button>'+
   (navigator.share?'<button class="btn ghost" onclick="navigator.share({title:db.company,text:open.txt}).catch(function(){})">'+u('pf_other')+'</button>':'')+
   (open.email?'<a class="btn ghost" href="'+esc(mailto(open.email,db.company+' — '+u('pf_share'),open.txt))+'">'+u('gp_email')+'</a>':'')+
   (open.phone?'<a class="wa" href="'+wa(open.phone,open.txt)+'" target="_blank" rel="noopener">'+ic('wa')+'WhatsApp</a>':'')}
 else if(open.type==='pdata'){
  var pr=personRefs(open.kind,open.id);
  head=u('pd_title')+' — '+esc((pr.person&&pr.person.name)||open.id);
  var cnt=function(a){return (a||[]).length};
  body='<p style="font-size:12px;color:var(--muted);margin:0 0 10px">'+u('pd_intro')+'</p>'+
   '<div class="kv"><span>'+u('nav_jobs')+'</span><span>'+cnt(pr.jobs)+'</span></div>'+
   '<div class="kv"><span>'+u('nav_chat')+'</span><span>'+cnt(pr.messages)+'</span></div>'+
   (open.kind==='cleaner'?'<div class="kv"><span>'+u('sh_title')+'</span><span>'+cnt(pr.shifts)+'</span></div>'+
     '<div class="kv"><span>'+u('dc_title')+'</span><span>'+cnt(pr.documents)+'</span></div>'
    :'<div class="kv"><span>'+u('nav_invoices')+'</span><span>'+cnt(pr.invoices)+'</span></div>'+
     '<div class="kv"><span>'+u('nav_props')+'</span><span>'+cnt(pr.properties)+'</span></div>')+
   '<p style="font-size:11px;color:var(--faint);margin:12px 0 0">'+u(open.kind==='cleaner'?'pd_keepstaff':'pd_keepcust')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_close')+'</button>'+
   '<button class="btn ghost" onclick="exportPerson(\''+open.kind+'\',\''+jarg(open.id)+'\')">'+u('pd_export')+'</button>'+
   '<button class="btn red" onclick="closeModal();erasePerson(\''+open.kind+'\',\''+jarg(open.id)+'\')">'+u('pd_erase')+'</button>'}
 else if(open.type==='bug'){
  head=u('bg_title');
  body='<p style="font-size:12px;color:var(--muted);margin:0 0 10px">'+u('bg_help')+'</p>'+
   '<div class="field"><label for="bg-what">'+u('bg_what')+'</label><textarea id="bg-what" rows="4"></textarea></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('bg_ctx')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="sendBug()">'+u('bg_send')+'</button>'}
 else if(open.type==='cancel'){
  var j=job(open.job),pol=cancelPolicy(j),fee=Math.round(j.price*pol.pct/100);
  head=u('cx_title')+' · '+esc(j.prop);
  body='<div class="kv"><span>'+u('f_time')+'</span><span>'+j.time+'</span></div>'+
   '<div class="kv"><span>'+u('h_price')+'</span><span class="mono">'+aed(j.price)+'</span></div>'+
   (j.finished?'<div class="kv"><span>'+u('pf_lab')+'</span><span class="mono" style="color:var(--faint)">'+aed(labourCost(j))+'</span></div>'+
    '<div class="kv"><span>'+u('pf_sup')+'</span><span class="mono" style="color:var(--faint)">'+aed(jobSupplyCost(j))+'</span></div>'+
    '<div class="kv"><span>'+u('pf_profit')+'</span><span class="mono" style="color:'+(jobProfit(j)<0?'var(--red)':'var(--teal)')+'">'+aed(jobProfit(j))+'</span></div>':'')+
   '<div class="kv"><span>'+u('cx_policy')+'</span><span>'+pol.label+'</span></div>'+
   '<div class="kv"><span>'+u('cx_fee')+'</span><span class="mono" style="color:'+(fee?'var(--red)':'var(--teal)')+'">'+
   (fee?aed(fee)+' ('+pol.pct+'%)':u('cx_nofee'))+'</span></div>'+
   '<div class="field" style="margin-top:12px"><label for="cx-why">'+u('cx_why')+'</label><textarea id="cx-why"></textarea></div>'+
   '<p style="font-size:11px;color:var(--faint);margin:0">'+u('cx_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn red" onclick="doCancel()">'+u('cx_confirm')+'</button>'}
 else if(open.type==='refund'){
  var v=null;db.invoices.forEach(function(x){if(x.id===open.inv)v=x});
  head=u('rf_title')+' · '+open.inv;
  body='<div class="kv"><span>'+u('h_total')+'</span><span class="mono">'+aed(invTotal(v))+'</span></div>'+
   '<div class="kv"><span>'+u('d_paid')+'</span><span class="mono">'+aed(invPaid(v))+'</span></div>'+
   '<div class="kv"><span>'+u('rf_credited')+'</span><span class="mono">'+aed(invCredits(v))+'</span></div>'+
   '<div class="kv"><span>'+u('d_balance')+'</span><span class="mono">'+aed(invDue(v))+'</span></div>'+
   '<div class="field" style="margin-top:12px"><label for="rf-amt">'+u('rf_amount')+'</label>'+
   '<input id="rf-amt" type="number" value="'+Math.max(0,Math.round(invDue(v)))+'"></div>'+
   '<div class="field"><label for="rf-why">'+u('rf_why')+'</label><textarea id="rf-why"></textarea></div>'+
   ((v.credits||[]).length?'<div style="font-size:11px;color:var(--faint)">'+
     v.credits.map(function(c){return c.ref+' · '+aed(c.amt)+' · '+esc(c.reason)}).join('<br>')+'</div>':'')+
   '<p style="font-size:11px;color:var(--faint);margin:7px 0 0">'+u('rf_note')+'</p>';
  foot='<button class="btn ghost" onclick="closeModal()">'+u('b_cancel')+'</button>'+
   '<button class="btn" onclick="doRefund()">'+u('rf_issue')+'</button>'}
 else if(open.type==='csv'){head=u('m_export');body='<p style="font-size:12px;color:var(--muted);margin:0 0 9px">'+u('n_copysheet')+'</p><pre class="csv">'+esc(open.csv)+'</pre>';
  foot='<button class="btn" onclick="closeModal()">'+u('b_done')+'</button>'}
 else if(open.type==='report'){head=u('m_report');
  body='<p style="font-size:12px;color:var(--muted);margin:0 0 9px">Pop-ups are blocked. Copy this into a file and open it, or allow pop-ups and try again.</p>'+
  '<pre class="csv">'+esc(reportHtml(job(open.job)).replace(/data:image[^"]+/g,'[photo]'))+'</pre>';
  foot='<button class="btn" onclick="closeModal()">'+u('b_done')+'</button>'}
 else{var j=job(open.job);if(!j){open=null;return}
  var c=cleaner(j.cleaner),ps=jobPhotos(j),cl=checklistFor(j),pr=property(j.prop),g=guaranteeLeft(j);
  head=j.id+' · '+esc(j.prop);
  body='<div class="kv"><span>'+u('t_tier')+'</span><span>'+TIERS[j.tier||'standard'].name+'</span></div>'+
  '<div class="kv"><span>'+u('h_cleaner')+'</span><span>'+esc(c.name)+'</span></div>'+
  '<div class="kv"><span>'+u('d_scheduled')+'</span><span>'+j.time+'</span></div>'+
  (j.onWay?'<div class="kv"><span>'+u('d_onway')+'</span><span class="mono">'+hhmm(j.onWay)+'</span></div>':'')+
  '<div class="kv"><span>'+u('k_arrived')+'</span><span class="mono">'+hhmm(j.started)+'</span></div>'+
  (j.geo?'<div class="kv"><span>'+u('d_location')+'</span><span>'+u('d_away')+' '+j.geo.dist+'m</span></div>':'')+
  '<div class="kv"><span>'+u('k_finished')+'</span><span class="mono">'+hhmm(j.finished)+'</span></div>'+
  '<div class="kv"><span>'+u('k_onsite')+'</span><span class="mono">'+dur(j.started,j.finished)+'</span></div>'+
  '<div class="kv"><span>'+u('h_price')+'</span><span class="mono">'+aed(j.price)+'</span></div>'+
  (j.signed?'<div class="kv"><span>'+u('d_signedoff')+'</span><span>'+j.rating+'★</span></div>':'')+
  (g?'<div class="kv"><span>'+u('d_guarantee')+'</span><span>'+g+'h '+u('d_remaining')+'</span></div>':'')+
  (pr?'<div class="kv"><span>'+u('m_access')+'</span><span>'+esc(pr.key)+'</span></div>':'')+
  '<div style="font-size:11px;color:var(--faint);margin:12px 0 5px">'+u('k_checklist')+' '+j.checked.length+'/'+cl.length+'</div>';
  cl.forEach(function(k){var on=j.checked.indexOf(k)>-1;
   body+='<div class="check'+(on?' on':'')+'" style="cursor:default;padding:5px 0"><div class="box">✓</div>'+
   '<div class="lbl">'+T.en[k]+'</div>'+(EXTRA_KEYS.indexOf(k)>-1?'<span class="extra">PREMIUM</span>':'')+'</div>'});
  body+='<div style="font-size:11px;color:var(--faint);margin:12px 0 5px">'+u('d_photos')+'</div><div class="photos">';
  ps.forEach(function(x){body+='<div class="ph">'+(x.src?'<img src="'+x.src+'" alt="">':'')+'<em>'+x.kind+' '+hhmm(x.at)+'</em></div>'});
  if(!ps.length)body+='<span style="font-size:12px;color:var(--faint)">'+u('d_none')+'</span>';
  body+='</div>';
  var iss=db.issues.filter(function(x){return x.job===j.id});
  if(iss.length){body+='<div style="font-size:11px;color:var(--red);margin:12px 0 5px">'+u('d_problems')+'</div>';
   iss.forEach(function(x){body+='<div class="kv"><span>'+esc(T.en[x.type])+'</span><span>'+esc(x.note)+'</span></div>'})}
  var rep='Cleaning report — '+j.prop+' ('+j.time+'). '+(j.finished?'Finished '+hhmm(j.finished)+', '+dur(j.started,j.finished)+' on site, ':'')+
   j.checked.length+'/'+cl.length+' items, '+ps.length+' photos.';
  var av=assetsAt(j.prop);
  if(av.length){
   body+='<div style="border-top:1px solid var(--line);margin-top:11px;padding-top:11px">'+
    '<div style="font-size:10.5px;color:var(--muted);margin-bottom:7px">'+u('as_onthisjob')+'</div>'+
    '<div style="display:flex;gap:5px;flex-wrap:wrap">'+
    av.map(function(a){var on=(j.assets||[]).indexOf(a.id)>-1;
     return '<button class="btn '+(on?'':'ghost')+'" style="font-size:11px" onclick="toggleJobAsset('+j.id+',\''+a.id+'\')">'+
      esc(a.label)+'</button>'}).join('')+'</div></div>';
  }
  var ins=inspectionFor(j.id);
  if(ins){
   body+='<div class="kv"><span>'+u('ins_result')+'</span><span class="mono" style="color:'+
    (ins.score>=90?'var(--done)':ins.score>=70?'var(--late)':'var(--stop)')+'">'+ins.score+'% · '+
    ins.pass+' '+u('ins_passed')+(ins.fail?' · '+ins.fail+' '+u('ins_failedshort'):'')+'</span></div>';
  }
  body+=etaBar(j);
  var pa=photoAreas(j),areaLine=Object.keys(pa).map(function(k){return T.en[k]+' '+pa[k]}).join(' · ');
  if(areaLine)body+='<p style="font-size:11px;color:var(--faint);margin:6px 0 0">'+esc(areaLine)+'</p>';
  if(j.rework)body+='<div class="kv"><span>'+u('q_rework')+'</span><span>'+u('q_of')+' '+j.rework+'</span></div>';
  if(j.cancel)body+='<div class="kv"><span>'+u('cx_title')+'</span><span>'+esc(j.cancel.reason||'—')+
   ' · '+(j.cancel.fee?aed(j.cancel.fee):u('cx_nofee'))+'</span></div>';
  if(j.disputed){
   body+='<div style="border:1px solid #3E2226;border-radius:7px;padding:10px;margin-top:11px">'+
   '<div style="font-size:11px;color:var(--red);margin-bottom:5px">'+u('q_disputed')+' · '+j.disputed.state+'</div>'+
   '<div style="font-size:12.5px">'+esc(j.disputed.reason||'—')+'</div>'+
   (j.disputed.state==='open'?
     '<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">'+
     '<button class="btn" onclick="bookRework('+j.id+')">'+u('q_bookrework')+'</button>'+
     '<button class="btn ghost" onclick="closeDispute('+j.id+',\'refunded\')">'+u('q_refunded')+'</button>'+
     '<button class="btn ghost" onclick="closeDispute('+j.id+',\'rejected\')">'+u('q_rejected')+'</button></div>':'')+
   '</div>';
  }
  foot=(supervisorOnly()&&j.status!=='done'&&j.status!=='cancelled'?
   '<button class="btn" onclick="markDoneFor('+j.id+')">'+u('md_markdone')+'</button>':'')+
  (j.finished&&(j.photos||[]).length?'<button class="btn ghost" onclick="comparePhotos('+j.id+')">'+u('cm_btn')+'</button>':'')+
  (j.finished?'<button class="btn" onclick="shareProof('+j.id+')">'+u('pf_share')+'</button>':'')+
  (j.status==='sched'?'<button class="btn ghost" onclick="editJob('+j.id+')">'+u('b_edit')+'</button>':'')+
  (j.status!=='done'&&j.status!=='cancelled'?'<button class="btn ghost" onclick="reassign('+j.id+')">'+u('p_reassign')+'</button>':'')+
  (j.status!=='cancelled'&&j.status!=='done'?'<button class="btn ghost" onclick="cancelJob('+j.id+')">'+u('cx_cancel')+'</button>':'')+
  (j.status==='done'&&!j.disputed?'<button class="btn ghost" onclick="raiseDispute('+j.id+',\'\')">'+u('q_flag')+'</button>':'')+
  '<button class="btn ghost" onclick="duplicateJob('+j.id+')">'+u('j_dup')+'</button>'+
  '<button class="btn ghost" onclick="messageBox('+j.id+')">'+ic('wa')+u('b_message')+'</button>'+
  '<button class="btn ghost" onclick="printReport('+j.id+')">'+ic('down')+u('b_report')+'</button>'+
  '<a class="wa" href="'+wa(S().officePhone,rep)+'" target="_blank" rel="noopener">'+ic('wa')+u('b_send')+'</a>'+
  '<button class="btn ghost" onclick="closeModal()">'+u('b_close')+'</button>'}
 var mask=document.createElement('div');mask.className='mask';
 mask.setAttribute('dir',(open.type==='problem')?d.dir:uiDir());
 mask.innerHTML='<div class="modal"><div class="modal-h">'+head+'<button class="x" onclick="closeModal()">×</button></div>'+
 '<div class="modal-b">'+body+'</div><div class="modal-f">'+foot+'</div></div>';
 mask.addEventListener('click',function(e){if(e.target===mask)closeModal()});
 document.body.appendChild(mask)}
function render(){
 try{document.title=(session&&db&&db.company)?db.company:'Cleaning operations';
  document.documentElement&&(document.documentElement.lang=uiLang||'en')}catch(e){}
 var root=document.getElementById('root');
 if(publicBooking==='done'){root.innerHTML='<div class="login"><div class="lbox"><div class="lhead">'+
  '<h1>'+esc(db.company)+'</h1><p>'+u('pb_thanks')+'</p></div>'+
  '<div class="panel" style="font-size:13px;color:var(--muted)">'+u('pb_thankssub')+'</div></div></div>';return}
 if(publicBooking){root.innerHTML=vPublicBook();return}
 if(legalOpen){root.innerHTML=vLegal();return}
 if(emailMode){root.innerHTML=vEmail();return}
 if(askAccess){root.innerHTML=vAskAccess();return}
 if(codeEntry){root.innerHTML=vCodeEntry();return}
 /* the wizard is reached from the sign-in screen, so it has to be a full
    screen of its own — a modal is never drawn while nobody is signed in */
 if(wiz){
  root.innerHTML='<div class="login"><div class="lbox" style="max-width:460px">'+
   '<div class="lhead"><h1>'+u('wz_title')+'</h1><p>'+u('wz_step')+' '+wiz.step+' / 4</p></div>'+
   '<div class="panel">'+vWizard()+'</div>'+
   '<div class="setup-foot">'+
   (wiz.step>1?'<button class="btn ghost" onclick="wizBack()">'+u('wz_back')+'</button>'
     :'<button class="btn ghost" onclick="wizCancel()">'+u('b_cancel')+'</button>')+
   '<button class="btn wide" onclick="wizNext()">'+
   (wiz.step===4?u('wz_finish'):u('wz_next'))+'</button></div></div></div>';
  return;
 }
 if(otpPhase){root.innerHTML=vOtp();return}
 if(authUser&&!session){root.innerHTML=vAuthPending();return}
 if(pinFor){root.innerHTML=vPin();return}
 if(!session){root.innerHTML=vLogin();return}
 var list=TABS[session.role];if(!list){session=null;root.innerHTML=vLogin();return}
 var ok=false;
 for(var i=0;i<list.length;i++)if(list[i][0]===tab)ok=true;
 if(!ok)tab=list[0][0];
 var nav='',navItems={},navBadge={};
 list.forEach(function(tb){var b='';
  if(tb[0]==='issues'&&openIssues().length)b='<span class="cnt hot">'+openIssues().length+'</span>';
  if(tb[0]==='stock'&&lowStock().length)b='<span class="cnt hot">'+lowStock().length+'</span>';
  if(tb[0]==='rooms'&&roomCounts().dirty)b='<span class="cnt hot">'+roomCounts().dirty+'</span>';
  if(tb[0]==='inspect'&&needsInspection().length)b='<span class="cnt">'+needsInspection().length+'</span>';
  if(tb[0]==='assets'&&assetsDue().length)b='<span class="cnt hot">'+assetsDue().length+'</span>';
  if(tb[0]==='people'&&expiringDocs().length)b='<span class="cnt hot">'+expiringDocs().length+'</span>';
  if(tb[0]==='safety'&&incidents().filter(function(x){return x.status==='open'}).length)
   b='<span class="cnt hot">'+incidents().filter(function(x){return x.status==='open'}).length+'</span>';
  if(tb[0]==='today'&&pending().length)b='<span class="cnt">'+pending().length+'</span>';
  if(tb[0]==='sales'){var n2=leads().filter(function(l){return l.status==='new'}).length+dueReminders().length;
   if(n2)b='<span class="cnt'+(dueReminders().length?' hot':'')+'">'+n2+'</span>'}
  if(tb[0]==='chat'&&unreadTotal())b='<span class="cnt hot">'+unreadTotal()+'</span>';
  if(tb[0]==='pool'&&openJobs().length)b='<span class="cnt">'+openJobs().length+'</span>';
  if((tb[0]==='tasks'||tb[0]==='ctasks')&&openTasks().length)b='<span class="cnt">'+openTasks().length+'</span>';
  navItems[tb[0]]='<button class="nav-btn'+(tb[0]===tab?' on':'')+'" onclick="go(\''+tb[0]+'\')">'+ic(tb[2])+u('nav_'+tb[0])+b+'</button>';
  navBadge[tb[0]]=b});
 /* a manager has too many screens for one flat list. Group them, keep the
    group you are in open, and let the rest fold away. */
 if(session.role==='manager'){
  var shown=groupsShown(),here=groupOf(tab);
  GROUPS.forEach(function(g){
   var ids=g[1].filter(function(id){return navItems[id]});
   if(!ids.length)return;
   var isOpen=(g[0]===here)||shown[g[0]];
   var count=ids.filter(function(id){return navBadge[id]}).length;
   nav+='<button class="nav-group'+(isOpen?' open':'')+'" onclick="toggleGroup(\''+g[0]+'\')">'+
    u(g[0])+(count&&!isOpen?'<span class="cnt hot">'+count+'</span>':'')+
    '<span class="chev">'+(isOpen?'&#9662;':'&#9656;')+'</span></button>';
   if(isOpen)ids.forEach(function(id){nav+=navItems[id]});
  });
 } else list.forEach(function(tb){nav+=navItems[tb[0]]});
 var who=session.role==='cleaner'?cleaner(session.id).name:session.role==='customer'?'Marina Heights Tower':'Layla Mansour';
 var langSel='',selStyle='background:var(--bg);border:1px solid var(--line2);color:var(--muted);font-size:11.5px;padding:5px 7px;border-radius:6px;width:auto';
 if(session.role==='cleaner'){langSel='<select onchange="setLang(this.value)" style="'+selStyle+'">';
  for(var L in T)langSel+='<option value="'+L+'"'+(L===lang?' selected':'')+'>'+T[L].name+'</option>';langSel+='</select>'}
 else{langSel='<select onchange="setUi(this.value)" style="'+selStyle+'">';
  for(var K in U)langSel+='<option value="'+K+'"'+(K===uiLang?' selected':'')+'>'+U[K].name+'</option>';langSel+='</select>'}
 var bell='';
 if(session.role==='manager'){var un=unread();
  bell='<button class="btn ghost" onclick="go(\'feed\')" style="padding:5px 9px">'+ic('bell')+(un?' '+un:'')+'</button>'+
   '<button class="btn ghost" onclick="go(\'find\')" style="padding:5px 9px" title="'+u('fd_title')+'">'+ic('list')+'</button>'+
   '<button class="btn ghost" onclick="go(\'settings\')" style="padding:5px 9px;font-size:11px;'+
   (cloud.on?'color:var(--teal);border-color:#1E4433':'')+'">'+(cloud.on?'&#9679; '+u('cl_live'):u('cl_offline'))+'</button>'}
 var counts='';
 if(session.role==='manager'){var L=live();
  var taskRev=db.tasks.filter(function(x){return x.status!=='open'}).reduce(function(s,x){return s+x.fee},0);
  counts='<div class="counts"><span><b>'+L.length+'</b>'+u('c_jobs')+'</span>'+
  '<span><b>'+L.filter(function(j){return j.status==='done'}).length+'</b>'+u('c_done')+'</span>'+
  '<span><b>'+L.filter(function(j){return j.status==='progress'}).length+'</b>'+u('c_running')+'</span>'+
  '<span><b>'+L.filter(function(j){return j.tier==='premium'}).length+'</b>'+u('c_premium')+'</span>'+
  (lateJobs().length?'<span class="bad"><b>'+lateJobs().length+'</b>'+u('c_late')+'</span>':'')+
  (openIssues().length?'<span class="bad"><b>'+openIssues().length+'</b>'+u('c_problems')+'</span>':'')+
  '<span style="margin-left:auto" class="mono">'+aed(L.reduce(function(s,j){return s+j.price},0)+taskRev)+' '+u('c_booked')+'</span></div>'}
 var body='';
 if(tab==='today')body=vToday();else if(tab==='pool')body=vPool();else if(tab==='find')body=vFind();else if(tab==='sales')body=vSales();else if(tab==='schedule')body=vSchedule();else if(tab==='chat')body=vChat();else if(tab==='map')body=vMap();else if(tab==='tasks')body=vTasks();else if(tab==='jobs')body=bulkBar()+vJobs();
 else if(tab==='routes')body=vRoutePlan()+vRoutes();else if(tab==='contracts')body=vContracts();else if(tab==='rooms')body=vRooms();else if(tab==='props')body=vProps();else if(tab==='keys')body=vKeys();else if(tab==='assets')body=vAssets();else if(tab==='customers')body=(openCu?vCustomer():vCustomers());
 else if(tab==='team')body=vTeam()+vLeaderboard();else if(tab==='avail')body=vAvailability();else if(tab==='people')body=vPeople();else if(tab==='safety')body=vSafety();else if(tab==='inspect')body=vInspect();else if(tab==='issues')body=vIssues();else if(tab==='stock')body=vStock();
 else if(tab==='invoices')body=vInvoices();else if(tab==='money')body=vMoney();else if(tab==='metrics')body=vMetrics();else if(tab==='feed')body=vFeed();else if(tab==='myday')body=vMyDay();
 else if(tab==='supplies')body=vSupplies();else if(tab==='ctasks')body=vCleanerTasks();else if(tab==='mine')body=vMine();else if(tab==='portal')body=vPortal();else if(tab==='settings')body=vSettings();
 var now=new Date(),dow=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()];
 var _sc=document.querySelector('.wrap');var _y=_sc?_sc.scrollTop:0;
 root.innerHTML='<div class="app" dir="'+(session.role==='cleaner'?'ltr':uiDir())+'"><aside class="side"><div class="co"><b>'+esc(db.company)+'</b><span>Dubai</span></div>'+
 '<nav>'+nav+'</nav><div class="side-foot">'+esc(who)+'<br><button onclick="authSignOut()">'+u('b_signout')+'</button>'+
 '<div style="margin-top:6px;color:#3E4650;font-size:10px">build 64 \u00b7 secure</div></div></aside>'+
 '<div class="main"><div class="top"><h2>'+u('title_'+tab)+'</h2><span class="date">'+dow+' · '+hhmm(Date.now())+'</span>'+
 '<div class="tools">'+langSel+bell+'</div></div>'+counts+
 (online?'':'<div class="offline">Offline — '+queued+' change'+(queued===1?'':'s')+' waiting.</div>')+
 '<div class="wrap">'+body+'</div></div></div>';
 var _n=document.querySelector('.wrap');if(_n&&_y)_n.scrollTop=_y;
 drawModal();
 }
