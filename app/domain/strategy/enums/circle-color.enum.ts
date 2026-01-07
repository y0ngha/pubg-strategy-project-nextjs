export const CircleColor = {
    PHASE_1: '#0000ff1a',
    PHASE_2: '#0000ff26',
    PHASE_3: '#0000ff33',
    PHASE_4: '#0000ff40',
    PHASE_5: '#0000ff4d',
    PHASE_6: '#0000ff59',
    PHASE_7: '#0000ff66',
    PHASE_8: '#0000ff73',
} as const;

export type CircleColor = (typeof CircleColor)[keyof typeof CircleColor];
