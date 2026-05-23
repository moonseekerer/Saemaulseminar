// 전역 상태 변수
let currentSlide = 1;
const totalSlides = 6;

// 솔로우 생산 모델 파라미터 (y = A * k^alpha)
const alpha = 0.5; // Cobb-Douglas 분배율
const A = 2.0; // 총요소생산성
const maxK = 40; // 가로축 최대 범위

// 차트 인스턴스
let solowChartInstance = null;
let tsChartInstance = null;

// 시뮬레이터 타이머 및 데이터
let simInterval = null;
let simActiveK = 0;
let simTime = 0;
let historyT = [];
let historyK = [];
let historyY = [];

window.onload = () => {
    initCharts();
    setupEventListeners();
    goToSlide(1);
};

function setupEventListeners() {
    // 슬라이드 3 실시간 슬라이더 리스너
    document.getElementById('inputS').addEventListener('input', (e) => {
        document.getElementById('sliderValS').textContent = (parseFloat(e.target.value) * 100).toFixed(0) + '%';
        updateSlide3Chart();
    });
    document.getElementById('inputD').addEventListener('input', (e) => {
        document.getElementById('sliderValD').textContent = (parseFloat(e.target.value) * 100).toFixed(0) + '%';
        updateSlide3Chart();
    });

    // 슬라이드 2 마우스 호버 리스너 (한계생산체감 기울기 실시간 시각화)
    const canvas = document.getElementById('solowChart');
    canvas.addEventListener('mousemove', (e) => {
        if (currentSlide !== 2 || !solowChartInstance) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        
        const chartArea = solowChartInstance.chartArea;
        if (mouseX >= chartArea.left && mouseX <= chartArea.right) {
            const kVal = solowChartInstance.scales.x.getValueForPixel(mouseX);
            if (kVal >= 0.1 && kVal <= maxK) {
                drawTangentLine(kVal);
            }
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (currentSlide === 2) {
            // 호버 이탈 시 기본 그래프 복구
            drawTangentLine(10);
        }
    });
}

// 슬라이드 이동 핵심 컨트롤러
function goToSlide(slideNum) {
    // 타이머 중지
    clearInterval(simInterval);
    simInterval = null;

    // 슬라이드 활성화 토글
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

    // 하단 내비게이션 버튼 제어
    document.getElementById('prevBtn').disabled = (slideNum === 1);
    document.getElementById('nextBtn').disabled = (slideNum === totalSlides);

    // 동적 LaTeX 렌더링 보완 실행
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

    // 슬라이드 번호에 따라 우측 인터랙티브 패널 매핑
    renderRightPanel(slideNum);
}

function nextSlide() {
    if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
}

function prevSlide() {
    if (currentSlide > 1) goToSlide(currentSlide - 1);
}

// 슬라이드별 우측 비주얼라이저 구성 전환기
function renderRightPanel(slideNum) {
    const visPanel1 = document.getElementById('visPanel1');
    const visChartArea = document.getElementById('visChartArea');
    const tsChartWrapper = document.getElementById('tsChartWrapper');
    const visTitle = document.getElementById('visTitle');
    const visBadge = document.getElementById('visBadge');

    // 제어 서브패널들 토글
    for (let i = 2; i <= 6; i++) {
        document.getElementById('controlPanel' + i).classList.add('hidden');
    }

    if (slideNum === 1) {
        visPanel1.classList.remove('hidden');
        visChartArea.classList.add('hidden');
        visTitle.innerHTML = '🔄 자본 축적의 선순환 경로';
        visBadge.textContent = '이론 구조도';
    } else {
        visPanel1.classList.add('hidden');
        visChartArea.classList.remove('hidden');
        tsChartWrapper.classList.add('hidden'); // 기본적으로 숨김
        document.getElementById('controlPanel' + slideNum).classList.remove('hidden');

        if (slideNum === 2) {
            visTitle.innerHTML = '📈 일인당 생산함수와 한계생산성';
            visBadge.textContent = '한계생산체감';
            setupSlide2Visuals();
        } else if (slideNum === 3) {
            visTitle.innerHTML = '📊 투자 곡선과 감가상각 마모선';
            visBadge.textContent = '자본 Accumulation';
            setupSlide3Visuals();
        } else if (slideNum === 4) {
            visTitle.innerHTML = '🚀 근검절약(저축률 증대)에 따른 자본 도약';
            visBadge.textContent = '안정상태 이동 시뮬레이터';
            setupSlide4Visuals();
        } else if (slideNum === 5) {
            visTitle.innerHTML = '🚼 인구 증가율 하락(가족계획)의 자본 희석 극복';
            visBadge.textContent = '인구조절 시뮬레이터';
            setupSlide5Visuals();
        } else if (slideNum === 6) {
            visTitle.innerHTML = '💸 무상 원조(자본 주입)와 균제상태로의 회귀';
            visBadge.textContent = '원조 무용론과 저축률';
            setupSlide6Visuals();
        }
    }
}

// --- Chart.js 초기화 함수 ---
function initCharts() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Pretendard', sans-serif";

    // 1. 메인 차트 초기화
    const ctxMain = document.getElementById('solowChart').getContext('2d');
    solowChartInstance = new Chart(ctxMain, {
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
                    max: maxK,
                    title: { display: true, text: '일인당 자본 (k)' },
                    grid: { color: 'rgba(255, 255, 255, 0.04)' }
                },
                y: {
                    min: 0,
                    max: 15,
                    title: { display: true, text: '소득 / 투자 / 마모 수준' },
                    grid: { color: 'rgba(255, 255, 255, 0.04)' }
                }
            },
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, padding: 8 } },
                tooltip: { enabled: false }
            }
        }
    });

    // 2. 서브 시계열 차트 초기화
    const ctxTS = document.getElementById('tsChart').getContext('2d');
    tsChartInstance = new Chart(ctxTS, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            elements: { point: { radius: 0 } },
            scales: {
                x: { title: { display: true, text: '시뮬레이션 연차 (t)' }, grid: { display: false } },
                y: { min: 0, max: 40, title: { display: true, text: '보유량' }, grid: { color: 'rgba(255,255,255,0.04)' } }
            },
            plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 4 } } }
        }
    });
}

// --- Slide 2: 생산함수 시각화 구현 ---
function setupSlide2Visuals() {
    let kData = [];
    let yData = [];
    for (let i = 0; i <= maxK; i += 0.8) {
        kData.push(i);
        yData.push(A * Math.pow(i, alpha));
    }

    solowChartInstance.options.scales.y.max = 14;
    solowChartInstance.options.scales.y.title.text = '1인당 소득 y';
    
    solowChartInstance.data.datasets = [{
        label: '1인당 생산함수 y = f(k)',
        data: kData.map((k, index) => ({x: k, y: yData[index]})),
        borderColor: '#10b981',
        borderWidth: 3,
        fill: false,
        tension: 0.1
    }];
    solowChartInstance.update();

    // 초기 기본 기울기 (k = 10 위치)
    drawTangentLine(10);
}

function drawTangentLine(kVal) {
    if (currentSlide !== 2 || !solowChartInstance) return;

    let yVal = A * Math.pow(kVal, alpha);
    let slope = 1.0 / Math.sqrt(kVal);
    let intercept = yVal - slope * kVal;

    let tangentData = [];
    let startK = Math.max(0, kVal - 10);
    let endK = Math.min(maxK, kVal + 10);
    for (let x = startK; x <= endK; x += 0.5) {
        tangentData.push({x: x, y: slope * x + intercept});
    }

    solowChartInstance.data.datasets[1] = {
        label: `한계생산성 f'(k) = ${slope.toFixed(3)} (접선 기울기)`,
        data: tangentData,
        borderColor: '#14b8a6',
        borderWidth: 2,
        borderDash: [5, 3],
        pointRadius: 0,
        fill: false
    };

    solowChartInstance.data.datasets[2] = {
        label: `현재 자본 k = ${kVal.toFixed(1)}`,
        data: [{x: kVal, y: yVal}],
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b',
        pointRadius: 6,
        pointStyle: 'circle',
        showLine: false
    };

    solowChartInstance.update();

    document.getElementById('statBadgeK').textContent = kVal.toFixed(2);
    document.getElementById('statBadgeY').textContent = yVal.toFixed(2);
    document.getElementById('statBadgeInv').textContent = slope.toFixed(3) + ' (기울기)';
    document.getElementById('statBadgeBre').textContent = 'N/A';
}

// --- Slide 3: 저축/마모 시각화 구현 ---
function setupSlide3Visuals() {
    document.getElementById('sliderValS').textContent = (parseFloat(document.getElementById('inputS').value) * 100).toFixed(0) + '%';
    document.getElementById('sliderValD').textContent = (parseFloat(document.getElementById('inputD').value) * 100).toFixed(0) + '%';
    
    solowChartInstance.options.scales.y.max = 14;
    solowChartInstance.options.scales.y.title.text = '규모';
    
    updateSlide3Chart();
}

function updateSlide3Chart() {
    if (currentSlide !== 3) return;

    const s = parseFloat(document.getElementById('inputS').value);
    const delta = parseFloat(document.getElementById('inputD').value);

    let kData = [];
    let yData = [];
    let invData = [];
    let depData = [];

    for (let i = 0; i <= maxK; i += 0.8) {
        kData.push(i);
        let y = A * Math.pow(i, alpha);
        yData.push(y);
        invData.push(s * y);
        depData.push(delta * i);
    }

    let kStar = Math.pow((s * A) / delta, 2);
    let yStar = A * Math.pow(kStar, alpha);
    let invStar = s * yStar;

    solowChartInstance.data.datasets = [
        {
            label: '생산함수 f(k)',
            data: kData.map((k, idx) => ({x: k, y: yData[idx]})),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false
        },
        {
            label: '투자 곡선 sf(k)',
            data: kData.map((k, idx) => ({x: k, y: invData[idx]})),
            borderColor: '#3b82f6',
            borderWidth: 3,
            fill: false
        },
        {
            label: '감가상각선 δk',
            data: kData.map((k, idx) => ({x: k, y: depData[idx]})),
            borderColor: '#ef4444',
            borderWidth: 2.5,
            fill: false
        }
    ];

    if (kStar <= maxK) {
        solowChartInstance.data.datasets.push({
            label: `균제상태 k* = ${kStar.toFixed(1)}`,
            data: [{x: kStar, y: invStar}],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            pointRadius: 7,
            showLine: false
        });
    }

    solowChartInstance.update();

    document.getElementById('statBadgeK').textContent = kStar.toFixed(1) + ' (균제)';
    document.getElementById('statBadgeY').textContent = yStar.toFixed(1) + ' (균제)';
    document.getElementById('statBadgeInv').textContent = invStar.toFixed(2);
    document.getElementById('statBadgeBre').textContent = (delta * kStar).toFixed(2);
}

// --- Slide 4: 저축률 상승 전이 시뮬레이션 ---
function setupSlide4Visuals() {
    clearInterval(simInterval);
    simInterval = null;
    document.getElementById('btnPlay4').innerHTML = '▶ 근검절약 정책 시뮬레이션 실행';
    document.getElementById('btnPlay4').classList.remove('playing');

    const s1 = 0.15;
    const s2 = 0.30;
    const delta = 0.10;

    let kData = [];
    let inv1Data = [];
    let inv2Data = [];
    let depData = [];

    for (let i = 0; i <= maxK; i += 0.8) {
        kData.push(i);
        let y = A * Math.pow(i, alpha);
        inv1Data.push(s1 * y);
        inv2Data.push(s2 * y);
        depData.push(delta * i);
    }

    solowChartInstance.options.scales.y.max = 14;
    solowChartInstance.options.scales.y.title.text = '투자 / 마모';

    simActiveK = 9.0;

    solowChartInstance.data.datasets = [
        {
            label: '이전 투자 s₁f(k) [15%]',
            data: kData.map((k, idx) => ({x: k, y: inv1Data[idx]})),
            borderColor: 'rgba(59, 130, 246, 0.45)',
            borderWidth: 2,
            borderDash: [5, 4],
            fill: false
        },
        {
            label: '새해 투자 s₂f(k) [30%]',
            data: kData.map((k, idx) => ({x: k, y: inv2Data[idx]})),
            borderColor: '#3b82f6',
            borderWidth: 3,
            fill: false
        },
        {
            label: '감가상각선 δk',
            data: kData.map((k, idx) => ({x: k, y: depData[idx]})),
            borderColor: '#ef4444',
            borderWidth: 2.5,
            fill: false
        },
        {
            label: '현재 가계 자본 위치',
            data: [{x: simActiveK, y: s2 * A * Math.pow(simActiveK, alpha)}],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            pointRadius: 7,
            showLine: false
        }
    ];
    solowChartInstance.update();

    document.getElementById('tsChartWrapper').classList.remove('hidden');
    tsChartInstance.options.scales.y.max = 40;
    tsChartInstance.options.scales.y.title.text = '자본 / 소득';
    
    historyT = [0];
    historyK = [simActiveK];
    historyY = [A * Math.pow(simActiveK, alpha)];

    updateTSChart();
    updateLiveStats(simActiveK, s2, delta, 0);
}

function playTransition4() {
    const btn = document.getElementById('btnPlay4');
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
        btn.innerHTML = '▶ 시뮬레이션 재개';
        btn.classList.remove('playing');
        return;
    }

    btn.innerHTML = '⏸ 시뮬레이션 일시 정지';
    btn.classList.add('playing');

    const s2 = 0.30;
    const delta = 0.10;
    const k2Star = 36.0;

    simTime = historyT[historyT.length - 1];

    simInterval = setInterval(() => {
        let y = A * Math.pow(simActiveK, alpha);
        let investment = s2 * y;
        let depreciation = delta * simActiveK;

        let deltaK = investment - depreciation;

        simActiveK += deltaK * 0.15;
        simTime++;

        historyT.push(simTime);
        historyK.push(simActiveK);
        historyY.push(A * Math.pow(simActiveK, alpha));

        solowChartInstance.data.datasets[3].data = [{x: simActiveK, y: s2 * A * Math.pow(simActiveK, alpha)}];
        solowChartInstance.update();

        updateTSChart();
        updateLiveStats(simActiveK, s2, delta, 0);

        if (Math.abs(simActiveK - k2Star) < 0.05) {
            clearInterval(simInterval);
            simInterval = null;
            btn.innerHTML = '🎉 새로운 균제상태 수렴 완료!';
            btn.disabled = true;
            btn.classList.remove('playing');
        }
    }, 100);
}

function resetTransition3() {
    document.getElementById('inputS').value = 0.20;
    document.getElementById('inputD').value = 0.10;
    document.getElementById('sliderValS').textContent = '20%';
    document.getElementById('sliderValD').textContent = '10%';
    updateSlide3Chart();
}

function resetTransition4() {
    document.getElementById('btnPlay4').disabled = false;
    setupSlide4Visuals();
}

// --- Slide 5: 인구 증가율 하락(가족계획) 시뮬레이션 ---
function setupSlide5Visuals() {
    clearInterval(simInterval);
    simInterval = null;
    document.getElementById('btnPlay5').innerHTML = '▶ 가족계획(인구 억제) 시뮬레이션 실행';
    document.getElementById('btnPlay5').classList.remove('playing');

    const s = 0.20;
    const delta = 0.08;
    const n1 = 0.07;
    const n2 = 0.02;

    let kData = [];
    let invData = [];
    let dep1Data = [];
    let dep2Data = [];

    for (let i = 0; i <= maxK; i += 0.8) {
        kData.push(i);
        let y = A * Math.pow(i, alpha);
        invData.push(s * y);
        dep1Data.push((n1 + delta) * i);
        dep2Data.push((n2 + delta) * i);
    }

    solowChartInstance.options.scales.y.max = 10;
    solowChartInstance.options.scales.y.title.text = '투자 / 균형투자';

    simActiveK = 7.11;

    solowChartInstance.data.datasets = [
        {
            label: '투자 곡선 sf(k)',
            data: kData.map((k, idx) => ({x: k, y: invData[idx]})),
            borderColor: '#3b82f6',
            borderWidth: 3,
            fill: false
        },
        {
            label: '이전 마모선 (n₁+δ)k [인구증가 7%]',
            data: kData.map((k, idx) => ({x: k, y: dep1Data[idx]})),
            borderColor: 'rgba(239, 68, 68, 0.45)',
            borderWidth: 2,
            borderDash: [5, 4],
            fill: false
        },
        {
            label: '새해 마모선 (n₂+δ)k [인구증가 2%]',
            data: kData.map((k, idx) => ({x: k, y: dep2Data[idx]})),
            borderColor: '#ef4444',
            borderWidth: 2.5,
            fill: false
        },
        {
            label: '현재 가계 자본 위치',
            data: [{x: simActiveK, y: s * A * Math.pow(simActiveK, alpha)}],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            pointRadius: 7,
            showLine: false
        }
    ];
    solowChartInstance.update();

    document.getElementById('tsChartWrapper').classList.remove('hidden');
    tsChartInstance.options.scales.y.max = 25;
    tsChartInstance.options.scales.y.title.text = '자본 / 소득';

    historyT = [0];
    historyK = [simActiveK];
    historyY = [A * Math.pow(simActiveK, alpha)];

    updateTSChart();
    updateLiveStats(simActiveK, s, delta, n2);
}

function playTransition5() {
    const btn = document.getElementById('btnPlay5');
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
        btn.innerHTML = '▶ 시뮬레이션 재개';
        btn.classList.remove('playing');
        return;
    }

    btn.innerHTML = '⏸ 시뮬레이션 일시 정지';
    btn.classList.add('playing');

    const s = 0.20;
    const delta = 0.08;
    const n2 = 0.02;
    const k2Star = 16.0;

    simTime = historyT[historyT.length - 1];

    simInterval = setInterval(() => {
        let y = A * Math.pow(simActiveK, alpha);
        let investment = s * y;
        let breakeven = (n2 + delta) * simActiveK;

        let deltaK = investment - breakeven;

        simActiveK += deltaK * 0.15;
        simTime++;

        historyT.push(simTime);
        historyK.push(simActiveK);
        historyY.push(A * Math.pow(simActiveK, alpha));

        solowChartInstance.data.datasets[3].data = [{x: simActiveK, y: s * A * Math.pow(simActiveK, alpha)}];
        solowChartInstance.update();

        updateTSChart();
        updateLiveStats(simActiveK, s, delta, n2);

        if (Math.abs(simActiveK - k2Star) < 0.05) {
            clearInterval(simInterval);
            simInterval = null;
            btn.innerHTML = '🎉 자본 희석 극복 및 도약 완료!';
            btn.disabled = true;
            btn.classList.remove('playing');
        }
    }, 100);
}

function resetTransition5() {
    document.getElementById('btnPlay5').disabled = false;
    setupSlide5Visuals();
}

// --- Slide 6: 무상 원조(자본 주입) 및 균제 회귀 시뮬레이션 ---
// 'White Elephant' 현상을 묘사하기 위해 감가상각 마모율 delta를 0.15로 대폭 올려 적용!
function setupSlide6Visuals() {
    clearInterval(simInterval);
    simInterval = null;
    document.getElementById('btnPlay6').innerHTML = '▶ 대규모 무상원조(자본 주입) 시뮬레이션 실행';
    document.getElementById('btnPlay6').disabled = false;
    document.getElementById('btnPlay6').classList.remove('playing');

    const s = 0.10; // 매우 낮은 저축률 10%
    const deltaElephant = 0.15; // White Elephant 현상으로 마모/유지 관리비가 폭증한 감가상각률 (원래 10%에서 15%로 폭증)

    let kData = [];
    let invData = [];
    let depData = [];

    for (let i = 0; i <= maxK; i += 0.8) {
        kData.push(i);
        let y = A * Math.pow(i, alpha);
        invData.push(s * y);
        depData.push(deltaElephant * i);
    }

    solowChartInstance.options.scales.y.max = 14;
    solowChartInstance.options.scales.y.title.text = '투자 / 마모';

    // 시작 지점은 대규모 무상 원조로 자본을 강제 주입한 시점 k = 30
    simActiveK = 30.0;

    solowChartInstance.data.datasets = [
        {
            label: '투자 곡선 sf(k) [낮은 저축률 10%]',
            data: kData.map((k, idx) => ({x: k, y: invData[idx]})),
            borderColor: '#3b82f6',
            borderWidth: 3,
            fill: false
        },
        {
            label: '가속 마모선 δk [흰 코끼리 현상 반영 15%]',
            data: kData.map((k, idx) => ({x: k, y: depData[idx]})),
            borderColor: '#ef4444',
            borderWidth: 2.5,
            fill: false
        },
        {
            label: '현재 가계 자본 위치 (원조 직후)',
            data: [{x: simActiveK, y: s * A * Math.pow(simActiveK, alpha)}],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            pointRadius: 7,
            showLine: false
        }
    ];
    solowChartInstance.update();

    document.getElementById('tsChartWrapper').classList.remove('hidden');
    tsChartInstance.options.scales.y.max = 35;
    tsChartInstance.options.scales.y.title.text = '자본 / 소득';

    historyT = [0];
    historyK = [simActiveK];
    historyY = [A * Math.pow(simActiveK, alpha)];

    updateTSChart();
    updateLiveStats(simActiveK, s, deltaElephant, 0);
}

function playTransition6() {
    const btn = document.getElementById('btnPlay6');
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
        btn.innerHTML = '▶ 시뮬레이션 재개';
        btn.classList.remove('playing');
        return;
    }

    btn.innerHTML = '⏸ 시뮬레이션 일시 정지';
    btn.classList.add('playing');

    const s = 0.10;
    const deltaElephant = 0.15; // 마모비 폭증
    const k1Star = Math.pow((s * A) / deltaElephant, 2); // 새로운 초라한 균제상태 = (0.2 / 0.15)^2 = 1.33^2 = 1.77

    simTime = historyT[historyT.length - 1];

    simInterval = setInterval(() => {
        let y = A * Math.pow(simActiveK, alpha);
        let investment = s * y;
        let depreciation = deltaElephant * simActiveK;

        // 자본 감소: 투자가 가속 감가상각(유지비)을 이기지 못함
        let deltaK = investment - depreciation;

        simActiveK += deltaK * 0.15;
        simTime++;

        historyT.push(simTime);
        historyK.push(simActiveK);
        historyY.push(A * Math.pow(simActiveK, alpha));

        solowChartInstance.data.datasets[2].data = [{x: simActiveK, y: s * A * Math.pow(simActiveK, alpha)}];
        solowChartInstance.update();

        updateTSChart();
        updateLiveStats(simActiveK, s, deltaElephant, 0);

        if (Math.abs(simActiveK - k1Star) < 0.15) {
            clearInterval(simInterval);
            simInterval = null;
            btn.innerHTML = '⚠️ 흰 코끼리화: 원래 빈곤 수렴점으로 완전 회귀!';
            btn.disabled = true;
            btn.classList.remove('playing');
        }
    }, 100);
}

function resetTransition6() {
    document.getElementById('btnPlay6').disabled = false;
    setupSlide6Visuals();
}

// --- 공통 차트/통계 갱신 유틸리티 ---
function updateTSChart() {
    tsChartInstance.data.labels = historyT;
    tsChartInstance.data.datasets = [
        {
            label: '1인당 자본량 (k)',
            data: historyK,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderWidth: 2.5,
            fill: true
        },
        {
            label: '1인당 소득 (y)',
            data: historyY,
            borderColor: '#10b981',
            borderWidth: 2,
            fill: false
        }
    ];
    tsChartInstance.update();
}

function updateLiveStats(kVal, s, delta, n) {
    let y = A * Math.pow(kVal, alpha);
    let inv = s * y;
    let breakeven = (n + delta) * kVal;

    document.getElementById('statBadgeK').textContent = kVal.toFixed(2);
    document.getElementById('statBadgeY').textContent = y.toFixed(2);
    document.getElementById('statBadgeInv').textContent = inv.toFixed(2);
    document.getElementById('statBadgeBre').textContent = breakeven.toFixed(2);
}
