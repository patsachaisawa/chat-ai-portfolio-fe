import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import PixelArt from './PixelArt';
import PixelHero from './PixelHero';
import { ROBOT_PALETTE, ROBOT_ROWS } from '../lib/sprites';
import { sfx } from '../lib/sfx';
import { useTypewriter } from '../lib/useTypewriter';

interface Panel {
  chapter: string;
  text: string;
  scene: ReactNode;
}

const heroRow = (
  <div className="flex items-end justify-center gap-4 md:gap-8">
    <PixelHero variant={1} size={7} />
    <PixelHero variant={2} size={7} />
    <PixelHero variant={3} size={7} />
  </div>
);

const robot = (
  <span className="hero-bob inline-block">
    <PixelArt rows={ROBOT_ROWS} palette={ROBOT_PALETTE} size={9} title="หุ่นยนต์ผู้ช่วย" />
  </span>
);

// เนื้อเรื่องสั้นๆ 4 ฉาก (ไม่แต่งข้อมูลจริงของทีมเพิ่ม)
const PANELS: Panel[] = [
  {
    chapter: 'CHAPTER 1 · 03:00 น.',
    text: 'ตีสาม… ห้องแล็บที่ไฟยังไม่เคยดับ มีสามคนยังนั่งจ้องหน้าจออยู่',
    scene: heroRow,
  },
  {
    chapter: 'CHAPTER 2 · THE TEAM',
    text: 'เพชร พีซ และกัน นักศึกษา AI & Data Science ผู้ได้ฉายาว่า "ยังไม่ได้นอน"',
    scene: heroRow,
  },
  {
    chapter: 'CHAPTER 3 · THE QUEST',
    text: 'ภารกิจของพวกเขาคือสร้าง AI ผู้ช่วยที่รู้จักทั้งทีมดีที่สุด ให้ใครก็ถามเรื่องทักษะและผลงานได้ทันที',
    scene: robot,
  },
  {
    chapter: 'CHAPTER 4 · START',
    text: 'แล้ว NPC ผู้ช่วยก็ตื่นขึ้น… คุณพร้อมจะผจญภัยไปกับพวกเขาหรือยัง?',
    scene: (
      <div className="flex items-end justify-center gap-6">
        <PixelHero variant={1} size={7} />
        {robot}
      </div>
    ),
  },
];

function PanelView({ panel, onNext }: { panel: Panel; onNext: () => void }) {
  const { shown, done, skip } = useTypewriter(panel.text, true, 32);
  return (
    <div
      className="w-full max-w-3xl cursor-pointer"
      onClick={() => (done ? onNext() : skip())}
      role="button"
      tabIndex={-1}
    >
      <p className="font-pixel text-[9px] md:text-xs text-hero-cyan tracking-widest text-center mb-6">{panel.chapter}</p>
      <div className="min-h-[200px] flex items-end justify-center mb-6">{panel.scene}</div>
      <div className="pixel-box pixel-box--cyan p-5 text-sm md:text-base leading-relaxed min-h-[96px]">
        <span className="name-tag font-pixel">STORY</span>
        <p className={done ? 'dialog-next' : 'type-cursor'}>{shown}</p>
      </div>
    </div>
  );
}

/* ฉากเปิดเรื่อง: แตะ/Enter/Space เพื่อไปต่อ, SKIP เพื่อข้ามทั้งหมด */
export default function IntroStory({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const last = index === PANELS.length - 1;

  const next = useCallback(() => {
    sfx.confirm();
    if (last) onFinish();
    else setIndex((i) => i + 1);
  }, [last, onFinish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFinish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onFinish]);

  return (
    <section className="min-h-dvh flex flex-col items-center justify-center px-6 py-10 relative">
      <button
        type="button"
        onClick={onFinish}
        className="pixel-btn pixel-btn--sm font-pixel text-[9px] absolute top-4 right-4"
      >
        SKIP ▶▶
      </button>

      <PanelView key={index} panel={PANELS[index]} onNext={next} />

      <div className="mt-6 flex items-center gap-3">
        {PANELS.map((_, i) => (
          <span
            key={i}
            className={`inline-block h-2 w-2 ${i === index ? 'bg-hero-gold' : 'bg-slate-600'}`}
            aria-hidden="true"
          />
        ))}
      </div>

      {last && (
        <button type="button" onClick={next} className="pixel-btn pixel-btn--gold font-pixel text-xs mt-6 blink-soft">
          ▶ เริ่มผจญภัย
        </button>
      )}
    </section>
  );
}
