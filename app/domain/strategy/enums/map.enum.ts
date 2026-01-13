export const PubgMap: Record<string, string> = {
    ERANGEL: 'ERANGEL',
    MIRAMAR: 'MIRAMAR',
    TAEGO: 'TAEGO',
    RONDO: 'RONDO',
    SANHOK: 'SANHOK',
    VIKENDI: 'VIKENDI',
    KARAKIN: 'KARAKIN',
    HAVEN: 'HAVEN',
    DESTON: 'DESTON',
} as const;

export type PubgMap = (typeof PubgMap)[keyof typeof PubgMap];

type Size = {
    width: number;
    height: number;
};

export const PubgMapSizes: Record<PubgMap, Size> = {
    [PubgMap.ERANGEL]: { width: 8000, height: 8000 },
    [PubgMap.MIRAMAR]: { width: 8000, height: 8000 },
    [PubgMap.TAEGO]: { width: 8000, height: 8000 },
    [PubgMap.RONDO]: { width: 8000, height: 8000 },
    [PubgMap.SANHOK]: { width: 4000, height: 4000 },
    [PubgMap.VIKENDI]: { width: 8000, height: 8000 },
    [PubgMap.KARAKIN]: { width: 2000, height: 2000 },
    [PubgMap.HAVEN]: { width: 1000, height: 1000 },
    [PubgMap.DESTON]: { width: 8000, height: 8000 },
};

export const PubgMapNames: Record<PubgMap, string> = {
    [PubgMap.ERANGEL]: '에란겔',
    [PubgMap.MIRAMAR]: '미라마',
    [PubgMap.TAEGO]: '테이고',
    [PubgMap.RONDO]: '론도',
    [PubgMap.SANHOK]: '사녹',
    [PubgMap.VIKENDI]: '비켄디',
    [PubgMap.KARAKIN]: '카라킨',
    [PubgMap.HAVEN]: '헤이븐',
    [PubgMap.DESTON]: '데스턴',
};
