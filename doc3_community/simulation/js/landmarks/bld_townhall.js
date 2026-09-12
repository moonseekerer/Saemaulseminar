/**
 * bld_townhall.js
 * 마을회관 청사 (16 x 10 타일: 512 x 320 px)
 * 한식 청기와 팔작지붕, 서까래 처마, 화강암 기단, 현판, 국기게양대, 확성기, 게시판 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "hall";
    const WIDTH = 512;
    const HEIGHT = 320;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자 (Drop Shadow)
        helpers.drawShadow(8, 22, w - 16, h - 16, 0.35);

        // 2. 화강암 기단 석축 (Granite Foundation Base)
        const baseY = h - 36;
        const baseH = 36;
        helpers.drawBrickWall(16, baseY, w - 32, baseH, "#64748b", "#334155", 24, 12, true);
        // 기단 상단 마감 화강석 띠 (Base Coping)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(14, baseY, w - 28, 4);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(14, baseY + 3, w - 28, 1);

        // 3. 본체 외벽 (Main Building Facade - 2층 구조)
        const wallX = 32;
        const wallY = 88;
        const wallW = w - 64;
        const wallH = baseY - wallY;

        // 벽돌 외벽 (차분한 베이지/연회색 계열 행정 복합석조)
        helpers.drawBrickWall(wallX, wallY, wallW, wallH, "#cbd5e1", "#94a3b8", 16, 8, true);

        // 기둥 필라스터 (좌우 및 중앙 대리석 기둥 4개)
        const pillarCols = [wallX, wallX + 110, wallX + wallW - 134, wallX + wallW - 24];
        pillarCols.forEach(px => {
            ctx.fillStyle = "#e2e8f0";
            ctx.fillRect(px, wallY, 24, wallH);
            ctx.fillStyle = "#64748b";
            ctx.fillRect(px, wallY, 2, wallH);
            ctx.fillRect(px + 22, wallY, 2, wallH);
            // 기둥 주두/주초 (Pillar Cap & Base)
            ctx.fillStyle = "#475569";
            ctx.fillRect(px - 2, wallY, 28, 6);
            ctx.fillRect(px - 2, wallY + wallH - 6, 28, 6);
        });

        // 1층/2층 구분 층간 띠 (Floor Molding)
        const midY = wallY + Math.floor(wallH / 2) - 4;
        ctx.fillStyle = "#475569";
        ctx.fillRect(wallX, midY, wallW, 8);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(wallX, midY, wallW, 2);

        // 4. 창문 배치 (Windows Layout - 1층 4조, 2층 6조)
        // 2층 창문들 (행정 회의실 / 방송실)
        const winY2 = wallY + 14;
        const winW = 38;
        const winH = 34;
        const win2XOffsets = [65, 120, 175, 230, 285, 340, 395];
        win2XOffsets.forEach(ox => {
            if (ox > 190 && ox < 270) return; // 중앙 현판/계양대 영역 제외
            helpers.drawGlassWindow(ox, winY2, winW, winH, "#1e293b", "#38bdf8", "rgba(255, 255, 255, 0.45)");
        });

        // 1층 창문들 (사무공간)
        const winY1 = midY + 18;
        const win1XOffsets = [65, 120, 340, 395];
        win1XOffsets.forEach(ox => {
            helpers.drawGlassWindow(ox, winY1, winW, winH, "#1e293b", "#38bdf8", "rgba(255, 255, 255, 0.45)");
        });

        // 5. 중앙 주출입구 현관 (Main Glass Entrance & Canopy)
        const entryW = 96;
        const entryX = Math.floor((w - entryW) / 2);
        const entryY = baseY - 56;
        const entryH = 56;

        // 출입구 전면 포치 프레임 (Porch Frame)
        ctx.fillStyle = "#334155";
        ctx.fillRect(entryX, entryY, entryW, entryH);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(entryX + 2, entryY + 2, entryW - 4, entryH - 2);

        // 자동 유리 미닫이문 (Double Sliding Glass Doors)
        const doorW = 38;
        const doorH = 46;
        const doorY = entryY + 10;
        helpers.drawGlassWindow(entryX + 8, doorY, doorW, doorH, "#64748b", "#7dd3fc", "rgba(255,255,255,0.5)");
        helpers.drawGlassWindow(entryX + 50, doorY, doorW, doorH, "#64748b", "#7dd3fc", "rgba(255,255,255,0.5)");

        // 문 손잡이
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(entryX + 42, doorY + 18, 3, 12);
        ctx.fillRect(entryX + 51, doorY + 18, 3, 12);

        // 상단 안내 문구 "새마을 행복회관" 픽셀 바
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(entryX + 6, entryY + 3, entryW - 12, 6);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(entryX + 8, entryY + 5, entryW - 16, 2);

        // 진입 계단 및 휠체어 경사로 (Stone Steps)
        ctx.fillStyle = "#475569";
        ctx.fillRect(entryX - 10, baseY - 2, entryW + 20, 10);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(entryX - 6, baseY + 6, entryW + 12, 10);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(entryX - 2, baseY + 14, entryW + 4, 10);

        // 적색 웰컴 발판매트
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(entryX + 16, baseY + 20, entryW - 32, 8);
        ctx.fillStyle = "#7f1d1d";
        ctx.fillRect(entryX + 18, baseY + 22, entryW - 36, 4);

        // 스테인리스 핸드레일 난간
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(entryX - 8, baseY - 6, 2, 28);
        ctx.fillRect(entryX + entryW + 6, baseY - 6, 2, 28);
        ctx.fillRect(entryX - 8, baseY - 6, 8, 2);
        ctx.fillRect(entryX + entryW, baseY - 6, 8, 2);

        // 6. 처마 서까래 (Traditional Wooden Rafters)
        const rafterY = wallY - 10;
        const rafterCount = 38;
        const rafterStep = Math.floor(wallW / rafterCount);
        ctx.fillStyle = "#78350f"; // 원목 갈색
        ctx.fillRect(wallX - 8, rafterY, wallW + 16, 10);
        for (let i = 0; i <= rafterCount; i++) {
            const rx = wallX - 6 + i * rafterStep;
            ctx.fillStyle = "#b45309";
            ctx.fillRect(rx, rafterY, 4, 10);
            ctx.fillStyle = "#451a03";
            ctx.fillRect(rx + 3, rafterY, 1, 10);
        }

        // 7. 한식 청기와 팔작지붕 (Traditional Blue Glazed Tile Roof)
        // 처마 곡선 및 지붕 구조
        const roofBaseY = wallY - 10;
        const roofH = 68;
        const roofTopY = roofBaseY - roofH;

        // 지붕 밑바탕
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(12, roofBaseY + 6);
        ctx.lineTo(w - 12, roofBaseY + 6);
        ctx.lineTo(w - 60, roofTopY);
        ctx.lineTo(60, roofTopY);
        ctx.closePath();
        ctx.clip();

        // 청기와 텍스처 전개
        helpers.drawRoofTiles(12, roofTopY, w - 24, roofH + 8, "#1e3a8a", "#60a5fa", "#0f172a", 14, 10);
        ctx.restore();

        // 추녀 및 처마선 마감 곡선 (Upturned Eaves Edges)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(10, roofBaseY + 4, w - 20, 4);
        ctx.fillStyle = "#1e40af";
        ctx.fillRect(12, roofBaseY + 2, w - 24, 2);

        // 용마루 (Main Roof Ridge)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(56, roofTopY - 6, w - 112, 10);
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(58, roofTopY - 5, w - 116, 4);
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(60, roofTopY - 4, w - 120, 2);

        // 용마루 좌우 망와/치미 (End Ridge Ornaments)
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(52, roofTopY - 12, 8, 14);
        ctx.fillRect(w - 60, roofTopY - 12, 8, 14);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(54, roofTopY - 10, 4, 4);
        ctx.fillRect(w - 58, roofTopY - 10, 4, 4);

        // 지붕 그림자 (Wall Drop Shadow from Roof)
        ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
        ctx.fillRect(wallX, wallY, wallW, 8);

        // 8. 마을회관 공식 현판 (Official Signboard Plaque)
        const plaqueW = 104;
        const plaqueH = 26;
        const plaqueX = Math.floor((w - plaqueW) / 2);
        const plaqueY = wallY + 12;

        // 원목 액자 프레임
        ctx.fillStyle = "#451a03";
        ctx.fillRect(plaqueX - 2, plaqueY - 2, plaqueW + 4, plaqueH + 4);
        ctx.fillStyle = "#b45309";
        ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);
        ctx.fillStyle = "#1e1b4b"; // 짙은 먹색 바닥
        ctx.fillRect(plaqueX + 3, plaqueY + 3, plaqueW - 6, plaqueH - 6);

        // 금박 글씨 (마을회관 픽셀 렌더)
        ctx.fillStyle = "#fde047";
        ctx.font = "bold 13px 'Pretendard', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("새 마 을 회 관", plaqueX + plaqueW / 2, plaqueY + plaqueH / 2 + 1);

        // 9. 국기 게양대 (태극기 & 새마을기)
        // 2층 옥상 게양대 폴 (중앙 지붕 위)
        const poleX1 = plaqueX + 16;
        const poleX2 = plaqueX + plaqueW - 16;
        const poleY = roofTopY - 30;

        // 태극기 (좌측)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(poleX1, poleY, 2, 28);
        ctx.fillStyle = "#fbbf24"; // 금색 볼
        ctx.fillRect(poleX1 - 1, poleY - 3, 4, 3);
        // 태극기 펄럭임
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(poleX1 + 2, poleY + 2, 20, 14);
        ctx.fillStyle = "#0f172a";
        ctx.strokeRect(poleX1 + 2, poleY + 2, 20, 14);
        // 태극 문양 (적/청)
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(poleX1 + 9, poleY + 6, 6, 3);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(poleX1 + 9, poleY + 9, 6, 3);
        // 4괘
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(poleX1 + 4, poleY + 4, 3, 2);
        ctx.fillRect(poleX1 + 15, poleY + 4, 3, 2);
        ctx.fillRect(poleX1 + 4, poleY + 12, 3, 2);
        ctx.fillRect(poleX1 + 15, poleY + 12, 3, 2);

        // 새마을기 (우측)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(poleX2, poleY, 2, 28);
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(poleX2 - 1, poleY - 3, 4, 3);
        // 녹색 깃발
        ctx.fillStyle = "#15803d";
        ctx.fillRect(poleX2 + 2, poleY + 2, 20, 14);
        ctx.fillStyle = "#0f172a";
        ctx.strokeRect(poleX2 + 2, poleY + 2, 20, 14);
        // 새마을 노란 싹 심볼
        ctx.fillStyle = "#facc15";
        ctx.fillRect(poleX2 + 8, poleY + 5, 8, 8);
        ctx.fillStyle = "#15803d";
        ctx.fillRect(poleX2 + 10, poleY + 5, 4, 4);

        // 10. 옥상 확성기 스피커 탑 (Public PA Horn Loudspeaker)
        const spkX = 72;
        const spkY = roofTopY - 18;
        ctx.fillStyle = "#475569";
        ctx.fillRect(spkX, spkY, 3, 22);
        // 좌우 혼형 스피커 2개
        ctx.fillStyle = "#64748b";
        ctx.fillRect(spkX - 8, spkY + 2, 8, 6);
        ctx.fillRect(spkX + 3, spkY + 2, 8, 6);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(spkX - 9, spkY + 1, 2, 8);
        ctx.fillRect(spkX + 10, spkY + 1, 2, 8);

        // 11. 1층 우측 외벽 부착물: 마을 소식 게시판 (Notice Board)
        const boardX = wallX + wallW - 74;
        const boardY = midY + 24;
        const boardW = 54;
        const boardH = 34;

        ctx.fillStyle = "#78350f";
        ctx.fillRect(boardX - 2, boardY - 2, boardW + 4, boardH + 4);
        ctx.fillStyle = "#fef08a"; // 연노랑 코르크/공고 게시판
        ctx.fillRect(boardX, boardY, boardW, boardH);

        // 공고문 종이 쪽지들
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(boardX + 4, boardY + 6, 18, 22);
        ctx.fillRect(boardX + 26, boardY + 6, 22, 14);
        ctx.fillRect(boardX + 26, boardY + 22, 22, 8);
        // 글씨 선 시뮬레이션
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(boardX + 6, boardY + 9, 14, 2);
        ctx.fillRect(boardX + 6, boardY + 13, 12, 2);
        ctx.fillRect(boardX + 6, boardY + 17, 14, 2);

        // 12. 1층 좌측 부착물: 실외기 및 계량기
        const acX = wallX + 28;
        const acY = baseY - 24;
        // 실외기 (Air Conditioner Unit)
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(acX, acY, 26, 20);
        ctx.fillStyle = "#475569";
        ctx.strokeRect(acX, acY, 26, 20);
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.arc(acX + 13, acY + 10, 6, 0, Math.PI * 2);
        ctx.fill();

        // 계량기 함
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(acX + 2, acY - 22, 12, 16);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(acX + 4, acY - 18, 8, 6);

        // 13. 현관 앞 대형 화분 2구 (Terracotta Planters)
        const pot1X = entryX - 26;
        const pot2X = entryX + entryW + 10;
        const potY = baseY + 6;

        [pot1X, pot2X].forEach(px => {
            // 화분 받침 & 몸체
            ctx.fillStyle = "#c2410c";
            ctx.fillRect(px, potY + 8, 16, 12);
            ctx.fillStyle = "#ea580c";
            ctx.fillRect(px - 1, potY + 6, 18, 4);
            // 녹색 관목 픽셀 덩어리
            ctx.fillStyle = "#15803d";
            ctx.fillRect(px - 3, potY - 8, 22, 14);
            ctx.fillStyle = "#22c55e";
            ctx.fillRect(px - 1, potY - 6, 18, 6);
            // 붉은 꽃망울 도트
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(px + 2, potY - 4, 3, 3);
            ctx.fillRect(px + 10, potY - 2, 3, 3);
        });
    });
})();
