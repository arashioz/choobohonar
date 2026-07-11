type LenisLike = {
  stop: () => void;
  start: () => void;
};

let lenisInstance: LenisLike | null = null;

export function registerLenisInstance(instance: LenisLike | null) {
  lenisInstance = instance;
}

export function setMenuScrollLocked(locked: boolean) {
  lenisInstance?.[locked ? "stop" : "start"]();
}
