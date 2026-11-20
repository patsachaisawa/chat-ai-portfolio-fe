// อ่านคำตอบของ AI ออกเสียงด้วย Web Speech API ของเบราว์เซอร์ (ฟรี ไม่ผ่านเซิร์ฟเวอร์)
// เสียงภาษาไทยที่มีให้ใช้ขึ้นกับอุปกรณ์/เบราว์เซอร์ จึงตรวจก่อนว่ามีเสียงไทยหรือไม่
import { useEffect, useState } from 'react';

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** ตัด markdown และอีโมจิออก เหลือข้อความที่อ่านออกเสียงได้ */
export function toSpeakable(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#>~]/g, '')
    .replace(/^\s*(?:[-+]|\d+[.)])\s+/gm, '')
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** แบ่งเป็นท่อนสั้นๆ เพราะบางเบราว์เซอร์ตัดเสียงทิ้งถ้าอ่านยาวเกินไป */
function chunk(text: string, max = 160): string[] {
  const out: string[] = [];
  for (const line of text.split(/\n+/)) {
    let rest = line.trim();
    while (rest.length > max) {
      const cut = rest.lastIndexOf(' ', max);
      const at = cut > max / 2 ? cut : max;
      out.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) out.push(rest);
  }
  return out;
}

// ให้คะแนนเสียงไทย: เสียงแบบ Neural/Natural/Online (เช่นของ Edge, Google) ฟังเป็นธรรมชาติกว่าเสียงในเครื่องรุ่นเก่า
function voiceScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;
  if (/natural|neural|online|premium|enhanced/.test(name)) score += 10;
  if (/google/.test(name)) score += 6;
  if (/premwadee|niwat|kanya|narisa/.test(name)) score += 3;
  if (!v.localService) score += 2;
  return score;
}

function thaiVoice(): SpeechSynthesisVoice | undefined {
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('th'))
    .sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}

export type ThaiVoiceState = 'unknown' | 'yes' | 'no';

/** มีเสียงภาษาไทยในอุปกรณ์นี้หรือไม่ (รายการเสียงโหลดทีหลัง จึงฟังเหตุการณ์ voiceschanged) */
export function useThaiVoice(): ThaiVoiceState {
  const [state, setState] = useState<ThaiVoiceState>('unknown');
  useEffect(() => {
    if (!speechSupported) return;
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      setState(thaiVoice() ? 'yes' : 'no');
    };
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, []);
  return state;
}

export function stopSpeaking(): void {
  if (speechSupported) window.speechSynthesis.cancel();
}

/** เริ่มอ่าน; onEnd ถูกเรียกเมื่อจบ ถูกหยุด หรือเกิดข้อผิดพลาด */
export function speak(markdown: string, onEnd: () => void): void {
  if (!speechSupported) return onEnd();
  const parts = chunk(toSpeakable(markdown));
  if (parts.length === 0) return onEnd();
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = thaiVoice();
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part);
    u.lang = 'th-TH';
    if (voice) u.voice = voice;
    u.rate = 0.95; // ช้าลงนิดหน่อยให้ฟังเป็นจังหวะคนพูด
    u.pitch = 1;
    if (i === parts.length - 1) u.onend = onEnd;
    u.onerror = onEnd;
    synth.speak(u);
  });
}
