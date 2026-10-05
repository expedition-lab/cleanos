/* Constants and the state the app holds while it runs. */
var KEY='cleanos:v4',PKEY='cleanos:v4:photos',MIN=60000,TRN='100472913800003';
var IC={board:'<path d="M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 014-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 01-4 4H3"/>',
users:'<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/>',
alert:'<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
box:'<path d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
receipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
bell:'<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
wa:'<path d="M21 11.5a8.4 8.4 0 01-12.7 7.2L3 20.5l1.8-5.2A8.5 8.5 0 1121 11.5z"/>',
down:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M17 6l3 3"/>',
pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/>',
zap:'<path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.6 1.6 0 008 19.4a1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H2a2 2 0 110-4h.1A1.6 1.6 0 004.6 8a1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V2a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H22a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/>',
card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'};
var TIERS={
 standard:{name:'Standard',mult:1,arrive:'2-hour window',photos:6,guarantee:24,senior:false,
  extras:[],blurb:'The regular clean'},
 premium:{name:'Premium',mult:1.55,arrive:'30-minute window',photos:12,guarantee:72,senior:true,
  extras:['inside_fridge','inside_oven','balcony','skirting'],blurb:'Senior cleaner, deeper list, 24h re-clean guarantee'}
};


/* Every circulating ISO 4217 currency. Intl formats all of them. */
var CURRENCIES=('AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP BYN BZD '+
'CAD CDF CHF CLP CNY COP CRC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD '+
'HKD HNL HRK HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD '+
'MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG '+
'QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLE SOS SRD SSP STN SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS '+
'UAH UGX USD UYU UZS VES VND VUV WST XAF XCD XOF XPF YER ZAR ZMW ZWG').split(' ');
var ZERO_DEC={JPY:1,KRW:1,VND:1,CLP:1,ISK:1,PYG:1,RWF:1,UGX:1,VUV:1,XAF:1,XOF:1,XPF:1,KMF:1,DJF:1,GNF:1,BIF:1};
var THREE_DEC={KWD:1,BHD:1,OMR:1,JOD:1,TND:1,LYD:1,IQD:1};
var COUNTRIES={
 AE:{name:'United Arab Emirates',cur:'AED',loc:'en-AE',tax:0.05,taxLabel:'VAT',idLabel:'TRN',week:0,dial:'971'},
 SA:{name:'Saudi Arabia',cur:'SAR',loc:'en-SA',tax:0.15,taxLabel:'VAT',idLabel:'VAT number',week:0,dial:'966'},
 QA:{name:'Qatar',cur:'QAR',loc:'en-QA',tax:0,taxLabel:'VAT',idLabel:'Tax card',week:0,dial:'974'},
 KW:{name:'Kuwait',cur:'KWD',loc:'en-KW',tax:0,taxLabel:'Tax',idLabel:'Tax number',week:0,dial:'965'},
 BH:{name:'Bahrain',cur:'BHD',loc:'en-BH',tax:0.10,taxLabel:'VAT',idLabel:'VAT number',week:0,dial:'973'},
 OM:{name:'Oman',cur:'OMR',loc:'en-OM',tax:0.05,taxLabel:'VAT',idLabel:'VAT number',week:0,dial:'968'},
 GB:{name:'United Kingdom',cur:'GBP',loc:'en-GB',tax:0.20,taxLabel:'VAT',idLabel:'VAT number',week:1,dial:'44'},
 IE:{name:'Ireland',cur:'EUR',loc:'en-IE',tax:0.23,taxLabel:'VAT',idLabel:'VAT number',week:1,dial:'353'},
 DE:{name:'Germany',cur:'EUR',loc:'de-DE',tax:0.19,taxLabel:'MwSt',idLabel:'USt-IdNr',week:1,dial:'49'},
 FR:{name:'France',cur:'EUR',loc:'fr-FR',tax:0.20,taxLabel:'TVA',idLabel:'No TVA',week:1,dial:'33'},
 ES:{name:'Spain',cur:'EUR',loc:'es-ES',tax:0.21,taxLabel:'IVA',idLabel:'NIF',week:1,dial:'34'},
 US:{name:'United States',cur:'USD',loc:'en-US',tax:0,taxLabel:'Sales tax',idLabel:'EIN',week:0,dial:'1'},
 CA:{name:'Canada',cur:'CAD',loc:'en-CA',tax:0.05,taxLabel:'GST',idLabel:'GST number',week:0,dial:'1'},
 AU:{name:'Australia',cur:'AUD',loc:'en-AU',tax:0.10,taxLabel:'GST',idLabel:'ABN',week:1,dial:'61'},
 SG:{name:'Singapore',cur:'SGD',loc:'en-SG',tax:0.09,taxLabel:'GST',idLabel:'GST reg no',week:1,dial:'65'},
 IN:{name:'India',cur:'INR',loc:'en-IN',tax:0.18,taxLabel:'GST',idLabel:'GSTIN',week:1,dial:'91'},
 PH:{name:'Philippines',cur:'PHP',loc:'en-PH',tax:0.12,taxLabel:'VAT',idLabel:'TIN',week:0,dial:'63'},
 ZA:{name:'South Africa',cur:'ZAR',loc:'en-ZA',tax:0.15,taxLabel:'VAT',idLabel:'VAT number',week:1,dial:'27'},
 NG:{name:'Nigeria',cur:'NGN',loc:'en-NG',tax:0.075,taxLabel:'VAT',idLabel:'TIN',week:1,dial:'234'},
 KE:{name:'Kenya',cur:'KES',loc:'en-KE',tax:0.16,taxLabel:'VAT',idLabel:'PIN',week:1,dial:'254'},
 EG:{name:'Egypt',cur:'EGP',loc:'en-EG',tax:0.14,taxLabel:'VAT',idLabel:'Tax number',week:0,dial:'20'},
 JO:{name:'Jordan',cur:'JOD',loc:'en-JO',tax:0.16,taxLabel:'GST',idLabel:'Tax number',week:0,dial:'962'},
 LB:{name:'Lebanon',cur:'LBP',loc:'en-LB',tax:0.11,taxLabel:'VAT',idLabel:'VAT number',week:1,dial:'961'},
 TR:{name:'Türkiye',cur:'TRY',loc:'tr-TR',tax:0.20,taxLabel:'KDV',idLabel:'Vergi No',week:1,dial:'90'},
 PK:{name:'Pakistan',cur:'PKR',loc:'en-PK',tax:0.16,taxLabel:'Sales tax',idLabel:'NTN',week:1,dial:'92'},
 BD:{name:'Bangladesh',cur:'BDT',loc:'en-BD',tax:0.15,taxLabel:'VAT',idLabel:'BIN',week:0,dial:'880'},
 LK:{name:'Sri Lanka',cur:'LKR',loc:'en-LK',tax:0.18,taxLabel:'VAT',idLabel:'VAT number',week:1,dial:'94'},
 NP:{name:'Nepal',cur:'NPR',loc:'en-NP',tax:0.13,taxLabel:'VAT',idLabel:'PAN',week:0,dial:'977'},
 ID:{name:'Indonesia',cur:'IDR',loc:'id-ID',tax:0.11,taxLabel:'PPN',idLabel:'NPWP',week:1,dial:'62'},
 MY:{name:'Malaysia',cur:'MYR',loc:'ms-MY',tax:0.08,taxLabel:'SST',idLabel:'SST number',week:1,dial:'60'},
 TH:{name:'Thailand',cur:'THB',loc:'th-TH',tax:0.07,taxLabel:'VAT',idLabel:'Tax ID',week:1,dial:'66'},
 VN:{name:'Vietnam',cur:'VND',loc:'vi-VN',tax:0.08,taxLabel:'VAT',idLabel:'Tax code',week:1,dial:'84'},
 HK:{name:'Hong Kong',cur:'HKD',loc:'en-HK',tax:0,taxLabel:'Tax',idLabel:'BR number',week:1,dial:'852'},
 JP:{name:'Japan',cur:'JPY',loc:'ja-JP',tax:0.10,taxLabel:'Consumption tax',idLabel:'Tax number',week:0,dial:'81'},
 NZ:{name:'New Zealand',cur:'NZD',loc:'en-NZ',tax:0.15,taxLabel:'GST',idLabel:'GST number',week:1,dial:'64'},
 NL:{name:'Netherlands',cur:'EUR',loc:'nl-NL',tax:0.21,taxLabel:'BTW',idLabel:'BTW-nummer',week:1,dial:'31'},
 IT:{name:'Italy',cur:'EUR',loc:'it-IT',tax:0.22,taxLabel:'IVA',idLabel:'P.IVA',week:1,dial:'39'},
 PT:{name:'Portugal',cur:'EUR',loc:'pt-PT',tax:0.23,taxLabel:'IVA',idLabel:'NIF',week:1,dial:'351'},
 PL:{name:'Poland',cur:'PLN',loc:'pl-PL',tax:0.23,taxLabel:'VAT',idLabel:'NIP',week:1,dial:'48'},
 SE:{name:'Sweden',cur:'SEK',loc:'sv-SE',tax:0.25,taxLabel:'Moms',idLabel:'Momsnr',week:1,dial:'46'},
 CH:{name:'Switzerland',cur:'CHF',loc:'de-CH',tax:0.081,taxLabel:'MWST',idLabel:'UID',week:1,dial:'41'},
 BR:{name:'Brazil',cur:'BRL',loc:'pt-BR',tax:0.17,taxLabel:'ICMS',idLabel:'CNPJ',week:0,dial:'55'},
 MX:{name:'Mexico',cur:'MXN',loc:'es-MX',tax:0.16,taxLabel:'IVA',idLabel:'RFC',week:0,dial:'52'},
 RE:{name:'La Réunion',cur:'EUR',loc:'fr-RE',tax:0.085,taxLabel:'TVA',idLabel:'No TVA',week:1,dial:'262'}, MG:{name:'Madagascar',cur:'MGA',loc:'fr-MG',tax:0.20,taxLabel:'TVA',idLabel:'NIF',week:1,dial:'261'}, MA:{name:'Maroc',cur:'MAD',loc:'fr-MA',tax:0.20,taxLabel:'TVA',idLabel:'ICE',week:1,dial:'212'}, BE:{name:'Belgique',cur:'EUR',loc:'fr-BE',tax:0.21,taxLabel:'TVA',idLabel:'No TVA',week:1,dial:'32'}, TN:{name:'Tunisie',cur:'TND',loc:'fr-TN',tax:0.19,taxLabel:'TVA',idLabel:'Matricule fiscal',week:1,dial:'216'}, SN:{name:'Sénégal',cur:'XOF',loc:'fr-SN',tax:0.18,taxLabel:'TVA',idLabel:'NINEA',week:1,dial:'221'}, CI:{name:"Côte d'Ivoire",cur:'XOF',loc:'fr-CI',tax:0.18,taxLabel:'TVA',idLabel:'NCC',week:1,dial:'225'}, SC:{name:'Seychelles',cur:'SCR',loc:'en-SC',tax:0.15,taxLabel:'VAT',idLabel:'TIN',week:1,dial:'248'},
 MV:{name:'Maldives',cur:'MVR',loc:'en-MV',tax:0.16,taxLabel:'GST',idLabel:'TIN',week:0,dial:'960'},
 OT:{name:'Other — set manually',cur:'USD',loc:'en',tax:0,taxLabel:'Tax',idLabel:'Tax number',week:1,dial:''},
 MU:{name:'Mauritius',cur:'MUR',loc:'en-MU',tax:0.15,taxLabel:'VAT',idLabel:'VAT number',week:1,dial:'230'}
};
var CLEANERS_DEFAULT=[
 {id:'c1',name:'Ahmed Hassan',initials:'AH',phone:'971502248871',done:1247,rating:4.72,onTime:94,lang:'ur',rate:23,senior:true},
 {id:'c2',name:'Fatima Ali',initials:'FA',phone:'971559034417',done:863,rating:4.81,onTime:91,lang:'ar',rate:25,senior:true},
 {id:'c3',name:'Rajesh Kumar',initials:'RK',phone:'971521186620',done:412,rating:4.38,onTime:82,lang:'hi',rate:21,senior:false},
 {id:'c4',name:'Olga Sokolova',initials:'OS',phone:'971562209033',done:1908,rating:4.91,onTime:97,lang:'en',rate:27,senior:true},
 {id:'c5',name:'Marco Silva',initials:'MS',phone:'971587714409',done:229,rating:4.44,onTime:88,lang:'tl',rate:21,senior:false}];
var CHECK_KEYS=['living','bedrooms','bathrooms','kitchen','floors','windows','dusting','rubbish','linen','supplies'];
var EXTRA_KEYS=['inside_fridge','inside_oven','balcony','skirting'];
var PROB_KEYS=['damage','missing','broken','heavydirt','noaccess','customer','nosupplies','other'];
var TASK_TYPES=[
 {id:'bins',name:'Bin run',fee:25,mins:10},
 {id:'parcel',name:'Collect a parcel',fee:30,mins:15},
 {id:'heavy',name:'Carry something heavy',fee:60,mins:25},
 {id:'car',name:'Bring the car round',fee:35,mins:15},
 {id:'grocery',name:'Grocery drop-off',fee:45,mins:30},
 {id:'laundry',name:'Laundry to the shop',fee:35,mins:20},
 {id:'water',name:'Change the water bottle',fee:20,mins:10},
 {id:'wait',name:'Wait for a delivery',fee:55,mins:45},
 {id:'keys',name:'Drop off or collect keys',fee:30,mins:20},
 {id:'plants',name:'Water the plants',fee:20,mins:10},
 {id:'balcony',name:'Sweep the balcony or terrace',fee:35,mins:20},
 {id:'windows',name:'Wash the windows',fee:70,mins:45},
 {id:'fridge',name:'Clean inside the fridge',fee:50,mins:30},
 {id:'oven',name:'Clean the oven',fee:65,mins:40},
 {id:'beds',name:'Change the beds',fee:40,mins:25},
 {id:'ironing',name:'Ironing',fee:45,mins:40},
 {id:'dishes',name:'Wash up after guests',fee:30,mins:20},
 {id:'restock',name:'Restock supplies at the property',fee:35,mins:25},
 {id:'petrol',name:'Fuel or car wash',fee:40,mins:30},
 {id:'pool',name:'Skim the pool',fee:45,mins:25},
 {id:'garden',name:'Tidy the garden',fee:80,mins:60},
 {id:'furniture',name:'Move furniture around',fee:70,mins:40},
 {id:'dump',name:'Take things to the tip',fee:90,mins:60},
 {id:'checkin',name:'Meet a guest at check-in',fee:60,mins:30},
 {id:'inspect',name:'Check the property over',fee:45,mins:25},
 {id:'pharmacy',name:'Pharmacy or shop run',fee:35,mins:25}];
var db=seed(),photos={},session=null,tab='today',lang='en',open=null,probPick=null,dayPick=[],online=true,queued=0,starPick=0,tierPick='standard',geoAsk=false;


/* ============================================================
   Sign-in and invites.
   A person opens an invite link, the app configures itself,
   they pick their name and enter their PIN. Nothing to set up.
   ============================================================ */
var pinFor=null, pinBuf='';
var pendingRole=null,pendingId=null;


/* ============================================================
   Real accounts: Google sign-in and phone verification.
   Supabase Auth issues the identity; the app matches that
   identity to a person in this workspace and gives them
   their role. PIN sign-in stays for staff without accounts.
   ============================================================ */
var authUser=null, otpPhase=null, otpPhone='', otpCode='';


/* ============================================================
   One company must never see another.
   Three separate problems, fixed together:
     a. storage was shared, so two companies on one browser mixed
     b. the sign-in screen listed the whole team before anyone
        had identified themselves
     c. nothing checked that a token belonged to this company
   ============================================================ */
var WS_KEY='cleanos:ws';
var codeEntry=false, codeWs='';


/* ============================================================
   Signing in with Google from a device that knows nothing yet.
   The database answers "who is this, and which company are they
   in" — using the address inside their own verified token, so
   nobody can ask about anyone else.
   ============================================================ */
var authJwt='';


/* ============================================================
   Signing in with an email address.
   Google needs a Google account and Apple needs a paid developer
   account. An email address and a password need neither, which
   matters for a cleaning company owner in Mahebourg.
   ============================================================ */
var emailMode=null, emailErr='';

/* ---------------- login ---------------- */
var moreWays=false;
var calDay=null;

/* what a job of each type typically uses */
var USAGE={
 'Standard':[['Floor cleaner',0.2],['Toilet cleaner',0.15],['Microfibre cloth',2],['Bin bags',2],['Gloves',1]],
 'Deep clean':[['Floor cleaner',0.5],['Toilet cleaner',0.4],['Microfibre cloth',5],['Bin bags',3],['Gloves',2],['Glass cleaner',0.3]],
 'Move-out':[['Floor cleaner',0.7],['Toilet cleaner',0.5],['Microfibre cloth',6],['Bin bags',5],['Gloves',2],['Glass cleaner',0.4]],
 'Turnover':[['Floor cleaner',0.3],['Toilet cleaner',0.2],['Microfibre cloth',3],['Bin bags',2],['Gloves',1],['Laundry detergent',0.3]]
};

/* expenses */
var EXP_KINDS=['Fuel','Parking','Tolls','Vehicle','Supplies','Phone','Other'];

/* --- quotes: price it, send it, turn it into work --- */
var quoteRooms={beds:2,baths:1,size:'',service:'Standard',tier:'standard',freq:'one'};
var publicBooking=false;

/* --- documents that expire --- */
var DOC_KINDS=['Passport','Visa / residence','Emirates ID','Labour card','Certificate','Driving licence','Insurance','Trade licence','Other'];
var payFrom=null,payTo=null;

/* --- incidents --- */
var INC_KINDS=['Injury','Near miss','Property damage','Vehicle','Chemical spill','Theft','Complaint','Other'];

/* --- period statements --- */
var stFrom=null,stTo=null,stWho=null;

/* ---- 3. search across everything ---- */
var findQ='';

/* ---- 3. a company can set itself up without me in the room ---- */
var wiz=null;


/* ---- 4. undo, because deleting the wrong thing happens ---- */
var undoStack=[];

/* ---- 8. doing the same thing to several jobs at once ---- */
var picked={};

/* ---- 10. everything about one customer in one place ---- */
var openCu=null;


/* ============================================================
   6 & 7. Per-person tokens, and photographs that live in the
   database rather than on the phone.
   ============================================================ */
var memberToken='';
var memberList=[];
var photoIndex={};


/* how often to look for changes: fast while work is happening, slow when
   the app is sitting in a back tab. Polling every 8 seconds all day is
   both too slow to feel live and too heavy on a cleaner's data. */
var lastTouch=Date.now();


/* ============================================================
   More than one trade.
   The same operation — dispatch, proof, invoicing — works for
   air conditioning as well as cleaning. What changes is the
   service list, the checklist, and the readings taken on site.
   ============================================================ */
var TRADES={
 cleaning:{name:'Cleaning',icon:'zap',
  services:['Standard','Deep clean','Move-out','Turnover','Checkout clean','Stayover'],
  check:['kitchen','bathrooms','bedrooms','living','floors','windows','dusting','rubbish','linen','supplies'],
  mins:{'Standard':120,'Deep clean':210,'Move-out':270,'Turnover':150,'Checkout clean':45,'Stayover':25}}
};
/* readings an engineer takes on an air conditioning job */
var READINGS=[['tempin','°C'],['tempout','°C'],['gas','psi'],['amps','A']];
var ASSET_KINDS=['Split unit','Window unit','Ducted','Cassette','Chiller','FAHU','Water heater','Other'];
var askAccess=false;

/* ---- the sidebar, grouped instead of a wall of twenty-two ---- */
var GROUPS=[
 ['g_work',   ['today','sales','schedule','chat','map','jobs','routes','tasks']],
 ['g_places', ['rooms','props','keys','assets','customers','contracts']],
 ['g_people', ['team','avail','people','inspect','safety','issues']],
 ['g_money',  ['stock','invoices','money','metrics']],
 ['g_admin',  ['feed','settings']]
];
var openGroups=null;
var insp=null;


/* ============================================================
   How the company works on the ground.
   A villa cleaner carries their own phone. Hotel housekeeping
   usually cannot: policies put personal phones in a locker,
   bar their use in sight of guests, and often forbid taking
   photographs with them. So the supervisor carries one device
   and records the floor.
   ============================================================ */
var MODES={
 field:{name:'Cleaners use their own phones'},
 supervisor:{name:'One supervisor device'}
};

/* the board an owner or supervisor actually looks at */
var ROOM_STATES=[['dirty','ro_dirty'],['doing','ro_doing'],['clean','ro_clean'],
                 ['checked','ro_checked'],['ooo','ro_ooo']];
var STATE_COLOUR={dirty:'var(--stop)',doing:'var(--run)',clean:'var(--done)',
                  checked:'var(--money)',ooo:'var(--faint)'};


/* ============================================================
   Privacy, terms, and each person's right to their own data.
   The company using the app is the one collecting the data, so
   the notice is written in its name, with its contact details.
   It is a starting point the company should review, not advice.
   ============================================================ */
var legalOpen=false;


/* ---- notifications that reach a phone when the app is closed ---- */
var PUSH_TO_OFFICE=['problem','dispute','cancelreq','booking','offer','supplyreq','inspectfail'];


/* ---------------- map, live position, messaging ---------------- */
/* ------------------------------------------------------------
   Real map: Leaflet + OpenStreetMap tiles.
   Loaded on demand. If it cannot load (no signal, blocked CDN)
   the schematic SVG below is drawn instead so the tab never
   breaks in front of a customer.
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Slippy map built from raw OpenStreetMap tiles.
   No external library, no CDN script — just <img> tiles, so it
   works anywhere the images can be fetched.
   ------------------------------------------------------------ */
var mapZoom=null,mapCentre=null,TS=256;
var W_MAP=1200,H_MAP=440;

/* ---- Google Maps: keyless embed + real multi-stop routes ---- */
var mapMode='google', gPick=null;

/* address -> coordinates, so real properties land on the real map */
var geoQueue=[],geoBusy=false;

/* live position, consent based, only while a job is running */
var watchId=null;


/* ============================================================
   In-app messages. Threads live in the shared workspace, so
   they arrive on the other device with the normal sync.
   ============================================================ */
var draft='', thread=null;



/* ============================================================
   Live sync. The workspace is one JSON row in Supabase, photos
   are rows of their own. Every device with the same workspace
   and secret sees the same data.
   ============================================================ */
var cloud={url:'',key:'',ws:'',secret:'',on:false,rev:0,status:'off',busy:false,pending:false,timer:null};
/* ============================================================
   YOUR DATABASE — fill these two in once.
   Supabase → Project Settings → API: the Project URL and the
   anon public key. The anon key is meant to be public; what
   protects the data is the row security in the SQL.
   Once set, every device offers "Continue with Google" on its
   very first visit, with nothing to configure.
   ============================================================ */
var APP_CLOUD={url:'',key:''};
/* ============================================================
   PHONE NOTIFICATIONS — paste the PUBLIC key made by
     npx web-push generate-vapid-keys
   The private key goes into Supabase as a secret, never here.
   ============================================================ */
var APP_PUSH_KEY='';

/* ---- writing ---- */
var pushTimer=null;


/* ============================================================
   Quality, cancellation and money back.
   Three things every cleaning company argues about.
   ============================================================ */
var PHOTO_AREAS=['kitchen','bathrooms','bedrooms','living','floors','other'];
var shotArea='kitchen', shotJob=null;

/* ---- smarter job form: pick a property, the rest fills itself ---- */
var jobForm=null;

/* ---- customer booking with a real date and time ---- */
var bookForm=null;
var SLOTS=['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
var taskKind='bins', taskMode='fixed';

/* ---- tasks that move something from one place to another ---- */
var taskPlace={from:null,to:null};
var TABS={
 manager:[['today','Today','board'],['sales','Sales','zap'],['schedule','Schedule','clock'],['chat','Messages','wa'],['map','Map','pin'],['tasks','Quick tasks','zap'],['jobs','Jobs','list'],['routes','Routes','clock'],
  ['contracts','Contracts','repeat'],['rooms','Rooms','board'],['props','Properties','key'],['keys','Keys & kit','box'],['assets','Units & contracts','repeat'],['customers','Customers','users'],['team','Team','users'],['avail','Availability','clock'],['people','Leave & docs','users'],['safety','Safety','alert'],['inspect','Inspections','alert'],['issues','Problems','alert'],
  ['stock','Stock','box'],['invoices','Invoices','receipt'],['money','Billing','card'],['metrics','Metrics','board'],['feed','Activity','bell'],['settings','Settings','gear']],
 cleaner:[['myday','My job','board'],['pool','Open jobs','zap'],['chat','Messages','wa'],['ctasks','Quick tasks','zap'],['mine','My jobs','list'],['supplies','Supplies','box']],
 customer:[['portal','My cleaning','board'],['chat','Messages','wa']]};
var TITLES={today:'Today',tasks:'Quick tasks',jobs:'Jobs',routes:'Routes',contracts:'Contracts',props:'Properties',
 team:'Team',issues:'Problems',stock:'Stock',invoices:'Invoices',feed:'Activity',myday:'My job',ctasks:'Quick tasks',
 mine:'My jobs',portal:'Your cleaning',settings:'Settings'};
