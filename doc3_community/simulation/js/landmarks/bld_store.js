/**
 * bld_store.js
 * 오상회 구판장 및 버스정류장 (14 x 9 타일: 448 x 288 px)
 * 레트로 스트라이프 차양막, 담배 간판, 자판기, 아이스크림통, 음료 궤짝,
 * 대형 나무 평상(돗자리/주전자/수박), 농어촌 버스 승강장 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "store";
    const WIDTH = 448;
    const HEIGHT = 288;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자
        helpers.drawShadow(12, 16, w - 24, h - 20, 0.32);

        // 2. 구판장 본체 건물 (좌측 영역: 260px x 190px)
        const bldX = 20;
        const bldY = 52;
        const bldW = 260;
        const bldH = 196;
        const floorY = bldY + bldH;

        // 콘크리트 하단 걸레받이 기단
        ctx.fillStyle = "#475569";
        ctx.fillRect(bldX, floorY - 14, bldW, 14);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(bldX, floorY - 14, bldW, 2);

        // 벽면 벽돌/회벽 (따뜻한 레트로 아이보리/베이지)
        helpers.drawBrickWall(bldX, bldY, bldW, bldH - 14, "#fef3c7", "#e2e8f0", 14, 8, true);

        // 평지붕 슬레이트 옥상 파라펫 (Roof Parapet)
        ctx.fillStyle = "#334155";
        ctx.fillRect(bldX - 4, bldY - 12, bldW + 8, 14);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(bldX - 4, bldY - 12, bldW + 8, 3);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(bldX - 4, bldY + 1, bldW + 8, 1);

        // 옥상 TV 안테나 및 장독대
        // V자형 구형 실외 TV 안테나
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(bldX + 30, bldY - 32, 2, 20);
        ctx.beginPath();
        ctx.moveTo(bldX + 22, bldY - 38);
        ctx.lineTo(bldX + 31, bldY - 32);
        ctx.lineTo(bldX + 40, bldY - 38);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. 구판장 메인 간판 (Main Store Sign)
        const signW = 190;
        const signH = 30;
        const signX = bldX + 35;
        const signY = bldY + 8;

        // 간판 프레임 (레트로 적갈색 & 골드)
        ctx.fillStyle = "#7f1d1d";
        ctx.fillRect(signX - 2, signY - 2, signW + 4, signH + 4);
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(signX, signY, signW, signH);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(signX + 4, signY + 4, signW - 8, signH - 8);

        // 간판 텍스트 "오 상 회 구 판 장"
        ctx.fillStyle = "#991b1b";
        ctx.font = "bold 13px 'Pretendard', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("오 상 회  구 판 장", signX + signW / 2, signY + signH / 2);

        // 4. 레트로 스트라이프 비닐 차양막 (Striped Vinyl Awning)
        const awnX = bldX + 10;
        const awnY = signY + signH + 6;
        const awnW = bldW - 20;
        const awnH = 36;

        const stripeCount = 18;
        const stripeW = Math.floor(awnW / stripeCount);
        for (let i = 0; i < stripeCount; i++) {
            const sx = awnX + i * stripeW;
            const isGreen = (i % 2 === 0);
            ctx.fillStyle = isGreen ? "#15803d" : "#f8fafc";
            ctx.fillRect(sx, awnY, stripeW, awnH);

            // 차양막 주름 음영
            ctx.fillStyle = isGreen ? "#14532d" : "#cbd5e1";
            ctx.fillRect(sx + stripeW - 2, awnY, 2, awnH);

            // 하단 스캘럽 물결(Valance)
            ctx.fillStyle = isGreen ? "#15803d" : "#f8fafc";
            ctx.beginPath();
            ctx.arc(sx + stripeW / 2, awnY + awnH, stripeW / 2, 0, Math.PI);
            ctx.fill();
        }

        // 차양막 지지 철골 파이프
        ctx.fillStyle = "#475569";
        ctx.fillRect(awnX, awnY + awnH + 2, 2, 14);
        ctx.fillRect(awnX + awnW - 2, awnY + awnH + 2, 2, 14);

        // 5. 점포 진열창 및 미닫이 출입문 (Shopfront Windows & Sliding Door)
        const winY = awnY + awnH + 8;
        const winH = 74;

        // 좌측 진열 쇼윈도 (Showcase Window)
        const showX = bldX + 16;
        const showW = 120;
        helpers.drawGlassWindow(showX, winY, showW, winH, "#334155", "#0284c7", "rgba(255, 255, 255, 0.35)");

        // 쇼윈도 내부 진열 상품들 (스낵 과자 봉지, 소주병 도트)
        // 1단 선반
        ctx.fillStyle = "#64748b";
        ctx.fillRect(showX + 4, winY + 28, showW - 8, 3);
        ctx.fillRect(showX + 4, winY + 52, showW - 8, 3);

        // 진열 상품 도트들 (과자, 캔, 라면)
        const snackColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];
        for (let s = 0; s < 7; s++) {
            ctx.fillStyle = snackColors[s % snackColors.length];
            ctx.fillRect(showX + 10 + s * 15, winY + 12, 11, 14);
            // 초록 소주병 및 맥주캔 도트
            ctx.fillStyle = "#16a34a";
            ctx.fillRect(showX + 12 + s * 15, winY + 36, 5, 14);
            ctx.fillStyle = "#e2e8f0";
            ctx.fillRect(showX + 13 + s * 15, winY + 33, 3, 3);
        }

        // 우측 유리 미닫이 출입문 (Sliding Entrance Door)
        const doorX = showX + showW + 12;
        const doorW = 86;
        helpers.drawGlassWindow(doorX, winY, doorW, winH, "#334155", "#7dd3fc", "rgba(255, 255, 255, 0.45)");
        // 문 손잡이
        ctx.fillStyle = "#eab308";
        ctx.fillRect(doorX + 38, winY + 30, 4, 16);
        ctx.fillRect(doorX + 44, winY + 30, 4, 16);

        // 6. 점포 외벽 상징 소품들 (담배 간판, 자판기, 아이스크림통)
        // [원형 담배 간판 (Classic Korean Tobacco Sign)]
        const tobX = bldX + 6;
        const tobY = winY - 2;
        ctx.fillStyle = "#1e3a8a"; // 외곽 파랑원
        ctx.beginPath();
        ctx.arc(tobX + 10, tobY + 10, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(tobX + 10, tobY + 10, 9, 0, Math.PI * 2);
        ctx.fill();
        // 담배 붉은 한글 도트
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 9px 'Pretendard', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("담배", tobX + 10, tobY + 10);

        // [음료 캔 자판기 (Beverage Vending Machine)]
        const vendX = bldX + bldW - 62;
        const vendY = winY + 4;
        const vendW = 38;
        const vendH = 68;

        // 자판기 본체 (선명한 코카콜라 레드)
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(vendX, vendY, vendW, vendH);
        ctx.fillStyle = "#7f1d1d";
        ctx.strokeRect(vendX, vendY, vendW, vendH);

        // 자판기 디스플레이 창 (glowing window)
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(vendX + 4, vendY + 6, vendW - 8, 26);
        // 진열 캔 미니어처
        const canColors = ["#ef4444", "#3b82f6", "#eab308", "#10b981"];
        canColors.forEach((cc, ci) => {
            ctx.fillStyle = cc;
            ctx.fillRect(vendX + 7 + ci * 6, vendY + 12, 4, 8);
            ctx.fillStyle = "#22c55e"; // 선택 버튼 초록불
            ctx.fillRect(vendX + 7 + ci * 6, vendY + 24, 4, 3);
        });

        // 투입구 및 캔 배출구
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(vendX + vendW - 12, vendY + 36, 6, 2); // 동전 투입구
        ctx.fillRect(vendX + 6, vendY + vendH - 18, vendW - 12, 12); // 배출 트레이
        ctx.fillStyle = "#475569";
        ctx.fillRect(vendX + 8, vendY + vendH - 14, vendW - 16, 4);

        // [가로형 아이스크림 냉동고 (Ice Cream Freezer Chest)]
        const iceX = showX + 4;
        const iceY = floorY - 26;
        const iceW = 60;
        const iceH = 26;

        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(iceX, iceY, iceW, iceH);
        ctx.fillStyle = "#2563eb";
        ctx.strokeRect(iceX, iceY, iceW, iceH);
        // 상단 슬라이딩 푸른 유리 뚜껑
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(iceX + 2, iceY + 2, iceW - 4, 8);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(iceX + 6, iceY + 4, 18, 2);
        // 빙과류 스티커 로고
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(iceX + 8, iceY + 14, 18, 6);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(iceX + 30, iceY + 14, 18, 6);

        // [플라스틱 음료 궤짝 적재함 (Beverage Crates)]
        const crtX = vendX - 24;
        const crtY = floorY - 24;
        // 1단 노란 궤짝
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(crtX, crtY + 12, 20, 12);
        ctx.fillStyle = "#854d0e";
        ctx.strokeRect(crtX, crtY + 12, 20, 12);
        // 2단 파란 궤짝
        ctx.fillStyle = "#1d4ed8";
        ctx.fillRect(crtX + 2, crtY, 20, 12);
        ctx.fillStyle = "#1e3a8a";
        ctx.strokeRect(crtX + 2, crtY, 20, 12);

        // [우측 벽면 붉은 우체통 (Red Postbox)]
        const postX = bldX + bldW + 4;
        const postY = winY + 24;
        ctx.fillStyle = "#475569";
        ctx.fillRect(postX + 6, postY + 24, 3, 20); // 지지 기둥
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(postX, postY, 15, 24); // 우체통 몸체
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(postX + 2, postY + 4, 11, 3); // 투입구
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(postX + 4, postY + 12, 7, 7); // 우편제비 마크

        // 7. 대형 원목 평상 및 소품 (Wood Pyungsang & Summer Mat: 120px x 84px)
        const pyX = 300;
        const pyY = 148;
        const pyW = 132;
        const pyH = 88;

        // 평상 바닥 그림자
        helpers.drawShadow(pyX + 4, pyY + 8, pyW, pyH, 0.4);

        // 4개 원목 다리 (Wooden Legs)
        const legH = 22;
        const legW = 8;
        ctx.fillStyle = "#5c2e0b";
        ctx.fillRect(pyX + 4, pyY + pyH - 4, legW, legH);
        ctx.fillRect(pyX + pyW - 12, pyY + pyH - 4, legW, legH);
        ctx.fillRect(pyX + 16, pyY + 14, legW, legH);
        ctx.fillRect(pyX + pyW - 24, pyY + 14, legW, legH);

        // 원목 상판 프레임 및 나뭇결 (Wood Grain Planks)
        helpers.drawWoodPlanks(pyX, pyY, pyW, pyH, "#b45309", "#78350f", 12, false);
        // 상판 모서리 베벨 음영
        ctx.fillStyle = "#451a03";
        ctx.fillRect(pyX, pyY + pyH - 2, pyW, 2);
        ctx.fillRect(pyX + pyW - 2, pyY, 2, pyH);

        // 평상 위 왕골 돗자리 (Woven Straw Mat)
        const matX = pyX + 12;
        const matY = pyY + 10;
        const matW = pyW - 28;
        const matH = pyH - 22;
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(matX, matY, matW, matH);
        // 돗자리 십자 엮음 격자 질감
        ctx.fillStyle = "#fde68a";
        for (let my = matY; my < matY + matH; my += 4) {
            ctx.fillRect(matX, my, matW, 1);
        }
        for (let mx = matX; mx < matX + matW; mx += 6) {
            ctx.fillRect(mx, matY, 1, matH);
        }
        // 돗자리 청색 테두리
        ctx.fillStyle = "#2563eb";
        ctx.strokeRect(matX, matY, matW, matH);

        // [평상 위 소품: 양은 주전자 + 막걸리 사발 + 수박 조각]
        // 노란 양은 주전자 (Tin Kettle)
        const ketX = matX + 14;
        const ketY = matY + 14;
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(ketX, ketY + 4, 14, 11);
        ctx.fillStyle = "#d97706";
        ctx.strokeRect(ketX, ketY + 4, 14, 11);
        // 주전자 뚜껑 및 손잡이
        ctx.fillRect(ketX + 4, ketY + 1, 6, 3);
        ctx.fillRect(ketX - 4, ketY + 6, 4, 3); // 주둥이
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 1;
        ctx.strokeRect(ketX + 2, ketY - 4, 10, 6);

        // 막걸리 사발 (Brass Bowls)
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(ketX + 24, ketY + 12, 6, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(ketX + 20, ketY + 9, 8, 3); // 막걸리 흰빛

        // 수박 조각 도트 (Watermelon Slice)
        const wmX = matX + matW - 32;
        const wmY = matY + 16;
        ctx.fillStyle = "#15803d"; // 수박 껍질
        ctx.beginPath();
        ctx.arc(wmX + 8, wmY + 6, 10, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = "#ef4444"; // 붉은 과육
        ctx.beginPath();
        ctx.arc(wmX + 8, wmY + 5, 8, 0, Math.PI);
        ctx.fill();
        // 수박씨
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(wmX + 6, wmY + 8, 1, 2);
        ctx.fillRect(wmX + 10, wmY + 7, 1, 2);

        // 8. 시내버스 정류장 쉘터 (Rural Bus Stop: 110px x 68px)
        const busX = 306;
        const busY = 32;
        const busW = 120;
        const busH = 76;

        // 버스 승강장 아치형 슬레이트 지붕
        ctx.fillStyle = "#475569";
        ctx.fillRect(busX, busY, busW, 14);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(busX, busY, busW, 3);

        // 강철 프레임 기둥
        ctx.fillStyle = "#334155";
        ctx.fillRect(busX + 4, busY + 14, 4, busH - 14);
        ctx.fillRect(busX + busW - 8, busY + 14, 4, busH - 14);

        // 승강장 벤치 (Weathered Metal Bench)
        const benchY = busY + busH - 24;
        ctx.fillStyle = "#ea580c";
        ctx.fillRect(busX + 12, benchY, busW - 24, 6);
        ctx.fillStyle = "#9a3412";
        ctx.fillRect(busX + 12, benchY + 6, 4, 14);
        ctx.fillRect(busX + busW - 16, benchY + 6, 4, 14);

        // 승강장 버스 노선도 안내판
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(busX + 20, busY + 18, 48, 22);
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(busX + 22, busY + 20, 44, 4);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(busX + 22, busY + 27, 40, 2);
        ctx.fillRect(busX + 22, busY + 31, 32, 2);
        ctx.fillRect(busX + 22, busY + 35, 36, 2);

        // 원형 버스 표지판 폴 (Round Bus Sign Pole)
        const poleX = busX - 16;
        const poleY = busY + 8;
        ctx.fillStyle = "#475569";
        ctx.fillRect(poleX + 7, poleY + 20, 3, 56); // 폴대
        // 원형 표지판
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(poleX + 8, poleY + 14, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(poleX + 8, poleY + 14, 9, 0, Math.PI * 2);
        ctx.fill();
        // 버스 심볼 도트
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(poleX + 3, poleY + 10, 10, 8);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(poleX + 5, poleY + 12, 6, 3);
    });
})();
