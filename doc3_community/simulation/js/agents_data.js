/**
 * Saemaul-Smallville Agents Roster (100x75 Coordinates)
 */

const AGENTS_ROSTER = [
    // 1. 원주민 및 행정망 (4명)
    {
        id: "agent_kim",
        name: "김이장",
        role: "마을 이장 (68세)",
        group: "admin",
        sprite: "Arthur_Burton.png",
        homePos: { x: 45, y: 56 },
        workPos: { x: 50, y: 32 },
        color: "#1e3a5f",
        personality: "관례와 질서를 중시하며 군청 수로 정비 사업을 조속히 추진하고자 함.",
        schedule: [
            { time: 8, x: 50, y: 32, action: "마을회관 청사 집무실 공문 확인" },
            { time: 10, x: 68, y: 35, action: "오상회 구판장에서 주민 여론 청취" },
            { time: 14, x: 49, y: 42, action: "회관 앞 잔디광장에서 수로 총회 소집" },
            { time: 17, x: 45, y: 56, action: "자택 귀가" }
        ]
    },
    {
        id: "agent_park",
        name: "박부녀",
        role: "부녀회장 (64세)",
        group: "admin",
        sprite: "Carmen_Ortiz.png",
        homePos: { x: 49, y: 58 },
        workPos: { x: 50, y: 42 },
        color: "#d81b60",
        personality: "동네 소식통이자 갈등 중재자. 로컬푸드 판로 개척에 적극적.",
        schedule: [
            { time: 8, x: 50, y: 42, action: "회관 앞 광장 청소 및 비품 점검" },
            { time: 10, x: 70, y: 36, action: "구판장 앞 평상에서 주민들과 환담" },
            { time: 13, x: 24, y: 27, action: "청년 로컬공방 방문하여 가공품 협의" },
            { time: 16, x: 50, y: 42, action: "마을 총회 참석" }
        ]
    },
    {
        id: "agent_jung",
        name: "정노인",
        role: "영농회 고문 (76세)",
        group: "admin",
        sprite: "Tom_Moreno.png",
        homePos: { x: 41, y: 60 },
        workPos: { x: 18, y: 52 },
        color: "#4e342e",
        personality: "전통 농경 방식을 고수하며 외지인에 대해 다소 방어적 태도.",
        schedule: [
            { time: 8, x: 18, y: 52, action: "전통 다랭이논 물꼬 확인 및 둑 살피기" },
            { time: 11, x: 54, y: 32, action: "마을회관 경로당에서 바둑" },
            { time: 14, x: 69, y: 36, action: "구판장에서 주민들과 영농 푸념" },
            { time: 17, x: 41, y: 60, action: "귀가" }
        ]
    },
    {
        id: "agent_choi",
        name: "최총무",
        role: "청년회 고참 (58세)",
        group: "admin",
        sprite: "Carlos_Gomez.png",
        homePos: { x: 53, y: 60 },
        workPos: { x: 46, y: 33 },
        color: "#00695c",
        personality: "이장 보좌 실무자. 청년들과 원주민 사이에서 실리적 타협안 모색.",
        schedule: [
            { time: 8, x: 46, y: 33, action: "회관 농기계 보관창고 점검" },
            { time: 11, x: 18, y: 14, action: "스마트팜 단지 방문하여 현황 파악" },
            { time: 14, x: 48, y: 42, action: "회관 잔디광장 총회 마이크 세팅" },
            { time: 17, x: 53, y: 60, action: "귀가" }
        ]
    },

    // 2. 청년 귀농 및 혁신그룹 (4명)
    {
        id: "agent_lee",
        name: "이지훈",
        role: "스마트팜 대표 (34세)",
        group: "youth",
        sprite: "Ryan_Park.png",
        homePos: { x: 14, y: 22 },
        workPos: { x: 16, y: 12 },
        color: "#2e7d32",
        personality: "데이터 기반 농업 신봉자. 공동 수로 대신 스마트 관수 시스템 도입 주장.",
        schedule: [
            { time: 8, x: 16, y: 12, action: "스마트온실 센서 점검 및 양액 제어" },
            { time: 11, x: 23, y: 27, action: "로컬카페에서 강수연과 유통 회의" },
            { time: 14, x: 47, y: 42, action: "마을총회 참석하여 스마트 관수 지원 피력" },
            { time: 17, x: 16, y: 12, action: "온실 야간 센서 모니터링" }
        ]
    },
    {
        id: "agent_kang",
        name: "강수연",
        role: "로컬 청년창업가 (32세)",
        group: "youth",
        sprite: "Hailey_Johnson.png",
        homePos: { x: 20, y: 26 },
        workPos: { x: 22, y: 27 },
        color: "#f57c00",
        personality: "로컬푸드 가공품 및 체험 농장 기획. 마을 원주민과의 협업 희망.",
        schedule: [
            { time: 8, x: 22, y: 27, action: "가공공방 오픈 및 과일잼 시제품 검수" },
            { time: 11, x: 67, y: 35, action: "구판장에 로컬 가공품 진열 협의" },
            { time: 14, x: 51, y: 42, action: "회관 앞마당 총회 참석" },
            { time: 17, x: 22, y: 27, action: "온라인 스마트스토어 택배 포장" }
        ]
    },
    {
        id: "agent_cho",
        name: "조민우",
        role: "친환경 귀농초보 (29세)",
        group: "youth",
        sprite: "Eddy_Lin.png",
        homePos: { x: 12, y: 48 },
        workPos: { x: 14, y: 52 },
        color: "#8bc34a",
        personality: "자금과 경험이 부족하여 정노인의 전통 농사 노하우 전수를 희망.",
        schedule: [
            { time: 8, x: 14, y: 52, action: "친환경 논 제초 및 우렁이 방사" },
            { time: 10, x: 18, y: 52, action: "정노인 밭에서 물꼬 관리 요령 청취" },
            { time: 13, x: 23, y: 27, action: "청년 카페에서 이지훈과 지원금 상담" },
            { time: 15, x: 46, y: 42, action: "마을총회 참관" }
        ]
    },
    {
        id: "agent_han",
        name: "한유진",
        role: "귀촌 프리랜서 (36세)",
        group: "youth",
        sprite: "Abigail_Chen.png",
        homePos: { x: 55, y: 54 },
        workPos: { x: 24, y: 28 },
        color: "#7b1fa2",
        personality: "원격 근무 디자이너. 마을 일에 관망세이나 마을 브랜딩에는 관심.",
        schedule: [
            { time: 9, x: 24, y: 28, action: "청년 카페에서 원격 디자인 업무" },
            { time: 12, x: 68, y: 35, action: "구판장에서 점심 샌드위치 구매" },
            { time: 15, x: 52, y: 42, action: "회관 총회 뒤편에서 주민 발언 메모" },
            { time: 18, x: 55, y: 54, action: "자택 귀가" }
        ]
    },

    // 3. 상인, 다문화, 외곽 농가 (4명)
    {
        id: "agent_oh",
        name: "오상회",
        role: "구판장 점주 (61세)",
        group: "local",
        sprite: "Adam_Smith.png",
        homePos: { x: 74, y: 34 },
        workPos: { x: 68, y: 35 },
        color: "#5d4037",
        personality: "마을 모든 소문의 발원지이자 계산이 빠름. 외상값 관리에 철저.",
        schedule: [
            { time: 7, x: 68, y: 35, action: "구판장 셔터 열고 물품 진열" },
            { time: 10, x: 69, y: 36, action: "평상에서 들른 손님들에게 동네 소식 교환" },
            { time: 14, x: 68, y: 35, action: "매대 관리 및 미수금 장부 점검" },
            { time: 17, x: 50, y: 42, action: "총회 참석하여 상인 지원 대책 문의" }
        ]
    },
    {
        id: "agent_lin",
        name: "린",
        role: "이주여성 영농인 (33세)",
        group: "local",
        sprite: "Yuriko_Yamamoto.png",
        homePos: { x: 25, y: 58 },
        workPos: { x: 22, y: 54 },
        color: "#00838f",
        personality: "다문화가정 주축으로 부지런함. 마을 주민들과 정서적 유대를 넓히고자 함.",
        schedule: [
            { time: 8, x: 22, y: 54, action: "특용작물 시설 하우스 수확" },
            { time: 11, x: 68, y: 35, action: "구판장에 채소 납품" },
            { time: 14, x: 48, y: 42, action: "회관 마당 총회 참석" },
            { time: 17, x: 25, y: 58, action: "가족 저녁 준비" }
        ]
    },
    {
        id: "agent_yoon",
        name: "윤축산",
        role: "외곽 한우농가 (55세)",
        group: "local",
        sprite: "Wolfgang_Schulz.png",
        homePos: { x: 82, y: 56 },
        workPos: { x: 80, y: 52 },
        color: "#bf360c",
        personality: "축사 냄새 민원으로 마을과 다소 소원. 수로 개선 시 정화조 지원을 원함.",
        schedule: [
            { time: 7, x: 80, y: 52, action: "축사 사료 급여 및 분뇨 처리" },
            { time: 11, x: 68, y: 35, action: "구판장 방문하여 건전지 등 생필품 구매" },
            { time: 14, x: 47, y: 42, action: "총회 참석하여 축산 농가 고충 성토" },
            { time: 17, x: 80, y: 52, action: "축사 방역 및 야간 환기 점검" }
        ]
    },
    {
        id: "agent_bae",
        name: "배과수",
        role: "산비탈 과수원주 (67세)",
        group: "local",
        sprite: "Francisco_Lopez.png",
        homePos: { x: 82, y: 14 },
        workPos: { x: 78, y: 12 },
        color: "#558b2f",
        personality: "고지대라 가뭄 때마다 농업용수 부족에 시달려 수로 개보수에 사활을 걺.",
        schedule: [
            { time: 8, x: 78, y: 12, action: "과수원 도장지 전지 및 관수 밸브 확인" },
            { time: 11, x: 30, y: 39, action: "용수로 상류 취입구 유량 상태 확인" },
            { time: 14, x: 49, y: 42, action: "총회에서 고지대 과수원 관수 지분 강력 요구" },
            { time: 17, x: 82, y: 14, action: "과수원 자택 귀가" }
        ]
    }
];
