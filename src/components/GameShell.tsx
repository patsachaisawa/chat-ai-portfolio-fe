import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PixelBackground from './PixelBackground';
import { GameFxContext } from '../lib/gameFx';
import { hasAchievement, saveAchievement } from '../lib/achievements';
import { useKonami } from '../lib/useKonami';
import { isMuted, setMuted, sfx } from '../lib/sfx';

interface Toast {
  key: string;
  title: string;
  desc: string;
}

const CONFETTI_COLORS = ['#ffd23f', '#27c4e8', '#ff4d8d', '#ff7a1a', '#ffffff'];
// สร้างแบบกำหนดตายตัว (ไม่สุ่มตอน render) เพื่อให้ผลเหมือนเดิมทุกครั้ง
const CONFETTI = Array.from({ length: 32 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 8) * 0.07,
  size: 8 + (i % 3) * 4,
  duration: 1.2 + (i % 5) * 0.2,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

// ครอบทั้งเว็บ: ฉากหลัง, ปุ่มเปิด/ปิดเสียง, Achievement toast, เอฟเฟกต์ Power-up และรหัสลับ
export default function GameShell({ children }: { children: ReactNode }) {
  const [powerUpId, setPowerUpId] = useState(0);
  const [powerUpOn, setPowerUpOn] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [muted, setMutedState] = useState(isMuted);
  const powerUpTimer = useRef(0);

  const triggerPowerUp = useCallback(() => {
    sfx.levelUp();
    setPowerUpId((n) => n + 1);
    setPowerUpOn(true);
    window.clearTimeout(powerUpTimer.current);
    powerUpTimer.current = window.setTimeout(() => setPowerUpOn(false), 2400);
  }, []);

  const unlock = useCallback((id: string, title: string, desc: string) => {
    if (hasAchievement(id)) return;
    saveAchievement(id);
    sfx.levelUp();
    const key = `${id}-${Date.now()}`;
    setToasts((list) => [...list, { key, title, desc }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.key !== key)), 4200);
  }, []);

  useEffect(() => () => window.clearTimeout(powerUpTimer.current), []);

  useKonami(() => {
    triggerPowerUp();
    unlock('konami', 'SECRET UNLOCKED', 'คุณเจอรหัสลับแล้ว!');
  });

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sfx.confirm();
  };

  const value = useMemo(() => ({ triggerPowerUp, unlock }), [triggerPowerUp, unlock]);

  return (
    <GameFxContext.Provider value={value}>
      <PixelBackground />
      <div className="relative z-10 min-h-dvh">{children}</div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
        title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
        className="pixel-btn pixel-btn--sm fixed bottom-4 right-4 z-[70]"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <div className="fixed top-20 right-3 z-[70] flex flex-col gap-3" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.key} className="toast pixel-box pixel-box--gold px-4 py-3 max-w-[260px]">
            <p className="font-pixel text-[9px] text-hero-gold mb-1">★ ACHIEVEMENT</p>
            <p className="font-bold text-sm text-white">{t.title}</p>
            <p className="text-xs text-slate-300">{t.desc}</p>
          </div>
        ))}
      </div>

      {powerUpOn && (
        <div key={powerUpId} className="powerup" aria-hidden="true">
          <div className="powerup-flash" />
          <div className="powerup-text font-pixel">LEVEL UP!</div>
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="confetti"
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.size,
                background: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
        </div>
      )}
    </GameFxContext.Provider>
  );
}
