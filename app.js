// --- Game Configuration ---
let TOTAL_ROUNDS = 10;
let PLAY_BETA = 1.0;

// Payoff Matrix (User, AI)
// C = Cooperate, D = Defect
const PAYOFFS = {
    'CC': [3, 3], // Mutual cooperation
    'CD': [0, 5], // Sucker's payoff
    'DC': [5, 0], // Temptation
    'DD': [1, 1]  // Mutual defection
};

// --- State ---
let currentRound = 1;
let userScore = 0;
let aiScore = 0;
let userHistory = []; // Tracks user's past choices 'C' or 'D'

// --- DOM Elements ---
const views = document.querySelectorAll('.view');
const tabBtns = document.querySelectorAll('.tab-btn');

const btnCooperate = document.getElementById('btn-cooperate');
const btnDefect = document.getElementById('btn-defect');
const historyLog = document.getElementById('history-log');

const uiUserScore = document.getElementById('user-score');
const uiAiScore = document.getElementById('ai-score');
const uiCurrentRound = document.getElementById('current-round');
const uiTotalWelfare = document.getElementById('total-welfare');

const gameOverPanel = document.getElementById('game-over-panel');
const gameResultMessage = document.getElementById('game-result-message');
const btnRestart = document.getElementById('btn-restart');

// --- Initialization ---
function init() {
    setupTabs();
    setupActions();
    
    btnRestart.addEventListener('click', resetGame);
    document.getElementById('btn-run-sim').addEventListener('click', runSimulation);

    // Populate strategy selects for 1v1
    const selectA = document.getElementById('sim-strat-A');
    const selectB = document.getElementById('sim-strat-B');
    if (selectA && selectB) {
        Object.keys(strategies).forEach(key => {
            const strat = strategies[key];
            const optionA = document.createElement('option');
            optionA.value = key;
            optionA.textContent = strat.name;
            selectA.appendChild(optionA);
            
            const optionB = document.createElement('option');
            optionB.value = key;
            optionB.textContent = strat.name;
            selectB.appendChild(optionB);
        });
        
        // Select distinct defaults if possible
        if(selectA.options.length > 1) {
            selectB.selectedIndex = 1;
        }
    }
    
    // Setup Theory Simulator
    setupTheorySim();

    // Setup Tournament Mode
    setupTournament();
}

// --- Navigation ---
function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
}

// --- Theory Simulator ---
function setupTheorySim() {
    const tInput = document.getElementById('theo-t');
    const rInput = document.getElementById('theo-r');
    const pInput = document.getElementById('theo-p');
    const sInput = document.getElementById('theo-s');
    const bInput = document.getElementById('theo-beta');
    const bVal = document.getElementById('theo-beta-val');
    
    if (!tInput) return;
    
    const update = () => {
        const T = parseFloat(tInput.value) || 0;
        const R = parseFloat(rInput.value) || 0;
        const P = parseFloat(pInput.value) || 0;
        const S = parseFloat(sInput.value) || 0;
        const b = parseFloat(bInput.value) || 0;
        
        bVal.textContent = b.toFixed(2);
        
        const b2 = b * b;
        const ccd = R + b * R + b2 * T;
        const dcd = T + b * S + b2 * T;
        const cdd = R + b * T + b2 * P;
        const ddd = T + b * P + b2 * P;
        
        const scores = [
            { name: 'CCD (협력유지)', score: ccd, code: 'CCD' },
            { name: 'DCD', score: dcd, code: 'DCD' },
            { name: 'CDD', score: cdd, code: 'CDD' },
            { name: 'DDD (전면배신)', score: ddd, code: 'DDD' }
        ];
        
        scores.sort((a, b) => b.score - a.score);
        const best = scores[0];
        
        const container = document.getElementById('theo-results');
        container.innerHTML = '';
        
        const order = [ {n:'CCD', v:ccd}, {n:'DCD', v:dcd}, {n:'CDD', v:cdd}, {n:'DDD', v:ddd} ];
        
        order.forEach(item => {
            const isBest = item.n === best.code;
            container.innerHTML += `
                <div style="background: ${isBest ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${isBest ? '#ffd700' : 'var(--glass-border)'}; padding: 1rem; border-radius: 8px; transition: transform 0.2s;">
                    <div style="font-weight: bold; margin-bottom: 0.5rem; color: ${isBest ? '#ffd700' : 'var(--text-secondary)'};">${item.n}</div>
                    <div style="font-size: 1.3rem; color: ${isBest ? '#fff' : '#cbd5e1'};">${item.v.toFixed(2)}</div>
                    ${isBest ? '<div style="font-size: 0.85rem; margin-top: 0.5rem; color: #ffd700;">★ 최적 선택</div>' : ''}
                </div>
            `;
        });
        
        let conc = document.getElementById('theo-conclusion');
        if (best.code === 'CCD') {
            conc.innerHTML = `✅ 결과: 현재 설정에서 B의 최적 행동은 <strong>CCD(협력)</strong>입니다! (𝛽가 충분히 큼)`;
            conc.style.color = 'var(--cooperate-color)';
            conc.style.background = 'rgba(74, 222, 128, 0.1)';
        } else {
            conc.innerHTML = `🚫 결과: 현재 설정에서 B의 최적 행동은 <strong>${best.code}</strong>입니다. (협력을 유도하기엔 𝛽가 부족함)`;
            conc.style.color = 'var(--defect-color)';
            conc.style.background = 'rgba(248, 113, 113, 0.1)';
        }
    };
    
    [tInput, rInput, pInput, sInput, bInput].forEach(el => el.addEventListener('input', update));
    update(); // init call
}

// --- Interactive Mode Logic ---
function setupActions() {
    btnCooperate.addEventListener('click', () => playRound('C'));
    btnDefect.addEventListener('click', () => playRound('D'));
    
    const btnApplyPlaySettings = document.getElementById('btn-apply-play-settings');
    if (btnApplyPlaySettings) {
        btnApplyPlaySettings.addEventListener('click', () => {
            const rInput = document.getElementById('play-rounds');
            const bInput = document.getElementById('play-beta');
            TOTAL_ROUNDS = (rInput && parseInt(rInput.value) > 0) ? parseInt(rInput.value) : 10;
            PLAY_BETA = (bInput && parseFloat(bInput.value) >= 0) ? parseFloat(bInput.value) : 1.0;
            
            const displayObj = document.getElementById('total-rounds-display');
            if(displayObj) displayObj.textContent = TOTAL_ROUNDS;
            
            resetGame();
        });
    }
}

// AI Strategy: Tit-for-Tat (맞대응 전략)
// Starts by cooperating, then copies the user's previous move.
function getAiChoice() {
    if (userHistory.length === 0) {
        return 'C'; // First move is always Cooperate
    }
    // Return user's last move
    return userHistory[userHistory.length - 1];
}

function playRound(userChoice) {
    if (currentRound > TOTAL_ROUNDS) return;

    // AI makes its choice before seeing user's *current* choice
    const aiChoice = getAiChoice();
    
    // Save user's choice to history for AI's next move
    userHistory.push(userChoice);
    
    // Calculate payoffs
    const outcomeKey = userChoice + aiChoice;
    const roundBeta = Math.pow(PLAY_BETA, currentRound - 1);
    const pointsUser = PAYOFFS[outcomeKey][0] * roundBeta;
    const pointsAi = PAYOFFS[outcomeKey][1] * roundBeta;
    
    // Update scores
    userScore += pointsUser;
    aiScore += pointsAi;
    
    // Update UI (Round to 2 decimal places)
    animateScore(uiUserScore, Math.round(userScore * 100) / 100);
    animateScore(uiAiScore, Math.round(aiScore * 100) / 100);
    if (uiTotalWelfare) {
        animateScore(uiTotalWelfare, Math.round((userScore + aiScore) * 100) / 100);
    }
    
    addLogEntry(currentRound, userChoice, aiChoice, pointsUser, pointsAi, outcomeKey);
    
    // Check game end
    if (currentRound >= TOTAL_ROUNDS) {
        currentRound++; // increment to prevent further plays
        endGame();
    } else {
        currentRound++;
        uiCurrentRound.textContent = currentRound;
    }
}

function animateScore(element, newScore) {
    element.textContent = newScore;
    element.style.transform = 'scale(1.5)';
    element.style.color = '#fff';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}

function addLogEntry(round, uChoice, aChoice, uPts, aPts, outcomeKey) {
    // Remove placeholder on first move
    if (round === 1) {
        historyLog.innerHTML = '';
    }
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    // Add border color based on outcome
    if (outcomeKey === 'CC') entry.classList.add('both-c');
    else if (outcomeKey === 'DD') entry.classList.add('both-d');
    else if (outcomeKey === 'DC') entry.classList.add('user-exploits');
    else if (outcomeKey === 'CD') entry.classList.add('ai-exploits');
    
    const uChoiceText = uChoice === 'C' ? '협력' : '배신';
    const aChoiceText = aChoice === 'C' ? '협력' : '배신';
    const uClass = uChoice === 'C' ? 'c' : 'd';
    const aClass = aChoice === 'C' ? 'c' : 'd';
    
    const uScoreClass = uPts > 0 ? 'plus' : 'zero';
    const aScoreClass = aPts > 0 ? 'plus' : 'zero';
    
    const pU = Math.round(uPts * 100) / 100;
    const pA = Math.round(aPts * 100) / 100;
    
    entry.innerHTML = `
        <div class="log-round">R${round}</div>
        <div class="log-choices">
            <span class="choice ${uClass}">나: ${uChoiceText}</span>
            <span class="choice ${aClass}">AI: ${aChoiceText}</span>
        </div>
        <div class="log-scores">
            <span class="round-score ${uScoreClass}">+${pU}</span>
            <span>/</span>
            <span class="round-score ${aScoreClass}">+${pA}</span>
        </div>
    `;
    
    historyLog.appendChild(entry);
    historyLog.scrollTop = historyLog.scrollHeight;
}

function endGame() {
    btnCooperate.disabled = true;
    btnDefect.disabled = true;
    
    gameOverPanel.classList.remove('hidden');
    
    const allCooperated = userHistory.every(c => c === 'C');
    
    if (userScore > aiScore) {
        gameResultMessage.innerHTML = `<strong>결과 분석: 당신의 이기적 승리</strong><br><br>이기기 위해 배신을 선택했고 가장 큰 독단적 점수를 챙겼습니다! 하지만 <u>가운데의 '사회 전체 보수 합산'을 확인해 보세요.</u> 서로 협력했을 때보다 전체 파이는 훨씬 작아졌을 겁니다. 배신은 결국 사회적 손실을 낳습니다.`;
    } else if (userScore < aiScore) {
        gameResultMessage.innerHTML = `<strong>결과 분석: AI(맞대응전략)의 승리</strong><br><br>AI가 더 높은 점수를 내었습니다. 일방적으로 협력하다 배신당했거나, 맞대응에 복수당하며 사회 전체 보수 합산도 깎여나갔습니다.`;
    } else {
        if (allCooperated) {
            gameResultMessage.innerHTML = `<strong>결과 분석: 완벽한 무승부 (상호 평화)</strong><br><br>🏆 축하합니다! 가운데의 <strong>'사회 전체 보수 합산'</strong>이 가장 높은 최대치에 도달했습니다. 서로 지속해서 협력할 때만 전체 파이가 극대화되며 모두가 윈윈(Win-Win)할 수 있음을 멋지게 증명하셨습니다!`;
        } else {
            gameResultMessage.innerHTML = `<strong>결과 분석: 상처만 남은 무승부</strong><br><br>서로 끝없이 배신과 복수를 반복했습니다. 죄수의 딜레마의 전형적인 늪에 빠졌고, 전체 보수 합산은 상호 협력 시나리오에 비해 심각하게 작아졌습니다. 다같이 파멸의 길을 걷지 않게 조심하세요.`;
        }
    }

    // --- 가상 시나리오 점수 비교 ---
    // AI는 맞대응(TfT): 첫 라운드 협력, 이후 유저의 직전 행동을 그대로 따라함
    // 시나리오 A - 유저가 매 라운드 협력(C): AI도 매 라운드 C → 항상 CC → 유저 3점/라운드, AI 3점/라운드 (합산 6점)
    // 시나리오 B - 유저가 매 라운드 배신(D): AI 1라운드 C(→유저 5점, AI 0점, 합산 5점), 2라운드부터 D(→유저 1점, AI 1점, 합산 2점)
    let hypAllCScore = 0;
    let hypAllDScore = 0;
    let hypAllCTotal = 0;
    let hypAllDTotal = 0;
    for (let r = 0; r < TOTAL_ROUNDS; r++) {
        const disc = Math.pow(PLAY_BETA, r);
        hypAllCScore += PAYOFFS['CC'][0] * disc;   // 항상 CC (내 점수)
        hypAllCTotal += (PAYOFFS['CC'][0] + PAYOFFS['CC'][1]) * disc; // 항상 CC (사회 전체)
        
        if (r === 0) {
            hypAllDScore += PAYOFFS['DC'][0] * disc; // 1라운드: 유저D AI는 C → DC (내 점수)
            hypAllDTotal += (PAYOFFS['DC'][0] + PAYOFFS['DC'][1]) * disc; // 1라운드: (사회 전체)
        } else {
            hypAllDScore += PAYOFFS['DD'][0] * disc; // 2라운드~: 유저D AI도 D → DD (내 점수)
            hypAllDTotal += (PAYOFFS['DD'][0] + PAYOFFS['DD'][1]) * disc; // 2라운드~: (사회 전체)
        }
    }
    hypAllCScore = Math.round(hypAllCScore * 100) / 100;
    hypAllDScore = Math.round(hypAllDScore * 100) / 100;
    hypAllCTotal = Math.round(hypAllCTotal * 100) / 100;
    hypAllDTotal = Math.round(hypAllDTotal * 100) / 100;
    
    const actualRounded = Math.round(userScore * 100) / 100;
    const actualTotalRounded = Math.round((userScore + aiScore) * 100) / 100;

    // DOM 업데이트
    const elAllC   = document.getElementById('hyp-allc-score');
    const elAllD   = document.getElementById('hyp-alld-score');
    const elActual = document.getElementById('hyp-actual-score');
    
    const elAllCTotal   = document.getElementById('hyp-allc-total');
    const elAllDTotal   = document.getElementById('hyp-alld-total');
    const elActualTotal = document.getElementById('hyp-actual-total');

    const elMsg    = document.getElementById('hyp-diff-msg');

    if (elAllC)   elAllC.textContent   = `${hypAllCScore}점`;
    if (elAllD)   elAllD.textContent   = `${hypAllDScore}점`;
    if (elActual) elActual.textContent = `${actualRounded}점`;
    
    if (elAllCTotal)   elAllCTotal.textContent   = `${hypAllCTotal}점`;
    if (elAllDTotal)   elAllDTotal.textContent   = `${hypAllDTotal}점`;
    if (elActualTotal) elActualTotal.textContent = `${actualTotalRounded}점`;

    if (elMsg) {
        const diffFromAllC = Math.round((hypAllCScore - actualRounded) * 100) / 100;
        const diffFromAllD = Math.round((actualRounded - hypAllDScore) * 100) / 100;
        const socialDiff = Math.round((hypAllCTotal - hypAllDTotal) * 100) / 100;

        let msg = '';
        if (allCooperated) {
            msg = `✅ 매 라운드 협력 시나리오와 <strong>동일한 내 점수</strong>를 달성했습니다. 맞대응 전략과의 최선 협력을 완벽하게 이끌어냈습니다!<br>`;
        } else if (diffFromAllC === 0) {
            msg = `매 라운드 협력 시의 내 점수와 같습니다.<br>`;
        } else if (diffFromAllC > 0) {
            msg = `매 라운드 협력했을 때보다 내 점수가 <strong style="color:var(--defect-color);">${diffFromAllC}점 낮습니다.</strong><br>`;
        } else {
            msg = `매 라운드 협력했을 때보다 내 점수가 <strong style="color:var(--cooperate-color);">${Math.abs(diffFromAllC)}점 높습니다.</strong><br>`;
        }
        
        msg += `<br>🌍 <strong>사회 전체 점수 관점</strong><br>`;
        msg += `모두 협력으로 이끌었을 때는 총 <strong>${hypAllCTotal}점</strong>, 모두 배신으로 일관했을 때는 총 <strong>${hypAllDTotal}점</strong>입니다. 
        즉, 두 전략의 차이만으로도 사회 전체에 <strong style="color:var(--cooperate-color);">${socialDiff}점의 격차</strong>가 발생합니다.`;
        
        elMsg.innerHTML = msg;
    }
}


function resetGame() {
    currentRound = 1;
    userScore = 0;
    aiScore = 0;
    userHistory = [];
    
    uiUserScore.textContent = '0';
    uiAiScore.textContent = '0';
    uiCurrentRound.textContent = '1';
    if (uiTotalWelfare) uiTotalWelfare.textContent = '0';
    
    historyLog.innerHTML = `<div class="log-placeholder">게임이 시작되면 결과가 이곳에 기록됩니다. 상대방은 '맞대응전략'을 사용합니다!</div>`;
    
    gameOverPanel.classList.add('hidden');
    
    btnCooperate.disabled = false;
    btnDefect.disabled = false;
}

// --- Simulation Mode Logic ---
const strategies = {
    'TitForTat': {
        name: '맞대응 (Tit-for-Tat)',
        desc: '처음엔 협력하고, 이후엔 상대의 직전 행동을 그대로 따라함. 보복은 빠르고 용서도 빠른 효율적 전략.',
        play: (history, opponentHistory) => opponentHistory.length === 0 ? 'C' : opponentHistory[opponentHistory.length - 1]
    },
    'AllC': {
        name: '호구 (항상 협력)',
        desc: '무조건 협력만 함. 착하지만 다른 이에게 착취당하기 쉬움.',
        play: () => 'C'
    },
    'AllD': {
        name: '악당 (항상 배신)',
        desc: '무조건 배신만 함. 단기적 이익을 극대화하려 함.',
        play: () => 'D'
    },
    'Random': {
        name: '혼돈 (무작위)',
        desc: '50% 확률로 협력 혹은 배신을 선택.',
        play: () => Math.random() > 0.5 ? 'C' : 'D'
    },
    'GrimTrigger': {
        name: '무관용 (Grim Trigger)',
        desc: '계속 협력하다가 한 번이라도 배신당하면 이후 영원히 배신함.',
        play: (history, opponentHistory) => opponentHistory.includes('D') ? 'D' : 'C'
    }
};

function runBotMatch(stratA, stratB, rounds = 50, beta = 1.0) {
    let histA = [];
    let histB = [];
    let scoreA = 0;
    let scoreB = 0;
    let logs = [];
    
    for (let r = 0; r < rounds; r++) {
        const choiceA = strategies[stratA].play(histA, histB);
        const choiceB = strategies[stratB].play(histB, histA);
        
        histA.push(choiceA);
        histB.push(choiceB);
        
        const outcomeKey = choiceA + choiceB;
        
        // 할인율(Beta) 적용: 첫 라운드는 r=0으로 beta^0 = 1, 이후 가치 감소
        const roundBeta = Math.pow(beta, r);
        
        const earnA = PAYOFFS[outcomeKey][0] * roundBeta;
        const earnB = PAYOFFS[outcomeKey][1] * roundBeta;
        
        scoreA += earnA;
        scoreB += earnB;
        
        logs.push({
            round: r + 1,
            choiceA, choiceB,
            earnA: Math.round(earnA * 100) / 100,
            earnB: Math.round(earnB * 100) / 100,
            outcomeKey
        });
    }
    
    // 점수 소수점 두 자리 반올림 처리
    return [Math.round(scoreA * 100) / 100, Math.round(scoreB * 100) / 100, logs];
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runSimulation() {
    const btnParams = document.getElementById('btn-run-sim');
    btnParams.textContent = "시뮬레이션 진행 중...";
    btnParams.disabled = true;
    
    const resultsDiv = document.getElementById('sim-results');
    const leaderboard = document.getElementById('leaderboard');
    const liveView = document.getElementById('sim-live-view');
    const liveMatchup = document.getElementById('sim-live-matchup');
    const liveLog = document.getElementById('sim-live-log');
    const progressBar = document.getElementById('sim-progress');
    
    // Read dynamic settings
    const roundsInput = document.getElementById('sim-rounds');
    const SIM_ROUNDS = (roundsInput && parseInt(roundsInput.value) > 0) ? parseInt(roundsInput.value) : 50;
    
    const betaInput = document.getElementById('sim-beta');
    const SIM_BETA = (betaInput && parseFloat(betaInput.value) >= 0) ? parseFloat(betaInput.value) : 1.0;
    
    const sA = document.getElementById('sim-strat-A') ? document.getElementById('sim-strat-A').value : 'TitForTat';
    const sB = document.getElementById('sim-strat-B') ? document.getElementById('sim-strat-B').value : 'AllD';
    
    if (!sA || !sB) {
        btnParams.textContent = "시뮬레이션 다시 실행";
        btnParams.disabled = false;
        return;
    }

    // Hide results, show live view with reset
    resultsDiv.classList.add('hidden');
    liveView.classList.remove('hidden');
    progressBar.style.width = '0%';
    liveLog.innerHTML = '대결을 준비 중입니다...';
    leaderboard.innerHTML = '';
    
    liveMatchup.innerHTML = `<span style="color:var(--accent-blue)">${strategies[sA].name}</span> vs <span style="color:var(--defect-color)">${strategies[sB].name}</span>`;
    
    await sleep(400); 
    progressBar.style.width = '30%';
    liveLog.innerHTML = `<div>${SIM_ROUNDS} 라운드 대결 진행 중...</div>`;
    
    await sleep(600); 
    const [scoreA, scoreB, roundLogs] = runBotMatch(sA, sB, SIM_ROUNDS, SIM_BETA);
    
    progressBar.style.width = '100%';
    liveLog.innerHTML = `<div>대결 종료! 점수 집계 중...</div>`;
    
    await sleep(500);
    liveView.classList.add('hidden');
    
    const createResultHtml = (title, key, score, isWinner, isDraw) => `
        <div class="sim-item" style="border: 2px solid ${isWinner ? 'rgba(255, 215, 0, 0.4)' : 'transparent'}; background: ${isWinner ? 'rgba(255, 215, 0, 0.05)' : 'rgba(0,0,0,0.2)'}; transform: scale(${isWinner ? 1.02 : 1}); margin-bottom: 1.5rem;">
            <div class="sim-rank ${isWinner ? 'gold' : ''}" style="font-size: 1.2rem; width: 80px;">${isWinner ? '🏆 1위' : (isDraw ? '🤝 무승부' : '2위')}</div>
            <div class="sim-info">
                <div class="sim-name">${title} <span style="font-size: 0.9em; color: var(--text-secondary)">(${strategies[key].name})</span></div>
                <div class="sim-desc">${strategies[key].desc}</div>
            </div>
            <div class="sim-score">${score}점</div>
        </div>
    `;
    
    if (scoreA === scoreB) {
        leaderboard.innerHTML += createResultHtml('전략 A', sA, scoreA, false, true);
        leaderboard.innerHTML += createResultHtml('전략 B', sB, scoreB, false, true);
    } else if (scoreA > scoreB) {
        leaderboard.innerHTML += createResultHtml('전략 A', sA, scoreA, true, false);
        leaderboard.innerHTML += createResultHtml('전략 B', sB, scoreB, false, false);
    } else {
        leaderboard.innerHTML += createResultHtml('전략 B', sB, scoreB, true, false);
        leaderboard.innerHTML += createResultHtml('전략 A', sA, scoreA, false, false);
    }
    
    // 라운드별 상세 로깅 DOM 추가
    const roundLogContainer = document.getElementById('sim-round-log');
    if (roundLogContainer) {
        roundLogContainer.innerHTML = '';
        roundLogs.forEach(entry => {
            const row = document.createElement('div');
            row.className = 'log-entry';
            
            if (entry.outcomeKey === 'CC') row.classList.add('both-c');
            else if (entry.outcomeKey === 'DD') row.classList.add('both-d');
            else if (entry.outcomeKey === 'DC') row.classList.add('user-exploits');
            else if (entry.outcomeKey === 'CD') row.classList.add('ai-exploits');
            
            const aChoiceText = entry.choiceA === 'C' ? '협력' : '배신';
            const bChoiceText = entry.choiceB === 'C' ? '협력' : '배신';
            const aClass = entry.choiceA === 'C' ? 'c' : 'd';
            const bClass = entry.choiceB === 'C' ? 'c' : 'd';
            
            const aScoreClass = entry.earnA > 0 ? 'plus' : 'zero';
            const bScoreClass = entry.earnB > 0 ? 'plus' : 'zero';
            
            row.innerHTML = `
                <div class="log-round" style="width: 50px;">R${entry.round}</div>
                <div class="log-choices">
                    <span class="choice ${aClass}">A: ${aChoiceText}</span>
                    <span class="choice ${bClass}">B: ${bChoiceText}</span>
                </div>
                <div class="log-scores" style="width: 150px;">
                    <span class="round-score ${aScoreClass}">+${entry.earnA}</span>
                    <span>/</span>
                    <span class="round-score ${bScoreClass}">+${entry.earnB}</span>
                </div>
            `;
            roundLogContainer.appendChild(row);
        });
    }

    // --- 사회 전체 복지 비교 패널 렌더링 ---
    renderWelfarePanel(sA, sB, scoreA, scoreB, SIM_ROUNDS, SIM_BETA);
    
    resultsDiv.classList.remove('hidden');
    btnParams.textContent = "새로운 1:1 대결 시작";
    btnParams.disabled = false;
}

/**
 * 사회 전체 복지(두 플레이어 합산) 비교 패널 렌더링
 * - 실제 결과 합산
 * - 상호 협력 최선 시나리오 합산 비교
 */
function renderWelfarePanel(sA, sB, scoreA, scoreB, rounds, beta) {
    const cardsEl   = document.getElementById('sim-welfare-cards');
    const pctEl     = document.getElementById('sim-welfare-pct');
    const barEl     = document.getElementById('sim-welfare-bar');
    const msgEl     = document.getElementById('sim-welfare-msg');
    if (!cardsEl) return;

    // 할인율 적용 합계 계산 헬퍼
    const discountedSum = (payoffPerRound) => {
        let total = 0;
        for (let r = 0; r < rounds; r++) total += payoffPerRound * Math.pow(beta, r);
        return Math.round(total * 100) / 100;
    };

    // 1) 실제 합산
    const actualWelfare = Math.round((scoreA + scoreB) * 100) / 100;

    // 2) 최선 시나리오: 양측 모두 매 라운드 협력 → 라운드 합산 6점
    const bestWelfare = discountedSum(6);

    // 3) 최악 시나리오: 양측 모두 매 라운드 배신 → 라운드 합산 2점
    const worstWelfare = discountedSum(2);

    const rawPct = bestWelfare > 0 ? Math.round(actualWelfare / bestWelfare * 100) : 100;

    // 손실 점수
    const loss = Math.round((bestWelfare - actualWelfare) * 100) / 100;

    // --- 카드 렌더링 (실제 결과 / 최선 시나리오 2개) ---
    const cardStyle = (borderColor, bgAlpha) =>
        `background: rgba(0,0,0,${bgAlpha}); border: 2px solid ${borderColor}; border-radius: 12px; padding: 1.4rem 1.2rem; text-align: center;`;

    const isActualBest = actualWelfare >= bestWelfare * 0.999;

    cardsEl.innerHTML = `
        <!-- 실제 결과 -->
        <div style="${cardStyle(isActualBest ? 'rgba(74,222,128,0.6)' : 'rgba(255,215,0,0.4)', 0.25)}">
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.5rem; font-weight:700; letter-spacing:0.06em;">📊 실제 대결 결과</div>
            <div style="font-size:0.88rem; color:#94a3b8; margin-bottom:0.7rem;">
                ${strategies[sA].name}<br>× ${strategies[sB].name}
            </div>
            <div style="font-size:2rem; font-weight:800; color:${isActualBest ? 'var(--cooperate-color)' : '#ffd700'};">${actualWelfare}점</div>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.4rem;">사회 전체 합산</div>
        </div>

        <!-- 최선 시나리오 -->
        <div style="${cardStyle('rgba(74,222,128,0.5)', 0.2)}">
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.5rem; font-weight:700; letter-spacing:0.06em;">🌟 최선 시나리오</div>
            <div style="font-size:0.88rem; color:#94a3b8; margin-bottom:0.7rem;">
                양측 모두<br>매 라운드 협력
            </div>
            <div style="font-size:2rem; font-weight:800; color:var(--cooperate-color);">${bestWelfare}점</div>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.4rem;">이론적 최대 사회 복지</div>
        </div>
    `;

    // --- 게이지 바 ---
    pctEl.textContent = `${rawPct}%`;
    // 애니메이션을 위해 약간 지연
    setTimeout(() => {
        barEl.style.width = `${rawPct}%`;
        barEl.style.background = rawPct >= 95
            ? 'linear-gradient(90deg, var(--cooperate-color), #ffd700)'
            : rawPct >= 60
            ? 'linear-gradient(90deg, #fb923c, #ffd700)'
            : 'linear-gradient(90deg, var(--defect-color), #fb923c)';
    }, 100);

    // --- 손실 메시지 ---
    let msgHTML = '';
    if (loss <= 0.01) {
        msgHTML = `✅ <strong style="color:var(--cooperate-color);">완벽한 협력 달성!</strong> 두 전략이 만들어낸 사회 전체 합산이 이론적 최대치와 동일합니다. 상호 협력의 힘이 잘 드러났습니다.`;
    } else {
        const lossPct = Math.round(loss / bestWelfare * 100);

        // 대결 특성에 따른 인사이트
        const hasDefector = (sA === 'AllD' || sB === 'AllD');
        const hasTitForTat = (sA === 'TitForTat' || sB === 'TitForTat');

        let extra = '';
        if (hasDefector && hasTitForTat) {
            extra = `<br><br>💡 <strong>항상 배신</strong> 전략이 포함되면, 맞대응 전략도 2라운드부터 보복 배신으로 전환합니다. 그 결과 양측 모두 매 라운드 최하점(2점)만 주고받게 됩니다. <strong>배신 한 번이 사회 전체 파이를 ${lossPct}% 줄인 것</strong>입니다.`;
        } else if (hasDefector) {
            extra = `<br><br>💡 배신 전략이 포함되어 사회 전체 파이가 크게 줄었습니다. 한쪽이 착취당하거나 서로 배신하면 모두가 손해를 봅니다.`;
        }

        msgHTML = `⚠️ 이번 대결은 최선 대비 <strong style="color:var(--defect-color);">${loss}점 손실</strong>되었습니다 (사회 전체 복지의 <strong>${lossPct}%</strong> 감소).${extra}`;
    }
    msgEl.innerHTML = msgHTML;
}

window.addEventListener('DOMContentLoaded', init);

// ============================================================
// --- Tournament Mode Logic ---
// ============================================================

const MEDAL_EMOJI = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
const STRATEGY_COLORS = {
    'TitForTat':   'var(--accent-blue)',
    'AllC':        'var(--cooperate-color)',
    'AllD':        'var(--defect-color)',
    'Random':      '#a855f7',
    'GrimTrigger': '#fb923c'
};

function setupTournament() {
    const checksContainer = document.getElementById('tour-strategy-checks');
    if (!checksContainer) return;

    // Build strategy checkboxes
    Object.keys(strategies).forEach(key => {
        const strat = strategies[key];
        const color = STRATEGY_COLORS[key] || '#fff';
        const label = document.createElement('label');
        label.style.cssText = `display:flex; align-items:center; gap:0.4rem; cursor:pointer; background:rgba(255,255,255,0.05); border:1px solid ${color}44; padding:0.4rem 0.9rem; border-radius:20px; font-size:0.9rem; transition: background 0.2s;`;
        label.innerHTML = `
            <input type="checkbox" id="tour-check-${key}" value="${key}" checked style="accent-color:${color}; width:15px; height:15px; cursor:pointer;">
            <span style="color:${color}; font-weight:600;">${strat.name}</span>
        `;
        label.querySelector('input').addEventListener('change', (e) => {
            label.style.background = e.target.checked ? `${color}22` : 'rgba(255,255,255,0.05)';
        });
        // init checked state
        label.style.background = `${color}22`;
        checksContainer.appendChild(label);
    });

    document.getElementById('btn-run-tournament').addEventListener('click', runTournament);
}

async function runTournament() {
    const btn = document.getElementById('btn-run-tournament');
    const liveView = document.getElementById('tour-live-view');
    const tourResults = document.getElementById('tour-results');
    const progressBar = document.getElementById('tour-progress');
    const currentMatchEl = document.getElementById('tour-current-match');
    const matchCounterEl = document.getElementById('tour-match-counter');

    // Read settings
    const rounds = parseInt(document.getElementById('tour-rounds').value) || 50;
    const beta = parseFloat(document.getElementById('tour-beta').value);
    const finalBeta = isNaN(beta) || beta < 0 ? 1.0 : Math.min(beta, 1.0);

    // Get selected strategies
    const selectedKeys = Object.keys(strategies).filter(key => {
        const cb = document.getElementById(`tour-check-${key}`);
        return cb && cb.checked;
    });

    if (selectedKeys.length < 2) {
        alert('토너먼트를 위해 최소 2개 이상의 전략을 선택해주세요!');
        return;
    }

    btn.textContent = '토너먼트 진행 중...';
    btn.disabled = true;
    tourResults.classList.add('hidden');
    liveView.classList.remove('hidden');
    progressBar.style.width = '0%';

    // Generate all unique matchups (A vs B, A vs A, etc.)
    const matchups = [];
    for (let i = 0; i < selectedKeys.length; i++) {
        for (let j = i; j < selectedKeys.length; j++) {
            matchups.push([selectedKeys[i], selectedKeys[j]]);
        }
    }
    const totalMatches = matchups.length;

    // Score accumulator: { stratKey: { totalScore, wins, draws, losses, matchResults: [] } }
    const scoreboard = {};
    selectedKeys.forEach(key => {
        scoreboard[key] = { totalScore: 0, wins: 0, draws: 0, losses: 0, matchResults: [] };
    });

    // Run each matchup with animation
    for (let m = 0; m < totalMatches; m++) {
        const [sA, sB] = matchups[m];
        const nameA = strategies[sA].name;
        const nameB = strategies[sB].name;

        currentMatchEl.innerHTML = `<span style="color:${STRATEGY_COLORS[sA]}">${nameA}</span> vs <span style="color:${STRATEGY_COLORS[sB]}">${nameB}</span>`;
        matchCounterEl.textContent = `매치 ${m + 1} / ${totalMatches}`;
        progressBar.style.width = `${((m + 1) / totalMatches) * 100}%`;

        await sleep(80);

        const [scoreA, scoreB, logs] = runBotMatch(sA, sB, rounds, finalBeta);

        scoreboard[sA].totalScore += scoreA;
        scoreboard[sA].matchResults.push({ opp: sB, myScore: scoreA, oppScore: scoreB, logs });

        if (sA !== sB) {
            scoreboard[sB].totalScore += scoreB;
            scoreboard[sB].matchResults.push({ opp: sA, myScore: scoreB, oppScore: scoreA, logs });
        }

        // Win/Draw/Loss (skip self-match)
        if (sA !== sB) {
            if (scoreA > scoreB) { scoreboard[sA].wins++; scoreboard[sB].losses++; }
            else if (scoreA < scoreB) { scoreboard[sB].wins++; scoreboard[sA].losses++; }
            else { scoreboard[sA].draws++; scoreboard[sB].draws++; }
        }
    }

    progressBar.style.width = '100%';
    await sleep(300);
    liveView.classList.add('hidden');

    // Sort by total score
    const ranked = selectedKeys.slice().sort((a, b) => scoreboard[b].totalScore - scoreboard[a].totalScore);

    // --- Render Leaderboard ---
    const leaderboard = document.getElementById('tour-leaderboard');
    leaderboard.innerHTML = '';
    ranked.forEach((key, idx) => {
        const data = scoreboard[key];
        const color = STRATEGY_COLORS[key] || '#fff';
        const isTop = idx === 0;
        const total = Math.round(data.totalScore * 100) / 100;
        const wdl = selectedKeys.length > 1 ? `${data.wins}승 ${data.draws}무 ${data.losses}패` : '-';

        leaderboard.innerHTML += `
            <div style="
                display:flex; align-items:center; gap:1rem; flex-wrap:wrap;
                background:${isTop ? 'rgba(255,215,0,0.07)' : 'rgba(0,0,0,0.2)'};
                border:2px solid ${isTop ? 'rgba(255,215,0,0.5)' : color + '33'};
                border-radius:14px; padding:1.2rem 1.5rem; margin-bottom:1rem;
                transform: scale(${isTop ? 1.02 : 1});
                transition: transform 0.3s;
            ">
                <div style="font-size:2rem; min-width:2.5rem; text-align:center;">${MEDAL_EMOJI[idx] || '🔸'}</div>
                <div style="flex:1; min-width:160px;">
                    <div style="font-size:1.15rem; font-weight:700; color:${color}; margin-bottom:0.25rem;">${strategies[key].name}</div>
                    <div style="font-size:0.85rem; color:var(--text-secondary);">${strategies[key].desc}</div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.3rem;">
                    <div style="font-size:1.5rem; font-weight:800; color:${isTop ? '#ffd700' : '#e2e8f0'};">${total}점</div>
                    <div style="font-size:0.85rem; color:var(--text-secondary);">${wdl}</div>
                </div>
            </div>
        `;
    });

    // --- Insight Box ---
    const tftRank = ranked.indexOf('TitForTat');
    const alldRank = ranked.indexOf('AllD');
    const insightEl = document.getElementById('tour-insight');
    let insightHTML = '';

    if (tftRank !== -1 && alldRank !== -1) {
        if (tftRank < alldRank) {
            insightHTML = `
                <h4 style="color:#ffd700; margin-bottom:0.8rem;">🔍 분석: 왜 맞대응 전략이 이겼을까?</h4>
                <p style="color:#e2e8f0; line-height:1.8;">
                    <strong style="color:var(--defect-color);">항상 배신(AllD)</strong>은 1:1 매치에서 유리하지만, 다자간 환경에서는 다른 배신 전략 및 무관용 전략을 만나 계속해서 
                    <strong>최하점(1점씩)</strong>만 주고받으며 자멸합니다.<br><br>
                    반면 <strong style="color:var(--accent-blue);">맞대응(Tit-for-Tat)</strong>은 협력적 상대(호구, 또 다른 맞대응)와 만날 때마다 
                    <strong>상호 협력(3점씩)</strong>으로 큰 점수 파이를 계속 누적합니다.<br><br>
                    🏆 이것이 바로 <strong style="color:#ffd700;">반복 게임의 핵심</strong>입니다. 맞대응은 협력 생태계를 만들어 전체 파이를 키우고, 장기적으로 가장 높은 총점을 달성합니다.
                </p>
            `;
        } else {
            insightHTML = `
                <h4 style="color:#fb923c; margin-bottom:0.8rem;">⚠️ 이번 토너먼트 분석</h4>
                <p style="color:#e2e8f0; line-height:1.8;">
                    이번 설정에서는 항상 배신 전략이 높은 순위를 기록했습니다. 
                    라운드 수가 적거나 협력적 전략이 적을 경우 이런 결과가 나올 수 있습니다.<br><br>
                    💡 <strong>라운드 수를 늘리거나</strong>(예: 100라운드), 협력 전략을 더 많이 포함하면 맞대응 전략의 우수성이 더 잘 드러납니다!
                </p>
            `;
        }
    } else {
        insightHTML = `<p style="color:#e2e8f0;">토너먼트가 완료되었습니다! 총 누적 점수 기준으로 순위가 매겨집니다.</p>`;
    }
    insightEl.innerHTML = insightHTML;

    // --- Match Matrix Table ---
    const table = document.getElementById('tour-matrix-table');
    const thStyle = `style="padding:0.6rem 0.8rem; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); font-size:0.82rem; text-align:center; white-space:nowrap;"`;
    const tdStyle = (bg) => `style="padding:0.6rem 0.8rem; border:1px solid rgba(255,255,255,0.08); text-align:center; font-size:0.85rem; background:${bg};"`;

    let tableHTML = `<tr><th ${thStyle}></th>`;
    selectedKeys.forEach(k => { tableHTML += `<th ${thStyle} style="color:${STRATEGY_COLORS[k]||'#fff'}; padding:0.6rem 0.8rem; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08);">${strategies[k].name.replace('(', '<br>(')}</th>`; });
    tableHTML += `<th ${thStyle}>합계</th></tr>`;

    selectedKeys.forEach(rowKey => {
        tableHTML += `<tr><td style="padding:0.6rem 0.8rem; border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.4); font-weight:700; color:${STRATEGY_COLORS[rowKey]||'#fff'}; white-space:nowrap;">${strategies[rowKey].name}</td>`;
        selectedKeys.forEach(colKey => {
            if (rowKey === colKey) {
                const selfMatch = scoreboard[rowKey].matchResults.find(r => r.opp === rowKey);
                if (selfMatch) {
                    tableHTML += `<td ${tdStyle('rgba(255,255,255,0.04)')}><span style="color:#a0aec0;">${selfMatch.myScore}</span></td>`;
                } else {
                    tableHTML += `<td ${tdStyle('rgba(255,255,255,0.04)')}><span style="color:#555;">—</span></td>`;
                }
            } else {
                const match = scoreboard[rowKey].matchResults.find(r => r.opp === colKey);
                if (match) {
                    const won = match.myScore > match.oppScore;
                    const lost = match.myScore < match.oppScore;
                    const bg = won ? 'rgba(74,222,128,0.1)' : lost ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)';
                    const scoreColor = won ? 'var(--cooperate-color)' : lost ? 'var(--defect-color)' : '#e2e8f0';
                    tableHTML += `<td ${tdStyle(bg)}><span style="color:${scoreColor}; font-weight:${won?700:400};">${Math.round(match.myScore*100)/100}</span></td>`;
                } else {
                    tableHTML += `<td ${tdStyle('rgba(0,0,0,0.1)')}><span style="color:#555;">—</span></td>`;
                }
            }
        });
        const total = Math.round(scoreboard[rowKey].totalScore * 100) / 100;
        tableHTML += `<td style="padding:0.6rem 0.8rem; border:1px solid rgba(255,255,255,0.08); background:rgba(255,215,0,0.07); font-weight:800; color:#ffd700;">${total}</td></tr>`;
    });
    table.innerHTML = tableHTML;

    // --- Individual Match Logs (collapsed) ---
    const matchLogsEl = document.getElementById('tour-match-logs');
    matchLogsEl.innerHTML = '';

    matchups.forEach(([sA, sB]) => {
        const [scoreA, scoreB] = [
            scoreboard[sA].matchResults.find(r => r.opp === sB)?.myScore ?? 0,
            scoreboard[sB].matchResults.find(r => r.opp === sA)?.myScore ?? scoreA
        ];
        const winner = sA === sB ? null : (scoreA > scoreB ? sA : scoreA < scoreB ? sB : null);
        const isDraw = sA !== sB && scoreA === scoreB;

        const card = document.createElement('details');
        card.style.cssText = 'background:rgba(0,0,0,0.2); border-radius:10px; border:1px solid rgba(255,255,255,0.08); overflow:hidden;';
        card.innerHTML = `
            <summary style="padding:1rem 1.2rem; cursor:pointer; display:flex; align-items:center; gap:0.8rem; flex-wrap:wrap; list-style:none; outline:none;">
                <span style="color:${STRATEGY_COLORS[sA]}; font-weight:700;">${strategies[sA].name}</span>
                <span style="color:#94a3b8;">${Math.round((scoreboard[sA].matchResults.find(r => r.opp === sB)?.myScore ?? 0)*100)/100}점</span>
                <span style="color:#64748b; font-size:1.2rem;">vs</span>
                <span style="color:${STRATEGY_COLORS[sB]}; font-weight:700;">${strategies[sB].name}</span>
                <span style="color:#94a3b8;">${Math.round((sA === sB ? scoreboard[sB].matchResults.find(r => r.opp === sA)?.myScore ?? 0 : scoreboard[sB].matchResults.find(r => r.opp === sA)?.myScore ?? 0)*100)/100}점</span>
                <span style="margin-left:auto; font-size:0.85rem; color:${isDraw ? '#94a3b8' : winner ? STRATEGY_COLORS[winner] : '#94a3b8'};">
                    ${isDraw ? '🤝 무승부' : winner ? `🏆 ${strategies[winner].name} 승리` : '🪞 자기 대결'}
                </span>
                <span style="color:#64748b; font-size:0.75rem;">▶ 상세 보기</span>
            </summary>
            <div style="padding:0.5rem 1rem 1rem; max-height:250px; overflow-y:auto;" class="match-detail-log-${sA}-${sB}"></div>
        `;

        // Populate round log on open
        card.addEventListener('toggle', () => {
            if (!card.open) return;
            const logEl = card.querySelector(`.match-detail-log-${sA}-${sB}`);
            if (logEl.dataset.populated) return;
            logEl.dataset.populated = 'true';

            const matchResult = scoreboard[sA].matchResults.find(r => r.opp === sB);
            if (!matchResult || !matchResult.logs) return;

            matchResult.logs.forEach(entry => {
                const row = document.createElement('div');
                row.className = 'log-entry';
                if (entry.outcomeKey === 'CC') row.classList.add('both-c');
                else if (entry.outcomeKey === 'DD') row.classList.add('both-d');
                else if (entry.outcomeKey === 'DC') row.classList.add('user-exploits');
                else if (entry.outcomeKey === 'CD') row.classList.add('ai-exploits');

                row.innerHTML = `
                    <div class="log-round" style="width:45px;">R${entry.round}</div>
                    <div class="log-choices">
                        <span class="choice ${entry.choiceA === 'C' ? 'c' : 'd'}">${strategies[sA].name.split('(')[0].trim().substring(0,4)}: ${entry.choiceA === 'C' ? '협력' : '배신'}</span>
                        <span class="choice ${entry.choiceB === 'C' ? 'c' : 'd'}">${strategies[sB].name.split('(')[0].trim().substring(0,4)}: ${entry.choiceB === 'C' ? '협력' : '배신'}</span>
                    </div>
                    <div class="log-scores" style="width:130px;">
                        <span class="round-score ${entry.earnA > 0 ? 'plus' : 'zero'}">+${entry.earnA}</span>
                        <span>/</span>
                        <span class="round-score ${entry.earnB > 0 ? 'plus' : 'zero'}">+${entry.earnB}</span>
                    </div>
                `;
                logEl.appendChild(row);
            });
        });

        matchLogsEl.appendChild(card);
    });

    tourResults.classList.remove('hidden');
    btn.textContent = '🔄 다시 토너먼트 실행';
    btn.disabled = false;

    // Scroll to results
    tourResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

