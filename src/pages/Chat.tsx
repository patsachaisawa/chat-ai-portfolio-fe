import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, RefreshCw, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// ดึง API URL จาก env (ตั้งใน Vercel: VITE_API_URL=https://chat-ai-portfolio-be-pubg.onrender.com)
// ตัด slash ท้ายออก กันเกิด //api/chat
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'สวัสดีครับ! ผมคือ AI Assistant ประจำโปรไฟล์ของคุณภัทษชัย สว่างกัลป์ คุณสามารถสอบถามเกี่ยวกับ ทักษะ โปรเจกต์ หรือประสบการณ์การทำงานได้เลยครับ ✨',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentSession = localStorage.getItem('chat_session_id');
    if (!currentSession) {
      currentSession = 'session_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('chat_session_id', currentSession);
    }
    setSessionId(currentSession);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.reply,
          },
        ]);
      } else {
        throw new Error(`HTTP ${res.status}: ${data.error || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์'}`);
      }
    } catch (err) {
      // TypeError: Failed to fetch = เชื่อมต่อไม่ได้ / โดน CORS บล็อก / URL ผิด / Render กำลังตื่น
      console.error('[Chat] Request ล้มเหลว:', { url: CHAT_ENDPOINT, error: err });
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'ขออภัยครับ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้ในขณะนี้',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newSession = 'session_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('chat_session_id', newSession);
    setSessionId(newSession);
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        sender: 'assistant',
        text: 'เริ่มต้นบทสนทนาใหม่แล้วครับ มีข้อมูลส่วนไหนที่คุณสนใจสอบถามเพิ่มเติมไหมครับ?',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
            title="กลับหน้าหลัก"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">หน้าหลัก</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-white">AI Portfolio Assistant</h1>
              <p className="text-xs text-slate-400">Patsachai Sawangkalp Profile Chatbot</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>แชตใหม่</span>
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`p-2 rounded-lg text-white shrink-0 ${
                msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-blue-400" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="space-y-2 [&_strong]:font-bold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
              <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              <span>กำลังค้นหาข้อมูล...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="max-w-4xl mx-auto w-full px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {[
            'คุณภัทษชัย มีทักษะด้านไหนบ้าง?',
            'เคยทำโปรเจกต์อะไรมาบ้าง?',
            'ช่องทางการติดต่อคุณภัทษชัย',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-full border border-slate-800 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์คำถามเกี่ยวกับโปรไฟล์ที่นี่..."
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}