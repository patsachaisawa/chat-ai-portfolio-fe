import { useCallback, useEffect, useMemo, useState } from 'react';
import { sfx } from './sfx';

/**
 * เอฟเฟกต์พิมพ์ดีดแบบกล่องบทสนทนาในเกม
 * - enabled=false จะแสดงข้อความเต็มทันที
 * - ใช้ Array.from เพื่อไม่ตัดกลางอีโมจิ
 * - skip() ข้ามแอนิเมชันได้
 */
export function useTypewriter(text: string, enabled: boolean, speed = 22) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const active = enabled && !skipped;

  useEffect(() => {
    if (!active) return;
    // ข้อความยาวพิมพ์ทีละหลายตัวอักษร จะได้ไม่ช้าเกินไป
    const chunk = Math.max(1, Math.ceil(chars.length / 220));
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(i + chunk, chars.length);
      setCount(i);
      if (i % 4 === 0) sfx.talk();
      if (i >= chars.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [active, chars, speed]);

  const skip = useCallback(() => setSkipped(true), []);

  const finished = !enabled || skipped || count >= chars.length;
  const shown = finished ? text : chars.slice(0, count).join('');

  return { shown, done: finished, skip };
}
