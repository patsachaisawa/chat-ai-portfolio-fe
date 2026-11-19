import { createContext, useContext } from 'react';

// ตัวกลางให้ทุกหน้าเรียกเอฟเฟกต์เกมได้ (Power-up เต็มจอ และ Achievement toast)
export interface GameFx {
  triggerPowerUp: () => void;
  unlock: (id: string, title: string, desc: string) => void;
}

export const GameFxContext = createContext<GameFx>({
  triggerPowerUp: () => {},
  unlock: () => {},
});

export function useGameFx(): GameFx {
  return useContext(GameFxContext);
}
