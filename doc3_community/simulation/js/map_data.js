const MAP_CONFIG = {
    cols: 32,
    rows: 24,
    tileSize: 32,
    width: 1024,
    height: 768
};

const VILLAGE_ZONES = [
    {
        id: 'hall',
        name: '마을회관 & 경로당',
        subtitle: '행정 중심 / 주민총회 거점',
        x: 12, y: 3, w: 8, h: 5,
        color: '#1e3a5f',
        accent: '#4a90e2',
        type: 'civic'
    },
    {
        id: 'plaza',
        name: '회관 앞마당 (공동광장)',
        subtitle: '주민 집결 및 소통 마당',
        x: 13, y: 8, w: 6, h: 3,
        color: '#c2a649',
        accent: '#e5c158',
        type: 'plaza'
    },
    {
        id: 'store',
        name: '오상회 구판장 & 쉼터',
        subtitle: '식료품 유통 및 소문 허브',
        x: 23, y: 7, w: 7, h: 5,
        color: '#795548',
        accent: '#a1887f',
        type: 'commercial'
    },
    {
        id: 'greenhouse',
        name: '스마트온실 & 청년카페',
        subtitle: 'ICT 농업 / 가공품 기획',
        x: 2, y: 3, w: 8, h: 5,
        color: '#2e7d32',
        accent: '#66bb6a',
        type: 'smartfarm'
    },
    {
        id: 'orchard',
        name: '산비탈 과수원',
        subtitle: '사과 과수원 및 고지 농지',
        x: 23, y: 2, w: 7, h: 4,
        color: '#558b2f',
        accent: '#8bc34a',
        type: 'orchard'
    },
    {
        id: 'waterway',
        name: '공동 농업용수로',
        subtitle: '용수 분배 및 수리 갈등 구역',
        x: 1, y: 9, w: 9, h: 1,
        color: '#0277bd',
        accent: '#29b6f6',
        type: 'water'
    },
    {
        id: 'fields',
        name: '전통 농경지 (친환경 논밭)',
        subtitle: '전통 벼농사 / 유기농 시범포',
        x: 2, y: 11, w: 8, h: 6,
        color: '#33691e',
        accent: '#689f38',
        type: 'farm'
    },
    {
        id: 'cattle',
        name: '외곽 한우축사',
        subtitle: '축산 농가 (악취 민원 갈등 잠재)',
        x: 23, y: 15, w: 7, h: 6,
        color: '#4e342e',
        accent: '#8d6e63',
        type: 'cattle'
    },
    {
        id: 'residential',
        name: '마을 주거 가옥단지',
        subtitle: '주민 사생활 및 휴식 공간',
        x: 12, y: 14, w: 8, h: 6,
        color: '#37474f',
        accent: '#78909c',
        type: 'residential'
    }
];

function generateVillageGrid() {
    const grid = [];
    for (let r = 0; r < MAP_CONFIG.rows; r++) {
        const row = [];
        for (let c = 0; c < MAP_CONFIG.cols; c++) {
            row.push(0);
        }
        grid.push(row);
    }

    for (let c = 0; c < MAP_CONFIG.cols; c++) {
        grid[9][c] = 1;
        grid[10][c] = 1;
    }
    for (let r = 2; r < 21; r++) {
        grid[r][10] = 1;
        grid[r][11] = 1;
    }
    for (let r = 2; r < 22; r++) {
        grid[r][21] = 1;
        grid[r][22] = 1;
    }

    for (let r = 8; r <= 11; r++) {
        for (let c = 13; c <= 18; c++) {
            grid[r][c] = 1;
        }
    }

    for (let c = 1; c <= 9; c++) {
        grid[8][c] = 2;
    }

    for (let r = 12; r <= 17; r++) {
        for (let c = 2; c <= 9; c++) {
            grid[r][c] = 3;
        }
    }

    for (let r = 2; r <= 5; r++) {
        for (let c = 24; c <= 29; c++) {
            grid[r][c] = 3;
        }
    }

    return grid;
}

const VILLAGE_GRID = generateVillageGrid();