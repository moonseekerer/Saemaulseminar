/**
 * bld_orchard.js
 * 산비탈 사과 과수원 (24 x 16 타일: 768 x 512 px)
 * 사과나무 군락(풍성한 잎, 붉은 능금 과실), 점적관수 라인, 방풍림,
 * 사과 수확 궤짝 더미, 사다리, 농업용 동력운반차, 과수원 안내 팻말 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "orchard";
    const WIDTH = 768;
    const HEIGHT = 512;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자
        helpers.drawShadow(16, 16, w - 32, h - 24, 0.25);

        // 2. 상단 산비탈 방풍림 (Windbreak Pine Trees along North Border)
        for (let p = 0; p < 8; p++) {
            const px = 30 + p * 92;
            const py = 20;

            // 소나무/편백 원목 줄기
            ctx.fillStyle = "#451a03";
            ctx.fillRect(px + 14, py + 28, 8, 30);

            // 원추형 침엽수 잎단 (Conical Pine Foliage)
            const pineTiers = [
                { y: py + 26, w: 40, h: 14, c: "#14532d" },
                { y: py + 14, w: 30, h: 14, c: "#166534" },
                { y: py + 2,  w: 20, h: 14, c: "#15803d" }
            ];
            pineTiers.forEach(pt => {
                ctx.fillStyle = pt.c;
                ctx.beginPath();
                ctx.moveTo(px + 18, pt.y - 4);
                ctx.lineTo(px + 18 + pt.w / 2, pt.y + pt.h);
                ctx.lineTo(px + 18 - pt.w / 2, pt.y + pt.h);
                ctx.closePath();
                ctx.fill();
            });
        }

        // 3. 점적관수 튜브 배관 (Drip Irrigation Tubing Line)
        const rowYs = [130, 230, 330, 430];
        rowYs.forEach(ry => {
            ctx.fillStyle = "#1e293b"; // 검은색 PE 점적 호스
            ctx.fillRect(24, ry + 28, w - 48, 2);
            // 점적 드리퍼 노즐
            for (let dx = 40; dx < w - 40; dx += 60) {
                ctx.fillStyle = "#38bdf8";
                ctx.fillRect(dx, ry + 27, 3, 4); // 물방울 노즐
            }
        });

        // 4. 사과나무 4열 군락 (Apple Trees Rows: 총 16그루)
        const treeCols = [60, 220, 380, 540, 700];

        rowYs.forEach((ry, rIdx) => {
            const cols = (rIdx % 2 === 0) ? [80, 240, 420, 580] : [140, 310, 490, 650];
            cols.forEach(tx => {
                // 나무 그림자
                helpers.drawShadow(tx - 34, ry + 36, 68, 16, 0.35);

                // 뒤틀린 사과나무 굵은 고목 줄기 (Twisted Apple Tree Trunk)
                ctx.fillStyle = "#5c2e0b";
                ctx.fillRect(tx - 6, ry + 16, 12, 26);
                ctx.fillStyle = "#78350f";
                ctx.fillRect(tx - 4, ry + 16, 6, 26);

                // 주요 가지 뻗음
                ctx.strokeStyle = "#5c2e0b";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(tx, ry + 22);
                ctx.lineTo(tx - 18, ry + 6);
                ctx.moveTo(tx, ry + 22);
                ctx.lineTo(tx + 18, ry + 6);
                ctx.stroke();

                // 풍성한 사과나무 둥근 수관 (Lush Foliage Canopy)
                const foliage = [
                    { x: tx, y: ry - 14, r: 26, c: "#15803d" },
                    { x: tx - 18, y: ry - 4, r: 22, c: "#166534" },
                    { x: tx + 18, y: ry - 4, r: 22, c: "#15803d" },
                    { x: tx, y: ry + 4, r: 24, c: "#14532d" },
                    { x: tx - 6, y: ry - 18, r: 18, c: "#22c55e" }
                ];
                foliage.forEach(f => {
                    ctx.fillStyle = f.c;
                    ctx.beginPath();
                    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                    ctx.fill();
                });

                // 탐스럽게 익은 붉은 사과 과실 도트 (Ripe Red Apples: 그루당 10~12개)
                const appleOffsets = [
                    { x: -16, y: -12 }, { x: -8, y: -22 }, { x: 4, y: -24 }, { x: 14, y: -14 },
                    { x: -22, y: 0 }, { x: -10, y: -2 }, { x: 0, y: -6 }, { x: 12, y: -4 }, { x: 22, y: 2 },
                    { x: -14, y: 10 }, { x: 6, y: 8 }, { x: 18, y: 12 }
                ];
                appleOffsets.forEach(ao => {
                    const ax = tx + ao.x;
                    const ay = ry + ao.y;
                    // 사과 알 (Apple Body)
                    ctx.fillStyle = "#ef4444";
                    ctx.beginPath();
                    ctx.arc(ax, ay, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#dc2626";
                    ctx.stroke();
                    // 하이라이트 흰점
                    ctx.fillStyle = "#fca5a5";
                    ctx.fillRect(ax - 2, ay - 2, 2, 2);
                    // 꼭지 초록 잎
                    ctx.fillStyle = "#15803d";
                    ctx.fillRect(ax - 1, ay - 4, 2, 2);
                });
            });
        });

        // 5. 과수원 사다리 (Wooden Harvest Ladder: 좌측 두 번째 나무)
        const ladX = 264;
        const ladY = 120;
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ladX, ladY + 44);
        ctx.lineTo(ladX + 16, ladY);
        ctx.moveTo(ladX + 10, ladY + 44);
        ctx.lineTo(ladX + 26, ladY);
        ctx.stroke();
        // 발판 가로대
        ctx.lineWidth = 2;
        for (let l = 1; l <= 4; l++) {
            const ly = ladY + l * 9;
            const lx1 = ladX + l * 3;
            ctx.beginPath();
            ctx.moveTo(lx1, ly);
            ctx.lineTo(lx1 + 10, ly);
            ctx.stroke();
        }

        // 6. 사과 수확 궤짝 더미 (Harvest Crates: 중앙 및 우측)
        const crateStacks = [
            { x: 340, y: 210 },
            { x: 366, y: 210 },
            { x: 353, y: 194 }, // 2단 적재
            { x: 520, y: 410 },
            { x: 546, y: 410 }
        ];

        crateStacks.forEach(cs => {
            // 노란 플라스틱 수확용 콘티 궤짝 (Yellow Harvest Crate)
            ctx.fillStyle = "#ca8a04";
            ctx.fillRect(cs.x, cs.y, 22, 14);
            ctx.fillStyle = "#854d0e";
            ctx.strokeRect(cs.x, cs.y, 22, 14);

            // 궤짝 손잡이 구멍
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(cs.x + 6, cs.y + 2, 10, 3);

            // 궤짝 위 가득 담긴 사과들
            for (let a = 0; a < 4; a++) {
                ctx.fillStyle = "#ef4444";
                ctx.beginPath();
                ctx.arc(cs.x + 4 + a * 5, cs.y - 1, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // 7. 농업용 동력운반차 (Motorized Orchard Utility Carrier: 80px x 46px)
        const cartX = 420;
        const cartY = 216;
        const cartW = 76;
        const cartH = 44;

        // 바닥 그림자
        helpers.drawShadow(cartX + 2, cartY + 32, cartW, 14, 0.4);

        // 고무 궤도 무한궤도 캐터필러 (Crawler Tracks)
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(cartX + 4, cartY + 30, cartW - 8, 12);
        ctx.fillStyle = "#475569";
        for (let wId = cartX + 8; wId < cartX + cartW - 10; wId += 12) {
            ctx.beginPath();
            ctx.arc(wId + 4, cartY + 36, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 운반차 적재함 프레임 (청록색 한국 농기계 컬러)
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(cartX + 20, cartY + 14, cartW - 22, 18);
        ctx.fillStyle = "#0369a1";
        ctx.strokeRect(cartX + 20, cartY + 14, cartW - 22, 18);

        // 운전석 및 조종 핸들 (Operator Seat & Lever)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(cartX + 2, cartY + 12, 16, 20); // 엔진룸 커버
        ctx.fillStyle = "#ef4444"; // 조종 레버 손잡이
        ctx.fillRect(cartX + 10, cartY + 4, 3, 8);
        ctx.fillRect(cartX + 9, cartY + 2, 5, 4);

        // 짐칸 위 사과 상자 2개 적재
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(cartX + 26, cartY + 2, 20, 12);
        ctx.fillRect(cartX + 48, cartY + 2, 20, 12);

        // 8. 과수원 안내 팻말 (Orchard Farm Sign)
        const sgnX = 40;
        const sgnY = 440;
        ctx.fillStyle = "#78350f";
        ctx.fillRect(sgnX + 20, sgnY + 18, 4, 28); // 지지목
        // 목판 간판
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(sgnX, sgnY, 110, 24);
        ctx.fillStyle = "#b45309";
        ctx.strokeRect(sgnX, sgnY, 110, 24);
        // 문구
        ctx.fillStyle = "#78350f";
        ctx.font = "bold 9px 'Pretendard', sans-serif";
        ctx.fillText("오상 햇살사과 (GAP)", sgnX + 8, sgnY + 15);
    });
})();
