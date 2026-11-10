import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Code2, Database, Brain, Sparkles, FolderGit2, Mail, Terminal, User } from 'lucide-react';

// 1. โครงสร้างข้อมูลสมาชิกในทีม
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

export default function Home() {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('patsachai');

  // ดึงข้อมูลสมาชิกที่กำลังเลือกอยู่
  const currentMember = teamMembers.find((m) => m.id === selectedMemberId) || teamMembers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white tracking-wide">AI Innovators Portfolio</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#skills" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              ทักษะ
            </a>
            <a href="#projects" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              ผลงาน
            </a>
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
            >
              <Bot className="w-4 h-4" />
              <span>คุยกับ AI</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI & Data Science Student @ Bangkok University</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            สวัสดีครับ, ผม <span className="text-blue-500">{currentMember.name}</span> <br />
            <span className="text-2xl md:text-3xl text-slate-400 font-normal">{currentMember.role}</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
            ยินดีต้อนรับสู่พื้นที่รวบรวมทักษะและผลงานเด่น สามารถเลือกดูโปรไฟล์ของสมาชิกในทีม หรือทดลองพิมพ์สอบถามข้อมูลด้วย AI Assistant ได้ทันที
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <Link
              to="/chat"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02]"
            >
              <Bot className="w-5 h-5" />
              <span>สอบถามโปรไฟล์ด้วย AI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* AI Banner Card */}
        <div className="w-full md:w-[380px] bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Portfolio Assistant</h3>
              <p className="text-xs text-slate-400">Powered by Gemini API & RAG</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-5 leading-relaxed">
            “สวัสดีครับ! ผมสามารถตอบคำถามเกี่ยวกับทักษะ ประสบการณ์ และผลงานของสมาชิกในทีมได้แบบเจาะลึก”
          </p>
          <Link
            to="/chat"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-all border border-slate-700 hover:border-blue-500"
          >
            <span>เริ่มสนทนาเลย</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Member Selection Tabs (ส่วนปุ่มกดเลือกสมาชิก) */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            เลือกดูโปรไฟล์ตามรายบุคคล
          </span>
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  selectedMemberId === member.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{member.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section (แสดงเฉพาะของคนที่เลือก) */}
      <section id="skills" className="border-t border-slate-900 bg-slate-950 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <span>ทักษะและความเชี่ยวชาญ (Tech Stack)</span>
          </h2>
          <p className="text-center text-xs text-blue-400 mb-10 font-medium">
            ข้อมูลของ: {currentMember.name}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentMember.skills.map((skill, index) => (
              <div key={index} className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl w-fit mb-4">
                  {skill.icon === 'brain' && <Brain className="w-6 h-6" />}
                  {skill.icon === 'code' && <Code2 className="w-6 h-6" />}
                  {skill.icon === 'database' && <Database className="w-6 h-6" />}
                </div>
                <h3 className="font-semibold text-white mb-2">{skill.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{skill.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section (แสดงเฉพาะของคนที่เลือก) */}
      <section id="projects" className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
          <FolderGit2 className="w-6 h-6 text-blue-500" />
          <span>ผลงานและโปรเจกต์เด่น (Featured Projects)</span>
        </h2>
        <p className="text-center text-xs text-blue-400 mb-10 font-medium">
          ข้อมูลของ: {currentMember.name}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentMember.projects.map((project, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${project.tagColor}`}>
                  {project.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{project.desc}</p>
              </div>
              {project.link && (
                <Link to={project.link} className="mt-5 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                  ดูรายละเอียด <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}