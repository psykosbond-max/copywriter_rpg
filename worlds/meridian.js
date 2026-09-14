/* World: Meridian — a product company on floor 3.
   A world owns the rooms, the furniture that paints them, and the colourway.
   Its `config` overrides engine/defaults.js for every track set here — so a
   change in this file reaches the five Meridian games and no others. */
window.WORLD={
  id:'meridian',
  theme:{
    '--bg':'#0e1116',
    '--ink':'#e6edf3',
    '--mute':'#8b97a6',
    '--line':'#2c3440',
    '--panel':'#1a1f27',
    '--onAccent':'#0b0f14',
    '--accent':'#58a6ff',
    '--warn':'#f0803c',
    '--panel2':'#161b22',
    '--ink2':'#dbe3ec',
    '--line2':'#20262f',
    '--mute2':'#6e7a89',
    '--panel3':'#1d232c',
    '--ink3':'#b9c4d0',
    '--paper':'#f2ece0',
    '--veil':'rgba(9,12,16,.94)'
  },
  config:{
    labels:{"folio": "Work log", "floor": "Engineering floor"}
  },
  /* Applied once the engine palette exists. */
  paint:function(){
    Object.assign(P,{ chevron:P.cyan, doorTrim:P.anod });
  }
};

Object.assign(P,{
  slateD:'#2b323c', slateM:'#3b444f', slateL:'#515c6a', mesh:'#333c47',
  birch:'#d6bd96', birchHi:'#e7d3b2', birchDk:'#ab9068',
  screenDk:'#0d1117', screenLit:'#16202c', screenGlow:'#7fa8c4',
  led:'#3fb950', ledA:'#d29922', ledR:'#f85149', cyan:'#58a6ff', blueDk:'#1f6feb',
  acoustic:'#4a5560', acousticDk:'#3a434e', rubber:'#26292f',
  moss:'#4f6b52', felt:'#5c6b7a', chrome:'#8d98a6', anod:'#6f7a87'
});

/* --- floors ------------------------------------------------------------- */
function terrazzoCool(seed){                     /* fine chips, grey base, sealed */
  const R=seeded(seed);
  r(FX,FY,FW,FH,'#d5dae0');
  const chips=['#4d5865','#8d98a6','#ffffff','#b9c2cb','#5c6b7a','#7fa8c4'];
  for(let i=0;i<2100;i++){
    const cx=FX+R()*FW, cy=FY+R()*FH, sz=1+R()*2.2;
    X.globalAlpha=.34+R()*.4;
    X.fillStyle=chips[Math.floor(R()*chips.length)];
    X.beginPath(); X.ellipse(cx,cy,sz,sz*(.7+R()*.5),R()*3,0,Math.PI*2); X.fill();
  }
  X.globalAlpha=1;
  X.strokeStyle='#b6bec7'; X.lineWidth=1.4;                /* expansion joints */
  for(let x=FX+190;x<FX+FW;x+=190){ X.beginPath(); X.moveTo(x,FY); X.lineTo(x,FY+FH); X.stroke(); }
  X.beginPath(); X.moveTo(FX,FY+FH/2); X.lineTo(FX+FW,FY+FH/2); X.stroke();
  if(showLight){ X.globalAlpha=.08; X.fillStyle='#ffffff';
    for(let i=0;i<3;i++){ X.beginPath();
      X.ellipse(FX+170+i*210,FY+FH*.4,140,80,0,0,Math.PI*2); X.fill(); }
    X.globalAlpha=1; }
  grain(FX,FY,FW,FH,.045);
}
function accessFloor(seed){                      /* raised data-centre panels */
  const R=seeded(seed), T=76;
  r(FX,FY,FW,FH,'#2f343b');
  for(let i=0;i<Math.ceil(FW/T);i++) for(let j=0;j<Math.ceil(FH/T);j++){
    const x=FX+i*T, y=FY+j*T, w=Math.min(T,FX+FW-x), h=Math.min(T,FY+FH-y);
    const v=R(); X.globalAlpha=.5+v*.5;
    r(x,y,w,h, v>.66?'#343a42' : v>.33?'#2d323a' : '#31373f'); X.globalAlpha=1;
    X.strokeStyle='#23272d'; X.lineWidth=1; X.strokeRect(x+.5,y+.5,w-1,h-1);
    X.globalAlpha=.5; X.fillStyle='#4a525c';
    X.fillRect(x+w/2-3,y+3,6,2); X.fillRect(x+w/2-3,y+h-5,6,2); X.globalAlpha=1;
  }
  grain(FX,FY,FW,FH,.05);
}
function gridCarpet(seed,base,alt,seam){         /* office carpet tile, laid true */
  const R=seeded(seed), T=64;
  r(FX,FY,FW,FH,base);
  for(let i=0;i<Math.ceil(FW/T);i++) for(let j=0;j<Math.ceil(FH/T);j++){
    const x=FX+i*T, y=FY+j*T, w=Math.min(T,FX+FW-x), h=Math.min(T,FY+FH-y);
    if((i+j)%2){ X.globalAlpha=.55; r(x,y,w,h,alt); X.globalAlpha=1; }
    X.globalAlpha=.35; X.strokeStyle=seam; X.lineWidth=1;
    X.strokeRect(x+.5,y+.5,w-1,h-1); X.globalAlpha=1;
  }
  X.globalAlpha=.16;                              /* fibre speckle */
  for(let i=0;i<900;i++){ const px=FX+R()*FW, py=FY+R()*FH;
    r(px,py,1.6,1.6, R()>.5?seam:alt); }
  X.globalAlpha=1; grain(FX,FY,FW,FH,.05);
}
function epoxyFloor(seed,base,hi){               /* poured resin, sealed */
  const R=seeded(seed);
  r(FX,FY,FW,FH,base);
  for(let i=0;i<26;i++){ X.globalAlpha=.05+R()*.06;
    const w=90+R()*260,h=60+R()*170;
    rr(FX+R()*(FW-w),FY+R()*(FH-h),w,h,40,hi); }
  X.globalAlpha=1;
  if(showLight){ X.globalAlpha=.07; X.fillStyle='#ffffff';
    for(let i=0;i<4;i++){ X.beginPath();
      X.ellipse(FX+150+i*160, FY+FH*.45, 120, 66, 0, 0, Math.PI*2); X.fill(); }
    X.globalAlpha=1; }
  grain(FX,FY,FW,FH,.055);
}

/* --- walls and wall furniture -------------------------------------------- */
function slatWall(x,y,w,h){                       /* acoustic timber battens */
  r(x,y,w,h,P.acousticDk);
  for(let i=0;i<Math.floor(w/9);i++){
    const sx=x+i*9;
    r(sx,y,6,h,i%3===0?P.acoustic:'#434d58');
    X.globalAlpha=.35; r(sx+6,y,3,h,'#252c34'); X.globalAlpha=1;
  }
}
function dashWall(x,y,w,h,seed){                  /* the graphs everyone watches */
  box(x,y,w,h,'#12161c',3);
  const R=seeded(seed), cols=5, rows=2;
  const pw=(w-10)/cols, ph=(h-10)/rows;
  for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
    const px=x+5+i*pw, py=y+5+j*ph;
    rr(px+1.5,py+1.5,pw-3,ph-3,2,'#0a0d12');
    const bad=(i===3&&j===0);
    const col=bad?P.ledR:(i===1&&j===1)?P.ledA:P.led;
    X.strokeStyle=col; X.lineWidth=1.2; X.globalAlpha=.95;
    X.beginPath();
    const gw=pw-9, gh=ph-9, bx=px+4, by=py+4;
    for(let k=0;k<=14;k++){
      const v=bad? (k>8? .15+R()*.2 : .7+R()*.25) : .45+R()*.4;
      const gx=bx+(k/14)*gw, gy=by+gh-v*gh;
      k?X.lineTo(gx,gy):X.moveTo(gx,gy);
    }
    X.stroke();
    X.globalAlpha=.16; X.fillStyle=col;
    X.fillRect(bx,by+gh-2,gw,2); X.globalAlpha=1;
    rr(px+4,py+3,10+R()*14,2,1,'#39414d');       /* panel title */
  }
}
function stickyWall(x,y,w,h,seed){                /* three swimlanes, ungroomed */
  box(x,y,w,h,'#e9e4d8',2);
  X.strokeStyle='#c3bcab'; X.lineWidth=1;
  for(let i=1;i<3;i++){ X.beginPath(); X.moveTo(x+i*(w/3),y+3); X.lineTo(x+i*(w/3),y+h-3); X.stroke(); }
  const R=seeded(seed), cols=['#f0c674','#8fd18a','#8ec3e6','#e8948e','#c5a9dd'];
  for(let lane=0;lane<3;lane++){
    const n=lane===0?9:lane===1?6:2;             /* the third lane is always empty */
    for(let i=0;i<n;i++){
      const sx=x+lane*(w/3)+6+(i%3)*((w/3-16)/3);
      const sy=y+8+Math.floor(i/3)*13;
      X.save(); X.translate(sx,sy); X.rotate((R()-.5)*.14);
      r(0,0,11,10,cols[Math.floor(R()*cols.length)]);
      X.globalAlpha=.22; r(0,8,11,2,'#000000'); X.globalAlpha=1;
      X.restore();
    }
  }
}
function ciScreen(x,y,w,h){                       /* the build, on the wall, on purpose */
  box(x,y,w,h,P.slateD,3);
  rr(x+4,y+4,w-8,h-8,2,'#0b0f14');
  const rows=5, rh=(h-12)/rows;
  for(let i=0;i<rows;i++){
    const ry=y+6+i*rh, ok=i!==2;
    rr(x+7,ry+1,5,rh-3,1, ok?P.led:P.ledR);
    X.globalAlpha=.55; rr(x+16,ry+2,w-30-(i*7)%26,rh-5,1,ok?'#1d3a26':'#3d1d1f'); X.globalAlpha=1;
  }
  if(showLight){ X.save(); X.globalCompositeOperation='lighter'; X.globalAlpha=.1;
    const g=X.createRadialGradient(x+w/2,y+h,0,x+w/2,y+h,120);
    g.addColorStop(0,'#f85149'); g.addColorStop(1,'#f8514900'); X.fillStyle=g;
    X.beginPath(); X.arc(x+w/2,y+h,120,0,Math.PI*2); X.fill(); X.restore(); }
}
function statusBoard(x,y,w,h){                    /* lobby: everything green, today */
  box(x,y,w,h,'#151a21',3);
  const cols=12, rows=3, pw=(w-12)/cols, ph=(h-12)/rows;
  for(let j=0;j<rows;j++) for(let i=0;i<cols;i++)
    rr(x+6+i*pw, y+6+j*ph, pw-2, ph-2, 1, (i===7&&j===1)?P.ledA:P.led);
  X.globalAlpha=.25; vgrad(x+4,y+4,w-8,(h-8)/2,'#9fe8b5','#151a21'); X.globalAlpha=1;
}
function glassBooth(x,y,w,h,lit){                 /* focus pod, door ajar, one chair */
  softShadow(x,y,w,h);
  rr(x,y,w,h,3,'#21262d');
  rr(x+3,y+3,w-6,h-6,2,lit?'#2b3b46':'#243039');
  X.globalAlpha=.34; rr(x+3,y+3,w-6,(h-6)*.5,2,P.glassT); X.globalAlpha=1;
  X.strokeStyle=P.chrome; X.lineWidth=1.4; X.strokeRect(x+.7,y+.7,w-1.4,h-1.4);
  r(x+w-4,y+6,3,h-12,P.anod);
  rr(x+w/2-9,y+h/2-6,18,12,2,P.slateL);           /* stool */
  if(lit&&showLight){ X.save(); X.globalCompositeOperation='lighter'; X.globalAlpha=.12;
    const g=X.createRadialGradient(x+w/2,y+h/2,0,x+w/2,y+h/2,90);
    g.addColorStop(0,'#cfe3ff'); g.addColorStop(1,'#cfe3ff00'); X.fillStyle=g;
    X.beginPath(); X.arc(x+w/2,y+h/2,90,0,Math.PI*2); X.fill(); X.restore(); }
  collisions.push([x,y,w,h]);
}

/* --- desks, chairs, screens ---------------------------------------------- */
function monitorPair(cx,y,n){                     /* on arms, backs to you */
  const wid=n===1?26:48;
  r(cx-1.5,y+6,3,7,P.anod);                       /* arm */
  rr(cx-wid/2,y-9,wid,15,2,'#1b2027');
  X.globalAlpha=.5; vgrad(cx-wid/2+1.5,y-7.5,wid-3,6,P.screenGlow,'#1b2027'); X.globalAlpha=1;
  if(n===2){ r(cx-.8,y-9,1.6,15,'#0e1216'); }
  if(showLight){ X.globalAlpha=.1; X.fillStyle='#9fc6e8';
    X.beginPath(); X.ellipse(cx,y+16,wid*.55,10,0,0,Math.PI*2); X.fill(); X.globalAlpha=1; }
}
function benchDesk(cx,cy,w,seats,dual,flip){           /* the spine of the floor */
  const h=52, x=cx-w/2, y=cy-h/2;
  softShadow(x,y,w,h);
  rr(x,y,w,h,3,P.birch); vgrad(x,y,w,7,P.birchHi,P.birch);
  X.globalAlpha=.4; r(x,y+h/2-1,w,2,P.birchDk); X.globalAlpha=1;  /* shared spine seam */
  r(x+6,y+h,w-12,3,P.anod);                       /* cable tray under */
  for(let i=0;i<seats;i++){
    const sx=x+(w/seats)*(i+.5);
    monitorPair(sx, flip?y+h-8:y+13, dual?2:1);
    rr(sx-13, flip?y+11:y+h-19, 26,8,1,'#c9cdd4');            /* keyboard */
    rr(sx+16, flip?y+12:y+h-18, 6,6,1,'#c9cdd4');             /* mouse */
    if(i%2) rr(sx-19, flip?y+22:y+h-30, 14,9,1,P.slateL);     /* laptop on a riser */
  }
  collisions.push([x,y-6,w,h+9]);
}
function standDesk(cx,cy,raised){
  const w=112,h=44,x=cx-w/2,y=cy-h/2;
  softShadow(x,y,w,h);
  rr(x,y,w,h,3,P.birchHi); vgrad(x,y,w,6,'#f2e4c8',P.birchHi);
  r(x+12,y+h,10,5,P.anod); r(x+w-22,y+h,10,5,P.anod);
  monitorPair(cx,y+12,2);
  rr(cx-13,y+h-15,26,7,1,'#c9cdd4');
  if(raised) rr(cx+30,y+8,16,12,2,P.moss);        /* the plant that survives */
  collisions.push([x,y-6,w,h+7]);
}
function taskChair(cx,cy,col){                    /* mesh back, five-star base */
  X.save(); X.globalAlpha=.2; X.fillStyle='#000000';
  X.beginPath(); X.ellipse(cx,cy+9,15,5,0,0,Math.PI*2); X.fill(); X.restore();
  X.strokeStyle=P.chrome; X.lineWidth=2;
  for(let i=0;i<5;i++){ const a=i*(Math.PI*2/5)+.4;
    X.beginPath(); X.moveTo(cx,cy+3); X.lineTo(cx+Math.cos(a)*13,cy+3+Math.sin(a)*7); X.stroke(); }
  rr(cx-13,cy-8,26,15,4,col||P.slateM);           /* seat */
  X.globalAlpha=.3; rr(cx-11,cy-6,22,5,3,'#ffffff'); X.globalAlpha=1;
  rr(cx-12,cy-19,24,11,4,P.mesh);                 /* mesh back */
  X.globalAlpha=.4; X.strokeStyle='#6d7986'; X.lineWidth=.7;
  for(let i=1;i<5;i++){ X.beginPath(); X.moveTo(cx-11,cy-18+i*2); X.lineTo(cx+11,cy-18+i*2); X.stroke(); }
  X.globalAlpha=1;
  collisions.push([cx-13,cy-14,26,22]);
}
function cableSpine(x1,x2,y){                     /* floor boxes and a trunk */
  r(x1,y-3,x2-x1,6,'#2f353d');
  X.globalAlpha=.5; r(x1,y-3,x2-x1,2,'#454d57'); X.globalAlpha=1;
  for(let x=x1+30;x<x2-20;x+=86){ rr(x,y-7,16,14,2,P.anod); rr(x+3,y-4,10,8,1,'#1b2027'); }
}
function rack(x,y,w,h,seed){                      /* two of these, always humming */
  softShadow(x,y,w,h);
  rr(x,y,w,h,2,'#1b1f25');
  X.strokeStyle='#2f363d';
  const R=seeded(seed), units=Math.floor((h-8)/9);
  for(let i=0;i<units;i++){
    const uy=y+4+i*9;
    rr(x+3,uy,w-6,7,1, i%4===3?'#242a31':'#20252c');
    for(let k=0;k<3;k++){
      const on=R()>.25;
      r(x+6+k*4, uy+2.4, 2.2, 2.2, on?(R()>.85?P.ledA:P.led):'#2b3038');
    }
    X.globalAlpha=.5; r(x+w-16,uy+2,10,3,'#161a20'); X.globalAlpha=1;
  }
  collisions.push([x,y,w,h]);
}
function counterRun(x,y,w,h){                     /* kitchen: counter, machine, sink */
  box(x,y,w,h,'#cfd4da',3); vgrad(x,y,w,6,'#e4e8ec','#cfd4da');
  r(x,y+h-7,w,7,P.slateD);
  box(x+14,y+4,34,30,P.slateD,3);                 /* the coffee machine */
  rr(x+20,y+9,22,13,2,'#0d1117'); rr(x+27,y+24,8,6,1,P.chrome);
  rr(x+18,y+7,4,4,2,P.ledR);
  rr(x+w-64,y+8,40,22,3,'#b9bfc6');               /* sink */
  X.globalAlpha=.45; rr(x+w-60,y+11,32,10,2,'#7e888f'); X.globalAlpha=1;
  r(x+w-46,y+4,3,9,P.chrome);
  for(let i=0;i<5;i++) rr(x+70+i*13,y+12,9,14,2,[P.cyan,'#e8948e','#8fd18a','#f0c674','#c5a9dd'][i]);
}
function island(cx,cy,w,h){
  const x=cx-w/2,y=cy-h/2;
  X.save(); X.globalAlpha=.22; X.fillStyle='#000000';
  if(X.roundRect){X.beginPath();X.roundRect(x+3,y+h-2,w,9,6);X.fill();} X.restore();
  rr(x,y,w,h,4,'#3f464e'); vgrad(x,y,w,8,'#525a64','#3f464e');
  rr(x+8,y+6,w-16,h-14,3,'#d9dde2');              /* worktop */
  rr(x+18,y+14,26,16,2,P.birch);                  /* board */
  rr(x+w-52,y+12,18,18,9,'#e6ebef');              /* bowl */
  rr(x+w/2-8,y+16,16,12,2,P.cyan);                /* somebody's laptop */
  collisions.push([x,y,w,h]);
}
function stool(cx,cy,col){
  X.save(); X.globalAlpha=.2; X.fillStyle='#000000';
  X.beginPath(); X.ellipse(cx,cy+7,11,4,0,0,Math.PI*2); X.fill(); X.restore();
  X.fillStyle=col; X.beginPath(); X.ellipse(cx,cy,11,8,0,0,Math.PI*2); X.fill();
  X.globalAlpha=.3; X.fillStyle='#ffffff';
  X.beginPath(); X.ellipse(cx-3,cy-2,5,3,0,0,Math.PI*2); X.fill(); X.globalAlpha=1;
  collisions.push([cx-11,cy-9,22,18]);
}
function pingPong(cx,cy){
  const w=190,h=100,x=cx-w/2,y=cy-h/2;
  softShadow(x,y,w,h);
  rr(x,y,w,h,3,'#2f6b56'); 
  X.strokeStyle='#e6ebef'; X.lineWidth=1.6; X.strokeRect(x+4.5,y+4.5,w-9,h-9);
  X.beginPath(); X.moveTo(x+4,y+h/2); X.lineTo(x+w-4,y+h/2); X.stroke();
  r(x+w/2-1.5,y+2,3,h-4,'#d8dde2');               /* net, seen from above */
  rr(x+22,y+20,16,11,5,P.ledR); rr(x+w-40,y+h-32,16,11,5,'#1b2027');
  collisions.push([x,y,w,h]);
}
function ovalTable(cx,cy,w,h){
  X.save(); X.globalAlpha=.24; X.fillStyle='#000000';
  X.beginPath(); X.ellipse(cx,cy+h/2-2,w/2,10,0,0,Math.PI*2); X.fill(); X.restore();
  X.fillStyle=P.birch; X.beginPath(); X.ellipse(cx,cy,w/2,h/2,0,0,Math.PI*2); X.fill();
  X.globalAlpha=.5; X.fillStyle=P.birchHi;
  X.beginPath(); X.ellipse(cx,cy-3,w/2-6,h/2-7,0,0,Math.PI*2); X.fill(); X.globalAlpha=1;
  rr(cx-26,cy-13,52,26,3,'#1b2027');              /* conference puck + cables */
  X.fillStyle=P.chrome; X.beginPath(); X.ellipse(cx,cy,11,7,0,0,Math.PI*2); X.fill();
  rr(cx-52,cy-8,18,13,2,P.slateL); rr(cx+36,cy-2,18,13,2,P.slateL);
  collisions.push([cx-w/2,cy-h/2,w,h]);
}
function lockers(x,y,w,h,n){
  box(x,y,w,h,P.slateM,2);
  for(let i=0;i<n;i++){
    const ly=y+3+i*((h-6)/n);
    rr(x+3,ly,w-6,(h-6)/n-3,1,i%2?'#46505b':'#3d4650');
  }
}
function lowBench(cx,cy,w,col){
  const h=30,x=cx-w/2,y=cy-h/2;
  softShadow(x,y,w,h); rr(x,y,w,h,4,col);
  X.globalAlpha=.25; rr(x+5,y+4,w-10,8,4,'#ffffff'); X.globalAlpha=1;
  collisions.push([x,y,w,h]);
}
function whiteboardTech(x,y,w,h,seed){            /* boxes and arrows, not doodles */
  box(x,y,w,h,'#f3f5f7',2);
  const R=seeded(seed);
  X.strokeStyle='#2f3a46'; X.lineWidth=1.1;
  const nodes=[];
  for(let i=0;i<5;i++){
    const bw=20+R()*16, bh=10+R()*4;
    const bx=x+8+ (i%3)*((w-24)/3), by=y+7+Math.floor(i/3)*((h-18)/2);
    X.strokeRect(bx+.5,by+.5,bw,bh);
    X.globalAlpha=.2; r(bx+1,by+1,bw-1,bh-1,[P.cyan,'#8fd18a','#f0c674'][i%3]); X.globalAlpha=1;
    nodes.push([bx+bw/2,by+bh/2,bx+bw,by+bh/2]);
  }
  X.lineWidth=1;
  for(let i=0;i<4;i++){
    const a=nodes[i], b=nodes[i+1];
    X.beginPath(); X.moveTo(a[2],a[3]); X.lineTo(b[0]-6,b[1]); X.stroke();
    X.beginPath(); X.moveTo(b[0]-6,b[1]); X.lineTo(b[0]-10,b[1]-2.5);
    X.moveTo(b[0]-6,b[1]); X.lineTo(b[0]-10,b[1]+2.5); X.stroke();
  }
  X.strokeStyle=P.ledR; X.lineWidth=1.4;          /* the circled one */
  X.beginPath(); X.ellipse(nodes[3][0],nodes[3][1],17,9,0,0,Math.PI*2); X.stroke();
}

/* ==========================================================================
   ROOMS
   ========================================================================== */

const ROOMS={
lobby:{
  name:'Reception', wall:'#dfe3e7', wallHi:'#edf0f3', wallDk:'#c4cad1', skirt:'#2b323c',
  material:'Terrazzo, a stone reception slab, and a wall of green tiles',
  desc:'Terrazzo with dark chips, laid true and sealed. One stone slab for a desk with the wordmark behind it, a status board showing every service green except one, low benches instead of a sofa, and a bank of lockers for the people who cycle in.',
  exits:'Right → Product<br/>Down → Kitchen',
  doors:[{side:'right',at:240},{side:'bottom',at:400}],
  floor(){ terrazzoCool(31); },
  draw(){
    statusBoard(430,26,300,52);
    slatWall(96,26,300,52);
    X.globalAlpha=.9; rr(150,44,190,18,3,'#20262e'); X.globalAlpha=1;  /* wordmark plate */
    rr(162,50,22,7,1,P.cyan); rr(190,50,98,7,1,'#c7d2de');
    tilted(400,150,210,62,0,(x,y,w,h)=>{                                 /* stone slab desk */
      X.save(); X.globalAlpha=.24; X.fillStyle='#000000';
      if(X.roundRect){X.beginPath();X.roundRect(x+3,y+h-2,w,9,5);X.fill();} X.restore();
      rr(x,y,w,h,3,'#cbcfd4'); vgrad(x,y,w,9,'#e2e6ea','#cbcfd4');
      X.globalAlpha=.25;
      for(let i=0;i<60;i++) r(x+((i*37)%w),y+((i*23)%h),2,2,i%3?'#8d98a6':'#5c6b7a');
      X.globalAlpha=1;
      rr(x+w-58,y+14,40,24,2,'#1b2027'); rr(x+16,y+22,30,12,2,'#dfe3e7');
    });
    taskChair(400,112,P.slateM);
    lowBench(560,300,150,P.felt);
    lowBench(560,372,150,P.moss);
    tilted(560,336,74,40,0,(x,y,w,h)=>{ rr(x,y,w,h,3,P.birch); vgrad(x,y,w,5,P.birchHi,P.birch);
      rr(x+14,y+11,26,16,2,'#e8ecef'); rr(x+46,y+14,14,10,2,P.cyan); });
    lockers(24,150,18,190,6);
    [[118,352,46,26],[126,330,34,22],[122,310,40,20]].forEach(function(b,i){  /* hardware, delivered */
      box(b[0],b[1],b[2],b[3], i===1?'#b7a184':'#c7b295', 2);
      X.globalAlpha=.5; r(b[0]+b[2]/2-1,b[1],2,b[3],'#8d7a5f'); X.globalAlpha=1;
      rr(b[0]+5,b[1]+5,14,6,1,'#e8ecef');
    });
    pot(120,150,1.2,'clay'); pot(700,140,1.15,'cream');
    grain(FX,FY,FW,FH,.05);
  }},

creative:{
  name:'Engineering', wall:'#3f4954', wallHi:'#4d5865', wallDk:'#333c47', skirt:'#232a32',
  material:'Grey-blue carpet tile, bench desks, acoustic slats, two focus booths',
  desc:'Carpet tile on a strict grid because it gets lifted twice a year. Two bench desks of three, monitors on arms at the same height, a cable spine down the middle with floor boxes, acoustic slats along the back, and two glass booths for the calls nobody wants to take at their desk.',
  exits:'Left → Product<br/>Down → War Room',
  doors:[{side:'left',at:240},{side:'bottom',at:400}],
  floor(){ gridCarpet(47,'#59636f','#616c79','#48515c'); },
  draw(){
    slatWall(96,26,240,52);
    whiteboardTech(352,26,250,52,13);
    ciScreen(618,26,110,52);
    cableSpine(150,620,300);
    benchDesk(330,180,290,3,true);
    benchDesk(330,384,290,3,true,true);
    [[232,224],[330,224],[428,224]].forEach(([cx,cy],i)=>taskChair(cx,cy,[P.slateM,P.felt,P.slateM][i]));
    [[232,340],[330,340],[428,340]].forEach(([cx,cy],i)=>taskChair(cx,cy,[P.felt,P.slateM,P.felt][i]));
    standDesk(600,180,true);
    taskChair(600,232,P.slateM);
    glassBooth(660,290,52,74,true);
    glassBooth(660,376,52,74,false);
    box(24,310,18,120,P.slateM,2);                                        /* keyboard shelf */
    for(let i=0;i<4;i++) rr(27,318+i*29,12,20,1,[P.cyan,'#8fd18a','#f0c674','#e8948e'][i]);
    pot(96,150,1.1,'clay'); pot(96,392,1.05,'cream');
    grain(FX,FY,FW,FH,.05);
  }},

servicing:{
  name:'Product', wall:'#dfe3e7', wallHi:'#edf0f3', wallDk:'#c4cad1', skirt:'#3b444f',
  material:'Pale resin floor, sticky-note wall, two four-desk pods',
  desc:'Poured resin, light, easy to roll a chair across. The roadmap is three swimlanes of sticky notes and the third lane has two notes in it. Two pods of four with acoustic dividers, a sofa nobody sits on facing a screen nobody turns on, and a whiteboard on wheels.',
  exits:'Left → Reception<br/>Right → Engineering<br/>Down → Ops',
  doors:[{side:'left',at:240},{side:'right',at:240},{side:'bottom',at:400}],
  floor(){ epoxyFloor(59,'#c6cbd1','#dadfe4'); },
  draw(){
    stickyWall(110,26,360,52,3);
    screenWall(500,26,190,52);
    [[200,150],[600,150]].forEach(([cx,cy])=>{                            /* four-desk pods */
      benchDesk(cx,cy,176,2,false);
      rr(cx-86,cy-34,172,7,2,P.felt);                                     /* acoustic divider */
      taskChair(cx-44,cy+50,P.slateM); taskChair(cx+44,cy+50,P.felt);
    });
    tilted(180,340,170,50,0,(x,y,w,h)=>{ rr(x,y,w,h,10,P.felt);
      X.globalAlpha=.24; rr(x+7,y+5,w-14,10,5,'#ffffff'); X.globalAlpha=1; });
    tilted(180,406,90,38,0,(x,y,w,h)=>{ rr(x,y,w,h,3,P.birch);
      vgrad(x,y,w,5,P.birchHi,P.birch); rr(x+18,y+11,34,16,2,'#e8ecef'); });
    box(596,322,120,10,'#e9ecef',2);                                      /* board on castors */
    r(600,332,4,26,P.anod); r(708,332,4,26,P.anod);
    X.strokeStyle='#2f3a46'; X.lineWidth=1.1;
    X.strokeRect(608.5,325.5,26,5); X.strokeRect(648.5,325.5,26,5);
    X.beginPath(); X.moveTo(636,328); X.lineTo(646,328); X.stroke();
    box(456,288,52,40,P.slateM,3);                                         /* printer, jammed */
    rr(462,282,40,8,2,'#e8ecef'); rr(464,296,36,18,2,'#1b2027');
    rr(468,300,5,5,1,P.ledA);
    rr(300,410,54,30,3,'#3f4954');                                         /* recycling, overflowing */
    for(let i=0;i<5;i++) rr(304+i*10,402+(i%2)*4,8,10,1,'#d9d2c2');
    lowBench(600,408,120,P.felt);
    tilted(96,300,74,40,0,function(x,y,w,h){ rr(x,y,w,h,3,P.birch);
      vgrad(x,y,w,5,P.birchHi,P.birch); rr(x+16,y+12,42,16,2,'#e8ecef'); });
    pot(700,400,1.15,'clay'); pot(96,150,1.05,'cream');
    grain(FX,FY,FW,FH,.05);
  }},

studio:{
  name:'Ops', wall:'#232a32', wallHi:'#2f3740', wallDk:'#1a2027', skirt:'#12161c',
  material:'Raised access floor, dashboard wall, two racks',
  desc:'Raised access floor on a 600 grid with one panel still lifted from Tuesday. A wall of graphs, two desks turned to face it rather than each other, and the racks in the corner with their lights going. The darkest room in the building, on purpose — you can read a graph in here.',
  exits:'Left → Kitchen<br/>Up → Product<br/>Right → War Room',
  doors:[{side:'left',at:240},{side:'top',at:400},{side:'right',at:240}],
  floor(){ accessFloor(71); },
  draw(){
    dashWall(126,26,244,52,17); dashWall(430,26,244,52,23);
    rr(96,244,60,60,2,'#1b2027');                                          /* the lifted panel */
    X.strokeStyle=P.ledA; X.lineWidth=1.4; X.strokeRect(96.5,244.5,59,59);
    X.globalAlpha=.5; for(let i=0;i<5;i++){ X.strokeStyle=[P.cyan,P.led,P.ledA][i%3];
      X.lineWidth=1.6; X.beginPath(); X.moveTo(104,252+i*11); X.bezierCurveTo(122,248+i*11,130,268+i*11,148,258+i*11); X.stroke(); }
    X.globalAlpha=1;
    benchDesk(340,300,260,3,true);
    [[254,356],[340,356],[426,356]].forEach(([cx,cy])=>taskChair(cx,cy,P.slateM));
    rack(636,300,52,152,5); rack(700,300,52,152,9);
    X.globalAlpha=.5; r(636,454,116,4,'#12161c'); X.globalAlpha=1;
    box(520,392,80,58,'#2b323c',3);                                        /* spares and a UPS */
    rr(526,398,30,20,2,P.slateL); rr(562,398,30,20,2,P.slateL);
    rr(526,422,66,20,2,'#1b2027'); rr(530,428,8,8,1,P.led);
    tilted(160,392,104,44,0,(x,y,w,h)=>{ rr(x,y,w,h,3,P.slateM);
      vgrad(x,y,w,5,P.slateL,P.slateM); rr(x+16,y+12,30,20,2,P.slateL);
      rr(x+56,y+16,24,14,2,'#1b2027'); });
    taskChair(160,440,P.felt);
    pendant(300,86,'#cfe3ff',P.slateD); pendant(500,86,'#cfe3ff',P.slateD);
    grain(FX,FY,FW,FH,.06);
  }},

breakroom:{
  name:'Kitchen', wall:'#dfe3e7', wallHi:'#edf0f3', wallDk:'#c4cad1', skirt:'#3b444f',
  material:'Pale tile, a counter, an island, and the build on the wall',
  desc:'Pale tile in a small format, a counter with the machine everybody has an opinion about, and an island with six stools. The build screen is on the wall by the kettle, which was deliberate — you cannot make a coffee here without finding out whether main is red.',
  exits:'Up → Reception<br/>Right → Ops',
  doors:[{side:'top',at:400},{side:'right',at:240}],
  floor(){ tileFloor(83,'#d3d7db','#c7ccd1','#9aa1a8',60); },
  draw(){
    counterRun(96,26,290,52);
    ciScreen(470,26,150,52);
    fridge(24,148,56,168);
    island(330,300,220,86);
    [250,330,410].forEach((sx,i)=>stool(sx,242,[P.felt,P.cyan,P.moss][i]));
    [250,330,410].forEach((sx,i)=>stool(sx,364,[P.moss,P.felt,P.cyan][i]));
    pingPong(620,392);
    rr(716,182,42,64,4,P.slateM);                                          /* water cooler */
    rr(722,168,30,20,3,'#bcd4dc');
    rr(724,228,26,8,2,P.slateL);
    pot(700,140,1.15,'clay');
    grain(FX,FY,FW,FH,.05);
  }},

meeting:{
  name:'War Room', wall:'#c4cad1', wallHi:'#d6dbe0', wallDk:'#adb4bc', skirt:'#3b444f',
  material:'Grey carpet tile, one oval table, a screen and a timeline',
  desc:'Grey carpet tile, quiet underfoot. One oval table with eight chairs evenly spaced, a screen at one end and a whiteboard at the other still carrying the timeline from last month — 11:42 flag off, 11:44 recovered — which nobody has wiped because it is the best thing anyone has drawn in here.',
  exits:'Left → Ops<br/>Up → Engineering',
  doors:[{side:'left',at:240},{side:'top',at:400}],
  floor(){ gridCarpet(97,'#9aa1a8','#a3aab1','#848c94'); },
  draw(){
    screenWall(430,26,260,52);
    box(104,26,280,52,'#f3f5f7',2);                                        /* the incident timeline */
    X.strokeStyle='#2f3a46'; X.lineWidth=1.4;
    X.beginPath(); X.moveTo(118,60); X.lineTo(370,60); X.stroke();
    [[142,P.ledR],[196,P.ledR],[248,P.ledA],[302,P.led],[352,P.led]].forEach(([mx,col],i)=>{
      X.fillStyle=col; X.beginPath(); X.arc(mx,60,3.4,0,Math.PI*2); X.fill();
      rr(mx-13,40+(i%2)*9,26,6,1,'#dfe3e7');
      X.strokeStyle='#7d8791'; X.lineWidth=.8;
      X.beginPath(); X.moveTo(mx,46+(i%2)*9); X.lineTo(mx,57); X.stroke();
    });
    box(760,150,20,150,P.glass,2);
    X.globalAlpha=.35; r(762,154,16,142,'#dff0f4'); X.globalAlpha=1;
    ovalTable(400,300,280,120);
    [300,400,500].forEach((cx,i)=>taskChair(cx,214,[P.slateM,P.felt,P.slateM][i]));
    [300,400,500].forEach((cx,i)=>taskChair(cx,392,[P.felt,P.slateM,P.felt][i]));
    taskChair(232,300,P.slateM); taskChair(568,300,P.felt);
    rr(96,378,46,56,3,P.slateM);                                           /* monitor on a trolley */
    rr(100,366,38,22,2,'#1b2027');
    pot(700,400,1.1,'clay');
    pendant(330,104,'#e8eef5',P.slateD); pendant(470,104,'#e8eef5',P.slateD);
    grain(FX,FY,FW,FH,.05);
  }}
};

