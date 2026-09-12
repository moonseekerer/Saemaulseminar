// sim_engine.js - Stanford Generative Agents Memory Stream & Retrieval Engine

class MemoryStream {
    constructor(agentId) {
        this.agentId = agentId;
        this.records = []; // [{ id, time, type: 'obs'|'dial'|'ref', text, importance, target }]
    }

    add(time, type, text, importance = 5, target = null) {
        this.records.push({
            id: this.records.length + 1,
            time,
            type,
            text,
            importance,
            target
        });
    }

    // Retrieval: Recency + Importance + Relevance
    retrieve(currTime, queryTargetId, topK = 3) {
        if (this.records.length === 0) return [];

        const scored = this.records.map(rec => {
            // Recency decay: 0.995 ^ (delta hours * 10)
            const deltaH = Math.max(0, currTime - rec.time);
            const recency = Math.pow(0.95, deltaH);

            // Importance: normalized 0 ~ 1
            const importance = (rec.importance || 5) / 10.0;

            // Relevance: target match bonus
            let relevance = 0.2;
            if (rec.target === queryTargetId) relevance = 1.0;
            else if (rec.text.includes(queryTargetId)) relevance = 0.8;

            const score = 0.3 * recency + 0.3 * importance + 0.4 * relevance;
            return { ...rec, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK);
    }
}

// 12인 고유 초기 기억 (Seed Memories)
const INITIAL_MEMORIES = {
    agent_kim: [
        { text: "군청 수로 정비 사업비 5억 원 지원이 확정되었으나 마을 자부담 20% 분담금 합의가 시급하다.", importance: 9, target: "town" },
        { text: "정노인과 어르신들이 관행 수로 방식을 고집해 청년 스마트팜 도입에 반대할까 염려스럽다.", importance: 7, target: "agent_jung" },
        { text: "오상회 구판장에서 주민들의 솔직한 여론을 먼저 떠보고자 한다.", importance: 6, target: "agent_oh" }
    ],
    agent_park: [
        { text: "청년 창업가 강수연과 협력하여 사과 가공 젤리를 부녀회 로컬장터에서 판매할 계획이다.", importance: 8, target: "agent_kang" },
        { text: "마을 내 외지인과 원주민 간의 오해를 풀고 공동체 화합을 이끌어야 한다.", importance: 8, target: "town" },
        { text: "오상회 구판장은 마을 어르신들이 모이는 정보의 핵심 사랑방이다.", importance: 6, target: "agent_oh" }
    ],
    agent_jung: [
        { text: "수십 년간 농사지어 온 다랭이논에 용수가 부족해지면 올해 벼농사는 끝장이다.", importance: 9, target: "town" },
        { text: "스마트팜이니 뭐니 하는 청년들이 지하수를 독점해 논물이 마르는 것은 아닌지 의심스럽다.", importance: 8, target: "agent_lee" },
        { text: "귀농 초보 조민우가 예의 바르게 농사 기술을 물어오면 기꺼이 가르쳐줄 용의가 있다.", importance: 6, target: "agent_cho" }
    ],
    agent_choi: [
        { text: "마을회관 창고 농기계 관리와 오후 수로 총회 실무 준비를 도맡아야 한다.", importance: 7, target: "agent_kim" },
        { text: "스마트온실 이지훈과 정노인 어르신 사이에서 현실적인 타협안을 조율하고자 한다.", importance: 8, target: "agent_lee" },
        { text: "축사 악취 민원이 총회에서 터져 나오지 않도록 윤축산과 사전 교감이 필요하다.", importance: 7, target: "agent_yoon" }
    ],
    agent_lee: [
        { text: "ICT 연동 스마트 관수 센서 데이터를 보면 전통 수로의 누수율이 40%에 달한다.", importance: 9, target: "town" },
        { text: "단순 콘크리트 수로 개보수보다 지능형 압력 관수 파이프라인 매설이 훨씬 경제적이다.", importance: 8, target: "agent_kim" },
        { text: "정노인 어르신에게 스마트 관수 기술이 논농사에도 유리함을 입증해야 한다.", importance: 8, target: "agent_jung" }
    ],
    agent_kang: [
        { text: "로컬 청년 공방에서 만든 특산물 가공품을 마을 구판장과 온라인에 입점시키는 것이 목표다.", importance: 8, target: "agent_oh" },
        { text: "부녀회장님의 신뢰를 얻어야 마을 어르신들의 텃세를 극복하고 판로를 열 수 있다.", importance: 9, target: "agent_park" },
        { text: "한유진 디자이너에게 카페 로고와 패키지 디자인 의뢰를 부탁했다.", importance: 6, target: "agent_han" }
    ],
    agent_cho: [
        { text: "귀농 첫해라 벼 도열병과 물꼬 잡는 법을 몰라 정노인 어르신의 도움이 절실하다.", importance: 9, target: "agent_jung" },
        { text: "스마트팜 이지훈 대표에게 청년 창업 지원금 수령 절차를 자문받고 싶다.", importance: 7, target: "agent_lee" },
        { text: "친환경 유기농 쌀로 지역사회에 건강한 농산물을 공급하고 싶다.", importance: 6, target: "town" }
    ],
    agent_han: [
        { text: "조용한 시골에서 프리랜서 디자인 업무를 하며 프라이버시를 지키고 싶다.", importance: 7, target: "town" },
        { text: "강수연 대표의 로컬푸드 브랜드 패키지 디자인 작업 마감이 임박했다.", importance: 8, target: "agent_kang" },
        { text: "마을 총회 갈등이 어떻게 전개되는지 관찰하는 것이 꽤 흥미롭다.", importance: 5, target: "town" }
    ],
    agent_oh: [
        { text: "마을 외상 장부 수금도 중요하지만, 수로 공사로 도로가 파헤쳐지면 구판장 손님이 줄까 걱정이다.", importance: 8, target: "agent_kim" },
        { text: "청년들의 로컬 가공품을 구판장에 위탁 판매하면 수수료 수입이 쏠쏠할 것 같다.", importance: 7, target: "agent_kang" },
        { text: "동네 모든 소문은 내 평상을 거쳐 가므로 정보를 쥐고 거래를 조율해야 한다.", importance: 7, target: "town" }
    ],
    agent_lin: [
        { text: "성실하게 복합 시설 채소를 가꾸어 구판장과 공방에 신선한 농산물을 납품하고자 한다.", importance: 8, target: "agent_oh" },
        { text: "부녀회 봉사활동에 꾸준히 참여해 마을 주민들과 진정한 가족이 되고 싶다.", importance: 8, target: "agent_park" },
        { text: "수로 공사 시 우리 하우스 쪽 지선 관로도 함께 연결되기를 간절히 바란다.", importance: 7, target: "town" }
    ],
    agent_yoon: [
        { text: "마을 사람들이 축사 냄새로 민원을 넣지만, 이번 수로 공사에 정화조 배수로가 빠지면 결코 찬성할 수 없다.", importance: 9, target: "agent_kim" },
        { text: "총무 최씨가 내 입장을 마을회관에 잘 전달해주길 기대하고 있다.", importance: 7, target: "agent_choi" },
        { text: "사료값 인상으로 축산 농가 유지가 갈수록 벅차다.", importance: 6, target: "town" }
    ],
    agent_bae: [
        { text: "산비탈 사과 과수원은 해발고도가 높아 물이 끝까지 올라오지 않아 가뭄 때마다 큰 피해를 본다.", importance: 9, target: "town" },
        { text: "평야 논에만 물을 대는 식의 공사라면 자부담 분담금을 단 한 푼도 낼 수 없다.", importance: 9, target: "agent_kim" },
        { text: "수원지 상류 관정 밸브 개방 여부를 매일 아침 직접 확인해야 직성이 풀린다.", importance: 8, target: "town" }
    ]
};

class VillageSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cols = MAP_CONFIG.cols;
        this.rows = MAP_CONFIG.rows;
        this.tileSize = MAP_CONFIG.tileSize;
        this.worldWidth = MAP_CONFIG.worldWidth;
        this.worldHeight = MAP_CONFIG.worldHeight;

        this.camera = {
            x: 1600 - this.canvas.width / 2,
            y: 1200 - this.canvas.height / 2,
            zoom: 0.8,
            minZoom: 0.35,
            maxZoom: 2.0,
            trackingAgentId: null
        };

        this.charImages = {};
        this.tilesLoaded = false;
        this.loadAssets();

        this.gameHour = 8.0;
        this.speed = 1.0;
        this.isPaused = false;
        this.isReplayMode = false;
        
        this.history = [];
        this.currentFrameIdx = 0;

        // Pair Dialogue Cooldown Map: { 'agent_kim-agent_park': lastSpokenGameHour }
        this.cooldownMap = {};

        // Active Agents with MemoryStream
        this.agents = AGENTS_ROSTER.map(a => {
            const memStream = new MemoryStream(a.id);
            // Seed initial memories
            const seeds = INITIAL_MEMORIES[a.id] || [];
            seeds.forEach(s => memStream.add(7.5, 'obs', s.text, s.importance, s.target));

            return {
                ...a,
                memory: memStream,
                currX: a.homePos.x,
                currY: a.homePos.y,
                targetX: a.workPos.x,
                targetY: a.workPos.y,
                dir: 'down',
                frame: 0,
                status: '이동 중',
                currAction: '일과 시작',
                speech: '',
                isConversing: false
            };
        });

        this.networkMatrix = {};
        this.agents.forEach(a1 => {
            this.agents.forEach(a2 => {
                if (a1.id !== a2.id) {
                    const key = [a1.id, a2.id].sort().join('-');
                    this.networkMatrix[key] = 0;
                }
            });
        });

        this.logs = [];
        this.lastTick = performance.now();
        this.animationId = null;

        this.bindEvents();
    }

    loadAssets() {
        let loadedCount = 0;
        const total = AGENTS_ROSTER.length;
        AGENTS_ROSTER.forEach(agent => {
            const img = new Image();
            img.src = `assets/characters/${agent.sprite}`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === total) this.tilesLoaded = true;
            };
            this.charImages[agent.id] = img;
        });
    }

    bindEvents() {
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            this.camera.trackingAgentId = null;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = (e.clientX - lastX) / this.camera.zoom;
            const dy = (e.clientY - lastY) / this.camera.zoom;
            this.camera.x -= dx;
            this.camera.y -= dy;
            lastX = e.clientX;
            lastY = e.clientY;
            this.clampCamera();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const prevZoom = this.camera.zoom;
            const zoomDelta = e.deltaY < 0 ? 1.15 : 0.87;
            let nextZoom = prevZoom * zoomDelta;
            nextZoom = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, nextZoom));

            const worldMouseX = this.camera.x + mouseX / prevZoom;
            const worldMouseY = this.camera.y + mouseY / prevZoom;

            this.camera.zoom = nextZoom;
            this.camera.x = worldMouseX - mouseX / nextZoom;
            this.camera.y = worldMouseY - mouseY / nextZoom;
            this.clampCamera();
        }, { passive: false });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = this.camera.x + (e.clientX - rect.left) / this.camera.zoom;
            const clickY = this.camera.y + (e.clientY - rect.top) / this.camera.zoom;

            const clicked = this.agents.find(a => {
                const ax = a.currX * this.tileSize;
                const ay = a.currY * this.tileSize;
                return Math.hypot(clickX - (ax + 16), clickY - (ay + 16)) < 28;
            });

            if (clicked) {
                this.camera.trackingAgentId = clicked.id;
                const selectElem = document.getElementById('agentTracker');
                if (selectElem) selectElem.value = clicked.id;
                this.addLog(`${clicked.name} 추적 카메라를 활성화했습니다.`);
                this.showAgentMemoryDetail(clicked);
            }
        });
    }

    showAgentMemoryDetail(agent) {
        const topMems = agent.memory.records.slice(-4).reverse();
        const memText = topMems.map(m => `• [${m.type === 'dial' ? '대화' : '성찰'}] ${m.text}`).join('\n');
        this.addLog(`[${agent.name} 인지 상태]\n${memText}`);
    }

    clampCamera() {
        const viewW = this.canvas.width / this.camera.zoom;
        const viewH = this.canvas.height / this.camera.zoom;
        this.camera.x = Math.max(0, Math.min(this.worldWidth - viewW, this.camera.x));
        this.camera.y = Math.max(0, Math.min(this.worldHeight - viewH, this.camera.y));
    }

    start() {
        const loop = (now) => {
            const dt = (now - this.lastTick) / 1000;
            this.lastTick = now;

            if (!this.isPaused) {
                if (!this.isReplayMode) {
                    this.update(dt);
                    this.recordFrame();
                }
            }

            if (this.camera.trackingAgentId) {
                const target = this.agents.find(a => a.id === this.camera.trackingAgentId);
                if (target) {
                    const tx = target.currX * this.tileSize + 16 - (this.canvas.width / 2) / this.camera.zoom;
                    const ty = target.currY * this.tileSize + 16 - (this.canvas.height / 2) / this.camera.zoom;
                    this.camera.x += (tx - this.camera.x) * 0.1;
                    this.camera.y += (ty - this.camera.y) * 0.1;
                    this.clampCamera();
                }
            }

            this.render();
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }

    update(dt) {
        this.gameHour += (dt * 0.05 * this.speed);
        if (this.gameHour >= 18.0) {
            this.gameHour = 18.0;
            this.isPaused = true;
            this.addLog('마을 공식 일과(18:00)가 종료되었습니다. 리플레이 슬라이더로 되돌려볼 수 있습니다.');
        }

        this.agents.forEach(agent => {
            const task = [...agent.schedule].reverse().find(s => s.time <= this.gameHour);
            if (task) {
                agent.targetX = task.x;
                agent.targetY = task.y;
                agent.currAction = task.action;
            }

            // If conversing, pause movement temporarily
            if (agent.isConversing) {
                agent.status = '대화 중';
                agent.frame = 0;
                return;
            }

            const dx = agent.targetX - agent.currX;
            const dy = agent.targetY - agent.currY;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.15) {
                agent.status = '이동 중';
                const moveDist = Math.min(dist, dt * 2.8 * this.speed);
                agent.currX += (dx / dist) * moveDist;
                agent.currY += (dy / dist) * moveDist;

                if (Math.abs(dx) > Math.abs(dy)) {
                    agent.dir = dx > 0 ? 'right' : 'left';
                } else {
                    agent.dir = dy > 0 ? 'down' : 'up';
                }
                agent.frame = (agent.frame + dt * 5 * this.speed) % 3;
            } else {
                agent.status = '활동 중';
                agent.frame = 0;
            }
        });

        this.checkInteractions();
    }

    checkInteractions() {
        for (let i = 0; i < this.agents.length; i++) {
            for (let j = i + 1; j < this.agents.length; j++) {
                const a1 = this.agents[i];
                const a2 = this.agents[j];

                if (a1.isConversing || a2.isConversing) continue;

                const d = Math.hypot(a1.currX - a2.currX, a1.currY - a2.currY);

                // Proximity distance within 2.2 tiles
                if (d < 2.2) {
                    const pairKey = [a1.id, a2.id].sort().join('-');
                    const lastSpoken = this.cooldownMap[pairKey] || 0;

                    // Cooldown check: at least 1.0 game hour (approx 20 seconds at 1x speed)
                    if (this.gameHour - lastSpoken >= 1.0) {
                        this.triggerDialogue(a1, a2, pairKey);
                    }
                }
            }
        }
    }

    triggerDialogue(a1, a2, pairKey) {
        this.cooldownMap[pairKey] = this.gameHour;

        // Retrieve relevant memories
        const memA = a1.memory.retrieve(this.gameHour, a2.id, 2);
        const memB = a2.memory.retrieve(this.gameHour, a1.id, 2);

        // Generate contextual dialogue based on roles and retrieved memory
        const { textA, textB } = this.generateContextualUtterance(a1, a2, memA, memB);

        a1.speech = textA;
        a2.speech = textB;
        a1.isConversing = true;
        a2.isConversing = true;

        // Face each other
        if (a1.currX < a2.currX) { a1.dir = 'right'; a2.dir = 'left'; }
        else { a1.dir = 'left'; a2.dir = 'right'; }

        // Store new dialogue into both memory streams (Stanford Architecture)
        a1.memory.add(this.gameHour, 'dial', `${a2.name}에게 "${textA}"라고 말했고, "${textB}"라는 답변을 들었다.`, 7, a2.id);
        a2.memory.add(this.gameHour, 'dial', `${a1.name}에게 "${textA}"라는 말을 듣고, "${textB}"라고 응답했다.`, 7, a1.id);

        const timeStr = this.getFormattedTime();
        this.logs.unshift({ time: timeStr, from: a1.name, to: a2.name, msg: textA });
        this.logs.unshift({ time: timeStr, from: a2.name, to: a1.name, msg: textB });

        this.networkMatrix[pairKey] = (this.networkMatrix[pairKey] || 0) + 1;

        if (window.updateNetworkGraph) window.updateNetworkGraph(this.networkMatrix);
        if (window.updateLogsUI) window.updateLogsUI(this.logs);

        setTimeout(() => {
            a1.speech = '';
            a2.speech = '';
            a1.isConversing = false;
            a2.isConversing = false;
        }, 5000);
    }

    generateContextualUtterance(a1, a2, memA, memB) {
        // Specific contextual pairings
        const pKey = [a1.id, a2.id].sort().join('-');

        if (pKey === 'agent_kim-agent_park') {
            return {
                textA: "박 회장, 오후 회관 총회 때 부녀회 쪽에서도 수로 분담금 안건에 힘을 좀 실어주시오.",
                textB: "이장님, 청년 가공공방 지원과 연계된다면 부녀회원들도 적극 찬성할 분위기입니다."
            };
        }
        if (pKey === 'agent_jung-agent_lee') {
            return {
                textA: "이 대표, 자네 온실에서 지하수 많이 뽑아 쓰면 아래쪽 논 물길이 마르는 건 알고 있나?",
                textB: "어르신, 저희는 빗물 재활용과 정밀 센서를 써서 일반 관수보다 물을 40% 덜 씁니다."
            };
        }
        if (pKey === 'agent_bae-agent_kim') {
            return {
                textA: "이장님, 산비탈 과수원까지 관수 파이프가 안 오면 자부담 분담금 낼 이유가 전혀 없습니다.",
                textB: "배 대표, 이번 군청 설계에 고지대 가압 펌프 예산도 포함되어 있으니 총회에서 확인하시오."
            };
        }
        if (pKey === 'agent_cho-agent_jung') {
            return {
                textA: "어르신, 친환경 논에 우렁이를 넣었는데 물높이를 어느 정도로 맞춰야 할지 여쭙고 싶습니다.",
                textB: "물꼬는 손가락 두 마디 높이로 잔잔하게 유지해야 풀이 안 올라오네. 오후에 내가 한번 봐주마."
            };
        }
        if (pKey === 'agent_kang-agent_oh') {
            return {
                textA: "점주님, 공방에서 생산한 사과 잼 시제품인데 구판장 매대 한편에 놓아주실 수 있을까요?",
                textB: "포장이 깔끔하네. 외지 관광객들도 자주 찾으니 평상 옆 눈에 잘 띄는 곳에 두세."
            };
        }
        if (pKey === 'agent_choi-agent_yoon') {
            return {
                textA: "윤 대표님, 오늘 총회에서 정화조 배수로 지원 건 공식 건의할 테니 감정 상하지 마십시오.",
                textB: "최 총무 말만 믿겠네. 축산 농가도 마을 구성원인데 악취 민원만 받으면 억울하지."
            };
        }
        if (pKey === 'agent_han-agent_kang') {
            return {
                textA: "강 대표님, 의뢰하신 로컬 농산물 패키지 폰트 시안 나왔는데 카페에서 확인해보시겠어요?",
                textB: "고맙습니다 한 디자이너님! 덕분에 이번 로컬푸드 박람회 출품 준비가 순조롭습니다."
            };
        }
        if (pKey === 'agent_lin-agent_park') {
            return {
                textA: "회장님, 이번 회관 김장 나눔 행사 때 제가 하우스에서 키운 특용 배추도 함께 보태겠습니다.",
                textB: "린 새댁, 매번 마을 일에 앞장서줘서 고마워요. 이따 회관에서 차 한잔 같이해요."
            };
        }

        // Generic fallback using memory context
        const subject = memA[0] ? memA[0].text.slice(0, 18) + '...' : '마을 현안';
        return {
            textA: `${a2.name}님, ${subject} 관련해서 어떻게 생각하시는지요?`,
            textB: `${a1.name}님, 저 역시 그 문제에 깊은 관심을 두고 있으며 이번 총회에서 입장을 밝히겠습니다.`
        };
    }

    recordFrame() {
        this.history.push({
            time: this.gameHour,
            agents: this.agents.map(a => ({
                id: a.id,
                x: a.currX,
                y: a.currY,
                dir: a.dir,
                frame: a.frame,
                action: a.currAction,
                speech: a.speech
            }))
        });
        if (window.updateTimelineSlider) {
            window.updateTimelineSlider(this.history.length - 1, this.history.length);
        }
    }

    seekReplay(frameIdx) {
        if (frameIdx < 0 || frameIdx >= this.history.length) return;
        this.isReplayMode = true;
        this.isPaused = true;
        this.currentFrameIdx = frameIdx;

        const frame = this.history[frameIdx];
        this.gameHour = frame.time;

        frame.agents.forEach(saved => {
            const ag = this.agents.find(a => a.id === saved.id);
            if (ag) {
                ag.currX = saved.x;
                ag.currY = saved.y;
                ag.dir = saved.dir;
                ag.frame = saved.frame;
                ag.currAction = saved.action;
                ag.speech = saved.speech;
            }
        });
        this.render();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        this.renderTerrain(ctx);
        this.renderZones(ctx);
        this.renderAgents(ctx);

        ctx.restore();

        this.renderHUD(ctx);
    }

    renderTerrain(ctx) {
        const ts = this.tileSize;
        const startCol = Math.max(0, Math.floor(this.camera.x / ts));
        const endCol = Math.min(this.cols, Math.ceil((this.camera.x + this.canvas.width / this.camera.zoom) / ts));
        const startRow = Math.max(0, Math.floor(this.camera.y / ts));
        const endRow = Math.min(this.rows, Math.ceil((this.camera.y + this.canvas.height / this.camera.zoom) / ts));

        for (let r = startRow; r < endRow; r++) {
            for (let c = startCol; c < endCol; c++) {
                const type = VILLAGE_GRID[r][c];
                if (type === 0) {
                    ctx.fillStyle = (r + c) % 2 === 0 ? '#689f38' : '#7cb342';
                } else if (type === 1) {
                    ctx.fillStyle = '#bcaaa4';
                } else if (type === 2) {
                    ctx.fillStyle = '#0288d1';
                } else if (type === 3) {
                    ctx.fillStyle = '#9ccc65';
                }
                ctx.fillRect(c * ts, r * ts, ts, ts);
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
                ctx.strokeRect(c * ts, r * ts, ts, ts);
            }
        }
    }

    renderZones(ctx) {
        const ts = this.tileSize;
        VILLAGE_ZONES.forEach(zone => {
            const zx = zone.x * ts;
            const zy = zone.y * ts;
            const zw = zone.w * ts;
            const zh = zone.h * ts;

            ctx.fillStyle = zone.color + '26';
            ctx.fillRect(zx, zy, zw, zh);

            ctx.strokeStyle = zone.accent || zone.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(zx, zy, zw, zh);

            ctx.fillStyle = 'rgba(18, 22, 31, 0.88)';
            ctx.fillRect(zx + 6, zy + 6, zw - 12, 26);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(zone.name, zx + zw / 2, zy + 24);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.font = '11px Pretendard, sans-serif';
            ctx.fillText(zone.subtitle, zx + zw / 2, zy + zh - 8);
        });
    }

    renderAgents(ctx) {
        const ts = this.tileSize;
        const dirOffsets = { 'down': 0, 'left': 1, 'right': 2, 'up': 3 };

        this.agents.forEach(agent => {
            const px = agent.currX * ts;
            const py = agent.currY * ts;

            const img = this.charImages[agent.id];
            if (img && img.complete && img.naturalWidth > 0) {
                const colIdx = Math.floor(agent.frame) % 3;
                const rowIdx = dirOffsets[agent.dir] || 0;
                const sw = img.naturalWidth / 3;
                const sh = img.naturalHeight / 4;

                ctx.drawImage(img, colIdx * sw, rowIdx * sh, sw, sh, px - 6, py - 16, 44, 48);
            } else {
                ctx.beginPath();
                ctx.arc(px + 16, py + 16, 14, 0, Math.PI * 2);
                ctx.fillStyle = agent.color;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            if (this.camera.trackingAgentId === agent.id) {
                ctx.strokeStyle = '#63b3ed';
                ctx.lineWidth = 2;
                ctx.strokeRect(px - 10, py - 20, 52, 56);
            }

            // Name Tag
            ctx.fillStyle = 'rgba(18, 22, 31, 0.85)';
            const tagW = ctx.measureText(agent.name).width + 12;
            ctx.fillRect(px + 16 - tagW / 2, py - 24, tagW, 16);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(agent.name, px + 16, py - 12);

            // Speech Bubble
            if (agent.speech) {
                this.renderSpeechBubble(ctx, px + 16, py - 30, agent.speech);
            }
        });
    }

    renderSpeechBubble(ctx, x, y, text) {
        ctx.font = '12px Pretendard, sans-serif';
        const metrics = ctx.measureText(text);
        const bw = Math.min(280, metrics.width + 20);
        const bh = 28;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(x - bw / 2, y - bh - 6, bw, bh, 4);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 6, y - 6);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 6, y - 6);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText(text.length > 25 ? text.slice(0, 23) + '...' : text, x, y - 16);
    }

    renderHUD(ctx) {
        ctx.fillStyle = 'rgba(18, 22, 31, 0.9)';
        ctx.fillRect(14, 14, 260, 48);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 1;
        ctx.strokeRect(14, 14, 260, 48);

        ctx.fillStyle = '#63b3ed';
        ctx.font = 'bold 14px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`마을 시각: ${this.getFormattedTime()}`, 26, 36);

        ctx.fillStyle = '#a0aec0';
        ctx.font = '11px Pretendard, sans-serif';
        const zoomPct = Math.round(this.camera.zoom * 100);
        ctx.fillText(`배속: ${this.speed}x | 줌: ${zoomPct}% | 주민 클릭 시 인지 상태 조회`, 26, 52);
    }

    getFormattedTime() {
        const h = Math.floor(this.gameHour);
        const m = Math.floor((this.gameHour - h) * 60);
        const hh = h < 10 ? '0' + h : h;
        const mm = m < 10 ? '0' + m : m;
        return `${hh}:${mm}`;
    }

    addLog(msg) {
        this.logs.unshift({ time: this.getFormattedTime(), from: '시스템', to: '전체', msg });
        if (window.updateLogsUI) window.updateLogsUI(this.logs);
    }

    exportHistoryJSON() {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.history));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `saemaul_simulation_memories_${Date.now()}.json`;
        a.click();
    }
}
