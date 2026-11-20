"use strict";
/* 畫面流程：主選單 → 選角 →（線上大廳）→ 對戰。BGM 預設關閉，手動開啟才播放。 */
const appEl=document.getElementById("app");
let difficulty="normal", gallerySel="gouki", joinCode="", currentBattle=null, screenCleanup=null;
let selectedStage="neon";
try{ const s=localStorage.getItem("neonArenaStage"); if(s==="random"||stageExists(s)) selectedStage=s; }catch(_){}
function saveStage(){ try{ localStorage.setItem("neonArenaStage",selectedStage); }catch(_){} }
function currentStageBg(){ return selectedStage==="random"?ARENA_BG:stageById(selectedStage).src; }
const DIFFS=[{id:"easy",label:"簡單",desc:"新手暖身"},{id:"normal",label:"普通",desc:"勢均力敵"},{id:"hard",label:"困難",desc:"反應凌厲"}];
function stageGridHTML(sel){ return `<div class="stage-grid">${STAGES.map(s=>`<button type="button" class="stage-card ${sel===s.id?"sel":""}" data-stage="${s.id}"><img src="${s.thumb}" alt="${s.name}場景預覽" loading="lazy"><span class="stage-name">${s.name}</span><span class="stage-desc">${s.desc}</span></button>`).join("")}<button type="button" class="stage-card random ${sel==="random"?"sel":""}" data-stage="random"><span class="stage-dice">🎲</span><span class="stage-name">隨機場景</span><span class="stage-desc">開戰時隨機抽一個，每場不一樣</span></button></div>`; }
function stagePickerHTML(){ return `<div class="stage-pick"><div class="stage-pick-h">🗺️ 選擇場景 <span>6 個場景任選，再戰沿用；線上對戰由房主決定</span></div><div id="stagePickHost">${stageGridHTML(selectedStage)}</div></div>`; }
function bindStagePicker(root){ const host=root.querySelector("#stagePickHost"); if(!host)return;
  host.querySelectorAll("[data-stage]").forEach(b=>b.addEventListener("click",()=>{ selectedStage=b.dataset.stage; saveStage(); bgm.unlock(); bgm.playSelect();
    host.querySelectorAll("[data-stage]").forEach(x=>x.classList.toggle("sel",x.dataset.stage===selectedStage));
    root.querySelectorAll(".fb-bg").forEach(im=>{ im.src=currentStageBg(); }); })); }
function statBar(label,value,color){ return `<div class="stat"><span class="stat-label">${label}</span><div class="stat-track"><div class="stat-fill" style="width:${value*10}%;background:${color}"></div></div><span class="stat-num">${value}</span></div>`; }
function fighterDetail(f){ return `<div class="detail">
  <div class="detail-img"><img src="${PORTRAITS[f.id]}" alt="${f.name}・${f.title} 半身立繪"><div class="detail-shade"></div>
  <div class="detail-head"><h3>${f.name} <span style="color:${f.accent}">${f.title}</span></h3><div class="hp-box"><div>${f.maxHp}</div><small>最大生命</small></div></div></div>
  <div class="detail-body"><p>${f.desc}</p>
  <div class="fullbody"><img class="fb-bg" src="${currentStageBg()}" alt=""><div class="fb-dim"></div><img class="fb-img" src="${BATTLE_SPRITES[f.id]}" alt="${f.name} 對戰全身造型"><span class="fb-tag">對戰全身造型・進擂台就是這個樣子</span></div>
  <div class="stats">${statBar("攻擊",f.stats.atk,"#ff4d2e")}${statBar("防禦",f.stats.def,"#22d3ee")}${statBar("速度",f.stats.spd,"#a3e635")}${statBar("生命",f.stats.hp,"#f472b6")}</div>
  <h4 class="moves-h">招式表</h4><ul class="moves">
  ${f.moves.map((m,i)=>`<li><span class="move-idx">${["一","二","三"][i]}</span><div class="move-main"><div class="move-top"><span>${m.name}</span><span class="dmg">傷害 ${m.damage}</span></div><div class="move-desc">${m.desc}</div></div></li>`).join("")}
  <li class="ult"><span class="move-idx ult-idx">大</span><div class="move-main"><div class="move-top"><span>${f.ult.name}</span><span class="dmg">傷害 ${f.ult.damage}</span><span class="ult-tag">氣滿 100% 解放</span></div><div class="move-desc">${f.ult.desc}</div></div></li>
  </ul></div></div>`; }
function fighterCard(f,selected){ return `<button type="button" class="card ${selected?"sel":""}" data-id="${f.id}" aria-label="選擇 ${f.name} ${f.title}" style="background:linear-gradient(150deg, ${f.color}33, #12142a 55%)">
  <div class="card-img"><img src="${PORTRAITS[f.id]}" alt="${f.name}・${f.title} 半身立繪" loading="lazy"><div class="card-shade"></div>
  <div class="card-meta"><div class="card-name">${f.name} <span style="color:${f.accent}">${f.title}</span></div><div class="card-sub"><span>生命 ${f.maxHp}</span><span>速度 ${f.stats.spd}</span><span>攻擊 ${f.stats.atk}</span></div></div>
  ${selected?'<span class="picked">已選</span>':""}</div>
  <div class="card-stats">${statBar("攻擊",f.stats.atk,"#ff4d2e")}${statBar("防禦",f.stats.def,"#22d3ee")}${statBar("速度",f.stats.spd,"#a3e635")}${statBar("生命",f.stats.hp,"#f472b6")}</div></button>`; }
function mysteryDetail(){ return `<div class="detail mystery-detail">
  <div class="mystery-img"><span class="mystery-q">?</span><span class="mystery-dice">🎲</span></div>
  <div class="detail-body"><h3 class="mystery-title">隨機格鬥家 <span>🎲 已選擇隨機</span></h3>
  <p>你目前選擇的是隨機選角。角色在開戰前保密：選角階段看不到是哪一位，性能與招式也一併保密，要到對戰開始才會揭曉。</p>
  <p class="mystery-lock">想改也沒問題：直接點其他角色卡就能改選那一位；想回到隨機，再點一次「隨機選角」即可。直接開始的話，開戰畫面就會揭曉你的格鬥家。</p></div></div>`; }
function cleanupScreen(){ if(currentBattle){ currentBattle.destroy(); currentBattle=null; } if(screenCleanup){ screenCleanup(); screenCleanup=null; } }
function setBgmBtn(){ const b=document.getElementById("bgmBtn"); if(!b)return; b.textContent=bgm.enabled?"🎵 BGM 開":"🔇 BGM 關"; b.classList.toggle("on",bgm.enabled); }

function showMenu(errMsg){
  cleanupScreen(); bgm.setMode("menu");
  appEl.innerHTML=`<div class="wrap">
  <div class="hero"><div class="hero-cards"><img class="hc left" src="${PORTRAITS.gouki}" alt=""><img class="hc right" src="${PORTRAITS.yuki}" alt=""></div>
    <p class="hero-kicker">TWO-PLAYER FIGHTING</p><h1>拳魂對決・雙人格鬥</h1>
    <p class="hero-sub">六名格鬥家、三招一式加大招。和電腦一較高下，或開房間拿到邀請碼，邀朋友來一場真人對決。</p>
    <div class="hero-mobile"><img src="${PORTRAITS.gouki}" alt=""><span class="vs-i">VS</span><img src="${PORTRAITS.yuki}" alt=""></div></div>
  ${errMsg?`<p class="err-banner">${errMsg}</p>`:""}
  <div class="mode-grid">
    <section class="mode-card"><div class="mode-emoji">🤖</div><h2>電腦對戰</h2><p>一個人也能打，選好難度立刻開戰。</p>
      <div class="diff-row">${DIFFS.map(d=>`<button type="button" class="diff ${difficulty===d.id?"sel":""}" data-diff="${d.id}">${d.label}<span>${d.desc}</span></button>`).join("")}</div>
      <button class="btn-primary big" id="cpuBtn">選角開戰 →</button></section>
    <section class="mode-card"><div class="mode-emoji">🎮</div><h2>雙人同機</h2><p>同一台裝置、同一副鍵盤，兩個人輪流選角正面對決。</p>
      <ul class="keys-list"><li><b>P1：</b>A/D 移動・W 跳躍・S 蹲下，F / G / H 出招，T 大招</li><li><b>P2：</b>方向鍵移動，J / K / L 出招，I 大招</li></ul>
      <button class="btn-ghost big" id="localBtn">雙人選角 →</button></section>
    <section class="mode-card online"><div class="mode-emoji">🌐</div><h2>線上真人對戰</h2><p>開房間產生邀請碼，或輸入朋友的代碼加入他的擂台。（P2P 直連：房主要保持頁面開啟）</p>
      <button class="btn-cyan big" id="createBtn">建立房間・拿邀請碼</button>
      <div class="join-row"><input id="joinInput" maxlength="6" placeholder="輸入 6 碼邀請碼" value="${joinCode}" autocapitalize="characters"><button class="btn-ghost" id="joinBtn">加入</button></div>
      <p class="err hidden" id="menuErr"></p></section>
  </div>
  <div id="menuStagePick">${stagePickerHTML()}</div>
  <h2 class="gallery-h">角色圖鑑 <span>點角色看性能面板與招式表</span></h2>
  <div class="gallery">${FIGHTERS.map(f=>`<button type="button" class="g-item ${gallerySel===f.id?"sel":""}" data-id="${f.id}"><img src="${PORTRAITS[f.id]}" alt="${f.name}・${f.title} 半身立繪" loading="lazy"><span class="g-name">${f.name}<span style="color:${f.accent}">${f.title}</span></span></button>`).join("")}</div>
  <div class="gallery-detail" id="galleryDetail">${fighterDetail(fighterById(gallerySel))}</div>
  <footer class="foot">操作：P1＝A/D 移動・W 跳躍・S 蹲下（兼格擋，大幅減傷）・F/G/H 三招・T 大招（氣滿 100%）；P2（同機）＝方向鍵移動・J/K/L 三招・I 大招｜手機會自動顯示觸控按鈕</footer></div>`;
  bindStagePicker(appEl);
  appEl.querySelectorAll("[data-diff]").forEach(b=>b.addEventListener("click",()=>{ difficulty=b.dataset.diff; showMenu(); }));
  appEl.querySelector("#cpuBtn").addEventListener("click",()=>showSelect("cpu"));
  appEl.querySelector("#localBtn").addEventListener("click",()=>showSelect("local1"));
  appEl.querySelector("#createBtn").addEventListener("click",()=>showSelect("online-create"));
  const ji=appEl.querySelector("#joinInput");
  ji.addEventListener("input",()=>{ ji.value=ji.value.toUpperCase().slice(0,6); joinCode=ji.value; });
  appEl.querySelector("#joinBtn").addEventListener("click",()=>{
    joinCode=ji.value.trim().toUpperCase();
    if(joinCode.length!==6){ const e=appEl.querySelector("#menuErr"); e.textContent="請先輸入 6 碼邀請碼"; e.classList.remove("hidden"); return; }
    showSelect("online-join"); });
  appEl.querySelectorAll(".g-item").forEach(b=>b.addEventListener("click",()=>{ gallerySel=b.dataset.id; bgm.unlock(); bgm.playSelect();
    appEl.querySelectorAll(".g-item").forEach(x=>x.classList.toggle("sel",x.dataset.id===gallerySel));
    appEl.querySelector("#galleryDetail").innerHTML=fighterDetail(fighterById(gallerySel)); }));
}

function showSelect(purpose, p1){
  cleanupScreen(); bgm.setMode("menu");
  let sel = purpose==="local2" && p1 && p1!==RANDOM_CHAR ? (FIGHTERS.find(f=>f.id!==p1)||FIGHTERS[0]).id : FIGHTERS[0].id;
  let randomSelected=false;
  const p1Label = p1===RANDOM_CHAR ? "隨機格鬥家（開戰才揭曉）" : `${fighterById(p1||"").name}・${fighterById(p1||"").title}`;
  const heads={ cpu:["選擇你的格鬥家",`電腦難度：${(DIFFS.find(d=>d.id===difficulty)||DIFFS[1]).label}，對手將隨機出場；也可選隨機選角，開戰才揭曉`,"開始對戰"],
    local1:["P1 選擇格鬥家","左方玩家先選，選好換 P2；也可選隨機選角，開戰才揭曉","確定，換 P2 選角"],
    local2:["P2 選擇格鬥家",`P1 已選 ${p1Label}，換右方玩家；也可選隨機選角，開戰才揭曉`,"開始對戰"],
    "online-create":["選角後建立房間","選好角色就會產生 6 碼邀請碼","建立房間"],
    "online-join":["選角後加入房間",`即將加入房間 ${joinCode}`,"加入房間"] };
  const h=heads[purpose];
  appEl.innerHTML=`<div class="wrap"><div class="sel-head"><button class="btn-ghost small" id="backBtn">← 返回</button><div><h2>${h[0]}</h2><p>${h[1]}</p></div></div>
  <p class="err-banner hidden" id="selErr"></p><p class="info-banner hidden" id="selBusy">連線中…</p>
  <div class="sel-grid"><div class="cards">${FIGHTERS.map(f=>fighterCard(f,f.id===sel)).join("")}<button type="button" class="card random-card" id="randomCard" aria-label="隨機選角，開戰才揭曉，之後仍可改選其他角色"><span class="random-dice">🎲</span><span class="random-title">隨機選角</span><span class="random-desc">不知道會抽到誰，開戰才揭曉<br>點了之後仍可改按其他角色改選</span></button></div>
  <div class="sel-side"><div id="selDetail">${fighterDetail(fighterById(sel))}</div><p class="random-note hidden" id="randomNote" role="status"></p><button type="button" class="btn-random big" id="randomBtn">🎲 隨機選角（開戰才揭曉）</button><button class="btn-primary big" id="confirmBtn">${h[2]}</button></div></div>
  ${purpose==="online-join"?`<p class="info-banner">🗺️ 線上對戰的場景由房主決定，進入大廳後會顯示房主選的場景，雙方會看到同一個場景。</p>`:stagePickerHTML()}</div>`;
  bindStagePicker(appEl);
  const renderSel=()=>{
    // 隨機只是目前的選擇狀態，不是鎖定：角色卡永遠可點，點其他角色就改選、點隨機就回到隨機。
    appEl.querySelectorAll(".card[data-id]").forEach(c=>{ const on=!randomSelected && c.dataset.id===sel; c.classList.toggle("sel",on); c.disabled=false;
      const pk=c.querySelector(".picked"); if(on && !pk){ const s=document.createElement("span"); s.className="picked"; s.textContent="已選"; c.querySelector(".card-img").appendChild(s); } if(!on && pk) pk.remove(); });
    const rc=appEl.querySelector("#randomCard"); if(rc){ rc.classList.toggle("sel",randomSelected); rc.disabled=false; }
    const rb=appEl.querySelector("#randomBtn"); if(rb){ rb.disabled=false; rb.textContent=randomSelected?"🎲 已選隨機選角（可改選其他角色）":"🎲 隨機選角（開戰才揭曉）"; }
    const rn=appEl.querySelector("#randomNote");
    if(randomSelected){ appEl.querySelector("#selDetail").innerHTML=mysteryDetail(); if(rn){ rn.textContent="🎲 目前是隨機選角：不知道會抽到誰，開戰才揭曉。想改的話，直接點其他角色卡就能改選。"; rn.classList.remove("hidden"); } }
    else { appEl.querySelector("#selDetail").innerHTML=fighterDetail(fighterById(sel)); if(rn) rn.classList.add("hidden"); }
  };
  appEl.querySelectorAll(".card[data-id]").forEach(c=>c.addEventListener("click",()=>{ randomSelected=false; sel=c.dataset.id; bgm.unlock(); bgm.playSelect(); renderSel(); }));
  const pickRandom=()=>{ randomSelected=true; bgm.unlock(); bgm.playSelect(); renderSel(); };
  const rb1=appEl.querySelector("#randomBtn"); if(rb1)rb1.addEventListener("click",pickRandom);
  const rc1=appEl.querySelector("#randomCard"); if(rc1)rc1.addEventListener("click",pickRandom);
  appEl.querySelector("#backBtn").addEventListener("click",()=>showMenu());
  appEl.querySelector("#confirmBtn").addEventListener("click",()=>{
    const errEl=appEl.querySelector("#selErr"), busyEl=appEl.querySelector("#selBusy");
    const fail=(m)=>{ errEl.textContent=m; errEl.classList.remove("hidden"); busyEl.classList.add("hidden"); };
    const myChar = randomSelected ? RANDOM_CHAR : sel;
    if(purpose==="cpu"){ const me=resolveFighterId(myChar); const pool=FIGHTERS.filter(f=>f.id!==me); startBattleScreen(me,pool[Math.floor(Math.random()*pool.length)].id,"cpu",null); }
    else if(purpose==="local1"){ showSelect("local2",myChar); }
    else if(purpose==="local2"){ startBattleScreen(resolveFighterId(p1),resolveFighterId(myChar),"local",null); }
    else if(purpose==="online-create"){ busyEl.classList.remove("hidden"); errEl.classList.add("hidden");
      Net.onError=fail;
      Net.createRoom(myChar,(code)=>{ showLobby(); },selectedStage);
      setTimeout(()=>{ if(Net.code && !Net.peer) fail("建立房間逾時，請再試一次"); },1000);
    }
    else if(purpose==="online-join"){ busyEl.classList.remove("hidden"); errEl.classList.add("hidden");
      Net.onError=fail;
      Net.joinRoom(joinCode,myChar,selectedStage);
      showLobby(true);
    }
  });
}
function startBattleScreen(p1,p2,opponent,onlineInfo,stageId){
  cleanupScreen();
  appEl.innerHTML=`<div class="wrap" id="battleHost"></div>`;
  currentBattle=startBattle(appEl.querySelector("#battleHost"),{ p1Char:p1, p2Char:p2, opponent, difficulty, stageId:stageId||selectedStage, onExit:()=>{ if(opponent==="online"){ Net.destroy(); } showMenu(); } });
}

function showLobby(){
  cleanupScreen(); bgm.setMode("menu");
  let started=false;
  appEl.innerHTML=`<div class="wrap narrow"><div class="lobby-head"><p class="hero-kicker">線上對戰房間</p>
  <div class="code-row"><span class="code-box" id="lobbyCode">${Net.code||"······"}</span><button class="btn-ghost small" id="copyBtn">複製</button></div>
  <p class="lobby-sub">${Net.role==="host"?"把邀請碼傳給朋友，他在主選單輸入代碼就能加入":"你已加入房間，選好角色後按下準備"}</p></div>
  <p class="err-banner hidden" id="lobbyErr"></p>
  <div class="vs-grid" id="lobbyVs"></div>
  <h3 class="change-h">更換我的角色</h3><div class="char-pills" id="charPills"></div>
  <h3 class="change-h">對戰場景 <span id="lobbyStageNote"></span></h3><div id="lobbyStage"></div>
  <div class="lobby-actions"><button class="btn-primary big" id="readyBtn" disabled>等待對手加入…</button>
  <p class="wait-note hidden" id="waitNote">等對手按下準備，雙方都準備好就會自動開戰</p>
  <button class="btn-ghost small" id="leaveBtn">離開房間</button></div></div>`;
  const errEl=appEl.querySelector("#lobbyErr");
  Net.onError=(m)=>{ errEl.textContent=m; errEl.classList.remove("hidden"); };
  Net.onPeerLeft=()=>{ if(!started){ errEl.textContent="對手已離開房間"; errEl.classList.remove("hidden"); } };
  Net.onMessage=(msg)=>{ if(msg.t==="start"&&!started){ if(!fighterExists(msg.hostChar)||!fighterExists(msg.guestChar))return; started=true; startBattleScreen(msg.hostChar,msg.guestChar,"online",null,msg.stage||Net.myStage); } };
  const render=(st)=>{
    appEl.querySelector("#lobbyCode").textContent=st.code||"······";
    const meIsRandom = st.myChar===RANDOM_CHAR || st.myRandomLocked;
    const oppIsRandom = st.oppChar===RANDOM_CHAR || st.oppRandomLocked;
    const me=meIsRandom?null:fighterById(st.myChar||"kaze"), opp=(st.oppChar&&!oppIsRandom)?fighterById(st.oppChar):null;
    const side=(def,label,ready,emptyTxt)=>def?`<div class="vs-side ${ready?"ready":""}"><div class="vs-img" style="--ring:${def.color}"><img src="${PORTRAITS[def.id]}" alt=""></div><div class="vs-name">${def.name}・${def.title}</div><div class="vs-ready ${ready?"on":""}">${ready?"✓ 已準備":"尚未準備"}</div><div class="vs-label">${label}</div></div>`
      :`<div class="vs-side"><div class="vs-q">?</div><div class="vs-name dim">等待對手加入…</div><div class="vs-ready">把邀請碼傳給朋友吧</div><div class="vs-label">${label}</div></div>`;
    const mysterySide=(label,ready)=>`<div class="vs-side ${ready?"ready":""}"><div class="vs-q">?</div><div class="vs-name">🎲 隨機格鬥家</div><div class="vs-ready ${ready?"on":""}">${ready?"✓ 已準備":"尚未準備"}</div><div class="vs-label">${label}・開戰才揭曉</div></div>`;
    const meSide = meIsRandom ? mysterySide("我",st.myReady) : side(me,"我",st.myReady);
    const oppSide = oppIsRandom ? mysterySide("對手",st.oppReady) : side(opp,"對手",st.oppReady);
    appEl.querySelector("#lobbyVs").innerHTML=meSide+`<div class="vs-mid">VS</div>`+oppSide;
    const pillsEl=appEl.querySelector("#charPills");
    // 大廳改角：隨機只是目前選擇，永遠顯示全部角色 pills + 隨機 pill，點誰就改成誰。
    pillsEl.innerHTML=FIGHTERS.map(f=>`<button type="button" class="pill ${!meIsRandom&&st.myChar===f.id?"sel":""}" data-id="${f.id}" ${!meIsRandom&&st.myChar===f.id?`style="background:${f.accent}"`:""}><img src="${PORTRAITS[f.id]}" alt="">${f.name}・${f.title}</button>`).join("")+`<button type="button" class="pill random-pill ${meIsRandom?"sel":""}" data-random="1">🎲 隨機選角（開戰才揭曉）</button>`+(meIsRandom?`<span class="lobby-lock-note">目前是隨機：開戰才揭曉，點其他角色即可改選。</span>`:"");
    pillsEl.querySelectorAll(".pill[data-id]").forEach(b=>b.addEventListener("click",()=>Net.setChar(b.dataset.id)));
    const rp=pillsEl.querySelector("[data-random]"); if(rp)rp.addEventListener("click",()=>{ if(typeof Net.setRandom==="function")Net.setRandom(); else Net.setChar(RANDOM_CHAR); });
    const lsNote=appEl.querySelector("#lobbyStageNote"), ls=appEl.querySelector("#lobbyStage");
    if(ls&&lsNote){
      if(st.role==="host"){ lsNote.textContent="（你是房主，由你決定，雙方同場）";
        ls.innerHTML=stageGridHTML(st.myStage||"neon");
        ls.querySelectorAll("[data-stage]").forEach(b=>b.addEventListener("click",()=>{ selectedStage=b.dataset.stage; saveStage(); Net.setStage(b.dataset.stage); }));
      } else { lsNote.textContent="（由房主決定，雙方同場）";
        if(st.oppStage==="random"){ ls.innerHTML=`<div class="lobby-stage-view"><span class="stage-dice big-dice">🎲</span><div><b>隨機場景</b><span>房主選了隨機，開戰時揭曉，雙方會看到同一個場景</span></div></div>`; }
        else if(st.oppStage){ const hs=stageById(st.oppStage); ls.innerHTML=`<div class="lobby-stage-view"><img src="${hs.thumb}" alt="${hs.name}場景預覽"><div><b>${hs.name}・${hs.en}</b><span>${hs.desc}</span></div></div>`; }
        else { ls.innerHTML=`<p class="lobby-sub">等待房主設定場景…</p>`; }
      }
    }
    const rb=appEl.querySelector("#readyBtn");
    rb.disabled=!st.oppChar;
    rb.textContent=!st.oppChar?"等待對手加入…":st.myReady?"✓ 已準備（點按取消）":"準備開戰！";
    rb.classList.toggle("ready-on",st.myReady);
    appEl.querySelector("#waitNote").classList.toggle("hidden",!(st.oppChar&&st.myReady&&!st.oppReady));
  };
  Net.onLobby=render;
  render(Net._lobbyState());
  appEl.querySelector("#copyBtn").addEventListener("click",(e)=>{ try{navigator.clipboard.writeText(Net.code||"");}catch(_){} e.target.textContent="已複製 ✓"; setTimeout(()=>{e.target.textContent="複製";},1500); });
  appEl.querySelector("#readyBtn").addEventListener("click",()=>Net.setReady(!Net.myReady));
  appEl.querySelector("#leaveBtn").addEventListener("click",()=>{ Net.send({t:"bye"}); Net.destroy(); showMenu(); });
  screenCleanup=()=>{ Net.onLobby=null; if(!started){ /* keep peer alive only if battle started */ } };
}
/* ---------- init ---------- */
document.getElementById("bgmBtn").addEventListener("click",()=>{ const next=!bgm.enabled; bgm.setEnabled(next); setBgmBtn(); });
window.addEventListener("pointerdown",()=>{ bgm.unlock(); });
window.addEventListener("keydown",()=>{ bgm.unlock(); });
setBgmBtn();
showMenu();
