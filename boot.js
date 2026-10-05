/* Starting up: read the saved session, then draw the first screen. */
if(typeof window!=='undefined'&&window.addEventListener){
 window.addEventListener('online',function(){online=true;flushQueue();flush();render()});
 window.addEventListener('offline',function(){online=false;render()});
 if(typeof navigator!=='undefined'&&navigator.onLine===false)online=false}
cloudLoadCfg();
loadToken();
loadJwt();
loadPhotoIndex();
loadAuthUser();
var invited=readInvite();
var viaToken=readMemberLink();
var booking=readBookingLink();
var cameBack=readAuthRedirect();
Promise.resolve(load()).then(function(){migrateBins();if(db&&db.settings&&db.settings.uiLang&&U[db.settings.uiLang])uiLang=db.settings.uiLang;
 if(cloud.on&&cloud.url&&cloud.secret){cloud.status='on';cloudPollAdaptive();cloudFetchPhotos()}
 if(viaToken){signInWithToken();verifyWorkspace()}
 if(authUser&&!cameBack)matchAndEnter();
 if(invited&&pendingRole){
   if(pendingRole==='cleaner'&&pendingId)askPin('cleaner',pendingId);
   else askPin(pendingRole,null);
 }
 render();setInterval(function(){if(!open&&tab!=='map'&&tab!=='settings'&&!(tab==='chat'&&draft))render()},30000)});
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
