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

const HERO_PALETTE_2: Palette = {
  K: '#0b1020',
  H: '#7a2bd8',
  h: '#a45cff',
  S: '#f2c6a0',
  V: '#9fffd1',
  W: '#ffffff',
  E: '#0b1020',
  M: '#b0453a',
  C: '#ff4d8d',
  c: '#c42f68',
  O: '#27c4e8',
  o: '#1b8fb0',
  B: '#1c2760',
  G: '#9fffd1',
};

export const HERO_PALETTES: Record<1 | 2, Palette> = {
  1: HERO_PALETTE_1,
  2: HERO_PALETTE_2,
};

/** สร้างเฟรมของฮีโร่: กระพริบตา / อ้าปากพูด */
export function buildHeroRows(blink: boolean, mouthOpen: boolean): string[] {
  const rows = HERO_ROWS.slice();
  if (blink) rows[5] = '..KSVVVVVVVVSK..';
  if (mouthOpen) rows[7] = '...KSSSMMSSSK...';
  return rows;
}

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
