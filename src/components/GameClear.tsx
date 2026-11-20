import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PixelHero from './PixelHero';

const SITE_URL = 'https://chat-ai-portfolio-fe.vercel.app';

const CREW = [
  { variant: 1 as const, name: 'เพชร', cls: 'CODE KNIGHT' },
  { variant: 2 as const, name: 'พีซ', cls: 'DATA SAGE' },
  { variant: 3 as const, name: 'กัน', cls: 'DRONE PILOT' },
];

/* หน้าจบเกมเมื่อเคลียร์ครบทุกภารกิจ: เครดิตทีม + QR code เข้าเว็บ */
export default function GameClear({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0b0a24]/95 px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="จบเกม"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p className="font-pixel text-[10px] text-hero-cyan tracking-widest">★ ALL MISSIONS CLEARED ★</p>
        <h2 className="pixel-title !font-game text-5xl md:text-7xl font-bold">GAME CLEAR!</h2>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed">
          ขอบคุณที่ผจญภัยไปกับทีม <span className="text-hero-gold font-bold">ยังไม่ได้นอน</span> จนจบทุกภารกิจ
        </p>

        <div className="flex items-end justify-center gap-6 md:gap-10">
          {CREW.map((c) => (
            <div key={c.variant} className="flex flex-col items-center gap-2">
              <PixelHero variant={c.variant} size={6} />
              <span className="font-pixel text-[9px] text-hero-gold">{c.name}</span>
              <span className="font-pixel text-[7px] text-slate-400">{c.cls}</span>
            </div>
          ))}
        </div>

        <div className="pixel-box pixel-box--gold p-4 flex flex-col items-center gap-3">
          <span className="name-tag font-pixel">SCAN TO PLAY</span>
          <img
            src="/qr.png"
            alt={`QR code ไปที่ ${SITE_URL}`}
            width={192}
            height={192}
            className="bg-white"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-xs text-slate-300 break-all">{SITE_URL}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={onClose} className="pixel-btn pixel-btn--gold font-pixel text-[10px]">
            ▶ คุยกับ AI ต่อ
          </button>
          <Link to="/" className="pixel-btn font-pixel text-[10px]">
            ◀ กลับหน้า HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
