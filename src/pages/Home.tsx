import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Code2, Database, FolderGit2, Mail } from 'lucide-react';
import PixelArt from '../components/PixelArt';
import PixelHero from '../components/PixelHero';
import { ROBOT_PALETTE, ROBOT_ROWS } from '../lib/sprites';
import { useGameFx } from '../lib/gameFx';
import { useInView } from '../lib/useInView';
import { useTypewriter } from '../lib/useTypewriter';
import { sfx } from '../lib/sfx';

interface Project {
  title: string;
  category: string;
  tagColor: string;
  desc: string;
  link?: string;
}

interface SkillGroup {
  title: string;
  icon: 'brain' | 'code' | 'database';
  items: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  skills: SkillGroup[];
  projects: Project[];
}

const teamMembers: Member[] = [
  {
    id: 'patsachai',
    name: 'ภัทษชัย สว่างกัลป์',
    role: 'AI & Data Science Student / Full-Stack Developer',
    skills: [
      {
        title: 'AI & Data Science',
        icon: 'brain',
        items: 'Machine Learning, Time-Series Forecasting (Prophet), LLM Application Integration, Prompt Engineering',
      },
      {
        title: 'Full-Stack Web Dev',
        icon: 'code',
        items: 'React, TypeScript, Tailwind CSS, Node.js, Express.js, RESTful API Integration',
      },
      {
        title: 'Databases & DevOps',
        icon: 'database',
        items: 'PostgreSQL, Supabase, Python, Docker, Git / GitHub',
      },
    ],
    projects: [
      {
        title: 'AI Portfolio Chatbot',
        category: 'FEATURED',
        tagColor: 'text-blue-400',
        desc: 'ระบบแชตบอทอัจฉริยะตอบคำถามข้อมูลโปรไฟล์ส่วนตัว พัฒนาด้วย React, Express, Supabase Vector DB และ Gemini API',
        link: '/chat',
      },
      {
        title: 'HACK4HOPE Homeless Solutions',
        category: 'HACKATHON 2026',
        tagColor: 'text-emerald-400',
        desc: 'พัฒนาระบบแก้ไขปัญหาคนไร้บ้าน 4 มิติ ร่วมกับทีม "มีตัวตน" เชื่อมต่อระบบร้านรับซื้อของเก่าผ่าน Line OA',
      },
      {
        title: 'Superstore Sales Forecasting',
        category: 'DATA ANALYTICS',
        tagColor: 'text-purple-400',
        desc: 'แดชบอร์ดวิเคราะห์ยอดขายและพยากรณ์ยอดขายล่วงหน้า 7 วันด้วยโมเดล Prophet จากชุดข้อมูลซูเปอร์สโตร์ 4 ปี',
      },
    ],
  },
  {
    id: 'member2',
    name: 'ชื่อสมาชิกคนที่ 2',
    role: 'Frontend Developer / UI Specialist',
    skills: [
      {
        title: 'UI/UX & Design',
        icon: 'code',
        items: 'Figma, Responsive Design, Tailwind CSS, Component Library Design',
      },
      {
        title: 'Frontend Frameworks',
        icon: 'code',
        items: 'React, Next.js, TypeScript, State Management (Zustand/Redux)',
      },
      {
        title: 'Web Optimization',
        icon: 'database',
        items: 'Web Vitals, SEO Optimization, Cross-browser Testing',
      },
    ],
    projects: [
      {
        title: 'Shared Team Portfolio App',
        category: 'TEAM PROJECT',
        tagColor: 'text-amber-400',
        desc: 'ออกแบบและพัฒนา UI Component Library สำหรับเว็บไซต์พอร์ตโฟลิโอร่วมของทีม',
      },
    ],
  },
];

const START_KEY = 'pixel_started';
const WELCOME_TEXT =
  'ยินดีต้อนรับสู่พื้นที่รวบรวมทักษะและผลงานเด่น สามารถเลือกดูโปรไฟล์ของสมาชิกในทีม หรือทดลองพิมพ์สอบถามข้อมูลด้วย AI Assistant ได้ทันที';
const STAGE_TIPS = ['แตะฉันสิ!', 'ลองคุยกับ AI ดูนะ', 'มีรหัสลับซ่อนอยู่...', 'เลื่อนลงไปดูภารกิจ!'];
const SKILL_ACCENTS = ['pixel-box--cyan', 'pixel-box--gold', 'pixel-box--pink'];

function readStarted(): boolean {
  try {
    return sessionStorage.getItem(START_KEY) === '1';
  } catch {
    return false;
  }
}

function variantOf(index: number): 1 | 2 {
  return index % 2 === 0 ? 1 : 2;
}

/* ---------------- หน้าจอ Title: กด Start เพื่อเข้าเกม ---------------- */
function TitleScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  return (
    <section className="min-h-dvh flex flex-col items-center justify-center text-center px-6 py-10 gap-8">
      <div className="space-y-4">
        <p className="font-pixel text-[10px] md:text-xs text-hero-cyan tracking-widest">★ A PIXEL HERO ADVENTURE ★</p>
        <h1 className="pixel-title font-pixel text-2xl sm:text-4xl md:text-6xl leading-tight">
          AI
          <br />
          INNOVATORS
        </h1>
        <p className="font-pixel text-[10px] md:text-sm text-hero-gold">PIXEL HERO QUEST</p>
      </div>

      <PixelHero size={10} />

      <button type="button" onClick={onStart} className="pixel-btn pixel-btn--gold font-pixel text-xs md:text-sm blink-soft">
        PRESS START
      </button>
      <p className="text-xs text-slate-300">กด Enter / Space หรือแตะปุ่มเพื่อเริ่มเกม</p>
      <p className="font-pixel text-[8px] text-slate-400">© 2026 AI INNOVATORS TEAM</p>
    </section>
  );
}

/* ---------------- กล่องบทสนทนาแนะนำตัว (พิมพ์ดีด) ---------------- */
function IntroDialog({ text }: { text: string }) {
  const { shown, done, skip } = useTypewriter(text, true, 26);
  return (
    <div className="pixel-box pixel-box--cyan mt-4 p-5 text-sm md:text-base leading-relaxed cursor-pointer" onClick={skip}>
      <span className="name-tag font-pixel">MESSAGE</span>
      <p className={done ? 'dialog-next' : 'type-cursor'}>{shown}</p>
    </div>
  );
}

/* ---------------- เวทีฮีโร่: แตะเล่นได้ ---------------- */
function HeroStage({ variant }: { variant: 1 | 2 }) {
  const { triggerPowerUp, unlock } = useGameFx();
  const [tip, setTip] = useState(0);
  const [taps, setTaps] = useState(0);
  const [jump, setJump] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setTip((t) => (t + 1) % STAGE_TIPS.length), 3500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!jump) return;
    const id = window.setTimeout(() => setJump(false), 500);
    return () => window.clearTimeout(id);
  }, [jump]);

  const onTap = () => {
    sfx.select();
    setJump(true);
    const next = taps + 1;
    if (next >= 5) {
      setTaps(0);
      triggerPowerUp();
      unlock('tap-hero', 'POWER AWAKENED', 'แตะฮีโร่ครบ 5 ครั้ง');
    } else {
      setTaps(next);
    }
  };

  return (
    <div className="pixel-box pixel-box--cyan p-5 flex flex-col items-center gap-4">
      <span className="name-tag font-pixel">STAGE</span>
      <div className="speech mt-2">{STAGE_TIPS[tip]}</div>
      <button
        type="button"
        onClick={onTap}
        aria-label="แตะฮีโร่"
        className={`cursor-pointer ${jump ? 'hero-jump' : ''}`}
      >
        <PixelHero size={9} variant={variant} />
      </button>
      <div className="stage-floor w-full" />
      <p className="font-pixel text-[9px] text-hero-gold">TAP {taps}/5</p>
    </div>
  );
}

/* ---------------- หัวข้อส่วนต่างๆ ---------------- */
function SectionTitle({ label, sub, name, children }: { label: string; sub: string; name: string; children: ReactNode }) {
  return (
    <div className="text-center mb-10 space-y-2">
      <h2 className="font-pixel text-sm md:text-lg text-hero-gold flex items-center justify-center gap-3">
        {children}
        <span>{label}</span>
      </h2>
      <p className="text-sm text-slate-200">{sub}</p>
      <p className="text-xs text-hero-cyan font-semibold">ข้อมูลของ: {name}</p>
    </div>
  );
}

/* ---------------- การ์ดทักษะ: แถบ XP เลื่อนเต็มเมื่อเลื่อนมาถึง ---------------- */
function SkillCard({ skill, index }: { skill: SkillGroup; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const items = skill.items
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const pct = Math.min(100, Math.round((items.length / 6) * 100));

  return (
    <div ref={ref} className={`pixel-box ${SKILL_ACCENTS[index % SKILL_ACCENTS.length]} p-5 ${inView ? 'is-in' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="icon-tile text-hero-gold">
          {skill.icon === 'brain' && <Brain className="w-5 h-5" />}
          {skill.icon === 'code' && <Code2 className="w-5 h-5" />}
          {skill.icon === 'database' && <Database className="w-5 h-5" />}
        </div>
        <h3 className="font-bold text-white">{skill.title}</h3>
      </div>
      <p className="font-pixel text-[9px] text-hero-gold mb-2">SKILLS UNLOCKED: {items.length}</p>
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: inView ? `${pct}%` : '0%', transitionDelay: `${index * 150}ms` }} />
      </div>
      <ul className="flex flex-wrap gap-2 mt-4">
        {items.map((item, j) => (
          <li key={item} className="skill-chip" style={{ animationDelay: `${index * 150 + j * 90}ms` }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- หน้าหลัก (หลังกด Start) ---------------- */
function MainHome() {
  const { unlock } = useGameFx();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('patsachai');
  const [viewed, setViewed] = useState<string[]>(['patsachai']);
  const memberIndex = Math.max(
    0,
    teamMembers.findIndex((m) => m.id === selectedMemberId),
  );
  const currentMember = teamMembers[memberIndex];

  const selectMember = (id: string) => {
    sfx.select();
    setSelectedMemberId(id);
    const next = viewed.includes(id) ? viewed : [...viewed, id];
    setViewed(next);
    if (next.length === teamMembers.length) {
      unlock('explorer', 'EXPLORER', 'เปิดดูโปรไฟล์ครบทุกสมาชิก');
    }
  };

  return (
    <div className="selection:bg-hero-gold selection:text-night">
      {/* Navigation */}
      <nav className="pixel-bar sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PixelArt rows={ROBOT_ROWS} palette={ROBOT_PALETTE} size={3} />
            <span className="font-pixel text-[10px] md:text-xs text-hero-gold">AI INNOVATORS</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <a href="#skills" className="hidden sm:inline font-pixel text-[9px] text-slate-200 hover:text-hero-gold">
              SKILLS
            </a>
            <a href="#quests" className="hidden sm:inline font-pixel text-[9px] text-slate-200 hover:text-hero-gold">
              QUESTS
            </a>
            <Link to="/chat" onClick={() => sfx.confirm()} className="pixel-btn pixel-btn--gold pixel-btn--sm font-pixel text-[10px]">
              TALK TO AI ▶
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8 grid md:grid-cols-[1fr_380px] gap-10 items-center">
        <div className="space-y-5 text-center md:text-left">
          <span className="pixel-tag">★ AI & DATA SCIENCE STUDENT @ BANGKOK UNIVERSITY</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
            สวัสดีครับ, ผม <span className="text-hero-gold">{currentMember.name}</span>
          </h1>
          <p className="font-pixel text-[10px] md:text-xs text-hero-cyan leading-relaxed">CLASS ▶ {currentMember.role}</p>
          <IntroDialog key={currentMember.id} text={WELCOME_TEXT} />
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <Link to="/chat" onClick={() => sfx.confirm()} className="pixel-btn pixel-btn--gold font-pixel text-[11px]">
              ▶ สอบถามโปรไฟล์ด้วย AI
            </Link>
            <a href="#quests" onClick={() => sfx.select()} className="pixel-btn font-pixel text-[11px]">
              ดูภารกิจ
            </a>
          </div>
        </div>
        <HeroStage variant={variantOf(memberIndex)} />
      </section>

      {/* Character select */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-4">
        <div className="text-center space-y-4">
          <h2 className="font-pixel text-xs md:text-sm text-hero-gold">SELECT YOUR PLAYER</h2>
          <p className="text-xs text-slate-200">เลือกดูโปรไฟล์ตามรายบุคคล</p>
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            {teamMembers.map((member, idx) => {
              const active = member.id === selectedMemberId;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => selectMember(member.id)}
                  className={`pixel-box select-card ${active ? 'is-active' : ''}`}
                >
                  <span className="font-pixel text-[9px] text-hero-cyan">PLAYER {idx + 1}</span>
                  <PixelHero size={4} variant={variantOf(idx)} bob={active} />
                  <span className="font-bold text-sm text-white">{member.name}</span>
                  {active && <span className="font-pixel text-[9px] text-hero-gold blink-soft">▶ READY!</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle label="SKILL TREE" sub="ทักษะและความเชี่ยวชาญ (Tech Stack)" name={currentMember.name}>
            <Brain className="w-6 h-6" />
          </SectionTitle>
          <div key={currentMember.id} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentMember.skills.map((skill, index) => (
              <SkillCard key={skill.title} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Quests */}
      <section id="quests" className="py-14 max-w-6xl mx-auto px-6">
        <SectionTitle label="QUEST LOG" sub="ผลงานและโปรเจกต์เด่น (Featured Projects)" name={currentMember.name}>
          <FolderGit2 className="w-6 h-6" />
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentMember.projects.map((project, index) => (
            <div key={project.title} className="pixel-box quest-card p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-pixel text-[9px] text-slate-300">QUEST {String(index + 1).padStart(2, '0')}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${project.tagColor}`}>{project.category}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{project.desc}</p>
              </div>
              {project.link ? (
                <Link
                  to={project.link}
                  onClick={() => sfx.confirm()}
                  className="pixel-btn pixel-btn--gold pixel-btn--sm font-pixel text-[10px] w-fit"
                >
                  ▶ PLAY NOW (ทดลองใช้งาน)
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-pixel text-[9px] text-emerald-300">★ CLEARED</span>
                  <span className="text-xs text-slate-400">ผลงานโดย {currentMember.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pixel-bar border-b-0 border-t-4 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="font-pixel text-[8px] text-slate-300 leading-relaxed">© 2026 AI INNOVATORS TEAM. ALL RIGHTS RESERVED.</p>
          <a
            href="mailto:Patsachai.sawa@bumail.net"
            className="flex items-center gap-2 font-pixel text-[9px] text-hero-cyan hover:text-hero-gold"
          >
            <Mail className="w-4 h-4" />
            <span>SAVE POINT: CONTACT</span>
          </a>
        </div>
        <p className="mt-4 text-center font-pixel text-[7px] text-slate-500">SECRET CODE ▶ ↑ ↑ ↓ ↓ ← → ← → B A</p>
      </footer>
    </div>
  );
}

export default function Home() {
  const { unlock } = useGameFx();
  const [started, setStarted] = useState(readStarted);

  const handleStart = useCallback(() => {
    sfx.confirm();
    try {
      sessionStorage.setItem(START_KEY, '1');
    } catch {
      // ถ้าเก็บค่าไม่ได้ก็แค่แสดงหน้า Title ใหม่ครั้งหน้า
    }
    unlock('press-start', 'GAME START', 'เริ่มต้นการผจญภัย');
    setStarted(true);
    window.scrollTo(0, 0);
  }, [unlock]);

  return started ? <MainHome /> : <TitleScreen onStart={handleStart} />;
}
