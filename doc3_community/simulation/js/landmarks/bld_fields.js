/**
 * bld_fields.js
 * 전통 친환경 벼농사 농경지 (26 x 22 타일: 832 x 704 px)
 * 다랭이논 논둑길, 벼 포기 및 황금 이삭, 용수 조절 물꼬(수문),
 * 밀짚모자 허수아비, 농로 깃발 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "fields";
    const WIDTH = 832;
    const HEIGHT = 704;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 논둑 경계 및 논물 바탕 (Paddy Water & Ridge Terraces)
        const paddockYs = [30, 190, 350, 510];
        const paddockH = 150;

        paddockYs.forEach((py, pIdx) => {
            // 논물 담수 바탕 (Irrigated Water Surface with Reflection)
            ctx.fillStyle = "#65a30d"; // 녹조 띤 맑은 논물
            ctx.fillRect(20, py, w - 40, paddockH);

            // 논물 반사광 잔물결
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            for (let r = 0; r < 5; r++) {
                const rx = 40 + (r * 150) % (w - 120);
                const ry = py + 20 + r * 25;
                ctx.fillRect(rx, ry, 60, 2);
                ctx.fillRect(rx + 15, ry + 4, 30, 1);
            }

            // 정연한 모내기 벼 포기 열 (Rows of Rice Seedlings: 6열)
            for (let row = 0; row < 5; row++) {
                const ry = py + 16 + row * 26;
                for (let col = 36; col < w - 50; col += 24) {
                    const offset = (row % 2) * 12;
                    const rx = col + offset;

                    // 벼 포기 밑둥 흙
                    ctx.fillStyle = "#365314";
                    ctx.fillRect(rx + 2, ry + 12, 6, 2);

                    // 벼 줄기 및 잎 (Rice Stems & Leaves)
                    ctx.fillStyle = "#4ade80";
                    ctx.fillRect(rx + 4, ry + 2, 2, 10);
                    ctx.fillRect(rx + 1, ry + 4, 2, 8);
                    ctx.fillRect(rx + 7, ry + 4, 2, 8);
                    ctx.fillStyle = "#22c55e";
                    ctx.fillRect(rx + 3, ry, 4, 4);

                    // 가을철 익어가는 황금 이삭 도트 (Golden Rice Grain Heads)
                    ctx.fillStyle = "#facc15";
                    ctx.fillRect(rx + 2, ry - 2, 3, 3);
                    ctx.fillRect(rx + 5, ry - 1, 3, 3);
                }
            }

            // 다랭이논 흙 논둑길 (Earthen Ridge Bunds)
            const bundY = py + paddockH - 12;
            ctx.fillStyle = "#78350f";
            ctx.fillRect(16, bundY, w - 32, 16);
            ctx.fillStyle = "#a16207";
            ctx.fillRect(16, bundY + 2, w - 32, 8);

            // 논둑 잔디 풀숲 도트
            ctx.fillStyle = "#4d7c0f";
            for (let bx = 20; bx < w - 40; bx += 16) {
                ctx.fillRect(bx, bundY - 2, 4, 4);
                ctx.fillRect(bx + 6, bundY - 1, 3, 3);
            }
        });

        // 2. 용수 조절 콘크리트 물꼬 및 수문 (Sluice Water Gate: 좌측 상단)
        const gateX = 40;
        const gateY = 160;
        ctx.fillStyle = "#475569";
        ctx.fillRect(gateX, gateY, 44, 40);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(gateX + 4, gateY + 4, 36, 32);

        // 수문 개폐 스크류 핸들 및 철판
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(gateX + 18, gateY - 12, 8, 20); // 스크류 봉
        ctx.fillStyle = "#dc2626"; // 붉은 회전 원형 핸들
        ctx.beginPath();
        ctx.arc(gateX + 22, gateY - 12, 7, 0, Math.PI * 2);
        ctx.fill();
        // 콸콸 쏟아지는 물살 (Gushing Water)
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(gateX + 14, gateY + 24, 16, 16);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(gateX + 16, gateY + 26, 12, 4);

        // 3. 밀짚모자 허수아비 (Traditional Scarecrow: 중앙 논둑 위)
        const scX = 420;
        const scY = 310;

        // 나무 지지 십자가 (Wooden Cross Posts)
        ctx.fillStyle = "#78350f";
        ctx.fillRect(scX + 18, scY + 10, 6, 68); // 수직 기둥
        ctx.fillRect(scX, scY + 28, 42, 6);     // 수평 팔

        // 한복 저고리 / 알록달록 누더기 옷 (Patched Coat)
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(scX + 10, scY + 24, 22, 28);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(scX + 12, scY + 32, 8, 8); // 붉은 헝겊 덧댐
        ctx.fillStyle = "#facc15";
        ctx.fillRect(scX + 6, scY + 26, 6, 8);  // 왼쪽 소매
        ctx.fillRect(scX + 30, scY + 26, 6, 8); // 오른쪽 소매

        // 짚단 얼굴 및 밀짚모자 (Straw Head & Hat)
        ctx.fillStyle = "#ca8a04";
        ctx.beginPath();
        ctx.arc(scX + 21, scY + 16, 8, 0, Math.PI * 2);
        ctx.fill();
        // 눈코입 스마일 도트
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(scX + 18, scY + 14, 2, 2);
        ctx.fillRect(scX + 23, scY + 14, 2, 2);
        ctx.fillRect(scX + 19, scY + 19, 5, 2);

        // 밀짚모자 (Straw Conical Hat)
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.ellipse(scX + 21, scY + 10, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(scX + 16, scY + 4, 10, 6);

        // 바람에 펄럭이는 옷자락 리본
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(scX + 2, scY + 34, 6, 12);
        ctx.fillRect(scX + 34, scY + 34, 6, 12);

        // 4. 친환경 농업 시범포 깃발 (Green Eco-Agriculture Flag)
        const flgX = 720;
        const flgY = 480;
        ctx.fillStyle = "#475569";
        ctx.fillRect(flgX, flgY, 3, 50);
        ctx.fillStyle = "#15803d";
        ctx.fillRect(flgX + 3, flgY + 2, 26, 16);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px sans-serif";
        ctx.fillText("우렁이", flgX + 4, flgY + 13);
    });
})();
