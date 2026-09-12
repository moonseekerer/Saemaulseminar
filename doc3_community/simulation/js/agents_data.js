const AGENTS_ROSTER = [
    // 1. 원주민 및 행정망 (4명)
    {
        id: 'agent_kim',
        name: '김이장',
        role: '마을 이장 (68세)',
        group: 'admin',
        sprite: 'Arthur_Burton.png',
        homePos: { x: 14, y: 15 },
        workPos: { x: 15, y: 5 },
        color: '#1e3a5f',
        personality: '관례와 질서를 중시하며 정부 수로 정비 사업을 조속히 추진하고자 함.',
        schedule: [
            { time: 8, x: 15, y: 5, action: '마을회관 행정 업무 및 군청 공문 확인' },
            { time: 10, x: 24, y: 8, action: '구판장에서 주민들과 커피 마시며 여론 청취' },
            { time: 14, x: 15, y: 9, action: '회관 앞마당에서 수로 공사 관련 주민 소집' },
            { time: 17, x: 14, y: 15, action: '귀가 및 일과 정리' }
        ]
    },
    {
        id: 'agent_park',
        name: '박부녀',
        role: '부녀회장 (64세)',
        group: 'admin',
        sprite: 'Carmen_Ortiz.png',
        homePos: { x: 16, y: 15 },
        workPos: { x: 15, y: 9 },
        color: '#d81b60',
        personality: '동네 소식통이자 갈등 중재자. 로컬푸드 판로 개척에 적극적.',
        schedule: [
            { time: 8, x: 16, y: 9, action: '회관 마당 청소 및 부녀회 비품 점검' },
            { time: 10, x: 25, y: 8, action: '구판장 앞 평상에서 어르신들과 담소' },
            { time: 13, x: 6, y: 5, action: '청년 가공카페 방문하여 가공품 협의' },
            { time: 16, x: 15, y: 9, action: '마을총회 참석' }
        ]
    },
    {
        id: 'agent_jung',
        name: '정노인',
        role: '영농회 고문 (76세)',
        group: 'admin',
        sprite: 'Tom_Moreno.png',
        homePos: { x: 13, y: 17 },
        workPos: { x: 5, y: 14 },
        color: '#4e342e',
        personality: '전통 농경 방식을 고수하며 외지인에 대해 다소 방어적 태도.',
        schedule: [
            { time: 8, x: 5, y: 14, action: '전통 논 물꼬 확인 및 둑 살피기' },
            { time: 11, x: 17, y: 5, action: '경로당 방문하여 바둑 두기' },
            { time: 14, x: 24, y: 9, action: '구판장에서 막걸리 한잔하며 농사 푸념' },
            { time: 17, x: 13, y: 17, action: '귀가' }
        ]
    },
    {
        id: 'agent_choi',
        name: '최총무',
        role: '청년회 고참 (58세)',
        group: 'admin',
        sprite: 'Carlos_Gomez.png',
        homePos: { x: 17, y: 17 },
        workPos: { x: 13, y: 5 },
        color: '#00695c',
        personality: '이장 보좌 실무자. 청년들과 원주민 사이에서 실리적 타협안 모색.',
        schedule: [
            { time: 8, x: 13, y: 5, action: '회관 창고 농기계 상태 점검' },
            { time: 11, x: 5, y: 4, action: '스마트온실 방문하여 기술 현황 문의' },
            { time: 14, x: 14, y: 9, action: '회관 앞마당 총회 준비' },
            { time: 17, x: 17, y: 17, action: '귀가' }
        ]
    },

    // 2. 청년 귀농 및 혁신그룹 (4명)
    {
        id: 'agent_lee',
        name: '이지훈',
        role: '스마트팜 대표 (34세)',
        group: 'youth',
        sprite: 'Ryan_Park.png',
        homePos: { x: 4, y: 6 },
        workPos: { x: 4, y: 4 },
        color: '#2e7d32',
        personality: '데이터 기반 농업 신봉자. 공동 수로 대신 스마트 관수 시스템 도입 주장.',
        schedule: [
            { time: 8, x: 4, y: 4, action: '스마트온실 센서 점검 및 관수 제어' },
            { time: 11, x: 6, y: 5, action: '청년 카페에서 로컬푸드 유통 회의' },
            { time: 14, x: 14, y: 9, action: '마을회관 회의 참석하여 청년 입장 피력' },
            { time: 17, x: 4, y: 4, action: '야간 온실 온습도 모니터링' }
        ]
    },
    {
        id: 'agent_kang',
        name: '강수연',
        role: '로컬 청년창업가 (32세)',
        group: 'youth',
        sprite: 'Hailey_Johnson.png',
        homePos: { x: 6, y: 7 },
        workPos: { x: 6, y: 5 },
        color: '#f57c00',
        personality: '로컬푸드 가공품 및 체험 농장 기획. 마을 원주민과의 협업 희망.',
        schedule: [
            { time: 8, x: 6, y: 5, action: '카페 오픈 준비 및 특산물 잼 시제품 검수' },
            { time: 11, x: 24, y: 8, action: '구판장 방문하여 납품 협의' },
            { time: 14, x: 15, y: 9, action: '회관 앞마당 총회 참석' },
            { time: 17, x: 6, y: 5, action: '온라인 주문 배송 포장' }
        ]
    },
    {
        id: 'agent_cho',
        name: '조민우',
        role: '친환경 귀농초보 (29세)',
        group: 'youth',
        sprite: 'Eddy_Lin.png',
        homePos: { x: 3, y: 16 },
        workPos: { x: 4, y: 13 },
        color: '#8bc34a',
        personality: '자금과 경험이 부족하여 정노인의 전통 농사 노하우 전수를 희망.',
        schedule: [
            { time: 8, x: 4, y: 13, action: '유기농 밭 제초 작업' },
            { time: 10, x: 5, y: 14, action: '정노인 밭 방문하여 물꼬 관리 질문' },
            { time: 13, x: 6, y: 5, action: '청년 카페에서 이지훈과 영농 지원금 상담' },
            { time: 15, x: 14, y: 9, action: '마을총회 참관' }
        ]
    },
    {
        id: 'agent_han',
        name: '한유진',
        role: '귀촌 프리랜서 (36세)',
        group: 'youth',
        sprite: 'Abigail_Chen.png',
        homePos: { x: 18, y: 15 },
        workPos: { x: 6, y: 5 },
        color: '#7b1fa2',
        personality: '원격 근무 디자이너. 마을 일에 관망세이나 마을 브랜딩에는 관심.',
        schedule: [
            { time: 9, x: 6, y: 5, action: '카페에서 원격 노트북 작업' },
            { time: 12, x: 24, y: 8, action: '구판장 샌드위치 구매' },
            { time: 15, x: 16, y: 9, action: '마을회관 회의 조용히 경청' },
            { time: 18, x: 18, y: 15, action: '귀가' }
        ]
    },

    // 3. 상인, 다문화, 외곽 농가 (4명)
    {
        id: 'agent_oh',
        name: '오상회',
        role: '구판장 점주 (61세)',
        group: 'local',
        sprite: 'Adam_Smith.png',
        homePos: { x: 26, y: 8 },
        workPos: { x: 24, y: 8 },
        color: '#5d4037',
        personality: '마을 모든 소문의 발원지이자 계산이 빠름. 외상값 관리에 철저.',
        schedule: [
            { time: 7, x: 24, y: 8, action: '구판장 문 열기 및 물품 진열' },
            { time: 10, x: 23, y: 9, action: '평상에서 차 마시며 동네 손님 응대' },
            { time: 14, x: 24, y: 8, action: '장부 정리 및 매대 관리' },
            { time: 17, x: 15, y: 9, action: '마을총회 참석하여 상인 지원 요청' }
        ]
    },
    {
        id: 'agent_lin',
        name: '린',
        role: '이주여성 영농인 (33세)',
        group: 'local',
        sprite: 'Yuriko_Yamamoto.png',
        homePos: { x: 8, y: 15 },
        workPos: { x: 7, y: 14 },
        color: '#00838f',
        personality: '다문화가정 주축으로 부지런함. 마을 주민들과 정서적 유대를 넓히고자 함.',
        schedule: [
            { time: 8, x: 7, y: 14, action: '복합 영농 채소 수확' },
            { time: 11, x: 24, y: 8, action: '구판장에 채소 납품' },
            { time: 14, x: 15, y: 9, action: '회관 마당 부녀회 나눔 행사 참여' },
            { time: 17, x: 8, y: 15, action: '가족 저녁 준비' }
        ]
    },
    {
        id: 'agent_yoon',
        name: '윤축산',
        role: '외곽 한우농가 (55세)',
        group: 'local',
        sprite: 'Wolfgang_Schulz.png',
        homePos: { x: 25, y: 18 },
        workPos: { x: 25, y: 16 },
        color: '#bf360c',
        personality: '축사 냄새 민원으로 마을과 다소 소원. 수로 개선 시 정화조 지원을 원함.',
        schedule: [
            { time: 7, x: 25, y: 16, action: '축사 사료 급여 및 분뇨 처리' },
            { time: 11, x: 24, y: 8, action: '구판장 들러 생필품 구매' },
            { time: 14, x: 14, y: 9, action: '마을총회 참석하여 민원 관련 언성 높임' },
            { time: 17, x: 25, y: 16, action: '저녁 축사 방역 점검' }
        ]
    },
    {
        id: 'agent_bae',
        name: '배과수',
        role: '산비탈 과수원주 (67세)',
        group: 'local',
        sprite: 'Francisco_Lopez.png',
        homePos: { x: 26, y: 4 },
        workPos: { x: 25, y: 3 },
        color: '#558b2f',
        personality: '고지대라 가뭄 때마다 농업용수 부족에 시달려 수로 개보수에 사활을 걺.',
        schedule: [
            { time: 8, x: 25, y: 3, action: '과수원 전지 및 관수 라인 점검' },
            { time: 11, x: 3, y: 9, action: '용수로 상류 유량 상태 확인' },
            { time: 14, x: 15, y: 9, action: '마을총회에서 용수 배분 강력 요구' },
            { time: 17, x: 26, y: 4, action: '귀가' }
        ]
    }
];