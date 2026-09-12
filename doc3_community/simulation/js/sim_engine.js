// sim_engine.js - Core Simulation & Replay Engine

class VillageSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cols = MAP_CONFIG.cols;
        this.rows = MAP_CONFIG.rows;
        this.tileSize = MAP_CONFIG.tileSize; // 32

        // Images cache
        this.charImages = {};
        this.tilesLoaded = false;
        this.loadAssets();

        // State
        this.gameHour = 8.0; // 08:00 AM start
        this.speed = 1.0;
        this.isPaused = false;
        this.isReplayMode = false;
        
        // Replay history frames
        this.history = []; // [{ time, agents: [{id, x, y, dir, action}], events: [] }]
        this.currentFrameIdx = 0;

        // Active Agents
        this.agents = AGENTS_ROSTER.map(a => ({
            ...a,
            currX: a.homePos.x,
            currY: a.homePos.y,
            targetX: a.workPos.x,
            targetY: a.workPos.y,
            dir: 'down', // down, left, right, up
            frame: 0,
            status: '이동 중',
            currAction: '일과 시작',
            talkTarget: null,
            speech: ''
        }));

        // Interaction & Network Graph Stats
        this.interactions = []; // [{ from, to, text, time, trustDelta }]
        this.networkMatrix = {}; // 'kim_lee': count
        this.agents.forEach(a1 => {
            this.agents.forEach(a2 => {
                if (a1.id !== a2.id) {
                    const key = [a1.id, a2.id].sort().join('-');
                    this.networkMatrix[key] = 0;
                }
            });
        });

        // Event logs
        this.logs = [];

        this.lastTick = performance.now();
        this.animationId = null;
    }

    loadAssets() {
        let loadedCount = 0;
        const total = AGENTS_ROSTER.length;
        AGENTS_ROSTER.forEach(agent => {
            const img = new Image();
            img.src = ssets/characters/;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === total) {
                    this.tilesLoaded = true;
                }
            };
            this.charImages[agent.id] = img;
        });
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

            this.render();
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }

    update(dt) {
        // Time progress: 1 real second = 0.05 game hour (1 game hour = 20s at 1x speed)
        this.gameHour += (dt * 0.05 * this.speed);
        if (this.gameHour >= 18.0) {
            this.gameHour = 18.0;
            this.isPaused = true;
            this.addLog('마을 공식 일과(18:00)가 종료되었습니다. 리플레이로 되돌려볼 수 있습니다.');
        }

        // Update each agent
        const hourFloor = Math.floor(this.gameHour);
        this.agents.forEach(agent => {
            // Check schedule
            const task = [...agent.schedule].reverse().find(s => s.time <= this.gameHour);
            if (task) {
                agent.targetX = task.x;
                agent.targetY = task.y;
                agent.currAction = task.action;
            }

            // Move towards target
            const dx = agent.targetX - agent.currX;
            const dy = agent.targetY - agent.currY;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.1) {
                agent.status = '이동 중';
                const moveDist = Math.min(dist, dt * 1.5 * this.speed);
                agent.currX += (dx / dist) * moveDist;
                agent.currY += (dy / dist) * moveDist;

                // Set direction
                if (Math.abs(dx) > Math.abs(dy)) {
                    agent.dir = dx > 0 ? 'right' : 'left';
                } else {
                    agent.dir = dy > 0 ? 'down' : 'up';
                }
                agent.frame = (agent.frame + dt * 4 * this.speed) % 3;
            } else {
                agent.status = '활동 중';
                agent.frame = 0;
            }
        });

        // Proximity check for dialogue (접촉 감지)
        this.checkInteractions();
    }

    checkInteractions() {
        for (let i = 0; i < this.agents.length; i++) {
            for (let j = i + 1; j < this.agents.length; j++) {
                const a1 = this.agents[i];
                const a2 = this.agents[j];
                const d = Math.hypot(a1.currX - a2.currX, a1.currY - a2.currY);

                // If within 1.2 tiles and neither is currently talking
                if (d < 1.2 && !a1.speech && !a2.speech) {
                    // 10% chance per second when nearby to trigger greeting/dialogue
                    if (Math.random() < 0.03) {
                        this.triggerDialogue(a1, a2);
                    }
                }
            }
        }
    }

    triggerDialogue(a1, a2) {
        const dialogList = [
            { t1: ${a2.name}님, 오늘 날씨가 많이 가무네요. 수로 쪽은 어떠신지요?, t2: 그러게 말입니다. 상류에서 물길을 좀 열어줘야 할 텐데 걱정입니다. },
            { t1: ${a2.name}님, 이번 군청 지원사업 서류 제출하셨나요?, t2: 네 이장님, 부녀회와 함께 로컬 가공품 쪽으로 신청해두었습니다. },
            { t1: 오상회 구판장 앞에 다들 모여서 수로 공사 얘기 나누던데요., t2: 오후 2시에 회관 앞마당에서 모이기로 했으니 꼭 나오세요. },
            { t1: 청년 온실 관수 센서는 잘 돌아가나요?, t2: 네 어르신, 전통 수로와 연계해서 물 낭비 없도록 신경 쓰고 있습니다. }
        ];
        const pick = dialogList[Math.floor(Math.random() * dialogList.length)];
        
        a1.speech = pick.t1;
        a2.speech = pick.t2;

        const timeStr = this.getFormattedTime();
        this.logs.unshift({ time: timeStr, from: a1.name, to: a2.name, msg: pick.t1 });
        this.logs.unshift({ time: timeStr, from: a2.name, to: a1.name, msg: pick.t2 });

        const key = [a1.id, a2.id].sort().join('-');
        this.networkMatrix[key] = (this.networkMatrix[key] || 0) + 1;

        if (window.updateNetworkGraph) {
            window.updateNetworkGraph(this.networkMatrix);
        }
        if (window.updateLogsUI) {
            window.updateLogsUI(this.logs);
        }

        setTimeout(() => {
            a1.speech = '';
            a2.speech = '';
        }, 4000);
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

        // 1. Draw base terrain grid
        this.renderTerrain(ctx);

        // 2. Draw Landmark Zones
        this.renderZones(ctx);

        // 3. Draw Agents
        this.renderAgents(ctx);

        // 4. Draw HUD time
        this.renderHUD(ctx);
    }

    renderTerrain(ctx) {
        const ts = this.tileSize;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const type = VILLAGE_GRID[r][c];
                if (type === 0) {
                    ctx.fillStyle = (r + c) % 2 === 0 ? '#7cb342' : '#8bc34a'; // Grass
                } else if (type === 1) {
                    ctx.fillStyle = '#d7ccc8'; // Road / Path
                } else if (type === 2) {
                    ctx.fillStyle = '#29b6f6'; // Water
                } else if (type === 3) {
                    ctx.fillStyle = '#aed581'; // Crops
                }
                ctx.fillRect(c * ts, r * ts, ts, ts);

                // Grid border subtle
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
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

            // Zone boundary box
            ctx.fillStyle = zone.color + '22'; // 15% opacity tint
            ctx.fillRect(zx, zy, zw, zh);

            ctx.strokeStyle = zone.accent || zone.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(zx, zy, zw, zh);

            // Zone Name Label Banner
            ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
            ctx.fillRect(zx + 4, zy + 4, zw - 8, 22);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(zone.name, zx + zw / 2, zy + 19);

            // Subtitle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px Pretendard, sans-serif';
            ctx.fillText(zone.subtitle, zx + zw / 2, zy + zh - 6);
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
                // Character sheet is 3 cols x 4 rows (96x128 -> 32x32 per frame)
                const colIdx = Math.floor(agent.frame) % 3;
                const rowIdx = dirOffsets[agent.dir] || 0;
                const sw = img.naturalWidth / 3;
                const sh = img.naturalHeight / 4;

                ctx.drawImage(img, colIdx * sw, rowIdx * sh, sw, sh, px - 4, py - 12, 40, 44);
            } else {
                // Fallback token
                ctx.beginPath();
                ctx.arc(px + 16, py + 16, 12, 0, Math.PI * 2);
                ctx.fillStyle = agent.color;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Name Tag
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            const tagW = ctx.measureText(agent.name).width + 8;
            ctx.fillRect(px + 16 - tagW / 2, py - 20, tagW, 14);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(agent.name, px + 16, py - 9);

            // Speech Bubble
            if (agent.speech) {
                this.renderSpeechBubble(ctx, px + 16, py - 25, agent.speech);
            }
        });
    }

    renderSpeechBubble(ctx, x, y, text) {
        ctx.font = '11px Pretendard, sans-serif';
        const metrics = ctx.measureText(text);
        const bw = Math.min(220, metrics.width + 16);
        const bh = 24;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;

        // Rounded rect
        ctx.beginPath();
        ctx.roundRect(x - bw / 2, y - bh - 6, bw, bh, 4);
        ctx.fill();
        ctx.stroke();

        // Pointer triangle
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 6);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 5, y - 6);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText(text.length > 22 ? text.slice(0, 20) + '...' : text, x, y - 14);
    }

    renderHUD(ctx) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(10, 10, 190, 42);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 190, 42);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(마을 시각: , 20, 32);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Pretendard, sans-serif';
        ctx.fillText(this.isReplayMode ? '[리플레이 탐색 모드]' : 배속: x | 에이전트: 12인, 20, 46);
    }

    getFormattedTime() {
        const h = Math.floor(this.gameHour);
        const m = Math.floor((this.gameHour - h) * 60);
        const hh = h < 10 ? '0' + h : h;
        const mm = m < 10 ? '0' + m : m;
        return ${hh}:;
    }

    addLog(msg) {
        this.logs.unshift({ time: this.getFormattedTime(), from: '시스템', to: '전체', msg });
        if (window.updateLogsUI) window.updateLogsUI(this.logs);
    }

    exportHistoryJSON() {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.history));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = saemaul_simulation_.json;
        a.click();
    }
}