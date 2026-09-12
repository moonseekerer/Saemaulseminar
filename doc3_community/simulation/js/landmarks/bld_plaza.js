/**
 * bld_plaza.js
 * 회관 앞 잔디광장 및 쉼터 정자 (12 x 8 타일: 384 x 256 px)
 * 전통 팔각정(단청 처마, 흑기와 모임지붕, 계자난간, 대청마루, 바둑판),
 * 박석 보도, 마을 유래비 표지석, 수목 그늘목, 공원 벤치 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "plaza";
    const WIDTH = 384;
    const HEIGHT = 256;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 광장 지면 그림자
        helpers.drawShadow(10, 14, w - 20, h - 18, 0.28);

        // 2. 광장 잔디 바탕 및 박석 보도블록 (Flagstone Pathway)
        // 박석 보도 (좌측 진입로에서 정자로 이어지는 돌길)
        const pathPoints = [
            { x: 20, y: 160, w: 22, h: 14 },
            { x: 44, y: 154, w: 24, h: 16 },
            { x: 70, y: 162, w: 20, h: 14 },
            { x: 92, y: 150, w: 26, h: 16 },
            { x: 120, y: 156, w: 22, h: 14 },
            { x: 144, y: 164, w: 26, h: 16 },
            { x: 172, y: 170, w: 24, h: 14 }
        ];

        pathPoints.forEach(pt => {
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(pt.x + 2, pt.y + 2, pt.w - 4, pt.h - 4);
            ctx.fillStyle = "#475569";
            ctx.strokeRect(pt.x, pt.y, pt.w, pt.h);
        });

        // 3. 전통 팔각정 정자 (중앙: 폭 180px x 높이 190px)
        const pavX = 180;
        const pavY = 32;
        const pavW = 180;
        const pavH = 190;
        const centerX = pavX + Math.floor(pavW / 2);
        const deckY = pavY + pavH - 54;

        // 정자 바닥 화강암 기단 (Granite Polygonal Plinth)
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.ellipse(centerX, deckY + 16, 76, 26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.ellipse(centerX, deckY + 12, 72, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // 진입 디딤돌 계단 (Stepping Stones)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(centerX - 18, deckY + 28, 36, 8);
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(centerX - 14, deckY + 30, 28, 4);

        // 원목 대청마루 바닥 (Polished Wooden Deck)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, deckY, 68, 22, 0, 0, Math.PI * 2);
        ctx.clip();
        helpers.drawWoodPlanks(pavX + 16, deckY - 24, pavW - 32, 48, "#b45309", "#78350f", 6, false);
        ctx.restore();

        // 마루 둘레 테두리
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, deckY, 68, 22, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 정자 계자난간 (Traditional Wooden Balustrade)
        const railPoints = [-56, -34, -12, 12, 34, 56];
        railPoints.forEach(rx => {
            // 난간 동자살 기둥
            ctx.fillStyle = "#78350f";
            ctx.fillRect(centerX + rx - 2, deckY - 14, 4, 14);
            ctx.fillStyle = "#b45309";
            ctx.fillRect(centerX + rx - 1, deckY - 14, 2, 14);
        });
        // 난간 두벌대 수평목
        ctx.fillStyle = "#451a03";
        ctx.fillRect(centerX - 60, deckY - 16, 120, 3);
        ctx.fillRect(centerX - 56, deckY - 6, 112, 2);

        // 중앙 석조 바둑판 및 석재 의자 (Go Game Table & Stools)
        const tblX = centerX - 12;
        const tblY = deckY - 10;
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(tblX, tblY, 24, 16);
        ctx.fillStyle = "#475569";
        ctx.strokeRect(tblX, tblY, 24, 16);
        // 바둑판 격자 도트
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(tblX + 3, tblY + 3, 18, 10);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(tblX + 6, tblY + 6, 2, 2); // 흑돌
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(tblX + 14, tblY + 8, 2, 2); // 백돌

        // 석재 스툴 (Stone Stools 2개)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(tblX - 14, tblY + 4, 8, 8);
        ctx.fillRect(tblX + 28, tblY + 4, 8, 8);

        // 6개 단청 주홍 칠 원형 기둥 (Vermilion Dancheong Pillars)
        const pillarXOffsets = [-52, -26, 0, 26, 52];
        const roofBaseY = pavY + 54;
        pillarXOffsets.forEach(ox => {
            const px = centerX + ox;
            // 기둥 주초석
            ctx.fillStyle = "#64748b";
            ctx.fillRect(px - 4, deckY - 2, 8, 4);
            // 붉은 기둥 (Vermilion Red Pillar)
            ctx.fillStyle = "#991b1b";
            ctx.fillRect(px - 3, roofBaseY + 6, 6, deckY - (roofBaseY + 6));
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(px - 2, roofBaseY + 6, 2, deckY - (roofBaseY + 6));
            // 기둥 상부 창방 및 주두 (Capital Blocks)
            ctx.fillStyle = "#065f46"; // 비취색 단청
            ctx.fillRect(px - 5, roofBaseY + 2, 10, 6);
            ctx.fillStyle = "#facc15";
            ctx.fillRect(px - 2, roofBaseY + 4, 4, 2);
        });

        // 처마 단청 도리 및 장여 (Dancheong Eaves Beam)
        ctx.fillStyle = "#065f46"; // 짙은 옥색
        ctx.fillRect(centerX - 70, roofBaseY, 140, 6);
        ctx.fillStyle = "#dc2626"; // 주홍색 줄무늬
        ctx.fillRect(centerX - 68, roofBaseY + 2, 136, 2);
        // 연화문 골드 포인트 도트
        for (let d = centerX - 64; d <= centerX + 64; d += 16) {
            ctx.fillStyle = "#facc15";
            ctx.fillRect(d, roofBaseY + 1, 4, 4);
        }

        // 전통 모임 흑기와 지붕 (Hip Roof with Sweeping Eaves)
        const roofH = 50;
        const roofTopY = roofBaseY - roofH;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX - 84, roofBaseY + 6);
        ctx.lineTo(centerX + 84, roofBaseY + 6);
        ctx.lineTo(centerX + 18, roofTopY);
        ctx.lineTo(centerX - 18, roofTopY);
        ctx.closePath();
        ctx.clip();

        helpers.drawRoofTiles(centerX - 86, roofTopY, 172, roofH + 8, "#1e293b", "#64748b", "#0f172a", 12, 8);
        ctx.restore();

        // 추녀 반전 곡선 (Flared Eaves Tips)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(centerX - 88, roofBaseY + 4, 176, 4);
        ctx.fillStyle = "#334155";
        ctx.fillRect(centerX - 86, roofBaseY + 2, 172, 2);

        // 지붕 꼭대기 절병통 (Roof Finial Ornament)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(centerX - 6, roofTopY - 14, 12, 16);
        ctx.fillStyle = "#b45309"; // 호박 모양 청동 절병통
        ctx.beginPath();
        ctx.arc(centerX, roofTopY - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#facc15";
        ctx.fillRect(centerX - 1, roofTopY - 20, 2, 8); // 뽀족한 꼭지

        // 4. 광장 수목: 대형 느티나무 그늘목 (Shady Zelkova Tree: 100px x 110px)
        const treeX = 64;
        const treeY = 24;

        // 나무 밑둥 바닥 그림자
        helpers.drawShadow(treeX - 12, treeY + 104, 70, 18, 0.4);

        // 거목 줄기 (Trunk & Branches)
        ctx.fillStyle = "#451a03";
        ctx.fillRect(treeX + 16, treeY + 64, 16, 46);
        ctx.fillStyle = "#78350f";
        ctx.fillRect(treeX + 18, treeY + 64, 8, 46);
        // 가지 뻗음
        ctx.beginPath();
        ctx.moveTo(treeX + 24, treeY + 70);
        ctx.lineTo(treeX + 6, treeY + 46);
        ctx.lineTo(treeX + 42, treeY + 44);
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 6;
        ctx.stroke();

        // 풍성한 녹색 수관 클러스터 (Dense Foliage Clusters)
        const foliage = [
            { x: treeX + 24, y: treeY + 18, r: 30, c: "#15803d" },
            { x: treeX + 6, y: treeY + 34, r: 24, c: "#166534" },
            { x: treeX + 44, y: treeY + 32, r: 26, c: "#15803d" },
            { x: treeX + 26, y: treeY + 42, r: 28, c: "#14532d" },
            { x: treeX + 22, y: treeY + 12, r: 20, c: "#22c55e" }
        ];

        foliage.forEach(f => {
            ctx.fillStyle = f.c;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // 5. 느티나무 그늘 아래 원목 벤치 (Park Wooden Bench)
        const bncX = treeX - 4;
        const bncY = treeY + 110;
        const bncW = 54;
        const bncH = 22;

        ctx.fillStyle = "#1e293b"; // 주물 다리
        ctx.fillRect(bncX + 4, bncY + 10, 4, 12);
        ctx.fillRect(bncX + bncW - 8, bncY + 10, 4, 12);
        // 원목 등받이 및 좌판 (Wood Slats)
        helpers.drawWoodPlanks(bncX, bncY, bncW, 8, "#d97706", "#92400e", 3, false);
        helpers.drawWoodPlanks(bncX + 2, bncY + 9, bncW - 4, 6, "#b45309", "#78350f", 3, false);

        // 6. 마을 유래비 표지석 (Historic Memorial Monument Stone)
        const stnX = 126;
        const stnY = 176;
        const stnW = 32;
        const stnH = 48;

        // 화강석 받침대
        ctx.fillStyle = "#475569";
        ctx.fillRect(stnX - 4, stnY + stnH - 10, stnW + 8, 10);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(stnX - 2, stnY + stnH - 10, stnW + 4, 3);

        // 자연석 비석 몸체 (Natural Stele Stone)
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(stnX + 4, stnY + stnH - 10);
        ctx.lineTo(stnX + stnW - 4, stnY + stnH - 10);
        ctx.lineTo(stnX + stnW, stnY + 8);
        ctx.lineTo(stnX + stnW / 2, stnY);
        ctx.lineTo(stnX, stnY + 12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(stnX + 4, stnY + 10, stnW - 8, stnH - 22);

        // 음각 한자/한글 각석 ("화합의 마당")
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(stnX + 12, stnY + 14, 8, 2);
        ctx.fillRect(stnX + 10, stnY + 20, 12, 2);
        ctx.fillRect(stnX + 13, stnY + 26, 6, 2);
        ctx.fillRect(stnX + 11, stnY + 32, 10, 2);
    });
})();
