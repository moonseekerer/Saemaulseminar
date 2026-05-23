// 전역 상태 변수
let currentSlide = 1;
const totalSlides = 5;

// 차트 인스턴스
let mainChartInstance = null;

// 시뮬레이터 인터벌 타이머
let simInterval = null;

// 슬라이드 4 (새마을 LBD 시뮬레이션) 데이터
let lbdG = 1;
let lbdTheta = 0.45;
let lbdB = 100;
let lbdHistoryG = [];
let lbdHistoryL = [];

// 슬라이드 5 (지식 Spillover 네트워크) 데이터
const GRID_SIZE = 16;
let villageStates = []; // 16개 마을 상태 객체 배열 { id, name, hc, isLearned, isSource }
const villageNames = [
    "여주 목골부락", "옥천 상례곡리", "평택 상리마을", "칠곡 지천면",
    "안동 구담마을", "영월 도원리", "포항 기계마을", "청도 신도마을",
    "완주 원등마을", "제주 신촌리", "나주 신도리", "남해 화계리",
    "아산 신봉리", "홍성 원천마을", "원주 판대부락", "춘천 신포마을"
];

window.onload = () => {
    initCharts();
    setupEventListeners();
    goToSlide(1);
};

function setupEventListeners() {
    // 슬라이드 2 A 슬라이더 리스너
    document.getElementById('inputA').addEventListener('input', (e) => {
        document.getElementById('sliderValA').textContent = parseFloat(e.target.value).toFixed(1);
        if (currentSlide === 2) updateSlide2Chart();
    });

    // 슬라이드 3 theta, B 슬라이더 리스너
    document.getElementById('inputTheta').addEventListener('input', (e) => {
        document.getElementById('sliderValTheta').textContent = parseFloat(e.target.value).toFixed(2);
        if (currentSlide === 3) updateSlide3Chart();
    });
    document.getElementById('inputB').addEventListener('input', (e) => {
        document.getElementById('sliderValB').textContent = e.target.value + '시간';
        if (currentSlide === 3) updateSlide3Chart();
    });
}

// 슬라이드 네비게이션 핵심 컨트롤러
function goToSlide(slideNum) {
    clearInterval(simInterval);
    simInterval = null;

    // 슬라이드 토글
    for (let i = 1; i <= totalSlides; i++) {
        const content = document.getElementById('slide' + i);
        const tab = document.getElementById('tab' + i);
        const dot = document.querySelector(`.slide-dots .dot:nth-child(${i})`);
        
        if (i === slideNum) {
            content.classList.add('active');
            tab.classList.add('active');
            if (dot) dot.classList.add('active');
        } else {
            content.classList.remove('active');
            tab.classList.remove('active');
            if (dot) dot.classList.remove('active');
        }
    }

    currentSlide = slideNum;

    // 상단 진행률 프로그레스 바 제어
    document.getElementById('topProgressBar').style.width = (slideNum / totalSlides) * 100 + '%';

    // 하단 내비게이션 제어
    document.getElementById('prevBtn').disabled = (slideNum === 1);
    document.getElementById('nextBtn').disabled = (slideNum === totalSlides);

    // LaTeX 동적 렌더링
    if (window.renderMathInElement) {
        renderMathInElement(document.getElementById('slide' + slideNum), {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }

    renderRightPanel(slideNum);
}

function nextSlide() {
    if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
}

function prevSlide() {
    if (currentSlide > 1) goToSlide(currentSlide - 1);
}

// 우측 비주얼라이저 매핑기
function renderRightPanel(slideNum) {
    const visPanel1 = document.getElementById('visPanel1');
    const visChartArea = document.getElementById('visChartArea');
    const mainChartWrapper = document.getElementById('mainChartWrapper');
    const villageNetwork = document.getElementById('villageNetwork');
    const visTitle = document.getElementById('visTitle');
    const visBadge = document.getElementById('visBadge');

    // 슬라이더 서브패널 감춤
    for (let i = 2; i <= 5; i++) {
        document.getElementById('controlPanel' + i).classList.add('hidden');
    }

    if (slideNum === 1) {
        visPanel1.classList.remove('hidden');
        visChartArea.classList.add('hidden');
        visTitle.innerHTML = '🔄 성장의 두 갈래 길: Solow vs AK';
        visBadge.textContent = '이론 구조도';
    } else {
        visPanel1.classList.add('hidden');
        visChartArea.classList.remove('hidden');
        document.getElementById('controlPanel' + slideNum).classList.remove('hidden');

        if (slideNum === 2) {
            visTitle.innerHTML = '🚀 수렴의 한계 극복: Solow vs AK 시각적 비교';
            visBadge.textContent = '지속 성장성';
            mainChartWrapper.classList.remove('hidden');
            villageNetwork.classList.add('hidden');
            setupSlide2Visuals();
        } else if (slideNum === 3) {
            visTitle.innerHTML = '🛠️ 애로우의 학습 곡선(Learning Curve)';
            visBadge.textContent = '경험과 숙련';
            mainChartWrapper.classList.remove('hidden');
            villageNetwork.classList.add('hidden');
            setupSlide3Visuals();
        } else if (slideNum === 4) {
            visTitle.innerHTML = '🌉 직접 해보며 익히는 새마을 토목 학습 시뮬레이터';
            visBadge.textContent = 'Learning-by-Doing 실증';
            mainChartWrapper.classList.remove('hidden');
            villageNetwork.classList.add('hidden');
            setupSlide4Visuals();
        } else if (slideNum === 5) {
            visTitle.innerHTML = '📢 새마을지도자 양성 지식 Spillover 네트워크';
            visBadge.textContent = '지식 외부성 도미노';
            mainChartWrapper.classList.add('hidden');
            villageNetwork.classList.remove('hidden');
            setupSlide5Visuals();
        }
    }
}

// Chart.js 메인 차트 초기화
function initCharts() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Pretendard', sans-serif";

    const ctx = document.getElementById('growthChart').getContext('2d');
    mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            elements: { point: { radius: 0 } },
            interaction: { intersect: false, mode: 'index' },
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: 30,
                    title: { display: true, text: '자본량 (K) / 경험 (G)' },
                    grid: { color: 'rgba(255, 255, 255, 0.04)' }
                },
                y: {
                    min: 0,
                    max: 60,
                    title: { display: true, text: '소득 (Y) / 노동 공수' },
                    grid: { color: 'rgba(255, 255, 255, 0.04)' }
                }
            },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, padding: 8 } },
                tooltip: { enabled: true }
            }
        }
    });
}

// --- Slide 2: AK vs Solow 비교 구현 ---
function setupSlide2Visuals() {
    mainChartInstance.options.scales.x.max = 30;
    mainChartInstance.options.scales.x.title.text = '보유 자본량 (K)';
    mainChartInstance.options.scales.y.max = 80;
    mainChartInstance.options.scales.y.title.text = '총생산 소득 (Y)';

    document.getElementById('statLabel1').textContent = 'K 자본 수준';
    document.getElementById('statLabel2').textContent = 'Solow 생산량';
    document.getElementById('statLabel3').textContent = 'AK 무제한 생산량';

    updateSlide2Chart();
}

function updateSlide2Chart() {
    const A_val = parseFloat(document.getElementById('inputA').value);
    
    let kData = [];
    let solowData = [];
    let akData = [];

    // Solow: Y = A * K^0.5 , AK: Y = A_ak * K (A_ak는 보기 좋게 스케일 조정)
    const scaleA_ak = A_val * 0.85;

    for (let k = 0; k <= 30; k += 0.5) {
        kData.push(k);
        solowData.push(A_val * 7 * Math.pow(k, 0.5)); // 솔로우 한계 체감 곡선
        akData.push(scaleA_ak * k); // AK 한계 일정 영구 성장선
    }

    mainChartInstance.data.datasets = [
        {
            label: 'Solow 수렴형 생산함수 (한계생산 체감)',
            data: kData.map((k, idx) => ({x: k, y: solowData[idx]})),
            borderColor: '#ef4444',
            borderWidth: 2.5,
            fill: false
        },
        {
            label: 'AK 내생적 생산함수 (Endless 지속 성장)',
            data: kData.map((k, idx) => ({x: k, y: akData[idx]})),
            borderColor: '#10b981',
            borderWidth: 3.5,
            fill: false
        }
    ];
    mainChartInstance.update();

    // 임의의 자본 레벨 20에서의 양 지표 스냅샷 업데이트
    const solowSample = A_val * 7 * Math.pow(20, 0.5);
    const akSample = scaleA_ak * 20;
    document.getElementById('statBadgeVal1').textContent = '20.0 (자본 축적기)';
    document.getElementById('statBadgeVal2').textContent = solowSample.toFixed(1) + ' (정체 조짐)';
    document.getElementById('statBadgeVal3').textContent = akSample.toFixed(1) + ' (지속 상승 중)';
}

// --- Slide 3: 애로우 학습 곡선 (LBD) 구현 ---
function setupSlide3Visuals() {
    mainChartInstance.options.scales.x.max = 20;
    mainChartInstance.options.scales.x.title.text = '누적 조업량/경험 (G)';
    mainChartInstance.options.scales.y.max = 120;
    mainChartInstance.options.scales.y.title.text = '1단위당 소요 노동 공수 (시간)';

    document.getElementById('statLabel1').textContent = '누적 경험량 (G)';
    document.getElementById('statLabel2').textContent = '인적 숙련도 (H)';
    document.getElementById('statLabel3').textContent = '단위 생산 시간 비용';

    updateSlide3Chart();
}

function updateSlide3Chart() {
    const theta = parseFloat(document.getElementById('inputTheta').value);
    const B_val = parseFloat(document.getElementById('inputB').value);

    let gData = [];
    let lData = []; // 소요 노동 공수
    let hcData = []; // 숙련도 H = G^theta

    for (let g = 1; g <= 20; g += 0.5) {
        gData.push(g);
        let hc = Math.pow(g, theta);
        hcData.push(hc);
        lData.push(B_val / hc); // 학습 효과로 시간 공수 급감
    }

    mainChartInstance.data.datasets = [
        {
            label: '실천적 학습에 따른 필요 노동시간 감소선 (LBD 학습곡선)',
            data: gData.map((g, idx) => ({x: g, y: lData[idx]})),
            borderColor: '#f59e0b',
            borderWidth: 3,
            fill: false
        }
    ];
    mainChartInstance.update();

    // 중간 단계 조업 10회 기준 수치 렌더링
    const hcSample = Math.pow(10, theta);
    const timeSample = B_val / hcSample;
    document.getElementById('statBadgeVal1').textContent = '10회 누적 시';
    document.getElementById('statBadgeVal2').textContent = hcSample.toFixed(2) + ' 배 숙련';
    document.getElementById('statBadgeVal3').textContent = timeSample.toFixed(1) + ' 시간 (공수 단축)';
}

// --- Slide 4: 새마을 LBD 토목 시뮬레이션 ---
function setupSlide4Visuals() {
    clearInterval(simInterval);
    simInterval = null;

    document.getElementById('btnPlay4').innerHTML = '▶ 새마을 교량가설 프로젝트 반복 실행';
    document.getElementById('btnPlay4').disabled = false;
    document.getElementById('btnPlay4').classList.remove('playing');

    mainChartInstance.options.scales.x.max = 12;
    mainChartInstance.options.scales.x.title.text = '교량 건설 프로젝트 반복 시도 회차 (t)';
    mainChartInstance.options.scales.y.max = 120;
    mainChartInstance.options.scales.y.title.text = '필요 부역 일손 (M/D)';

    document.getElementById('statLabel1').textContent = '프로젝트 수행 차수';
    document.getElementById('statLabel2').textContent = '농민 시공 숙련도 (H)';
    document.getElementById('statLabel3').textContent = '소요 노동 일손 (공수)';

    lbdG = 1;
    lbdTheta = 0.50; // 고숙련 학습계수
    lbdB = 100; // 초기 100일 분의 농민 일손 필요

    lbdHistoryG = [1];
    lbdHistoryL = [lbdB];

    drawLBDChart();
    updateLBDStats();
}

function drawLBDChart() {
    mainChartInstance.data.datasets = [
        {
            label: '새마을 주민 실천 토목 학습곡선 (일하며 배움)',
            data: lbdHistoryG.map((g, idx) => ({x: g, y: lbdHistoryL[idx]})),
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.05)',
            borderWidth: 3,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8
        }
    ];
    mainChartInstance.update();
}

function updateLBDStats() {
    let hc = Math.pow(lbdG, lbdTheta);
    let l_cost = lbdB / hc;

    document.getElementById('statBadgeVal1').textContent = lbdG + '회차 시도';
    document.getElementById('statBadgeVal2').textContent = hc.toFixed(2) + ' 배 숙련';
    document.getElementById('statBadgeVal3').textContent = l_cost.toFixed(1) + ' Man-Day (공수급감)';
}

function playSaemaulLBD() {
    const btn = document.getElementById('btnPlay4');
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
        btn.innerHTML = '▶ 시뮬레이션 재개';
        btn.classList.remove('playing');
        return;
    }

    btn.innerHTML = '⏸ 프로젝트 추진 중...';
    btn.classList.add('playing');

    simInterval = setInterval(() => {
        if (lbdG >= 10) {
            clearInterval(simInterval);
            simInterval = null;
            btn.innerHTML = '🎉 농민 토목 전문가 등극! LBD 완료!';
            btn.disabled = true;
            btn.classList.remove('playing');
            return;
        }

        lbdG++;
        let hc = Math.pow(lbdG, lbdTheta);
        let l_cost = lbdB / hc;

        lbdHistoryG.push(lbdG);
        lbdHistoryL.push(l_cost);

        drawLBDChart();
        updateLBDStats();
    }, 900);
}

function resetSaemaulLBD() {
    setupSlide4Visuals();
}

// --- Slide 5: 지식 Spillover 네트워크 구현 ---
function setupSlide5Visuals() {
    clearInterval(simInterval);
    simInterval = null;

    document.getElementById('btnPlay5').innerHTML = '▶ 새마을지도자 양성소 지식 전파 실행';
    document.getElementById('btnPlay5').disabled = false;
    document.getElementById('btnPlay5').classList.remove('playing');

    document.getElementById('statLabel1').textContent = '총 16개 마을 중';
    document.getElementById('statLabel2').textContent = '전파완료 부락 수';
    document.getElementById('statLabel3').textContent = '지역 전체 평균 인적 숙련';

    // 4x4 네트워크 초기화
    villageStates = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        villageStates.push({
            id: i,
            name: villageNames[i],
            hc: 1.0, // 기본 숙련도 1.0
            isLearned: false,
            isSource: (i === 6) // 포항 기계마을을 최초 원조 지식 발원지로 지정!
        });
    }
    // 발원지 세팅
    villageStates[6].hc = 3.0; // 3배 고부가가치 숙련
    villageStates[6].isLearned = true;

    renderVillageGrid();
    updateSpilloverStats();
}

function renderVillageGrid() {
    const grid = document.getElementById('villageGrid');
    grid.innerHTML = "";

    villageStates.forEach(v => {
        const div = document.createElement('div');
        div.className = "village-node";
        if (v.isSource) div.classList.add('source');
        else if (v.isLearned) div.classList.add('learned');

        div.innerHTML = `
            <span class="v-icon">${v.isLearned ? '🏡' : '🏚️'}</span>
            <span class="v-name">${v.name.split(' ')[1] || v.name}</span>
            <span class="v-hc">H: ${v.hc.toFixed(1)}</span>
        `;
        grid.appendChild(div);
    });
}

function updateSpilloverStats() {
    const learnedCount = villageStates.filter(v => v.isLearned).length;
    const avgHC = villageStates.reduce((acc, curr) => acc + curr.hc, 0) / GRID_SIZE;

    document.getElementById('statBadgeVal1').textContent = '지역 협동망 가동';
    document.getElementById('statBadgeVal2').textContent = learnedCount + ' / 16 개동';
    document.getElementById('statBadgeVal3').textContent = avgHC.toFixed(2) + ' H';
}

function playSpillover() {
    const btn = document.getElementById('btnPlay5');
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
        btn.innerHTML = '▶ 시뮬레이션 재개';
        btn.classList.remove('playing');
        return;
    }

    btn.innerHTML = '⏸ 지식 넘침(Spillover) 파급 중...';
    btn.classList.add('playing');

    simInterval = setInterval(() => {
        // 확산 모델: 이미 배운(learned) 마을의 인접 노드들(상, 하, 좌, 우) 중 배우지 않은 마을을 무작위 혹은 점진적으로 학습 상태로 전이
        let newlyLearned = [];

        for (let i = 0; i < GRID_SIZE; i++) {
            if (villageStates[i].isLearned) {
                // 상하좌우 인덱스 파악 (4x4 격자)
                let neighbors = [];
                let row = Math.floor(i / 4);
                let col = i % 4;

                if (row > 0) neighbors.push(i - 4); // 상
                if (row < 3) neighbors.push(i + 4); // 하
                if (col > 0) neighbors.push(i - 1); // 좌
                if (col < 3) neighbors.push(i + 1); // 우

                neighbors.forEach(nIdx => {
                    if (!villageStates[nIdx].isLearned) {
                        newlyLearned.push(nIdx);
                    }
                });
            }
        }

        // 지식 전파 전이 처리
        if (newlyLearned.length === 0) {
            clearInterval(simInterval);
            simInterval = null;
            btn.innerHTML = '🎉 전 농촌 협동망 고도 숙련화 완료!';
            btn.disabled = true;
            btn.classList.remove('playing');
            return;
        }

        newlyLearned.forEach(idx => {
            villageStates[idx].isLearned = true;
            villageStates[idx].hc = 2.5; // 전이 후 지식 숙련도 2.5로 상향
        });

        renderVillageGrid();
        updateSpilloverStats();
    }, 1200);
}

function resetSpillover() {
    setupSlide5Visuals();
}
