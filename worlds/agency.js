/* World: The agency — six rooms, one staircase, a lot of paper.
   A world owns the rooms, the furniture that paints them, and the colourway.
   Its `config` overrides engine/defaults.js for every track set here — so a
   change in this file reaches the four agency games and no others. */
window.WORLD={
  id:'agency',
  theme:{
    '--bg':'#141210',
    '--ink':'#f2ece0',
    '--mute':'#9a9285',
    '--line':'#3d352c',
    '--panel':'#211d19',
    '--onAccent':'#1a1815',
    '--accent':'#d8a33c',
    '--warn':'#e08265',
    '--panel2':'#1c1916',
    '--ink2':'#e7e0d2',
    '--line2':'#282320',
    '--mute2':'#6a655c',
    '--panel3':'#241f19',
    '--ink3':'#c8c1b3',
    '--paper':'#f2ece0',
    '--veil':'rgba(15,13,11,.93)'
  },
  config:{
    labels:{"folio": "Portfolio", "floor": "Agency floor"}
  },
  /* Applied once the engine palette exists. */
  paint:function(){
    Object.assign(P,{ chevron:P.mustard, doorTrim:P.ply });
  }
};


const ROOMS={
lobby:{
  name:'Lobby', wall:'#e4ded2', wallHi:'#efe9dd', wallDk:'#cdc5b6', skirt:'#3a352d',
  material:'Large-format porcelain tile, plywood reception block, daylight',
  desc:'Pale porcelain in large squares, laid true. A plywood reception block centred on the room, and one seating group set square to the wall. Two plants, one shelf, nothing else.',
  exits:'Right → Servicing<br/>Down → Break Room',
  doors:[{side:'right',at:240},{side:'bottom',at:400}],
  floor(){ tileFloor(31,'#ded8cc','#d2ccbf','#a89f8f',95); },
  draw(){
    tilted(400,152,180,66,0,(x,y,w,h)=>{
      X.save(); X.globalAlpha=.2; X.fillStyle='#000000';
      if(X.roundRect){X.beginPath();X.roundRect(x+2,y+h-2,w,8,5);X.fill();} X.restore();
      rr(x,y,w,h,4,P.ply); vgrad(x,y,w,8,P.plyHi,P.ply);
      rr(x+14,y+h-22,w-28,15,3,P.plyDk);
      rr(x+w-46,y+13,30,15,2,P.charcoal);
    });
    chairSoft(400,100,0,P.teal);
    areaRug(505,238,190,170,P.terracotta,P.cream,P.coral,9);
    tilted(600,270,150,42,0,(x,y,w,h)=>{ rr(x,y,w,h,10,P.plum);
      X.globalAlpha=.26; rr(x+6,y+4,w-12,9,5,'#ffffff'); X.globalAlpha=1; });
    tilted(600,376,150,42,0,(x,y,w,h)=>{ rr(x,y,w,h,10,P.sage);
      X.globalAlpha=.26; rr(x+6,y+4,w-12,9,5,'#ffffff'); X.globalAlpha=1; });
    tilted(600,323,80,40,0,(x,y,w,h)=>{ rr(x,y,w,h,4,P.oak); vgrad(x,y,w,5,P.oakHi,P.oak);
      rr(x+16,y+11,30,18,2,P.paper); });
    pot(120,150,1.15,'clay'); pot(120,340,1.15,'cream');
    box(24,240,16,120,P.ply,2);
    for(let i=0;i<4;i++) rr(27,248+i*29,10,19,1,[P.mustard,P.teal,P.coral,P.plum][i]);
  }},

creative:{
  name:'Creative', wall:'#8f5340', brick:true, wallDk:'#6d3d2f', skirt:'#4a3220',
  material:'Poured microcement, exposed brick, whiteboard wall',
  desc:'Seamless poured microcement — no planks, no grid, nothing to fight the brick. Four identical desks in a true two-by-two on a single rug, whiteboard and mood board hung level with each other, two plants.',
  exits:'Left → Servicing<br/>Down → Meeting Room',
  doors:[{side:'left',at:240},{side:'bottom',at:400}],
  floor(){ screedFloor(47,'#b9b0a2','#cbc3b6','#968d80'); },
  draw(){
    whiteboard(150,26,250,52,13);
    moodboard(430,26,250,52,21);
    areaRug(220,150,360,258,P.teal,P.cream,P.mustard,5);
    [[300,190],[500,190],[300,320],[500,320]].forEach(([dx,dy])=>deskAngled(dx,dy,0,P.ply,2));
    [[300,246],[500,246],[300,376],[500,376]].forEach(([cx,cy],i)=>
      chairSoft(cx,cy,0,[P.coral,P.mustard,P.sage,P.plum][i]));
    pot(120,150,1.15,'clay'); pot(120,340,1.15,'cream');
    box(696,190,60,120,P.ply,3);
    for(let i=0;i<3;i++){ rr(702,198+i*38,48,28,2,P.paperDk);
      for(let k=0;k<4;k++) rr(705+k*11,202+i*38,8,20,1,[P.coral,P.teal,P.mustard,P.plum][k]); }
    pendant(300,104,P.warmLamp,P.mustard); pendant(500,104,P.warmLamp,P.coral);
  }},

servicing:{
  name:'Servicing', wall:'#e4ded2', wallHi:'#efe9dd', wallDk:'#cdc5b6', skirt:'#2e544f',
  material:'Teal carpet tile, laminate desks, wall planner',
  desc:'Carpet tile in a colour somebody chose on purpose, three identical desks in one straight row, the quarter on the wall behind them and the client logos beside it. One sofa, two plants.',
  exits:'Left → Lobby<br/>Right → Creative<br/>Down → Studio',
  doors:[{side:'left',at:240},{side:'right',at:240},{side:'bottom',at:400}],
  floor(){ carpetFloor(59,P.carpet,P.carpetHi,P.carpetDk); },
  draw(){
    box(110,26,320,50,P.paper,2);
    X.globalAlpha=.5; X.strokeStyle=P.wallWDk; X.lineWidth=1;
    for(let i=1;i<12;i++){ X.beginPath(); X.moveTo(110+i*26,28); X.lineTo(110+i*26,74); X.stroke(); }
    X.globalAlpha=1;
    const R=seeded(3);
    for(let i=0;i<14;i++){ const bx=114+Math.floor(R()*10)*26, by=32+Math.floor(R()*3)*14;
      rr(bx,by,22+Math.floor(R()*24),9,2,[P.teal,P.coral,P.mustard,P.plum][i%4]); }
    box(470,26,210,50,P.wallWDk,2);
    for(let i=0;i<8;i++) rr(478+(i%4)*51,32+Math.floor(i/4)*20,42,15,3,
      [P.slate,P.teal,P.terracotta,P.plum][i%4]);
    [[200,190],[400,190],[600,190]].forEach(([dx,dy])=>deskAngled(dx,dy,0,P.paperDk,2));
    [[200,246],[400,246],[600,246]].forEach(([cx,cy],i)=>
      chairSoft(cx,cy,0,[P.coral,P.teal,P.mustard][i]));
    tilted(400,340,170,48,0,(x,y,w,h)=>{ rr(x,y,w,h,10,P.terracotta);
      X.globalAlpha=.26; rr(x+6,y+4,w-12,9,5,'#ffffff'); X.globalAlpha=1; });
    pot(100,340,1.1,'cream'); pot(700,340,1.1,'clay');
  }},

studio:{
  name:'Studio', wall:'#33302b', wallHi:'#454039', wallDk:'#22201d', skirt:'#1a1815',
  material:'Polished concrete, seamless backdrop, edit bays',
  desc:'Polished concrete with straight pour lines, a seamless backdrop squared into the corner with two softboxes level either side, two matching edit bays, and the flight cases stacked in one column. The darkest room, on purpose.',
  exits:'Left → Break Room<br/>Up → Servicing<br/>Right → Meeting Room',
  doors:[{side:'left',at:240},{side:'top',at:400},{side:'right',at:240}],
  floor(){ concreteFloor(71); },
  draw(){
    box(100,290,200,120,P.cream,2);
    X.globalAlpha=.35; vgrad(100,290,200,44,P.wallWDk,P.cream); X.globalAlpha=1;
    [[140,268],[260,268]].forEach(([sx,sy])=>{
      collisions.push([sx-17,sy-17,34,34]);
      X.strokeStyle=P.steel; X.lineWidth=2.4;
      X.beginPath(); X.moveTo(sx,sy); X.lineTo(sx-12,sy+18); X.moveTo(sx,sy); X.lineTo(sx+12,sy+18);
      X.moveTo(sx,sy); X.lineTo(sx,sy+20); X.stroke();
      X.fillStyle=P.steelHi; X.beginPath();
      X.moveTo(sx-16,sy-14); X.lineTo(sx+16,sy-14); X.lineTo(sx+10,sy+2); X.lineTo(sx-10,sy+2);
      X.closePath(); X.fill();
      if(showLight){ X.save(); X.globalCompositeOperation='lighter'; X.globalAlpha=.16;
        const g=X.createRadialGradient(sx,sy+30,0,sx,sy+30,110);
        g.addColorStop(0,'#ffffff'); g.addColorStop(1,'#ffffff00'); X.fillStyle=g;
        X.beginPath(); X.arc(sx,sy+30,110,0,Math.PI*2); X.fill(); X.restore(); }
      rr(sx-13,sy-12,26,4,1,'#f8f4ea');
    });
    [[460,300],[620,300]].forEach(([dx,dy])=>{
      tilted(dx,dy,132,58,0,(x,y,w,h)=>{ rr(x,y,w,h,3,P.charcoal); vgrad(x,y,w,5,P.slate,P.charcoal);
        rr(x+12,y+8,52,26,2,'#10151d'); rr(x+70,y+8,50,26,2,'#10151d');
        X.globalAlpha=.22; vgrad(x+12,y+8,52,13,'#7fa8c4','#10151d');
        vgrad(x+70,y+8,50,13,'#7fa8c4','#10151d'); X.globalAlpha=1;
        rr(x+24,y+h-14,84,8,2,P.slate); });
      chairSoft(dx,dy+58,0,P.slate);
    });
    for(let i=0;i<3;i++){ box(614,78+i*54,82,46,i%2?P.slate:P.charcoal,3);
      rr(622,86+i*54,22,8,2,P.mustard); }
    box(100,86,150,52,P.charcoal,3);
    for(let i=0;i<5;i++) rr(108+i*28,94,22,36,2,P.slate);
    pendant(300,88,'#cfe3ff',P.slate); pendant(560,88,'#cfe3ff',P.slate);
  }},

breakroom:{
  name:'Break Room', wall:'#e4ded2', wallHi:'#efe9dd', wallDk:'#cdc5b6', skirt:'#3a352d',
  material:'Pale ceramic tile, oak communal table, full-height fridge',
  desc:'Pale ceramic tile in a smaller format than the lobby, one long oak table on bare floor, eight stools evenly spaced, and a full-height fridge that has been here longer than anyone in the building. Daylight only.',
  exits:'Up → Lobby<br/>Right → Studio',
  doors:[{side:'top',at:400},{side:'right',at:240}],
  floor(){ tileFloor(83,'#c9cdc3','#bdc2b7','#8f948a',60); },
  draw(){
    box(110,26,230,52,P.oak,3); vgrad(110,26,230,7,P.oakHi,P.oak);
    box(140,32,46,38,P.steel,3); rr(146,38,34,16,2,'#191d24'); rr(156,60,16,6,1,P.steelHi);
    box(210,36,40,32,P.charcoal,3); rr(216,42,28,10,1,'#12161c');
    fridge(24,148,56,168);
    tilted(400,254,240,86,0,(x,y,w,h)=>{
      X.save(); X.globalAlpha=.22; X.fillStyle='#000000';
      if(X.roundRect){X.beginPath();X.roundRect(x+3,y+h-2,w,9,6);X.fill();} X.restore();
      rr(x,y,w,h,5,P.oak); vgrad(x,y,w,8,P.oakHi,P.oak);
      X.globalAlpha=.5; for(let i=1;i<5;i++){ r(x+i*(w/5),y,2,h,P.oakSeam); } X.globalAlpha=1;
      rr(x+26,y+31,30,24,3,P.cream); rr(x+w-58,y+31,26,20,3,P.coral);
    });
    [310,370,430,490].forEach((sx,i)=>{
      collisions.push([sx-13,196-11,26,22]);
      X.save(); X.globalAlpha=.2; X.fillStyle='#000000';
      X.beginPath(); X.ellipse(sx,207,13,4,0,0,Math.PI*2); X.fill(); X.restore();
      X.fillStyle=[P.teal,P.coral,P.plum,P.sage][i];
      X.beginPath(); X.ellipse(sx,196,13,10,0,0,Math.PI*2); X.fill();
      X.globalAlpha=.3; X.fillStyle='#ffffff';
      X.beginPath(); X.ellipse(sx-3,193,6,4,0,0,Math.PI*2); X.fill(); X.globalAlpha=1;
    });
    [310,370,430,490].forEach((sx,i)=>{
      collisions.push([sx-13,320-11,26,22]);
      X.fillStyle=[P.mustard,P.sage,P.teal,P.coral][i];
      X.beginPath(); X.ellipse(sx,320,13,10,0,0,Math.PI*2); X.fill();
    });
    tilted(640,350,150,46,0,(x,y,w,h)=>{ rr(x,y,w,h,12,P.terracotta);
      X.globalAlpha=.26; rr(x+6,y+4,w-12,10,6,'#ffffff'); X.globalAlpha=1; });
    pot(700,140,1.15,'clay');
  }},

meeting:{
  name:'Meeting Room', wall:'#cdc5b6', wallHi:'#ded7c8', wallDk:'#b3aa9a', skirt:'#5f5a50',
  material:'Light grey carpet tile, glass partition, whiteboard',
  desc:'Light grey carpet tile, quiet underfoot and laid straight. One oak table on bare floor with eight chairs evenly spaced around it, a whiteboard level with the screen, glass to the corridor. Nothing else in here at all.',
  exits:'Left → Studio<br/>Up → Creative',
  doors:[{side:'left',at:240},{side:'top',at:400}],
  floor(){ carpetFloor(97,'#9a968c','#a6a298','#84806f'); },
  draw(){
    whiteboard(104,26,236,52,41);
    box(760,150,20,150,P.glass,2);
    X.globalAlpha=.35; r(762,154,16,142,'#dff0f4'); X.globalAlpha=1;
    screenWall(460,26,220,52);
    tilted(400,264,268,104,0,(x,y,w,h)=>{
      X.save(); X.globalAlpha=.24; X.fillStyle='#000000';
      if(X.roundRect){X.beginPath();X.roundRect(x+3,y+h-2,w,10,7);X.fill();} X.restore();
      rr(x,y,w,h,8,P.oak); vgrad(x,y,w,9,P.oakHi,P.oak);
      X.globalAlpha=.45; for(let i=1;i<4;i++) r(x+i*(w/4),y,2,h,P.oakSeam); X.globalAlpha=1;
      rr(x+w/2-52,y+34,104,36,4,P.paper);
      X.globalAlpha=.6; X.strokeStyle=P.wallWDk; X.lineWidth=.8;
      for(let i=0;i<4;i++){ X.beginPath(); X.moveTo(x+w/2-44,y+42+i*7); X.lineTo(x+w/2+32,y+42+i*7); X.stroke(); }
      X.globalAlpha=1;
    });
    [290,400,510].forEach((cx,i)=>chairSoft(cx,186,0,[P.teal,P.coral,P.mustard][i]));
    [290,400,510].forEach((cx,i)=>chairSoft(cx,342,0,[P.plum,P.sage,P.terracotta][i]));
    chairSoft(238,264,0,P.slate); chairSoft(562,264,0,P.slate);
    pot(700,380,1.1,'clay');
    pendant(330,100,P.warmLamp,P.charcoal); pendant(470,100,P.warmLamp,P.charcoal);
  }}
};

