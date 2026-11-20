import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import PixelArt from './PixelArt';
import PixelHero from './PixelHero';
import { ROBOT_PALETTE, ROBOT_ROWS } from '../lib/sprites';
import { sfx } from '../lib/sfx';
import { useTypewriter } from '../lib/useTypewriter';

/** วางฮีโร่ 3 ตัว; focus = ตัวที่ถูกเน้น (ตัวอื่นหรี่ลง), delayed = ให้เดินเข้าฉากทีละตัว */
function Heroes({ focus, enter }: { focus?: 1 | 2 | 3; enter?: boolean }) {
  return (
    <div className="flex items-end justify-center gap-4 md:gap-10">
      {([1, 2, 3] as const).map((v, i) => (
        <span
          key={v}
          className={`inline-block transition-all duration-500 ${enter ? 'story-rise' : ''} ${
            focus && focus !== v ? 'opacity-30 grayscale' : focus === v ? 'scale-110' : ''
          }`}
          style={enter ? { animationDelay: `${i * 0.6}s` } : undefined}
        >
          <PixelHero variant={v} size={7} />
        </span>
      ))}
    </div>
  );
}

function Robot({ awake }: { awake?: boolean }) {
  return (
    <span className={`inline-block ${awake ? 'hero-bob' : 'robot-sleep'}`}>
      <PixelArt rows={ROBOT_ROWS} palette={ROBOT_PALETTE} size={9} title="หุ่นยนต์ผู้ช่วย" />
    </span>
  );
}

interface Scene {
  chapter: string;
  text: string;
  scene: ReactNode;
}

// เนื้อเรื่องเปิดเกม: ใช้ข้อมูลจริงของทีม (ชื่อ สาขา บทบาท ผลงาน) เติมสีสันด้วยฉากสมมุติ
const SCENES: Scene[] = [
  {
    chapter: 'PROLOGUE',
    text: 'เมืองหลับใหลไปหมดแล้ว… เหลือแค่ห้องแล็บเดียวที่ไฟยังติดอยู่',
    scene: <p className="font-pixel text-3xl md:text-5xl text-hero-gold blink-soft">03:07</p>,
  },
  {
    chapter: 'CHAPTER 1 · THE TEAM',
    text: 'ข้างในมีนักศึกษา AI & Data Science สามคน กาแฟเย็นไปนานแล้ว แต่พวกเขายัง… "ยังไม่ได้นอน"',
    scene: <Heroes enter />,
  },
  {
    chapter: 'PLAYER 1 · เพชร',
    text: 'เพชร อัศวินแห่งโค้ด เขียนได้ทั้งหน้าบ้านและหลังบ้าน แถมสอนให้ AI รู้จักทั้งทีม',
    scene: <Heroes focus={1} />,
  },
  {
    chapter: 'PLAYER 2 · พีซ',
    text: 'พีซ จอมปราชญ์ข้อมูล ท่อข้อมูลของเขาไหลเองอัตโนมัติ ไม่ต้องรอให้ใครมานั่งทำมือ',
    scene: <Heroes focus={2} />,
  },
  {
    chapter: 'PLAYER 3 · กัน',
    text: 'กัน นักบินโดรน ดูแลหน้าตาเว็บให้สวย และวิเคราะห์ข้อมูลจากภารกิจบินได้ทุกเที่ยว',
    scene: <Heroes focus={3} />,
  },
  {
    chapter: 'CHAPTER 2 · THE QUEST',
    text: 'คืนนี้พวกเขามีภารกิจเดียว สร้าง AI ที่รู้จักทั้งทีมดีกว่าใคร… แล้วหน้าจอก็สว่างวาบ',
    scene: <Robot />,
  },
  {
    chapter: 'FINAL SCENE',
    text: 'หุ่นยนต์ลืมตาขึ้น "สวัสดี ผมคือผู้ช่วยของทีม ยังไม่ได้นอน ถามผมได้ทุกเรื่อง ยินดีต้อนรับสู่ PIXEL HERO QUEST!"',
    scene: <Robot awake />,
  },
];

const DWELL_MS = 1500; // พักหลังพิมพ์จบก่อนขึ้นฉากถัดไป

function SceneView({ scene, onNext }: { scene: Scene; onNext: () => void }) {
  const { shown, done, skip } = useTypewriter(scene.text, true, 30);

  // เล่นต่อเองเมื่อพิมพ์จบ
  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(onNext, DWELL_MS);
    return () => window.clearTimeout(id);
  }, [done, onNext]);

  return (
    <div
      className="w-full max-w-3xl cursor-pointer story-fade"
      onClick={() => (done ? onNext() : skip())}
      role="button"
      tabIndex={-1}
    >
      <p className="font-pixel text-[9px] md:text-xs text-hero-cyan tracking-widest text-center mb-6">{scene.chapter}</p>
      <div className="min-h-[210px] flex items-end justify-center mb-6">{scene.scene}</div>
      <div className="pixel-box pixel-box--cyan p-5 text-sm md:text-base leading-relaxed min-h-[110px]">
        <span className="name-tag font-pixel">STORY</span>
        <p className={done ? '' : 'type-cursor'}>{shown}</p>
      </div>
    </div>
  );
}

/* ฉากเปิดเรื่องที่เล่นต่อเองทีละฉาก: แตะเพื่อเร่ง, SKIP หรือ Esc เพื่อข้ามทั้งหมด */
export default function IntroStory({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    if (index >= SCENES.length - 1) {
      onFinish();
      return;
    }
    sfx.confirm();
    setIndex(index + 1);
  }, [index, onFinish]);

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

      <SceneView key={index} scene={SCENES[index]} onNext={next} />

      <div className="mt-6 flex items-center gap-3">
        {SCENES.map((_, i) => (
          <span
            key={i}
            className={`inline-block h-2 w-2 ${i === index ? 'bg-hero-gold' : 'bg-slate-600'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
