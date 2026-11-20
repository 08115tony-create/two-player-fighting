"use strict";
/* 合成 BGM + 音效（Web Audio，不需任何音檔）。BGM 預設關閉，只有按開關才播放。 */
class BgmEngine {
  constructor(){ this.ctx=null; this.master=null; this.musicBus=null; this.timer=null; this.step=0; this.nextTime=0; this.enabled=false; this.mode="menu"; this.started=false;
    this.roots=[110,110,87.31,98,110,110,87.31,82.41];
    this.chords=[[220,261.63,329.63],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[220,261.63,329.63],[220,261.63,329.63],[174.61,220,261.63],[164.81,207.65,246.94]];
    try{ const v=localStorage.getItem("neon-arena-bgm"); if(v==="1") this.enabled=true; else if(v==="0") this.enabled=false; }catch(e){}
  }
  unlock(){ if(typeof window==="undefined") return;
    if(!this.ctx){ try{ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.gain.value=0.5; this.master.connect(this.ctx.destination); this.musicBus=this.ctx.createGain(); this.musicBus.gain.value=this.enabled?1:0; this.musicBus.connect(this.master); }catch(e){ return; } }
    if(this.ctx.state==="suspended") this.ctx.resume().catch(()=>{});
    if(this.enabled && !this.started) this.startLoop();
  }
  setEnabled(on){ this.enabled=on; try{ localStorage.setItem("neon-arena-bgm", on?"1":"0"); }catch(e){}
    if(this.musicBus && this.ctx) this.musicBus.gain.setTargetAtTime(on?1:0, this.ctx.currentTime, 0.08);
    if(on) this.unlock(); }
  setMode(m){ this.mode=m; }
  get live(){ return this.started && this.enabled; }
  startLoop(){ if(!this.ctx||this.started) return; this.started=true; this.nextTime=this.ctx.currentTime+0.06; this.step=0;
    const tick=()=>{ if(!this.ctx) return; const bpm=this.mode==="battle"?142:116; const stepDur=60/bpm/2;
      while(this.nextTime < this.ctx.currentTime+0.14){ this.scheduleStep(this.step,this.nextTime,stepDur); this.nextTime+=stepDur; this.step=(this.step+1)%64; } };
    tick(); this.timer=window.setInterval(tick,42); }
  scheduleStep(step,t,stepDur){ if(!this.ctx||!this.master||!this.enabled) return;
    const bar=Math.floor(step/8), inBar=step%8, root=this.roots[bar]||110, chord=this.chords[bar]||[220,261.63,329.63], battle=this.mode==="battle";
    if(inBar%2===0) this.kick(t);
    if(inBar%2===1) this.hat(t, battle?0.05:0.03);
    if(battle && (inBar===2||inBar===6)) this.snare(t);
    this.tone(root,t,stepDur*0.92,"sawtooth",battle?0.16:0.11,root*0.5,this.musicBus);
    if(inBar===3||inBar===7) this.tone(root*1.5,t,stepDur*0.8,"sawtooth",0.08,root,this.musicBus);
    if(!battle && inBar===0){ for(const f of chord) this.tone(f,t,stepDur*7.5,"triangle",0.045,f*2,this.musicBus); }
    if(battle){ const arp=[...chord, chord[2]*2, chord[1]*2]; const n=arp[step%arp.length]||440; this.tone(n*2,t,stepDur*0.7,"square",0.035,n*4,this.musicBus); }
  }
  tone(freq,t,dur,type,vol,slideTo,dest){ if(!this.ctx||!this.master) return; const osc=this.ctx.createOscillator(), g=this.ctx.createGain(); osc.type=type; osc.frequency.setValueAtTime(freq,t); if(slideTo && slideTo!==freq) osc.frequency.exponentialRampToValueAtTime(Math.max(30,slideTo),t+dur); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.012); g.gain.exponentialRampToValueAtTime(0.001,t+dur); osc.connect(g); g.connect(dest||this.master); osc.start(t); osc.stop(t+dur+0.05); }
  noise(t,dur,vol,highpass,dest){ if(!this.ctx||!this.master) return; const len=Math.max(1,Math.floor(this.ctx.sampleRate*dur)); const buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate); const d=buf.getChannelData(0); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len); const src=this.ctx.createBufferSource(); src.buffer=buf; const fl=this.ctx.createBiquadFilter(); fl.type="highpass"; fl.frequency.value=highpass; const g=this.ctx.createGain(); g.gain.value=vol; src.connect(fl); fl.connect(g); g.connect(dest||this.master); src.start(t); }
  kick(t){ if(!this.ctx||!this.musicBus) return; const osc=this.ctx.createOscillator(), g=this.ctx.createGain(); osc.type="sine"; osc.frequency.setValueAtTime(150,t); osc.frequency.exponentialRampToValueAtTime(42,t+0.11); g.gain.setValueAtTime(0.5,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.13); osc.connect(g); g.connect(this.musicBus); osc.start(t); osc.stop(t+0.15); }
  hat(t,vol){ this.noise(t,0.04,vol,7000,this.musicBus); }
  snare(t){ this.noise(t,0.09,0.1,1600,this.musicBus); }
  sfxTone(a,b,dur,type,vol){ if(!this.ctx||!this.master) return; this.tone(a,this.ctx.currentTime,dur,type,vol,b); }
  playHit(heavy){ if(!this.ctx) return; const t=this.ctx.currentTime; this.noise(t,heavy?0.16:0.08,heavy?0.34:0.2,500); this.sfxTone(heavy?160:240,60,heavy?0.18:0.1,"square",heavy?0.22:0.12); }
  playBlock(){ this.sfxTone(520,340,0.07,"triangle",0.12); }
  playUlt(){ if(!this.ctx) return; const t=this.ctx.currentTime; this.tone(180,t,0.42,"sawtooth",0.2,980); this.tone(90,t,0.42,"square",0.12,490); this.noise(t+0.3,0.3,0.2,300); }
  playKo(){ if(!this.ctx) return; const t=this.ctx.currentTime; this.tone(392,t,0.16,"square",0.16); this.tone(311,t+0.16,0.16,"square",0.16); this.tone(233,t+0.32,0.42,"square",0.18,116); this.noise(t,0.5,0.16,240); }
  playSelect(){ this.sfxTone(660,880,0.09,"triangle",0.14); }
  playCount(fin){ this.sfxTone(fin?880:440,fin?880:440,fin?0.28:0.12,"square",0.14); }
}
const bgm = new BgmEngine();
