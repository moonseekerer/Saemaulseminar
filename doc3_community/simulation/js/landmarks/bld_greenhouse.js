/**
 * bld_greenhouse.js
 * 스마트팜 혁신단지 (22 x 14 타일: 704 x 448 px)
 * 3연동 아치형 폴리카보네이트 스마트 온실, 고설 양액재배 딸기 베드 실루엣,
 * LED 보광등, 순환팬, ICT 환경제어 컨테이너, 양액 배양 탱크, 기상 관측 마스트, 태양광 패널 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "greenhouse";
    const WIDTH = 704;
    const HEIGHT = 448;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자
        helpers.drawShadow(16, 20, w - 32, h - 24, 0.3);

        // 2. 3연동 아치형 스마트 온실 본체 (좌측 480px 영역)
        const ghX = 24;
        const ghY = 56;
        const ghBayW = 150;
        const ghBayH = 340;
        const bayCount = 3;

        for (let b = 0; b < bayCount; b++) {
            const bx = ghX + b * ghBayW;
            const by = ghY;
            const archTopY = by + 30;
            const floorY = by + ghBayH;

            // 콘크리트 측벽 기단
            ctx.fillStyle = "#64748b";
            ctx.fillRect(bx, floorY - 16, ghBayW, 16);
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(bx, floorY - 16, ghBayW, 2);

            // 온실 내부 반투명 음영 배경 (작물 및 베드가 비치는 효과)
            ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
            ctx.fillRect(bx + 4, archTopY, ghBayW - 8, floorY - archTopY - 16);

            // 내부 설비 실루엣: 고설 양액재배 베드 (4열)
            const bedCount = 4;
            const bedStep = Math.floor((ghBayW - 20) / bedCount);
            for (let bd = 0; bd < bedCount; bd++) {
                const bdx = bx + 12 + bd * bedStep;
                // 베드 스탠드 지지 파이프
                ctx.fillStyle = "#475569";
                ctx.fillRect(bdx + 6, floorY - 90, 3, 74);
                // 양액 거터 트레이
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(bdx, floorY - 100, 16, 12);
                ctx.fillStyle = "#059669";
                ctx.fillRect(bdx - 2, floorY - 114, 20, 16); // 풍성한 작물 잎
                ctx.fillStyle = "#10b981";
                ctx.fillRect(bdx, floorY - 118, 16, 6);
                // 붉은 딸기/토마토 과실 도트
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(bdx + 2, floorY - 106, 3, 3);
                ctx.fillRect(bdx + 10, floorY - 108, 3, 3);
            }

            // 상부 LED 보광등 라인 (LED Grow Light Fixtures)
            ctx.fillStyle = "#334155";
            ctx.fillRect(bx + 8, archTopY + 36, ghBayW - 16, 2);
            for (let l = 0; l < 5; l++) {
                const lx = bx + 18 + l * 26;
                ctx.fillStyle = "#f43f5e"; // 핑크/적색 식물 생장 파장광
                ctx.fillRect(lx, archTopY + 38, 12, 4);
                ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
                ctx.fillRect(lx - 4, archTopY + 42, 20, 24);
            }

            // 상부 공기 순환팬 (Circulation Fans)
            const fanX = bx + Math.floor(ghBayW / 2) - 8;
            const fanY = archTopY + 70;
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.arc(fanX + 8, fanY + 8, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(fanX + 2, fanY + 7, 12, 2);
            ctx.fillRect(fanX + 7, fanY + 2, 2, 12);

            // 아치형 지붕 및 폴리카보네이트 외피 (Polycarbonate Sheeting)
            // 아치 곡면
            ctx.fillStyle = "#0284c7";
            ctx.beginPath();
            ctx.arc(bx + ghBayW / 2, archTopY + 30, ghBayW / 2, Math.PI, 0);
            ctx.strokeStyle = "#0369a1";
            ctx.lineWidth = 4;
            ctx.stroke();

            // 외벽 수직 플루트 골 라인 (Vertical Flutes)
            for (let col = bx + 10; col < bx + ghBayW - 10; col += 10) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
                ctx.fillRect(col, archTopY + 10, 2, floorY - archTopY - 26);
                ctx.fillStyle = "rgba(2, 132, 199, 0.2)";
                ctx.fillRect(col + 2, archTopY + 10, 1, floorY - archTopY - 26);
            }

            // 아치형 철골 트러스 구조선 (Steel Arches & Diagonal Braces)
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bx + 4, floorY - 16);
            ctx.lineTo(bx + 4, archTopY + 20);
            ctx.lineTo(bx + ghBayW / 2, by + 4);
            ctx.lineTo(bx + ghBayW - 4, archTopY + 20);
            ctx.lineTo(bx + ghBayW - 4, floorY - 16);
            ctx.stroke();

            // 트러스 X자 가새 (K-Truss / Cross Bracing)
            ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
            ctx.lineWidth = 1;
            const braceLevels = [archTopY + 40, archTopY + 110, archTopY + 180, archTopY + 250];
            braceLevels.forEach(byL => {
                ctx.beginPath();
                ctx.moveTo(bx + 6, byL);
                ctx.lineTo(bx + ghBayW - 6, byL + 50);
                ctx.moveTo(bx + ghBayW - 6, byL);
                ctx.lineTo(bx + 6, byL + 50);
                ctx.stroke();
            });

            // 상단 천창 자동 개폐 랙&피니언 환기창 (Ventilation Window)
            ctx.fillStyle = "#0284c7";
            ctx.fillRect(bx + ghBayW / 2 - 24, by, 48, 6);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(bx + ghBayW / 2 - 20, by + 1, 40, 2);

            // 대각선 45도 태양광 반사 하이라이트 (Sky Reflection Glint)
            ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
            ctx.beginPath();
            ctx.moveTo(bx + 20, archTopY + 30);
            ctx.lineTo(bx + 55, archTopY + 30);
            ctx.lineTo(bx + 10, archTopY + 140);
            ctx.lineTo(bx + 4, archTopY + 120);
            ctx.closePath();
            ctx.fill();
        }

        // 3. ICT 스마트 환경제어실 컨테이너 (우측 200px 영역: 190px x 150px)
        const conX = ghX + bayCount * ghBayW + 18;
        const conY = ghY + 140;
        const conW = 186;
        const conH = 150;
        const conFloorY = conY + conH;

        // 콘크리트 패드 기초
        ctx.fillStyle = "#475569";
        ctx.fillRect(conX - 4, conFloorY - 10, conW + 8, 14);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(conX - 4, conFloorY - 10, conW + 8, 2);

        // 컨테이너 본체 외벽 (현대적 모던 화이트/다크그레이 스틸 패널)
        helpers.drawCorrugatedRoof(conX, conY, conW, conH - 10, "#e2e8f0", "#ffffff", "#cbd5e1", 10);
        ctx.fillStyle = "#1e293b";
        ctx.strokeRect(conX, conY, conW, conH - 10);

        // 상단 컨테이너 코너 캐스팅 주물 (Corner Castings)
        ctx.fillStyle = "#334155";
        ctx.fillRect(conX, conY, 12, 12);
        ctx.fillRect(conX + conW - 12, conY, 12, 12);

        // 상단 공식 명판: "스마트 제어실 / ICT SMART FARM"
        const pW = 140;
        const pH = 22;
        const pX = conX + Math.floor((conW - pW) / 2);
        const pY = conY + 10;
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(pX, pY, pW, pH);
        ctx.fillStyle = "#10b981"; // 네온 에메랄드 테두리
        ctx.strokeRect(pX, pY, pW, pH);
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 10px 'Pretendard', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ICT 복합 환경제어실", pX + pW / 2, pY + pH / 2);

        // 제어실 출입문 및 점검창 (Door & Observation Window)
        const cDoorX = conX + 16;
        const cDoorY = conY + 44;
        const cDoorW = 44;
        const cDoorH = conH - 54;
        ctx.fillStyle = "#334155";
        ctx.fillRect(cDoorX, cDoorY, cDoorW, cDoorH);
        helpers.drawGlassWindow(cDoorX + 6, cDoorY + 10, cDoorW - 12, 34, "#1e293b", "#38bdf8", "rgba(255,255,255,0.6)");
        // 도어 핸들
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(cDoorX + cDoorW - 8, cDoorY + 52, 4, 10);

        // 외부 관제 모니터링 패널 (Digital Status Board)
        const panelX = conX + 72;
        const panelY = conY + 44;
        const panelW = 96;
        const panelH = 50;
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.fillStyle = "#475569";
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        // 디스플레이 화면 (LCD Graph & Digits)
        ctx.fillStyle = "#022c22";
        ctx.fillRect(panelX + 4, panelY + 4, panelW - 8, panelH - 8);
        // 상태 텍스트 & 그래프 도트
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(panelX + 8, panelY + 8, 4, 4); // 통신 정상 초록불
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(panelX + 16, panelY + 8, 4, 4); // 양액 공급중 파란불
        ctx.fillStyle = "#facc15";
        ctx.fillRect(panelX + 24, panelY + 8, 4, 4); // 환기팬 가동 노란불
        // 그래프 라인 시뮬레이션
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(panelX + 8, panelY + 30);
        ctx.lineTo(panelX + 24, panelY + 24);
        ctx.lineTo(panelX + 44, panelY + 28);
        ctx.lineTo(panelX + 64, panelY + 18);
        ctx.lineTo(panelX + 84, panelY + 22);
        ctx.stroke();

        // 4. 양액 탱크 스테이션 (Twin Fertigation Tanks: A/B 배양액 원통 탱크)
        const tnkX = conX + 10;
        const tnkY = conFloorY + 12;
        const tnkW = 38;
        const tnkH = 64;

        // 탱크 A (좌측)
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(tnkX, tnkY, tnkW, tnkH);
        ctx.fillStyle = "#1d4ed8";
        ctx.strokeRect(tnkX, tnkY, tnkW, tnkH);
        // 수위 게이지 (Liquid Level Sight Glass)
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(tnkX + tnkW - 8, tnkY + 6, 4, tnkH - 12);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("A", tnkX + 10, tnkY + 24);

        // 탱크 B (우측)
        const tnk2X = tnkX + tnkW + 12;
        ctx.fillStyle = "#10b981";
        ctx.fillRect(tnk2X, tnkY, tnkW, tnkH);
        ctx.fillStyle = "#047857";
        ctx.strokeRect(tnk2X, tnkY, tnkW, tnkH);
        ctx.fillStyle = "#a7f3d0";
        ctx.fillRect(tnk2X + tnkW - 8, tnkY + 6, 4, tnkH - 12);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("B", tnk2X + 10, tnkY + 24);

        // 탱크 연결 PVC 배관 라인 (PVC Manifold Piping)
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tnkX + tnkW / 2, tnkY);
        ctx.lineTo(tnkX + tnkW / 2, tnkY - 14);
        ctx.lineTo(conX + 4, tnkY - 14);
        ctx.lineTo(conX + 4, ghY + ghBayH - 24);
        ctx.lineTo(ghX + ghBayW * 2, ghY + ghBayH - 24);
        ctx.stroke();

        // 5. 컨테이너 옥상 시설: 기상 관측 마스트 및 태양광 패널
        // [옥상 기상 관측 마스트 (Weather Station)]
        const mastX = conX + 30;
        const mastY = conY - 60;
        ctx.fillStyle = "#64748b";
        ctx.fillRect(mastX, mastY, 3, 60); // 마스트 봉
        // 풍향계 (Wind Vane) 화살표
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(mastX - 10, mastY + 4, 24, 3);
        ctx.beginPath();
        ctx.moveTo(mastX + 14, mastY + 1);
        ctx.lineTo(mastX + 20, mastY + 5);
        ctx.lineTo(mastX + 14, mastY + 9);
        ctx.fill();
        // 3컵 풍속계 (Anemometer)
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(mastX - 8, mastY + 16, 18, 2);
        ctx.beginPath();
        ctx.arc(mastX - 8, mastY + 17, 3, 0, Math.PI * 2);
        ctx.arc(mastX + 10, mastY + 17, 3, 0, Math.PI * 2);
        ctx.fill();

        // [옥상 태양광 패널 모듈 (Solar Photovoltaic Array)]
        const pvX = conX + 54;
        const pvY = conY - 26;
        const pvW = 114;
        const pvH = 22;

        ctx.fillStyle = "#1e293b";
        ctx.fillRect(pvX, pvY, pvW, pvH);
        ctx.fillStyle = "#334155";
        ctx.strokeRect(pvX, pvY, pvW, pvH);

        // 6개 태양광 셀 격자
        const cellW = Math.floor((pvW - 8) / 6);
        for (let c = 0; c < 6; c++) {
            const cx = pvX + 4 + c * cellW;
            ctx.fillStyle = "#1e3a8a"; // 짙은 단결정 블루
            ctx.fillRect(cx, pvY + 3, cellW - 2, pvH - 6);
            ctx.fillStyle = "#60a5fa"; // 실버 버스바 라인
            ctx.fillRect(cx + cellW / 2 - 1, pvY + 3, 1, pvH - 6);
        }
    });
})();
