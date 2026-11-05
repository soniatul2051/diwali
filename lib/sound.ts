"use client";

class DiwaliSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Starts muted until user explicitly enables or interacts with toggle
  private isMusicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private listeners: Set<(enabled: boolean) => void> = new Set();

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(!this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const enabled = !this.isMuted;
    this.listeners.forEach((fn) => fn(enabled));
  }

  public isSoundEnabled(): boolean {
    return !this.isMuted;
  }

  public toggleSound(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      this.startBackgroundMusic();
      this.playDiyaChime(0);
    } else {
      this.stopBackgroundMusic();
    }
    this.notify();
    return !this.isMuted;
  }

  public enableSoundOnInteraction() {
    if (!this.isMuted) {
      this.initContext();
      if (!this.isMusicPlaying) {
        this.startBackgroundMusic();
      }
    }
  }

  /**
   * Soft festive Indian ambient music (Raga Yaman / Bhupali inspired pentatonic sitar-harp + warm tanpura drone)
   */
  public startBackgroundMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.isMusicPlaying = true;

    // Create warm Tanpura-style ambient drone (Sa + Pa: C3 & G3)
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 2.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    droneGain.connect(filter);
    filter.connect(ctx.destination);

    const freqs = [130.81, 196.0, 261.63]; // C3, G3, C4
    const oscs: OscillatorNode[] = [];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 2 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1) * 4, ctx.currentTime);
      osc.connect(droneGain);
      osc.start();
      oscs.push(osc);
    });

    this.droneGain = droneGain;
    this.droneOscs = oscs;

    // Gentle melodic Santoor/Sitar notes in Raga Bhupali (C, D, E, G, A)
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    let step = 0;
    const pattern = [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 7, 5, 4, 2, 0];

    const playPluck = () => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const noteFreq = scale[pattern[step % pattern.length]];
      step++;

      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const bandpass = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      subOsc.type = "sine";
      osc.frequency.setValueAtTime(noteFreq, now);
      subOsc.frequency.setValueAtTime(noteFreq * 2, now);

      bandpass.type = "lowpass";
      bandpass.frequency.setValueAtTime(noteFreq * 3.5, now);
      bandpass.frequency.exponentialRampToValueAtTime(noteFreq * 1.2, now + 1.8);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

      osc.connect(bandpass);
      subOsc.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 2.2);
      subOsc.stop(now + 2.2);
    };

    playPluck();
    this.musicInterval = window.setInterval(playPluck, 1400);
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      } catch {
        // ignore
      }
    }
    const oscsToStop = this.droneOscs;
    this.droneOscs = [];
    setTimeout(() => {
      oscsToStop.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
    }, 450);
  }

  /**
   * Magical harmonic chime when a diya lights up
   */
  public playDiyaChime(pitchOffset = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 major pentatonic sparkle
    const multiplier = Math.pow(1.059463, pitchOffset);

    baseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * multiplier, now + i * 0.055);

      gain.gain.setValueAtTime(0.0001, now + i * 0.055);
      gain.gain.linearRampToValueAtTime(0.06 / (i * 0.5 + 1), now + i * 0.055 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.055 + 1.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.055);
      osc.stop(now + i * 0.055 + 1.3);
    });
  }

  /**
   * Spark / fuse burning sizzle sound
   */
  public playSparkSound(durationSec = 1.6) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle modulation
      const burst = Math.random() > 0.82 ? 1.0 : 0.25;
      data[i] = (Math.random() * 2 - 1) * burst;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(2.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.09, now + durationSec * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + durationSec);
  }

  /**
   * Big celebratory Firecracker "BOOM!" + celebratory crackle
   */
  public playExplosionSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Sub-bass punch
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.65);

    subGain.gain.setValueAtTime(0.45, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.8);

    // 2. Explosion broadband noise burst
    const duration = 1.4;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.pow(1 - i / bufferSize, 1.6);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1800, now);
    lowpass.frequency.exponentialRampToValueAtTime(180, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.38, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);

    // 3. Secondary aerial crackle pops
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playFireworkBurst(0.6);
      }, 220 + i * 160);
    }
  }

  /**
   * Subtle firework burst sound for the Fireworks Playground
   */
  public playFireworkBurst(volumeScale = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.45;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900 + Math.random() * 900, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14 * volumeScale, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }
}

export const soundEngine = new DiwaliSoundEngine();
