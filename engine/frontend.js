/* Chronicles front end — menu, name, avatars, lessons, the track picker,
   the certificate, and the boot that starts a run. */
/* ---- three player figures, built from the same CAST fields -------------- */
CAST.p_a={name:'You', role:'The new one', where:'Lobby',
  accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
  legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
  skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
  specs:false, prop:null, build:1.04, bw:23, beard:false};
CAST.p_b={name:'You', role:'The new one', where:'Lobby',
  accent:'#e4ded2', top:'#6d4a63', topDk:'#523849', style:'knit', tee:'#6d4a63',
  legs:'#a8a49c', legsDk:'#8d8981', shoe:'#33302b',
  skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'long',
  specs:false, prop:null, build:0.98, bw:20, beard:false};
CAST.p_c={name:'You', role:'The new one', where:'Lobby',
  accent:'#e4ded2', top:'#2f7d78', topDk:'#215b57', style:'overshirt', tee:'#f2ece0',
  legs:'#5e6a4f', legsDk:'#48523c', shoe:'#e8e2d6',
  skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'undercut',
  specs:true, prop:null, build:1.00, bw:21, beard:false};

/* ---- track registry -----------------------------------------------------
   A track is content: role titles, the step machine, objective strings, the
   lesson list and the certificate wording. The world, renderer, movement,
   doors, dialogue, portfolio and certificate are shared by all of them.     */
/* Built from catalogue.js, so adding a track there is all it takes for the
   picker to list it. The one track loaded into this page is `live` and is
   played in place; the rest are links to their own files. */
const TRACKS={}, TRACK_ORDER=[], TRACK_FILES={};
(window.CATALOGUE||[]).forEach(function(e){
  TRACK_ORDER.push(e.id);
  TRACK_FILES[e.id]=e.file;
  TRACKS[e.id]=TRACK_DEFS[e.id]
    ? Object.assign({},e,TRACK_DEFS[e.id],{live:true})
    : Object.assign({},e,{live:false});
});

const FIRST_LIVE=TRACK_ORDER.filter(function(id){ return TRACKS[id].live; })[0]||window.CHRONICLE;
let TRACK=TRACKS[FIRST_LIVE];
let pendingTrack=FIRST_LIVE;

function loadTrack(id){
  TRACK=(TRACKS[id]&&TRACKS[id].live)?TRACKS[id]:TRACKS[FIRST_LIVE];
  pendingTrack=TRACK.id;
  if(TRACK.roles) for(const k in TRACK.roles){ if(CAST[k]) CAST[k].role=TRACK.roles[k]; }
  G.step=TRACK.first; G.portfolio=[]; G.bought=false; stopClock(); paintHUD();
}

/* ---- screens ------------------------------------------------------------ */
const SCREENS=['menu','nameScreen','avatarScreen','lessonsScreen','tracksScreen','cert','folio'];
function showScreen(id){
  SCREENS.forEach(function(s){ const el=$(s); if(el) el.style.display='none'; });
  if(id) $(id).style.display='flex';
}
function paintMenu(){
  $('menuTitle').textContent=TRACK.title;
  $('gameTitle').textContent=TRACK.title;
  document.title=TRACK.title;
  $('btnLearn').textContent='Learn '+TRACK.name.toLowerCase();
}

$('btnPlay').onclick=function(){ showScreen('nameScreen'); $('nameInput').focus(); };
$('btnLearn').onclick=function(){ paintLessons(); showScreen('lessonsScreen'); };
$('btnTracks').onclick=function(){ paintTracks(); showScreen('tracksScreen'); };
[['backLessons','menu'],['backTracks','menu'],['backName','menu'],['backAvatar','nameScreen']]
  .forEach(function(p){ const b=$(p[0]); if(b) b.onclick=function(){ showScreen(p[1]); }; });

/* ---- name --------------------------------------------------------------- */
const nameInput=$('nameInput'), nameGo=$('nameGo');
nameInput.setAttribute('maxlength','40');
function nameCheck(){ nameGo.disabled = nameInput.value.trim().length===0; }
nameInput.addEventListener('input',nameCheck);
nameInput.addEventListener('keydown',function(e){
  e.stopPropagation();
  if(e.key==='Enter'&&!nameGo.disabled) nameGo.click();
});
nameCheck();
nameGo.onclick=function(){
  G.playerName=nameInput.value.trim().replace(/\s+/g,' ');
  showScreen('avatarScreen'); drawAvatars();
};

/* ---- avatars ------------------------------------------------------------ */
const AVATARS=['p_a','p_b','p_c'];
let avatarPick=null;
function drawAvatars(){
  AVATARS.forEach(function(k,i){
    const cv=$('av'+i); if(!cv) return;
    const g=cv.getContext('2d');
    g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,cv.width,cv.height); g.scale(S,S);
    const prev=X; X=g;
    person(cv.width/(2*S), cv.height/S-14, k, 'down', performance.now()-T0, {scale:2.4});
    X=prev;
    cv.parentNode.className='avcard'+(avatarPick===k?' on':'');
    cv.parentNode.onclick=function(){ avatarPick=k; drawAvatars(); $('avGo').disabled=false; };
  });
}
$('avGo').onclick=function(){
  CAST.player=Object.assign({},CAST[avatarPick||'p_a']);
  if(TRACK.roles&&TRACK.roles.player) CAST.player.role=TRACK.roles.player;
  showScreen(null);
  loadTrack(pendingTrack);
  G.started=true;
  G.room='lobby'; cur='lobby'; G.px=400; G.py=392; G.dir='up';
  cancelTravel();
  say('', TRACK.opening.text, [{label:TRACK.opening.label, go:closeDlg}]);
  showCoach();
};

/* ---- lessons ------------------------------------------------------------ */
function paintLessons(){
  $('lessonsTitle').textContent='What '+TRACK.name.toLowerCase()+' teaches';
  $('lessonsBody').innerHTML=(TRACK.lessons||[]).map(function(L){
    return '<div class="lesson"><b>'+L.t+'</b><span>'+L.c+'</span><p>'+L.l+'</p></div>';
  }).join('');
}

/* ---- track picker ------------------------------------------------------- */
function paintTracks(){
  /* The track compiled into this build is played in place; every other one is
     its own file next to this one, so it is a link rather than a dead card. */
  $('tracksBody').innerHTML=TRACK_ORDER.map(function(id){
    const T=TRACKS[id]; if(!T) return '';
    const body='<b>'+T.name+'</b><em>'+(T.live?(pendingTrack===id?'Selected':'Play this')
      :'Open')+'</em><p>'+T.blurb+'</p>';
    if(T.live) return '<div class="trackcard live'+(pendingTrack===id?' on':'')+
      '" data-id="'+id+'">'+body+'</div>';
    const href=TRACK_FILES[id];
    return href?'<a class="trackcard live away" href="'+href+'">'+body+'</a>'
               :'<div class="trackcard">'+body+'</div>';
  }).join('');
  [].forEach.call($('tracksBody').querySelectorAll('.trackcard.live[data-id]'),function(el){
    el.onclick=function(){
      loadTrack(el.getAttribute('data-id'));
      paintMenu(); paintTracks();
      showScreen('nameScreen'); $('nameInput').focus();
    };
  });
}

/* ---- certificate -------------------------------------------------------- */
function certName(){ return (G.playerName||'').toUpperCase(); }
function drawCertificate(g,w,h){
  g.fillStyle='#f6f8fb'; g.fillRect(0,0,w,h);
  g.strokeStyle='#1f6feb'; g.lineWidth=3; g.strokeRect(16,16,w-32,h-32);
  g.strokeStyle='#c6d2e0'; g.lineWidth=1; g.strokeRect(26,26,w-52,h-52);
  g.textAlign='center'; g.fillStyle='#5b6673';
  g.font='600 15px "Space Grotesk", sans-serif';
  g.fillText(TRACK.certTitle||'CHRONICLES', w/2, 78);
  g.font='400 14px "DM Sans", sans-serif';
  g.fillText('This certifies that', w/2, 122);

  const n=certName();
  let fs=44;                              /* long names step down, stay on one line */
  if(n.length>22) fs=34;
  if(n.length>30) fs=27;
  if(n.length>36) fs=23;
  g.fillStyle='#10161d'; g.font='600 '+fs+'px "Space Grotesk", sans-serif';
  g.fillText(n, w/2, 174);
  g.strokeStyle='#1f6feb'; g.lineWidth=2;
  g.beginPath(); g.moveTo(w/2-150,192); g.lineTo(w/2+150,192); g.stroke();

  g.fillStyle='#3d4855'; g.font='400 14px "DM Sans", sans-serif';
  (TRACK.certBody||[]).forEach(function(L,i){ g.fillText(L, w/2, 224+i*22); });

  g.font='400 12px "DM Sans", sans-serif'; g.fillStyle='#5b6673';
  G.portfolio.forEach(function(p,i){ g.fillText(p.title+' — '+p.client, w/2, 312+i*19); });

  g.font='italic 400 26px "DM Sans", cursive, sans-serif'; g.fillStyle='#10161d';
  g.fillText('Harsha Satish', w/2, h-78);
  g.strokeStyle='#c6d2e0'; g.lineWidth=1;
  g.beginPath(); g.moveTo(w/2-110,h-64); g.lineTo(w/2+110,h-64); g.stroke();
  g.font='400 11px "DM Sans", sans-serif'; g.fillStyle='#5b6673';
  g.fillText('Creator, '+(TRACK.title||'Chronicles'), w/2, h-46);
  g.textAlign='left';
}
function openCertificate(){
  const cv=$('certCanvas'), g=cv.getContext('2d');
  g.setTransform(1,0,0,1,0,0);
  drawCertificate(g,cv.width,cv.height);
  showScreen('cert');
}
$('certDownload').onclick=function(){
  const cv=document.createElement('canvas'); cv.width=1200; cv.height=848;
  const g=cv.getContext('2d'); g.scale(1.5,1.5);
  drawCertificate(g,800,565);
  const a=document.createElement('a');
  a.download=TRACK.id+'-chronicles-'+
    (G.playerName||'certificate').replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.png';
  a.href=cv.toDataURL('image/png'); a.click();
};
$('certFolio').onclick=function(){ showScreen(null); openFolio(); };

/* ---- boot ---------------------------------------------------------------
   Merge the three config layers, hand the world's colourway to CSS, let the
   world finish the palette, then fill in every label the engine owns. */
applyConfig();
(function(){
  const w=window.WORLD||{};
  if(w.theme) Object.keys(w.theme).forEach(function(k){
    document.documentElement.style.setProperty(k,w.theme[k]);
  });
  if(w.paint) w.paint();

  const L=CFG.labels;
  $('folioLabel').textContent=L.folio;
  $('certFolio').textContent='View '+L.folio.toLowerCase();
  $('keysHint').innerHTML='Arrow keys or WASD to move &middot; E or Space to talk '
    + '&middot; P for '+L.folio.toLowerCase();
  $('c').setAttribute('aria-label',L.floor);
  $('pickerTitle').textContent=L.pickerTitle;
  $('pickerLede').textContent=L.pickerLede;
  if(CFG.menuLede) $('menuLede').textContent=CFG.menuLede;
})();

loadTrack(FIRST_LIVE);
paintMenu();
showScreen('menu');
frame();

window.CC.loadTrack=loadTrack;
window.CC.TRACKS=TRACKS;
window.CC.cert=drawCertificate;
window.CC.track=function(){ return TRACK; };

