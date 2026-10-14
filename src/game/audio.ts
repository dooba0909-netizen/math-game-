class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private volume: number = 0.5;

  private bgmOsc1: OscillatorNode | null = null;
  private bgmOsc2: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isEnabled = true;
    this.startBGM();
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
      return true;
    }
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.isEnabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    }
  }

  public startBGM() {
    if (!this.ctx || !this.isEnabled || this.bgmOsc1) return;

    try {
      this.bgmOsc1 = this.ctx.createOscillator();
      this.bgmOsc2 = this.ctx.createOscillator();
      this.bgmGain = this.ctx.createGain();
      this.bgmFilter = this.ctx.createBiquadFilter();

      this.bgmFilter.type = 'lowpass';
      this.bgmFilter.frequency.value = 240;
      this.bgmFilter.Q.value = 3;

      this.bgmOsc1.type = 'sawtooth';
      this.bgmOsc2.type = 'sine';

      this.bgmOsc1.frequency.value = 55; // Low A
      this.bgmOsc2.frequency.value = 54.4; // Detuned eerie beating

      this.bgmGain.gain.value = 0.08 * this.volume;

      this.bgmOsc1.connect(this.bgmFilter);
      this.bgmOsc2.connect(this.bgmFilter);
      this.bgmFilter.connect(this.bgmGain);
      this.bgmGain.connect(this.ctx.destination);

      this.bgmOsc1.start();
      this.bgmOsc2.start();

      // Atmospheric slow breathing LFO
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.value = 0.12; // ~8 second breath cycle
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.value = 0.04 * this.volume;

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.bgmGain.gain);
      this.lfo.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopBGM() {
    try {
      if (this.bgmOsc1) { this.bgmOsc1.stop(); this.bgmOsc1.disconnect(); this.bgmOsc1 = null; }
      if (this.bgmOsc2) { this.bgmOsc2.stop(); this.bgmOsc2.disconnect(); this.bgmOsc2 = null; }
      if (this.bgmFilter) { this.bgmFilter.disconnect(); this.bgmFilter = null; }
      if (this.bgmGain) { this.bgmGain.disconnect(); this.bgmGain = null; }
      if (this.lfo) { this.lfo.stop(); this.lfo.disconnect(); this.lfo = null; }
      if (this.lfoGain) { this.lfoGain.disconnect(); this.lfoGain = null; }
    } catch {
      // safe cleanup
    }
  }

  public play(type: string) {
    if (!this.isEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      if (type === 'blip') {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260 + Math.random() * 40, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.008 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'objective') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.linearRampToValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.linearRampToValueAtTime(783.99, now + 0.3); // G5
        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'success') {
        // Ethereal chord
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.08 * this.volume, now + idx * 0.04);
          gain.gain.linearRampToValueAtTime(0, now + 0.8);
          osc.start(now + idx * 0.04);
          osc.stop(now + 0.8);
        });
      } else if (type === 'error') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
        gain.gain.setValueAtTime(0.12 * this.volume, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'shatter') {
        // Occult seal shatter: noise burst + diving saw
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
        gain.gain.setValueAtTime(0.25 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'locked') {
        // Wooden door rattle / locked iron deadbolt
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.12);
        filter.type = 'lowpass';
        filter.frequency.value = 280;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.18 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'door') {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(45, now + 0.4);
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'heavy') {
        // Deep ominous boom
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);
        gain.gain.setValueAtTime(0.35 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'step') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120 + Math.random() * 40, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
        gain.gain.setValueAtTime(0.04 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'heartbeat') {
        // Double beat: lub-dub
        [0, 0.18].forEach((offset) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(65, now + offset);
          osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.12);
          gain.gain.setValueAtTime(0.3 * this.volume, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
          osc.start(now + offset);
          osc.stop(now + offset + 0.12);
        });
      }
    } catch {
      // safe audio error suppression
    }
  }
}

export const audio = new SoundEngine();
