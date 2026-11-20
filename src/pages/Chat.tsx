import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useSearchParams } from 'react-router-dom';
import EnergyBar from '../components/EnergyBar';
import PixelHero from '../components/PixelHero';
import type { HeroMood } from '../components/PixelHero';
import { useGameFx } from '../lib/gameFx';
import { BOSS_LABEL, BOSS_PROMPT, MISSIONS, missionQuestion, loadCleared, saveCleared } from '../lib/missions';
import { sfx } from '../lib/sfx';
import { useQuota } from '../lib/useQuota';
import { useTypewriter } from '../lib/useTypewriter';

// ดึง API URL จาก env (ตั้งใน Vercel: VITE_API_URL=https://chat-ai-portfolio-be-pubg.onrender.com)
// ตัด slash ท้ายออก กันเกิด //api/chat
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  /** ข้อความที่แสดงแทน text (เช่น ป้ายบอส แทนที่จะโชว์พรอมต์ยาวๆ) */
  display?: string;
  variant?: 'boss';
}

interface SendOptions {
  display?: string;
  boss?: boolean;
  missionId?: string;
}

const ASSISTANT_NAMES: Record<1 | 2 | 3, string> = {
  1: 'คุณภัทษชัย สว่างกัลป์ (เพชร)',
  2: 'คุณปาณัสม์ เบญจวรรณ (พีซ)',
  3: 'คุณกันต์ธนวิท ทองกร (กัน)',
};

const MEMBER_LABELS: Record<1 | 2 | 3, { en: string; ask: string }> = {
  1: { en: 'Patsachai Sawangkalp', ask: 'คุณภัทษชัย' },
  2: { en: 'Panat Benjawan', ask: 'คุณปาณัสม์' },
  3: { en: 'Kanthawit Thongkorn', ask: 'คุณกันต์ธนวิท' },
};

const welcomeText = (hero: 1 | 2 | 3) =>
  `สวัสดีครับ! ผมคือ AI Assistant ประจำโปรไฟล์ของ${ASSISTANT_NAMES[hero]} คุณสามารถสอบถามเกี่ยวกับ ทักษะ โปรเจกต์ หรือประสบการณ์การทำงานได้เลยครับ ✨`;

// คำสั่งด่วน = 3 ภารกิจแรก (ก็นับเป็นการเคลียร์ภารกิจด้วย)
const QUICK_MISSIONS = MISSIONS.slice(0, 3);

/* ---------------- กล่องบทสนทนาของ AI (พิมพ์ดีดข้อความล่าสุด, แตะเพื่อข้าม) ---------------- */
function AssistantBubble({
  id,
  text,
  typing,
  boss,
  onDone,
}: {
  id: string;
  text: string;
  typing: boolean;
  boss?: boolean;
  onDone: (id: string) => void;
}) {
  const { shown, done, skip } = useTypewriter(text, typing);

  useEffect(() => {
    if (typing && done) onDone(id);
  }, [typing, done, id, onDone]);

  return (
    <div
      className={`pixel-box ${boss ? 'pixel-box--red' : 'pixel-box--cyan'} mt-4 max-w-[88%] px-4 py-3 text-sm leading-relaxed`}
      onClick={skip}
      title={done ? undefined : 'แตะเพื่อข้ามแอนิเมชัน'}
    >
      <span className={`name-tag font-pixel ${boss ? 'name-tag--boss' : ''}`}>{boss ? 'FINAL BOSS' : 'AI HERO'}</span>
      <div
        className={`space-y-2 [&_strong]:font-bold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 ${
          done ? '' : 'type-cursor'
        }`}
      >
        <ReactMarkdown>{shown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function Chat() {
  const { unlock } = useGameFx();
  const [searchParams] = useSearchParams();
  const heroParam = Number(searchParams.get('hero'));
  const hero: 1 | 2 | 3 = heroParam === 2 || heroParam === 3 ? heroParam : 1;
  const { quota, refresh: refreshQuota } = useQuota(API_BASE_URL);
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', sender: 'assistant', text: welcomeText(hero) }]);
  const [typingId, setTypingId] = useState<string | null>('welcome');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [cleared, setCleared] = useState<string[]>(loadCleared);
  const [showMissions, setShowMissions] = useState(false);
  const [bossIntro, setBossIntro] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyCount = useRef(0);
  const bossTimer = useRef(0);

  useEffect(() => {
    let currentSession: string | null = null;
    try {
      currentSession = localStorage.getItem('chat_session_id');
    } catch {
      // ใช้ session ชั่วคราวถ้าเก็บค่าไม่ได้
    }
    if (!currentSession) {
      currentSession = 'session_' + Math.random().toString(36).substring(2, 9);
      try {
        localStorage.setItem('chat_session_id', currentSession);
      } catch {
        // ignore
      }
    }
    setSessionId(currentSession);
  }, []);

  useEffect(() => () => window.clearTimeout(bossTimer.current), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ระหว่างพิมพ์ดีด เลื่อนตามข้อความที่ยาวขึ้น
  useEffect(() => {
    if (!typingId) return;
    const id = window.setInterval(() => messagesEndRef.current?.scrollIntoView({ block: 'end' }), 200);
    return () => window.clearInterval(id);
  }, [typingId]);

  const handleTypingDone = useCallback((id: string) => {
    setTypingId((current) => (current === id ? null : current));
  }, []);

  // เพิ่มข้อความของ AI และสั่งให้พิมพ์ดีด
  const pushAssistant = (text: string, variant?: 'boss') => {
    const id = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id, sender: 'assistant', text, variant }]);
    setTypingId(id);
  };

  const markCleared = (missionId: string) => {
    if (cleared.includes(missionId)) return;
    const next = [...cleared, missionId];
    setCleared(next);
    saveCleared(next);
    if (next.length >= MISSIONS.length) {
      unlock('mission-master', 'MISSION MASTER', 'เคลียร์ภารกิจครบทุกข้อ');
    }
  };

  const handleSend = async (customMessage?: string, opts?: SendOptions) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      display: opts?.display,
    };

    sfx.confirm();
    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setLoading(true);

    // กันค้าง: ยกเลิกคำขอถ้าเกิน 75 วินาที (เผื่อ Render แพลนฟรีกำลังตื่น)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 75_000);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId: sessionId,
          message: textToSend,
        }),
      });

      // อ่านเป็น text ก่อน กัน res.json() พังเมื่อได้ HTML/ข้อความว่าง (เช่น หน้า error ของ Render)
      const raw = await res.text();
      let data: { reply?: string; error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        console.error('[Chat] Response ไม่ใช่ JSON:', { url: CHAT_ENDPOINT, status: res.status, body: raw.slice(0, 300) });
      }

      if (res.ok && data.reply) {
        pushAssistant(data.reply, opts?.boss ? 'boss' : undefined);
        replyCount.current += 1;
        unlock('first-contact', 'FIRST CONTACT', 'ได้รับคำตอบแรกจาก AI');
        if (replyCount.current >= 3) unlock('chatterbox', 'CHATTERBOX', 'คุยกับ AI ครบ 3 ครั้ง');
        if (opts?.missionId) markCleared(opts.missionId);
        if (opts?.boss) unlock('boss-defeated', 'BOSS DEFEATED', 'ผ่านด่านสุดท้ายแล้ว');
      } else {
        throw new Error(`HTTP ${res.status}: ${data.error || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์'}`);
      }
    } catch (err) {
      // TypeError: Failed to fetch = เชื่อมต่อไม่ได้ / โดน CORS บล็อก / URL ผิด / Render กำลังตื่น
      console.error('[Chat] Request ล้มเหลว:', { url: CHAT_ENDPOINT, error: err });
      sfx.error();
      const isTimeout = err instanceof DOMException && err.name === 'AbortError';
      const isBusy = err instanceof Error && err.message.startsWith('HTTP 503');
      const isQuota = err instanceof Error && err.message.startsWith('HTTP 429');
      pushAssistant(
        isTimeout
          ? 'ขออภัยครับ เซิร์ฟเวอร์ตอบช้าเกินไป กรุณาลองใหม่อีกครั้งในอีกสักครู่'
          : isQuota
            ? 'ขออภัยครับ โควตาการใช้งาน AI ของวันนี้เต็มแล้ว กรุณาลองใหม่ภายหลัง'
            : isBusy
              ? 'ขออภัยครับ ระบบ AI กำลังมีผู้ใช้งานจำนวนมาก กรุณาลองใหม่อีกครั้งในอีกสักครู่'
              : 'ขออภัยครับ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้ในขณะนี้',
      );
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      void refreshQuota();
    }
  };

  const handleMission = (missionId: string, question: string) => {
    sfx.select();
    setShowMissions(false);
    void handleSend(question, { missionId });
  };

  // บอสด่านสุดท้าย: เล่นฉากเตือนภัยก่อน แล้วค่อยส่งพรอมต์ให้ AI ประกาศเปิดตัวทีม
  const handleBoss = () => {
    if (loading || bossIntro) return;
    sfx.warning();
    setShowMissions(false);
    setBossIntro(true);
    window.clearTimeout(bossTimer.current);
    bossTimer.current = window.setTimeout(() => {
      setBossIntro(false);
      void handleSend(BOSS_PROMPT, { display: BOSS_LABEL, boss: true });
    }, 1700);
  };

  const handleNewChat = () => {
    sfx.select();
    const newSession = 'session_' + Math.random().toString(36).substring(2, 9);
    try {
      localStorage.setItem('chat_session_id', newSession);
    } catch {
      // ignore
    }
    setSessionId(newSession);
    replyCount.current = 0;
    const welcomeId = 'welcome_' + Date.now();
    setMessages([
      {
        id: welcomeId,
        sender: 'assistant',
        text: 'เริ่มต้นบทสนทนาใหม่แล้วครับ มีข้อมูลส่วนไหนที่คุณสนใจสอบถามเพิ่มเติมไหมครับ?',
      },
    ]);
    setTypingId(welcomeId);
  };

  const mood: HeroMood = loading ? 'think' : typingId ? 'talk' : 'idle';
  const statusLabel = bossIntro ? 'WARNING!' : loading ? 'THINKING...' : typingId ? 'TALKING...' : 'READY';
  const busy = loading || bossIntro;

  return (
    <div className="h-dvh flex flex-col">
      {/* Header */}
      <header className="pixel-bar px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" onClick={() => sfx.select()} className="pixel-btn pixel-btn--sm font-pixel text-[10px]">
            ◀ HOME
          </Link>
          <div className="min-w-0">
            <h1 className="font-pixel text-[10px] md:text-xs text-hero-gold truncate">AI PORTFOLIO ASSISTANT</h1>
            <p className="text-[11px] text-slate-300 truncate">{MEMBER_LABELS[hero].en} Profile Chatbot</p>
          </div>
        </div>
        <button type="button" onClick={handleNewChat} className="pixel-btn pixel-btn--sm font-pixel text-[10px] shrink-0">
          NEW GAME
        </button>
      </header>

      <main className="flex-1 min-h-0 w-full max-w-5xl mx-auto grid md:grid-cols-[220px_1fr] gap-3 md:gap-6 px-3 md:px-6 py-3 md:py-5">
        {/* เวทีตัวละคร */}
        <aside className="flex md:flex-col items-center gap-4 md:justify-start">
          <div className="pixel-box pixel-box--cyan p-3 md:p-5 flex md:flex-col items-center gap-3 md:gap-4 w-full">
            <span className="name-tag font-pixel">AI HERO</span>
            <div className="md:hidden">
              <PixelHero size={3} mood={mood} variant={hero} />
            </div>
            <div className="hidden md:block pt-2">
              <PixelHero size={7} mood={mood} variant={hero} />
            </div>
            <div className="flex-1 md:flex-none w-full text-left md:text-center space-y-3">
              <div>
                <p className="font-pixel text-[9px] text-hero-gold">{statusLabel}</p>
                <p className="text-[11px] text-slate-300 mt-1">แตะกล่องข้อความเพื่อข้ามแอนิเมชันพิมพ์</p>
              </div>
              <EnergyBar quota={quota} />
            </div>
          </div>
        </aside>

        {/* พื้นที่แชต */}
        <section className="flex flex-col min-h-0">
          <div className="pixel-scroll flex-1 overflow-y-auto px-2 pb-2 space-y-5" aria-live="polite">
            {messages.map((msg) =>
              msg.sender === 'user' ? (
                <div key={msg.id} className="pixel-box pixel-box--gold mt-4 ml-auto max-w-[88%] px-4 py-3 text-sm leading-relaxed">
                  <span className="name-tag name-tag--user font-pixel">YOU</span>
                  <p className="whitespace-pre-wrap break-words">{msg.display ?? msg.text}</p>
                </div>
              ) : (
                <AssistantBubble
                  key={msg.id}
                  id={msg.id}
                  text={msg.text}
                  typing={typingId === msg.id}
                  boss={msg.variant === 'boss'}
                  onDone={handleTypingDone}
                />
              ),
            )}

            {loading && (
              <div className="pixel-box pixel-box--cyan mt-4 w-fit px-4 py-3 text-sm flex items-center gap-3">
                <span className="loading-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>กำลังค้นหาข้อมูล...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* เลือกภารกิจ */}
          {showMissions && (
            <div className="pixel-box pixel-box--gold mt-5 mb-1 p-3 max-h-[36vh] overflow-y-auto pixel-scroll">
              <span className="name-tag font-pixel">MISSION SELECT</span>
              <p className="font-pixel text-[9px] text-hero-gold mt-1 mb-2">
                CLEARED {cleared.length}/{MISSIONS.length}
              </p>
              <div className="grid sm:grid-cols-2 gap-1">
                {MISSIONS.map((m) => {
                  const done = cleared.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMission(m.id, missionQuestion(m, hero, MEMBER_LABELS[hero].ask))}
                      disabled={busy}
                      className="pixel-btn pixel-btn--sm flex-col items-start justify-start text-left gap-1"
                    >
                      <span className="font-pixel text-[8px] text-hero-cyan">
                        {'★'.repeat(m.stars)} {m.tag} {done && <span className="text-emerald-300">✔ CLEARED</span>}
                      </span>
                      <span className="text-xs leading-snug">{missionQuestion(m, hero, MEMBER_LABELS[hero].ask)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* คำสั่งด่วน + เมนูภารกิจ + บอส */}
          <div className="flex flex-wrap items-center gap-1 py-2">
            <span className="font-pixel text-[9px] text-hero-cyan mr-1">COMMANDS ▶</span>
            {QUICK_MISSIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMission(m.id, missionQuestion(m, hero, MEMBER_LABELS[hero].ask))}
                disabled={busy}
                className="pixel-btn pixel-btn--sm"
              >
                {missionQuestion(m, hero, MEMBER_LABELS[hero].ask)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                sfx.select();
                setShowMissions((v) => !v);
              }}
              className="pixel-btn pixel-btn--gold pixel-btn--sm font-pixel text-[9px]"
            >
              MISSIONS {cleared.length}/{MISSIONS.length} {showMissions ? '▲' : '▼'}
            </button>
            <button
              type="button"
              onClick={handleBoss}
              disabled={busy}
              className="pixel-btn pixel-btn--sm font-pixel text-[9px] !text-white !bg-red-700 !border-red-300"
            >
              ☠ FINAL BOSS
            </button>
          </div>

          {/* ช่องพิมพ์ */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="flex items-stretch gap-3 pb-1 pr-12 lg:pr-0"
          >
            <div className="pixel-box pixel-box--white flex-1 flex items-center px-3 focus-within:[--pb-border:#ffd23f]">
              <span className="font-pixel text-xs text-hero-gold mr-2" aria-hidden="true">
                &gt;
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์คำถามเกี่ยวกับโปรไฟล์ที่นี่..."
                disabled={busy}
                className="flex-1 min-w-0 bg-transparent py-3 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="pixel-btn pixel-btn--gold font-pixel text-[10px] shrink-0"
            >
              SEND ▶
            </button>
          </form>
        </section>
      </main>

      {/* ฉากเตือนภัยก่อนบอสด่านสุดท้าย */}
      {bossIntro && (
        <div className="boss-overlay" aria-hidden="true">
          <div className="text-center">
            <div className="boss-text font-pixel shake">
              ⚠ WARNING ⚠
              <br />
              FINAL BOSS
            </div>
            <p className="mt-6 text-lg font-bold text-white">ด่านสุดท้ายมาแล้ว!</p>
          </div>
        </div>
      )}
    </div>
  );
}
