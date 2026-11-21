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
  shuo: {
    idle: { src: "assets/anim/shuo-idle.webp", relH: 1.0, anchorX: 0.515, aspect: 0.6222 },
    walk1: { src: "assets/anim/shuo-walk1.webp", relH: 0.9955, anchorX: 0.495, aspect: 0.7455 },
    walk2: { src: "assets/anim/shuo-walk2.webp", relH: 1.0, anchorX: 0.4991, aspect: 0.8054 },
    punch: { src: "assets/anim/shuo-punch.webp", relH: 0.9548, anchorX: 0.4713, aspect: 0.981 },
    kick: { src: "assets/anim/shuo-kick.webp", relH: 1.0023, anchorX: 0.3938, aspect: 0.9549 },
    cast: { src: "assets/anim/shuo-cast.webp", relH: 1.0068, anchorX: 0.4895, aspect: 0.7124 },
    crouch: { src: "assets/anim/shuo-crouch.webp", relH: 0.7443, anchorX: 0.5504, aspect: 1.0456 },
    jump: { src: "assets/anim/shuo-jump.webp", relH: 0.8303, anchorX: 0.5401, aspect: 0.8283 },
    hurt: { src: "assets/anim/shuo-hurt.webp", relH: 0.9344, anchorX: 0.464, aspect: 0.6659 },
    lunge: { src: "assets/anim/shuo-lunge.webp", relH: 0.8688, anchorX: 0.4596, aspect: 1.1589 },
    ko: { src: "assets/anim/shuo-ko.webp", relH: 0.3032, anchorX: 0.4946, aspect: 3.5746 },
    charge: { src: "assets/anim/shuo-charge.webp", relH: 0.9819, anchorX: 0.5282, aspect: 1.0622 },
  },
  zero: {
    idle: { src: "assets/anim/zero-idle.webp", relH: 1.0, anchorX: 0.4984, aspect: 0.6239 },
    walk1: { src: "assets/anim/zero-walk1.webp", relH: 1.0043, anchorX: 0.4401, aspect: 0.6766 },
    walk2: { src: "assets/anim/zero-walk2.webp", relH: 0.9957, anchorX: 0.4254, aspect: 0.6996 },
    punch: { src: "assets/anim/zero-punch.webp", relH: 0.9786, anchorX: 0.4533, aspect: 0.9301 },
    kick: { src: "assets/anim/zero-kick.webp", relH: 0.985, anchorX: 0.3781, aspect: 0.8829 },
    cast: { src: "assets/anim/zero-cast.webp", relH: 0.9979, anchorX: 0.4947, aspect: 0.6874 },
    crouch: { src: "assets/anim/zero-crouch.webp", relH: 0.7692, anchorX: 0.5047, aspect: 1.1083 },
    jump: { src: "assets/anim/zero-jump.webp", relH: 1.0, anchorX: 0.5502, aspect: 0.7308 },
    hurt: { src: "assets/anim/zero-hurt.webp", relH: 1.0064, anchorX: 0.4187, aspect: 0.8705 },
    lunge: { src: "assets/anim/zero-lunge.webp", relH: 1.0064, anchorX: 0.4661, aspect: 0.9915 },
    ko: { src: "assets/anim/zero-ko.webp", relH: 0.3932, anchorX: 0.4943, aspect: 2.6793 },
    charge: { src: "assets/anim/zero-charge.webp", relH: 1.0064, anchorX: 0.5432, aspect: 0.9575 },
  },
  pan: {
    idle: { src: "assets/anim/pan-idle.webp", relH: 1.0, anchorX: 0.5173, aspect: 0.8345 },
    walk1: { src: "assets/anim/pan-walk1.webp", relH: 1.0, anchorX: 0.504, aspect: 0.6946 },
    walk2: { src: "assets/anim/pan-walk2.webp", relH: 1.007, anchorX: 0.5077, aspect: 0.7454 },
    punch: { src: "assets/anim/pan-punch.webp", relH: 0.8951, anchorX: 0.5322, aspect: 1.2161 },
    kick: { src: "assets/anim/pan-kick.webp", relH: 0.9837, anchorX: 0.4557, aspect: 1.0379 },
    cast: { src: "assets/anim/pan-cast.webp", relH: 0.9794, anchorX: 0.5624, aspect: 1.1391 },
    crouch: { src: "assets/anim/pan-crouch.webp", relH: 0.7156, anchorX: 0.4935, aspect: 1.1336 },
    jump: { src: "assets/anim/pan-jump.webp", relH: 0.9744, anchorX: 0.5187, aspect: 1.0215 },
    hurt: { src: "assets/anim/pan-hurt.webp", relH: 0.9184, anchorX: 0.5388, aspect: 0.8832 },
    lunge: { src: "assets/anim/pan-lunge.webp", relH: 0.8765, anchorX: 0.5381, aspect: 1.2739 },
    ko: { src: "assets/anim/pan-ko.webp", relH: 0.3939, anchorX: 0.5291, aspect: 2.8166 },
    charge: { src: "assets/anim/pan-charge.webp", relH: 0.949, anchorX: 0.5555, aspect: 1.2074 },
  },
  guren: {
    idle: { src: "assets/anim/guren-idle.webp", relH: 1.0, anchorX: 0.5079, aspect: 0.6103 },
    walk1: { src: "assets/anim/guren-walk1.webp", relH: 0.9979, anchorX: 0.4497, aspect: 0.6502 },
    walk2: { src: "assets/anim/guren-walk2.webp", relH: 0.9936, anchorX: 0.4416, aspect: 0.6832 },
    punch: { src: "assets/anim/guren-punch.webp", relH: 0.9036, anchorX: 0.4872, aspect: 1.0592 },
    kick: { src: "assets/anim/guren-kick.webp", relH: 0.9872, anchorX: 0.4212, aspect: 0.9154 },
    cast: { src: "assets/anim/guren-cast.webp", relH: 0.9657, anchorX: 0.4893, aspect: 0.8736 },
    crouch: { src: "assets/anim/guren-crouch.webp", relH: 0.7987, anchorX: 0.4959, aspect: 0.8043 },
    jump: { src: "assets/anim/guren-jump.webp", relH: 1.0364, anchorX: 0.4975, aspect: 0.6178 },
    hurt: { src: "assets/anim/guren-hurt.webp", relH: 0.848, anchorX: 0.5627, aspect: 0.8889 },
    lunge: { src: "assets/anim/guren-lunge.webp", relH: 0.7687, anchorX: 0.4901, aspect: 1.3621 },
    ko: { src: "assets/anim/guren-ko.webp", relH: 0.2441, anchorX: 0.5128, aspect: 4.3246 },
    charge: { src: "assets/anim/guren-charge.webp", relH: 1.0021, anchorX: 0.5644, aspect: 0.953 },
  },
  kagami: {
    idle: { src: "assets/anim/kagami-idle.webp", relH: 1.0, anchorX: 0.4867, aspect: 0.6584 },
    walk1: { src: "assets/anim/kagami-walk1.webp", relH: 0.9932, anchorX: 0.4755, aspect: 0.7221 },
    walk2: { src: "assets/anim/kagami-walk2.webp", relH: 0.9864, anchorX: 0.4867, aspect: 0.7706 },
    punch: { src: "assets/anim/kagami-punch.webp", relH: 0.8914, anchorX: 0.4806, aspect: 1.1574 },
    kick: { src: "assets/anim/kagami-kick.webp", relH: 0.957, anchorX: 0.4576, aspect: 1.1017 },
    cast: { src: "assets/anim/kagami-cast.webp", relH: 0.9434, anchorX: 0.5176, aspect: 1.0671 },
    crouch: { src: "assets/anim/kagami-crouch.webp", relH: 0.7624, anchorX: 0.509, aspect: 1.1454 },
    jump: { src: "assets/anim/kagami-jump.webp", relH: 0.9231, anchorX: 0.545, aspect: 0.8897 },
    hurt: { src: "assets/anim/kagami-hurt.webp", relH: 0.8937, anchorX: 0.4971, aspect: 0.9899 },
    lunge: { src: "assets/anim/kagami-lunge.webp", relH: 0.8281, anchorX: 0.4609, aspect: 1.3306 },
    ko: { src: "assets/anim/kagami-ko.webp", relH: 0.3258, anchorX: 0.5096, aspect: 3.6667 },
    charge: { src: "assets/anim/kagami-charge.webp", relH: 0.9887, anchorX: 0.5334, aspect: 1.1053 },
  },
  yulan: {
    idle: { src: "assets/anim/yulan-idle.webp", relH: 1.0, anchorX: 0.4913, aspect: 0.4913 },
    walk1: { src: "assets/anim/yulan-walk1.webp", relH: 0.9957, anchorX: 0.4824, aspect: 0.6201 },
    walk2: { src: "assets/anim/yulan-walk2.webp", relH: 0.9761, anchorX: 0.4566, aspect: 0.6659 },
    punch: { src: "assets/anim/yulan-punch.webp", relH: 0.9196, anchorX: 0.475, aspect: 0.9669 },
    kick: { src: "assets/anim/yulan-kick.webp", relH: 0.9826, anchorX: 0.3978, aspect: 0.8938 },
    cast: { src: "assets/anim/yulan-cast.webp", relH: 0.9348, anchorX: 0.5114, aspect: 0.993 },
    crouch: { src: "assets/anim/yulan-crouch.webp", relH: 0.7674, anchorX: 0.4787, aspect: 0.9802 },
    jump: { src: "assets/anim/yulan-jump.webp", relH: 0.8543, anchorX: 0.4332, aspect: 0.9008 },
    hurt: { src: "assets/anim/yulan-hurt.webp", relH: 0.8261, anchorX: 0.4556, aspect: 0.9553 },
    lunge: { src: "assets/anim/yulan-lunge.webp", relH: 0.8783, anchorX: 0.4736, aspect: 1.1485 },
    ko: { src: "assets/anim/yulan-ko.webp", relH: 0.2717, anchorX: 0.5447, aspect: 3.832 },
    charge: { src: "assets/anim/yulan-charge.webp", relH: 0.9543, anchorX: 0.506, aspect: 0.9886 },
  },
};
const ALL_POSES = ['idle','walk1','walk2','punch','kick','cast','crouch','jump','hurt','lunge','ko','charge'];
const PORTRAITS = { kaze:'assets/kaze.webp', gouki:'assets/gouki.webp', titan:'assets/titan.webp', yuki:'assets/yuki.webp', raiden:'assets/raiden.webp', sakura:'assets/sakura.webp', shuo:'assets/shuo.webp', zero:'assets/zero.webp', pan:'assets/pan.webp', guren:'assets/guren.webp', kagami:'assets/kagami.webp', yulan:'assets/yulan.webp' };
const BATTLE_SPRITES = { kaze:'assets/battle-kaze.webp', gouki:'assets/battle-gouki.webp', titan:'assets/battle-titan.webp', yuki:'assets/battle-yuki.webp', raiden:'assets/battle-raiden.webp', sakura:'assets/battle-sakura.webp', shuo:'assets/battle-shuo.webp', zero:'assets/battle-zero.webp', pan:'assets/battle-pan.webp', guren:'assets/battle-guren.webp', kagami:'assets/battle-kagami.webp', yulan:'assets/battle-yulan.webp' };
const ARENA_BG = 'assets/arena-bg.webp';
/* 對戰場景：6 個場景 + 隨機。開戰前在選角畫面／主選單挑選，再戰沿用同一場景；
   線上對戰由房主決定，房主的選擇會透過大廳同步給對手，開戰訊息帶場景 id，
   雙方看到同一個場景。glowL/glowR 是擂台地面兩側的光線顏色，
   shadeTop/shadeBot 是背景壓暗漸層（亮色場景壓重一點，人物才站得穩）。 */
const STAGES = [
  { id:"neon", name:"霓虹擂台", en:"NEON ARENA", desc:"賽博龐克霓虹競技場，雨夜裡的圓形發光舞台", src:"assets/arena-bg.webp", thumb:"assets/stage-neon-thumb.webp", glowL:"rgba(34,211,238,0.55)", glowR:"rgba(255,77,46,0.55)", shadeTop:0.18, shadeBot:0.34, buffFighter:"kaze" },
  { id:"volcano", name:"熔核火山", en:"MAGMA VOLCANO", desc:"熔岩環繞的黑曜石擂台，火山正在噴發", src:"assets/stage-volcano.webp", thumb:"assets/stage-volcano-thumb.webp", glowL:"rgba(249,115,22,0.65)", glowR:"rgba(239,68,68,0.6)", shadeTop:0.20, shadeBot:0.36, buffFighter:"gouki" },
  { id:"ruins", name:"落日遺跡", en:"SUNSET RUINS", desc:"黃昏沙漠中的古代遺跡，巨像石柱環繞的石盤擂台", src:"assets/stage-ruins.webp", thumb:"assets/stage-ruins-thumb.webp", glowL:"rgba(251,191,36,0.55)", glowR:"rgba(45,212,191,0.45)", shadeTop:0.22, shadeBot:0.44, buffFighter:"titan" },
  { id:"ice", name:"極光冰宮", en:"AURORA ICE PALACE", desc:"極光之下的冰晶宮殿，凍湖之上的冰雪擂台", src:"assets/stage-ice.webp", thumb:"assets/stage-ice-thumb.webp", glowL:"rgba(125,211,252,0.6)", glowR:"rgba(167,139,250,0.5)", shadeTop:0.14, shadeBot:0.30, buffFighter:"yuki" },
  { id:"storm", name:"雷雲天台", en:"STORM ROOFTOP", desc:"雷暴之夜的高空天台，萬道落雷照亮夜空之城", src:"assets/stage-storm.webp", thumb:"assets/stage-storm-thumb.webp", glowL:"rgba(167,139,250,0.6)", glowR:"rgba(96,165,250,0.55)", shadeTop:0.18, shadeBot:0.34, buffFighter:"raiden" },
  { id:"shrine", name:"櫻月神社", en:"SAKURA SHRINE", desc:"月夜櫻花與燈籠環繞的神社石台，花瓣紛飛", src:"assets/stage-shrine.webp", thumb:"assets/stage-shrine-thumb.webp", glowL:"rgba(244,114,182,0.55)", glowR:"rgba(251,191,36,0.5)", shadeTop:0.20, shadeBot:0.36, buffFighter:"sakura" },
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
  { id:"shuo", name:"朔", title:"聖光騎士", special:true, desc:"特殊角色・無場地 BUFF。沐浴聖光的騎士，攻守均衡，大招能為自己回復 15% 生命，是越打越穩的續戰型戰士。", color:"#f5c542", accent:"#fef08a", maxHp:1470, stats:{atk:7,def:6,spd:6,hp:7}, walkSpeed:3.7, jumpPower:18.5,
    moves:[{name:"聖光斬擊",desc:"灌注聖光的利落斬擊",damage:70,range:80,cooldownMs:400,kind:"melee",knockback:5},{name:"審判衝鋒",desc:"披光突進，聖光軌跡灼傷路徑",damage:88,range:230,cooldownMs:1000,kind:"dash",knockback:7},{name:"光輝聖槍",desc:"擲出聖光長槍遠程貫穿",damage:76,range:16,cooldownMs:820,kind:"projectile",knockback:4}],
    ult:{name:"聖光再生",desc:"特殊大招：聖光灌注全身，立即回復 15% 生命",damage:0,range:0,cooldownMs:0,kind:"buff",effect:"heal"} },
  { id:"zero", name:"零", title:"時空行者", special:true, desc:"特殊角色・無場地 BUFF。穿梭時空的旅人，速度奇快，大招能讓對方的時間停止 2 秒，凍結期間任他宰割。", color:"#22d3ee", accent:"#a5f3fc", maxHp:1350, stats:{atk:7,def:4,spd:9,hp:5}, walkSpeed:4.4, jumpPower:19,
    moves:[{name:"時隙連打",desc:"在時間縫隙中打出的高速連拳",damage:54,range:76,cooldownMs:330,kind:"melee",knockback:3},{name:"相位瞬移斬",desc:"相位跳躍後瞬間斬擊",damage:86,range:250,cooldownMs:950,kind:"dash",knockback:6},{name:"時空裂彈",desc:"射出撕裂時空的能量彈",damage:64,range:15,cooldownMs:720,kind:"projectile",knockback:3}],
    ult:{name:"時空凝結",desc:"特殊大招：凝結對方的時間 2 秒，對方完全無法行動",damage:0,range:0,cooldownMs:0,kind:"buff",effect:"timestop",durationMs:2000} },
  { id:"pan", name:"磐", title:"不滅守衛", special:true, desc:"特殊角色・無場地 BUFF。人如其名堅如磐石，防禦與血量頂尖，大招開啟 3 秒無敵，金身不壞。", color:"#fb923c", accent:"#fed7aa", maxHp:1650, stats:{atk:6,def:9,spd:3,hp:9}, walkSpeed:2.8, jumpPower:19.5,
    moves:[{name:"盾牆猛擊",desc:"以巨盾正面猛砸，沉重無比",damage:90,range:82,cooldownMs:540,kind:"melee",knockback:8},{name:"大地崩擊",desc:"盾擊地面，衝擊波沿地面擴散",damage:84,range:185,cooldownMs:1000,kind:"strike",knockback:6},{name:"鐵壁衝撞",desc:"舉盾全速衝撞，霸體突進",damage:88,range:220,cooldownMs:1080,kind:"dash",knockback:10}],
    ult:{name:"不滅金身",desc:"特殊大招：進入 3 秒真正無敵——不受任何傷害、不被擊退或打斷，也免疫時間停止、大招封印等一切控制效果",damage:0,range:0,cooldownMs:0,kind:"buff",effect:"invincible",durationMs:3000} },
  { id:"guren", name:"紅蓮", title:"緋焰舞者", special:true, desc:"特殊角色・無場地 BUFF。舞動緋焰的女武者，大招解放後 5 秒內攻擊變 2 倍，火力全開無人能擋。", color:"#ef4444", accent:"#fca5a5", maxHp:1335, stats:{atk:8,def:4,spd:8,hp:5}, walkSpeed:4.2, jumpPower:19,
    moves:[{name:"緋焰連拳",desc:"纏繞火焰的快速連拳",damage:58,range:76,cooldownMs:340,kind:"melee",knockback:3},{name:"紅蓮旋踢",desc:"火焰回旋踢，範圍又大又燙",damage:82,range:96,cooldownMs:640,kind:"melee",knockback:7},{name:"爆裂火球",desc:"擲出會爆裂的火球",damage:72,range:15,cooldownMs:780,kind:"projectile",knockback:4}],
    ult:{name:"狂焰解放",desc:"特殊大招：緋焰全開，5 秒內攻擊變 2 倍",damage:0,range:0,cooldownMs:0,kind:"buff",effect:"atkboost",durationMs:5000} },
  { id:"kagami", name:"鏡", title:"鏡返巫女", special:true, desc:"特殊角色・無場地 BUFF。持鏡的巫女，攻守兼備，大招張開 3 秒鏡返結界，把受到的傷害反彈回給對方。", color:"#94a3ff", accent:"#e0e7ff", maxHp:1440, stats:{atk:6,def:7,spd:5,hp:7}, walkSpeed:3.4, jumpPower:18.5,
    moves:[{name:"鏡光掌",desc:"鏡光一閃的快速掌擊",damage:62,range:78,cooldownMs:380,kind:"melee",knockback:4},{name:"八咫鏡波",desc:"銅鏡射出折射光波",damage:74,range:16,cooldownMs:800,kind:"projectile",knockback:4},{name:"鏡影突襲",desc:"借鏡影瞬移突襲",damage:84,range:240,cooldownMs:980,kind:"dash",knockback:6}],
    ult:{name:"鏡返結界",desc:"特殊大招：張開結界 3 秒，受到的傷害全數反彈給攻擊者",damage:0,range:0,cooldownMs:0,kind:"buff",effect:"reflect",durationMs:3000} },
  { id:"yulan", name:"幽蘭", title:"封印歌姬", special:true, desc:"特殊角色・無場地 BUFF。以歌聲牽制敵人的歌姬：三招普通招式都只造成傷害、不帶任何封印；只有大招「絕響封印」能封印對方，施放後對方 10 秒內無法開啟大招，只能用普通招式。", color:"#facc15", accent:"#fef9c3", maxHp:1395, stats:{atk:6,def:5,spd:7,hp:6}, walkSpeed:3.8, jumpPower:18.5,
    moves:[{name:"蘭音掌",desc:"帶著音波的優雅掌擊，純傷害",damage:60,range:78,cooldownMs:370,kind:"melee",knockback:4},{name:"音波音符",desc:"射出音波音符牽制遠方，純音波傷害",damage:66,range:15,cooldownMs:740,kind:"projectile",knockback:3},{name:"絕響震波",desc:"高歌震波，在對手位置炸開，純傷害",damage:84,range:250,cooldownMs:1000,kind:"strike",knockback:5}],
    ult:{name:"絕響封印",desc:"特殊大招：封印之歌讓敵人 10 秒內無法開啟大招",damage:0,range:0,cooldownMs:0,kind:"buff",effect:"ultlock",durationMs:10000} },
];
/* 普通三招永遠不帶特殊效果：封印、時間停止、無敵、反彈、攻擊×2、回復等效果
   只能由大招（ult.effect）觸發。資料載入時就把 moves 上若誤寫的 effect／durationMs
   清掉，確保任何角色的普通招式命中都不會附加效果——例如幽蘭只有大招「絕響封印」
   能封印對方大招，她的蘭音掌／音波音符／絕響震波都只是純傷害招式。 */
for(const f of FIGHTERS){ for(const m of f.moves){ if("effect" in m) delete m.effect; if("durationMs" in m) delete m.durationMs; } }
/* 主場 BUFF：原本 6 位角色各自有一個主場，在主場出戰時四項性能（攻擊／防禦／速度／生命）+5%。
   場地順序已照 BUFF 對應角色（颯・剛・巖・雪莉・雷藏・櫻）排列。特殊角色（special:true）沒有主場 BUFF。 */
const HOME_STAGE = { kaze:"neon", gouki:"volcano", titan:"ruins", yuki:"ice", raiden:"storm", sakura:"shrine" };
for(const f of FIGHTERS){ if(HOME_STAGE[f.id]) f.homeStage = HOME_STAGE[f.id]; }
function stageBuffApplies(fighterId, stageId){ return !!fighterId && HOME_STAGE[fighterId]===stageId; }
function buffedDef(def, stageId){
  if(!def || !stageBuffApplies(def.id, stageId)) return def;
  const c = Object.assign({}, def);
  c.stats = { atk:+(def.stats.atk*1.05).toFixed(3), def:+(def.stats.def*1.05).toFixed(3), spd:+(def.stats.spd*1.05).toFixed(3), hp:+(def.stats.hp*1.05).toFixed(3) };
  c.maxHp = Math.round(def.maxHp*1.05);
  c.walkSpeed = +(def.walkSpeed*1.05).toFixed(3);
  c.stageBuff = true;
  return c;
}
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
