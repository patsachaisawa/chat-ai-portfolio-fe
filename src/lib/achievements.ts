// เก็บรายการ Achievement ที่ปลดล็อกแล้วไว้ในเบราว์เซอร์ (ถ้าเก็บไม่ได้ ระบบยังทำงานต่อได้)
const KEY = 'pixel_achievements';

export function loadAchievements(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function hasAchievement(id: string): boolean {
  return loadAchievements().includes(id);
}

export function saveAchievement(id: string): void {
  try {
    const list = loadAchievements();
    if (!list.includes(id)) {
      localStorage.setItem(KEY, JSON.stringify([...list, id]));
    }
  } catch {
    // ignore
  }
}
