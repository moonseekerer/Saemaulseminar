/**
 * bld_residential.js
 * 마을 주거 가옥단지 (24 x 16 타일: 768 x 512 px)
 * 전통 한식 기와집(툇마루/창호지문/디딤돌), 새마을 개량 주택(주황 지붕/파란 대문),
 * 옹기 장독대(간장/된장/고추장 항아리), 돌담길, 멍석 위 태양초 고추 말리기, 마당 텃밭 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "residential";
    const WIDTH = 768;
    const HEIGHT = 512;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자
        helpers.drawShadow(16, 20, w - 32, h - 24, 0.3);

        // 2. 가옥 1: 전통 한식 기와집 (좌측 상단: 320px x 240px)
        const h1X = 24;
        const h1Y = 40;
        const h1W = 310;
        const h1H = 220;
        const h1FloorY = h1Y + h1H;

        // 기단 (자연석 석축)
        helpers.drawBrickWall(h1X, h1FloorY - 20, h1W, 20, "#64748b", "#334155", 20, 10, true);

        // 황토 흙벽 (Clay Wall)
        ctx.fillStyle = "#d97706";
        ctx.fillRect(h1X + 10, h1Y + 70, h1W - 20, h1FloorY - (h1Y + 70) - 20);
        ctx.fillStyle = "#b45309";
        ctx.fillRect(h1X + 12, h1Y + 72, h1W - 24, h1FloorY - (h1Y + 72) - 22);

        // 목조 기둥 5개 (Timber Posts)
        const postStep = Math.floor((h1W - 24) / 4);
        for (let p = 0; p <= 4; p++) {
            const px = h1X + 12 + p * postStep;
            ctx.fillStyle = "#78350f";
            ctx.fillRect(px - 4, h1Y + 66, 8, h1FloorY - (h1Y + 66) - 20);
            ctx.fillStyle = "#451a03";
            ctx.fillRect(px + 2, h1Y + 66, 2, h1FloorY - (h1Y + 66) - 20);
        }

        // 원목 툇마루 (Wooden Porch Deck)
        helpers.drawWoodPlanks(h1X + 14, h1FloorY - 42, h1W - 28, 22, "#ca8a04", "#854d0e", 7, false);

        // 디딤돌 및 고무신 (Step Stone & Rubber Shoes)
        const stpX = h1X + 140;
        const stpY = h1FloorY - 14;
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(stpX, stpY, 32, 10);
        // 흰 고무신 한 켤레 (White Rubber Shoes)
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(stpX + 4, stpY + 2, 10, 5);
        ctx.fillRect(stpX + 18, stpY + 2, 10, 5);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(stpX + 6, stpY + 3, 6, 2);
        ctx.fillRect(stpX + 20, stpY + 3, 6, 2);

        // 창호지 분합문 3조 (Korean Lattice Paper Doors)
        for (let d = 0; d < 3; d++) {
            const dx = h1X + 32 + d * postStep;
            const dw = postStep - 20;
            const dh = 60;
            const dy = h1Y + 88;

            // 창호지 백색
            ctx.fillStyle = "#fef3c7";
            ctx.fillRect(dx, dy, dw, dh);
            // 원목 격자 살 (Lattice Grid)
            ctx.fillStyle = "#78350f";
            ctx.strokeRect(dx, dy, dw, dh);
            for (let lx = dx + 6; lx < dx + dw; lx += 6) {
                ctx.fillRect(lx, dy, 1, dh);
            }
            for (let ly = dy + 8; ly < dy + dh; ly += 8) {
                ctx.fillRect(dx, ly, dw, 1);
            }
        }

        // 처마 서까래 및 전통 흑기와 팔작지붕
        const roof1H = 68;
        const roof1Y = h1Y;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(h1X - 12, roof1Y + roof1H);
        ctx.lineTo(h1X + h1W + 12, roof1Y + roof1H);
        ctx.lineTo(h1X + h1W - 40, roof1Y);
        ctx.lineTo(h1X + 40, roof1Y);
        ctx.closePath();
        ctx.clip();

        helpers.drawRoofTiles(h1X - 14, roof1Y, h1W + 28, roof1H + 6, "#1e293b", "#475569", "#0f172a", 14, 10);
        ctx.restore();

        // 지붕 용마루 (Main Ridge)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(h1X + 36, roof1Y - 4, h1W - 72, 8);
        ctx.fillStyle = "#475569";
        ctx.fillRect(h1X + 38, roof1Y - 3, h1W - 76, 3);

        // 3. 가옥 2: 새마을 주황 개량 주택 (우측 상단: 320px x 230px)
        const h2X = 420;
        const h2Y = 40;
        const h2W = 320;
        const h2H = 220;
        const h2FloorY = h2Y + h2H;

        // 기초 콘크리트 기단
        ctx.fillStyle = "#475569";
        ctx.fillRect(h2X, h2FloorY - 18, h2W, 18);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(h2X, h2FloorY - 18, h2W, 2);

        // 백색 치장 벽돌 외벽 (White Painted Brick Wall)
        helpers.drawBrickWall(h2X, h2Y + 68, h2W, h2FloorY - (h2Y + 68) - 18, "#f8fafc", "#cbd5e1", 14, 7, true);

        // 현대식 샷시 창문 2조
        helpers.drawGlassWindow(h2X + 24, h2Y + 90, 68, 52, "#334155", "#38bdf8", "rgba(255,255,255,0.5)");
        helpers.drawGlassWindow(h2X + h2W - 100, h2Y + 90, 68, 52, "#334155", "#38bdf8", "rgba(255,255,255,0.5)");

        // 중앙 현관문 (Stainless & Teak Door)
        const d2X = h2X + Math.floor(h2W / 2) - 24;
        const d2Y = h2Y + 84;
        ctx.fillStyle = "#78350f";
        ctx.fillRect(d2X, d2Y, 48, h2FloorY - d2Y - 18);
        ctx.fillStyle = "#b45309";
        ctx.strokeRect(d2X, d2Y, 48, h2FloorY - d2Y - 18);
        helpers.drawGlassWindow(d2X + 6, d2Y + 6, 36, 24, "#451a03", "#7dd3fc", "rgba(255,255,255,0.6)");
        ctx.fillStyle = "#facc15";
        ctx.fillRect(d2X + 38, d2Y + 44, 4, 10); // 황동 손잡이

        // 주황색 새마을 개량 지붕 (Terracotta Orange Tile Roof)
        const roof2H = 70;
        const roof2Y = h2Y;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(h2X - 10, roof2Y + roof2H);
        ctx.lineTo(h2X + h2W + 10, roof2Y + roof2H);
        ctx.lineTo(h2X + h2W - 30, roof2Y);
        ctx.lineTo(h2X + 30, roof2Y);
        ctx.closePath();
        ctx.clip();

        helpers.drawRoofTiles(h2X - 12, roof2Y, h2W + 24, roof2H + 6, "#ea580c", "#fb923c", "#9a3412", 14, 10);
        ctx.restore();

        // 지붕 용마루 마감
        ctx.fillStyle = "#9a3412";
        ctx.fillRect(h2X + 28, roof2Y - 4, h2W - 56, 8);
        ctx.fillStyle = "#fdba74";
        ctx.fillRect(h2X + 30, roof2Y - 3, h2W - 60, 3);

        // 스테인리스 연통 및 모락모락 연기 도트 (Chimney & Smoke)
        const chmX = h2X + 44;
        const chmY = roof2Y - 24;
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(chmX, chmY, 6, 26);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(chmX - 2, chmY - 3, 10, 3); // 연통 갓
        // 연기 방울 (Smoke Puffs)
        ctx.fillStyle = "rgba(241, 245, 249, 0.6)";
        ctx.beginPath();
        ctx.arc(chmX + 3, chmY - 8, 4, 0, Math.PI * 2);
        ctx.arc(chmX + 7, chmY - 16, 6, 0, Math.PI * 2);
        ctx.arc(chmX + 12, chmY - 26, 8, 0, Math.PI * 2);
        ctx.fill();

        // 위성 안테나 접시 (Satellite Dish)
        const satX = h2X + h2W - 44;
        const satY = roof2Y + 12;
        ctx.fillStyle = "#475569";
        ctx.fillRect(satX + 8, satY + 10, 3, 16);
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(satX + 8, satY + 8, 10, Math.PI * 0.7, Math.PI * 1.7);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#e2e8f0";
        ctx.stroke();

        // 4. 장독대 영역 (Jangdokdae Platform: 좌측 하단 160px x 140px)
        const jdgX = 36;
        const jdgY = 320;
        const jdgW = 180;
        const jdgH = 140;

        // 자연석을 다듬어 쌓은 석단 (Stone Platform)
        ctx.fillStyle = "#475569";
        ctx.fillRect(jdgX, jdgY, jdgW, jdgH);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(jdgX + 4, jdgY + 4, jdgW - 8, jdgH - 8);
        // 바닥 자갈 질감
        ctx.fillStyle = "#94a3b8";
        for (let gy = jdgY + 8; gy < jdgY + jdgH - 8; gy += 10) {
            for (let gx = jdgX + 8; gx < jdgX + jdgW - 8; gx += 12) {
                if ((gx + gy) % 3 === 0) {
                    ctx.fillRect(gx, gy, 4, 3);
                }
            }
        }

        // 전통 옹기 항아리 군락 (대형 3개, 중형 4개, 소형 4개)
        const pots = [
            // 뒷열 대형 간장/된장독
            { x: jdgX + 24, y: jdgY + 18, r: 18, h: 32, label: "간장" },
            { x: jdgX + 70, y: jdgY + 18, r: 20, h: 36, label: "된장" },
            { x: jdgX + 122, y: jdgY + 18, r: 18, h: 32, label: "고추장" },
            // 앞열 중/소형 장아찌독
            { x: jdgX + 16, y: jdgY + 68, r: 14, h: 26 },
            { x: jdgX + 54, y: jdgY + 68, r: 15, h: 28 },
            { x: jdgX + 96, y: jdgY + 68, r: 14, h: 26 },
            { x: jdgX + 138, y: jdgY + 68, r: 13, h: 24 }
        ];

        pots.forEach(p => {
            // 항아리 그림자
            helpers.drawShadow(p.x - p.r, p.y + p.h - 6, p.r * 2, 8, 0.4);

            // 옹기 몸통 (Glazed Dark Earthenware)
            ctx.fillStyle = "#2d1b0d";
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + p.h / 2, p.r, p.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#451a03";
            ctx.beginPath();
            ctx.ellipse(p.x - 2, p.y + p.h / 2 - 2, p.r - 2, p.h / 2 - 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // 유약 광택 하이라이트 (Glaze Glint)
            ctx.fillStyle = "#a16207";
            ctx.fillRect(p.x - p.r + 4, p.y + 6, 3, p.h - 14);

            // 항아리 둥근 뚜껑 (Rounded Lid)
            ctx.fillStyle = "#1c1108";
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 4, p.r + 2, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#451a03";
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 2, p.r - 1, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // 뚜껑 꼭지 손잡이
            ctx.fillStyle = "#2d1b0d";
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        });

        // 5. 마당 멍석 위 태양초 붉은 고추 말리기 (Drying Red Peppers: 중앙 160px x 100px)
        const matX = 250;
        const matY = 340;
        const matW = 150;
        const matH = 90;

        // 왕골 멍석 (Woven Straw Mat)
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(matX, matY, matW, matH);
        ctx.fillStyle = "#eab308";
        ctx.strokeRect(matX, matY, matW, matH);

        // 멍석 위에 널어놓은 붉은 태양초 고추 픽셀 알갱이들
        for (let py = matY + 6; py < matY + matH - 6; py += 6) {
            for (let px = matX + 6; px < matX + matW - 6; px += 8) {
                ctx.fillStyle = (px + py) % 4 === 0 ? "#dc2626" : "#b91c1c";
                ctx.fillRect(px, py, 6, 2);
                ctx.fillStyle = "#15803d"; // 꼭지 초록 도트
                ctx.fillRect(px + 5, py, 1, 1);
            }
        }

        // 6. 안길 돌담길 (Stone Mud Wall Alley: 가옥 둘레 경계 담장)
        const wallY = 278;
        // 동서 횡단 돌담
        ctx.fillStyle = "#78350f"; // 황토 반죽
        ctx.fillRect(16, wallY, w - 32, 22);
        // 돌담 자연석들
        for (let sx = 20; sx < w - 40; sx += 18) {
            ctx.fillStyle = (sx % 36 === 0) ? "#64748b" : "#94a3b8";
            ctx.fillRect(sx, wallY + 2, 16, 18);
            ctx.fillStyle = "#475569";
            ctx.strokeRect(sx, wallY + 2, 16, 18);
        }
        // 담장 상단 짚 이엉 덮개 (Thatch Coping)
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(14, wallY - 4, w - 28, 6);
        ctx.fillStyle = "#eab308";
        ctx.fillRect(16, wallY - 3, w - 32, 2);

        // 돌담 중앙 사립문 / 대문 개구부 (Gate Opening)
        const gateX = 350;
        ctx.clearRect(gateX, wallY - 6, 50, 32);
        // 대문 나무 기둥 2개
        ctx.fillStyle = "#78350f";
        ctx.fillRect(gateX - 4, wallY - 8, 6, 34);
        ctx.fillRect(gateX + 48, wallY - 8, 6, 34);

        // 7. 마당 모퉁이 푸른 텃밭 (Kitchen Garden: 우측 하단 280px x 140px)
        const grdX = 450;
        const grdY = 320;
        const grdW = 280;
        const grdH = 140;

        // 이랑과 고랑 흙 (Raised Bed Furrows)
        ctx.fillStyle = "#78350f";
        ctx.fillRect(grdX, grdY, grdW, grdH);

        // 4열의 채소 이랑 (Rows of Vegetables)
        for (let r = 0; r < 4; r++) {
            const ry = grdY + 12 + r * 30;
            // 돋운 흙두둑
            ctx.fillStyle = "#92400e";
            ctx.fillRect(grdX + 8, ry, grdW - 16, 16);

            // 싱싱한 채소 포기들 (배추, 상추, 대파)
            for (let cx = grdX + 16; cx < grdX + grdW - 20; cx += 18) {
                if (r === 0 || r === 2) {
                    // 둥근 결구 배추/상추 (Cabbage Heads)
                    ctx.fillStyle = "#15803d";
                    ctx.beginPath();
                    ctx.arc(cx + 6, ry + 8, 7, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#4ade80";
                    ctx.beginPath();
                    ctx.arc(cx + 6, ry + 7, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // 줄기 대파/고추 포기 (Scallions / Pepper Plants)
                    ctx.fillStyle = "#16a34a";
                    ctx.fillRect(cx + 4, ry + 2, 4, 12);
                    ctx.fillStyle = "#86efac";
                    ctx.fillRect(cx + 5, ry + 1, 2, 5);
                }
            }
        }
    });
})();
