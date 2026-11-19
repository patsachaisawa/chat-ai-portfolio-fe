import { useEffect, useMemo, useState } from 'react';
import PixelArt from './PixelArt';
import { buildHeroRows, HERO_PALETTES } from '../lib/sprites';

export type HeroMood = 'idle' | 'think' | 'talk';

interface PixelHeroProps {
  mood?: HeroMood;
  /** 1 = ชุดฟ้า-ส้ม, 2 = ชุดชมพู-ฟ้า */
  variant?: 1 | 2;
  size?: number;
  bob?: boolean;
  className?: string;
}

// ฮีโร่พิกเซลต้นฉบับ: กระพริบตาเอง, อ้าปากเมื่อ talk, มีฟองคำถามเมื่อ think
export default function PixelHero({ mood = 'idle', variant = 1, size = 8, bob = true, className = '' }: PixelHeroProps) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    let timeout = 0;
    const schedule = () => {
      timeout = window.setTimeout(
        () => {
          setBlink(true);
          timeout = window.setTimeout(() => {
            setBlink(false);
            schedule();
          }, 140);
        },
        2200 + Math.random() * 1800,
      );
    };
    schedule();
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (mood !== 'talk') return;
    const id = window.setInterval(() => setMouthOpen((open) => !open), 160);
    return () => {
      window.clearInterval(id);
      setMouthOpen(false);
    };
  }, [mood]);

  const rows = useMemo(() => buildHeroRows(blink, mouthOpen), [blink, mouthOpen]);

  return (
    <span className={`relative inline-block ${bob ? 'hero-bob' : ''} ${className}`}>
      {mood === 'think' && <span className="think-bubble font-pixel">?</span>}
      <PixelArt rows={rows} palette={HERO_PALETTES[variant]} size={size} title="ฮีโร่พิกเซล" />
    </span>
  );
}
