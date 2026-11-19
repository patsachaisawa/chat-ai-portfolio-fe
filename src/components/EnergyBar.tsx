import type { QuotaInfo } from '../lib/useQuota';

function formatReset(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h} ชม. ${m} น.` : `${m} น.`;
}

// แถบ HP แสดงโควตา AI ที่เหลือวันนี้ (ประมาณการ ไม่ใช่ตัวเลขทางการจาก Google)
export default function EnergyBar({ quota }: { quota: QuotaInfo | null }) {
  if (!quota) return null;

  const remaining = Math.max(0, quota.limit - quota.used);
  const pct = Math.round((remaining / quota.limit) * 100);
  const tone = pct > 50 ? 'hp-ok' : pct > 20 ? 'hp-warn' : 'hp-low';

  return (
    <div className="w-full min-w-[130px]" title="ประมาณการจากจำนวนคำขอที่ระบบนับได้ ไม่ใช่ตัวเลขทางการจาก Google">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-pixel text-[9px] text-hero-gold">ENERGY</span>
        <span className="font-pixel text-[8px] text-slate-300">
          {remaining}/{quota.limit}
        </span>
      </div>
      <div className="hp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={quota.limit} aria-valuenow={remaining} aria-label="พลังงาน AI ที่เหลือวันนี้ (ประมาณการ)">
        <div className={`hp-fill ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-slate-300 mt-1 leading-snug">
        {remaining === 0 ? 'โควตาโมเดลหลักหมดแล้ว (ระบบอาจใช้โมเดลสำรอง)' : 'ประมาณการโควตาวันนี้'} · รีเซ็ตใน {formatReset(quota.resetsInSeconds)}
      </p>
    </div>
  );
}
