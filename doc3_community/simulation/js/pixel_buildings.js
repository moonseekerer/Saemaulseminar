// pixel_buildings.js - Procedural Pixel Art Graphics for Village Landmarks

window.PixelLandmarkRenderer = {
    // 1. 마을회관 청사 (16 x 10 타일: 512 x 320 px)
    drawHall(ctx, x, y, w, h) {
        ctx.save();
        // 기단 (석축)
        ctx.fillStyle = "#475569";
        ctx.fillRect(x, y + h - 24, w, 24);

        // 본체 벽면
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(x + 16, y + 60, w - 32, h - 84);

        // 파란색 기와/슬레이트 지붕
        ctx.fillStyle = "#1e3a8a";
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 60);
        ctx.lineTo(x + w / 2, y + 10);
        ctx.lineTo(x + w - 8, y + 60);
        ctx.closePath();
        ctx.fill();

        // 지붕 처마 테두리
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 3;
        ctx.stroke();

        // 현판
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(x + w / 2 - 50, y + 70, 100, 24);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 11px Pretendard, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("마 을 회 관", x + w / 2, y + 86);

        // 정문 유리문
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(x + w / 2 - 24, y + h - 70, 48, 46);
        ctx.strokeStyle = "#0f172a";
        ctx.strokeRect(x + w / 2 - 24, y + h - 70, 48, 46);

        // 창문들
        ctx.fillStyle = "#93c5fd";
        const winY1 = y + 105;
        const winY2 = y + 155;
        [-140, -80, 80, 140].forEach(ox => {
            const wx = x + w / 2 + ox - 18;
            ctx.fillRect(wx, winY1, 36, 32);
            ctx.strokeRect(wx, winY1, 36, 32);
            if (h > 240) {
                ctx.fillRect(wx, winY2, 36, 32);
                ctx.strokeRect(wx, winY2, 36, 32);
            }
        });

        // 태극기 국기봉
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 36, y + h - 24);
        ctx.lineTo(x + 36, y + 15);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 36, y + 18, 22, 14);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(x + 47, y + 25, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // 2. 스마트팜 혁신단지 (22 x 14 타일: 704 x 448 px)
    drawGreenhouse(ctx, x, y, w, h) {
        ctx.save();
        const archCount = 3;
        const archW = (w - 30) / archCount;

        for (let i = 0; i < archCount; i++) {
            const ax = x + 15 + i * archW;
            const ay = y + 20;
            const ah = h - 40;

            ctx.fillStyle = "rgba(224, 242, 254, 0.45)";
            ctx.fillRect(ax, ay + 20, archW - 10, ah - 20);

            // 아치형 지붕
            ctx.beginPath();
            ctx.arc(ax + (archW - 10) / 2, ay + 25, (archW - 10) / 2, Math.PI, 0, false);
            ctx.fill();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
            ctx.lineWidth = 2.5;
            ctx.strokeRect(ax, ay + 20, archW - 10, ah - 20);
            ctx.stroke();

            // 내부 작물 베드
            ctx.fillStyle = "#15803d";
            ctx.fillRect(ax + 12, ay + ah - 55, archW - 34, 12);
            ctx.fillRect(ax + 12, ay + ah - 35, archW - 34, 12);

            // 환기 팬
            ctx.fillStyle = "#64748b";
            ctx.beginPath();
            ctx.arc(ax + (archW - 10) / 2, ay + 35, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // 스마트 제어실 컨테이너
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(x + w - 110, y + h - 90, 95, 70);
        ctx.strokeStyle = "#0369a1";
        ctx.strokeRect(x + w - 110, y + h - 90, 95, 70);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Pretendard, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("양액/센서 제어실", x + w - 62, y + h - 50);

        ctx.restore();
    },

    // 3. 오상회 구판장 및 버스정류장 (14 x 9 타일: 448 x 288 px)
    drawStore(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = "#b45309";
        ctx.fillRect(x + 20, y + 40, w - 150, h - 60);
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 20, y + 40, w - 150, h - 60);

        const awningW = w - 140;
        const segW = awningW / 8;
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = i % 2 === 0 ? "#ea580c" : "#f8fafc";
            ctx.fillRect(x + 15 + i * segW, y + 30, segW, 20);
        }

        ctx.fillStyle = "#fef08a";
        ctx.fillRect(x + 40, y + 10, 120, 22);
        ctx.fillStyle = "#b91c1c";
        ctx.font = "bold 12px Pretendard, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("오 상 회 구 판 장", x + 100, y + 25);

        // 평상
        ctx.fillStyle = "#d97706";
        ctx.fillRect(x + w - 115, y + 80, 90, 60);
        ctx.strokeStyle = "#92400e";
        ctx.strokeRect(x + w - 115, y + 80, 90, 60);

        for (let py = y + 95; py < y + 140; py += 15) {
            ctx.beginPath();
            ctx.moveTo(x + w - 115, py);
            ctx.lineTo(x + w - 25, py);
            ctx.stroke();
        }
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Pretendard, sans-serif";
        ctx.fillText("쉼터 평상", x + w - 70, y + 74);

        // 우체통
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(x + w - 120, y + 170, 14, 26);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + w - 118, y + 174, 10, 3);

        ctx.restore();
    },

    // 4. 청년 로컬공방 & 카페 (12 x 8 타일: 384 x 256 px)
    drawCafe(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = "#44403c";
        ctx.fillRect(x + 15, y + 35, w - 30, h - 50);

        ctx.fillStyle = "#78716c";
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 35);
        ctx.lineTo(x + w / 2, y + 5);
        ctx.lineTo(x + w - 5, y + 35);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(125, 211, 252, 0.6)";
        ctx.fillRect(x + 30, y + 55, w - 60, h - 85);
        ctx.strokeStyle = "#d6d3d1";
        ctx.strokeRect(x + 30, y + 55, w - 60, h - 85);

        ctx.fillStyle = "#1c1917";
        ctx.fillRect(x + w / 2 - 50, y + 42, 100, 18);
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 10px Pretendard, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("청년 로컬공방·카페", x + w / 2, y + 55);

        // 파라솔
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(x + 40, y + h - 35, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // 5. 외곽 한우 축산단지 (22 x 18 타일: 704 x 576 px)
    drawCattle(ctx, x, y, w, h) {
        ctx.save();
        const barnW = w - 40;
        const barnH = h - 100;
        ctx.fillStyle = "#7f1d1d";
        ctx.fillRect(x + 20, y + 20, barnW, 35);

        ctx.fillStyle = "#78350f";
        for (let bx = x + 30; bx < x + barnW + 10; bx += 50) {
            ctx.fillRect(bx, y + 55, 12, barnH);
        }

        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(x + 30, y + barnH + 40, barnW - 20, 20);

        // 사일리지
        ctx.fillStyle = "#f8fafc";
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        [x + barnW - 60, x + barnW - 30, x + barnW].forEach((sx) => {
            ctx.beginPath();
            ctx.arc(sx, y + h - 45, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // 퇴비사
        ctx.fillStyle = "#3f2c22";
        ctx.fillRect(x + 25, y + h - 65, 80, 45);
        ctx.strokeStyle = "#573a2e";
        ctx.strokeRect(x + 25, y + h - 65, 80, 45);

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Pretendard, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("환경 퇴비사", x + 65, y + h - 40);

        ctx.restore();
    },

    // 6. 산비탈 과수원 (24 x 16 타일: 768 x 512 px)
    drawOrchard(ctx, x, y, w, h) {
        ctx.save();
        const rows = 4;
        const cols = 5;
        const stepX = (w - 40) / cols;
        const stepY = (h - 40) / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tx = x + 25 + c * stepX;
                const ty = y + 25 + r * stepY;

                ctx.fillStyle = "#713f12";
                ctx.fillRect(tx - 3, ty + 5, 6, 15);

                ctx.fillStyle = "#15803d";
                ctx.beginPath();
                ctx.arc(tx, ty, 14, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#dc2626";
                ctx.beginPath();
                ctx.arc(tx - 5, ty - 3, 3, 0, Math.PI * 2);
                ctx.arc(tx + 5, ty + 2, 3, 0, Math.PI * 2);
                ctx.arc(tx + 1, ty - 6, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.strokeStyle = "#171717";
        ctx.lineWidth = 1.5;
        for (let r = 0; r < rows; r++) {
            const ly = y + 42 + r * stepY;
            ctx.beginPath();
            ctx.moveTo(x + 10, ly);
            ctx.lineTo(x + w - 10, ly);
            ctx.stroke();
        }

        ctx.restore();
    },

    // 7. 잔디광장 및 쉼터 정자 (12 x 8 타일: 384 x 256 px)
    drawPlaza(ctx, x, y, w, h) {
        ctx.save();
        const cx = x + w / 2;
        const cy = y + h / 2;

        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#065f46";
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const rad = (i * Math.PI) / 4;
            const px = cx + Math.cos(rad) * 44;
            const py = cy + Math.sin(rad) * 44;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // 8. 주민 주거 가옥단지 (24 x 16 타일: 768 x 512 px)
    drawResidential(ctx, x, y, w, h) {
        ctx.save();
        const houses = [
            { ox: 30, oy: 20, color: "#1e3a8a", name: "김이장 댁" },
            { ox: 220, oy: 20, color: "#991b1b", name: "박부녀 댁" },
            { ox: 30, oy: 150, color: "#374151", name: "정노인 댁" },
            { ox: 220, oy: 150, color: "#065f46", name: "최총무 댁" }
        ];

        houses.forEach(house => {
            const hx = x + house.ox;
            const hy = y + house.oy;

            ctx.fillStyle = "#f1f5f9";
            ctx.fillRect(hx, hy + 25, 120, 65);
            ctx.strokeStyle = "#94a3b8";
            ctx.strokeRect(hx, hy + 25, 120, 65);

            ctx.fillStyle = house.color;
            ctx.beginPath();
            ctx.moveTo(hx - 6, hy + 25);
            ctx.lineTo(hx + 60, hy);
            ctx.lineTo(hx + 126, hy + 25);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#78350f";
            ctx.fillRect(hx + 45, hy + 50, 24, 40);
            ctx.fillStyle = "#93c5fd";
            ctx.fillRect(hx + 85, hy + 45, 20, 20);
        });

        ctx.restore();
    }
};
