/**
 * bld_cafe.js
 * 청년 로컬공방 & 카페 (12 x 8 타일: 384 x 256 px)
 * 구옥 리모델링 모던 한옥 카페, 파노라마 통유리창(실내 앰버 조명 & 에스프레소 머신 실루엣),
 * 야외 원목 데크 테라스, 캔버스 파라솔, 감성 알전구 스트링 라이트, 분필 입간판 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "cafe";
    const WIDTH = 384;
    const HEIGHT = 256;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자
        helpers.drawShadow(12, 16, w - 24, h - 20, 0.3);

        // 2. 카페 본관 건물 (좌측 영역: 210px x 190px)
        const bldX = 18;
        const bldY = 44;
        const bldW = 216;
        const bldH = 190;
        const floorY = bldY + bldH;

        // 콘크리트 및 화강석 기초
        ctx.fillStyle = "#334155";
        ctx.fillRect(bldX, floorY - 14, bldW, 14);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(bldX, floorY - 14, bldW, 2);

        // 건물 벽면: 삼나무 수직 목재 루버 패널 (Warm Cedar Vertical Siding)
        helpers.drawWoodPlanks(bldX, bldY, bldW, bldH - 14, "#d97706", "#92400e", 8, true);

        // 모던 매트블랙 코너 및 테두리 프레임
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(bldX, bldY, 6, bldH - 14);
        ctx.fillRect(bldX + bldW - 6, bldY, 6, bldH - 14);

        // 3. 모던 다크 슬레이트 박공 지붕 (Gable Roof)
        const roofH = 46;
        const roofY = bldY - 14;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bldX - 8, roofY + roofH);
        ctx.lineTo(bldX + bldW / 2, roofY);
        ctx.lineTo(bldX + bldW + 8, roofY + roofH);
        ctx.closePath();
        ctx.clip();

        helpers.drawRoofTiles(bldX - 10, roofY, bldW + 20, roofH + 6, "#1e293b", "#475569", "#0f172a", 14, 8);
        ctx.restore();

        // 박공 지붕 처마 트림
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(bldX - 10, roofY + roofH - 2, bldW + 20, 4);

        // 지붕 위 작은 굴뚝 (Tiny Brick Chimney)
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(bldX + bldW - 38, roofY + 6, 14, 18);
        ctx.fillStyle = "#451a03";
        ctx.fillRect(bldX + bldW - 40, roofY + 4, 18, 3);

        // 4. 카페 세련된 미니멀 간판: "오상 청년공방 & 카페"
        const signW = 140;
        const signH = 22;
        const signX = bldX + Math.floor((bldW - signW) / 2);
        const signY = bldY + 36;

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(signX, signY, signW, signH);
        ctx.fillStyle = "#f59e0b"; // 웜 앰버 골드 테두리
        ctx.strokeRect(signX, signY, signW, signH);
        ctx.fillStyle = "#fef3c7";
        ctx.font = "bold 10px 'Pretendard', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("오상 청년공방 & 카페", signX + signW / 2, signY + signH / 2);

        // 5. 파노라마 대형 통유리창 및 실내 인테리어 실루엣
        const winX = bldX + 16;
        const winY = signY + signH + 12;
        const winW = 120;
        const winH = 88;

        // 따뜻한 실내 앰버 조명 (Warm Amber Ambient Light)
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
        ctx.fillRect(winX, winY, winW, winH);

        // 실내 에스프레소 머신 & 카운터 바 실루엣
        ctx.fillStyle = "#78350f";
        ctx.fillRect(winX + 10, winY + 46, winW - 20, 42); // 우드 바 카운터
        // 메탈 에스프레소 머신 실루엣
        ctx.fillStyle = "#475569";
        ctx.fillRect(winX + 24, winY + 30, 28, 18);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(winX + 26, winY + 32, 8, 4);
        // 펜던트 조명등 2구
        [winX + 40, winX + 80].forEach(lx => {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(lx, winY, 1, 14); // 전선
            ctx.fillStyle = "#f59e0b"; // 전구 갓
            ctx.beginPath();
            ctx.arc(lx + 0.5, winY + 16, 5, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(lx - 1, winY + 16, 3, 3);
        });

        // 유리창 외곽 매트블랙 격자 프레임
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 3;
        ctx.strokeRect(winX, winY, winW, winH);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.stroke();

        // 유리 45도 반사광
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.moveTo(winX + 14, winY + 4);
        ctx.lineTo(winX + 44, winY + 4);
        ctx.lineTo(winX + 4, winY + 44);
        ctx.lineTo(winX + 4, winY + 14);
        ctx.closePath();
        ctx.fill();

        // 6. 모던 유리 출입문 (Entrance Door)
        const doorX = winX + winW + 12;
        const doorY = winY;
        const doorW = 52;
        const doorH = bldH - 74;

        helpers.drawGlassWindow(doorX, doorY, doorW, doorH, "#0f172a", "#38bdf8", "rgba(255,255,255,0.45)");
        // 원목 도어 세로 손잡이
        ctx.fillStyle = "#b45309";
        ctx.fillRect(doorX + 8, doorY + 32, 4, 26);

        // 7. 야외 원목 데크 테라스 (우측 영역: 130px x 110px)
        const dckX = 244;
        const dckY = 120;
        const dckW = 126;
        const dckH = 104;

        // 데크 바닥 그림자
        helpers.drawShadow(dckX + 4, dckY + 6, dckW, dckH, 0.35);

        // 방부목 데크 플로어링 (Treated Wood Decking)
        helpers.drawWoodPlanks(dckX, dckY, dckW, dckH, "#b45309", "#78350f", 8, false);
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 2;
        ctx.strokeRect(dckX, dckY, dckW, dckH);

        // 테라스 원형 비스트로 테이블 & 체어 (Bistro Table & Chairs)
        const tblX = dckX + 64;
        const tblY = dckY + 54;
        ctx.fillStyle = "#334155";
        ctx.fillRect(tblX - 2, tblY, 4, 16); // 테이블 다리
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.ellipse(tblX, tblY, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#cbd5e1";
        ctx.stroke();

        // 테이블 위 테이크아웃 커피잔 2개
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(tblX - 6, tblY - 8, 5, 7);
        ctx.fillRect(tblX + 4, tblY - 8, 5, 7);
        ctx.fillStyle = "#78350f"; // 갈색 슬리브
        ctx.fillRect(tblX - 6, tblY - 5, 5, 3);
        ctx.fillRect(tblX + 4, tblY - 5, 5, 3);

        // 화이트 캔버스 파라솔 (Canvas Parasol Umbrella)
        const pSolX = tblX;
        const pSolY = dckY + 12;
        ctx.fillStyle = "#475569";
        ctx.fillRect(pSolX - 2, pSolY, 4, 44); // 파라솔 폴대
        // 파라솔 돔
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(pSolX, pSolY + 14, 34, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#e2e8f0";
        ctx.stroke();
        // 파라솔 골 음영선
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pSolX, pSolY - 20);
        ctx.lineTo(pSolX - 18, pSolY + 14);
        ctx.moveTo(pSolX, pSolY - 20);
        ctx.lineTo(pSolX + 18, pSolY + 14);
        ctx.stroke();

        // 8. 감성 스트링 조명 알전구 (String Festoon Lights)
        // 지붕 처마에서 데크 기둥으로 이어지는 라인
        const postX = dckX + dckW - 6;
        const postY = dckY - 20;
        ctx.fillStyle = "#78350f";
        ctx.fillRect(postX, postY, 4, 60); // 데크 코너 조명 폴

        // 전선 줄
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bldX + bldW, bldY + 40);
        ctx.quadraticCurveTo(dckX + 40, dckY - 6, postX, postY + 4);
        ctx.stroke();

        // 따뜻한 노란 알전구들 (Glowing Bulbs)
        const bulbOffsets = [0.2, 0.45, 0.7, 0.9];
        bulbOffsets.forEach(t => {
            const bx = (bldX + bldW) * (1 - t) + postX * t;
            const by = (bldY + 40) * (1 - t) + (postY + 4) * t + Math.sin(t * Math.PI) * 12;
            ctx.fillStyle = "#fef08a";
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(253, 224, 71, 0.4)";
            ctx.beginPath();
            ctx.arc(bx, by, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        // 9. 테라스 앞 분필 입간판 (Chalkboard Easel Sign)
        const eX = dckX + 12;
        const eY = dckY + dckH - 18;
        ctx.fillStyle = "#78350f";
        ctx.fillRect(eX, eY, 3, 26); // 좌측 다리
        ctx.fillRect(eX + 19, eY, 3, 26); // 우측 다리
        // 칠판 보드
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(eX + 2, eY + 2, 18, 20);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(eX + 4, eY + 6, 14, 2); // 분필 글씨 시뮬레이션
        ctx.fillRect(eX + 4, eY + 10, 10, 2);
        ctx.fillRect(eX + 4, eY + 14, 12, 2);

        // 10. 로컬 특산품 와인 오크통 (Oak Barrel Display)
        const brlX = bldX + bldW + 4;
        const brlY = floorY - 30;
        ctx.fillStyle = "#78350f";
        ctx.fillRect(brlX, brlY, 18, 24);
        ctx.fillStyle = "#92400e";
        ctx.fillRect(brlX + 2, brlY + 2, 14, 20);
        // 철제 띠 2줄
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(brlX, brlY + 5, 18, 2);
        ctx.fillRect(brlX, brlY + 17, 18, 2);
    });
})();
