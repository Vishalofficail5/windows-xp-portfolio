/* =========================================================================
   HIGHWAY RACER 3D
   Vanilla JS + Three.js r128. Single-file game logic.
   ========================================================================= */

(function(){
"use strict";

/* ---------------------------------------------------------------------
   0. CONSTANTS & SAVE DATA
   --------------------------------------------------------------------- */
const LANE_X = [-3, 0, 3];
const SAVE_KEY = "hw_racer_save_v1";

const CAR_DEFS = [
  {id:0, name:"Night Hatch", body:"hatch", color:0x111217, cost:0,    baseSpeed:1.08, baseAccel:1.00, baseHandle:1.05},
  {id:1, name:"City Runner", body:"sedan", color:0x2e6fd9, cost:400,  baseSpeed:1.05, baseAccel:1.05, baseHandle:1.05},
  {id:2, name:"Dust Devil",  body:"suv",   color:0xc9922f, cost:800,  baseSpeed:1.05, baseAccel:1.00, baseHandle:0.95},
  {id:3, name:"Blizzard",    body:"suv",   color:0xdedede, cost:1200, baseSpeed:1.08, baseAccel:1.05, baseHandle:1.00},
  {id:4, name:"Neon Streak", body:"sport", color:0x1fd3c9, cost:1800, baseSpeed:1.20, baseAccel:1.15, baseHandle:1.10},
  {id:5, name:"Crimson Bolt",body:"sport", color:0xd91f3a, cost:2400, baseSpeed:1.25, baseAccel:1.20, baseHandle:1.10},
  {id:6, name:"Hauler",      body:"van",   color:0x3b3b3b, cost:3000, baseSpeed:0.95, baseAccel:0.90, baseHandle:0.90},
  {id:7, name:"Sunset Van",  body:"van",   color:0xe08a2b, cost:3600, baseSpeed:1.00, baseAccel:0.95, baseHandle:0.92},
  {id:8, name:"Phantom",     body:"sport", color:0x1a1a1a, cost:4400, baseSpeed:1.30, baseAccel:1.25, baseHandle:1.15},
  {id:9, name:"Goldrush",    body:"sedan", color:0xe8c41a, cost:5200, baseSpeed:1.15, baseAccel:1.10, baseHandle:1.08},
  {id:10,name:"Aurora GT",   body:"sport", color:0x8b3ee0, cost:6200, baseSpeed:1.35, baseAccel:1.30, baseHandle:1.20},
  {id:11,name:"Apex Zero",   body:"sport", color:0xffffff, cost:8000, baseSpeed:1.45, baseAccel:1.40, baseHandle:1.30},
];

const THEME_DEFS = [
  {id:"city",   name:"CITY",   sky:0x293442, fog:0x303a49, road:0x22272d, ground:0x10161a, ambient:0x788aa0, sun:0xb9c9dd, sunI:0.45, weather:"rain",
    decoSet:[["buildings",0.45],["lamps",0.30],["tree",0.15],["garage",0.10]]},
  {id:"desert", name:"DESERT", sky:0xd99a4e, fog:0xdcae6e, road:0x8a7355, ground:0xc79a5c, ambient:0xffcf9c, sun:0xfff3d6, sunI:1.2, weather:"none",
    decoSet:[["cactus",0.55],["deadtree",0.25],["garage",0.20]]},
  {id:"snow",   name:"SNOW",   sky:0xb9c9d9, fog:0xc9d7e3, road:0x555a60, ground:0xe8eef2, ambient:0xcfe0f0, sun:0xffffff, sunI:1.0, weather:"snow",
    decoSet:[["pine",0.65],["tree",0.15],["garage",0.20]]},
  {id:"rain",   name:"RAIN",   sky:0x2b323d, fog:0x30363f, road:0x1e2126, ground:0x232830, ambient:0x8fa0b0, sun:0xaebbc7, sunI:0.6, weather:"rain",
    decoSet:[["buildings",0.5],["tree",0.3],["garage",0.20]]},
  {id:"night",  name:"NIGHT",  sky:0x02040c, fog:0x02040c, road:0x1a1a1e, ground:0x0a0a0e, ambient:0x445577, sun:0x8899ff, sunI:0.35, weather:"none",
    decoSet:[["lamps",0.5],["buildings",0.3],["garage",0.2]]},
];

const ACHIEVEMENTS = [
  {id:"first_drive", icon:"🚗", name:"First Drive",     desc:"Play your first race",             check:s=>s.races>=1},
  {id:"dist_1k",      icon:"🛣️", name:"Road Tripper",    desc:"Travel 1,000m in one run",         check:s=>s.bestDist>=1000},
  {id:"dist_5k",      icon:"🌍", name:"Long Hauler",     desc:"Travel 5,000m in one run",         check:s=>s.bestDist>=5000},
  {id:"dist_10k",     icon:"🚀", name:"Highway Legend",  desc:"Travel 10,000m in one run",        check:s=>s.bestDist>=10000},
  {id:"coins_50",     icon:"🪙", name:"Pocket Change",   desc:"Collect 50 coins lifetime",        check:s=>s.totalCoins>=50},
  {id:"coins_500",    icon:"💰", name:"Coin Collector",  desc:"Collect 500 coins lifetime",       check:s=>s.totalCoins>=500},
  {id:"coins_2000",   icon:"🏦", name:"Vault Breaker",   desc:"Collect 2,000 coins lifetime",     check:s=>s.totalCoins>=2000},
  {id:"unlock_6",     icon:"🔧", name:"Growing Garage",  desc:"Unlock 6 cars",                    check:s=>s.carsUnlocked>=6},
  {id:"unlock_all",   icon:"🏆", name:"Full Garage",     desc:"Unlock all 12 cars",               check:s=>s.carsUnlocked>=12},
  {id:"nitro_50",     icon:"🔥", name:"Nitro Junkie",    desc:"Use nitro 50 times",               check:s=>s.nitroUses>=50},
  {id:"all_themes",   icon:"🗺️", name:"World Tour",      desc:"Race on all 5 highway themes",     check:s=>s.themesPlayed && Object.keys(s.themesPlayed).length>=5},
  {id:"crashes_10",   icon:"💥", name:"Crash Test",      desc:"Crash 10 times (it happens)",      check:s=>s.crashes>=10},
];

function defaultSave(){
  return {
    coins: 0,
    unlocked: [0],
    selectedCar: 0,
    upgrades: {0:{engine:0,nitro:0,tires:0}},
    achUnlocked: {},
    highscores: [],
    stats: {races:0, bestDist:0, totalCoins:0, carsUnlocked:1, nitroUses:0, crashes:0, themesPlayed:{}}
  };
}
let SAVE = loadSave();
function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const d = defaultSave();
    return Object.assign(d, parsed, {stats:Object.assign(d.stats, parsed.stats||{})});
  }catch(e){ return defaultSave(); }
}
function persist(){ localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE)); }
function upg(carId){
  if(!SAVE.upgrades[carId]) SAVE.upgrades[carId] = {engine:0,nitro:0,tires:0};
  return SAVE.upgrades[carId];
}

/* ---------------------------------------------------------------------
   1. AUDIO (synthesized, no external files)
   --------------------------------------------------------------------- */
const Audio1 = (function(){
  let ctx=null, master=null, engineOsc=null, engineHarmonic=null, engineGain=null, windOsc=null, windGain=null, musicTimer=null, muted=false;
  function ensure(){
    if(ctx) return;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination);
  }
  function beep(freq, dur, type, vol, delay){
    if(!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type||"square"; o.frequency.value = freq;
    g.gain.value = 0;
    o.connect(g); g.connect(master);
    const t0 = ctx.currentTime + (delay||0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol||0.2, t0+0.02);
    g.gain.linearRampToValueAtTime(0, t0+dur);
    o.start(t0); o.stop(t0+dur+0.02);
  }
  function coin(){ ensure(); beep(880,0.08,"square",0.18,0); beep(1320,0.10,"square",0.15,0.05); }
  function nitro(){ ensure(); beep(220,0.25,"sawtooth",0.2,0); beep(440,0.2,"sawtooth",0.15,0.05); }
  function crash(){ ensure(); beep(90,0.4,"sawtooth",0.3,0); beep(60,0.5,"square",0.25,0.05); }
  function nearMiss(){ ensure(); beep(760,0.07,"triangle",0.11,0); beep(1120,0.13,"triangle",0.1,0.07); }
  function unlock(){ ensure(); beep(523,0.1,"square",0.2,0); beep(659,0.1,"square",0.2,0.1); beep(784,0.18,"square",0.22,0.2); }
  function click(){ ensure(); beep(600,0.05,"square",0.12,0); }
  function startEngine(){
    ensure();
    if(engineOsc) return;
    engineOsc = ctx.createOscillator(); engineOsc.type = "sawtooth"; engineOsc.frequency.value = 60;
    engineHarmonic = ctx.createOscillator(); engineHarmonic.type = "triangle"; engineHarmonic.frequency.value = 120;
    engineGain = ctx.createGain(); engineGain.gain.value = 0.06;
    const filt = ctx.createBiquadFilter(); filt.type="lowpass"; filt.frequency.value = 400;
    engineOsc.connect(filt); engineHarmonic.connect(filt); filt.connect(engineGain); engineGain.connect(master);
    windOsc = ctx.createOscillator(); windOsc.type = "sine"; windOsc.frequency.value = 28;
    windGain = ctx.createGain(); windGain.gain.value = 0.008;
    windOsc.connect(windGain); windGain.connect(master);
    engineOsc.start(); engineHarmonic.start(); windOsc.start();
  }
  function setEngineSpeed(t){ // t in [0,1]
    if(!engineOsc) return;
    engineOsc.frequency.setTargetAtTime(50 + t*160, ctx.currentTime, 0.08);
    engineHarmonic.frequency.setTargetAtTime(102 + t*320, ctx.currentTime, 0.08);
    engineGain.gain.setTargetAtTime(muted?0:(0.05+t*0.06), ctx.currentTime, 0.1);
    windOsc.frequency.setTargetAtTime(24+t*42, ctx.currentTime, 0.1);
    windGain.gain.setTargetAtTime(muted?0:(0.008+t*0.018), ctx.currentTime, 0.1);
  }
  function stopEngine(){
    if(engineOsc){ try{engineOsc.stop(); engineHarmonic.stop(); windOsc.stop();}catch(e){} engineOsc=null; engineHarmonic=null; windOsc=null; }
  }
  // tiny chiptune loop for menu music
  const MELODY = [392,440,494,523,494,440,392,330, 349,392,440,466,440,392,349,294];
  let step=0;
  function startMusic(){
    ensure();
    if(musicTimer) return;
    step=0;
    musicTimer = setInterval(()=>{
      if(muted) return;
      const f = MELODY[step % MELODY.length];
      beep(f/2, 0.16, "triangle", 0.09, 0);
      if(step%2===0) beep(f, 0.08, "square", 0.05, 0.02);
      step++;
    }, 220);
  }
  function stopMusic(){ if(musicTimer){ clearInterval(musicTimer); musicTimer=null; } }
  function toggleMute(){ muted=!muted; if(master) master.gain.value = muted?0:0.35; return muted; }
  return {ensure,coin,nitro,crash,nearMiss,unlock,click,startEngine,setEngineSpeed,stopEngine,startMusic,stopMusic,toggleMute};
})();

/* ---------------------------------------------------------------------
   2. THREE.JS SETUP (low internal resolution -> pixelated upscale)
   --------------------------------------------------------------------- */
const canvas = document.getElementById("gameCanvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
if(renderer.outputColorSpace!==undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
else if(renderer.outputEncoding!==undefined) renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(64, 16/9, 0.5, 260);
camera.position.set(0, 5.1, 15.2);
camera.lookAt(0, 0.9, -12);

function resize(){
  const stage = document.getElementById("stage");
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener("resize", resize);

// lighting: hemisphere for soft sky/ground fill + a shadow-casting "sun"
const hemiLight = new THREE.HemisphereLight(0xbfd6ff, 0x33352c, 0.75);
scene.add(hemiLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.35);
sunLight.position.set(-14, 22, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1536, 1536);
sunLight.shadow.camera.left = -20; sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20; sunLight.shadow.camera.bottom = -20;
sunLight.shadow.camera.near = 1; sunLight.shadow.camera.far = 55;
sunLight.shadow.bias = -0.0015;
sunLight.shadow.radius = 3;
scene.add(sunLight);
sunLight.target.position.set(0,0,-10);
scene.add(sunLight.target);

// fog
scene.fog = new THREE.Fog(0x1c2b4a, 26, 150);

/* ----- procedural canvas textures (no external image assets needed) ----- */
function makeCanvasTexture(size, draw){
  const cnv = document.createElement("canvas"); cnv.width = size; cnv.height = size;
  const ctx = cnv.getContext("2d");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if(tex.colorSpace!==undefined) tex.colorSpace = THREE.SRGBColorSpace;
  else if(tex.encoding!==undefined) tex.encoding = THREE.sRGBEncoding;
  return tex;
}
const asphaltTex = makeCanvasTexture(256,(ctx,s)=>{
  ctx.fillStyle="#2c2c30"; ctx.fillRect(0,0,s,s);
  for(let i=0;i<1400;i++){
    const v = 20+Math.random()*30;
    ctx.fillStyle = `rgba(${v+10},${v+10},${v+14},${0.15+Math.random()*0.2})`;
    const x=Math.random()*s, y=Math.random()*s, r=Math.random()*1.4;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
});
asphaltTex.repeat.set(3, 10);
const grassTex = makeCanvasTexture(256,(ctx,s)=>{
  ctx.fillStyle="#283a1f"; ctx.fillRect(0,0,s,s);
  for(let i=0;i<900;i++){
    const v = 30+Math.random()*40;
    ctx.fillStyle = `rgba(${v*0.6},${v},${v*0.45},${0.12+Math.random()*0.25})`;
    const x=Math.random()*s, y=Math.random()*s, w=1+Math.random()*3, h=1+Math.random()*3;
    ctx.fillRect(x,y,w,h);
  }
});
grassTex.repeat.set(6, 10);
const windowGridTex = makeCanvasTexture(128,(ctx,s)=>{
  ctx.fillStyle="#0c0f18"; ctx.fillRect(0,0,s,s);
  const cell = s/8;
  for(let yy=0;yy<8;yy++) for(let xx=0;xx<8;xx++){
    const lit = Math.random()<0.55;
    ctx.fillStyle = lit ? "rgba(255,214,140,0.95)" : "rgba(40,46,64,0.9)";
    ctx.fillRect(xx*cell+cell*0.15, yy*cell+cell*0.15, cell*0.7, cell*0.7);
  }
});

/* ----- geometry / material caches ----- */
const geo = {
  box: new THREE.BoxGeometry(1,1,1),
  cyl: new THREE.CylinderGeometry(0.45,0.45,0.5,20),
  cone: new THREE.ConeGeometry(1,1,10),
  plane: new THREE.PlaneGeometry(1,1),
  sphere: new THREE.SphereGeometry(0.5,16,12),
  shadowBlob: new THREE.CircleGeometry(1,20),
};
function mat(color, opts){
  const o = Object.assign({color, roughness:0.85, metalness:0.05}, opts||{});
  return new THREE.MeshStandardMaterial(o);
}
function shadowBlobTexture(){
  return makeCanvasTexture(64,(ctx,s)=>{
    const g = ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    g.addColorStop(0,"rgba(0,0,0,0.55)"); g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g; ctx.fillRect(0,0,s,s);
  });
}
const contactShadowMat = new THREE.MeshBasicMaterial({map:shadowBlobTexture(), transparent:true, depthWrite:false});

/* ----- ground + road (tiled & recycled) ----- */
const SEG_LEN = 40;
const NUM_SEG = 6;
const roadGroup = new THREE.Group(); scene.add(roadGroup);
const roadMat = mat(0x2a2a2e, {map:asphaltTex, roughness:0.92, metalness:0.0});
const groundMatL = mat(0x14181f, {map:grassTex, roughness:1.0, metalness:0.0});
const groundMatR = mat(0x14181f, {map:grassTex, roughness:1.0, metalness:0.0});
const laneLineMat = mat(0xdddd66, {emissive:0x333300, roughness:0.6});
const curbMat = mat(0xcccccc, {roughness:0.7});
const railMat = mat(0xb8bcc0, {metalness:0.6, roughness:0.35});
const railPostMat = mat(0x2a2a2a, {metalness:0.3, roughness:0.6});
const segments = [];
for(let i=0;i<NUM_SEG;i++){
  const g = new THREE.Group();
  g.position.z = -i*SEG_LEN;
  const road = new THREE.Mesh(geo.plane, roadMat);
  road.rotation.x = -Math.PI/2; road.scale.set(10, SEG_LEN,1); road.position.y=0;
  road.receiveShadow = true;
  g.add(road);
  const gl = new THREE.Mesh(geo.plane, groundMatL);
  gl.rotation.x=-Math.PI/2; gl.scale.set(40,SEG_LEN,1); gl.position.set(-25,-0.01,0); gl.receiveShadow=true; g.add(gl);
  const gr = new THREE.Mesh(geo.plane, groundMatR);
  gr.rotation.x=-Math.PI/2; gr.scale.set(40,SEG_LEN,1); gr.position.set(25,-0.01,0); gr.receiveShadow=true; g.add(gr);
  // raised curb strips at road edge
  for(const side of [-1,1]){
    const curb = new THREE.Mesh(geo.box, curbMat);
    curb.scale.set(0.4, 0.14, SEG_LEN); curb.position.set(side*5.2, 0.06, 0);
    curb.receiveShadow = true; curb.castShadow = true;
    g.add(curb);
    // guardrail: posts + rail beam
    for(let p=0;p<4;p++){
      const post = new THREE.Mesh(geo.box, railPostMat);
      post.scale.set(0.12,0.7,0.12); post.position.set(side*6.0, 0.35, -p*(SEG_LEN/4));
      post.castShadow = true;
      g.add(post);
    }
    const beam = new THREE.Mesh(geo.box, railMat);
    beam.scale.set(0.18,0.22,SEG_LEN); beam.position.set(side*6.0, 0.6, 0);
    beam.castShadow = true;
    g.add(beam);
  }
  // lane divider dashes
  for(let d=0; d<8; d++){
    for(const lx of [-1.5,1.5]){
      const dash = new THREE.Mesh(geo.box, laneLineMat);
      dash.scale.set(0.12,0.02,2.2);
      dash.position.set(lx, 0.02, -d*(SEG_LEN/8));
      g.add(dash);
    }
  }
  // decoration slots (filled per theme)
  g.userData.decos = [];
  roadGroup.add(g);
  segments.push(g);
}

function clearDecos(g){
  g.userData.decos.forEach(o=>g.remove(o));
  g.userData.decos = [];
}
function buildingDeco(side){
  const grp = new THREE.Group();
  const h = 6+Math.random()*16;
  const bcol = new THREE.Color().setHSL(0.58+Math.random()*0.1, 0.15, 0.22+Math.random()*0.15);
  const m = new THREE.Mesh(geo.box, mat(bcol.getHex(), {roughness:0.8}));
  m.scale.set(4+Math.random()*3, h, 4+Math.random()*3);
  m.position.set(side*(16+Math.random()*10), h/2, 0);
  m.castShadow = true; m.receiveShadow = true;
  grp.add(m);
  const winTex = windowGridTex.clone(); winTex.needsUpdate = true;
  winTex.repeat.set(1, Math.max(1, Math.round(h/4)));
  const win = new THREE.Mesh(geo.box, mat(0xffffff,{map:winTex, roughness:0.5, metalness:0.1, emissive:0x111111, emissiveIntensity:0.3}));
  win.scale.set(m.scale.x*1.01, m.scale.y*0.94, m.scale.z*1.01);
  win.position.copy(m.position);
  grp.add(win);
  return grp;
}
function cactusDeco(side){
  const grp = new THREE.Group();
  const m = new THREE.Mesh(geo.cyl, mat(0x3f7a3a));
  m.scale.set(1,3+Math.random()*2,1); m.position.set(side*(14+Math.random()*12), (1.5+Math.random()),0);
  grp.add(m);
  return grp;
}
function pineDeco(side){
  const grp = new THREE.Group();
  const trunk = new THREE.Mesh(geo.cyl, mat(0x4a3524)); trunk.scale.set(0.5,1.4,0.5); trunk.position.y=0.7;
  const top = new THREE.Mesh(geo.cone, mat(0xe8f2f5)); top.scale.set(2.2,4+Math.random()*2,2.2); top.position.y=3.4;
  grp.add(trunk); grp.add(top);
  grp.position.set(side*(13+Math.random()*12),0,0);
  return grp;
}
function lampDeco(side){
  const grp = new THREE.Group();
  const pole = new THREE.Mesh(geo.cyl, mat(0x222222)); pole.scale.set(0.25,5,0.25); pole.position.y=2.5;
  const bulb = new THREE.Mesh(geo.sphere, mat(0xffee99,{emissive:0xffcc55,emissiveIntensity:1})); bulb.position.y=5.1; bulb.scale.set(0.9,0.9,0.9);
  const light = new THREE.PointLight(0xffcc66, 0.6, 14);
  light.position.y = 5.1;
  grp.add(pole); grp.add(bulb); grp.add(light);
  grp.position.set(side*11, 0, 0);
  return grp;
}
function treeDeco(side){
  const grp = new THREE.Group();
  const trunk = new THREE.Mesh(geo.cyl, mat(0x5a4028)); trunk.scale.set(0.4,2.2,0.4); trunk.position.y=1.1;
  grp.add(trunk);
  // layered canopy, slight random hue so a row of trees isn't one flat color
  const hue = 0.28+Math.random()*0.08;
  const canopyMat = mat(new THREE.Color().setHSL(hue,0.45,0.28+Math.random()*0.1).getHex());
  const c1 = new THREE.Mesh(geo.sphere, canopyMat); c1.scale.set(2.0,1.7,2.0); c1.position.y=3.0;
  const c2 = new THREE.Mesh(geo.sphere, canopyMat); c2.scale.set(1.4,1.2,1.4); c2.position.set(0.6,3.6,0.3);
  const c3 = new THREE.Mesh(geo.sphere, canopyMat); c3.scale.set(1.3,1.1,1.3); c3.position.set(-0.5,3.7,-0.4);
  grp.add(c1); grp.add(c2); grp.add(c3);
  grp.position.set(side*(12+Math.random()*14), 0, 0);
  return grp;
}
function deadTreeDeco(side){
  const grp = new THREE.Group();
  const barkMat = mat(0x5a4530);
  const trunk = new THREE.Mesh(geo.cyl, barkMat); trunk.scale.set(0.3,2.6,0.3); trunk.position.y=1.3;
  grp.add(trunk);
  for(let i=0;i<3;i++){
    const branch = new THREE.Mesh(geo.cyl, barkMat);
    branch.scale.set(0.15,1.2,0.15);
    branch.position.set((Math.random()-0.5)*1.2, 2.4+i*0.3, (Math.random()-0.5)*1.2);
    branch.rotation.z = (Math.random()-0.5)*1.2;
    branch.rotation.x = (Math.random()-0.5)*1.2;
    grp.add(branch);
  }
  grp.position.set(side*(13+Math.random()*14), 0, 0);
  return grp;
}
function garageDeco(side){
  const grp = new THREE.Group();
  const wallMat = mat(0x8a4a2e);
  const roofMat = mat(0x3a2a1e);
  const doorMat = mat(0x1c1c1c);
  const signMat = mat(0xdd3333,{emissive:0x551111,emissiveIntensity:0.7});
  const body = new THREE.Mesh(geo.box, wallMat);
  body.scale.set(9,4.2,7); body.position.y=2.1;
  grp.add(body);
  const roof = new THREE.Mesh(geo.box, roofMat);
  roof.scale.set(9.6,0.5,7.6); roof.position.y=4.35;
  grp.add(roof);
  const door = new THREE.Mesh(geo.box, doorMat);
  door.scale.set(3.2,3.0,0.3); door.position.set(-1.8,1.5,3.55);
  grp.add(door);
  const sign = new THREE.Mesh(geo.box, signMat);
  sign.scale.set(4,0.9,0.3); sign.position.set(0,4.9,3.4);
  grp.add(sign);
  grp.position.set(side*(17+Math.random()*6), 0, 0);
  return grp;
}
const DECO_BUILDERS = {
  buildings:buildingDeco, cactus:cactusDeco, pine:pineDeco, lamps:lampDeco,
  tree:treeDeco, deadtree:deadTreeDeco, garage:garageDeco
};

function pickWeighted(decoSet){
  const r = Math.random();
  let acc = 0;
  for(const [name,w] of decoSet){
    acc += w;
    if(r<=acc) return DECO_BUILDERS[name] || buildingDeco;
  }
  return DECO_BUILDERS[decoSet[0][0]] || buildingDeco;
}

function populateDecos(g, decoSet){
  clearDecos(g);
  // more objects per segment = denser scenery (was 3 rows, now 5)
  for(let i=0;i<5;i++){
    for(const side of [-1,1]){
      if(Math.random()<0.8){
        const builder = pickWeighted(decoSet);
        const d = builder(side);
        d.position.z += -Math.random()*SEG_LEN;
        d.traverse(o=>{ if(o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
        g.add(d);
        g.userData.decos.push(d);
      }
    }
  }
}

/* ----- weather particles ----- */
let weatherPoints = null;
function setWeather(kind){
  if(weatherPoints){ scene.remove(weatherPoints); weatherPoints.geometry.dispose(); weatherPoints=null; }
  if(kind==="none") return;
  const count = 400;
  const positions = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    positions[i*3] = (Math.random()-0.5)*60;
    positions[i*3+1] = Math.random()*30;
    positions[i*3+2] = -Math.random()*160;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions,3));
  const m = new THREE.PointsMaterial({
    color: kind==="snow" ? 0xffffff : 0xaaccff,
    size: kind==="snow" ? 0.35 : 0.15,
    transparent:true, opacity: kind==="snow"?0.9:0.6
  });
  weatherPoints = new THREE.Points(g,m);
  weatherPoints.userData.kind = kind;
  scene.add(weatherPoints);
}
function updateWeather(dt, speed){
  if(!weatherPoints) return;
  const pos = weatherPoints.geometry.attributes.position;
  const fall = weatherPoints.userData.kind==="snow" ? 3 : 26;
  const drift = weatherPoints.userData.kind==="snow" ? 0.6 : 0;
  for(let i=0;i<pos.count;i++){
    let y = pos.getY(i) - fall*dt;
    let x = pos.getX(i) + drift*dt;
    let z = pos.getZ(i) + speed*dt*0.6;
    if(y<0){ y = 28+Math.random()*4; x=(Math.random()-0.5)*60; }
    if(z>10){ z = -150; }
    pos.setY(i,y); pos.setX(i,x); pos.setZ(i,z);
  }
  pos.needsUpdate = true;
}

/* ----- car model builder ----- */
function buildCarMesh(colorHex, bodyType, isPlayer){
  const grp = new THREE.Group();
  const bodyMat = mat(colorHex, {roughness:0.28, metalness:0.55, envMapIntensity:1.2});
  const trimMat = mat(new THREE.Color(colorHex).multiplyScalar(0.55).getHex(), {roughness:0.4, metalness:0.5});
  const darkMat = mat(0x0c0c0c, {roughness:0.6, metalness:0.2});
  const rimMat = mat(0xe4e4e8, {roughness:0.25, metalness:0.9});
  const tireMat = mat(0x141414, {roughness:0.95, metalness:0.0});
  const glassMat = mat(0x1a2430, {roughness:0.08, metalness:0.4, transparent:true, opacity:0.72});
  const lightMat = mat(0xffffd2, {emissive:0xffe599, emissiveIntensity:1.45, roughness:0.2});
  const tailMat = mat(0xff2638, {emissive:0xa10016, emissiveIntensity:1.25, roughness:0.25});
  const plateMat = mat(0xf0f1e7, {roughness:0.38, metalness:0.1});

  let bw=1.8, bh=0.6, bl=3.6, cabH=0.55, cabL=1.6, rake=0;
  if(bodyType==="hatch"){ bw=1.9; bh=0.72; bl=3.75; cabH=0.68; cabL=1.8; rake=0.08; }
  if(bodyType==="suv"){ bw=1.9; bh=0.85; bl=3.9; cabH=0.75; cabL=2.0; rake=0; }
  if(bodyType==="sport"){ bw=1.85; bh=0.45; bl=3.9; cabH=0.4; cabL=1.5; rake=-0.22; }
  if(bodyType==="van"){ bw=1.95; bh=1.0; bl=4.1; cabH=0.9; cabL=2.6; rake=0; }

  const floorY = 0.35;

  // lower chassis (wider, thin) gives the body a "step" instead of a flat brick
  const chassis = new THREE.Mesh(geo.box, trimMat);
  chassis.scale.set(bw*1.02, bh*0.35, bl*0.97);
  chassis.position.y = floorY + bh*0.17;
  grp.add(chassis);

  const base = new THREE.Mesh(geo.box, bodyMat);
  base.scale.set(bw,bh,bl); base.position.y = floorY + bh/2 + bh*0.12;
  grp.add(base);

  // hood + trunk deck (slightly lower than cabin, front tapered on sport)
  const hood = new THREE.Mesh(geo.box, bodyMat);
  hood.scale.set(bw*0.94, bh*0.45, bl*0.32);
  hood.position.set(0, base.position.y+bh*0.32, -bl*0.28);
  if(bodyType==="sport") hood.rotation.x = -0.12;
  grp.add(hood);

  const cab = new THREE.Mesh(geo.box, glassMat);
  cab.scale.set(bw*0.84, cabH, cabL);
  cab.position.set(0, base.position.y + bh/2 + cabH/2 - 0.05, bodyType==="van"?0:-0.15);
  cab.rotation.x = rake;
  grp.add(cab);

  // Layered panels make the procedural traffic read as complete cars rather than blocks.
  const roof = new THREE.Mesh(geo.box, bodyMat);
  roof.scale.set(bw*0.72, 0.1, cabL*0.58);
  roof.position.set(0, cab.position.y+cabH*0.42, cab.position.z+0.05);
  grp.add(roof);
  for(const side of [-1,1]){
    const window = new THREE.Mesh(geo.box, glassMat);
    window.scale.set(0.025, cabH*0.72, cabL*0.72);
    window.position.set(side*(bw*0.425), cab.position.y, cab.position.z);
    grp.add(window);

    const doorSeam = new THREE.Mesh(geo.box, darkMat);
    doorSeam.scale.set(0.018, bh*0.7, 0.025);
    doorSeam.position.set(side*(bw*0.505), base.position.y, 0.15);
    grp.add(doorSeam);

    const handle = new THREE.Mesh(geo.box, rimMat);
    handle.scale.set(0.035, 0.045, 0.24);
    handle.position.set(side*(bw*0.515), base.position.y+bh*0.25, 0.45);
    grp.add(handle);
  }

  // side mirrors
  for(const side of [-1,1]){
    const mirror = new THREE.Mesh(geo.box, trimMat);
    mirror.scale.set(0.15,0.14,0.3);
    mirror.position.set(side*(bw/2+0.08), base.position.y+bh/2+0.05, -bl*0.05);
    grp.add(mirror);
  }

  // front + rear bumpers
  const fBumper = new THREE.Mesh(geo.box, darkMat);
  fBumper.scale.set(bw*1.0, bh*0.32, 0.25);
  fBumper.position.set(0, floorY+bh*0.22, -bl/2-0.05);
  grp.add(fBumper);
  const rBumper = new THREE.Mesh(geo.box, darkMat);
  rBumper.scale.set(bw*1.0, bh*0.32, 0.25);
  rBumper.position.set(0, floorY+bh*0.22, bl/2+0.05);
  grp.add(rBumper);

  const grille = new THREE.Mesh(geo.box, darkMat);
  grille.scale.set(bw*0.52, bh*0.34, 0.035);
  grille.position.set(0, floorY+bh*0.48, -bl/2-0.18);
  grp.add(grille);
  const rearPlate = new THREE.Mesh(geo.box, plateMat);
  rearPlate.scale.set(bw*0.32, bh*0.22, 0.028);
  rearPlate.position.set(0, floorY+bh*0.45, bl/2+0.18);
  grp.add(rearPlate);
  for(const side of [-1,1]){
    const exhaust = new THREE.Mesh(geo.cyl, darkMat);
    exhaust.rotation.x = Math.PI/2;
    exhaust.scale.set(0.13,0.24,0.13);
    exhaust.position.set(side*bw*0.28, floorY+0.17, bl/2+0.24);
    grp.add(exhaust);
  }

  // spoiler for sport
  if(bodyType==="sport"){
    const strut1 = new THREE.Mesh(geo.box, darkMat);
    strut1.scale.set(0.08,0.3,0.08); strut1.position.set(bw*0.32, bh+0.4, -bl/2+0.35);
    const strut2 = strut1.clone(); strut2.position.x = -bw*0.32;
    const sp = new THREE.Mesh(geo.box, darkMat);
    sp.scale.set(bw*0.95,0.08,0.45); sp.position.set(0, bh+0.62, -bl/2+0.35);
    grp.add(strut1); grp.add(strut2); grp.add(sp);
  }
  if(bodyType==="hatch"){
    const rearGlass = new THREE.Mesh(geo.box, glassMat);
    rearGlass.scale.set(bw*0.76, cabH*0.85, 0.045);
    rearGlass.position.set(0, cab.position.y, bl*0.43);
    rearGlass.rotation.x = -0.2;
    grp.add(rearGlass);

    const tailBar = new THREE.Mesh(geo.box, tailMat);
    tailBar.scale.set(bw*0.82, 0.19, 0.06);
    tailBar.position.set(0, floorY+bh*0.68, bl/2+0.17);
    grp.add(tailBar);

    const spoiler = new THREE.Mesh(geo.box, darkMat);
    spoiler.scale.set(bw*0.88, 0.07, 0.42);
    spoiler.position.set(0, base.position.y+bh+cabH*0.58, bl/2-0.12);
    grp.add(spoiler);
  }

  // Wheels use visible hubs and spokes so close traffic retains a recognisable silhouette.
  const wheels = [];
  const wheelPositions = [
    [bw/2*0.95, 0.35, bl/2-0.7],[-bw/2*0.95, 0.35, bl/2-0.7],
    [bw/2*0.95, 0.35, -bl/2+0.7],[-bw/2*0.95, 0.35, -bl/2+0.7],
  ];
  wheelPositions.forEach(p=>{
    const wheel = new THREE.Group();
    wheel.position.set(p[0],p[1],p[2]);
    grp.add(wheel);
    wheels.push(wheel);
    const w = new THREE.Mesh(geo.cyl, tireMat);
    w.rotation.z = Math.PI/2; w.scale.set(0.9,0.55,0.9);
    wheel.add(w);
    const rim = new THREE.Mesh(geo.cyl, rimMat);
    rim.rotation.z = Math.PI/2; rim.scale.set(0.94, 0.22, 0.94);
    rim.position.x = p[0]>0 ? 0.05 : -0.05;
    wheel.add(rim);
    for(let spoke=0;spoke<5;spoke++){
      const spokeMesh = new THREE.Mesh(geo.box, rimMat);
      spokeMesh.scale.set(0.05,0.34,0.05);
      spokeMesh.position.x = p[0]>0 ? 0.12 : -0.12;
      spokeMesh.rotation.x = spoke*Math.PI/5;
      wheel.add(spokeMesh);
    }
  });

  // headlights / taillights
  for(const side of [-1,1]){
    const hl = new THREE.Mesh(geo.box, lightMat);
    hl.scale.set(0.3,0.2,0.1); hl.position.set(side*bw*0.32, floorY+bh*0.6, -bl/2-0.06);
    grp.add(hl);
    const tl = new THREE.Mesh(geo.box, tailMat);
    tl.scale.set(0.3,0.2,0.1); tl.position.set(side*bw*0.32, floorY+bh*0.6, bl/2+0.06);
    grp.add(tl);
  }

  const nitroFlames = [];

  // soft contact shadow blob under the car (cheap fake AO, always faces down)
  const blob = new THREE.Mesh(geo.shadowBlob, contactShadowMat);
  blob.rotation.x = -Math.PI/2;
  blob.scale.set(bw*0.85, bl*0.62, 1);
  blob.position.y = 0.015;
  grp.add(blob);

  grp.traverse(o=>{ if(o.isMesh && o!==blob){ o.castShadow = true; o.receiveShadow = true; } });

  grp.userData.halfLen = bl/2;
  grp.userData.wheels = wheels;
  grp.userData.nitroFlames = nitroFlames;
  return grp;
}

/* ---------------------------------------------------------------------
   3. GAME STATE
   --------------------------------------------------------------------- */
const G = {
  running:false, paused:false,
  themeId:"city",
  laneIdx:1,
  laneX:0,
  targetX:0,
  playerCar:null,
  playerMesh:null,
  speed:0,          // current forward speed (world units/sec)
  baseSpeed:19,
  maxSpeedMul:1,
  score:0,
  distance:0,
  nearMisses:0,
  coinsThisRun:0,
  nitro:1,          // 0..1
  nitroActive:false,
  nitroCapacityBonus:0,
  elapsed:0,
  traffic:[],       // {mesh, lane, z}
  coins:[],         // {mesh, lane, z}
  particles:[],     // crash debris {mesh, vel, angVel, life}
  spawnTimerTraffic:0,
  spawnTimerCoin:0,
  spawnTimerNitroPickup:0,
  crashing:false,
  keys:{},
};

function themeById(id){ return THEME_DEFS.find(t=>t.id===id) || THEME_DEFS[0]; }
function carById(id){ return CAR_DEFS.find(c=>c.id===id) || CAR_DEFS[0]; }

function applyTheme(themeId){
  const th = themeById(themeId);
  G.themeId = themeId;
  scene.background = new THREE.Color(th.sky);
  scene.fog.color = new THREE.Color(th.fog);
  scene.fog.near = 20; scene.fog.far = th.id==="night"?90:140;
  roadMat.color.set(th.road);
  roadMat.roughness = th.weather==="rain" ? 0.32 : 0.92;
  roadMat.metalness = th.weather==="rain" ? 0.32 : 0;
  groundMatL.color.set(th.ground);
  groundMatR.color.set(th.ground);
  ambientLight.color.set(th.ambient);
  ambientLight.intensity = th.id==="night" ? 0.18 : 0.28;
  hemiLight.color.set(th.sky);
  hemiLight.groundColor.set(th.ground);
  hemiLight.intensity = th.id==="night" ? 0.25 : 0.75;
  sunLight.color.set(th.sun);
  sunLight.intensity = th.id==="night" ? 0.5 : th.sunI*1.3;
  setWeather(th.weather);
  segments.forEach(g=>populateDecos(g, th.decoSet));
}

/* ----- build/refresh player mesh whenever car changes ----- */
function setPlayerCar(carId){
  if(G.playerMesh){ scene.remove(G.playerMesh); }
  const def = carById(carId);
  G.playerCar = def;
  G.playerMesh = buildCarMesh(def.color, def.body, true);
  G.playerMesh.position.set(LANE_X[G.laneIdx], 0, 6);
  scene.add(G.playerMesh);
}

/* ---------------------------------------------------------------------
   4. SPAWNING / GAMEPLAY LOOP
   --------------------------------------------------------------------- */
function statScale(){
  const u = upg(G.playerCar.id);
  return {
    speed: G.playerCar.baseSpeed * (1 + u.engine*0.08),
    accel: G.playerCar.baseAccel * (1 + u.engine*0.06),
    handle: G.playerCar.baseHandle * (1 + u.tires*0.10),
    nitroCap: 1 + u.nitro*0.25,
    nitroRegen: 0.10 + u.nitro*0.03,
  };
}

function spawnTraffic(){
  const availableLanes = [0,1,2].filter(lane=>!G.traffic.some(t=>t.lane===lane && t.z < -104));
  if(!availableLanes.length) return;
  const lane = availableLanes[Math.floor(Math.random()*availableLanes.length)];
  const colors = [0xaa4444,0x4477aa,0x66aa44,0xaaaa44,0x8855aa,0xcc8844];
  const bodyTypes = ["sedan","sedan","suv","sport","van"];
  const mesh = buildCarMesh(colors[Math.floor(Math.random()*colors.length)], bodyTypes[Math.floor(Math.random()*bodyTypes.length)], false);
  mesh.rotation.y = Math.PI;
  mesh.position.set(LANE_X[lane], 0, -140);
  scene.add(mesh);
  G.traffic.push({mesh, lane, z:-140, speed: 6+Math.random()*4, nearMissed:false});
}
function spawnCoin(){
  const lane = Math.floor(Math.random()*3);
  const m = new THREE.Mesh(geo.cyl, mat(0xffd633,{emissive:0x774400,emissiveIntensity:0.5,metalness:0.85,roughness:0.25}));
  m.scale.set(0.5,0.12,0.5); m.rotation.x = Math.PI/2;
  m.castShadow = true;
  m.position.set(LANE_X[lane], 1.1, -150);
  scene.add(m);
  G.coins.push({mesh:m, lane, z:-150});
}
function spawnNitroPickup(){
  const lane = Math.floor(Math.random()*3);
  const m = new THREE.Mesh(geo.box, mat(0x33aaff,{emissive:0x0055aa,emissiveIntensity:0.8}));
  m.scale.set(0.6,0.6,0.6); m.position.set(LANE_X[lane], 1.0, -155);
  scene.add(m);
  G.coins.push({mesh:m, lane, z:-155, isNitro:true});
}

function resetRunState(){
  G.traffic.forEach(t=>scene.remove(t.mesh)); G.traffic=[];
  G.coins.forEach(c=>scene.remove(c.mesh)); G.coins=[];
  G.particles.forEach(p=>scene.remove(p.mesh)); G.particles=[];
  G.score=0; G.distance=0; G.nearMisses=0; G.coinsThisRun=0; G.nitro=1; G.nitroActive=false;
  G.elapsed=0; G.crashing=false;
  G.laneIdx=1; G.laneX=0; G.targetX=0;
  G.spawnTimerTraffic=0; G.spawnTimerCoin=1; G.spawnTimerNitroPickup=6;
  if(G.playerMesh) G.playerMesh.position.set(0,0,6);
  camera.position.set(0,5.1,15.2); camera.fov=64; camera.updateProjectionMatrix();
  camera.userData.followX = 0;
}

function startGame(themeId){
  applyTheme(themeId);
  setPlayerCar(SAVE.selectedCar);
  resetRunState();
  G.running = true; G.paused = false;
  showScreen(null);
  document.getElementById("hud").style.display = "flex";
  Audio1.stopMusic(); Audio1.ensure(); Audio1.startEngine();
  SAVE.stats.races++;
  SAVE.stats.themesPlayed[themeId]=true;
  persist();
}

function endGame(){
  G.running = false;
  Audio1.stopEngine();
  Audio1.crash();
  SAVE.stats.crashes++;
  SAVE.stats.bestDist = Math.max(SAVE.stats.bestDist, Math.floor(G.distance));
  checkAchievements();
  persist();
  document.getElementById("hud").style.display = "none";
  document.getElementById("overScore").textContent = `Score: ${Math.floor(G.score)}  |  Coins: ${G.coinsThisRun}  |  Distance: ${Math.floor(G.distance)}m`;
  const qualifies = isHighScore(Math.floor(G.score));
  document.getElementById("overNew").style.display = qualifies ? "block" : "none";
  if(qualifies){
    addHighScore("RACER", Math.floor(G.score));
  }
  showScreen("screenOver");
}

function isHighScore(score){
  if(score<=0) return false;
  const list = SAVE.highscores;
  return list.length<10 || score > list[list.length-1].score;
}
function addHighScore(name, score){
  SAVE.highscores.push({name, score, date:new Date().toLocaleDateString()});
  SAVE.highscores.sort((a,b)=>b.score-a.score);
  SAVE.highscores = SAVE.highscores.slice(0,10);
  persist();
}

function checkAchievements(){
  const s = SAVE.stats;
  s.carsUnlocked = SAVE.unlocked.length;
  let newlyUnlocked = [];
  ACHIEVEMENTS.forEach(a=>{
    if(!SAVE.achUnlocked[a.id] && a.check(s)){
      SAVE.achUnlocked[a.id] = true;
      newlyUnlocked.push(a);
    }
  });
  if(newlyUnlocked.length){ Audio1.unlock(); persist(); }
  return newlyUnlocked;
}

/* ---------------------------------------------------------------------
   5. INPUT
   --------------------------------------------------------------------- */
window.addEventListener("keydown", e=>{
  G.keys[e.code]=true;
  if(e.code==="Escape" && G.running){ togglePause(); }
  if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyW","KeyA","KeyS","KeyD"].includes(e.code)) e.preventDefault();
});
window.addEventListener("keyup", e=>{ G.keys[e.code]=false; });

function handleLaneInput(){
  if(!G.running || G.paused || G.crashing) return;
  if((G.keys["ArrowLeft"]||G.keys["KeyA"]) && G.laneIdx>0 && !G._laneLock){
    G.laneIdx--; G._laneLock=true;
  } else if((G.keys["ArrowRight"]||G.keys["KeyD"]) && G.laneIdx<2 && !G._laneLock){
    G.laneIdx++; G._laneLock=true;
  } else if(!(G.keys["ArrowLeft"]||G.keys["KeyA"]||G.keys["ArrowRight"]||G.keys["KeyD"])){
    G._laneLock=false;
  }
}

function togglePause(){
  if(!G.running) return;
  G.paused = !G.paused;
  if(G.paused){ Audio1.stopEngine(); showScreen("screenPause"); }
  else { Audio1.startEngine(); showScreen(null); }
}

/* ---------------------------------------------------------------------
   6. MAIN LOOP
   --------------------------------------------------------------------- */
let lastT = performance.now();
let fpsAcc=0, fpsCount=0, fpsLast=performance.now();

function tick(now){
  requestAnimationFrame(tick);
  let dt = (now-lastT)/1000; lastT = now;
  dt = Math.min(dt, 0.05);

  fpsAcc += dt; fpsCount++;
  if(now - fpsLast > 500){
    const fps = Math.round(fpsCount/fpsAcc);
    document.getElementById("statusFps").textContent = fps+" FPS";
    fpsAcc=0; fpsCount=0; fpsLast=now;
  }

  if(G.running && !G.paused){
    if(G.crashing) updateCrash(dt);
    else updateGame(dt);
  }
  updateWeather(dt, G.running?G.speed:8);
  renderer.render(scene, camera);
}

function updateGame(dt){
  handleLaneInput();
  G.elapsed += dt;
  const stats = statScale();

  // difficulty ramp: speed slowly increases
  const rampMul = 1 + Math.min(G.elapsed/90, 0.9);
  const nitroKey = G.keys["Space"]||G.keys["ShiftLeft"]||G.keys["ShiftRight"];
  G.nitroActive = nitroKey && G.nitro>0.02;
  if(G.nitroActive){
    G.nitro = Math.max(0, G.nitro - dt*0.35);
    if(G.nitro<=0.02) G.nitroActive=false;
  } else {
    G.nitro = Math.min(stats.nitroCap, G.nitro + dt*stats.nitroRegen);
  }
  const nitroMul = G.nitroActive ? 1.8 : 1;
  G.speed = G.baseSpeed * stats.speed * rampMul * nitroMul;

  // camera nitro FOV kick
  const targetFov = G.nitroActive ? 77 : 64;
  camera.fov += (targetFov-camera.fov)*Math.min(1,dt*4);
  camera.updateProjectionMatrix();

  // camera lags behind the lane change (partial follow, not 1:1) so drifting
  // lanes actually reads on screen instead of the car sliding under a static view
  const followTarget = G.laneX*0.72;
  camera.userData.followX += (followTarget - camera.userData.followX)*Math.min(1, dt*4);
  camera.position.x = camera.userData.followX;
  camera.position.y += (5.1-camera.position.y)*Math.min(1,dt*3);
  camera.position.z += ((G.playerMesh.position.z+9.2)-camera.position.z)*Math.min(1,dt*3);
  camera.lookAt(G.laneX*0.35, 0.9, G.playerMesh.position.z-18);

  Audio1.setEngineSpeed(Math.min(1, G.speed/60));

  G.distance += G.speed*dt;
  G.score = G.distance*1.0 + G.coinsThisRun*25 + G.nearMisses*60;

  // player lane movement (smooth lerp)
  G.targetX = LANE_X[G.laneIdx];
  const handleSpeed = 6*stats.handle;
  G.laneX += (G.targetX-G.laneX)*Math.min(1, dt*handleSpeed);
  G.playerMesh.position.x = G.laneX;
  G.playerMesh.rotation.z = (G.targetX-G.laneX)*0.06;
  G.playerMesh.rotation.y = (G.targetX-G.laneX)*0.035;
  G.playerMesh.userData.wheels.forEach(wheel=>{ wheel.rotation.x -= G.speed*dt*1.9; });
  G.playerMesh.userData.nitroFlames.forEach((flame,index)=>{
    flame.visible = G.nitroActive;
    if(G.nitroActive) flame.scale.y = 0.4 + Math.sin(G.elapsed*32+index)*0.18;
  });

  // move road segments toward camera, recycle
  segments.forEach(seg=>{
    seg.position.z += G.speed*dt;
    if(seg.position.z > SEG_LEN*1.5){
      seg.position.z -= SEG_LEN*NUM_SEG;
      populateDecos(seg, themeById(G.themeId).decoSet);
    }
  });

  // traffic update
  for(let i=G.traffic.length-1;i>=0;i--){
    const t = G.traffic[i];
    t.z += (G.speed - t.speed)*dt;
    t.mesh.position.z = t.z;
    t.mesh.position.x = LANE_X[t.lane];
    t.mesh.userData.wheels.forEach(wheel=>{ wheel.rotation.x += t.speed*dt*1.5; });
    if(t.z > 12){ scene.remove(t.mesh); G.traffic.splice(i,1); continue; }
    // collision check
    if(Math.abs(t.z-6) < 2.4 && t.lane===G.laneIdx){
      triggerCrash();
      return;
    }
    if(!t.nearMissed && Math.abs(t.z-6) < 2.8 && t.lane!==G.laneIdx){
      t.nearMissed = true;
      G.nearMisses++;
      Audio1.nearMiss();
    }
  }
  G.spawnTimerTraffic -= dt;
  if(G.spawnTimerTraffic<=0){
    spawnTraffic();
    G.spawnTimerTraffic = Math.max(1.05, 2.0 - G.elapsed*0.008) + Math.random()*0.45;
  }

  // coins update
  for(let i=G.coins.length-1;i>=0;i--){
    const c = G.coins[i];
    c.z += G.speed*dt;
    c.mesh.position.z = c.z;
    c.mesh.rotation.y += dt*4;
    if(c.z > 10){ scene.remove(c.mesh); G.coins.splice(i,1); continue; }
    if(Math.abs(c.z-6) < 1.4 && c.lane===G.laneIdx){
      scene.remove(c.mesh); G.coins.splice(i,1);
      if(c.isNitro){
        G.nitro = Math.min(stats.nitroCap, G.nitro+0.4);
        Audio1.nitro();
      } else {
        G.coinsThisRun++;
        SAVE.coins += 5;
        SAVE.stats.totalCoins++;
        Audio1.coin();
      }
    }
  }
  G.spawnTimerCoin -= dt;
  if(G.spawnTimerCoin<=0){ spawnCoin(); G.spawnTimerCoin = 0.8+Math.random()*0.9; }
  G.spawnTimerNitroPickup -= dt;
  if(G.spawnTimerNitroPickup<=0){ spawnNitroPickup(); G.spawnTimerNitroPickup = 12+Math.random()*8; }

  if(nitroKey && G.nitroActive) {
    if(!G._nitroSoundLock){ Audio1.nitro(); SAVE.stats.nitroUses++; G._nitroSoundLock=true; }
  } else G._nitroSoundLock=false;

  // HUD
  document.getElementById("hudScore").textContent = Math.floor(G.score);
  document.getElementById("hudCoins").textContent = SAVE.coins;
  document.getElementById("hudSpeed").textContent = Math.floor(G.speed*6.2);
  document.getElementById("nitroBar").style.width = Math.floor((G.nitro/stats.nitroCap)*100)+"%";
}

function triggerCrash(){
  G.crashing = true;
  Audio1.stopEngine();
  Audio1.crash();
  document.getElementById("crashFlash").style.transition="none";
  document.getElementById("crashFlash").style.opacity="0.85";
  requestAnimationFrame(()=>{
    document.getElementById("crashFlash").style.transition="opacity 0.6s";
    document.getElementById("crashFlash").style.opacity="0";
  });
  // debris particles
  for(let i=0;i<14;i++){
    const m = new THREE.Mesh(geo.box, mat(G.playerCar.color));
    m.scale.set(0.3,0.3,0.3);
    m.position.copy(G.playerMesh.position); m.position.y+=0.8;
    scene.add(m);
    G.particles.push({
      mesh:m,
      vel:new THREE.Vector3((Math.random()-0.5)*8, Math.random()*7, (Math.random()-0.5)*8),
      angVel:new THREE.Vector3((Math.random()-0.5)*8,(Math.random()-0.5)*8,(Math.random()-0.5)*8),
      life: 1.2
    });
  }
  G.playerMesh.visible = false;
  G._crashTimer = 0;
}
function updateCrash(dt){
  G._crashTimer += dt;
  for(let i=G.particles.length-1;i>=0;i--){
    const p = G.particles[i];
    p.vel.y -= 9.8*dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    p.mesh.rotation.x += p.angVel.x*dt;
    p.mesh.rotation.y += p.angVel.y*dt;
    p.mesh.rotation.z += p.angVel.z*dt;
    p.life -= dt;
    if(p.life<=0){ scene.remove(p.mesh); G.particles.splice(i,1); }
  }
  if(G._crashTimer > 1.4){
    G.playerMesh.visible = true;
    endGame();
  }
}

/* ---------------------------------------------------------------------
   7. UI: SCREEN MANAGEMENT
   --------------------------------------------------------------------- */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  if(id) document.getElementById(id).classList.add("active");
}

function refreshMenuStats(){
  document.getElementById("menuCoins").textContent = SAVE.coins;
  document.getElementById("menuCars").textContent = SAVE.unlocked.length;
}

/* ----- theme select screen ----- */
function buildThemeGrid(){
  const grid = document.getElementById("themeGrid");
  grid.innerHTML="";
  THEME_DEFS.forEach(th=>{
    const card = document.createElement("div");
    card.className="theme-card";
    card.innerHTML = `<div class="theme-swatch" style="background:#${th.sky.toString(16).padStart(6,'0')}"></div><b>${th.name}</b>`;
    card.onclick = ()=>{ Audio1.click(); startGame(th.id); };
    grid.appendChild(card);
  });
}

/* ----- garage ----- */
function buildGarage(){
  const grid = document.getElementById("carGrid");
  grid.innerHTML="";
  CAR_DEFS.forEach(car=>{
    const unlocked = SAVE.unlocked.includes(car.id);
    const div = document.createElement("div");
    div.className = "car-card" + (unlocked?"":" locked") + (SAVE.selectedCar===car.id?" selected":"");
    div.innerHTML = `<div class="car-swatch" style="background:#${car.color.toString(16).padStart(6,'0')}"></div>
      <b>${car.name}</b><br>${unlocked ? (SAVE.selectedCar===car.id?"SELECTED":"TAP TO SELECT") : ("🔒 "+car.cost+" coins")}`;
    div.onclick = ()=>{
      if(unlocked){
        SAVE.selectedCar = car.id; Audio1.click(); persist(); buildGarage(); buildUpgrades();
      } else if(SAVE.coins>=car.cost){
        SAVE.coins -= car.cost;
        SAVE.unlocked.push(car.id);
        SAVE.selectedCar = car.id;
        Audio1.unlock();
        persist();
        checkAchievements();
        buildGarage(); buildUpgrades(); refreshMenuStats();
      } else { Audio1.click(); }
    };
    grid.appendChild(div);
  });
}
const UPGRADE_DEFS = [
  {key:"engine", name:"ENGINE (Speed/Accel)"},
  {key:"tires",  name:"TIRES (Handling)"},
  {key:"nitro",  name:"NITRO (Capacity/Regen)"},
];
function upgradeCost(level){ return 150*(level+1); }
function buildUpgrades(){
  const wrap = document.getElementById("upgradesWrap");
  wrap.innerHTML = "";
  const carId = SAVE.selectedCar;
  const u = upg(carId);
  UPGRADE_DEFS.forEach(def=>{
    const level = u[def.key];
    const row = document.createElement("div");
    row.className="upgrade-row";
    let pips = "";
    for(let i=0;i<5;i++) pips += `<div class="pip ${i<level?"on":""}"></div>`;
    const maxed = level>=5;
    row.innerHTML = `<span>${def.name}</span><div class="pips">${pips}</div>
      <button class="xp-btn small" ${maxed?"disabled":""}>${maxed?"MAX":("↑ "+upgradeCost(level))}</button>`;
    row.querySelector("button").onclick = ()=>{
      const cost = upgradeCost(level);
      if(!maxed && SAVE.coins>=cost){
        SAVE.coins -= cost; u[def.key]++;
        Audio1.unlock(); persist(); buildUpgrades(); refreshMenuStats();
      } else if(!maxed) Audio1.click();
    };
    wrap.appendChild(row);
  });
}

/* ----- achievements ----- */
function buildAchievements(){
  const list = document.getElementById("achList");
  list.innerHTML="";
  ACHIEVEMENTS.forEach(a=>{
    const on = !!SAVE.achUnlocked[a.id];
    const div = document.createElement("div");
    div.className = "ach-item"+(on?"":" locked");
    div.innerHTML = `<div class="ach-icon">${on?a.icon:"🔒"}</div><div><b>${a.name}</b><br><span style="opacity:.7">${a.desc}</span></div>`;
    list.appendChild(div);
  });
}

/* ----- leaderboard ----- */
function buildBoard(){
  const body = document.getElementById("boardBody");
  body.innerHTML = "";
  if(SAVE.highscores.length===0){
    body.innerHTML = `<tr><td colspan="4" style="opacity:.6">No scores yet. Go race!</td></tr>`;
    return;
  }
  SAVE.highscores.forEach((h,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${h.name}</td><td>${h.score}</td><td>${h.date}</td>`;
    body.appendChild(tr);
  });
}

/* ---------------------------------------------------------------------
   8. BUTTON WIRING
   --------------------------------------------------------------------- */
function bind(id, fn){ document.getElementById(id).addEventListener("click", fn); }

bind("btnPlay", ()=>{ Audio1.click(); buildThemeGrid(); showScreen("screenTheme"); });
bind("btnThemeBack", ()=>{ Audio1.click(); showScreen("screenMenu"); });

bind("btnGarage", ()=>{ Audio1.click(); buildGarage(); buildUpgrades(); showScreen("screenGarage"); });
bind("btnGarageBack", ()=>{ Audio1.click(); refreshMenuStats(); showScreen("screenMenu"); });

bind("btnAch", ()=>{ Audio1.click(); buildAchievements(); showScreen("screenAch"); });
bind("btnAchBack", ()=>{ Audio1.click(); showScreen("screenMenu"); });

bind("btnBoard", ()=>{ Audio1.click(); buildBoard(); showScreen("screenBoard"); });
bind("btnBoardBack", ()=>{ Audio1.click(); showScreen("screenMenu"); });

bind("btnResume", ()=>{ togglePause(); });
bind("btnRestart", ()=>{ Audio1.click(); startGame(G.themeId); });
bind("btnQuitMenu", ()=>{ Audio1.click(); G.running=false; document.getElementById("hud").style.display="none"; refreshMenuStats(); Audio1.startMusic(); showScreen("screenMenu"); });

bind("btnRetry", ()=>{ Audio1.click(); startGame(G.themeId); });
bind("btnOverMenu", ()=>{ Audio1.click(); refreshMenuStats(); Audio1.startMusic(); showScreen("screenMenu"); });

bind("btnMin", ()=>{ document.getElementById("winxp").style.transform="scale(0.02)"; document.getElementById("winxp").style.transition="transform .3s"; setTimeout(()=>{document.getElementById("winxp").style.transform="";document.getElementById("winxp").style.transition="";},600); });
let maximized=false;
bind("btnMax", ()=>{
  const w = document.getElementById("winxp");
  maximized = !maximized;
  if(maximized){ w.style.width="100vw"; w.style.height="100vh"; w.style.borderRadius="0"; }
  else { w.style.width="min(96vw,1040px)"; w.style.height="min(94vh,720px)"; w.style.borderRadius="8px 8px 0 0"; }
  resize();
});
bind("btnClose", ()=>{
  if(confirm("Close Highway Racer 3D?")){
    document.getElementById("desktop").innerHTML = "<div style='color:#fff;font-family:Tahoma;text-align:center;margin-top:40vh;'>Window closed.<br><br><button class='xp-btn' onclick='location.reload()'>Reopen</button></div>";
  }
});

/* ---------------------------------------------------------------------
   9. BOOT SEQUENCE
   --------------------------------------------------------------------- */
function boot(){
  resize();
  applyTheme("city");
  setPlayerCar(SAVE.selectedCar);
  G.playerMesh.visible = true;

  const fill = document.getElementById("loadingFill");
  let p = 0;
  const iv = setInterval(()=>{
    p += 8+Math.random()*14;
    fill.style.width = Math.min(100,p)+"%";
    if(p>=100){
      clearInterval(iv);
      setTimeout(()=>{
        document.getElementById("loadingScreen").style.display="none";
        refreshMenuStats();
        showScreen("screenMenu");
        Audio1.startMusic();
      }, 200);
    }
  }, 120);

  requestAnimationFrame(tick);
}
boot();

})();
