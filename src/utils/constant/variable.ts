const DASS_SCORE = {
  DEPRESSION: {
    NORMAL: {
      MIN: 0,
      MAX: 9,
    },
    MILD: {
      MIN: 10,
      MAX: 13,
    },
    MODERATE: {
      MIN: 14,
      MAX: 20,
    },
    SEVERE: {
      MIN: 21,
      MAX: 27,
    },
    EXTREMELY_SEVERE: {
      MIN: 28,
      MAX: Infinity,
    },
  },
  ANXIETY: {
    NORMAL: {
      MIN: 0,
      MAX: 7,
    },
    MILD: {
      MIN: 8,
      MAX: 9,
    },
    MODERATE: {
      MIN: 10,
      MAX: 14,
    },
    SEVERE: {
      MIN: 15,
      MAX: 19,
    },
    EXTREMELY_SEVERE: {
      MIN: 20,
      MAX: Infinity,
    },
  },
  STRESS: {
    NORMAL: {
      MIN: 0,
      MAX: 14,
    },
    MILD: {
      MIN: 15,
      MAX: 18,
    },
    MODERATE: {
      MIN: 19,
      MAX: 25,
    },
    SEVERE: {
      MIN: 26,
      MAX: 33,
    },
    EXTREMELY_SEVERE: {
      MIN: 34,
      MAX: Infinity,
    },
  },
} as const;

export default DASS_SCORE;
