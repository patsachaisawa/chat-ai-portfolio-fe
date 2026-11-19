import PixelArt from './PixelArt';
import { CLOUD_PALETTE, CLOUD_ROWS, SUN_PALETTE, SUN_ROWS } from '../lib/sprites';

// ตึกในเมืองยามเย็น: [x, กว้าง, สูง] บนกระเบื้องกว้าง 80 หน่วย
const BUILDINGS: Array<[number, number, number]> = [
  [0, 10, 14],
  [10, 8, 22],
  [18, 12, 10],
  [30, 9, 26],
  [39, 11, 16],
  [50, 8, 30],
  [58, 12, 12],
  [70, 10, 20],
];
const TILE_H = 32;

function skylineUri(fill: string, trim: string, lit: string): string {
  const parts: string[] = [];
  BUILDINGS.forEach(([x, w, h], bi) => {
    const y = TILE_H - h;
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`);
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="1" fill="${trim}"/>`);
    for (let wx = x + 2; wx < x + w - 1; wx += 3) {
      for (let wy = y + 3; wy < TILE_H - 2; wy += 4) {
        if ((wx + wy + bi) % 3 !== 0) {
          parts.push(`<rect x="${wx}" y="${wy}" width="1" height="2" fill="${lit}"/>`);
        }
      }
    }
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="${TILE_H}" viewBox="0 0 80 ${TILE_H}" shape-rendering="crispEdges">${parts.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const SKYLINE_FAR = skylineUri('#2a2f78', '#3a4296', '#6a74d8');
const SKYLINE_NEAR = skylineUri('#0d1230', '#1c2760', '#ffd23f');

const CLOUDS = [
  { top: '10%', size: 6, duration: '90s', delay: '-30s' },
  { top: '26%', size: 8, duration: '120s', delay: '-80s' },
  { top: '38%', size: 5, duration: '70s', delay: '-10s' },
];

// ฉากหลังเมืองพิกเซลยามเย็น: ดาวกระพริบ พระอาทิตย์ เมฆลอย ตึก 2 ชั้น และเส้นสแกนบางๆ
export default function PixelBackground() {
  return (
    <>
      <div className="pixel-bg" aria-hidden="true">
        <div className="pixel-stars" />
        <div className="pixel-sun">
          <PixelArt rows={SUN_ROWS} palette={SUN_PALETTE} size={8} />
        </div>
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className="pixel-cloud"
            style={{ top: c.top, animationDuration: c.duration, animationDelay: c.delay }}
          >
            <PixelArt rows={CLOUD_ROWS} palette={CLOUD_PALETTE} size={c.size} />
          </div>
        ))}
        <div className="pixel-skyline pixel-skyline--far" style={{ backgroundImage: SKYLINE_FAR }} />
        <div className="pixel-skyline pixel-skyline--near" style={{ backgroundImage: SKYLINE_NEAR }} />
      </div>
      <div className="crt" aria-hidden="true" />
    </>
  );
}
