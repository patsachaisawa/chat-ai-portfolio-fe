// สไปรต์พิกเซลต้นฉบับ (ออกแบบเอง ไม่อ้างอิงตัวละครของงานอื่น)
// แต่ละตัวอักษรใน rows = 1 พิกเซล, '.' = โปร่งใส, สีดูจาก palette

export type Palette = Record<string, string>;

/* ---------------- ฮีโร่ (16 x 20) ---------------- */
export const HERO_ROWS: string[] = [
  '....K..KK..K....', // 0 ผมแหลม
  '...KHKKHHKKHK...', // 1
  '...KHHhHHhHHK...', // 2
  '..KHHHHHHHHHHK..', // 3
  '..KHVVVVVVVVHK..', // 4 ไบเซอร์
  '..KSVWEVVEWVSK..', // 5 ตา
  '..KSSSSSSSSSSK..', // 6
  '...KSSSSSSSSK...', // 7 ปาก (ปิด)
  '....KKSSSSKK....', // 8 คาง
  '.OOKCCCWWCCCKOO.', // 9 ลำตัว + ผ้าคลุม
  '.OOKCCWWWWCCKOO.', // 10 สัญลักษณ์บนอก
  '.OoKGCCWWCCGKoO.', // 11
  '.OoKGCCCCCCGKoO.', // 12
  '.OoKKVVVVVVKKoO.', // 13 เข็มขัด
  '..OKccCCCCccKO..', // 14
  '..oKCCCKKCCCKo..', // 15
  '...KCCCK.KCCCK..', // 16 ขา
  '...KCCCK.KCCCK..', // 17
  '...KBBBK.KBBBK..', // 18 รองเท้า
  '..KKBBBKKKBBBKK.', // 19
];

const HERO_PALETTE_1: Palette = {
  K: '#0b1020',
  H: '#2b3a8c',
  h: '#4a63d8',
  S: '#f2c6a0',
  V: '#ffd23f',
  W: '#ffffff',
  E: '#0b1020',
  M: '#b0453a',
  C: '#27c4e8',
  c: '#1b8fb0',
  O: '#ff7a1a',
  o: '#c9560a',
  B: '#3a2a66',
  G: '#ffd23f',
};

/* ---------------- ฮีโร่คนที่ 2: นักวิเคราะห์ข้อมูล (แว่น + เสื้อคลุมแล็บ) ---------------- */
export const HERO2_ROWS: string[] = [
  '....KKKKKKKK....', // 0
  '...KHHhhhHHHK...', // 1 ผมสีน้ำตาล
  '..KHHHHHhHHHHK..', // 2
  '..KHHSSSSSSHHK..', // 3 หน้าม้า
  '..KSSSSSSSSSSK..', // 4
  '..KSFFFSSFFFSK..', // 5 กรอบแว่น
  '..KSFEFSSFEFSK..', // 6 ตา
  '...KSSSSSSSSK...', // 7 ปาก
  '....KKSSSSKK....', // 8
  '..KKCCCWWCCCKK..', // 9 เสื้อคลุมแล็บ
  '.KCCCCWWWWCCCCK.', // 10
  '.KCcCCWYYWCCcCK.', // 11 คริสตัลข้อมูล
  '.KCcCCCWWCCCcCK.', // 12
  '.KCcCCCCCCCCcCK.', // 13
  '.KCcCCCGGCCCcCK.', // 14
  '..KCcCCCCCCcCK..', // 15
  '..KCCCCKKCCCCK..', // 16
  '...KBBBK.KBBBK..', // 17
  '...KBBBK.KBBBK..', // 18
  '..KKBBBKKKBBBKK.', // 19
];

const HERO_PALETTE_2: Palette = {
  K: '#0b1020',
  H: '#6b3f1f',
  h: '#9a5f2e',
  S: '#f2c6a0',
  F: '#4fe3ff',
  E: '#0b1020',
  M: '#b0453a',
  C: '#18b58a',
  c: '#0e8466',
  W: '#ffffff',
  Y: '#ff4d8d',
  G: '#ffd23f',
  B: '#2a2f5c',
};

/* ---------------- ฮีโร่คนที่ 3: นักบินโดรน (แว่นกอกเกิลบนหัว + เป้โดรน) ---------------- */
export const HERO3_ROWS: string[] = [
  '....KKKKKKKK....', // 0
  '...KHHHHHHHHK...', // 1 ผมดำ
  '..KHHHhhHHHHHK..', // 2
  '..KGGLLGGLLGGK..', // 3 กอกเกิลบนหน้าผาก
  '..KSSSSSSSSSSK..', // 4
  '..KSSESSSSESSK..', // 5 ตา
  '..KSSSSSSSSSSK..', // 6
  '...KSSSSSSSSK...', // 7 ปาก
  'PPP.KKSSSSKK.PPP', // 8 ใบพัดโดรน
  '.pKKRRRWWRRRKKp.', // 9
  '.KRRRRWWWWRRRRK.', // 10 แจ็กเก็ตสีแดง
  '.KRrRRWYYWRRrRK.', // 11 โลโก้โดรน
  '.KRrRRRWWRRRrRK.', // 12
  '.KRrRRRRRRRRrRK.', // 13
  '.KSSKGGGGGGKSSK.', // 14 มือ + เข็มขัด
  '..KKRRRKKRRRKK..', // 15
  '...KDDDK.KDDDK..', // 16
  '...KDDDK.KDDDK..', // 17
  '...KBBBK.KBBBK..', // 18
  '..KKBBBKKKBBBKK.', // 19
];

const HERO_PALETTE_3: Palette = {
  K: '#0b1020',
  H: '#2a2a3a',
  h: '#5a5a78',
  G: '#ff7a1a',
  L: '#8fe9ff',
  S: '#f2c6a0',
  E: '#0b1020',
  M: '#b0453a',
  R: '#e63946',
  r: '#9e1f2b',
  W: '#ffffff',
  Y: '#ffd23f',
  D: '#2b3350',
  B: '#1c1c2e',
  P: '#c0c8ff',
  p: '#6b7280',
};

interface HeroSprite {
  rows: string[];
  palette: Palette;
  /** แถวที่ใช้แสดงตอนกระพริบตา / อ้าปาก */
  blink: { row: number; text: string };
  mouth: { row: number; text: string };
}

export const HERO_SPRITES: Record<1 | 2 | 3, HeroSprite> = {
  1: {
    rows: HERO_ROWS,
    palette: HERO_PALETTE_1,
    blink: { row: 5, text: '..KSVVVVVVVVSK..' },
    mouth: { row: 7, text: '...KSSSMMSSSK...' },
  },
  2: {
    rows: HERO2_ROWS,
    palette: HERO_PALETTE_2,
    blink: { row: 6, text: '..KSFFFSSFFFSK..' },
    mouth: { row: 7, text: '...KSSSMMSSSK...' },
  },
  3: {
    rows: HERO3_ROWS,
    palette: HERO_PALETTE_3,
    blink: { row: 5, text: '..KSKKSSSSKKSK..' },
    mouth: { row: 7, text: '...KSSSMMSSSK...' },
  },
};

/** สร้างเฟรมของฮีโร่: กระพริบตา / อ้าปากพูด */
export function buildHeroRows(variant: 1 | 2 | 3, blink: boolean, mouthOpen: boolean): string[] {
  const sprite = HERO_SPRITES[variant];
  const rows = sprite.rows.slice();
  if (blink) rows[sprite.blink.row] = sprite.blink.text;
  if (mouthOpen) rows[sprite.mouth.row] = sprite.mouth.text;
  return rows;
}

/* ---------------- ของประกอบฉาก: โดรนลอย (10 x 6) ---------------- */
export const DRONE_ROWS: string[] = [
  'PP......PP',
  '.PPKKKKPP.',
  '..KGGGGK..',
  '..KGLLGK..',
  '..KKKKKK..',
  '...K..K...',
];

export const DRONE_PALETTE: Palette = {
  K: '#0b1020',
  P: '#c0c8ff',
  G: '#e63946',
  L: '#8fe9ff',
};

/* ---------------- หุ่นยนต์ผู้ช่วย (12 x 12) ---------------- */
export const ROBOT_ROWS: string[] = [
  '.....YY.....',
  '.....K......',
  '..KKKKKKKK..',
  '.KGGGGGGGGK.',
  '.KGLLGGLLGK.',
  '.KGLLGGLLGK.',
  '.KGGGGGGGGK.',
  '.KGGKKKKGGK.',
  '..KKKKKKKK..',
  '.KBBKGGKBBK.',
  '.KBBKGGKBBK.',
  '..KK.KK.KK..',
];

export const ROBOT_PALETTE: Palette = {
  K: '#0b1020',
  G: '#9fb4ee',
  L: '#29f0d0',
  B: '#ff7a1a',
  Y: '#ffd23f',
};

/* ---------------- เมฆ (14 x 5) ---------------- */
export const CLOUD_ROWS: string[] = [
  '....WWWW......',
  '..WWWWWWWW.WW.',
  '.WWWWWWWWWWWWW',
  'WWWWWWWWWWWWWW',
  '.ssssssssssss.',
];

export const CLOUD_PALETTE: Palette = {
  W: '#dfe6ff',
  s: '#9aa8e8',
};

/* ---------------- พระอาทิตย์ (10 x 9) ---------------- */
export const SUN_ROWS: string[] = [
  '...YYYY...',
  '..YYYYYY..',
  '.YYYYYYYY.',
  'YYYYYYYYYY',
  'YYYYYYYYYY',
  'YYYYYYYYYY',
  '.YYYYYYYY.',
  '..YYYYYY..',
  '...YYYY...',
];

export const SUN_PALETTE: Palette = {
  Y: '#ffb347',
};
