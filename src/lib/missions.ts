// ภารกิจ (คำถามตัวอย่าง) และข้อความเรียกบอสด่านสุดท้าย
export interface Mission {
  id: string;
  /** ป้ายหมวดหมู่ภาษาอังกฤษสั้นๆ */
  tag: string;
  /** ความยาก 1-3 ดาว */
  stars: 1 | 2 | 3;
  question: string;
  /** คำถามเฉพาะของสมาชิกคนที่ 2 และ 3 (ถ้าไม่มีใช้ question เดิม) */
  byHero?: Partial<Record<2 | 3, string>>;
}

/** คำถามของภารกิจตามสมาชิกที่เลือก และใส่ชื่อแทน {name} */
export const missionQuestion = (m: Mission, hero: 1 | 2 | 3, name: string) =>
  ((hero !== 1 && m.byHero?.[hero]) || m.question).replace('{name}', name);

export const MISSIONS: Mission[] = [
  { id: 'skills', tag: 'SKILL', stars: 1, question: '{name} มีทักษะด้านไหนบ้าง?' },
  { id: 'projects', tag: 'QUEST', stars: 1, question: '{name} เคยทำโปรเจกต์อะไรมาบ้าง?' },
  { id: 'contact', tag: 'CONTACT', stars: 1, question: 'ช่องทางการติดต่อ{name}' },
  { id: 'team', tag: 'TEAM', stars: 2, question: 'ทีมนี้มีสมาชิกกี่คน และแต่ละคนถนัดอะไร?' },
  { id: 'tech', tag: 'TECH', stars: 2, question: 'โปรเจกต์ AI Portfolio Chatbot ใช้เทคโนโลยีอะไรบ้าง?', byHero: { 2: 'โปรเจกต์ Big Data Processing and Analytics ใช้เทคโนโลยีอะไรบ้าง?', 3: 'โปรเจกต์ Drone Mission Data Analytics ใช้เทคโนโลยีอะไรบ้าง?' } },
  { id: 'hack4hope', tag: 'STORY', stars: 2, question: 'เล่าเรื่องโปรเจกต์ HACK4HOPE ให้ฟังหน่อย', byHero: { 2: 'Automated Data Pipeline ที่พีซทำทำงานอย่างไร?', 3: 'โปรเจกต์โดรนเก็บข้อมูลอะไรจากภารกิจบินบ้าง?' } },
  { id: 'forecast', tag: 'DATA', stars: 3, question: 'โปรเจกต์พยากรณ์ยอดขาย Superstore ทำอย่างไร?', byHero: { 2: 'แดชบอร์ดวิเคราะห์ข้อมูลที่พีซทำมีอะไรบ้าง?', 3: 'แดชบอร์ดแสดงผลข้อมูลภารกิจโดรนแสดงอะไรบ้าง?' } },
  { id: 'recruit', tag: 'RECRUIT', stars: 3, question: 'ถ้าต้องการนักพัฒนาด้าน AI และด้าน Frontend ควรเลือกใครในทีม?' },
];

// ให้ AI ตอบจากข้อมูลที่มีเท่านั้น กันแต่งเรื่องเพิ่ม
export const BOSS_PROMPT =
  'ช่วยประกาศเปิดตัวทีม "ยังไม่ได้นอน" สั้นๆ แบบบอสด่านสุดท้ายในเกม สรุปจุดเด่นของทีมและสมาชิกจากข้อมูลที่มีเท่านั้น ไม่เกิน 6 บรรทัด ใช้ภาษาตื่นเต้นแต่สุภาพ และห้ามแต่งข้อมูลที่ไม่มี';

export const BOSS_LABEL = '⚔ FINAL BOSS STAGE';

const KEY = 'pixel_missions';

export function loadCleared(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveCleared(ids: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ไม่เป็นไร ถ้าเก็บค่าไม่ได้
  }
}
