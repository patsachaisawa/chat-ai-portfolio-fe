// เอฟเฟกต์เสียงแบบเกม 8-bit สร้างด้วย Web Audio (ไม่ต้องใช้ไฟล์เสียง)
// เล่นได้หลังผู้ใช้โต้ตอบครั้งแรกเท่านั้น (ข้อกำหนดของเบราว์เซอร์) และปิดเสียงได้

const MUTE_KEY = 'sfx_muted';

let ctx: AudioContext | null = null;
let unlocked = false;

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

let muted = readMuted();

if (typeof window !== 'undefined') {
  const unlock = () => {
    unlocked = true;
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    // ไม่เป็นไร ถ้าเก็บค่าไม่ได้
  }
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'square', volume = 0.04): void {
  const c = getContext();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t0 = c.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration);
}

function play(fn: () => void): void {
  if (muted || !unlocked) return;
  try {
    fn();
  } catch {
    // เสียงเป็นแค่ลูกเล่น ห้ามทำให้แอปพัง
  }
}

export const sfx = {
  select: () => play(() => tone(660, 0, 0.06)),
  confirm: () =>
    play(() => {
      tone(523, 0, 0.08);
      tone(784, 0.08, 0.12);
    }),
  talk: () => play(() => tone(280 + Math.random() * 140, 0, 0.03, 'square', 0.02)),
  levelUp: () =>
    play(() => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.12));
    }),
  error: () =>
    play(() => {
      tone(220, 0, 0.1, 'sawtooth');
      tone(165, 0.1, 0.16, 'sawtooth');
    }),
};
