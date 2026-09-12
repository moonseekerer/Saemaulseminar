// sim_engine.js - Emergent Autonomous Multi-Agent Simulation Engine (No hardcoded scripts)

class MemoryStream {
    constructor(agentId) {
        this.agentId = agentId;
        this.records = []; // [{ id, time, type, text, importance, target }]
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

    retrieve(currTime, queryTargetId, topK = 3) {
        if (this.records.length === 0) return [];
        const scored = this.records.map(rec => {
            const deltaH = Math.max(0, currTime - rec.time);
            const recency = Math.pow(0.95, deltaH);
            const importance = (rec.importance || 5) / 10.0;
            let relevance = 0.2;
            if (rec.target === queryTargetId) relevance = 1.0;
            else if (rec.text.includes(queryTargetId)) relevance = 0.7;

            return { ...rec, score: 0.3 * recency + 0.3 * importance + 0.4 * relevance };
        });
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK);
    }
}

// 12인의 내면 페르소나 및 핵심 관심사 (Core Drives & Traits)
const AGENT_COGNITION_PROFILES = {
    agent_kim: {
        desire: "마을 사업 성사 및 리더십 유지",
        stanceOnWater: "균등 분담 및 사업비 확보 우선",
        trustThreshold: 0.6,
        concerns: ["자부담금 확보", "총회 파행 방지", "군청 기한 준수"]
    },
    agent_park: {
        desire: "마을 화합 및 부녀회 공동 수익",
        stanceOnWater: "상생 타협 및 로컬 장터 연계",
        trustThreshold: 0.7,
        concerns: ["어르신-청년 소통", "판로 확보", "김장 행사"]
    },
    agent_jung: {
        desire: "전통 논 벼 수확 보전 및 기득권 수호",
        stanceOnWater: "전통 관개 용수 우선 보장",
        trustThreshold: 0.3,
        concerns: ["논 물마름", "외지인 지하수 낭비", "관행 유지"]
    },
    agent_choi: {
        desire: "원만한 실무 집행 및 민원 조기 수습",
        stanceOnWater: "현실적 타협안 및 절충",
        trustThreshold: 0.5,
        concerns: ["축사 악취 민원", "총회 진행", "기계 점검"]
    },
    agent_lee: {
        desire: "스마트 농업 확대 및 물 이용 효율화",
        stanceOnWater: "데이터 기반 스마트 관수 전환",
        trustThreshold: 0.6,
        concerns: ["수로 누수율 40%", "온실 전력/센서", "영농비 절감"]
    },
    agent_kang: {
        desire: "청년 가공 창업 성공 및 판로 개척",
        stanceOnWater: "마을 기금 조성을 통한 갈등 완화",
        trustThreshold: 0.7,
        concerns: ["사과잼 납품처", "어르신 시선", "온라인 판매"]
    },
    agent_cho: {
        desire: "초보 영농 정착 및 친환경 벼농사 성공",
        stanceOnWater: "안정적 용수 공급 및 선도농가 조언",
        trustThreshold: 0.5,
        concerns: ["병충해", "물꼬 높이", "초기 자금 부족"]
    },
    agent_han: {
        desire: "조용한 작업 환경 및 마을 디자인 참여",
        stanceOnWater: "합리적 공론화 관망",
        trustThreshold: 0.4,
        concerns: ["원격 마감", "소음", "마을 브랜드 가치"]
    },
    agent_oh: {
        desire: "구판장 매출 증대 및 외상값 회수",
        stanceOnWater: "공사로 인한 도로 통행 차단 반대",
        trustThreshold: 0.5,
        concerns: ["평상 손님 유지", "외상 장부", "수수료 수익"]
    },
    agent_lin: {
        desire: "안정적 시설 채소 영농 및 지역사회 융합",
        stanceOnWater: "하우스 지선 관로 연결",
        trustThreshold: 0.6,
        concerns: ["가족 생계", "용수 배분 차별", "채소 신선도"]
    },
    agent_yoon: {
        desire: "축산 농가 생존 및 악취 민원 해소",
        stanceOnWater: "정화조 배수로 공사 동시 시행 필수",
        trustThreshold: 0.3,
        concerns: ["사료값 상승", "민원 성토", "배수로 배제"]
    },
    agent_bae: {
        desire: "산비탈 과수원 용수 확보 및 낙과 방지",
        stanceOnWater: "고지대 가압 펌프 없이는 결사 반대",
        trustThreshold: 0.3,
        concerns: ["가뭄 고사", "평야 논 편중", "과수원 폐원 위기"]
    }
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

        // Dynamic State Tracker: { pairKey: { count, trustScore: -5 ~ +5, lastSpoken } }
        this.socialGraph = {};

        // Cooldown between conversations
        this.cooldownMap = {};

        // Initialize Agents with Autonomy
        this.agents = AGENTS_ROSTER.map(a => {
            const memStream = new MemoryStream(a.id);
            const prof = AGENT_COGNITION_PROFILES[a.id] || {};

            // Initial seed observations (자연어 기억)
            memStream.add(7.5, 'obs', `${a.name}의 주 관심사: ${prof.desire}`, 8, 'self');
            memStream.add(7.6, 'obs', `용수 문제에 대한 입장: ${prof.stanceOnWater}`, 8, 'water');

            return {
                ...a,
                memory: memStream,
                cognition: prof,
                trustIndex: 0, // Individual overall social trust
                currX: a.homePos.x,
                currY: a.homePos.y,
                targetX: a.workPos.x,
                targetY: a.workPos.y,
                dir: 'down',
                frame: 0,
                status: '이동 중',
                currAction: '일과 시작',
                speech: '',
                isConversing: false,
                autonomousDecisions: 0
            };
        });

        // Initialize Graph pairs
        this.agents.forEach(a1 => {
            this.agents.forEach(a2 => {
                if (a1.id !== a2.id) {
                    const key = [a1.id, a2.id].sort().join('-');
                    if (!this.socialGraph[key]) {
                        this.socialGraph[key] = { count: 0, trust: 0, sentiment: '중립' };
                    }
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
                return Math.hypot(clickX - (ax + 16), clickY - (ay + 16)) < 30;
            });

            if (clicked) {
                this.camera.trackingAgentId = clicked.id;
                const selectElem = document.getElementById('agentTracker');
                if (selectElem) selectElem.value = clicked.id;
                this.inspectAgentState(clicked);
            }
        });
    }

    inspectAgentState(agent) {
        const topMems = agent.memory.records.slice(-4).reverse();
        const memLines = topMems.map(m => `[${m.time.toFixed(1)}h] ${m.text}`).join('\n• ');
        this.addLog(`=== ${agent.name} (${agent.role}) 실시간 상태 ===\n• 현재 심리: ${agent.cognition.desire}\n• 누적 신뢰 지수: ${agent.trustIndex}\n• 최근 기억 스트림:\n• ${memLines}`);
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
            this.addLog('오늘 일과(18:00)가 종료되었습니다. 발생한 자율 상호작용 결과를 검토하거나 리플레이로 되돌려볼 수 있습니다.');
        }

        // Agent movement & Autonomous Route Adjustment
        this.agents.forEach(agent => {
            if (agent.isConversing) {
                agent.status = '대화 중';
                agent.frame = 0;
                return;
            }

            // Normal schedule goal
            const task = [...agent.schedule].reverse().find(s => s.time <= this.gameHour);
            if (task && agent.currAction !== task.action) {
                agent.targetX = task.x;
                agent.targetY = task.y;
                agent.currAction = task.action;
            }

            const dx = agent.targetX - agent.currX;
            const dy = agent.targetY - agent.currY;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.2) {
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

                // Proximity range
                if (d < 2.2) {
                    const pairKey = [a1.id, a2.id].sort().join('-');
                    const lastSpoken = this.cooldownMap[pairKey] || 0;

                    // Cooldown: at least 0.8 game hour
                    if (this.gameHour - lastSpoken >= 0.8) {
                        this.triggerAutonomousEncounter(a1, a2, pairKey);
                    }
                }
            }
        }
    }

    // Emergent Encounter: Generates dynamic dialogue & mutates state + next destination
    triggerAutonomousEncounter(a1, a2, pairKey) {
        this.cooldownMap[pairKey] = this.gameHour;

        const graph = this.socialGraph[pairKey];
        graph.count++;

        // 1. Retrieve memories from each agent regarding the other
        const memA = a1.memory.retrieve(this.gameHour, a2.id, 2);
        const memB = a2.memory.retrieve(this.gameHour, a1.id, 2);

        // 2. Determine interaction mood based on Dawkins Altruism / Reciprocity & Trust
        // Positive alignment: mutual gain | Negative alignment: conflicting interest
        let isCooperative = false;
        let trustDelta = 0;

        // Interest overlap logic
        const commonInterest = (a1.group === a2.group) || (graph.trust > 0);
        const isConflictPair = (a1.id === 'agent_bae' && a2.id === 'agent_kim') ||
                               (a1.id === 'agent_jung' && a2.id === 'agent_lee') ||
                               (a1.id === 'agent_yoon' && a2.id === 'agent_choi');

        if (isConflictPair && graph.count === 1) {
            // Initial encounter on conflict topic: aggressive stance
            isCooperative = false;
            trustDelta = -1;
        } else if (graph.trust > 1 || (Math.random() < 0.6 && !isConflictPair)) {
            // Cooperative negotiation
            isCooperative = true;
            trustDelta = +1;
        } else {
            // Self-interested bargaining
            isCooperative = (Math.random() > 0.4);
            trustDelta = isCooperative ? +1 : -1;
        }

        graph.trust = Math.max(-5, Math.min(5, graph.trust + trustDelta));
        graph.sentiment = graph.trust > 1 ? '호의적' : (graph.trust < -1 ? '경계/대립' : '탐색 중');

        a1.trustIndex += trustDelta;
        a2.trustIndex += trustDelta;

        // 3. Dynamically compose utterances based on internal state
        const topic = this.pickDynamicTopic(a1, a2);
        const { textA, textB, rerouteTarget } = this.synthesizeDialogue(a1, a2, topic, isCooperative, graph.trust);

        a1.speech = textA;
        a2.speech = textB;
        a1.isConversing = true;
        a2.isConversing = true;

        if (a1.currX < a2.currX) { a1.dir = 'right'; a2.dir = 'left'; }
        else { a1.dir = 'left'; a2.dir = 'right'; }

        // 4. Memory Stream update (Natural language record)
        const recordA = `${a2.name}와 ${topic}에 대해 ${isCooperative ? '의견을 모았다' : '입장 차이를 확인했다'}: "${textA}"`;
        const recordB = `${a1.name}에게 "${textB}"라고 답함. 상대 태도: ${isCooperative ? '협조적' : '비협조적'}`;

        a1.memory.add(this.gameHour, 'dial', recordA, Math.abs(trustDelta) * 4 + 4, a2.id);
        a2.memory.add(this.gameHour, 'dial', recordB, Math.abs(trustDelta) * 4 + 4, a1.id);

        // 5. Autonomous Re-routing: If dynamic reaction requires movement
        if (rerouteTarget && Math.random() < 0.5) {
            const chosen = Math.random() < 0.5 ? a1 : a2;
            chosen.targetX = rerouteTarget.x;
            chosen.targetY = rerouteTarget.y;
            chosen.currAction = rerouteTarget.reason;
            chosen.autonomousDecisions++;
            this.addLog(`[자율 동선 변경] ${chosen.name}이(가) 대화 후 "${rerouteTarget.reason}"(으)로 이동 경로를 변경했습니다.`);
        }

        const timeStr = this.getFormattedTime();
        this.logs.unshift({ time: timeStr, from: a1.name, to: a2.name, msg: textA });
        this.logs.unshift({ time: timeStr, from: a2.name, to: a1.name, msg: textB });

        if (window.updateNetworkGraph) window.updateNetworkGraph(this.socialGraph);
        if (window.updateLogsUI) window.updateLogsUI(this.logs);

        setTimeout(() => {
            a1.speech = '';
            a2.speech = '';
            a1.isConversing = false;
            a2.isConversing = false;
        }, 4800);
    }

    pickDynamicTopic(a1, a2) {
        const topics = [
            "수로 분담금 분배", "가뭄 취입보 수량", "스마트 관수 도입",
            "로컬푸드 가공품 판로", "축사 배수로 정비", "친환경 농법 노하우"
        ];
        if (a1.cognition.concerns && a2.cognition.concerns) {
            const overlap = a1.cognition.concerns.find(c => a2.cognition.concerns.includes(c));
            if (overlap) return overlap;
        }
        return topics[Math.floor(Math.random() * topics.length)];
    }

    synthesizeDialogue(a1, a2, topic, isCooperative, trustLevel) {
        let textA = "";
        let textB = "";
        let rerouteTarget = null;

        if (isCooperative) {
            textA = `${a2.name}님, ${topic} 문제는 서로 조금씩 양보하면 합의점을 찾을 수 있을 것 같습니다.`;
            textB = `동감입니다 ${a1.name}님. 우리 쪽에서도 ${a1.cognition.desire} 측면을 고려해 대안을 제시하겠습니다.`;
            // Cooperative outcome might prompt joint check at plaza
            rerouteTarget = { x: 48, y: 42, reason: `${topic} 확인을 위해 회관 앞마당으로 이동` };
        } else {
            textA = `${a2.name}님, ${topic}에 대해 우리 입장이 반영되지 않으면 이번 총회 결정을 따르기 어렵습니다.`;
            textB = `각자 처한 사정이 다르니 일방적인 요구만 하실 수는 없지 않습니까.`;
            // Conflict might prompt reporting to village head or store gathering
            rerouteTarget = { x: 68, y: 35, reason: `구판장으로 이동해 동네 주민들과 상의` };
        }

        return { textA, textB, rerouteTarget };
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

            // Name Tag with Trust Sentiment Dot
            ctx.fillStyle = 'rgba(18, 22, 31, 0.85)';
            const tagW = ctx.measureText(agent.name).width + 18;
            ctx.fillRect(px + 16 - tagW / 2, py - 24, tagW, 16);

            // Trust dot (green for positive trust, red for negative)
            ctx.beginPath();
            ctx.arc(px + 16 - tagW / 2 + 6, py - 16, 3, 0, Math.PI * 2);
            ctx.fillStyle = agent.trustIndex >= 0 ? '#48bb78' : '#f56565';
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(agent.name, px + 20, py - 12);

            if (agent.speech) {
                this.renderSpeechBubble(ctx, px + 16, py - 30, agent.speech);
            }
        });
    }

    renderSpeechBubble(ctx, x, y, text) {
        ctx.font = '12px Pretendard, sans-serif';
        const metrics = ctx.measureText(text);
        const bw = Math.min(300, metrics.width + 20);
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
        ctx.fillText(text.length > 27 ? text.slice(0, 25) + '...' : text, x, y - 16);
    }

    renderHUD(ctx) {
        ctx.fillStyle = 'rgba(18, 22, 31, 0.9)';
        ctx.fillRect(14, 14, 270, 52);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 1;
        ctx.strokeRect(14, 14, 270, 52);

        ctx.fillStyle = '#63b3ed';
        ctx.font = 'bold 14px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`마을 시각: ${this.getFormattedTime()}`, 26, 36);

        ctx.fillStyle = '#a0aec0';
        ctx.font = '11px Pretendard, sans-serif';
        const zoomPct = Math.round(this.camera.zoom * 100);
        ctx.fillText(`배속: ${this.speed}x | 줌: ${zoomPct}% | [자율 인과 상호작용]`, 26, 54);
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
        a.download = `saemaul_autonomous_sim_${Date.now()}.json`;
        a.click();
    }
}
