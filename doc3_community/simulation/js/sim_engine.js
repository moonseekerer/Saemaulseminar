// sim_engine.js - Large World Simulator with Smooth Camera (Drag, Zoom, Follow)

class VillageSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cols = MAP_CONFIG.cols; // 100
        this.rows = MAP_CONFIG.rows; // 75
        this.tileSize = MAP_CONFIG.tileSize; // 32
        this.worldWidth = MAP_CONFIG.worldWidth; // 3200
        this.worldHeight = MAP_CONFIG.worldHeight; // 2400

        // Camera System
        this.camera = {
            x: 1600 - this.canvas.width / 2, // Center around village hall
            y: 1200 - this.canvas.height / 2,
            zoom: 0.8, // default zoom (0.4 ~ 1.8)
            minZoom: 0.35,
            maxZoom: 2.0,
            trackingAgentId: null
        };

        // Images cache
        this.charImages = {};
        this.tilesLoaded = false;
        this.loadAssets();

        // State
        this.gameHour = 8.0;
        this.speed = 1.0;
        this.isPaused = false;
        this.isReplayMode = false;
        
        // Replay history
        this.history = [];
        this.currentFrameIdx = 0;

        // Agents
        this.agents = AGENTS_ROSTER.map(a => ({
            ...a,
            currX: a.homePos.x,
            currY: a.homePos.y,
            targetX: a.workPos.x,
            targetY: a.workPos.y,
            dir: 'down',
            frame: 0,
            status: '이동 중',
            currAction: '일과 시작',
            speech: ''
        }));

        // Network stats
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

        // Mouse Drag to Pan
        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            this.camera.trackingAgentId = null; // stop tracking on manual drag
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

        // Wheel to Zoom centered on mouse
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const prevZoom = this.camera.zoom;
            const zoomDelta = e.deltaY < 0 ? 1.15 : 0.87;
            let nextZoom = prevZoom * zoomDelta;
            nextZoom = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, nextZoom));

            // Adjust camera position so mouse point remains fixed
            const worldMouseX = this.camera.x + mouseX / prevZoom;
            const worldMouseY = this.camera.y + mouseY / prevZoom;

            this.camera.zoom = nextZoom;
            this.camera.x = worldMouseX - mouseX / nextZoom;
            this.camera.y = worldMouseY - mouseY / nextZoom;
            this.clampCamera();
        }, { passive: false });

        // Click to select/track agent
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = this.camera.x + (e.clientX - rect.left) / this.camera.zoom;
            const clickY = this.camera.y + (e.clientY - rect.top) / this.camera.zoom;

            // Find clicked agent
            const clicked = this.agents.find(a => {
                const ax = a.currX * this.tileSize;
                const ay = a.currY * this.tileSize;
                return Math.hypot(clickX - (ax + 16), clickY - (ay + 16)) < 24;
            });

            if (clicked) {
                this.camera.trackingAgentId = clicked.id;
                this.addLog(`${clicked.name} 추적 카메라를 활성화했습니다.`);
            }
        });
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

            // Update camera if tracking
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

            const dx = agent.targetX - agent.currX;
            const dy = agent.targetY - agent.currY;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.15) {
                agent.status = '이동 중';
                // Travel speed slightly higher for large 100x75 world
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
                const d = Math.hypot(a1.currX - a2.currX, a1.currY - a2.currY);

                // Proximity range in larger world: within 2.0 tiles
                if (d < 2.0 && !a1.speech && !a2.speech) {
                    if (Math.random() < 0.04) {
                        this.triggerDialogue(a1, a2);
                    }
                }
            }
        }
    }

    triggerDialogue(a1, a2) {
        const dialogList = [
            { t1: a2.name + "님, 올해 수로 쪽 유량이 많이 줄었는데 보셨습니까?", t2: "네, 산비탈 과수원과 스마트온실까지 물이 제대로 닿을지 걱정입니다." },
            { t1: a2.name + "님, 오후 2시에 회관 앞마당에서 수로 총회 열린다더군요.", t2: "군청 자부담 분담금 문제 때문에 다들 목소리를 높일 것 같습니다." },
            { t1: "구판장 앞 평상에 다들 모여서 이번 로컬 가공품 얘기 나누고 있습니다.", t2: "부녀회와 청년들이 판로를 넓히려면 협동이 필요하겠지요." },
            { t1: "온실 스마트 센서 관수 효율이 꽤 괜찮다고 들었습니다.", t2: "전통 논 농가 어르신들과도 기술을 공유해 물 낭비를 줄이고자 합니다." }
        ];
        const pick = dialogList[Math.floor(Math.random() * dialogList.length)];
        
        a1.speech = pick.t1;
        a2.speech = pick.t2;

        const timeStr = this.getFormattedTime();
        this.logs.unshift({ time: timeStr, from: a1.name, to: a2.name, msg: pick.t1 });
        this.logs.unshift({ time: timeStr, from: a2.name, to: a1.name, msg: pick.t2 });

        const key = [a1.id, a2.id].sort().join('-');
        this.networkMatrix[key] = (this.networkMatrix[key] || 0) + 1;

        if (window.updateNetworkGraph) window.updateNetworkGraph(this.networkMatrix);
        if (window.updateLogsUI) window.updateLogsUI(this.logs);

        setTimeout(() => {
            a1.speech = '';
            a2.speech = '';
        }, 4500);
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
        // Camera Transform
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        // 1. Draw Visible Terrain Tiles
        this.renderTerrain(ctx);

        // 2. Draw Landmark Zones
        this.renderZones(ctx);

        // 3. Draw Agents
        this.renderAgents(ctx);

        ctx.restore();

        // 4. Draw HUD (Screen Space)
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
                    ctx.fillStyle = (r + c) % 2 === 0 ? '#689f38' : '#7cb342'; // Grass
                } else if (type === 1) {
                    ctx.fillStyle = '#bcaaa4'; // Dirt Path
                } else if (type === 2) {
                    ctx.fillStyle = '#0288d1'; // Water Canal
                } else if (type === 3) {
                    ctx.fillStyle = '#9ccc65'; // Crops
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

            // Banner
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

            // Tracking indicator
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
        const bw = Math.min(260, metrics.width + 20);
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
        ctx.fillText(text.length > 24 ? text.slice(0, 22) + '...' : text, x, y - 16);
    }

    renderHUD(ctx) {
        // Upper left HUD
        ctx.fillStyle = 'rgba(18, 22, 31, 0.9)';
        ctx.fillRect(14, 14, 250, 48);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 1;
        ctx.strokeRect(14, 14, 250, 48);

        ctx.fillStyle = '#63b3ed';
        ctx.font = 'bold 14px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`마을 시각: ${this.getFormattedTime()}`, 26, 36);

        ctx.fillStyle = '#a0aec0';
        ctx.font = '11px Pretendard, sans-serif';
        const zoomPct = Math.round(this.camera.zoom * 100);
        ctx.fillText(`배속: ${this.speed}x | 줌: ${zoomPct}% | 드래그 이동/휠 확대축소`, 26, 52);
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
        a.download = `saemaul_simulation_large_${Date.now()}.json`;
        a.click();
    }
}
