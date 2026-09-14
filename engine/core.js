/* Chronicles core — the world model, drawing, movement, dialogue, the floor
   map, the camera and room-to-room travel. Shared by every game: change
   something here and all nine inherit it.
   Loaded before the world and the track, so everything it needs from them is
   read inside functions, never at load time. */
let CFG={};
function applyConfig(){
  const deep=function(a,b){
    const o=Object.assign({},a);
    Object.keys(b||{}).forEach(function(k){
      o[k]=(b[k]&&b[k].constructor===Object)?deep(a[k]||{},b[k]):b[k];
    });
    return o;
  };
  CFG=deep(deep(window.CHRONICLE_DEFAULTS||{},(window.WORLD||{}).config),
           (window.TRACK_CONFIG||{}));
  SPEED=CFG.walkSpeed;
  CELL=CFG.travel.cell;
  TRAVEL_SPEED=SPEED*CFG.travel.speed;
  MAP_GRID=CFG.map.grid;
  MAP_IDS=MAP_GRID.reduce(function(a,r){ return a.concat(r); },[]);
  return CFG;
}

const C=document.getElementById('c');
const LIVE=C.getContext('2d');
let X=LIVE;
const S=2, FX=20, FY=20, FW=760, FH=440, W=800, H=480, WALL=20;
let showTex=true, showSoft=true, showLight=true;
let collisions=[]; const bakeCache={};

const P={
  oak:'#8a6039', oakHi:'#a3764a', oakDk:'#5f4126', oakSeam:'#4a3220',
  conc:'#a8a49c', concHi:'#bab6ae', concDk:'#8d8981', concSpot:'#95918a',
  terr:'#ded6c8', terrDk:'#c9c0b0',
  carpet:'#3f6f6a', carpetHi:'#4d827c', carpetDk:'#2e544f',
  brick:'#8f5340', brickDk:'#6d3d2f', brickMortar:'#c2b3a4',
  wallW:'#e4ded2', wallWDk:'#cdc5b6', wallInk:'#2c2a26',
  ply:'#c9a068', plyHi:'#dcb782', plyDk:'#9d7642',
  steel:'#4d5560', steelHi:'#68717e',
  black:'#22201d', charcoal:'#33302b', slate:'#454039',
  terracotta:'#c46a4a', mustard:'#d8a33c', teal:'#2f7d78', coral:'#e08265',
  sage:'#7d9070', plum:'#6d4a63', cream:'#f2ece0', ink:'#1a1815',
  leafD:'#2f5a3c', leafM:'#3f7a4e', leafL:'#5d9a63',
  paper:'#f6f2e8', paperDk:'#ddd6c6', glass:'#a9c4cc',
  neonP:'#e879b8', neonC:'#5fd4d0', warmLamp:'#ffd9a0'
};

function seeded(s){ let a=s>>>0; return ()=>{ a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
let NOISE=null;
function noiseTile(){ if(NOISE) return NOISE;
  const n=document.createElement('canvas'); n.width=n.height=128;
  const nx=n.getContext('2d'), id=nx.createImageData(128,128), R=seeded(2718);
  for(let i=0;i<id.data.length;i+=4){ const v=115+R()*145;
    id.data[i]=id.data[i+1]=id.data[i+2]=v; id.data[i+3]=255; }
  nx.putImageData(id,0,0); NOISE=nx.canvas; return NOISE; }
function grain(x,y,w,h,a){ if(!showTex) return;
  X.save(); X.beginPath(); X.rect(x,y,w,h); X.clip();
  X.globalCompositeOperation='overlay'; X.globalAlpha=a;
  X.fillStyle=X.createPattern(noiseTile(),'repeat'); X.fillRect(x,y,w,h); X.restore(); }

function r(x,y,w,h,f){ X.fillStyle=f; X.fillRect(x,y,w,h); }
function rr(x,y,w,h,rad,f){ X.fillStyle=f; X.beginPath();
  if(X.roundRect) X.roundRect(x,y,w,h,rad); else X.rect(x,y,w,h); X.fill(); }
function stroke(x,y,w,h,c,lw){ X.strokeStyle=c; X.lineWidth=lw||1; X.strokeRect(x+.5,y+.5,w-1,h-1); }
function vgrad(x,y,w,h,a,b){ const g=X.createLinearGradient(0,y,0,y+h);
  g.addColorStop(0,a); g.addColorStop(1,b); X.fillStyle=g; X.fillRect(x,y,w,h); }
function softShadow(x,y,w,h,spread){
  if(!showSoft){ return; }
  X.save(); X.fillStyle='#000000'; const s=spread||5;
  for(let i=0;i<4;i++){ X.globalAlpha=.16-i*.033;
    X.beginPath();
    if(X.roundRect) X.roundRect(x-i*1.4+3, y+h-2+i*1.6, w+i*2.8, s+i*2, 6); else X.rect(x,y+h,w,s);
    X.fill(); }
  X.restore();
}
function box(x,y,w,h,f,rad){ softShadow(x,y,w,h); rr(x,y,w,h,rad||3,f); collisions.push([x,y,w,h]); }
function noShadowBox(x,y,w,h,f,rad){ rr(x,y,w,h,rad||3,f); collisions.push([x,y,w,h]); }

function tilted(cx,cy,w,h,ang,fn){
  const c=Math.abs(Math.cos(ang)), s=Math.abs(Math.sin(ang));
  const bw=w*c+h*s, bh=w*s+h*c;
  collisions.push([cx-bw/2, cy-bh/2, bw, bh]);
  X.save(); X.translate(cx,cy); X.rotate(ang); fn(-w/2,-h/2,w,h); X.restore();
}

function plankFloor(seed,tone){
  const R=seeded(seed), PH=26;
  r(FX,FY,FW,FH,tone.base);
  X.save(); X.beginPath(); X.rect(FX,FY,FW,FH); X.clip();
  for(let row=0; row<Math.ceil(FH/PH); row++){
    const y=FY+row*PH, off=(row%3)*74;
    let x=FX-off;
    while(x<FX+FW){
      const len=118+Math.floor(R()*70);
      const v=R();
      r(x,y,len-3,PH-2, v>.66?tone.hi : v>.33?tone.base : tone.dk);
      if(showTex){ X.globalAlpha=.14;
        for(let g2=0; g2<7; g2++){ X.strokeStyle=R()>.5?tone.hi:tone.seam; X.lineWidth=.6;
          const gy=y+2+R()*(PH-5); X.beginPath(); X.moveTo(x+2,gy);
          X.bezierCurveTo(x+len*.3,gy+(R()-.5)*2.4,x+len*.7,gy+(R()-.5)*2.4,x+len-4,gy+(R()-.5)*1.6);
          X.stroke(); }
        X.globalAlpha=1; }
      r(x+len-3,y,3,PH-2,tone.seam);
      x+=len;
    }
    r(FX,y+PH-2,FW,2,tone.seam);
  }
  X.restore(); grain(FX,FY,FW,FH,.13);
}
function concreteFloor(seed){
  const R=seeded(seed);
  r(FX,FY,FW,FH,P.conc);
  X.save(); X.beginPath(); X.rect(FX,FY,FW,FH); X.clip();
  for(let i=0;i<58;i++){ X.globalAlpha=.10+R()*.16;
    X.fillStyle=R()>.5?P.concHi:P.concDk;
    X.beginPath(); X.ellipse(FX+R()*FW, FY+R()*FH, 24+R()*70, 18+R()*48, R()*3, 0, Math.PI*2); X.fill(); }
  X.globalAlpha=1;
  if(showTex){ for(let i=0;i<220;i++){ X.globalAlpha=.14+R()*.2;
      X.fillStyle=R()>.5?'#ffffff':P.concDk;
      X.fillRect(FX+R()*FW, FY+R()*FH, 1+R()*2, 1+R()*1.6); } X.globalAlpha=1; }
  X.globalAlpha=.35; X.strokeStyle=P.concDk; X.lineWidth=1.4; X.beginPath();
  X.moveTo(FX+250,FY); X.lineTo(FX+250,FY+FH); X.moveTo(FX+520,FY); X.lineTo(FX+520,FY+FH);
  X.moveTo(FX,FY+230); X.lineTo(FX+FW,FY+230); X.stroke(); X.globalAlpha=1;
  X.restore(); grain(FX,FY,FW,FH,.11);
}
function terrazzoFloor(seed){
  const R=seeded(seed);
  r(FX,FY,FW,FH,P.terr);
  X.save(); X.beginPath(); X.rect(FX,FY,FW,FH); X.clip();
  if(showTex){
    const chips=[P.terracotta,P.mustard,P.teal,P.slate,P.coral,P.sage,'#ffffff',P.plum];
    for(let i=0;i<1500;i++){
      X.globalAlpha=.42+R()*.4; X.fillStyle=chips[Math.floor(R()*chips.length)];
      const cx=FX+R()*FW, cy=FY+R()*FH, s=1.4+R()*4.4;
      X.beginPath(); X.ellipse(cx,cy,s,s*(.55+R()*.6),R()*3,0,Math.PI*2); X.fill();
    }
    X.globalAlpha=1;
  }
  X.globalAlpha=.28; X.strokeStyle=P.terrDk; X.lineWidth=1.2; X.beginPath();
  for(let x=FX+190;x<FX+FW;x+=190){ X.moveTo(x,FY); X.lineTo(x,FY+FH); }
  X.moveTo(FX,FY+220); X.lineTo(FX+FW,FY+220); X.stroke(); X.globalAlpha=1;
  X.restore(); grain(FX,FY,FW,FH,.09);
}
function carpetFloor(seed,col,hi,dk){
  const R=seeded(seed), T=48;
  r(FX,FY,FW,FH,col);
  X.save(); X.beginPath(); X.rect(FX,FY,FW,FH); X.clip();
  for(let i=0;i<Math.ceil(FW/T);i++) for(let j=0;j<Math.ceil(FH/T);j++){
    if((i+j)%2===0){ X.globalAlpha=.42; r(FX+i*T,FY+j*T,T,T,hi); X.globalAlpha=1; } }
  if(showTex){ X.globalAlpha=.06;
    for(let i=0;i<FH/2;i++){ X.strokeStyle=R()>.5?hi:dk;
      const y=FY+i*2+R(); X.beginPath(); X.moveTo(FX,y); X.lineTo(FX+FW,y); X.stroke(); }
    X.globalAlpha=1; }
  X.globalAlpha=.22; X.strokeStyle=dk; X.lineWidth=1; X.beginPath();
  for(let i=1;i<FW/T;i++){ X.moveTo(FX+i*T+.5,FY); X.lineTo(FX+i*T+.5,FY+FH); }
  for(let j=1;j<FH/T;j++){ X.moveTo(FX,FY+j*T+.5); X.lineTo(FX+FW,FY+j*T+.5); }
  X.stroke(); X.globalAlpha=1;
  X.restore(); grain(FX,FY,FW,FH,.12);
}
function tileFloor(seed,base,alt,grout,size){
  const R=seeded(seed), T=size||95;
  r(FX,FY,FW,FH,base);
  X.save(); X.beginPath(); X.rect(FX,FY,FW,FH); X.clip();
  for(let i=0;i<Math.ceil(FW/T);i++) for(let j=0;j<Math.ceil(FH/T);j++){
    const v=R(); if(v>.5){ X.globalAlpha=.45+v*.3; r(FX+i*T,FY+j*T,T,T,alt); X.globalAlpha=1; }
    if(showTex){ X.globalAlpha=.10; X.strokeStyle=v>.5?'#ffffff':grout; X.lineWidth=.7;
      for(let k=0;k<3;k++){ let vx=FX+i*T+R()*T, vy=FY+j*T+R()*T;
        X.beginPath(); X.moveTo(vx,vy);
        for(let m=0;m<4;m++){ vx+=(R()-.35)*T*.4; vy+=(R()-.5)*T*.3; X.lineTo(vx,vy); }
        X.stroke(); }
      X.globalAlpha=1; }
  }
  X.globalAlpha=.5; X.strokeStyle=grout; X.lineWidth=1.6; X.beginPath();
  for(let i=1;i<Math.ceil(FW/T);i++){ X.moveTo(FX+i*T+.5,FY); X.lineTo(FX+i*T+.5,FY+FH); }
  for(let j=1;j<Math.ceil(FH/T);j++){ X.moveTo(FX,FY+j*T+.5); X.lineTo(FX+FW,FY+j*T+.5); }
  X.stroke(); X.globalAlpha=1;
  X.restore(); grain(FX,FY,FW,FH,.09);
}
function screedFloor(seed,base,hi,dk){
  const R=seeded(seed);
  r(FX,FY,FW,FH,base);
  X.save(); X.beginPath(); X.rect(FX,FY,FW,FH); X.clip();
  for(let i=0;i<44;i++){ X.globalAlpha=.07+R()*.11; X.fillStyle=R()>.5?hi:dk;
    X.beginPath(); X.ellipse(FX+R()*FW,FY+R()*FH,60+R()*120,44+R()*90,R()*3,0,Math.PI*2); X.fill(); }
  X.globalAlpha=1;
  if(showTex){ for(let i=0;i<340;i++){ X.globalAlpha=.08+R()*.13;
    X.fillStyle=R()>.5?'#ffffff':dk;
    X.fillRect(FX+R()*FW,FY+R()*FH,1+R()*1.6,1+R()*1.3); } X.globalAlpha=1; }
  X.restore(); grain(FX,FY,FW,FH,.10);
}
function areaRug(x,y,w,h,a,b,c2,seed){
  softShadow(x,y,w,h,3);
  rr(x,y,w,h,4,a);
  const R=seeded(seed);
  X.save(); X.beginPath(); if(X.roundRect) X.roundRect(x,y,w,h,4); else X.rect(x,y,w,h); X.clip();
  for(let i=0;i<9;i++){ X.globalAlpha=.5+R()*.4; X.fillStyle=i%2?b:c2;
    const bw=w/9; r(x+i*bw, y, bw*.62, h, i%2?b:c2); }
  X.globalAlpha=1;
  r(x,y,w,5,b); r(x,y+h-5,w,5,b);
  X.restore(); grain(x,y,w,h,.17);
}
function pendant(cx,cy,col,shadeCol){
  if(showLight){ X.save(); X.globalCompositeOperation='lighter'; X.globalAlpha=.22;
    const g=X.createRadialGradient(cx,cy+40,0,cx,cy+40,150);
    g.addColorStop(0,col); g.addColorStop(.5,col+'44'); g.addColorStop(1,col+'00');
    X.fillStyle=g; X.save(); X.translate(cx,cy+40); X.scale(1,.72);
    X.beginPath(); X.arc(0,0,150,0,Math.PI*2); X.fill(); X.restore(); X.restore(); }
  X.strokeStyle=P.charcoal; X.lineWidth=1.4;
  X.beginPath(); X.moveTo(cx,FY); X.lineTo(cx,cy-9); X.stroke();
  X.fillStyle=shadeCol||P.charcoal; X.beginPath();
  X.moveTo(cx-15,cy+7); X.lineTo(cx+15,cy+7); X.lineTo(cx+7,cy-9); X.lineTo(cx-7,cy-9);
  X.closePath(); X.fill();
  X.fillStyle=col; X.globalAlpha=.9;
  X.beginPath(); X.ellipse(cx,cy+7,15,4,0,0,Math.PI*2); X.fill(); X.globalAlpha=1;
}
function pot(cx,cy,size,kind){
  const s=size||1;
  softShadow(cx-13*s,cy-12*s,26*s,24*s,4);
  collisions.push([cx-13*s,cy-12*s,26*s,24*s]);
  X.fillStyle=kind==='clay'?P.terracotta:P.cream;
  X.beginPath(); X.moveTo(cx-12*s,cy-12*s); X.lineTo(cx+12*s,cy-12*s);
  X.lineTo(cx+9*s,cy+12*s); X.lineTo(cx-9*s,cy+12*s); X.closePath(); X.fill();
  X.globalAlpha=.25; r(cx-12*s,cy-12*s,24*s,4*s,'#000000'); X.globalAlpha=1;
  const R=seeded(cx+cy);
  for(let i=0;i<9;i++){
    const a=(i/9)*Math.PI*2+R(), d=(9+R()*15)*s;
    X.fillStyle=[P.leafD,P.leafM,P.leafL][i%3];
    X.beginPath();
    X.ellipse(cx+Math.cos(a)*d*.9, cy-16*s+Math.sin(a)*d*.55, (7+R()*5)*s, (4.5+R()*3)*s, a, 0, Math.PI*2);
    X.fill();
  }
}
function deskAngled(cx,cy,ang,col,mon){
  tilted(cx,cy,104,58,0,(x,y,w,h)=>{
    X.save(); X.globalAlpha=.2; X.fillStyle='#000000';
    if(X.roundRect){X.beginPath();X.roundRect(x+2,y+h-2,w,7,5);X.fill();} X.restore();
    rr(x,y,w,h,4,col); vgrad(x,y,w,6,P.plyHi,col);
    for(let i=0;i<(mon||2);i++){
      const mx=x+w/2-((mon||2)*15)/2+i*15+1;
      rr(mx,y+9,13,10,1.5,P.charcoal); rr(mx+1.4,y+10.4,10.2,7.2,1,'#2c3a4a');
    }
    rr(x+7,y+h-16,20,9,2,P.paper);
  });
}
function chairSoft(cx,cy,ang,col){
  tilted(cx,cy,28,26,0,(x,y,w,h)=>{
    X.save(); X.globalAlpha=.2; X.fillStyle='#000000';
    if(X.roundRect){X.beginPath();X.roundRect(x+2,y+h-3,w-2,6,5);X.fill();} X.restore();
    rr(x,y,w,h,7,col);
    X.globalAlpha=.3; rr(x+3,y+3,w-6,6,4,'#ffffff'); X.globalAlpha=1;
    rr(x,y,w,6,4,col);
  });
}
function brickWall(x,y,w,h,seed){
  r(x,y,w,h,P.brickDk);
  const R=seeded(seed), BH=9, BW=26;
  for(let j=0;j<Math.ceil(h/BH);j++){
    const off=(j%2)*BW/2;
    for(let i=-1;i<Math.ceil(w/BW)+1;i++){
      const bx=x+i*BW+off, by=y+j*BH;
      if(bx+BW<x||bx>x+w) continue;
      const cl=R(); X.fillStyle= cl>.72?'#a3634c' : cl>.4?P.brick : '#7d4736';
      X.fillRect(Math.max(bx,x)+1, by+1, Math.min(BW,x+w-bx)-2, BH-2);
    }
  }
  grain(x,y,w,h,.16);
}
function whiteboard(x,y,w,h,seed){
  box(x,y,w,h,P.paper,3); stroke(x,y,w,h,P.wallWDk,1.5);
  const R=seeded(seed);
  X.lineCap='round';
  for(let i=0;i<16;i++){
    X.strokeStyle=[P.teal,P.terracotta,P.charcoal,P.mustard][Math.floor(R()*4)];
    X.lineWidth=.9+R()*1.1; X.globalAlpha=.72;
    const sx=x+8+R()*(w-24), sy=y+8+R()*(h-16), len=10+R()*36;
    X.beginPath(); X.moveTo(sx,sy); X.lineTo(sx+len,sy+(R()-.5)*3); X.stroke();
  }
  for(let i=0;i<4;i++){ X.strokeStyle=P.charcoal; X.globalAlpha=.55; X.lineWidth=1;
    const sx=x+14+R()*(w-50), sy=y+10+R()*(h-30);
    X.strokeRect(sx,sy,18+R()*16,9+R()*7); }
  X.globalAlpha=1;
}
function moodboard(x,y,w,h,seed){
  box(x,y,w,h,P.ply,2);
  const R=seeded(seed), cols=[P.coral,P.mustard,P.teal,P.sage,P.plum,P.paper,P.terracotta];
  for(let i=0;i<14;i++){
    const cw=15+R()*20, chh=12+R()*15;
    const cx=x+5+R()*(w-cw-10), cy=y+5+R()*(h-chh-10);
    X.save(); X.translate(cx+cw/2,cy+chh/2); X.rotate((R()-.5)*.34);
    X.globalAlpha=.22; X.fillStyle='#000000'; X.fillRect(-cw/2+1.5,-chh/2+2,cw,chh); X.globalAlpha=1;
    X.fillStyle=cols[Math.floor(R()*cols.length)]; X.fillRect(-cw/2,-chh/2,cw,chh);
    X.globalAlpha=.28; X.fillStyle='#ffffff'; X.fillRect(-cw/2,-chh/2,cw,3); X.globalAlpha=1;
    X.restore();
  }
}
function fridge(x,y,w,h){
  softShadow(x,y,w,h,5);
  rr(x,y,w,h,4,'#cfcbc3'); collisions.push([x,y,w,h]);
  if(showTex){ const R=seeded(x+y); X.save(); X.beginPath(); X.rect(x,y,w,h); X.clip();
    for(let i=0;i<w;i++){ X.globalAlpha=.05+R()*.10;
      X.strokeStyle=R()>.5?'#ffffff':'#8d8981';
      X.beginPath(); X.moveTo(x+i+.5,y); X.lineTo(x+i+.5,y+h); X.stroke(); }
    X.restore(); X.globalAlpha=1; }
  vgrad(x,y,w,7,'#e2ded6','#cfcbc3');
  const split=y+Math.round(h*0.63);
  r(x+2,split-2,w-4,4,'#a5a199');
  r(x+2,split-2,w-4,1.4,'#8d8981');
  rr(x+w-10,y+12,4,Math.round(h*0.40),2,'#7b8189');
  rr(x+w-11,y+12,1.6,Math.round(h*0.40),.8,'#aeb4bb');
  rr(x+w-10,split+9,4,Math.round(h*0.22),2,'#7b8189');
  rr(x+w-11,split+9,1.6,Math.round(h*0.22),.8,'#aeb4bb');
  rr(x+5,y+10,20,11,2,'#2a2d33');
  X.globalAlpha=.8; rr(x+7,y+12.5,7,2,1,'#5fd4d0'); rr(x+16,y+12.5,4,2,1,'#5fd4d0');
  rr(x+7,y+16,11,1.6,.8,'#3f4a52'); X.globalAlpha=1;
  rr(x+4,y+h-9,w-8,5,1.5,'#9a968e');
  X.globalAlpha=.35; r(x+3,y+7,2,h-18,'#8d8981'); X.globalAlpha=1;
  const mag=[['#e08265',10,7],['#d8a33c',7,7],['#2f7d78',9,6],['#6d4a63',8,7]];
  mag.forEach((m,i)=>{ const mx=x+7+(i%2)*17, my=y+34+Math.floor(i/2)*13;
    X.globalAlpha=.22; X.fillStyle='#000000'; X.fillRect(mx+1,my+1.5,m[1],m[2]); X.globalAlpha=1;
    rr(mx,my,m[1],m[2],1.5,m[0]); });
  rr(x+7,y+62,24,17,2,'#f6f2e8');
  X.globalAlpha=.55; X.strokeStyle='#b3aa9a'; X.lineWidth=.8;
  for(let i=0;i<3;i++){ X.beginPath(); X.moveTo(x+10,y+67+i*4); X.lineTo(x+27,y+67+i*4); X.stroke(); }
  X.globalAlpha=1;
  rr(x+9,y+88,20,14,1.5,'#7d9070');
  X.globalAlpha=.3; rr(x+11,y+90,16,4,1,'#ffffff'); X.globalAlpha=1;
}
function screenWall(x,y,w,h){
  box(x,y,w,h,P.charcoal,3);
  rr(x+4,y+4,w-8,h-8,2,'#151b24');
  X.globalAlpha=.2; vgrad(x+4,y+4,w-8,(h-8)/2,'#7fa8c4','#151b24'); X.globalAlpha=1;
}
function walls(room){
  r(0,0,W,WALL,room.wall); r(0,H-WALL,W,WALL,room.wallDk||room.wall);
  r(0,0,WALL,H,room.wall); r(W-WALL,0,WALL,H,room.wall);
  if(room.brick){ brickWall(0,0,W,WALL,7); }
  else { vgrad(0,0,W,WALL,room.wallHi||room.wall,room.wall);
    for(let x=54;x<W-54;x+=110) r(x,4,70,WALL-9,room.wallDk||room.wall); }
  r(FX,FY,FW,3,room.skirt); r(FX,FY+FH-3,FW,3,room.skirt);
  r(FX,FY,3,FH,room.skirt); r(FX+FW-3,FY,3,FH,room.skirt);
}
function doorway(d){
  const T=90;
  const put=(x,y,w,h,vert)=>{ r(x,y,w,h,P.charcoal);
    if(vert) r(x,y,3,h,P.doorTrim); else r(x,y,w,3,P.doorTrim); };
  if(d.side==='top'){ put(d.at-T/2,0,T,WALL,false); chev(d.at,WALL+15,0,-1); }
  if(d.side==='bottom'){ put(d.at-T/2,H-WALL,T,WALL,false); chev(d.at,H-WALL-15,0,1); }
  if(d.side==='left'){ put(0,d.at-T/2,WALL,T,true); chev(WALL+15,d.at,-1,0); }
  if(d.side==='right'){ put(W-WALL,d.at-T/2,WALL,T,true); chev(W-WALL-15,d.at,1,0); }
}
function chev(cx,cy,dx,dy){ X.strokeStyle=P.chevron; X.lineWidth=2.2; X.lineCap='round';
  X.beginPath();
  if(dx){ X.moveTo(cx-dx*5,cy-7); X.lineTo(cx+dx*5,cy); X.lineTo(cx-dx*5,cy+7); }
  else  { X.moveTo(cx-7,cy-dy*5); X.lineTo(cx,cy+dy*5); X.lineTo(cx+7,cy-dy*5); }
  X.stroke(); }

function shell(room){ r(0,0,W,H,P.ink); room.floor(); walls(room);
  (room.doors||[]).forEach(doorway); }

/* ==========================================================================
   THE BUILDING — Meridian, floor 3.
   A software company draws nothing like an agency: no rugs, no mood boards,
   no soft furniture arranged for a photograph. Bench desks on a grid, monitor
   arms, cable spines, acoustic panels, a dashboard wall and two racks that
   never stop humming.
   ========================================================================== */




function blinkOpen(t,seed){ const c=(t*0.001+seed)%4.6; return !(c>4.25); }

function hairCut(hx,hy,hr,ch,back,side,sgn){
  X.fillStyle=ch.hair;
  if(ch.cut==='beanie'){
    X.beginPath(); X.arc(hx,hy-1.4,hr+1.5,Math.PI,0); X.fill();
    r(hx-hr-1.5,hy-2.2,hr*2+3,3.4,ch.hair);
    X.fillStyle=ch.hairHi; r(hx-hr-1.5,hy-2.2,hr*2+3,1.3);
    if(!back){ X.fillStyle=ch.hair; r(hx-hr-1,hy+1,hr*2+2,1.6); }
    return;
  }
  if(back){
    X.beginPath(); X.arc(hx,hy,hr+.9,0,Math.PI*2); X.fill();
    if(ch.cut==='long'){ X.beginPath();
      X.moveTo(hx-hr-1,hy-2); X.quadraticCurveTo(hx-hr-2.4,hy+13,hx-hr+1.5,hy+16);
      X.lineTo(hx+hr-1.5,hy+16); X.quadraticCurveTo(hx+hr+2.4,hy+13,hx+hr+1,hy-2);
      X.closePath(); X.fill(); }
    if(ch.cut==='puff'){ for(let i=0;i<7;i++){ const a=Math.PI*2*i/7;
      X.beginPath(); X.arc(hx+Math.cos(a)*hr*.82, hy+Math.sin(a)*hr*.82, hr*.52,0,Math.PI*2); X.fill(); } }
    if(ch.cut==='curls'){ for(let i=0;i<6;i++){ const a=Math.PI*2*i/6;
      X.beginPath(); X.arc(hx+Math.cos(a)*hr*.72, hy+Math.sin(a)*hr*.72, hr*.46,0,Math.PI*2); X.fill(); } }
    return;
  }
  if(ch.cut==='curls'){
    for(let i=0;i<6;i++){ const a=Math.PI+ (Math.PI*i/5);
      X.beginPath(); X.arc(hx+Math.cos(a)*hr*.9, hy-1.2+Math.sin(a)*hr*.9, hr*.5,0,Math.PI*2); X.fill(); }
    X.fillStyle=ch.hairHi; X.globalAlpha=.5;
    X.beginPath(); X.arc(hx-hr*.42,hy-hr*.72,hr*.4,0,Math.PI*2); X.fill(); X.globalAlpha=1;
    return;
  }
  X.beginPath(); X.arc(hx,hy-.8,hr+.7,Math.PI,0); X.fill();
  r(hx-hr-.7,hy-1.7,hr*2+1.4,2.4,ch.hair);
  if(ch.cut==='undercut'){ X.fillStyle=ch.hairHi; X.globalAlpha=.55;
    r(hx-hr-.7,hy-.4,hr*2+1.4,1.6); X.globalAlpha=1; X.fillStyle=ch.hair;
    X.beginPath(); X.moveTo(hx-hr,hy-3.4); X.quadraticCurveTo(hx,hy-hr-3.4,hx+hr-1,hy-4.6);
    X.lineTo(hx+hr-1,hy-2.2); X.lineTo(hx-hr,hy-2.2); X.closePath(); X.fill(); }
  if(ch.cut==='puff'){ for(let i=0;i<5;i++){ const a=Math.PI+(Math.PI*i/4);
    X.beginPath(); X.arc(hx+Math.cos(a)*hr*1.0, hy-1+Math.sin(a)*hr*1.0, hr*.58,0,Math.PI*2); X.fill(); } }
  if(ch.cut==='long'){ X.beginPath();
    X.moveTo(hx-hr-.9,hy-1.5); X.quadraticCurveTo(hx-hr-2.2,hy+12,hx-hr+1.2,hy+15);
    X.lineTo(hx-hr+3.4,hy+15); X.lineTo(hx-hr+2.4,hy-1.5); X.closePath(); X.fill();
    X.beginPath();
    X.moveTo(hx+hr+.9,hy-1.5); X.quadraticCurveTo(hx+hr+2.2,hy+12,hx+hr-1.2,hy+15);
    X.lineTo(hx+hr-3.4,hy+15); X.lineTo(hx+hr-2.4,hy-1.5); X.closePath(); X.fill(); }
  X.fillStyle=ch.hairHi; X.globalAlpha=.42;
  X.beginPath(); X.arc(hx-hr*.38,hy-hr*.62,hr*.42,0,Math.PI*2); X.fill(); X.globalAlpha=1;
}

function carry(x,y,ch,side,sgn){
  const k=ch.prop; if(!k) return;
  const px = side ? x+sgn*10 : x+11, py=y-19;
  if(k==='notebook'){ X.save(); X.translate(px,py+5); X.rotate(-0.2);
    rr(-4.5,-6,9,12,1.5,P.terracotta); rr(-3.2,-4.8,6.4,9.6,1,P.paper);
    r(-3.2,-4.8,6.4,1,P.paperDk); X.restore(); }
  if(k==='tablet'){ X.save(); X.translate(px,py+5); X.rotate(0.24);
    rr(-4.6,-6.4,9.2,12.8,1.6,P.charcoal); rr(-3.4,-5.2,6.8,10.4,1,'#3a5468'); X.restore(); }
  if(k==='camera'){ rr(px-6,py+2,12,8,2,P.charcoal); rr(px-2,py,4,3,1,P.charcoal);
    X.fillStyle='#2c3a4a'; X.beginPath(); X.arc(px,py+6,3,0,Math.PI*2); X.fill();
    X.fillStyle=P.steelHi; X.beginPath(); X.arc(px,py+6,1.4,0,Math.PI*2); X.fill(); }
  if(k==='coffee'){ X.fillStyle=P.cream; X.beginPath();
    X.moveTo(px-3.4,py+3); X.lineTo(px+3.4,py+3); X.lineTo(px+2.4,py+11); X.lineTo(px-2.4,py+11);
    X.closePath(); X.fill(); rr(px-3.6,py+2,7.2,2.2,1,P.terracotta);
    X.globalAlpha=.5; r(px-2.4,py+5.5,4.8,1.4,P.paperDk); X.globalAlpha=1; }
  if(k==='mug'){ rr(px-3.2,py+3,6.4,7.4,1.6,P.mustard);
    X.strokeStyle=P.mustard; X.lineWidth=1.3; X.beginPath();
    X.arc(px+3.8,py+6.4,2.2,-1.1,1.1); X.stroke(); }
}

function person(x,yFeet,key,dir,t,opts){
  const ch=CAST[key]; if(!ch) return;
  const o=opts||{}, sc=(o.scale||1)*(ch.build||1), walking=!!o.walking;
  X.save(); X.translate(x,yFeet); X.scale(sc,sc); X.translate(-x,-yFeet);

  const ph=walking?(o.phase||0):0;
  const stride=walking?Math.sin(ph)*3.3:0, armSw=walking?Math.sin(ph)*2.8:0;
  const gait=walking?Math.abs(Math.sin(ph))*1.2:0;
  const y=yFeet-gait+(walking?0:Math.sin(t*0.0022+x*0.6)*0.75);
  const sway=walking?0:Math.sin(t*0.0014+x*0.4)*0.6;
  const back=dir==='up', side=(dir==='left'||dir==='right'), sgn=dir==='left'?-1:1;
  const bw=side?Math.round(ch.bw*0.72):ch.bw, hr=7, hy=y-40;

  X.save(); X.globalAlpha=.26; X.fillStyle='#000000';
  X.beginPath(); X.ellipse(x,yFeet+1.5,11,3.4,0,0,Math.PI*2); X.fill(); X.restore();

  const lx=x-5.6+sway*.4, rx2=x+0.9+sway*.4;
  rr(lx,y-13+stride*.18,4.9,11.5-Math.abs(stride)*.18,2.2,ch.legs);
  rr(rx2,y-13-stride*.18,4.9,11.5+Math.abs(stride)*.18,2.2,ch.legsDk);
  rr(lx-.9+stride*.5,y-3.2,6.4,3.4,1.7,ch.shoe);
  rr(rx2-.5-stride*.5,y-3.2,6.4,3.4,1.7,ch.shoe);

  const g=X.createLinearGradient(0,y-33,0,y-12);
  g.addColorStop(0,ch.top); g.addColorStop(1,ch.topDk);
  X.fillStyle=g; X.beginPath();
  const sh=ch.style==='hoodie'?3.2:1.8;
  if(X.roundRect) X.roundRect(x-bw/2+sway,y-33,bw,22,[6,6,sh,sh]);
  else X.rect(x-bw/2+sway,y-33,bw,22);
  X.fill();

  if(ch.style==='hoodie'&&!back){ X.fillStyle=ch.topDk;
    X.beginPath(); X.ellipse(x+sway,y-31.5,7.4,3.4,0,0,Math.PI); X.fill();
    X.strokeStyle=P.cream; X.lineWidth=.9;
    X.beginPath(); X.moveTo(x-2.2+sway,y-29); X.lineTo(x-2.6+sway,y-23);
    X.moveTo(x+2.2+sway,y-29); X.lineTo(x+2.6+sway,y-23); X.stroke();
    X.globalAlpha=.4; rr(x-6+sway,y-19,12,5,2,P.ink); X.globalAlpha=1; }
  if(ch.style==='hoodie'&&back){ X.fillStyle=ch.topDk;
    X.beginPath(); X.ellipse(x+sway,y-30.5,8,4.6,0,0,Math.PI*2); X.fill(); }

  if(side){ rr(x+sgn*(bw/2-3)+sway,y-31+armSw*.5,3.2,16,1.8,ch.topDk);
    rr(x+sgn*(bw/2-2.8)+sway,y-15.5+armSw*.5,2.8,2.8,1.4,ch.skin); }
  else { rr(x-bw/2+sway,y-31+armSw,3.4,16.5,1.8,ch.topDk);
    rr(x+bw/2-3.4+sway,y-31-armSw,3.4,16.5,1.8,ch.topDk);
    rr(x-bw/2+.2+sway,y-15+armSw,3,3,1.5,ch.skin);
    rr(x+bw/2-3.2+sway,y-15-armSw,3,3,1.5,ch.skin); }

  if(!back && ch.style!=='hoodie'){
    if(ch.style==='overshirt'||ch.style==='blazer'){
      X.fillStyle=ch.tee; X.beginPath();
      X.moveTo(x-3.2+sway,y-33); X.lineTo(x+3.2+sway,y-33);
      X.lineTo(x+2.6+sway,y-17); X.lineTo(x-2.6+sway,y-17); X.closePath(); X.fill();
      X.fillStyle=ch.topDk;
      X.beginPath(); X.moveTo(x-3.4+sway,y-33); X.lineTo(x-7+sway,y-33);
      X.lineTo(x-4.4+sway,y-20); X.closePath(); X.fill();
      X.beginPath(); X.moveTo(x+3.4+sway,y-33); X.lineTo(x+7+sway,y-33);
      X.lineTo(x+4.4+sway,y-20); X.closePath(); X.fill();
    }
    if(ch.style==='knit'){ X.globalAlpha=.28; X.strokeStyle=P.ink; X.lineWidth=.6;
      for(let i=0;i<5;i++){ X.beginPath(); X.moveTo(x-bw/2+2+sway,y-30+i*4); 
        X.lineTo(x+bw/2-2+sway,y-30+i*4); X.stroke(); } X.globalAlpha=1;
      X.fillStyle=ch.topDk; X.beginPath();
      X.ellipse(x+sway,y-32.4,4.4,2.2,0,0,Math.PI); X.fill(); }
    if(ch.style==='tee'){ X.fillStyle=ch.topDk;
      X.beginPath(); X.ellipse(x+sway,y-32.4,4,2,0,0,Math.PI); X.fill();
      X.globalAlpha=.35; rr(x-4.4+sway,y-27,8.8,7,1.5,P.cream); X.globalAlpha=1; }
  }
  if(back){ X.globalAlpha=.3; X.fillStyle=P.ink;
    r(x-bw/2+2.5+sway,y-32,bw-5,1.4); X.globalAlpha=1; }

  rr(x-2.4+sway*.6,y-35.6,4.8,3.2,1.4,ch.skinDk);
  const hx=x+(side?sgn*.9:0)+sway*.6;
  X.fillStyle=ch.skin; X.beginPath(); X.arc(hx,hy,hr,0,Math.PI*2); X.fill();
  X.globalAlpha=.22; X.fillStyle=ch.skinDk;
  X.beginPath(); X.arc(hx+(side?sgn*2.2:2.6),hy+.8,hr*.74,0,Math.PI*2); X.fill(); X.globalAlpha=1;

  if(!back){
    const open=blinkOpen(t,hx);
    X.fillStyle=ch.hair; X.globalAlpha=.85;
    if(side) rr(hx+sgn*1.5,hy-2.9,2.8,1,.5); 
    else { rr(hx-3.6,hy-2.9,3,1,.5); rr(hx+.6,hy-2.9,3,1,.5); }
    X.globalAlpha=1;
    X.fillStyle='#241f1c';
    if(side){ if(open){ X.beginPath(); X.ellipse(hx+sgn*2.3,hy,.85,1,0,0,Math.PI*2); X.fill(); }
      else rr(hx+sgn*1.6,hy-.1,1.6,.7,.35); }
    else { if(open){ X.beginPath(); X.ellipse(hx-2.1,hy,.85,1,0,0,Math.PI*2); X.fill();
        X.beginPath(); X.ellipse(hx+2.1,hy,.85,1,0,0,Math.PI*2); X.fill(); }
      else { rr(hx-2.9,hy-.1,1.7,.7,.35); rr(hx+1.2,hy-.1,1.7,.7,.35); } }
    X.globalAlpha=.28; X.fillStyle=ch.skinDk;
    if(!side) rr(hx-.5,hy+.7,1.1,1.7,.5); else rr(hx+sgn*3,hy+.7,1.1,1.7,.5);
    X.globalAlpha=1;
    if(ch.beard){ X.fillStyle=ch.hair; X.globalAlpha=.62; X.beginPath();
      X.ellipse(hx+(side?sgn*1:0),hy+3.4,hr*.66,hr*.42,0,0,Math.PI*2); X.fill(); X.globalAlpha=1; }
    X.strokeStyle=ch.skinDk; X.lineWidth=.85; X.globalAlpha=.7; X.beginPath();
    if(side){ X.moveTo(hx+sgn*1.6,hy+3.3); X.lineTo(hx+sgn*3.6,hy+3.3); }
    else { X.moveTo(hx-1.7,hy+3.4); X.lineTo(hx+1.7,hy+3.4); }
    X.stroke(); X.globalAlpha=1;
    if(ch.specs){ X.strokeStyle=P.charcoal; X.lineWidth=.85;
      if(side){ X.beginPath(); X.arc(hx+sgn*2.4,hy-.1,2.3,0,Math.PI*2); X.stroke(); }
      else { X.beginPath(); X.arc(hx-2.2,hy-.1,2.4,0,Math.PI*2); X.stroke();
        X.beginPath(); X.arc(hx+2.2,hy-.1,2.4,0,Math.PI*2); X.stroke();
        X.beginPath(); X.moveTo(hx-.1,hy-.1); X.lineTo(hx+.1,hy-.1); X.stroke(); } }
  }
  hairCut(hx,hy,hr,ch,back,side,sgn);
  X.globalAlpha=.9; rr(x-bw/2+3+sway,y-12.6,bw-6,1.6,.8,ch.accent); X.globalAlpha=1;
  if(!walking) carry(x+sway,y,ch,side,sgn);
  X.restore();
}

/* ==========================================================================
   GAME LAYER
   Everything above this line is the world renderer, unchanged.
   ========================================================================== */

/* Tracks register themselves here; the front end builds its menu from it. */
const TRACK_DEFS={};
let cur='lobby';
const T0=performance.now();

function bakeKey(){ return cur+'|'+(showTex?1:0)+(showSoft?1:0)+(showLight?1:0); }
function baked(){
  const k=bakeKey(); if(bakeCache[k]) return bakeCache[k];
  const off=document.createElement('canvas'); off.width=W*S; off.height=H*S;
  const g=off.getContext('2d'); g.scale(S,S);
  const prev=X; X=g; collisions=[];
  shell(ROOMS[cur]); ROOMS[cur].draw(); X=prev;
  bakeCache[k]={canvas:off,coll:collisions.slice()}; return bakeCache[k];
}


const DOORS={
 lobby:[{side:'right',at:240,to:'servicing',toSide:'left'},
        {side:'bottom',at:400,to:'breakroom',toSide:'top'}],
 servicing:[{side:'left',at:240,to:'lobby',toSide:'right'},
            {side:'right',at:240,to:'creative',toSide:'left'},
            {side:'bottom',at:400,to:'studio',toSide:'top'}],
 creative:[{side:'left',at:240,to:'servicing',toSide:'right'},
           {side:'bottom',at:400,to:'meeting',toSide:'top'}],
 studio:[{side:'left',at:240,to:'breakroom',toSide:'right'},
         {side:'top',at:400,to:'servicing',toSide:'bottom'},
         {side:'right',at:240,to:'meeting',toSide:'left'}],
 breakroom:[{side:'top',at:400,to:'lobby',toSide:'bottom'},
            {side:'right',at:240,to:'studio',toSide:'left'}],
 meeting:[{side:'left',at:240,to:'studio',toSide:'right'},
          {side:'top',at:400,to:'creative',toSide:'bottom'}]
};

const G={
  started:false, room:'lobby', step:'first_brief',
  px:400, py:392, dir:'up', walking:false, phase:0, playerName:'',
  portfolio:[], deadline:0, deadlineEnd:0, bought:false,
  keys:{}, touch:{up:false,down:false,left:false,right:false}
};

/* ---- where everyone is, by step ---------------------------------------- */
/* ---- objectives --------------------------------------------------------- */
/* ---- dialogue ----------------------------------------------------------- */
let DLG=null;
const $=id=>document.getElementById(id);

function say(speaker,text,options){
  cancelTravel();
  DLG={speaker:speaker,text:text,options:options&&options.length?options:[{label:'Continue',go:closeDlg}]};
  paintDlg();
}
function closeDlg(){ DLG=null; paintDlg(); }
function paintDlg(){
  const el=$('dlg');
  if(!DLG){ el.style.display='none'; el.innerHTML=''; return; }
  const ch=CAST[DLG.speaker];
  el.style.display='block';
  el.innerHTML='<div class="who"><span class="dot" style="background:'+(ch?ch.accent:P.chevron)+'"></span>'+
    (ch?ch.name:(ROOMS[G.room]?ROOMS[G.room].name:''))+(ch?' <em>'+ch.role+'</em>':'')+'</div>'+
    '<p>'+DLG.text+'</p><div class="opts"></div>';
  const wrap=el.querySelector('.opts');
  DLG.options.forEach(function(o){
    const b=document.createElement('button');
    b.textContent=o.label; b.onclick=function(){ hideCoach(); o.go(); };
    wrap.appendChild(b);
  });
}

/* Three options, wrong ones explain themselves and ask again.
   The order is shuffled once per challenge, because every correct answer was
   written second and a player would otherwise learn to pick the middle one.
   The shuffle holds across re-asks so the list does not jump about. */
function choose(speaker,intro,opts,onWin){
  const order=opts.slice();
  for(let i=order.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const t=order[i]; order[i]=order[j]; order[j]=t;
  }
  const show=function(txt){
    say(speaker,txt,order.map(function(o){
      return {label:o.label, go:function(){ o.ok?onWin():show(o.note); }};
    }));
  };
  show(intro);
}

function advance(step,speaker,text){
  G.step=step; paintHUD();
  if(text) say(speaker,text); else closeDlg();
}
function filed(title,client,line){
  G.portfolio.push({title:title,client:client,line:line});
  paintHUD();
}

/* ---- the quest machine --------------------------------------------------
   Dispatches to whichever track is loaded. Everything below is the
   copywriting track's script; another track supplies its own.              */
function occupants(room){ return TRACK.occupants(room); }
function talkTo(key){ return TRACK.script(key); }

/* ---- the crisis clock --------------------------------------------------- */
let clockId=null;
function startClock(sec){ G.deadlineEnd=performance.now()+sec*1000; clockRun(); }
function addClock(sec){ G.deadlineEnd+=sec*1000; }
function clockRun(){ if(clockId) return; clockId=setInterval(paintHUD,200); }
function stopClock(){ if(clockId){ clearInterval(clockId); clockId=null; } G.deadlineEnd=0; paintHUD(); }
function clockLeft(){ return G.deadlineEnd?Math.max(0,(G.deadlineEnd-performance.now())/1000):0; }

/* ---- HUD ---------------------------------------------------------------- */
function paintHUD(){
  $('obj').textContent=(TRACK&&TRACK.objectives?TRACK.objectives[G.step]:'')||'';
  $('folioCount').textContent=G.portfolio.length;
  const c=$('clock');
  if(G.deadlineEnd){
    const L=clockLeft();
    c.style.display='block';
    c.textContent=Math.floor(L/60)+':'+String(Math.floor(L%60)).padStart(2,'0');
    c.className=L<=20?'urgent':'';
    if(L<=0&&G.step!=='complete'&&G.deadlineEnd){
      stopClock();
      const tu=TRACK.timeUp||{who:'kate',line:`Time. Go and finish it anyway — we do not stop because the clock did.`};
      say(tu.who,tu.line);
      G.deadlineEnd=0;
    }
  } else c.style.display='none';
}
function openFolio(){
  const el=$('folio');
  el.style.display='flex';
  el.querySelector('.inner').innerHTML='<h3>'+CFG.labels.folio+'</h3>'+
    (G.portfolio.length?G.portfolio.map(function(p){
      return '<div class="pf"><b>'+p.title+'</b><span>'+p.client+'</span><i>'+p.line+'</i></div>';
    }).join(''):'<p class="empty">Nothing filed yet.</p>')+
    '<button id="folioClose">Close</button>';
  $('folioClose').onclick=function(){ el.style.display='none'; };
}

/* ---- movement, collision, doors ----------------------------------------- */
let SPEED=2.1;                      /* set from CFG.walkSpeed */
const FEET_W=15, FEET_H=9;
function blocked(nx,ny,coll){
  const x=nx-FEET_W/2, y=ny-FEET_H;
  for(let i=0;i<coll.length;i++){
    const c=coll[i];
    if(x<c[0]+c[2]&&x+FEET_W>c[0]&&y<c[1]+c[3]&&y+FEET_H>c[1]) return true;
  }
  return false;
}
/* Tested against the clamped position, not the proposed one: a diagonal step is
   only 1.5px and used to fall short of the threshold, so doors would not fire. */
function doorAt(x,y){
  const list=DOORS[G.room]||[];
  for(let i=0;i<list.length;i++){
    const d=list[i];
    if(d.side==='left'  && x<=FX+12      && Math.abs(y-d.at)<38) return d;
    if(d.side==='right' && x>=FX+FW-12   && Math.abs(y-d.at)<38) return d;
    if(d.side==='top'   && y<=FY+30      && Math.abs(x-d.at)<38) return d;
    if(d.side==='bottom'&& y>=FY+FH-8    && Math.abs(x-d.at)<38) return d;
  }
  return null;
}
function enterRoom(to,fromSide){
  G.room=to; cur=to;
  const back=(DOORS[to]||[]).filter(function(d){ return d.side===fromSide; })[0];
  const at=back?back.at:240;
  if(fromSide==='left'){  G.px=FX+40;      G.py=at;         G.dir='right'; }
  if(fromSide==='right'){ G.px=FX+FW-40;   G.py=at;         G.dir='left';  }
  if(fromSide==='top'){   G.px=at;         G.py=FY+52;      G.dir='down';  }
  if(fromSide==='bottom'){G.px=at;         G.py=FY+FH-14;   G.dir='up';    }
}
function step(dt){
  if(!G.started||DLG) { G.walking=false; return; }
  const k=G.keys,t=G.touch;
  let dx=0,dy=0;
  if(k['ArrowUp']||k['w']||t.up) dy-=1;
  if(k['ArrowDown']||k['s']||t.down) dy+=1;
  if(k['ArrowLeft']||k['a']||t.left) dx-=1;
  if(k['ArrowRight']||k['d']||t.right) dx+=1;
  let sp=SPEED, manual=!!(dx||dy);
  if(manual) cancelTravel();       /* a key or the d-pad always wins */
  else if(G.travel){
    const v=travelVector();
    if(v){ dx=v.x; dy=v.y; sp=Math.min(TRAVEL_SPEED,v.d); }
  }
  G.walking=!!(dx||dy);
  if(!G.walking) return;
  if(manual&&dx&&dy){ dx*=0.7071; dy*=0.7071; }  /* travel vectors are already unit */
  if(Math.abs(dx)>Math.abs(dy)) G.dir=dx<0?'left':'right'; else G.dir=dy<0?'up':'down';
  G.phase+=dt*0.013;

  const coll=baked().coll;
  let nx=Math.max(FX+10,Math.min(FX+FW-10,G.px+dx*sp));
  let ny=Math.max(FY+26,Math.min(FY+FH-6,G.py+dy*sp));
  /* If we are somehow already inside geometry, let the player walk out rather
     than wedging them there forever. */
  const stuck=blocked(G.px,G.py,coll);
  if(stuck||!blocked(nx,G.py,coll)) G.px=nx;
  if(stuck||!blocked(G.px,ny,coll)) G.py=ny;

  const d=doorAt(G.px,G.py);
  if(d) enterRoom(d.to,d.toSide);
  travelWatch(dt);
}

/* ---- who is standing next to me ----------------------------------------- */
function nearbyNPC(){
  const list=occupants(G.room);
  let best=null,bd=64;
  for(let i=0;i<list.length;i++){
    const n=list[i], d=Math.hypot(n[1]-G.px,n[2]-G.py);
    if(d<bd){ bd=d; best=n; }
  }
  return best;
}
function interact(){
  if(DLG){
    if(DLG.options.length===1) DLG.options[0].go();
    return;
  }
  const n=nearbyNPC();
  if(n) talkTo(n[0]);
}


/* ---- first-run coaching -------------------------------------------------
   Two things are not obvious on the first run: the objective is at the top,
   and nothing happens until you answer in the dialogue box. Say both, spotlight
   both, and get out of the way at the first tap.                            */
function showCoach(){
  const c=$('coach'); if(!c||!CFG.coach.enabled) return;
  c.innerHTML=CFG.coach.lines.map(function(t,i){
    return '<p><b class="n">'+(i+1)+'</b><span>'+t+'</span></p>';
  }).join('')+'<button id="coachGo" type="button">'+CFG.coach.dismiss+'</button>';
  $('coachGo').onclick=hideCoach;
  c.classList.add('on');
  const row=document.querySelector('.objrow');
  if(row) row.classList.add('spot');
  $('dlg').classList.add('spot');
}
function hideCoach(){
  const c=$('coach'); if(!c||!c.classList.contains('on')) return;
  c.classList.remove('on');
  const row=document.querySelector('.objrow');
  if(row) row.classList.remove('spot');
  $('dlg').classList.remove('spot');
}

/* ---- getting there ------------------------------------------------------
   Tapping a room on the map walks you to it, rather than making you drive the
   d-pad across the whole floor -- which on a phone is most of the work of
   playing. Rooms are routed breadth-first over the door graph; inside each
   room an A* on a coarse grid steers around the furniture so the walk reads as
   a walk; and the last leg finishes beside whoever is standing there, which is
   almost always why the room was tapped. Any key or d-pad press hands control
   straight back to the player.                                              */
let CELL=10, TRAVEL_SPEED=6.3;      /* set from CFG.travel */

function roomRoute(from,to){
  if(from===to) return [];
  const prev={}, seen={}; seen[from]=1;
  const q=[from];
  while(q.length){
    const r=q.shift(), list=DOORS[r]||[];
    for(let i=0;i<list.length;i++){
      const n=list[i].to;
      if(seen[n]) continue;
      seen[n]=1; prev[n]=[r,list[i]];
      if(n===to){
        const hops=[]; let c=to;
        while(c!==from){ hops.unshift(prev[c][1]); c=prev[c][0]; }
        return hops;
      }
      q.push(n);
    }
  }
  return null;
}

/* The point just inside a doorway that doorAt() will accept. */
function doorPoint(d){
  if(d.side==='left')  return {x:FX+10,    y:d.at};
  if(d.side==='right') return {x:FX+FW-10, y:d.at};
  if(d.side==='top')   return {x:d.at,     y:FY+26};
  return {x:d.at, y:FY+FH-6};
}

function clearLine(a,b,coll){
  const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4);
  for(let i=1;i<n;i++){
    if(blocked(a.x+(b.x-a.x)*i/n, a.y+(b.y-a.y)*i/n, coll)) return false;
  }
  return true;
}

/* Drop the grid's staircase corners wherever a straight line will do. */
function smoothPath(pts,coll){
  if(pts.length<3) return pts;
  const out=[pts[0]];
  let i=0;
  while(i<pts.length-1){
    let j=pts.length-1;
    while(j>i+1&&!clearLine(pts[i],pts[j],coll)) j--;
    out.push(pts[j]); i=j;
  }
  return out;
}

function findPath(sx,sy,tx,ty){
  const coll=baked().coll;
  const X0=FX+10, Y0=FY+26, X1=FX+FW-10, Y1=FY+FH-6;
  const cols=Math.floor((X1-X0)/CELL)+1, rows=Math.floor((Y1-Y0)/CELL)+1;
  const wx=function(i){ return X0+i*CELL; }, wy=function(j){ return Y0+j*CELL; };
  const ci=function(x){ return Math.max(0,Math.min(cols-1,Math.round((x-X0)/CELL))); };
  const cj=function(y){ return Math.max(0,Math.min(rows-1,Math.round((y-Y0)/CELL))); };
  const N=cols*rows, free=new Uint8Array(N);
  for(let j=0;j<rows;j++) for(let i=0;i<cols;i++)
    free[j*cols+i]=blocked(wx(i),wy(j),coll)?0:1;

  /* A doorway or a character can sit half inside geometry; start from, and aim
     at, the nearest cell that is actually standable. */
  const nearestFree=function(k){
    if(free[k]) return k;
    const ki=k%cols, kj=(k/cols)|0;
    let best=-1, bd=Infinity;
    for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
      const c=j*cols+i; if(!free[c]) continue;
      const d=(i-ki)*(i-ki)+(j-kj)*(j-kj);
      if(d<bd){ bd=d; best=c; }
    }
    return best;
  };
  const s=nearestFree(cj(sy)*cols+ci(sx)), t=nearestFree(cj(ty)*cols+ci(tx));
  if(s<0||t<0) return null;
  if(s===t) return [{x:tx,y:ty}];

  const g=new Float32Array(N).fill(Infinity);
  const f=new Float32Array(N).fill(Infinity);
  const from=new Int32Array(N).fill(-1);
  const open=[s], inOpen=new Uint8Array(N);
  const ti=t%cols, tj=(t/cols)|0;
  const h=function(k){ return Math.hypot(k%cols-ti, ((k/cols)|0)-tj); };
  g[s]=0; f[s]=h(s); inOpen[s]=1;
  let found=false;
  while(open.length){
    let bi=0;
    for(let i=1;i<open.length;i++) if(f[open[i]]<f[open[bi]]) bi=i;
    const c=open.splice(bi,1)[0]; inOpen[c]=0;
    if(c===t){ found=true; break; }
    const cI=c%cols, cJ=(c/cols)|0;
    for(let dj=-1;dj<=1;dj++) for(let di=-1;di<=1;di++){
      if(!di&&!dj) continue;
      const ni=cI+di, nj=cJ+dj;
      if(ni<0||nj<0||ni>=cols||nj>=rows) continue;
      const nk=nj*cols+ni;
      if(!free[nk]) continue;
      /* no squeezing diagonally between two blocked cells */
      if(di&&dj&&(!free[cJ*cols+ni]||!free[nj*cols+cI])) continue;
      const ng=g[c]+(di&&dj?1.4142:1);
      if(ng<g[nk]){
        g[nk]=ng; f[nk]=ng+h(nk); from[nk]=c;
        if(!inOpen[nk]){ open.push(nk); inOpen[nk]=1; }
      }
    }
  }
  if(!found) return null;
  const pts=[]; let c=t;
  while(c!==-1&&c!==s){ pts.unshift({x:wx(c%cols),y:wy((c/cols)|0)}); c=from[c]; }
  pts.push({x:tx,y:ty});
  return smoothPath(pts,coll);
}

function travelTo(id){
  if(!CFG.travel.enabled||!G.started||DLG||!ROOMS[id]||id===G.room) return;
  G.travel={to:id,path:null,pi:0,room:null,stall:0,tries:0};
  paintMap(true);
}
function cancelTravel(){
  if(!G.travel) return;
  G.travel=null; paintMap(true);
}

/* Where this leg of the journey ends: the next doorway, or -- once we are in
   the room that was tapped -- a spot beside whoever is standing in it. */
function travelGoal(){
  if(G.room===G.travel.to){
    const occ=occupants(G.room)||[];
    if(!occ.length) return null;
    const txt=(TRACK&&TRACK.objectives?TRACK.objectives[G.step]:'')||'';
    let pick=occ[0];
    for(let i=0;i<occ.length;i++){
      const ch=CAST[occ[i][0]];
      if(ch&&ch.name&&txt.indexOf(ch.name)>=0){ pick=occ[i]; break; }
    }
    return {x:pick[1],y:pick[2]+26};
  }
  const hops=roomRoute(G.room,G.travel.to);
  return hops&&hops.length?doorPoint(hops[0]):null;
}

/* A unit vector toward the next waypoint, or null when the journey is over. */
function travelVector(){
  const T=G.travel;
  if(T.room!==G.room){ T.room=G.room; T.path=null; }
  if(!T.path){
    const goal=travelGoal();
    if(!goal){ cancelTravel(); return null; }
    T.path=findPath(G.px,G.py,goal.x,goal.y); T.pi=0;
    if(!T.path||!T.path.length){ cancelTravel(); return null; }
  }
  while(T.pi<T.path.length){
    const w=T.path[T.pi], dx=w.x-G.px, dy=w.y-G.py;
    const d=Math.hypot(dx,dy);
    if(d<0.6){ T.pi++; continue; }
    /* d rides along so the last stride is exact: stopping even 3px short of a
       doorway leaves the player against the wall and doorAt() never fires. */
    return {x:dx/d,y:dy/d,d:d};
  }
  cancelTravel();
  return null;
}

/* Walked into something the path did not know about: replan, then give up
   rather than shuffle on the spot forever. */
function travelWatch(dt){
  const T=G.travel; if(!T) return;
  const moved=Math.hypot(G.px-(T.lx==null?G.px:T.lx), G.py-(T.ly==null?G.py:T.ly));
  T.lx=G.px; T.ly=G.py;
  T.stall=moved<0.4?T.stall+dt:0;
  if(T.stall>800){
    T.stall=0; T.path=null; T.tries++;
    if(T.tries>2) cancelTravel();
  }
}

/* ---- camera -------------------------------------------------------------
   The room is 800x480 world units drawn into a fixed 1600x960 canvas that CSS
   stretches to the column width. On a phone that lands at roughly 0.45 CSS px
   per world unit, which renders a 9px nameplate at about 4px -- unreadable.
   So on a narrow viewport we zoom in and follow the player, and size the
   nameplate from the resulting scale so it never falls below ~10 CSS px. At
   desktop widths the zoom resolves to 1 and the frame is drawn exactly as it
   always was.                                                               */
function camZoom(cssW){
  const K=CFG.camera, span=K.fullWidth-K.minWidth, rise=K.maxZoom-1;
  if(!cssW||cssW>=K.fullWidth) return 1;
  if(cssW<=K.minWidth) return K.maxZoom;
  return 1+(K.fullWidth-cssW)*rise/span;
}
function camera(){
  const cssW=C.getBoundingClientRect().width||W*S;
  const z=camZoom(cssW), vw=W/z, vh=H/z;
  const clamp=function(v,lo,hi){ return v<lo?lo:(v>hi?hi:v); };
  return {
    z:z,
    x:clamp(G.px-vw/2,0,Math.max(0,W-vw)),
    y:clamp(G.py-vh/2,0,Math.max(0,H-vh)),
    /* nameplate in world units, sized to land near CFG's target once zoomed.
       Unzoomed it stays at the minimum, so desktop is untouched. */
    nf:z===1?CFG.nameplate.min
            :clamp(CFG.nameplate.targetCssPx/((cssW*z)/W),CFG.nameplate.min,CFG.nameplate.max)
  };
}

/* ---- floor map ----------------------------------------------------------
   Every orthogonal neighbour in this grid is a real door, so the grid is the
   map. The goal cell is worked out from the objective line: find a character
   it names and show the room they are standing in, falling back to a room it
   names outright. Nothing per-track to keep in step with the script.        */
let MAP_GRID=[], MAP_IDS=[];        /* set from CFG.map.grid */

function goalRoom(){
  const txt=(TRACK&&TRACK.objectives?TRACK.objectives[G.step]:'')||'';
  if(!txt) return null;
  for(let i=0;i<MAP_IDS.length;i++){
    const occ=occupants(MAP_IDS[i])||[];
    for(let j=0;j<occ.length;j++){
      const ch=CAST[occ[j][0]];
      if(ch&&ch.name&&txt.indexOf(ch.name)>=0) return MAP_IDS[i];
    }
  }
  for(let i=0;i<MAP_IDS.length;i++){
    const nm=ROOMS[MAP_IDS[i]]&&ROOMS[MAP_IDS[i]].name;
    if(nm&&txt.indexOf(nm)>=0) return MAP_IDS[i];
  }
  return null;
}

let mapKey='';
function paintMap(force){
  if(!CFG.map.enabled){ $('map').style.display='none'; return; }
  const goal=goalRoom(), k=G.room+'|'+goal+'|'+(G.travel?G.travel.to:'');
  if(!force&&k===mapKey) return;
  mapKey=k;
  $('map').innerHTML=MAP_GRID.map(function(row){
    return row.map(function(id){
      const cls='mcell'+(id===G.room?' here':'')+(id===goal?' goal':'')
        +(G.travel&&G.travel.to===id?' going':'');
      const nm=(ROOMS[id]&&ROOMS[id].name)||id;
      return '<button type="button" class="'+cls+'" data-room="'+id+'">'+nm+'</button>';
    }).join('');
  }).join('');
}

/* ---- frame -------------------------------------------------------------- */
let last=performance.now();
function frame(){
  const now=performance.now(), dt=Math.min(40,now-last); last=now;
  const t=now-T0;
  cur=G.room;
  step(dt);

  const b=baked(), cam=camera();
  X=LIVE; X.setTransform(1,0,0,1,0,0); X.clearRect(0,0,C.width,C.height);
  X.scale(cam.z,cam.z); X.translate(-cam.x*S,-cam.y*S);
  X.drawImage(b.canvas,0,0); X.scale(S,S);
  paintMap();

  const cast=occupants(G.room).map(function(n){ return {k:n[0],x:n[1],y:n[2],dir:n[3]}; });
  cast.push({k:'player',x:G.px,y:G.py,dir:G.dir,me:true});
  cast.sort(function(a,c){ return a.y-c.y; });

  const near=nearbyNPC();
  cast.forEach(function(n){
    person(n.x,n.y,n.k,n.dir,t,n.me?{walking:G.walking,phase:G.phase}:{});
    if(n.me) return;
    const ch=CAST[n.k], nf=cam.nf, k=nf/9;
    X.font='500 '+nf.toFixed(1)+'px "DM Sans", Inter, sans-serif'; X.textAlign='center';
    const w=X.measureText(ch.name).width+12*k, h=12*k;
    X.globalAlpha=.85; rr(n.x-w/2,n.y+6,w,h,3*k,'#1a1815'); X.globalAlpha=1;
    rr(n.x-w/2,n.y+6,2.5*k,h,1,ch.accent);
    X.fillStyle='#f2ece0'; X.fillText(ch.name,n.x+1.2,n.y+6+9*k);
    if(near&&near[0]===n.k&&!DLG){
      X.globalAlpha=.92; rr(n.x-9*k,n.y-62,18*k,16*k,4*k,P.mustard); X.globalAlpha=1;
      X.fillStyle='#1a1815'; X.font='600 '+(10*k).toFixed(1)+'px "Space Grotesk", sans-serif';
      X.fillText('E',n.x,n.y-62+11.5*k);
    }
    X.textAlign='left';
  });

  requestAnimationFrame(frame);
}

/* ---- input -------------------------------------------------------------- */
document.addEventListener('keydown',function(e){
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  G.keys[k]=true;
  if(k==='e'||k===' '||k==='Enter'){ e.preventDefault(); interact(); }
  if(k==='p'){ openFolio(); }
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key)>=0) e.preventDefault();
});
document.addEventListener('keyup',function(e){
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  G.keys[k]=false;
});
['up','down','left','right'].forEach(function(d){
  const el=$('t_'+d); if(!el) return;
  const on=function(e){ e.preventDefault(); G.touch[d]=true; };
  const off=function(e){ e.preventDefault(); G.touch[d]=false; };
  el.addEventListener('touchstart',on); el.addEventListener('touchend',off);
  el.addEventListener('touchcancel',off);
  el.addEventListener('mousedown',on); el.addEventListener('mouseup',off);
  el.addEventListener('mouseleave',off);
});
$('t_act').addEventListener('click',function(e){ e.preventDefault(); interact(); });
$('folioBtn').onclick=openFolio;
$('map').addEventListener('click',function(e){
  const b=e.target.closest('.mcell');
  if(b) travelTo(b.getAttribute('data-room'));
});

/* boot happens at the end of the front end, once TRACK exists */

/* debug handle — lets you inspect or jump state from the console */
/* ROOMS and CAST arrive with the world and the track, which load after
   this file, so the handle reaches them through getters rather than binding
   values that do not exist yet. */
window.CC={ G:G, DOORS:DOORS, occupants:occupants,
  get ROOMS(){ return ROOMS; }, get CAST(){ return CAST; },
  interact:interact, move:step, talkTo:talkTo, dlg:function(){ return DLG; },
  jump:function(s){ G.step=s; paintHUD(); closeDlg(); } };
window.CC.blocked=blocked;
window.CC.coll=function(){ return baked().coll; };


