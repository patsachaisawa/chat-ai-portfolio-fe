import { useEffect, useRef } from 'react';

const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** ดักรหัสลับ ↑↑↓↓←→←→ B A */
export function useKonami(onTrigger: () => void): void {
  const callback = useRef(onTrigger);

  useEffect(() => {
    callback.current = onTrigger;
  }, [onTrigger]);

  useEffect(() => {
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[index]) {
        index += 1;
        if (index === SEQUENCE.length) {
          index = 0;
          callback.current();
        }
      } else {
        index = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
