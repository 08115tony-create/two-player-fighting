"use strict";
/* 線上對戰：PeerJS（WebRTC P2P 直連）。
   只借 PeerJS Cloud 免費公共訊號服務交換連線，遊戲資料由兩位玩家的瀏覽器直傳，
   不經過任何遊戲伺服器。邀請碼就是房主的連線代碼（6 碼）。
   房主必須保持頁面開啟；房主關閉頁面，房間就結束。 */
const PEER_PREFIX = "neon-arena-v1-";
function randomCode(){
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for(let i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}
const Net = {
  peer: null, conn: null, role: null, code: null, myChar: null,
  oppChar: null, myReady: false, oppReady: false, connected: false,
  myStage: "neon", oppStage: null,
  /* 回房間再戰的場地選擇權：stageChooserSide=0 房主／1 訪客。
     第一場（hasPlayed=false）由房主選；賽後回房間時由 applyReturnState 依
     「上一局輸家選場地」更新——輸家是誰就換誰選；上一局平手／無輸家
     （lastLoserSide=null 且 hasPlayed=true）維持房主選。 */
  stageChooserSide: 0, lastLoserSide: null, hasPlayed: false, lastRoundTie: false,
  myRandomLocked: false, oppRandomLocked: false, _startSent: false,
  onLobby: null,   // (state) => void
  onMessage: null, // (msg) => void  (battle-phase messages)
  onPeerLeft: null,
  onError: null,

  _fail(msg){ if(this.onError) this.onError(msg); },
  _lobbyState(){ return { code:this.code, role:this.role, myChar:this.myChar, oppChar:this.oppChar, myReady:this.myReady, oppReady:this.oppReady, connected:this.connected, myStage:this.myStage, oppStage:this.oppStage, myRandomLocked:this.myRandomLocked, oppRandomLocked:this.oppRandomLocked, stageChooserSide:this.stageChooserSide, lastLoserSide:this.lastLoserSide, hasPlayed:this.hasPlayed, lastRoundTie:this.lastRoundTie }; },
  _emitLobby(){ if(this.onLobby) this.onLobby(this._lobbyState()); },

  send(obj){ try{ if(!(this.conn && this.conn.open)) return;
    /* 快照是「最新狀態覆蓋舊狀態」型資料：傳輸緩衝已壅塞時直接丟棄這一幀，
       不要讓舊快照在 WebRTC reliable 通道裡排隊累積 — 那會造成連線對戰
       打沒多久就越來越卡、人物追著過時位置跑甚至像凍住。控制訊息不丟。 */
    if(obj && obj.t==="snap" && typeof this.conn.bufferSize==="number" && this.conn.bufferSize>16384) return;
    this.conn.send(obj); }catch(e){} },
  sendLobby(){ this.send({ t:"lobby", char:this.myChar, ready:this.myReady, stage:this.myStage, chooser:this.stageChooserSide, lastLoser:this.lastLoserSide, hasPlayed:this.hasPlayed }); },
  /* 賽後回房間的狀態轉移（發起方本地呼叫、接收方在連線層收到 tolobby 時呼叫，
     兩邊跑同一份邏輯，結果一致且重複呼叫冪等）：
     - 準備狀態與 _startSent 歸零，下一場要重新雙方準備才會開戰；
     - 場地選擇權交給上一局輸家（loserSide 0=房主方／1=訪客方）；
       loserSide 不是 0/1（平手／無輸家）時維持房主選；
     - 選擇權換人時，新任選場地一方的預設場地先沿用上一場的場地，
       他進大廳後可以再改；選擇權沒換人時保留他原本的選擇（含隨機）。 */
  applyReturnState(loserSide, battleStageId){
    const prevChooser = this.stageChooserSide===1 ? 1 : 0;
    const hasLoser = loserSide===0 || loserSide===1;
    const newChooser = hasLoser ? loserSide : 0;
    const mySide = this.role==="host" ? 0 : 1;
    this.lastLoserSide = hasLoser ? loserSide : null;
    this.lastRoundTie = !hasLoser;
    this.hasPlayed = true;
    this.stageChooserSide = newChooser;
    if(newChooser!==prevChooser && mySide===newChooser && typeof battleStageId==="string" && battleStageId) this.myStage = battleStageId;
    this.myReady = false; this.oppReady = false; this._startSent = false;
  },

  _setupConn(conn){
    this.conn = conn; this._snapN = -1;
    conn.on("open", ()=>{ this.connected = true; this.sendLobby(); this._emitLobby(); });
    conn.on("data", (msg)=>{ if(!msg || typeof msg!=="object") return;
      /* 過時快照直接丟棄：只接受序號比已處理更新的，避免壅塞後抵達的舊狀態把人物拉回舊位置／舊姿勢 */
      if(msg.t==="snap" && msg.snap && typeof msg.snap.n==="number"){ if(msg.snap.n<=this._snapN) return; this._snapN=msg.snap.n; }
      if(msg.t==="lobby"){ /* 對手目前的選擇照單全收：對手可以先選隨機、之後再改選具體角色（或反過來），
           oppRandomLocked 在這裡只表示「對手目前是隨機狀態」，不是不可更改的鎖定。 */
        this.oppChar = msg.char; this.oppRandomLocked = (msg.char==="random"); this.oppReady = !!msg.ready; if(typeof msg.stage==="string") this.oppStage = msg.stage;
        /* 場地選擇權是全房間共享狀態，跟著大廳訊息同步（兩邊由同一場勝負算出，本來就一致；同步是雙保險） */
        if(msg.chooser===0 || msg.chooser===1) this.stageChooserSide = msg.chooser;
        if("lastLoser" in msg) this.lastLoserSide = (msg.lastLoser===0 || msg.lastLoser===1) ? msg.lastLoser : null;
        if(typeof msg.hasPlayed==="boolean") this.hasPlayed = msg.hasPlayed;
        this._emitLobby(); this._maybeStart(); }
      else if(msg.t==="start"){ /* 只接受已抽定的具體角色：start 若仍帶隨機哨兵或未知 id，視為無效／竄改封包直接丟棄，不開戰、不重抽 */
        const okChar=(v)=>typeof v==="string" && v!=="random" && (typeof fighterExists!=="function" || fighterExists(v));
        if(!okChar(msg.hostChar) || !okChar(msg.guestChar)) return;
        if(this.onMessage) this.onMessage(msg); }
      else if(msg.t==="tolobby"){ /* 對方在結算畫面按了「回線上房間」：先在連線層套用回房間
           狀態轉移（準備歸零＋下一場由上一局輸家選場地，輸家以發起方傳來的為準），
           再交給目前畫面的 onMessage 切回大廳；連線（peer/conn/邀請碼）全部保留不拆。 */
        this.applyReturnState((msg.loser===0 || msg.loser===1) ? msg.loser : null, typeof msg.stage==="string" ? msg.stage : null);
        if(this.onMessage) this.onMessage(msg); }
      else if(msg.t==="bye"){ if(this.onPeerLeft) this.onPeerLeft(); }
      else { if(this.onMessage) this.onMessage(msg); }
    });
    conn.on("close", ()=>{ this.connected=false; if(this.onPeerLeft) this.onPeerLeft(); });
    conn.on("error", ()=>{ this._fail("連線發生錯誤，請檢查網路後再試一次"); });
  },
  _maybeStart(){
    if(this.role!=="host") return;
    if(this._startSent) return;
    if(this.connected && this.myReady && this.oppReady && this.oppChar){
      /* 場景與隨機角色都由房主在開戰這一刻抽定：開戰當下仍是隨機選角（哨兵 "random"）的玩家
         在這裡才用 resolveFighterId 抽成具體角色，隨 start 訊息送出，
         房主本地也用同一份 msg 開戰，保證兩端是同一隻角色。
         _startSent 保證只抽定一次，之後的 lobby 更新不會重抽。 */
      const resolve=(v)=> (typeof resolveFighterId==="function" ? resolveFighterId(v) : v);
      /* 場地由「有選擇權的一方」決定：第一場／平手後是房主，回房間再戰時是上一局輸家。
         房主負責開戰，所以房主要讀對應來源——自己有選擇權時用 myStage，
         訪客有選擇權時用訪客透過大廳同步來的 oppStage；抽定後隨 start 送出，兩端同場。 */
      const stageSel = this.stageChooserSide===1 ? (this.oppStage || this.myStage) : this.myStage;
      const msg = { t:"start", hostChar:resolve(this.myChar), guestChar:resolve(this.oppChar), stage:(typeof resolveStageId==="function"?resolveStageId(stageSel):"neon") };
      this._startSent = true;
      this.send(msg);
      if(this.onMessage) this.onMessage(msg);
    }
  },
  /* 隨機只是目前的選擇狀態，隨時可改：setChar 改選具體角色並解除隨機狀態，setRandom 回到隨機狀態。
     myRandomLocked 欄位保留原名，語意改為「目前是隨機狀態（仍可改選）」。 */
  setChar(id){ if(id==="random"){ this.setRandom(); return; } this.myChar=id; this.myRandomLocked=false; this.sendLobby(); this._emitLobby(); },
  setRandom(){ this.myChar="random"; this.myRandomLocked=true; this.sendLobby(); this._emitLobby(); },
  setStage(id){ this.myStage=id; this.sendLobby(); this._emitLobby(); },
  setReady(r){ this.myReady=r; this.sendLobby(); this._emitLobby(); this._maybeStart(); },

  createRoom(charId, onCode, stageId){
    this.destroy();
    if(typeof Peer==="undefined"){ this._fail("連線元件載入失敗（PeerJS），請確認網路連線後重新整理頁面"); return; }
    this.role="host"; this.myChar=charId; this.myRandomLocked=(charId==="random"); this.oppRandomLocked=false; this._startSent=false; this.myStage=stageId||"neon"; this.oppStage=null; this.myReady=false; this.oppChar=null; this.oppReady=false; this.connected=false; this.stageChooserSide=0; this.lastLoserSide=null; this.hasPlayed=false; this.lastRoundTie=false;
    const tryOnce = (attempt)=>{
      const code = randomCode();
      this.code = code;
      const peer = new Peer(PEER_PREFIX+code);
      this.peer = peer;
      peer.on("open", ()=>{ if(onCode) onCode(code); this._emitLobby(); });
      peer.on("connection", (conn)=>{ this._setupConn(conn); });
      peer.on("error", (err)=>{
        if(err && err.type==="unavailable-id" && attempt<5){ try{peer.destroy();}catch(e){} tryOnce(attempt+1); return; }
        if(err && err.type==="network"){ this._fail("連不上連線服務，請檢查網路後再試一次"); return; }
        this._fail("建立房間失敗：" + (err && err.type ? err.type : "未知錯誤"));
      });
    };
    tryOnce(0);
  },

  joinRoom(code, charId, stageId){
    this.destroy();
    if(typeof Peer==="undefined"){ this._fail("連線元件載入失敗（PeerJS），請確認網路連線後重新整理頁面"); return; }
    code = (code||"").trim().toUpperCase();
    this.role="guest"; this.code=code; this.myChar=charId; this.myRandomLocked=(charId==="random"); this.oppRandomLocked=false; this._startSent=false; this.myStage=stageId||"neon"; this.oppStage=null; this.myReady=false; this.oppChar=null; this.oppReady=false; this.connected=false; this.stageChooserSide=0; this.lastLoserSide=null; this.hasPlayed=false; this.lastRoundTie=false;
    const peer = new Peer();
    this.peer = peer;
    const timer = setTimeout(()=>{ if(!this.connected) this._fail("找不到這個房間，請確認邀請碼正確、且房主還開著頁面"); }, 12000);
    peer.on("open", ()=>{
      const conn = peer.connect(PEER_PREFIX+code, { reliable:true });
      this._setupConn(conn);
    });
    peer.on("error", (err)=>{
      clearTimeout(timer);
      if(err && err.type==="peer-unavailable"){ this._fail("找不到這個房間，請確認邀請碼正確、且房主還開著頁面"); return; }
      if(err && err.type==="network"){ this._fail("連不上連線服務，請檢查網路後再試一次"); return; }
      this._fail("加入房間失敗：" + (err && err.type ? err.type : "未知錯誤"));
    });
  },

  destroy(){
    try{ if(this.conn) this.conn.close(); }catch(e){}
    try{ if(this.peer) this.peer.destroy(); }catch(e){}
    this.peer=null; this.conn=null; this.connected=false; this.oppChar=null; this.oppStage=null; this.myReady=false; this.oppReady=false; this._snapN=-1; this.myRandomLocked=false; this.oppRandomLocked=false; this._startSent=false; this.stageChooserSide=0; this.lastLoserSide=null; this.hasPlayed=false; this.lastRoundTie=false;
  }
};
