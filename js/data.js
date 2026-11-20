"use strict";
/* 角色資料與每姿勢影格資料（與 Muse 版相同） */
const ANIM_FRAMES = {
  kaze: {
    idle: { src: "assets/anim/kaze-idle.webp", relH: 1.0, anchorX: 0.3353, aspect: 0.7282 },
    walk1: { src: "assets/anim/kaze-walk1.webp", relH: 1.002, anchorX: 0.4958, aspect: 0.7368 },
    walk2: { src: "assets/anim/kaze-walk2.webp", relH: 0.998, anchorX: 0.5181, aspect: 0.7398 },
    punch: { src: "assets/anim/kaze-punch.webp", relH: 0.8864, anchorX: 0.4183, aspect: 1.0275 },
    kick: { src: "assets/anim/kaze-kick.webp", relH: 0.9919, anchorX: 0.2537, aspect: 0.8384 },
    cast: { src: "assets/anim/kaze-cast.webp", relH: 0.8966, anchorX: 0.4359, aspect: 0.9751 },
    crouch: { src: "assets/anim/kaze-crouch.webp", relH: 0.7282, anchorX: 0.5084, aspect: 0.9415 },
    jump: { src: "assets/anim/kaze-jump.webp", relH: 0.8357, anchorX: 0.682, aspect: 0.767 },
    hurt: { src: "assets/anim/kaze-hurt.webp", relH: 0.7566, anchorX: 0.5839, aspect: 1.0643 },
    lunge: { src: "assets/anim/kaze-lunge.webp", relH: 0.8195, anchorX: 0.2358, aspect: 1.005 },
    ko: { src: "assets/anim/kaze-ko.webp", relH: 0.3306, anchorX: 0.608, aspect: 3.8466 },
    charge: { src: "assets/anim/kaze-charge.webp", relH: 1.0061, anchorX: 0.4456, aspect: 0.7903 },
  },
  gouki: {
    idle: { src: "assets/anim/gouki-idle.webp", relH: 1.0, anchorX: 0.5251, aspect: 0.6745 },
    walk1: { src: "assets/anim/gouki-walk1.webp", relH: 1.002, anchorX: 0.5213, aspect: 0.6438 },
    walk2: { src: "assets/anim/gouki-walk2.webp", relH: 1.0039, anchorX: 0.5238, aspect: 0.6719 },
    punch: { src: "assets/anim/gouki-punch.webp", relH: 0.702, anchorX: 0.3858, aspect: 1.162 },
    kick: { src: "assets/anim/gouki-kick.webp", relH: 0.7608, anchorX: 0.374, aspect: 1.0026 },
    cast: { src: "assets/anim/gouki-cast.webp", relH: 0.9118, anchorX: 0.5005, aspect: 0.8538 },
    crouch: { src: "assets/anim/gouki-crouch.webp", relH: 0.8, anchorX: 0.514, aspect: 0.7426 },
    jump: { src: "assets/anim/gouki-jump.webp", relH: 0.92, anchorX: 0.554, aspect: 0.5703 },
    hurt: { src: "assets/anim/gouki-hurt.webp", relH: 0.7333, anchorX: 0.6011, aspect: 1.1711 },
    lunge: { src: "assets/anim/gouki-lunge.webp", relH: 0.798, anchorX: 0.2753, aspect: 0.973 },
    ko: { src: "assets/anim/gouki-ko.webp", relH: 0.3373, anchorX: 0.3809, aspect: 3.0058 },
    charge: { src: "assets/anim/gouki-charge.webp", relH: 0.9118, anchorX: 0.5005, aspect: 0.8538 },
  },
  titan: {
    idle: { src: "assets/anim/titan-idle.webp", relH: 1.0, anchorX: 0.5174, aspect: 0.6695 },
    walk1: { src: "assets/anim/titan-walk1.webp", relH: 1.0254, anchorX: 0.5234, aspect: 0.7128 },
    walk2: { src: "assets/anim/titan-walk2.webp", relH: 1.0191, anchorX: 0.5389, aspect: 0.7318 },
    punch: { src: "assets/anim/titan-punch.webp", relH: 0.8983, anchorX: 0.4418, aspect: 1.092 },
    kick: { src: "assets/anim/titan-kick.webp", relH: 1.0508, anchorX: 0.3322, aspect: 0.871 },
    cast: { src: "assets/anim/titan-cast.webp", relH: 0.9089, anchorX: 0.4884, aspect: 1.0373 },
    crouch: { src: "assets/anim/titan-crouch.webp", relH: 0.8093, anchorX: 0.4991, aspect: 0.8586 },
    jump: { src: "assets/anim/titan-jump.webp", relH: 1.0636, anchorX: 0.3409, aspect: 0.5697 },
    hurt: { src: "assets/anim/titan-hurt.webp", relH: 0.911, anchorX: 0.6328, aspect: 1.1209 },
    lunge: { src: "assets/anim/titan-lunge.webp", relH: 0.7458, anchorX: 0.2687, aspect: 1.2926 },
    ko: { src: "assets/anim/titan-ko.webp", relH: 0.375, anchorX: 0.6069, aspect: 2.774 },
    charge: { src: "assets/anim/titan-charge.webp", relH: 0.8686, anchorX: 0.5022, aspect: 1.0049 },
  },
  yuki: {
    idle: { src: "assets/anim/yuki-idle.webp", relH: 1.0, anchorX: 0.4599, aspect: 0.6011 },
    walk1: { src: "assets/anim/yuki-walk1.webp", relH: 0.9559, anchorX: 0.5386, aspect: 0.6231 },
    walk2: { src: "assets/anim/yuki-walk2.webp", relH: 0.9798, anchorX: 0.4657, aspect: 0.6079 },
    punch: { src: "assets/anim/yuki-punch.webp", relH: 0.8033, anchorX: 0.4756, aspect: 0.9725 },
    kick: { src: "assets/anim/yuki-kick.webp", relH: 0.818, anchorX: 0.361, aspect: 1.036 },
    cast: { src: "assets/anim/yuki-cast.webp", relH: 0.8309, anchorX: 0.4308, aspect: 0.8695 },
    crouch: { src: "assets/anim/yuki-crouch.webp", relH: 0.6526, anchorX: 0.4984, aspect: 0.8817 },
    jump: { src: "assets/anim/yuki-jump.webp", relH: 0.8603, anchorX: 0.4402, aspect: 0.7521 },
    hurt: { src: "assets/anim/yuki-hurt.webp", relH: 0.6746, anchorX: 0.5605, aspect: 1.1281 },
    lunge: { src: "assets/anim/yuki-lunge.webp", relH: 0.6746, anchorX: 0.2313, aspect: 1.2861 },
    ko: { src: "assets/anim/yuki-ko.webp", relH: 0.3364, anchorX: 0.3225, aspect: 3.0984 },
    charge: { src: "assets/anim/yuki-charge.webp", relH: 0.7886, anchorX: 0.4835, aspect: 0.8322 },
  },
  raiden: {
    idle: { src: "assets/anim/raiden-idle.webp", relH: 1.0, anchorX: 0.5423, aspect: 0.6457 },
    walk1: { src: "assets/anim/raiden-walk1.webp", relH: 1.0121, anchorX: 0.5256, aspect: 0.58 },
    walk2: { src: "assets/anim/raiden-walk2.webp", relH: 1.0202, anchorX: 0.5366, aspect: 0.6726 },
    punch: { src: "assets/anim/raiden-punch.webp", relH: 0.8745, anchorX: 0.2861, aspect: 0.9769 },
    kick: { src: "assets/anim/raiden-kick.webp", relH: 0.998, anchorX: 0.3695, aspect: 0.9716 },
    cast: { src: "assets/anim/raiden-cast.webp", relH: 0.9474, anchorX: 0.4687, aspect: 0.8141 },
    crouch: { src: "assets/anim/raiden-crouch.webp", relH: 0.7794, anchorX: 0.4135, aspect: 0.774 },
    jump: { src: "assets/anim/raiden-jump.webp", relH: 0.8765, anchorX: 0.3869, aspect: 0.5612 },
    hurt: { src: "assets/anim/raiden-hurt.webp", relH: 0.6984, anchorX: 0.5645, aspect: 1.1652 },
    lunge: { src: "assets/anim/raiden-lunge.webp", relH: 0.8664, anchorX: 0.1777, aspect: 0.9836 },
    ko: { src: "assets/anim/raiden-ko.webp", relH: 0.332, anchorX: 0.6233, aspect: 3.4573 },
    charge: { src: "assets/anim/raiden-charge.webp", relH: 1.0202, anchorX: 0.5421, aspect: 0.7937 },
  },
  sakura: {
    idle: { src: "assets/anim/sakura-idle.webp", relH: 1.0, anchorX: 0.5393, aspect: 0.7799 },
    walk1: { src: "assets/anim/sakura-walk1.webp", relH: 0.9963, anchorX: 0.5368, aspect: 0.7809 },
    walk2: { src: "assets/anim/sakura-walk2.webp", relH: 1.0093, anchorX: 0.5582, aspect: 0.7579 },
    punch: { src: "assets/anim/sakura-punch.webp", relH: 0.8246, anchorX: 0.5015, aspect: 1.0995 },
    kick: { src: "assets/anim/sakura-kick.webp", relH: 0.916, anchorX: 0.3301, aspect: 0.947 },
    cast: { src: "assets/anim/sakura-cast.webp", relH: 0.8228, anchorX: 0.4632, aspect: 1.1247 },
    crouch: { src: "assets/anim/sakura-crouch.webp", relH: 0.7332, anchorX: 0.434, aspect: 0.8041 },
    jump: { src: "assets/anim/sakura-jump.webp", relH: 0.9123, anchorX: 0.5219, aspect: 0.6769 },
    hurt: { src: "assets/anim/sakura-hurt.webp", relH: 0.75, anchorX: 0.6555, aspect: 1.102 },
    lunge: { src: "assets/anim/sakura-lunge.webp", relH: 0.7332, anchorX: 0.0735, aspect: 1.3282 },
    ko: { src: "assets/anim/sakura-ko.webp", relH: 0.3825, anchorX: 0.4958, aspect: 2.8927 },
    charge: { src: "assets/anim/sakura-charge.webp", relH: 0.8228, anchorX: 0.4632, aspect: 1.1247 },
  },
};
const ALL_POSES = ['idle','walk1','walk2','punch','kick','cast','crouch','jump','hurt','lunge','ko','charge'];
const PORTRAITS = { kaze:'assets/kaze.webp', gouki:'assets/gouki.webp', titan:'assets/titan.webp', yuki:'assets/yuki.webp', raiden:'assets/raiden.webp', sakura:'assets/sakura.webp' };
const BATTLE_SPRITES = { kaze:'assets/battle-kaze.webp', gouki:'assets/battle-gouki.webp', titan:'assets/battle-titan.webp', yuki:'assets/battle-yuki.webp', raiden:'assets/battle-raiden.webp', sakura:'assets/battle-sakura.webp' };
const ARENA_BG = 'assets/arena-bg.webp';
/* 對戰場景：6 個場景 + 隨機。開戰前在選角畫面／主選單挑選，再戰沿用同一場景；
   線上對戰由房主決定，房主的選擇會透過大廳同步給對手，開戰訊息帶場景 id，
   雙方看到同一個場景。glowL/glowR 是擂台地面兩側的光線顏色，
   shadeTop/shadeBot 是背景壓暗漸層（亮色場景壓重一點，人物才站得穩）。 */
const STAGES = [
  { id:"neon", name:"霓虹擂台", en:"NEON ARENA", desc:"賽博龐克霓虹競技場，雨夜裡的圓形發光舞台", src:"assets/arena-bg.webp", thumb:"assets/stage-neon-thumb.webp", glowL:"rgba(34,211,238,0.55)", glowR:"rgba(255,77,46,0.55)", shadeTop:0.18, shadeBot:0.34 },
  { id:"shrine", name:"櫻月神社", en:"SAKURA SHRINE", desc:"月夜櫻花與燈籠環繞的神社石台，花瓣紛飛", src:"assets/stage-shrine.webp", thumb:"assets/stage-shrine-thumb.webp", glowL:"rgba(244,114,182,0.55)", glowR:"rgba(251,191,36,0.5)", shadeTop:0.20, shadeBot:0.36 },
  { id:"ice", name:"極光冰宮", en:"AURORA ICE PALACE", desc:"極光之下的冰晶宮殿，凍湖之上的冰雪擂台", src:"assets/stage-ice.webp", thumb:"assets/stage-ice-thumb.webp", glowL:"rgba(125,211,252,0.6)", glowR:"rgba(167,139,250,0.5)", shadeTop:0.14, shadeBot:0.30 },
  { id:"volcano", name:"熔核火山", en:"MAGMA VOLCANO", desc:"熔岩環繞的黑曜石擂台，火山正在噴發", src:"assets/stage-volcano.webp", thumb:"assets/stage-volcano-thumb.webp", glowL:"rgba(249,115,22,0.65)", glowR:"rgba(239,68,68,0.6)", shadeTop:0.20, shadeBot:0.36 },
  { id:"storm", name:"雷雲天台", en:"STORM ROOFTOP", desc:"雷暴之夜的高空天台，萬道落雷照亮夜空之城", src:"assets/stage-storm.webp", thumb:"assets/stage-storm-thumb.webp", glowL:"rgba(167,139,250,0.6)", glowR:"rgba(96,165,250,0.55)", shadeTop:0.18, shadeBot:0.34 },
  { id:"ruins", name:"落日遺跡", en:"SUNSET RUINS", desc:"黃昏沙漠中的古代遺跡，巨像石柱環繞的石盤擂台", src:"assets/stage-ruins.webp", thumb:"assets/stage-ruins-thumb.webp", glowL:"rgba(251,191,36,0.55)", glowR:"rgba(45,212,191,0.45)", shadeTop:0.22, shadeBot:0.44 },
];
function stageById(id){ return STAGES.find(s=>s.id===id) || STAGES[0]; }
function stageExists(id){ return STAGES.some(s=>s.id===id); }
function resolveStageId(sel){ if(sel==="random"){ return STAGES[Math.floor(Math.random()*STAGES.length)].id; } return stageExists(sel)?sel:"neon"; }
const FIGHTERS = [
  { id:"kaze", name:"颯", title:"疾風忍者", desc:"來無影去無蹤的忍者，速度是全場最快，連段如暴風雨般壓得對手喘不過氣，但身板較脆。", color:"#22c55e", accent:"#bbf7d0", maxHp:1320, stats:{atk:6,def:4,spd:10,hp:5}, walkSpeed:4.6, jumpPower:19,
    moves:[{name:"疾風連拳",desc:"快如殘影的三連擊，出招最快",damage:52,range:78,cooldownMs:320,kind:"melee",knockback:3},{name:"影分身斬",desc:"化作殘影突進斬擊，中距離奇襲",damage:84,range:210,cooldownMs:900,kind:"dash",knockback:6},{name:"苦無投擲",desc:"擲出苦無遠程牽制",damage:62,range:15,cooldownMs:700,kind:"projectile",knockback:2}],
    ult:{name:"千影亂舞",desc:"千道分身同時斬擊，無處可逃的終極連段",damage:285,range:240,cooldownMs:0,kind:"dash",knockback:12} },
  { id:"gouki", name:"剛", title:"豪炎拳王", desc:"拳頭燃燒著火焰的格鬥家，攻守兼備、招招扎實，是最穩定的全能型戰士。", color:"#ef4444", accent:"#fde68a", maxHp:1530, stats:{atk:8,def:6,spd:6,hp:7}, walkSpeed:3.6, jumpPower:18.5,
    moves:[{name:"烈焰直拳",desc:"燃燒火焰的重直拳",damage:74,range:80,cooldownMs:420,kind:"melee",knockback:5},{name:"昇龍烈破",desc:"躍起的火焰上勾拳，專打空中對手",damage:98,range:84,cooldownMs:950,kind:"melee",knockback:8},{name:"爆炎波",desc:"雙掌轟出火焰衝擊波",damage:80,range:16,cooldownMs:850,kind:"projectile",knockback:5}],
    ult:{name:"爆裂熔核拳",desc:"將熔核之力灌入一拳，命中如火山爆發",damage:320,range:96,cooldownMs:0,kind:"melee",knockback:16} },
  { id:"titan", name:"巖", title:"鋼甲巨人", desc:"披著重甲的巨漢，血量與防禦冠絕全場，走得慢，但只要被他抓到一下就是重傷。", color:"#78716c", accent:"#facc15", maxHp:1720, stats:{atk:7,def:8,spd:3,hp:10}, walkSpeed:2.6, jumpPower:20,
    moves:[{name:"鐵鎚重擊",desc:"雙臂如鐵鎚砸下，威力驚人",damage:96,range:82,cooldownMs:560,kind:"melee",knockback:8},{name:"地震踐踏",desc:"重踏地面，衝擊波沿地面擴散",damage:88,range:190,cooldownMs:1000,kind:"strike",knockback:6},{name:"鋼肩衝鋒",desc:"以鋼肩全力衝撞，霸體突進",damage:92,range:230,cooldownMs:1100,kind:"dash",knockback:10}],
    ult:{name:"天崩地裂",desc:"躍起砸裂大地，全屏震波無可閃避",damage:300,range:999,cooldownMs:0,kind:"strike",knockback:14} },
  { id:"yuki", name:"雪莉", title:"冰雪女王", desc:"操縱寒冰的女王，遠程壓制與範圍攻擊出色，保持距離時幾乎無懈可擊。", color:"#38bdf8", accent:"#e0f2fe", maxHp:1380, stats:{atk:7,def:5,spd:6,hp:6}, walkSpeed:3.5, jumpPower:18.5,
    moves:[{name:"冰晶射擊",desc:"連射冰晶，射速極快",damage:48,range:17,cooldownMs:380,kind:"projectile",knockback:2},{name:"寒霜新星",desc:"以自身為中心爆發寒霜，擊退近身敵人",damage:82,range:120,cooldownMs:950,kind:"strike",knockback:9},{name:"冰錐突刺",desc:"地面竄出巨大冰錐突襲中距離",damage:90,range:250,cooldownMs:1000,kind:"strike",knockback:5}],
    ult:{name:"絕對零度",desc:"凍結整個擂台的極寒風暴，避無可避",damage:295,range:999,cooldownMs:0,kind:"strike",knockback:12} },
  { id:"raiden", name:"雷藏", title:"雷神傳人", desc:"繼承雷神之血的武者，瞬移與落雷讓對手永遠猜不到他下一秒在哪裡。", color:"#a855f7", accent:"#fde047", maxHp:1425, stats:{atk:8,def:5,spd:8,hp:6}, walkSpeed:4.1, jumpPower:19,
    moves:[{name:"雷光拳",desc:"纏繞雷電的快速刺拳",damage:64,range:78,cooldownMs:360,kind:"melee",knockback:4},{name:"落雷轟擊",desc:"召喚落雷直劈對手頭頂",damage:86,range:999,cooldownMs:1050,kind:"strike",knockback:3},{name:"電光瞬斬",desc:"化作電光瞬移突斬",damage:88,range:260,cooldownMs:950,kind:"dash",knockback:6}],
    ult:{name:"萬雷天牢",desc:"萬道天雷編成牢獄，連續轟擊對手",damage:310,range:999,cooldownMs:0,kind:"strike",knockback:10} },
  { id:"sakura", name:"櫻", title:"毒蠍刺客", desc:"笑容甜美的致命刺客，連刺帶毒、招招要害，暴擊時傷害翻倍，是高手向的角色。", color:"#ec4899", accent:"#a3e635", maxHp:1350, stats:{atk:7,def:4,spd:9,hp:5}, walkSpeed:4.3, jumpPower:19,
    moves:[{name:"毒牙連刺",desc:"匕首連刺，命中附加中毒",damage:46,range:74,cooldownMs:300,kind:"melee",knockback:2},{name:"蠍尾旋踢",desc:"如蠍尾般的回旋踢，範圍大",damage:80,range:98,cooldownMs:620,kind:"melee",knockback:7},{name:"毒霧彈",desc:"擲出毒霧彈，命中使對手持續中毒",damage:56,range:14,cooldownMs:800,kind:"projectile",knockback:2}],
    ult:{name:"緋紅葬送",desc:"以櫻花掩護的絕命一閃，必定暴擊",damage:335,range:220,cooldownMs:0,kind:"dash",knockback:12} },
];
function fighterById(id){ return FIGHTERS.find(f=>f.id===id) || FIGHTERS[0]; }
function fighterExists(id){ return FIGHTERS.some(f=>f.id===id); }
function randomFighterId(excludeId){ const pool=excludeId?FIGHTERS.filter(f=>f.id!==excludeId):FIGHTERS; const src=pool.length?pool:FIGHTERS; return src[Math.floor(Math.random()*src.length)].id; }
/* 隨機選角哨兵值："random" 只代表「目前選擇隨機」，本身不是角色，而且隨時可改選：
   玩家點其他角色就改成那一位、再點隨機就回到 "random"。選角／大廳階段
   只傳遞與顯示這個哨兵，任何畫面都不能用它查出角色；只有開戰那一刻
   （且當下仍是隨機）才呼叫 resolveFighterId 抽定具體角色（線上由房主在
   start 訊息中統一抽定並同步，兩端用同一個結果開戰）。 */
const RANDOM_CHAR="random";
function resolveFighterId(sel){ if(sel===RANDOM_CHAR){ return randomFighterId(); } return fighterExists(sel)?sel:FIGHTERS[0].id; }
