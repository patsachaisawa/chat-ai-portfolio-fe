import { useCallback, useEffect, useState } from 'react';

// ข้อมูลประมาณการโควตาจาก GET /api/quota (ฝั่ง BE)
export interface QuotaInfo {
  model: string;
  used: number;
  limit: number;
  remaining: number;
  resetsInSeconds: number;
  exhausted: boolean;
}

/**
 * ดึงโควตาที่เหลือมาแสดงเป็นแถบ HP
 * - ถ้าดึงไม่ได้ (เช่น BE ยังไม่รองรับ หรือกำลังตื่น) จะไม่แสดงแถบ ไม่กระทบการแชต
 * - การเรียกครั้งแรกตอนเปิดหน้ายังช่วยปลุก Render ที่หลับอยู่ไปในตัว
 */
export function useQuota(apiBaseUrl: string) {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/quota`);
      if (!res.ok) return;
      const data = (await res.json()) as Partial<QuotaInfo>;
      if (typeof data.used === 'number' && typeof data.limit === 'number' && data.limit > 0) {
        setQuota({
          model: String(data.model ?? ''),
          used: data.used,
          limit: data.limit,
          remaining: typeof data.remaining === 'number' ? data.remaining : Math.max(0, data.limit - data.used),
          resetsInSeconds: typeof data.resetsInSeconds === 'number' ? data.resetsInSeconds : 0,
          exhausted: Boolean(data.exhausted),
        });
      }
    } catch {
      // ซ่อนแถบไว้
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { quota, refresh };
}
