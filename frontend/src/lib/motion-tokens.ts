/** Shared commerce motion language. CSS micro-interactions mirror these values. */
export const motionTokens = {
  duration: {
    fast: 0.24,
    base: 0.5,
    reveal: 1.15,
    immersive: 1.4,
  },
  ease: {
    out: "power3.out",
    editorial: "power4.out",
    inOut: "power3.inOut",
  },
  reveal: {
    start: "top 90%",
    distance: 56,
  },
} as const;
