/**
 * Saemaul-Smallville Large World Map Definition
 * 100 columns x 75 rows grid
 * Tile size: 32px (World size: 3200px x 2400px)
 */

const MAP_CONFIG = {
    cols: 100,
    rows: 75,
    tileSize: 32,
    worldWidth: 3200,
    worldHeight: 2400
};

// 랜드마크 구역 정의 (대형 월드 좌표계)
const VILLAGE_ZONES = [
    {
        id: "hall",
        name: "마을회관 청사",
        subtitle: "행정 중심 / 방송실 / 대회의실",
        x: 42, y: 28, w: 16, h: 10,
        color: "#1e3a5f",
        accent: "#4a90e2",
        type: "civic"
    },
    {
        id: "plaza",
        name: "회관 앞 잔디광장 및 쉼터 정자",
        subtitle: "주민 총회 및 공동 집결 마당",
        x: 44, y: 39, w: 12, h: 8,
        color: "#7a6728",
        accent: "#d4af37",
        type: "plaza"
    },
    {
        id: "store",
        name: "오상회 구판장 및 버스정류장",
        subtitle: "생필품 유통 / 마을 소통 허브 / 평상",
        x: 64, y: 32, w: 14, h: 9,
        color: "#5c3826",
        accent: "#8d5b4c",
        type: "commercial"
    },
    {
        id: "greenhouse",
        name: "스마트팜 혁신단지",
        subtitle: "ICT 연동 온실 / 양액 제어실 / 연구포장",
        x: 8, y: 8, w: 22, h: 14,
        color: "#1b5e20",
        accent: "#43a047",
        type: "smartfarm"
    },
    {
        id: "cafe",
        name: "청년 로컬공방 & 카페",
        subtitle: "농산물 가공 / 청년 창업 교류 공간",
        x: 18, y: 24, w: 12, h: 8,
        color: "#e65100",
        accent: "#fb8c00",
        type: "youth"
    },
    {
        id: "fields",
        name: "전통 농경지 (친환경 벼농사 지구)",
        subtitle: "다랭이논 / 용수 공급 관정 / 시범포",
        x: 8, y: 44, w: 26, h: 22,
        color: "#33691e",
        accent: "#689f38",
        type: "farm"
    },
    {
        id: "waterway",
        name: "공동 농업용수로 (간선 수로)",
        subtitle: "상류 취입보 ~ 농경지 연결 핵심 수로",
        x: 5, y: 38, w: 55, h: 3,
        color: "#01579b",
        accent: "#0288d1",
        type: "water"
    },
    {
        id: "orchard",
        name: "산비탈 사과 과수원",
        subtitle: "고지대 과수 단지 / 점적관수 라인",
        x: 68, y: 8, w: 24, h: 16,
        color: "#388e3c",
        accent: "#81c784",
        type: "orchard"
    },
    {
        id: "cattle",
        name: "외곽 한우 축산단지",
        subtitle: "외곽 대형 축사 / 퇴비사 (악취 완충지대)",
        x: 72, y: 48, w: 22, h: 18,
        color: "#4e342e",
        accent: "#8d6e63",
        type: "cattle"
    },
    {
        id: "residential",
        name: "마을 주거 가옥단지 (안길 골목)",
        subtitle: "주민 단독주택 군락 / 텃밭",
        x: 38, y: 52, w: 24, h: 16,
        color: "#263238",
        accent: "#607d8b",
        type: "residential"
    }
];

// 타일 그리드 생성 (100 x 75)
// 0: grass, 1: road, 2: water, 3: crop
function generateLargeVillageGrid() {
    const grid = [];
    for (let r = 0; r < MAP_CONFIG.rows; r++) {
        const row = new Uint8Array(MAP_CONFIG.cols);
        grid.push(row);
    }

    // 1. 주요 도로망 (Main Roads)
    // 중앙 동서 관통 간선도로 (Y: 34~36, X: 5~95)
    for (let r = 34; r <= 36; r++) {
        for (let c = 5; c < 95; c++) {
            grid[r][c] = 1;
        }
    }
    // 서쪽 남북 도로 (온실 - 카페 - 전통논 연결, X: 32~33, Y: 8~68)
    for (let r = 8; r <= 68; r++) {
        grid[r][32] = 1;
        grid[r][33] = 1;
    }
    // 동쪽 남북 도로 (과수원 - 구판장 - 축사 연결, X: 65~66, Y: 8~68)
    for (let r = 8; r <= 68; r++) {
        grid[r][65] = 1;
        grid[r][66] = 1;
    }
    // 회관 광장 진입로 및 주거단지 연결로 (X: 48~51, Y: 36~68)
    for (let r = 36; r <= 68; r++) {
        for (let c = 48; c <= 51; c++) {
            grid[r][c] = 1;
        }
    }

    // 2. 공동 농업용수로 (물 타일: 2)
    for (let r = 38; r <= 40; r++) {
        for (let c = 5; c <= 60; c++) {
            grid[r][c] = 2;
        }
    }

    // 3. 전통 논/밭 (작물 타일: 3)
    for (let r = 45; r <= 64; r++) {
        for (let c = 10; c <= 30; c++) {
            grid[r][c] = 3;
        }
    }

    // 4. 산비탈 과수원 (작물 타일: 3)
    for (let r = 10; r <= 22; r++) {
        for (let c = 70; c <= 90; c++) {
            grid[r][c] = 3;
        }
    }

    return grid;
}

const VILLAGE_GRID = generateLargeVillageGrid();
