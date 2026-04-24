const slidesData = [
    {
        tag: "🌱 Chapter 5",
        title: "전망이론과 마인드셋의 변화 효과 ✨",
        content: `새마을운동을 통해 ‘잘 살아보자’, ‘할 수 있다’는 마인드셋이 확립되었습니다. 이러한 미래지향적인 마인드셋은 사람들의 관점을 긍정적으로 변화시켰고, 근면·자조·협동을 바탕으로 새로운 도전을 모색하도록 이끌었습니다. 🚀`,
        boxContent: `하지만, 새로운 도전에는 항상 <strong>불확실성과 실패의 위험 ⚠️</strong>이 따릅니다. 행동경제학 이론을 통해 이 위험 속에서 인간은 어떤 선택을 하는지 살펴보겠습니다. 🧐`,
        math: ``,
        chartId: null
    },
    {
        tag: "⚖️ Economic Theory",
        title: "기대효용이론과 위험성향 📉",
        content: `전통경제학의 '기대효용이론(Expected Utility Theory)'은 기본적으로 인간이 <strong>위험기피성향(Risk Aversion) 🛡️</strong>을 지닌다고 설명합니다.<br><br>만약 기대값이 동일한 두 가지 선택지가 있다면, 인간은 불확실성이 존재하는 요행보다는 <strong>확실한 보상 🎁</strong>을 선택하게 됩니다.`,
        boxContent: `<strong>💡 한계효용체감의 법칙 (Law of Diminishing Marginal Utility)</strong><br>재산이 늘어날 때 느끼는 추가적인 만족감(효용)은 점차 줄어듭니다. 📉 따라서 확실한 500원이, 불확실한 900원보다 주관적으로 더 높은 체감 만족을 줍니다.`,
        math: `$$ E[U(x)] = p_1 U(x_1) + p_2 U(x_2) $$ <br> $$ U(E[x]) > E[U(x)] $$ (위험기피)`,
        chartId: 'chart-utility' // Render Expected Utility Graph
    },
    {
        tag: "🚧 Theory Limitation",
        title: "이론의 한계: 이익과 손실의 비대칭성 ⚖️",
        content: `기대효용이론은 '이익'이 발생하는 긍정적 측면에서는 인간의 행동을 잘 예측합니다. 💯 하지만, <strong>'손실'이 발생하는 상황 💸</strong>에 직면하면 인간은 불확실하더라도 손실을 만회하려는 위험선호 성향을 띠게 됩니다. 🎲`,
        boxContent: `<strong>🧪 실험 결과</strong><br>확실하게 1,000원을 잃는 것보다 50% 확률로 2,500원을 잃는 도박(기대손실 1,250원)을 선호합니다. 인간의 심리는 수학적 기대치보다 철저히 주관적 느낌(가치)에 의존합니다. 🧠`,
        math: `$$ U(-1000) < 0.5 \times U(-2500) $$`,
        chartId: null
    },
    {
        tag: "📈 Behavioral Economics",
        title: "전망이론과 가치함수 🎢",
        content: `행동경제학의 <strong>'전망이론(Prospect Theory)' 📊</strong>은 이익과 손실에 대한 인간의 비대칭적 태도를 가치함수(Value Function)로 설명합니다.`,
        boxContent: `<strong>💔 손실기피 (Loss Aversion)</strong><br>동일한 100만원이라도 얻을 때의 기쁨 😍 보다 잃을 때의 고통 😭 이 약 1.5배~2.5배 큽니다. 가치함수 그래프를 보면 손실 영역의 기울기가 훨씬 가파른 것을 알 수 있습니다. 📉`,
        math: `$$ \\text{가치함수 } v(x) : \\begin{cases} x^\\alpha & (x \\ge 0) \\\\ -\\lambda(-x)^\\beta & (x < 0, \\lambda > 1) \\end{cases} $$`,
        chartId: 'chart-prospect' // Render Prospect Theory Graph
    },
    {
        tag: "🎯 Decision Making",
        title: "준거점과 프레이밍 효과 🎭",
        content: `무엇이 이익이고 무엇이 손실인지 구분하는 기준선이 바로 마음속의 <strong>'준거점(Reference Point)' 📍</strong>입니다. 준거점은 기대 수준, 과거 경험, 다른 사람과의 비교를 통해 계속 이동합니다. 🔄`,
        boxContent: `<strong>🖼️ 프레이밍 효과 (Framing Effect)</strong><br>동일한 결과라도 그것이 이익으로 제시되는지, 손실로 제시되는지에 따라 준거점이 달라지고 개인의 선택은 180도 바뀝니다! 🤯`,
        math: `$$ \\text{Value} = v(\\text{Result} - \\text{Reference Point}) $$`,
        chartId: null
    },
    {
        tag: "🔬 Experiment",
        title: "프레이밍 효과 실제 실험 🎰",
        content: `최종 기대재산(1,500$)이 완전히 동일한 두 상황이지만, 정보가 <strong>'이익' 🟢</strong>으로 제시되는지 <strong>'손실' 🔴</strong>로 제시되는지에 따라 선택은 극명하게 엇갈립니다.<br><br>이익의 관점에서는 <strong>확실한 수익 🛡️</strong>을 챙기려 하지만, 손실의 관점에서는 <strong>확실한 손해를 피하기 위해 도박 🎲</strong>을 택하게 됩니다.`,
        boxContent: `<strong>🟢 프레임 1 (이익): 초기 1,000$ 지급 후 선택</strong><br>A. 50% 확률로 1,000$ 더 획득, 50% 확률로 0$ 획득<br>B. 100% 확률로 500$ 더 획득 <strong>(→ ⭐ 다수 선호)</strong><br><br><strong>🔴 프레임 2 (손실): 초기 2,000$ 지급 후 선택</strong><br>A. 50% 확률로 1,000$ 반환, 50% 확률로 0$ 반환 <strong>(→ ⭐ 다수 선호)</strong><br>B. 100% 확률로 500$ 반환`,
        math: `$$ \\text{최종 기대재산: } E[A] = E[B] = W + 1500 $$`,
        chartId: null
    },
    {
        tag: "🚀 Historical Context",
        title: "마인드셋 변화와 준거점의 이동 🌅",
        content: `과거 주민들은 '현재의 빈곤'을 준거점으로 삼았습니다. 이 상태에서는 실패할 때의 심리적 타격(손실)이 컸기에 흔쾌히 도전하지 못했습니다. 😔<br><br>하지만 우수마을의 성공 사례를 보면서 <strong>준거점이 '가난'에서 '성공한 이웃 마을 수준'으로 상승 📈</strong>하게 됩니다.`,
        boxContent: `<strong>💡 마인드셋의 리셋</strong><br>상황을 판단하는 렌즈가 통째로 바뀌었습니다. "우리도 할 수 있다"는 확신은 마음속 기준점 자체를 옮겨 놓았습니다. 🎯`,
        math: `$$ \\Delta \\text{준거점} \\xrightarrow{\\text{상승}} \\text{현재 상태는 심리적 '손실'로 전환} $$`,
        chartId: 'chart-shift' // Render Reference Shift Graph
    },
    {
        tag: "🔥 The Catalyst",
        title: "도약의 원동력이 된 손실기피 🏃‍♂️💨",
        content: `준거점이 치솟자, 아무것도 안 하고 정체된 모습은 극심한 <strong>'손실 영역(기회상실 및 뒤처짐)' 📉</strong>으로 인식되었습니다.<br><br><em>"남들은 다 발전하는데 우리만 뒤처질 수 없다!" 😤</em>`,
        boxContent: `<strong>💥 역발상의 에너지</strong><br>이때부터 인간의 본능인 <strong>손실기피 성향</strong>이 오히려 성장의 폭발적 에너지가 되었습니다. 확실한 뒤처짐(손실)을 피하기 위해 리스크를 짊어지고 과감한 투자를 단행한 것입니다. 🚀`,
        math: `$$ \\max(v(\\text{성공}), v(\\text{실패})) > v(\\text{정체}) $$`,
        chartId: null
    }
];

let currentIndex = 0;
const sliderContainer = document.getElementById('slider-container');
const indicatorsContainer = document.getElementById('indicators');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const chartInstances = {};

function init() {
    slidesData.forEach((slide, index) => {
        const slideEl = document.createElement('div');
        slideEl.className = 'slide' + (index === 0 ? ' active' : '');
        slideEl.dataset.index = index;
        
        let visualHtml = '';
        if (slide.math || slide.chartId) {
            visualHtml = '<div class="slide-visuals">';
            if (slide.math) {
                visualHtml += `<div class="math-equation">${slide.math}</div>`;
            }
            if (slide.chartId) {
                visualHtml += `<div id="${slide.chartId}" class="chart-container"></div>`;
            }
            visualHtml += '</div>';
        }

        slideEl.innerHTML = `
            <div class="slide-grid">
                <div class="slide-text">
                    <span class="tag">${slide.tag}</span>
                    <h2><span>${slide.title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$]/gu, '')}</span>${slide.title.match(/[^\p{L}\p{N}\p{P}\p{Z}^$]/gu)?.join('') || ''}</h2>
                    <p>${slide.content}</p>
                    ${slide.boxContent ? `<div class="content-box"><p>${slide.boxContent}</p></div>` : ''}
                </div>
                ${visualHtml}
            </div>
        `;
        
        sliderContainer.appendChild(slideEl);

        const dot = document.createElement('div');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.dataset.index = index;
        dot.setAttribute('aria-label', `${index + 1}번 슬라이드로 이동`);
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });

    renderMath();
    initCharts();
    updateControls();
}

function renderMath() {
    renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
    });
}

function initCharts() {
    // 1. Expected Utility Chart
    if (document.getElementById('chart-utility')) {
        const utilityChart = echarts.init(document.getElementById('chart-utility'));
        chartInstances['chart-utility'] = utilityChart;

        let data = [];
        for (let x = 0; x <= 1000; x += 10) {
            data.push([x, Math.sqrt(x) * 10]);
        }
        utilityChart.setOption({
            backgroundColor: 'transparent',
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%',
                top: '20%',
                containLabel: true
            },
            title: { text: '효용함수 (Utility Function)', textStyle: { color: '#e2e8f0', fontSize: 16 } },
            tooltip: { trigger: 'axis' },
            xAxis: { 
                type: 'value', 
                name: '재산 (Wealth)', 
                nameTextStyle: { color: '#94a3b8', padding: [0, 0, 0, 10] },
                axisLine: { lineStyle: { color: '#94a3b8' } } 
            },
            yAxis: { 
                type: 'value', 
                name: '효용 (Utility)', 
                nameTextStyle: { color: '#94a3b8' },
                axisLine: { lineStyle: { color: '#94a3b8' } }, 
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } 
            },
            series: [
                {
                    name: '효용함수',
                    type: 'line',
                    data: data,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: { width: 4, color: '#3b82f6' },
                    markLine: {
                        symbol: 'none',
                        lineStyle: { color: 'rgba(255,255,255,0.3)', type: 'dashed' },
                        data: [
                            // Chord line connecting (100, U(100)) and (900, U(900))
                            [
                                { coord: [100, Math.sqrt(100) * 10] },
                                { coord: [900, Math.sqrt(900) * 10] }
                            ],
                            // Vertical line at x=500
                            [
                                { coord: [500, 0] },
                                { coord: [500, Math.sqrt(500) * 10] }
                            ]
                        ]
                    },
                    markPoint: {
                        data: [
                            { 
                                name: '확실한 보상의 효용 U(E[x])', 
                                coord: [500, Math.sqrt(500) * 10], 
                                itemStyle: { color: '#fbbf24' }, // 노란색
                                symbol: 'circle',
                                symbolSize: 12,
                                label: { 
                                    show: true, 
                                    position: 'top', 
                                    formatter: '확실한 선택\n(U=223.6)',
                                    color: '#fff',
                                    backgroundColor: 'rgba(25, 150, 100, 0.8)',
                                    padding: [4, 8],
                                    borderRadius: 4
                                } 
                            },
                            { 
                                name: '불확실한 선택의 기대효용 E[U(x)]', 
                                coord: [500, (Math.sqrt(100) * 10 + Math.sqrt(900) * 10) / 2], 
                                itemStyle: { color: '#ef4444' }, // 빨간색
                                symbol: 'rect',
                                symbolSize: 12,
                                label: { 
                                    show: true, 
                                    position: 'bottom', 
                                    formatter: '불확실한 선택(도박)\n(E[U]=200)',
                                    color: '#fff',
                                    backgroundColor: 'rgba(200, 50, 50, 0.8)',
                                    padding: [4, 8],
                                    borderRadius: 4
                                } 
                            }
                        ]
                    }
                }
            ]
        });
    }

    // 2. Prospect Theory Chart
    if (document.getElementById('chart-prospect')) {
        const prospectChart = echarts.init(document.getElementById('chart-prospect'));
        chartInstances['chart-prospect'] = prospectChart;

        let dataValues = [];
        for (let x = -100; x <= 100; x += 2) {
            let y = x >= 0 ? Math.pow(x, 0.6) * 10 : -2 * Math.pow(-x, 0.6) * 10;
            dataValues.push([x, y]);
        }
        prospectChart.setOption({
            backgroundColor: 'transparent',
            grid: {
                left: '5%',
                right: '10%',
                bottom: '10%',
                top: '20%',
                containLabel: true
            },
            title: { text: '가치함수 (Value Function)', textStyle: { color: '#e2e8f0', fontSize: 16 } },
            tooltip: { trigger: 'axis' },
            xAxis: { 
                type: 'value', 
                name: '이익 / 손실', 
                nameTextStyle: { color: '#94a3b8', padding: [0, 0, 0, 10] }, 
                axisLine: { lineStyle: { color: '#e2e8f0' } }, 
                splitLine: { show: false } 
            },
            yAxis: { 
                type: 'value', 
                name: '주관적 가치', 
                nameTextStyle: { color: '#94a3b8' }, 
                axisLine: { lineStyle: { color: '#e2e8f0' } }, 
                splitLine: { show: false } 
            },
            series: [{
                type: 'line',
                data: dataValues,
                symbol: 'none',
                lineStyle: { width: 4, color: '#8b5cf6' },
                markLine: {
                    data: [
                        { type: 'average', name: '준거점(Reference Pt)', xAxis: 0, lineStyle: { color: '#e2e8f0', type: 'dashed' } },
                        { type: 'average', yAxis: 0, lineStyle: { color: '#e2e8f0', type: 'dashed' } }
                    ]
                }
            }]
        });
    }

    // 3. Reference Shift Chart
    if (document.getElementById('chart-shift')) {
        const shiftChart = echarts.init(document.getElementById('chart-shift'));
        chartInstances['chart-shift'] = shiftChart;

        let data1 = [], data2 = [];
        for (let x = -100; x <= 100; x += 2) {
            let y1 = x >= 0 ? Math.pow(x, 0.6) * 10 : -2 * Math.pow(-x, 0.6) * 10;
            data1.push([x, y1]);
            let shiftedX = x - 40;
            let y2 = shiftedX >= 0 ? Math.pow(shiftedX, 0.6) * 10 : -2 * Math.pow(-shiftedX, 0.6) * 10;
            data2.push([x, y2]);
        }
        shiftChart.setOption({
            backgroundColor: 'transparent',
            grid: {
                left: '5%',
                right: '10%',
                bottom: '10%',
                top: '20%',
                containLabel: true
            },
            title: { text: '준거점 이동 (Ref. Shift)', textStyle: { color: '#e2e8f0', fontSize: 16 } },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'value', axisLine: { lineStyle: { color: '#94a3b8' } }, splitLine: { show: false } },
            yAxis: { type: 'value', axisLine: { lineStyle: { color: '#94a3b8' } }, splitLine: { show: false } },
            series: [
                { name: '기존', type: 'line', data: data1, symbol: 'none', lineStyle: { width: 2, color: 'rgba(148, 163, 184, 0.4)', type: 'dashed' } },
                { name: '이동 후', type: 'line', data: data2, symbol: 'none', lineStyle: { width: 4, color: '#0ea5e9' } }
            ]
        });
    }

    window.addEventListener('resize', () => {
        Object.values(chartInstances).forEach(chart => chart.resize());
    });
}

function updateSlides() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentIndex) {
            slide.classList.add('active');
            // Trigger chart animation if chart exists
            const chartDom = slide.querySelector('.chart-container');
            if (chartDom && chartInstances[chartDom.id]) {
                setTimeout(() => chartInstances[chartDom.id].resize(), 100);
            }
        } else if (index < currentIndex) {
            slide.classList.add('prev');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    updateControls();
}

function updateControls() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slidesData.length - 1;
}

function goToSlide(index) {
    if (index < 0 || index >= slidesData.length) return;
    currentIndex = index;
    updateSlides();
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
});

let touchStartX = 0;
let touchEndX = 0;

sliderContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive:true});

sliderContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const minSwipeDistance = 50;
    if (touchEndX < touchStartX - minSwipeDistance) goToSlide(currentIndex + 1);
    if (touchEndX > touchStartX + minSwipeDistance) goToSlide(currentIndex - 1);
}, {passive:true});

// PDF Download Logic
document.getElementById('download-pdf').addEventListener('click', () => {
    // Scroll to top just in case
    window.scrollTo(0, 0);
    
    const element = document.getElementById('slider-container');
    const options = {
        margin: 0,
        filename: 'presentation.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#0f172a',
            logging: false,
            width: 1122.5,
            height: slidesData.length * 793.7 // Ensure overall height accounts for all slides
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    document.body.classList.add('pdf-mode');
    
    // Increased wait time to 1.5s to ensure all slides and charts are fully visible/rendered in the background
    setTimeout(() => {
        html2pdf().set(options).from(element).save().then(() => {
            document.body.classList.remove('pdf-mode');
        });
    }, 1500);
});

window.onload = init;
