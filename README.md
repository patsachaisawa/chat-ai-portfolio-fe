# ยังไม่ได้นอน | Pixel Hero Quest — Frontend (FE)

เว็บพอร์ตโฟลิโอของทีม **"ยังไม่ได้นอน"** ในธีม **Pixel RPG** พร้อม **AI Assistant** ที่ตอบคำถามเกี่ยวกับสมาชิกและผลงาน
ทำด้วย React + Vite + Tailwind CSS ตัวละครและฉากทั้งหมดวาดเป็นพิกเซลอาร์ตด้วยโค้ด (SVG) ไม่ได้ใช้ไฟล์รูปภาพ

> Backend อยู่ที่ repo: <https://github.com/patsachaisawa/chat-ai-portfolio-be>

- 🌐 Production: <https://chat-ai-portfolio-fe.vercel.app>
- 🎮 หน้า Home `/` — หน้าจอ Title, เลือกผู้เล่น, Skill Tree, Quest Log
- 💬 หน้า Chat `/chat` — คุยกับ AI, Mission Select, Final Boss, แถบ ENERGY

---

## สารบัญ

1. [ฟีเจอร์](#ฟีเจอร์)
2. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
3. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
4. [เริ่มต้นใช้งานในเครื่อง](#เริ่มต้นใช้งานในเครื่อง)
5. [Environment Variables](#environment-variables)
6. [วิธีแก้ไขเนื้อหาที่พบบ่อย](#วิธีแก้ไขเนื้อหาที่พบบ่อย)
7. [Deploy บน Vercel](#deploy-บน-vercel)
8. [แก้ปัญหาที่พบบ่อย](#แก้ปัญหาที่พบบ่อย)
9. [CI](#ci)

---

## ฟีเจอร์

### หน้า Home (`/`)

| ฟีเจอร์ | รายละเอียด |
| --- | --- |
| **Title Screen** | หน้าจอเริ่มเกม กด `Enter` / `Space` หรือแตะปุ่ม PRESS START (จำสถานะไว้ในแท็บนั้น ไม่ต้องกดซ้ำเมื่อรีเฟรช) |
| **บทนำพิมพ์ดีด** | กล่องข้อความแบบ RPG ที่พิมพ์ทีละตัวอักษร แตะเพื่อข้ามได้ |
| **SELECT YOUR PLAYER** | เลือกสมาชิก 3 คน แต่ละคนมีตัวละครชายเป็นของตัวเอง (Code Knight, Data Sage, Drone Pilot) |
| **ตัวละครแตะได้** | แตะ 5 ครั้งเพื่อปล่อย "ท่าไม้ตาย" ประจำตัว มีของประกอบฉากต่างกัน (ประกาย / ลูกแก้วข้อมูล / โดรน) และแถบค่าพลัง |
| **Skill Tree** | ทักษะเป็นการ์ด มีแถบ XP และชิปทักษะแสดงเมื่อเลื่อนมาถึง |
| **Quest Log** | ผลงานแต่ละคนในรูปแบบภารกิจที่ "CLEARED" |
| **เอฟเฟกต์เสียง 8-bit** | สร้างด้วย Web Audio ไม่ต้องมีไฟล์เสียง ปิด/เปิดได้ด้วยปุ่มลำโพงมุมขวาล่าง |
| **Achievements** | ปลดล็อกความสำเร็จ เช่น GAME START, EXPLORER, POWER AWAKENED เก็บไว้ในเบราว์เซอร์ |
| **รหัสลับ** | ↑ ↑ ↓ ↓ ← → ← → B A (ถ้าหาเจอจะมีเซอร์ไพรส์) |

### หน้า Chat (`/chat`)

| ฟีเจอร์ | รายละเอียด |
| --- | --- |
| **แชตกับ AI** | ส่งข้อความไป Backend แล้วแสดงคำตอบแบบพิมพ์ดีด (รองรับ Markdown) ตัวละครเปลี่ยนท่าทาง idle / think / talk |
| **COMMANDS** | ปุ่มคำถามด่วน 3 ข้อ |
| **MISSION SELECT** | 8 ภารกิจ (คำถามตัวอย่าง) พร้อมระดับดาว ภารกิจที่ถามแล้วขึ้น ✔ CLEARED เคลียร์ครบรับ MISSION MASTER |
| **☠ FINAL BOSS** | ฉากเตือนภัยจอสั่น แล้วให้ AI ประกาศเปิดตัวทีมแบบบอสด่านสุดท้าย (กรอบสีแดง) |
| **ENERGY bar** | แถบ HP แสดงโควตา AI ที่เหลือวันนี้ (ค่าประมาณจาก `GET /api/quota` ถ้า Backend ไม่ตอบ แถบจะซ่อนเอง) |
| **จัดการข้อผิดพลาด** | แปลง error (timeout / 429 / 503 / เชื่อมต่อไม่ได้) เป็นข้อความไทยที่เข้าใจง่าย ยกเลิกคำขอเองเมื่อเกิน 75 วินาที |
| **NEW GAME** | เริ่มบทสนทนาใหม่ (สร้าง `sessionId` ใหม่) |

> ทุกภารกิจและการกดบอสจะใช้โควตา AI 1 ครั้ง

---

## เทคโนโลยีที่ใช้

- **React 19** + **TypeScript** + **Vite**
- **React Router 7** (หน้า `/` และ `/chat`)
- **Tailwind CSS v4** (+ CSS แบบกำหนดเองใน `@layer components` สำหรับสไตล์พิกเซล)
- **react-markdown** (แสดงคำตอบ AI), **lucide-react** (ไอคอน)
- ฟอนต์จาก Google Fonts: **Press Start 2P** (ตัวหนังสือพิกเซล), **Chakra Petch** (ข้อความไทย/อังกฤษทั่วไป)
- ไม่มีไลบรารีเกม/แอนิเมชันเพิ่มเติม — เอฟเฟกต์ทั้งหมดเป็น CSS + SVG + Web Audio

---

## โครงสร้างโปรเจกต์

```
.
├── index.html                 # ชื่อแท็บ, meta tags, Open Graph (ภาพตัวอย่างตอนแชร์ลิงก์), โหลดฟอนต์
├── public/
│   ├── favicon.svg            # ไอคอนแท็บ (หัวฮีโร่)
│   └── og-image.png           # ภาพตัวอย่างตอนแชร์ลิงก์ 1200x630
├── src/
│   ├── main.tsx               # จุดเริ่มต้น
│   ├── App.tsx                # Router + GameShell + เส้นทาง
│   ├── index.css              # ธีม (สี/ฟอนต์) + สไตล์พิกเซลทั้งหมด + keyframes
│   ├── pages/
│   │   ├── Home.tsx           # หน้า Home + ข้อมูลสมาชิก (teamMembers)
│   │   └── Chat.tsx           # หน้าแชต, Mission, Final Boss, เรียก API
│   ├── components/
│   │   ├── GameShell.tsx      # โครงรวม: ปุ่มเสียง, toast achievement, รหัสลับ, เอฟเฟกต์ power-up
│   │   ├── PixelArt.tsx       # แปลงกริดตัวอักษรเป็น SVG พิกเซล
│   │   ├── PixelHero.tsx      # ตัวละครฮีโร่ (3 แบบ) + กระพริบตา/พูด
│   │   ├── PixelBackground.tsx# ฉากหลัง: ดาว, เมฆ, ตึก, พระอาทิตย์
│   │   └── EnergyBar.tsx      # แถบ ENERGY (โควตา AI)
│   └── lib/
│       ├── sprites.ts         # ภาพพิกเซล (ฮีโร่ 3 คน, หุ่นยนต์, โดรน) และสีของแต่ละตัว
│       ├── missions.ts        # รายการภารกิจ + พรอมต์บอส + บันทึกภารกิจที่เคลียร์แล้ว
│       ├── sfx.ts             # เอฟเฟกต์เสียง 8-bit (Web Audio)
│       ├── achievements.ts    # บันทึกความสำเร็จใน localStorage
│       ├── gameFx.ts          # context: unlock achievement / triggerPowerUp
│       ├── useQuota.ts        # hook ดึงโควตาจาก /api/quota
│       ├── useTypewriter.ts   # hook พิมพ์ดีด
│       ├── useInView.ts       # hook ตรวจว่าเลื่อนมาถึงส่วนนั้นหรือยัง
│       └── useKonami.ts       # hook รหัสลับ
├── .env.example
└── package.json
```

---

## เริ่มต้นใช้งานในเครื่อง

### สิ่งที่ต้องมี

- Node.js 20 ขึ้นไป (`node -v`)
- Backend รันอยู่ (ในเครื่องหรือบน Render) — ดูวิธีที่ repo Backend

### ขั้นตอน

```bash
# 1) clone
git clone https://github.com/patsachaisawa/chat-ai-portfolio-fe.git
cd chat-ai-portfolio-fe

# 2) ติดตั้ง dependencies
npm install

# 3) สร้างไฟล์ .env แล้วกำหนด URL ของ Backend
cp .env.example .env
#   - ใช้ Backend ในเครื่อง:  VITE_API_URL=http://localhost:5000
#   - ใช้ Backend บน Render:   VITE_API_URL=https://chat-ai-portfolio-be-pubg.onrender.com

# 4) รันโหมดพัฒนา
npm run dev
```

เปิด <http://localhost:5173>

### สคริปต์ที่ใช้ได้

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run dev` | รันเซิร์ฟเวอร์พัฒนา (Vite, hot reload) |
| `npm run build` | สร้างไฟล์สำหรับ production ในโฟลเดอร์ `dist/` |
| `npm run preview` | ดูตัวอย่างไฟล์ที่ build แล้วในเครื่อง |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |

---

## Environment Variables

| ตัวแปร | บังคับ | ค่าเริ่มต้น | คำอธิบาย |
| --- | :---: | --- | --- |
| `VITE_API_URL` | ✅ (production) | `http://localhost:5000` | URL ของ Backend **ไม่ต้องมี `/` ท้าย** (ถ้ามี โค้ดจะตัดให้) |

⚠️ **สำคัญเรื่อง Vite:** ตัวแปรที่ขึ้นต้นด้วย `VITE_` ถูก "ฝัง" ลงในไฟล์ตอน **build** เท่านั้น
ถ้าแก้ค่า `VITE_API_URL` บน Vercel ต้อง **Redeploy** ใหม่ ค่าที่แก้จึงจะมีผล
และตัวแปรนี้ต้องติ๊กให้ครอบคลุม **Production** (และ **Preview** ถ้าต้องการให้ Preview ใช้งานได้ด้วย)

---

## วิธีแก้ไขเนื้อหาที่พบบ่อย

| อยากแก้ | แก้ที่ไหน |
| --- | --- |
| ชื่อ ตำแหน่ง ทักษะ โปรเจกต์ ชื่อคลาส/ท่าไม้ตาย/ค่าพลัง ของสมาชิก | `src/pages/Home.tsx` → อาร์เรย์ `teamMembers` |
| ชื่อทีม | `index.html` (title + meta), `src/pages/Home.tsx` (เมนู, หน้า Title, ท้ายเว็บ), `src/lib/missions.ts` (พรอมต์บอส), และสร้าง `public/og-image.png` ใหม่ |
| คำถามในแผง MISSION SELECT และปุ่ม COMMANDS | `src/lib/missions.ts` → `MISSIONS` (3 ข้อแรกเป็นปุ่ม COMMANDS) |
| คำสั่งที่ให้ AI ประกาศตอน FINAL BOSS | `src/lib/missions.ts` → `BOSS_PROMPT` |
| หน้าตาและสีของตัวละคร | `src/lib/sprites.ts` (กริดตัวอักษรหนึ่งตัว = หนึ่งพิกเซล, ตารางสีอยู่ใต้กริด) |
| ธีมสี / ฟอนต์ / สไตล์กรอบพิกเซล | `src/index.css` |
| ข้อความต้อนรับและข้อความ error ของแชต | `src/pages/Chat.tsx` |

> **สำคัญ:** ข้อมูลในหน้า Home เป็นข้อมูลของเว็บเท่านั้น แต่ **AI ในหน้า `/chat` ตอบจากข้อมูลในฐานข้อมูล Supabase ฝั่ง Backend**
> ถ้าเพิ่มหรือแก้ข้อมูลสมาชิกที่หน้า Home ให้แก้ที่ตาราง `team_members` / `team_projects` ใน Supabase ด้วย ไม่งั้น AI จะตอบข้อมูลเก่า

---

## Deploy บน Vercel

1. Import repo นี้เข้า [Vercel](https://vercel.com) (Framework Preset: **Vite**)
2. เพิ่ม Environment Variable `VITE_API_URL` = URL ของ Backend บน Render (เลือกให้ครอบคลุม Production และ Preview)
3. Deploy — ทุกครั้งที่ merge เข้า `main` Vercel จะ deploy ใหม่อัตโนมัติ และทุก Pull Request จะได้ Preview URL ให้ลองก่อน merge
4. หลังแก้ env ต้อง **Redeploy** (Deployments → ⋯ → Redeploy)

Backend อนุญาต CORS ให้ `https://chat-ai-portfolio-fe.vercel.app` และ `*.vercel.app` ทุกโดเมนย่อยอยู่แล้ว
ถ้าใช้โดเมนอื่น ต้องเพิ่มใน `CORS_ORIGINS` ของ Backend

> ถ้ารีเฟรชหน้า `/chat` แล้วเจอ 404 แปลว่า Vercel ยังไม่ได้ตั้ง SPA fallback ให้เพิ่มไฟล์ `vercel.json`
> ที่รากโปรเจกต์: `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`

---

## แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
| --- | --- | --- |
| แชตขึ้น "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์" | Render แผนฟรีกำลังตื่น (ช้า ~1 นาที), `VITE_API_URL` ผิด, หรือโดน CORS | รอแล้วลองใหม่, เปิด DevTools → Console ดู URL ที่เรียก, ตรวจ env |
| ยังเรียก `localhost:5000` บน production | ไม่ได้ตั้ง `VITE_API_URL` ตอน build | ตั้ง env บน Vercel แล้ว Redeploy |
| ตอบ "ระบบ AI กำลังมีผู้ใช้งานจำนวนมาก" | Gemini ล้นคำขอ (503) ไม่ใช่บั๊กของเว็บ | ลองใหม่ภายหลัง / ตั้งโมเดลสำรองที่ Backend |
| ตอบ "โควตาเต็ม" และแถบ ENERGY เป็น 0 | โควตาต่อวันหมด | รอรีเซ็ต หรือเปลี่ยนโมเดล (ดูที่ README ของ Backend) |
| ไม่เห็นแถบ ENERGY | Backend ยังไม่มี `/api/quota` หรือยังหลับอยู่ | Deploy Backend ล่าสุด แล้วรีเฟรช |
| ไม่มีเสียง | เบราว์เซอร์ต้องรอให้ผู้ใช้แตะ/กดก่อนจึงเล่นเสียงได้ หรือกดปิดเสียงไว้ | แตะหน้าเว็บหนึ่งครั้ง / กดปุ่มลำโพงมุมขวาล่าง |
| ข้อมูลเก่ายังค้างหลัง deploy | แคชของเบราว์เซอร์ | กด `Ctrl+Shift+R` |
| แชร์ลิงก์แล้วภาพตัวอย่างยังเป็นของเก่า | Facebook/LINE จำภาพไว้ในแคช | ใช้เครื่องมือ Sharing Debugger ของ Facebook ให้ดึงใหม่ |

---

## CI

GitHub Actions (`.github/workflows/frontend-ci.yml`) ทำงานเมื่อ push/PR เข้า `main`: ติดตั้งด้วย `npm ci` และตรวจว่า build ผ่าน

---

## ทีมผู้พัฒนา — ยังไม่ได้นอน

| สมาชิก | คลาสในเกม | โปรเจกต์หลัก |
| --- | --- | --- |
| ภัทษชัย สว่างกัลป์ (เพชร) | Code Knight | AI Portfolio Chatbot, HACK4HOPE Homeless Solutions, Superstore Sales Forecasting |
| ปาณัสม์ เบญจวรรณ (พีซ) | Data Sage | AI Portfolio Chatbot, Big Data Processing and Analytics |
| กันต์ธนวิท ทองกร (กัน) | Drone Pilot | AI Portfolio Chatbot, Drone Mission Data Analytics |
