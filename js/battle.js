"use strict";
/* 對戰引擎：Canvas 渲染、每姿勢獨立影格、錨點緩動、真交叉淡化、
   電腦 AI、雙人同機、P2P 線上同步（快照式，與 Muse 版相同邏輯）。 */
const BW=960, BH=420, GROUND=356, MIN_X=74, MAX_X=BW-74;
const imgCache=new Map();
function getImg(src){ let im=imgCache.get(src); if(!im){ im=new Image(); im.src=src; imgCache.set(src,im); } return (im.complete&&im.naturalWidth>0)?im:null; }
function poseImage(id,pose){ const fr=(ANIM_FRAMES[id]||ANIM_FRAMES.kaze)[pose]; return fr?getImg(fr.src):null; }
function preloadFrames(id){ for(const p of ALL_POSES) poseImage(id,p); getImg(BATTLE_SPRITES[id]||""); getImg(ARENA_BG); }
const emptyInput=()=>({left:false,right:false,jump:false,crouch:false,a1:false,a2:false,a3:false,ult:false});
function makeFighter(def,x,facing){ return { def,x,y:0,vy:0,pushVx:0,hp:def.maxHp,energy:0,facing,crouch:false,moving:false,walkPhase:0,atk:"",atkT:0,atkSeq:0,hitDone:false,cooldownUntil:[0,0,0],hitT:0,poisonUntil:0,nextPoisonTick:0,ko:false,prevInput:emptyInput(),rPose:"idle",rPrev:"idle",rBlend:1,rLastT:0,rAnchorX:-1,rRelH:-1,rAspect:-1 }; }
function moveOf(def,atk){ if(atk==="a1")return def.moves[0]; if(atk==="a2")return def.moves[1]; if(atk==="a3")return def.moves[2]; if(atk==="ult")return def.ult; return null; }
function atkDuration(a){ return a==="ult"?720:a==="a2"?460:a==="a3"?520:340; }
function atkStartup(a){ return a==="ult"?300:a==="a3"?200:a==="a2"?170:110; }
function poseFor(f){ if(f.ko)return "ko"; if(f.hitT>40)return "hurt";
  if(f.atk){ const mv=moveOf(f.def,f.atk), st=atkStartup(f.atk);
    if(f.atkT<st){ if(f.atk==="ult"||(mv&&(mv.kind==="projectile"||mv.kind==="strike")))return "charge"; if(mv&&mv.kind==="dash")return "crouch"; return "idle"; }
    if(f.atkT>atkDuration(f.atk)*0.78)return "idle";
    switch(mv&&mv.kind){ case "dash":return "lunge"; case "projectile": case "strike":return "cast"; default:return f.atkSeq%2===0?"punch":"kick"; } }
  if(f.y>0)return "jump"; if(f.crouch)return "crouch";
  if(f.moving){ const s=Math.floor(f.walkPhase/1.55)%4; return s===0?"walk1":s===2?"walk2":"idle"; }
  return "idle"; }

function startBattle(container, opts){
  const { p1Char, p2Char, opponent, difficulty, onExit, stageId } = opts;
  /* 場景：呼叫端可傳具體 id 或 "random"（在這裡抽定）；線上由房主在 start 訊息決定，
     雙方傳入同一個 id。再戰（resetFight）不換場景，沿用這一場的 stage。 */
  const stage = stageById(resolveStageId(stageId));
  const online = opponent==="online" ? { role: Net.role } : null;
  const playerSide = online ? (online.role==="host"?0:1) : 0;
  const defs=[fighterById(p1Char), fighterById(p2Char)];
  container.innerHTML = `
  <div class="battle-wrap">
    <div class="hud">
      <div class="hud-side"><div class="hud-head"><img class="hud-face" src="${PORTRAITS[defs[0].id]}" alt=""><div class="hud-names"><span><b style="color:${defs[0].accent}">${defs[0].name}</b> <small>${defs[0].title}</small>${playerSide===0?'<span class="you">YOU</span>':""}</span><span class="en-num" id="en0">0%</span></div></div>
      <div class="hpbar"><div class="hpfill" id="hp0"></div></div><div class="enbar"><div class="enfill" id="ef0"></div></div></div>
      <div class="timer-box"><div class="timer" id="timer">150</div><div class="timer-label">TIME</div></div>
      <div class="hud-side right"><div class="hud-head"><div class="hud-names"><span class="en-num" id="en1">0%</span><span>${playerSide===1?'<span class="you">YOU</span>':""}<small>${defs[1].title}</small> <b style="color:${defs[1].accent}">${defs[1].name}</b></span></div><img class="hud-face" src="${PORTRAITS[defs[1].id]}" alt=""></div>
      <div class="hpbar flip"><div class="hpfill" id="hp1"></div></div><div class="enbar"><div class="enfill right" id="ef1"></div></div></div>
    </div>
    <div class="arena-box">
      <canvas id="arena" aria-label="對戰擂台"></canvas>
      <div class="stage-chip">🗺️ ${stage.name}・${stage.en}</div>
      <div class="ult-cine hidden" id="ultOverlay" aria-hidden="true"><div class="ult-shade"></div><div class="ult-lines"></div><img class="ult-portrait" id="ultPortrait" src="" alt=""><div class="ult-text"><div class="ult-kicker">⚡ ULTIMATE ・ 大招解放</div><div class="ult-char" id="ultChar"></div><div class="ult-move" id="ultMove"></div><div class="ult-desc" id="ultDesc"></div></div></div>
      <div class="overlay" id="introOverlay"><div class="vs-row"><img src="${PORTRAITS[defs[0].id]}" style="--ring:${defs[0].color};transform:rotate(-3deg)" alt=""><span class="vs">VS</span><img src="${PORTRAITS[defs[1].id]}" style="--ring:${defs[1].color};transform:rotate(3deg)" alt=""></div><div class="intro-text" id="introText">READY</div><div class="intro-stage">🗺️ ${stage.name}</div></div>
      <div class="overlay hidden" id="overOverlay"></div>
      <div class="overlay hidden" id="leftOverlay"><p class="big-msg">對手已離開房間</p><button class="btn-primary" id="leftExit">回主選單</button></div>
    </div>
    <div class="moves-row" id="movesRow"></div>
    <div class="touch-row hidden" id="touchRow"></div>
    <div class="help-box"><b>P1 操作：</b>A/D 移動・W 跳躍・S 蹲下（兼格擋減傷）・F / G / H 三招・T 大招（氣滿 100%）${opponent==="local"?'<br><b>P2 操作：</b>←/→ 移動・↑ 跳躍・↓ 蹲下・J / K / L 三招・I 大招（氣滿 100%）':""}<span class="dim">　跳躍可以躲開地面震波與落雷；蹲下能大幅減傷。</span></div>
  </div>`;
  const canvas=container.querySelector("#arena");
  const myDef=defs[playerSide];
  const movesRow=container.querySelector("#movesRow");
  movesRow.innerHTML = `<span class="moves-title">我的招式</span>` + myDef.moves.map((m,i)=>`<span class="chip">${["F","G","H"][i]} ${m.name}・${m.damage}</span>`).join("") +
    `<span class="chip ult-chip" id="ultChip">T 大招 ${myDef.ult.name}・${myDef.ult.damage}（氣滿可用）</span><button class="chip btn-chip" id="exitBtn">離開對戰</button>`;
  let destroyed=false, raf=0, sim=null;
  const keys=emptyInput(), keys2=emptyInput(), touch=emptyInput();
  let cpu={nextThink:0,plan:emptyInput(),planUntil:0};
  let remoteSnap=null, appliedSnap=null, snapSendSeq=0, lastRemoteSeq=0, remoteAtkStart=0, pendingRemote=null, introStage=-1;
  /* 線上扣血改「攻擊方判定、防守方套用」：攻擊方在自己畫面上命中（與離線同一套
     距離判定，看到打中就是打中）就送 {t:"hit", atk, seq} 事件；防守方以 atkSeq
     去重、只套用一次傷害。舊作法是在防守方用攻擊開始時的舊位置對防守方現在的
     位置推測命中，雙邊延遲疊加後真人只要移動就幾乎必定被判未命中 — 攻擊方
     明明打中卻不扣血。hitProcessed 防重複套用，remoteAtkSeen 做時效檢查。 */
  let hitProcessed=new Set(), remoteAtkSeen=new Map();
  let phase="intro", winnerIdx=null, rematchMine=false, rematchTheirs=false, declared=false, oppLeft=false;
  /* 大招演出（cinematic）：招名 + 人物特寫 + 時間暫緩。
     觸發來源必須是「已複製的權威狀態」：本地／CPU／同機由 startAttack 觸發，
     線上遠端由快照裡的 atk==="ult" + atkSeq 觸發，兩端因此會為同一次大招各播一次。
     慢動作只是本地呈現層：主迴圈把 sim 步進 dt 乘上 timeScale，
     但快照每 50ms 照常即時收送、遠端 hitT 照常用 realDt 遞減（見 applyRemote），
     所以演出結束後靠快照自然 resync，不會重現先前 hitT 卡死／舊快照追逐的問題。 */
  let ultCine=null; // { idx, seq, start, dur }
  let ultSeen={0:-1,1:-1};
  let timeScale=1;
  const ULT_CINE_DUR=1150;
  function triggerUltCinematic(idx, seq, opts={}){
    if(idx!==0&&idx!==1) return;
    if(seq!=null){ if(ultSeen[idx]===seq) return; ultSeen[idx]=seq; }
    const def=defs[idx]; if(!def||!def.ult) return;
    const ov=container.querySelector("#ultOverlay"); if(!ov) return;
    const img=container.querySelector("#ultPortrait");
    if(img){ img.src=PORTRAITS[def.id]||""; img.alt=def.name+"・"+def.title+" 大招特寫"; }
    const ch=container.querySelector("#ultChar"); if(ch) ch.textContent=def.name+" ・ "+def.title;
    const mv=container.querySelector("#ultMove"); if(mv) mv.textContent=def.ult.name;
    const ds=container.querySelector("#ultDesc"); if(ds) ds.textContent=def.ult.desc;
    ov.style.setProperty("--ult-color", def.color);
    ov.style.setProperty("--ult-accent", def.accent);
    ov.classList.toggle("from-right", idx===1);
    ov.classList.toggle("from-left", idx!==1);
    ov.classList.remove("hidden","show"); void ov.offsetWidth; ov.classList.add("show");
    ultCine={ idx, seq:(seq!=null?seq:-1), start:performance.now(), dur:ULT_CINE_DUR };
    if(opts.sound){ try{ bgm.playUlt(); }catch(_){} }
  }
  function endUltCinematic(){
    ultCine=null; timeScale=1;
    const ov=container.querySelector("#ultOverlay"); if(ov){ ov.classList.add("hidden"); ov.classList.remove("show"); }
  }

  function resetFight(){
    sim={ fighters:[makeFighter(defs[0],240,1),makeFighter(defs[1],720,-1)], projectiles:[],particles:[],floaters:[],strikes:[], time:0,timer:150,phase:"intro",introT:0,overT:0,shake:0,flash:0,winner:null };
    endUltCinematic(); ultSeen={0:-1,1:-1};
    lastRemoteSeq=0; pendingRemote=null; remoteSnap=null; appliedSnap=null; introStage=-1;
    hitProcessed=new Set(); remoteAtkSeen=new Map();
    cpu={nextThink:0,plan:emptyInput(),planUntil:0}; // 再戰重置 CPU 排程，避免對手不動
    Object.assign(keys,emptyInput()); Object.assign(keys2,emptyInput()); Object.assign(touch,emptyInput());
    phase="intro"; winnerIdx=null; declared=false; rematchMine=false; rematchTheirs=false;
    container.querySelector("#introOverlay").classList.remove("hidden");
    container.querySelector("#overOverlay").classList.add("hidden");
    container.querySelector("#introText").textContent="READY";
  }
  function spawnParticles(x,y,color,n,power){ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, sp=(0.4+Math.random())*power; sim.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,life:0,max:260+Math.random()*300,color,size:2+Math.random()*3.5,grav:0.12}); } }
  function applyDamage(attacker,defender,move,isUlt){
    if(defender.ko||sim.phase!=="fight")return;
    const atkMul=0.72+attacker.def.stats.atk*0.055;
    let dmg=move.damage*atkMul*(1-defender.def.stats.def*0.02);
    const blocking=defender.crouch&&defender.y===0;
    if(blocking)dmg*=0.45;
    let crit=false;
    if(attacker.def.id==="sakura"&&(isUlt||Math.random()<0.22)){ dmg*=1.6; crit=true; }
    dmg=Math.round(dmg);
    defender.hp=Math.max(0,defender.hp-dmg);
    attacker.energy=Math.min(100,attacker.energy+(isUlt?0:9));
    defender.energy=Math.min(100,defender.energy+6);
    if(!blocking){ defender.hitT=isUlt?480:240; defender.pushVx=attacker.facing*move.knockback*0.9; if(defender.y>0)defender.vy=Math.max(defender.vy,2); }
    if(attacker.def.id==="sakura"&&move.name.includes("毒")){ defender.poisonUntil=sim.time+3000; defender.nextPoisonTick=sim.time+500; }
    const fy=GROUND-defender.y-172;
    spawnParticles(defender.x,fy,crit?"#fde047":attacker.def.accent,isUlt?34:14,isUlt?5:3);
    if(blocking)bgm.playBlock(); else bgm.playHit(isUlt||move.damage>=88);
    sim.floaters.push({x:defender.x,y:fy-26,text:blocking?`格擋 ${dmg}`:crit?`暴擊 ${dmg}!`:`${dmg}`,life:0,color:crit?"#fde047":isUlt?"#fca5a5":"#ffffff",big:isUlt||crit});
    if(isUlt){ sim.shake=14; sim.flash=0.35; } else if(move.damage>=88) sim.shake=Math.max(sim.shake,6);
    if(defender.hp<=0&&!defender.ko){ defender.ko=true; defender.atk=""; sim.winner=defender===sim.fighters[0]?1:0; sim.overT=0; }
  }
  function startAttack(f,atk){
    if(f.atk||f.ko||f.hitT>0)return;
    const now=sim.time;
    if(atk==="ult"){ if(f.energy<100)return; f.energy=0; bgm.playUlt(); }
    else { const idx=atk==="a1"?0:atk==="a2"?1:2; if(now<(f.cooldownUntil[idx]||0))return; const mv=f.def.moves[idx]; if(mv)f.cooldownUntil[idx]=now+mv.cooldownMs; }
    f.atk=atk; f.atkT=0; f.hitDone=false; f.atkSeq+=1; f.crouch=false;
    /* 本地權威觸發：CPU、同機 P1/P2、線上本地玩家都走這條路。
       大招音效已在上方 playUlt() 播過，這裡不再重播。 */
    if(atk==="ult"){ const idx=sim.fighters.indexOf(f); triggerUltCinematic(idx, f.atkSeq, {sound:false}); }
  }
  /* 攻擊方命中確認：我方攻擊在自己畫面上命中遠端替身時呼叫，把命中事件送給
     對方端套用傷害（對方以 seq 去重）。本地只做命中特效／音效回饋，不直接改
     替身的 hp — 替身 hp 以對方回傳的快照為準，避免雙邊各扣一次或互相覆蓋。 */
  function sendHit(atk, seq, foe){
    if(!online) return;
    Net.send({t:"hit", atk, seq});
    if(foe){ spawnParticles(foe.x, GROUND-foe.y-150, "#ffffff", 10, 3); }
    try{ bgm.playHit(atk==="ult"); }catch(_){}
  }
  /* 防守方套用對方的命中事件：同一個 atkSeq 只套用一次；傷害數字在本地依
     招式資料與防守方當下狀態（格擋／暴擊）計算，不信任對方傳來的任何數字。 */
  function handleRemoteHit(msg){
    if(!sim || sim.phase!=="fight") return;
    const atk=msg.atk, seq=msg.seq;
    if(atk!=="a1"&&atk!=="a2"&&atk!=="a3"&&atk!=="ult") return;
    if(typeof seq!=="number"||hitProcessed.has(seq)) return;
    const seenAt=remoteAtkSeen.get(seq);
    if(typeof seenAt==="number" && performance.now()-seenAt>5000) return; // 過期事件（上一場殘留）不套用
    hitProcessed.add(seq);
    const remoteIdx=playerSide===0?1:0, rf=sim.fighters[remoteIdx], local=sim.fighters[playerSide];
    const mv=moveOf(rf.def, atk);
    if(mv && !local.ko) applyDamage(rf, local, mv, atk==="ult");
  }

  function cpuInput(me,foe){
    const cfg=difficulty==="easy"?{think:430,block:0.08,aggro:0.55}:difficulty==="hard"?{think:150,block:0.5,aggro:0.95}:{think:260,block:0.28,aggro:0.75};
    if(sim.time>=cpu.nextThink){
      cpu.nextThink=sim.time+cfg.think*(0.7+Math.random()*0.6);
      const plan=emptyInput(), dist=foe.x-me.x, adist=Math.abs(dist), dirRight=dist>0, moves=me.def.moves;
      if(foe.atk&&adist<130&&Math.random()<cfg.block){ plan.crouch=true; }
      else if(me.energy>=100&&(adist<320||me.def.ult.kind==="strike")){ plan.ult=true; }
      else if(adist>300){ if(dirRight)plan.right=true; else plan.left=true; const r=moves.findIndex(m=>m.kind==="projectile"||m.kind==="strike"); if(r>=0&&Math.random()<0.45*cfg.aggro){ if(r===0)plan.a1=true; else if(r===1)plan.a2=true; else plan.a3=true; } if(Math.random()<0.18)plan.jump=true; }
      else if(adist>95){ if(dirRight)plan.right=true; else plan.left=true; const d=moves.findIndex(m=>m.kind==="dash"); if(d>=0&&Math.random()<0.5*cfg.aggro){ if(d===0)plan.a1=true; else if(d===1)plan.a2=true; else plan.a3=true; } if(Math.random()<0.1)plan.jump=true; }
      else { const r=Math.random(); if(r<cfg.aggro){ const p=Math.random(); if(p<0.45)plan.a1=true; else if(p<0.75)plan.a2=true; else plan.a3=true; } else if(r<cfg.aggro+0.15){ if(dirRight)plan.left=true; else plan.right=true; } else plan.crouch=Math.random()<0.5; }
      cpu.plan=plan; cpu.planUntil=sim.time+cfg.think*0.9;
    }
    return sim.time<=cpu.planUntil?cpu.plan:emptyInput();
  }
  function updateFighter(idx,input,dt){
    const f=sim.fighters[idx], foe=sim.fighters[idx===0?1:0], step=dt/16.7;
    if(f.poisonUntil>sim.time&&!f.ko&&sim.time>=f.nextPoisonTick){ f.nextPoisonTick=sim.time+500; f.hp=Math.max(1,f.hp-6); sim.floaters.push({x:f.x,y:GROUND-f.y-208,text:"中毒",life:0,color:"#a3e635",big:false}); }
    f.hitT=Math.max(0,f.hitT-dt);
    if(f.atk){ const mv=moveOf(f.def,f.atk); f.atkT+=dt;
      if(mv&&mv.kind==="dash") f.x+=f.facing*8.5*step;
      if(mv&&!f.hitDone&&f.atkT>=atkStartup(f.atk)){ f.hitDone=true;
        if(mv.kind==="projectile"){ sim.projectiles.push({x:f.x+f.facing*74,y:138+f.y,vx:f.facing*mv.range,owner:idx,move:mv,color:f.def.color,accent:f.def.accent,dead:false,atk:f.atk,seq:f.atkSeq}); spawnParticles(f.x+f.facing*74,GROUND-f.y-138,f.def.accent,6,2); }
        else if(mv.kind==="strike"){ const tx=mv.range>=900?foe.x:f.x+f.facing*mv.range*0.8; sim.strikes.push({x:tx,life:0,color:f.def.color,big:f.atk==="ult"}); const inR=mv.range>=900||Math.abs(foe.x-f.x)<=mv.range+26;
          /* 線上不直接改替身 hp（會被快照覆蓋且 hitT 無人遞減會卡死閃白）：
             在自己畫面上判定命中，命中就送 hit 事件給對方端套用一次傷害。 */
          if(inR&&foe.y<=62){ if(online) sendHit(f.atk, f.atkSeq, foe); else applyDamage(f,foe,mv,f.atk==="ult"); } }
        else { const reach=mv.kind==="dash"?84:mv.range; const inFront=(foe.x-f.x)*f.facing>=-30;
          if(inFront&&Math.abs(foe.x-f.x)<=reach+46&&Math.abs(foe.y-f.y)<110){ if(online) sendHit(f.atk, f.atkSeq, foe); else applyDamage(f,foe,mv,f.atk==="ult"); } }
      }
      if(f.atkT>=atkDuration(f.atk)) f.atk="";
    }
    const canAct=!f.atk&&f.hitT<=0&&!f.ko&&sim.phase==="fight";
    f.moving=false;
    if(canAct){ f.crouch=input.crouch&&f.y===0;
      if(input.jump&&!f.prevInput.jump&&f.y===0&&!f.crouch){ f.vy=f.def.jumpPower; f.y=0.1; spawnParticles(f.x,GROUND,"#94a3b8",5,1.4); }
      if(!f.crouch){ if(input.left){f.x-=f.def.walkSpeed*step;f.moving=true;} if(input.right){f.x+=f.def.walkSpeed*step;f.moving=true;} }
      if(input.a1&&!f.prevInput.a1)startAttack(f,"a1"); else if(input.a2&&!f.prevInput.a2)startAttack(f,"a2"); else if(input.a3&&!f.prevInput.a3)startAttack(f,"a3"); else if(input.ult&&!f.prevInput.ult)startAttack(f,"ult");
    } else f.crouch=false;
    if(f.moving&&f.y===0) f.walkPhase+=dt*0.02*(f.def.walkSpeed/3.6);
    if(f.y>0||f.vy>0){ f.y+=f.vy*step; f.vy-=0.92*step; if(f.y<=0){ f.y=0; f.vy=0; spawnParticles(f.x,GROUND,"#94a3b8",4,1.2); } }
    if(Math.abs(f.pushVx)>0.05){ f.x+=f.pushVx*step; f.pushVx*=Math.pow(0.82,step); } else f.pushVx=0;
    f.x=Math.max(MIN_X,Math.min(MAX_X,f.x));
    if(!f.atk) f.facing=foe.x>=f.x?1:-1;
    f.prevInput={...input};
  }

  function applyRemote(dt, realDt){
    const snap=remoteSnap, remoteIdx=playerSide===0?1:0, f=sim.fighters[remoteIdx], local=sim.fighters[playerSide];
    /* 遠端替身沒有跑 updateFighter，所有計時器必須在這裡逐幀遞減，
       否則 hitT 會永久停在受擊值：poseFor 一直回 hurt、drawFighter 一直套
       brightness(2.4) 閃白濾鏡，人物就卡死在受擊姿勢（6 角色皆然）。
       大招慢動作期間 hitT 仍用 realDt（真實時間）遞減，不被 timeScale 凍住。 */
    f.hitT=Math.max(0,f.hitT-(typeof realDt==="number"?realDt:dt));
    f.pushVx=0;
    if(f.poisonUntil>0&&f.poisonUntil<sim.time) f.poisonUntil=0;
    if(snap){
      /* 位置追蹤改指數緩動（反應更快）＋距離過大直接校正，避免追舊快照越追越 lag */
      const dx=snap.x-f.x;
      const k=Math.abs(dx)>150?1:1-Math.exp(-dt/38);
      f.moving=Math.abs(dx)>5&&snap.y===0;
      if(f.moving) f.walkPhase+=dt*0.02*(f.def.walkSpeed/3.6);
      f.x+=dx*k; f.y=snap.y; f.hp=snap.hp; f.energy=snap.energy; f.facing=snap.facing>=0?1:-1; f.crouch=snap.crouch; f.ko=snap.ko;
      /* 受擊狀態以送出端權威 hitT 為準：只在「新快照抵達」時同步一次，
         幀與幀之間靠上面的本地遞減自然歸零，快照就算中斷也不會永久閃白 */
      if(snap!==appliedSnap){ appliedSnap=snap;
        if(typeof snap.hitT==="number") f.hitT=Math.max(0,Math.min(480,snap.hitT));
      }
      const atk=snap.atk||"";
      if(snap.seq!==lastRemoteSeq){ lastRemoteSeq=snap.seq; remoteAtkStart=performance.now();
        if(atk){ const mv=moveOf(f.def,atk); remoteAtkSeen.set(snap.seq, performance.now());
          /* 遠端大招：由快照的 atk/atkSeq 複製觸發演出，兩端為同一次大招各播一次；
             ultSeen 以 atkSeq 去重，同一份快照重複抵達不會重播。 */
          if(atk==="ult"&&sim.phase==="fight") triggerUltCinematic(remoteIdx, snap.seq, {sound:true});
          if(mv&&sim.phase==="fight"){ if(mv.kind==="projectile"){ sim.projectiles.push({x:snap.x+f.facing*74,y:138+snap.y,vx:f.facing*mv.range,owner:remoteIdx,move:mv,color:f.def.color,accent:f.def.accent,dead:false,atk,seq:snap.seq}); }
            /* strike 只排「視覺特效」：落雷／震波要在防守方畫面上也看得到；
               扣血改走攻擊方的 hit 事件（handleRemoteHit），這裡不做命中判定，
               否則舊位置推測會把真人移動中的命中判掉、或與 hit 事件雙重扣血。 */
            else if(mv.kind==="strike") pendingRemote={atk,at:sim.time+atkStartup(atk),x:snap.x,facing:f.facing}; }
        } }
      f.atk=atk; f.atkT=atk?performance.now()-remoteAtkStart:0;
      /* 攻擊姿勢逾時強制回復：快照若中斷，不能讓遠端角色永遠停在出招幀 */
      if(f.atk&&f.atkT>atkDuration(f.atk)+150){ f.atk=""; f.atkT=0; }
      if(f.ko&&sim.winner===null){ sim.winner=playerSide; sim.overT=0; }
    }
    /* pendingRemote 現在只負責 strike 的視覺特效（落雷／震波位置），不扣血：
       傷害一律由攻擊方 hit 事件觸發 handleRemoteHit 套用，避免雙重扣血。 */
    const pend=pendingRemote;
    if(pend&&sim.time>=pend.at){ pendingRemote=null; const mv=moveOf(f.def,pend.atk);
      if(mv&&mv.kind==="strike"){ sim.strikes.push({x:mv.range>=900?local.x:pend.x+pend.facing*mv.range*0.8,life:0,color:f.def.color,big:pend.atk==="ult"}); } }
    if(local.ko&&sim.winner===null){ sim.winner=remoteIdx; sim.overT=0; }
  }
  /* 身體碰撞（全模式共用，含線上）：兩名角色視為實體，最小間距 BODY_SEP。
     離線原本就有推擠，線上先前被排除在外、遠端替身只跟著快照走，兩人就
     直接重疊穿過對方。本函式在每幀雙方位置更新完後統一解算：重疊量由
     兩人各承擔一半，兩端對同一組位置算出的結果相同——本地那一半會隨
     下一份快照送出，遠端那一半正好是對方下一份快照會送來的修正，
     不互相打架、不累積誤差。靠牆夾住時把剩餘重疊依序轉給還能動的一方，
     貼牆也一定推得開。
     跳躍換位：任一方在空中（y>0）的整個跳躍過程都不碰撞——舊作法用
     「高度差 >= 80 才放行」的門檻，步速慢的角色下降到門檻以下時人還沒
     越過對方中心，就被當成穿越推回原側，跳得再高也換不了位。改為全程
     放行後，落地（y=0）那一刻才依當下左右位置解算：已越過中心的人被
     推向另一側完成換位，沒越過的才推回原側；面向由 facing 依雙方位置
     每幀重算，換位後自動翻轉。地面步行（雙方 y=0）穿越仍被擋住。 */
  const BODY_SEP=98;
  function resolveBodyCollision(){
    if(!sim) return;
    const [a,b]=sim.fighters; if(!a||!b||a.ko||b.ko) return;
    if(a.y>0||b.y>0) return; // 任一方在空中：跳躍全程（含落地前）不碰撞，落地後依左右位置解算
    let d=b.x-a.x;
    if(Math.abs(d)>=BODY_SEP) return;
    const dir=d===0?1:Math.sign(d);
    const overlap=BODY_SEP-Math.abs(d);
    a.x-=dir*overlap/2; b.x+=dir*overlap/2;
    a.x=Math.max(MIN_X,Math.min(MAX_X,a.x)); b.x=Math.max(MIN_X,Math.min(MAX_X,b.x));
    d=b.x-a.x;
    if(Math.abs(d)<BODY_SEP){
      const dir2=d===0?dir:Math.sign(d), rem=BODY_SEP-Math.abs(d);
      b.x=Math.max(MIN_X,Math.min(MAX_X,b.x+dir2*rem));
      d=b.x-a.x;
      if(Math.abs(d)<BODY_SEP){
        const dir3=d===0?dir:Math.sign(d), rem2=BODY_SEP-Math.abs(d);
        a.x=Math.max(MIN_X,Math.min(MAX_X,a.x-dir3*rem2));
      }
    }
  }
  function showOver(){
    endUltCinematic();
    const w=defs[winnerIdx];
    const ov=container.querySelector("#overOverlay");
    ov.innerHTML=`<div class="ko">K.O.</div><img class="winner-img" src="${PORTRAITS[w.id]}" style="--ring:${w.color}" alt=""><p class="winner-text"><b style="color:${w.accent}">${w.name}・${w.title}</b> 獲勝！${winnerIdx===playerSide?" 🎉":""}</p><p class="over-stage">🗺️ 場景：${stage.name}（再戰沿用此場景，換場景請回主選單）</p><p class="rematch-note hidden" id="rematchNote">已送出再戰邀請，等待對手同意…</p><div class="over-btns" id="overBtns"><button class="btn-primary" id="rematchBtn">再戰一場</button><button class="btn-ghost" id="overExit">回主選單</button></div>`;
    ov.classList.remove("hidden");
    ov.querySelector("#rematchBtn").addEventListener("click",()=>{
      if(online){ rematchMine=true; Net.send({t:"rematch"}); ov.querySelector("#rematchNote").classList.remove("hidden"); ov.querySelector("#overBtns").classList.add("hidden"); if(rematchTheirs) resetFight(); }
      else resetFight();
    });
    ov.querySelector("#overExit").addEventListener("click",exitBattle);
  }
  function exitBattle(){ if(online) Net.send({t:"bye"}); destroy(); onExit(); }

  // ---------- drawing ----------
  function drawFighter(ctx,f,time){
    const feetY=GROUND-f.y;
    ctx.fillStyle="rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.ellipse(f.x,GROUND+7,Math.max(30,68-f.y*0.16),9,0,0,Math.PI*2); ctx.fill();
    const baseH=f.def.id==="titan"?238:224;
    const frames=ANIM_FRAMES[f.def.id]||ANIM_FRAMES.kaze;
    const pose=poseFor(f), frame=frames[pose]||frames.idle;
    if(f.energy>=100&&!f.ko){ const pulse=0.55+Math.sin(time*0.012)*0.25; const g=ctx.createRadialGradient(f.x,feetY-baseH*0.5,8,f.x,feetY-baseH*0.5,118); g.addColorStop(0,`rgba(255,201,60,${0.32*pulse+0.14})`); g.addColorStop(1,"rgba(255,201,60,0)"); ctx.fillStyle=g; ctx.fillRect(f.x-118,feetY-baseH-20,236,baseH+40); }
    if(f.poisonUntil>time&&!f.ko){ ctx.fillStyle="rgba(163,230,53,0.14)"; ctx.beginPath(); ctx.arc(f.x,feetY-baseH*0.5,74,0,0,Math.PI*2); ctx.fill(); }
    const img=poseImage(f.def.id,pose);
    if(!img){ const legacy=getImg(BATTLE_SPRITES[f.def.id]||""); if(!legacy){ ctx.fillStyle=f.def.color; ctx.globalAlpha=0.5; ctx.fillRect(f.x-26,feetY-baseH,52,baseH); ctx.globalAlpha=1; return; }
      const asp=legacy.naturalWidth/legacy.naturalHeight; ctx.save(); ctx.translate(f.x,feetY); ctx.scale(f.facing,1); if(f.hitT>60)ctx.filter="brightness(2.4) saturate(0.35)"; else if(f.ko)ctx.filter="grayscale(0.65) brightness(0.72)"; ctx.drawImage(legacy,-baseH*asp/2,-baseH,baseH*asp,baseH); ctx.filter="none"; ctx.restore(); return; }
    const dtDraw=f.rLastT>0?Math.min(80,time-f.rLastT):16; f.rLastT=time;
    if(pose!==f.rPose){ const LOCO=["idle","walk1","walk2","crouch"]; const instant=LOCO.includes(pose)&&LOCO.includes(f.rPose); f.rPrev=f.rPose; f.rPose=pose; f.rBlend=instant?1:0; }
    f.rBlend=Math.min(1,f.rBlend+dtDraw/40);
    const easeK=1-Math.exp(-dtDraw/55);
    if(f.rAnchorX<0){ f.rAnchorX=frame.anchorX; f.rRelH=frame.relH; f.rAspect=frame.aspect; }
    else { f.rAnchorX+=(frame.anchorX-f.rAnchorX)*easeK; f.rRelH+=(frame.relH-f.rRelH)*easeK; f.rAspect+=(frame.aspect-f.rAspect)*easeK; }
    const atkP=f.atk?Math.min(1,f.atkT/atkDuration(f.atk)):0;
    const striking=pose==="punch"||pose==="kick"||pose==="cast";
    const lunge=striking?Math.sin(Math.min(1,atkP*1.15)*Math.PI)*(f.atk==="ult"?16:10):0;
    const bob=pose==="idle"&&f.y===0&&!f.ko?Math.sin(time*0.004+f.x*0.05)*1.8:0;
    const walkBob=f.moving&&f.y===0&&!f.ko?Math.abs(Math.sin((f.walkPhase/1.55)*Math.PI))*2.4:0;
    const hitShake=f.hitT>60?(Math.random()-0.5)*5:0;
    const drawPose=(p,alpha)=>{ const fr=frames[p]||frame; const im=poseImage(f.def.id,p); if(!im||!fr)return;
      const drawH=baseH*f.rRelH, drawW=drawH*f.rAspect;
      ctx.save(); ctx.globalAlpha=alpha; ctx.translate(f.x+hitShake,feetY-bob-walkBob); ctx.scale(f.facing,1); ctx.translate(lunge,0);
      if(f.hitT>60)ctx.filter="brightness(2.4) saturate(0.35)"; else if(f.ko)ctx.filter="grayscale(0.65) brightness(0.72)"; else if(f.atk==="ult"&&striking)ctx.filter="brightness(1.18) saturate(1.25)";
      ctx.drawImage(im,-f.rAnchorX*drawW,-drawH,drawW,drawH); ctx.filter="none"; ctx.restore(); };
    if(f.rBlend<1&&f.rPrev!==f.rPose){ drawPose(f.rPrev,1-f.rBlend); drawPose(f.rPose,f.rBlend); } else drawPose(f.rPose,1);
  }
  function draw(){
    const dpr=Math.min(2,window.devicePixelRatio||1), cw=canvas.clientWidth; if(cw===0)return;
    const ch=Math.round(cw*BH/BW), targetW=Math.max(1,Math.round(cw*dpr)), targetH=Math.max(1,Math.round(ch*dpr));
    if(canvas.width!==targetW||canvas.height!==targetH){ canvas.width=targetW; canvas.height=targetH; }
    const ctx=canvas.getContext("2d"); if(!ctx)return;
    ctx.setTransform(canvas.width/BW,0,0,canvas.height/BH,0,0); ctx.clearRect(0,0,BW,BH);
    const shX=sim.shake>0?(Math.random()-0.5)*sim.shake:0, shY=sim.shake>0?(Math.random()-0.5)*sim.shake*0.6:0;
    ctx.save(); ctx.translate(shX,shY);
    const bg=getImg(stage.src);
    if(bg){ const iw=bg.naturalWidth, ih=bg.naturalHeight, scale=Math.max((BW+40)/iw,(BH+40)/ih), dw=iw*scale, dh=ih*scale, dx=-20-(dw-(BW+40))/2, dy=-20-(dh-(BH+40))*0.62; ctx.drawImage(bg,dx,dy,dw,dh);
      const shade=ctx.createLinearGradient(0,0,0,BH); shade.addColorStop(0,`rgba(5,6,16,${stage.shadeTop})`); shade.addColorStop(0.6,"rgba(5,6,16,0.05)"); shade.addColorStop(1,`rgba(5,6,16,${stage.shadeBot})`); ctx.fillStyle=shade; ctx.fillRect(-20,-20,BW+40,BH+40);
    } else { const sky=ctx.createLinearGradient(0,0,0,BH); sky.addColorStop(0,"#070a18"); sky.addColorStop(0.55,"#191038"); sky.addColorStop(1,"#2b1030"); ctx.fillStyle=sky; ctx.fillRect(-20,-20,BW+40,BH+40); }
    ctx.fillStyle=stage.glowL; ctx.fillRect(-20,GROUND+2,320,2.5);
    ctx.fillStyle=stage.glowR; ctx.fillRect(BW-300,GROUND+2,320,2.5);
    for(const s of sim.strikes){ const p=s.life/380; ctx.save(); ctx.globalAlpha=1-p; ctx.strokeStyle=s.color; ctx.lineWidth=s.big?7:4; ctx.beginPath(); let lx=s.x+(s.big?-14:-6); ctx.moveTo(lx,30); for(let yy=30;yy<GROUND-40;yy+=42){ lx+=(Math.random()-0.5)*26; ctx.lineTo(lx,yy); } ctx.lineTo(s.x,GROUND-6); ctx.stroke(); ctx.fillStyle=s.color; ctx.beginPath(); ctx.ellipse(s.x,GROUND-2,(s.big?90:52)*(0.5+p*0.7),10,0,0,Math.PI*2); ctx.fill(); ctx.restore(); }
    for(const f of sim.fighters) drawFighter(ctx,f,sim.time);
    for(const p of sim.projectiles){ const py=GROUND-p.y; const g=ctx.createRadialGradient(p.x,py,2,p.x,py,22); g.addColorStop(0,"#ffffff"); g.addColorStop(0.35,p.accent); g.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,py,22,0,Math.PI*2); ctx.fill(); ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,py,8,0,Math.PI*2); ctx.fill(); }
    for(const pt of sim.particles){ ctx.globalAlpha=1-pt.life/pt.max; ctx.fillStyle=pt.color; ctx.fillRect(pt.x-pt.size/2,pt.y-pt.size/2,pt.size,pt.size); }
    ctx.globalAlpha=1; ctx.textAlign="center";
    for(const fl of sim.floaters){ ctx.globalAlpha=1-fl.life/800; ctx.font=fl.big?"900 30px 'Arial Black', sans-serif":"700 17px sans-serif"; ctx.fillStyle=fl.color; ctx.strokeStyle="rgba(0,0,0,0.7)"; ctx.lineWidth=4; ctx.strokeText(fl.text,fl.x,fl.y); ctx.fillText(fl.text,fl.x,fl.y); }
    ctx.globalAlpha=1;
    if(sim.flash>0){ ctx.fillStyle=`rgba(255,240,200,${sim.flash})`; ctx.fillRect(-20,-20,BW+40,BH+40); }
    ctx.restore();
  }

  // ---------- main loop ----------
  resetFight(); preloadFrames(p1Char); preloadFrames(p2Char); getImg(stage.src);
  const touchRow=container.querySelector("#touchRow");
  if("ontouchstart" in window||navigator.maxTouchPoints>0){
    touchRow.classList.remove("hidden");
    const tb=(key,label,aria,cls)=>`<button type="button" class="tbtn ${cls||""}" data-k="${key}" aria-label="${aria}">${label}</button>`;
    touchRow.innerHTML=`<div class="tgrid">${tb("left","◀","向後")}${tb("crouch","⬇ 蹲","蹲下")}${tb("right","▶","向前")}<span></span>${tb("jump","⬆ 跳","跳躍")}<span></span></div><div class="tgrid2">${tb("a1",myDef.moves[0].name.slice(0,2),"招式一")}${tb("a2",myDef.moves[1].name.slice(0,2),"招式二")}${tb("a3",myDef.moves[2].name.slice(0,2),"招式三")}${tb("ult","大招","大招","ult-t")}</div>`;
    touchRow.querySelectorAll(".tbtn").forEach(b=>{ const k=b.dataset.k;
      b.addEventListener("pointerdown",e=>{e.preventDefault(); touch[k]=true;});
      ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>{touch[k]=false;}));
      b.addEventListener("contextmenu",e=>e.preventDefault()); });
  }
  container.querySelector("#exitBtn").addEventListener("click",exitBattle);
  container.querySelector("#leftExit").addEventListener("click",exitBattle);
  const hpEls=[container.querySelector("#hp0"),container.querySelector("#hp1")], efEls=[container.querySelector("#ef0"),container.querySelector("#ef1")], enEls=[container.querySelector("#en0"),container.querySelector("#en1")], timerEl=container.querySelector("#timer"), ultChip=container.querySelector("#ultChip");
  let last=performance.now(), hudAt=0;
  function hpColor(r){ return r>0.5?"linear-gradient(90deg,#4ade80,#22c55e)":r>0.25?"linear-gradient(90deg,#facc15,#eab308)":"linear-gradient(90deg,#f87171,#dc2626)"; }
  const loop=(now)=>{
    if(destroyed)return;
    raf=requestAnimationFrame(loop);
    const realDt=Math.min(50,now-last); last=now;
    if(!sim)return;
    /* 時間暫緩：大招演出期間把 sim 步進放慢（先近乎凍結 → 慢動作 → 平滑 ramp 回正常）。
       這只是呈現層的時間膨脹：快照收送的 setInterval 不受影響、
       遠端 hitT 用 realDt 遞減，演出結束後位置／狀態靠最新快照自然 resync。 */
    if(ultCine){
      const el=now-ultCine.start;
      if(el>=ultCine.dur||sim.phase==="over"){ endUltCinematic(); }
      else if(el<180) timeScale=0.06;
      else if(el<700) timeScale=0.14;
      else { const p=(el-700)/Math.max(1,ultCine.dur-700); timeScale=0.14+(1-0.14)*p*p; }
    } else timeScale=1;
    const dt=realDt*timeScale;
    sim.time+=dt;
    if(sim.phase==="intro"){ sim.introT+=dt; const stage=sim.introT<600?0:sim.introT<1200?1:2;
      if(stage!==introStage){ introStage=stage; bgm.playCount(stage===2); }
      const it=container.querySelector("#introText"); const txt=sim.introT<600?"READY":sim.introT<1200?"SET":"FIGHT!"; if(it&&it.textContent!==txt)it.textContent=txt;
      if(sim.introT>=1500){ sim.phase="fight"; phase="fight"; container.querySelector("#introOverlay").classList.add("hidden"); }
    } else if(sim.phase==="fight"){ sim.timer-=dt/1000;
      if(sim.timer<=0){ sim.timer=0; const [f0,f1]=sim.fighters; const r0=f0.hp/f0.def.maxHp, r1=f1.hp/f1.def.maxHp; sim.winner=r0===r1?(f0.hp>=f1.hp?0:1):r0>r1?0:1; sim.fighters[sim.winner===0?1:0].ko=true; sim.overT=0; }
    }
    const localIn={ left:keys.left||touch.left, right:keys.right||touch.right, jump:keys.jump||touch.jump, crouch:keys.crouch||touch.crouch, a1:keys.a1||touch.a1, a2:keys.a2||touch.a2, a3:keys.a3||touch.a3, ult:keys.ult||touch.ult };
    if(opponent==="online"){ updateFighter(playerSide,localIn,dt); applyRemote(dt, realDt); }
    else if(opponent==="cpu"){ updateFighter(0,localIn,dt); updateFighter(1,cpuInput(sim.fighters[1],sim.fighters[0]),dt); }
    else { updateFighter(0,localIn,dt); updateFighter(1,{...keys2},dt); }
    resolveBodyCollision(); // 全模式（含線上）身體碰撞：雙方位置更新後統一解算，不再穿過對方
    for(const p of sim.projectiles){ p.x+=p.vx*(dt/16.7); if(p.x<-30||p.x>BW+30){p.dead=true;continue;}
      const target=sim.fighters[p.owner===0?1:0], ownerF=sim.fighters[p.owner]; if(!target||!ownerF)continue;
      if(opponent==="online"){
        if(p.owner===playerSide){ /* 我方飛行道具打中遠端替身：送 hit 事件給對方套用傷害（飛行道具的大招不存在，isUlt 恆 false 與離線一致） */
          if(Math.abs(p.x-target.x)<52&&Math.abs(p.y-(138+target.y))<108){ p.dead=true; spawnParticles(target.x,GROUND-target.y-138,p.accent,8,2.4); if(p.atk&&typeof p.seq==="number") sendHit(p.atk, p.seq, target); } continue; }
        /* 對方的飛行道具在本地只是視覺複製：接觸只做特效、不扣血，
           傷害由對方端命中時送來的 hit 事件套用，避免同一發扣兩次。 */
        if(Math.abs(p.x-target.x)<52){ p.dead=true; spawnParticles(target.x,GROUND-target.y-138,p.accent,8,2.4); } continue; }
      if(Math.abs(p.x-target.x)<54&&Math.abs(p.y-(138+target.y))<108){ p.dead=true; applyDamage(ownerF,target,p.move,false); } }
    sim.projectiles=sim.projectiles.filter(p=>!p.dead);
    for(const pt of sim.particles){ pt.life+=dt; pt.x+=pt.vx*(dt/16.7); pt.y+=pt.vy*(dt/16.7); pt.vy+=pt.grav*(dt/16.7); }
    sim.particles=sim.particles.filter(p=>p.life<p.max);
    for(const fl of sim.floaters){ fl.life+=dt; fl.y-=dt*0.03; }
    sim.floaters=sim.floaters.filter(f=>f.life<800);
    for(const s of sim.strikes)s.life+=dt;
    sim.strikes=sim.strikes.filter(s=>s.life<380);
    sim.shake=Math.max(0,sim.shake-dt*0.03); sim.flash=Math.max(0,sim.flash-dt*0.0012);
    if(sim.winner!==null&&sim.phase==="fight"){ sim.overT+=dt;
      if(sim.overT>1000){ sim.phase="over"; phase="over"; bgm.playKo(); winnerIdx=sim.winner; showOver();
        if(online&&!declared){ declared=true; Net.send({t:"winner",winner:sim.winner===0?"host":"guest"}); } } }
    draw();
    if(now-hudAt>90){ hudAt=now; const [f0,f1]=sim.fighters;
      hpEls[0].style.width=Math.max(0,f0.hp/f0.def.maxHp*100)+"%"; hpEls[0].style.background=hpColor(f0.hp/f0.def.maxHp);
      hpEls[1].style.width=Math.max(0,f1.hp/f1.def.maxHp*100)+"%"; hpEls[1].style.background=hpColor(f1.hp/f1.def.maxHp);
      efEls[0].style.width=f0.energy+"%"; efEls[1].style.width=f1.energy+"%";
      enEls[0].textContent=Math.round(f0.energy)+"%"; enEls[1].textContent=Math.round(f1.energy)+"%";
      timerEl.textContent=Math.ceil(sim.timer);
      if(ultChip) ultChip.classList.toggle("ready",(playerSide===0?f0.energy:f1.energy)>=100);
    }
  };
  raf=requestAnimationFrame(loop);

  // ---------- online sync (P2P snapshot, ~50ms) ----------
  let syncTimer=null;
  if(online){
    Net.onMessage=(msg)=>{
      if(msg.t==="snap"){ remoteSnap=msg.snap; }
      else if(msg.t==="hit"){ handleRemoteHit(msg); }
      else if(msg.t==="winner"){ const wIdx=msg.winner==="host"?0:1; if(sim&&sim.phase!=="over"){ sim.winner=wIdx; sim.phase="over"; phase="over"; winnerIdx=wIdx; showOver(); } }
      else if(msg.t==="rematch"){ rematchTheirs=true; if(rematchMine) resetFight(); }
      else if(msg.t==="start"){ /* lobby start handled in app */ }
    };
    Net.onPeerLeft=()=>{ if(phase!=="over"){ oppLeft=true; container.querySelector("#leftOverlay").classList.remove("hidden"); } };
    syncTimer=setInterval(()=>{
      if(destroyed||!sim)return;
      const local=sim.fighters[playerSide]; if(!local)return;
      Net.send({t:"snap", snap:{ n:++snapSendSeq, x:Math.round(local.x), y:Math.round(local.y), hp:Math.round(local.hp), energy:Math.round(local.energy), facing:local.facing, crouch:local.crouch, atk:local.atk, seq:local.atkSeq, ko:local.ko, hitT:Math.round(local.hitT) }});
    },50);
  }
  // ---------- keyboard ----------
  /* 按鍵配置（全模式一致）：P1＝A/D 移動、W 跳、S 蹲、F/G/H 三招、T 大招；
     P2（僅雙人同機）＝方向鍵移動、J/K/L 三招、I 大招。單人／線上時方向鍵也能控制 P1。 */
  const down=(e)=>{ let used=true;
    switch(e.code){
      case "KeyA": keys.left=true; break; case "KeyD": keys.right=true; break; case "KeyW": keys.jump=true; break; case "KeyS": keys.crouch=true; break;
      case "KeyF": keys.a1=true; break; case "KeyG": keys.a2=true; break; case "KeyH": keys.a3=true; break; case "KeyT": keys.ult=true; break;
      case "ArrowLeft": if(opponent==="local")keys2.left=true; else keys.left=true; break;
      case "ArrowRight": if(opponent==="local")keys2.right=true; else keys.right=true; break;
      case "ArrowUp": if(opponent==="local")keys2.jump=true; else keys.jump=true; break;
      case "ArrowDown": if(opponent==="local")keys2.crouch=true; else keys.crouch=true; break;
      case "KeyJ": keys2.a1=true; break; case "KeyK": keys2.a2=true; break; case "KeyL": keys2.a3=true; break; case "KeyI": keys2.ult=true; break;
      default: used=false; }
    if(used)e.preventDefault(); };
  const up=(e)=>{
    switch(e.code){
      case "KeyA": keys.left=false; break; case "KeyD": keys.right=false; break; case "KeyW": keys.jump=false; break; case "KeyS": keys.crouch=false; break;
      case "KeyF": keys.a1=false; break; case "KeyG": keys.a2=false; break; case "KeyH": keys.a3=false; break; case "KeyT": keys.ult=false; break;
      case "ArrowLeft": keys.left=false; keys2.left=false; break; case "ArrowRight": keys.right=false; keys2.right=false; break;
      case "ArrowUp": keys.jump=false; keys2.jump=false; break; case "ArrowDown": keys.crouch=false; keys2.crouch=false; break;
      case "KeyJ": keys2.a1=false; break; case "KeyK": keys2.a2=false; break; case "KeyL": keys2.a3=false; break; case "KeyI": keys2.ult=false; break; } };
  window.addEventListener("keydown",down); window.addEventListener("keyup",up);
  function destroy(){ destroyed=true; endUltCinematic(); cancelAnimationFrame(raf); if(syncTimer)clearInterval(syncTimer); window.removeEventListener("keydown",down); window.removeEventListener("keyup",up); if(online){ Net.onMessage=null; Net.onPeerLeft=null; } }
  bgm.setMode("battle");
  return { destroy };
}
