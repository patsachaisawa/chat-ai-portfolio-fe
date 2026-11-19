import { memo, useMemo } from 'react';
import type { Palette } from '../lib/sprites';

interface PixelArtProps {
  rows: string[];
  palette: Palette;
  /** ขนาดต่อ 1 พิกเซล (px) */
  size?: number;
  className?: string;
  /** ถ้าใส่ จะเป็นรูปที่อ่านออกเสียงได้ ถ้าไม่ใส่ถือเป็นของตกแต่ง */
  title?: string;
}

// วาดสไปรต์จากตารางตัวอักษรเป็น SVG (รวมพิกเซลสีเดียวกันแนวนอนเป็นแท่งเดียวเพื่อลดจำนวน rect)
function PixelArtBase({ rows, palette, size = 6, className, title }: PixelArtProps) {
  const width = rows[0]?.length ?? 0;
  const height = rows.length;

  const rects = useMemo(() => {
    const out: { x: number; y: number; w: number; fill: string }[] = [];
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        const fill = palette[ch];
        if (!fill) {
          x += 1;
          continue;
        }
        let w = 1;
        while (x + w < row.length && row[x + w] === ch) w += 1;
        out.push({ x, y, w, fill });
        x += w;
      }
    });
    return out;
  }, [rows, palette]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width * size}
      height={height * size}
      shapeRendering="crispEdges"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}

const PixelArt = memo(PixelArtBase);
export default PixelArt;
