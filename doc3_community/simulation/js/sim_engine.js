// sim_engine.js - Multi-Day Scenario Engine with Pixel Landmark Graphics & Toggle

class MemoryStream {
    constructor(agentId) {
        this.agentId = agentId;
        this.records = [];
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

        // Visual Display Toggles
        this.showPixelBuildings = true; // 건물 도트 그래픽 켜기/끄기
        this.showZoneOverlays = true;   // 구역 테두리 및 현판 켜기/끄기

        this.charImages = {};
        this.tilesLoaded = false;
        this.loadAssets();

        this.currentDay = 'day1';
        this.gameHour = 8.0;
        this.speed = 1.0;
        this.isPaused = false;
        this.isReplayMode = false;
        
        this.history = [];
        this.currentFrameIdx = 0;

        this.socialGraph = {};
        this.dialogueTriggerQueue = [];
        this.logs = [];

        this.initDay(this.currentDay);

        this.lastTick = performance.now();
        this.animationId = null;

        this.bindEvents();
    }

    initDay(dayKey) {
        this.currentDay = dayKey;
        this.gameHour = 8.0;
        this.history = [];
        this.currentFrameIdx = 0;

        const dayData = MULTI_DAY_SIM_DATA[dayKey];
        if (!dayData) return;

        this.dialogueTriggerQueue = [...dayData.dialogues];

        this.agents = AGENTS_ROSTER.map(a => {
            const memStream = (this.agents && this.agents.find(old => old.id === a.id)) 
                ? this.agents.find(old => old.id === a.id).memory 
                : new MemoryStream(a.id);

            memStream.add(7.8, 'obs', `[${dayData.title}] ${dayData.description}`, 8, 'town');

            const sched = dayData.schedule[a.id] || a.schedule;
            const startPt = sched[0] || { x: a.homePos.x, y: a.homePos.y };

            return {
                ...a,
                memory: memStream,
                currX: startPt.x,
                currY: startPt.y,
                targetX: startPt.x,
                targetY: startPt.y,
                schedule: sched,
                dir: 'down',
                frame: 0,
                status: '일과 준비',
                currAction: sched[0]?.action || '일과 시작',
                speech: '',
                isConversing: false
            };
        });

        if (Object.keys(this.socialGraph).length === 0) {
            this.agents.forEach(a1 => {
                this.agents.forEach(a2 => {
                    if (a1.id !== a2.id) {
                        const key = [a1.id, a2.id].sort().join('-');
                        if (!this.socialGraph[key]) {
                            this.socialGraph[key] = { count: 0, trust: 0, sentiment: '초기' };
                        }
                    }
                });
            });
        }

        this.addLog(`=== [${dayData.title}] 시뮬레이션을 시작합니다 ===\n${dayData.description}`);
        if (window.updateDayIndicator) window.updateDayIndicator(dayKey, dayData.title);
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
        this.addLog(`=== ${agent.name} (${agent.role}) 실시간 상태 ===\n• 현재 활동: ${agent.currAction}\n• 최근 기억 스트림:\n• ${memLines}`);
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
            this.triggerEndOfDayReflection();
        }

        this.agents.forEach(agent => {
            if (agent.isConversing) {
                agent.status = '대화 중';
                agent.frame = 0;
                return;
            }

            const task = [...agent.schedule].reverse().find(s => s.time <= this.gameHour);
            if (task) {
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

        this.checkScheduledDialogue();
    }

    checkScheduledDialogue() {
        if (this.dialogueTriggerQueue.length === 0) return;

        const next = this.dialogueTriggerQueue[0];
        if (this.gameHour >= next.time) {
            this.dialogueTriggerQueue.shift();

            const a1 = this.agents.find(a => a.id === next.p1);
            const a2 = this.agents.find(a => a.id === next.p2);

            if (a1 && a2) {
                this.executeSimulatedDialogue(a1, a2, next);
            }
        }
    }

    executeSimulatedDialogue(a1, a2, dia) {
        a1.speech = dia.line1;
        a2.speech = dia.line2;
        a1.isConversing = true;
        a2.isConversing = true;

        if (a1.currX < a2.currX) { a1.dir = 'right'; a2.dir = 'left'; }
        else { a1.dir = 'left'; a2.dir = 'right'; }

        const pairKey = [a1.id, a2.id].sort().join('-');
        const graph = this.socialGraph[pairKey] || { count: 0, trust: 0, sentiment: '' };
        graph.count++;
        graph.trust += dia.trustDelta;
        graph.sentiment = dia.sentiment;
        this.socialGraph[pairKey] = graph;

        a1.memory.add(this.gameHour, 'dial', `${a2.name}와 대화: "${dia.line1}"`, 8, a2.id);
        a2.memory.add(this.gameHour, 'dial', `${a1.name}와 대화: "${dia.line2}"`, 8, a1.id);

        const timeStr = this.getFormattedTime();
        this.logs.unshift({ time: timeStr, from: a1.name, to: a2.name, msg: dia.line1 });
        this.logs.unshift({ time: timeStr, from: a2.name, to: a1.name, msg: dia.line2 });

        if (window.updateNetworkGraph) window.updateNetworkGraph(this.socialGraph);
        if (window.updateLogsUI) window.updateLogsUI(this.logs);

        setTimeout(() => {
            a1.speech = '';
            a2.speech = '';
            a1.isConversing = false;
            a2.isConversing = false;
        }, 5500);
    }

    triggerEndOfDayReflection() {
        const dayData = MULTI_DAY_SIM_DATA[this.currentDay];
        if (!dayData || !dayData.reflections) return;

        this.addLog(`=== [${dayData.title}] 일과 종료: 고수준 성찰(Reflection) 생성 ===`);
        dayData.reflections.forEach(ref => {
            const ag = this.agents.find(a => a.id === ref.agent);
            if (ag) {
                ag.memory.add(18.0, 'ref', `[성찰] ${ref.text}`, 9, 'self');
                this.addLog(`• [${ag.name} 성찰]: ${ref.text}`);
            }
        });
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

        // 1. 기본 지형 타일 (풀밭, 길, 물, 논밭)
        this.renderTerrain(ctx);

        // 2. 구역 도트 픽셀 그래픽 (ON / OFF 가능)
        if (this.showPixelBuildings && window.PixelLandmarkRenderer) {
            this.renderPixelBuildings(ctx);
        }

        // 3. 구역 영역 선 및 이름 배너 (ON / OFF 가능)
        if (this.showZoneOverlays) {
            this.renderZones(ctx);
        }

        // 4. 주민 에이전트 스프라이트 및 말풍선
        this.renderAgents(ctx);

        ctx.restore();

        // 5. 화면 고정 HUD
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

    renderPixelBuildings(ctx) {
        const ts = this.tileSize;

        VILLAGE_ZONES.forEach(zone => {
            const zx = zone.x * ts;
            const zy = zone.y * ts;
            const zw = zone.w * ts;
            const zh = zone.h * ts;

            // 1. 고성능 사전 베이킹 LandmarkEngine 우선 렌더링
            if (window.landmarkEngine && window.landmarkEngine.draw(ctx, zone.id, zx, zy, zw, zh)) {
                return;
            }

            // 2. 레거시 폴백: PixelLandmarkRenderer
            if (window.PixelLandmarkRenderer) {
                const R = PixelLandmarkRenderer;
                if (zone.id === 'hall' && R.drawHall) R.drawHall(ctx, zx, zy, zw, zh);
                else if (zone.id === 'greenhouse' && R.drawGreenhouse) R.drawGreenhouse(ctx, zx, zy, zw, zh);
                else if (zone.id === 'store' && R.drawStore) R.drawStore(ctx, zx, zy, zw, zh);
                else if (zone.id === 'cafe' && R.drawCafe) R.drawCafe(ctx, zx, zy, zw, zh);
                else if (zone.id === 'cattle' && R.drawCattle) R.drawCattle(ctx, zx, zy, zw, zh);
                else if (zone.id === 'orchard' && R.drawOrchard) R.drawOrchard(ctx, zx, zy, zw, zh);
                else if (zone.id === 'plaza' && R.drawPlaza) R.drawPlaza(ctx, zx, zy, zw, zh);
                else if (zone.id === 'residential' && R.drawResidential) R.drawResidential(ctx, zx, zy, zw, zh);
            }
        });
    }

    renderZones(ctx) {
        const ts = this.tileSize;
        VILLAGE_ZONES.forEach(zone => {
            const zx = zone.x * ts;
            const zy = zone.y * ts;
            const zw = zone.w * ts;
            const zh = zone.h * ts;

            ctx.fillStyle = zone.color + '18';
            ctx.fillRect(zx, zy, zw, zh);

            ctx.strokeStyle = zone.accent || zone.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(zx, zy, zw, zh);

            // 상단 간결한 네임 라벨
            ctx.fillStyle = 'rgba(18, 22, 31, 0.85)';
            const labelW = ctx.measureText(zone.name).width + 20;
            ctx.fillRect(zx + 6, zy + 6, labelW, 20);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Pretendard, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(zone.name, zx + 16, zy + 20);
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

            if (agent.speech) {
                this.renderSpeechBubble(ctx, px + 16, py - 30, agent.speech);
            }
        });
    }

    renderSpeechBubble(ctx, x, y, text) {
        ctx.font = '12px Pretendard, sans-serif';
        const metrics = ctx.measureText(text);
        const bw = Math.min(320, metrics.width + 24);
        const bh = 30;

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
        ctx.fillText(text.length > 28 ? text.slice(0, 26) + '...' : text, x, y - 16);
    }

    renderHUD(ctx) {
        ctx.fillStyle = 'rgba(18, 22, 31, 0.9)';
        ctx.fillRect(14, 14, 280, 52);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 1;
        ctx.strokeRect(14, 14, 280, 52);

        ctx.fillStyle = '#63b3ed';
        ctx.font = 'bold 14px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        const dayTitle = MULTI_DAY_SIM_DATA[this.currentDay]?.title || '시뮬레이션';
        ctx.fillText(`${dayTitle.slice(0, 7)} | 시각: ${this.getFormattedTime()}`, 26, 36);

        ctx.fillStyle = '#a0aec0';
        ctx.font = '11px Pretendard, sans-serif';
        const zoomPct = Math.round(this.camera.zoom * 100);
        ctx.fillText(`배속: ${this.speed}x | 줌: ${zoomPct}% | 도트 건물 [${this.showPixelBuildings ? 'ON' : 'OFF'}]`, 26, 54);
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
        a.download = `saemaul_${this.currentDay}_${Date.now()}.json`;
        a.click();
    }
}
