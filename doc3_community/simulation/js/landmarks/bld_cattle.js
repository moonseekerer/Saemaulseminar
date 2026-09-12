/**
 * bld_cattle.js
 * 외곽 한우 축산단지 (22 x 18 타일: 704 x 576 px)
 * 목조 트러스 오픈형 우사, 슬레이트/양철 지붕, 개별 사육칸 파이프 펜스,
 * 토종 한우(황소/암소) 픽셀 도트, 사료조, 볏짚 깔개,
 * 거대 원형 곤포 사일리지 적치장, 퇴비사 및 손수레 등
 * 고밀도 16-bit 레트로 픽셀 아트 구현
 */

(function() {
    const ID = "cattle";
    const WIDTH = 704;
    const HEIGHT = 576;

    window.landmarkEngine.register(ID, WIDTH, HEIGHT, function(ctx, w, h, helpers) {
        // 1. 기초 지면 그림자
        helpers.drawShadow(16, 20, w - 32, h - 28, 0.35);

        // 2. 대형 오픈형 목조 우사 (좌측 440px 영역: 430px x 510px)
        const barnX = 20;
        const barnY = 40;
        const barnW = 430;
        const barnH = 500;
        const floorY = barnY + barnH;

        // 우사 바닥 콘크리트 및 황토 흙바닥
        ctx.fillStyle = "#78350f"; // 짙은 흙
        ctx.fillRect(barnX, barnY + 60, barnW, barnH - 60);
        ctx.fillStyle = "#92400e";
        ctx.fillRect(barnX + 4, barnY + 64, barnW - 8, barnH - 68);

        // 푹신한 황금색 볏짚 깔개 (Straw Bedding Layers)
        const strawY = barnY + 110;
        const strawH = barnH - 140;
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(barnX + 16, strawY, barnW - 32, strawH);
        // 볏짚 결 디테일
        ctx.fillStyle = "#fde047";
        for (let sy = strawY; sy < strawY + strawH; sy += 8) {
            for (let sx = barnX + 20; sx < barnX + barnW - 30; sx += 14) {
                if ((sx + sy) % 3 === 0) {
                    ctx.fillRect(sx, sy, 8, 2);
                    ctx.fillRect(sx + 3, sy + 3, 6, 2);
                }
            }
        }

        // 콘크리트 먹이통 (Feed Troughs Along Front Rails)
        const trX = barnX + 20;
        const trY = strawY + strawH - 24;
        const trW = barnW - 40;
        const trH = 28;
        ctx.fillStyle = "#64748b";
        ctx.fillRect(trX, trY, trW, trH);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(trX, trY, trW, 4);
        // 먹이통 속 사료/건초
        ctx.fillStyle = "#a16207";
        ctx.fillRect(trX + 4, trY + 6, trW - 8, 16);
        ctx.fillStyle = "#eab308";
        ctx.fillRect(trX + 6, trY + 8, trW - 12, 6);

        // 3. 우사 4개 개별 칸막이 파이프 펜스 (Stall Railings)
        const stallCount = 4;
        const stallW = Math.floor((barnW - 40) / stallCount);
        for (let s = 0; s <= stallCount; s++) {
            const px = trX + s * stallW;
            // 수직 아연도금 파이프 기둥
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(px - 3, strawY - 10, 6, strawH + 20);
            ctx.fillStyle = "#475569";
            ctx.fillRect(px + 1, strawY - 10, 2, strawH + 20);
        }
        // 수평 레일 파이프 3단
        [strawY + 20, strawY + 60, strawY + 100].forEach(ry => {
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(trX, ry, trW, 3);
            ctx.fillStyle = "#475569";
            ctx.fillRect(trX, ry + 2, trW, 1);
        });

        // 4. 개별 칸의 토종 한우 (Korean Hanwoo Cattle 픽셀 아트)
        // 4마리의 한우 배치
        for (let c = 0; c < stallCount; c++) {
            const cowX = trX + c * stallW + Math.floor(stallW / 2) - 32;
            const cowY = strawY + 36 + (c % 2) * 20; // 엇갈린 위치

            // 소 몸체 그림자
            helpers.drawShadow(cowX - 4, cowY + 44, 72, 16, 0.4);

            // [한우 몸통 (Body)]
            ctx.fillStyle = "#9a3412"; // 따뜻한 한우 황갈색
            ctx.fillRect(cowX, cowY + 12, 64, 38);
            ctx.fillStyle = "#c2410c"; // 등 하이라이트
            ctx.fillRect(cowX + 4, cowY + 12, 56, 10);
            ctx.fillStyle = "#7c2d12"; // 복부 음영
            ctx.fillRect(cowX + 2, cowY + 40, 60, 10);

            // [한우 4개 다리 (Legs & Hooves)]
            ctx.fillStyle = "#7c2d12";
            ctx.fillRect(cowX + 4, cowY + 48, 8, 16);
            ctx.fillRect(cowX + 18, cowY + 48, 8, 16);
            ctx.fillRect(cowX + 40, cowY + 48, 8, 16);
            ctx.fillRect(cowX + 52, cowY + 48, 8, 16);
            // 발굽 (Black Hooves)
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(cowX + 4, cowY + 60, 8, 4);
            ctx.fillRect(cowX + 18, cowY + 60, 8, 4);
            ctx.fillRect(cowX + 40, cowY + 60, 8, 4);
            ctx.fillRect(cowX + 52, cowY + 60, 8, 4);

            // [한우 꼬리 (Tail)]
            ctx.strokeStyle = "#7c2d12";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cowX + 62, cowY + 20);
            ctx.lineTo(cowX + 68, cowY + 36);
            ctx.stroke();
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(cowX + 66, cowY + 36, 4, 6); // 꼬리 털

            // [한우 머리 (Head & Muzzle)]
            const headX = cowX - 16;
            const headY = cowY + 6;
            ctx.fillStyle = "#9a3412";
            ctx.fillRect(headX, headY, 24, 28);
            // 이마 하이라이트
            ctx.fillStyle = "#c2410c";
            ctx.fillRect(headX + 4, headY + 2, 16, 8);
            // 검은 주둥이/코 (Black Muzzle)
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(headX - 6, headY + 14, 12, 14);
            // 콧구멍 핑크 도트
            ctx.fillStyle = "#f43f5e";
            ctx.fillRect(headX - 4, headY + 20, 2, 2);
            ctx.fillRect(headX, headY + 20, 2, 2);

            // [커다란 눈망울 (Eyes)]
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(headX + 8, headY + 8, 4, 5);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(headX + 9, headY + 8, 2, 2); // 눈동자 반사광

            // [곡선 뿔 (Horns)]
            ctx.fillStyle = "#fef08a";
            ctx.fillRect(headX + 12, headY - 6, 4, 8);
            ctx.fillRect(headX + 18, headY - 4, 3, 6);
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(headX + 11, headY - 8, 3, 3); // 뿔 끝

            // [귀 및 축산물이력제 노란 이력 귀표 (Ear & Tag)]
            ctx.fillStyle = "#7c2d12";
            ctx.fillRect(headX + 18, headY + 6, 8, 5); // 귀
            ctx.fillStyle = "#facc15"; // 노란 바코드 이력표
            ctx.fillRect(headX + 22, headY + 8, 5, 6);
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(headX + 23, headY + 10, 3, 2);

            // [미네랄 소금 블록 (Red Mineral Lick Block)]
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(trX + c * stallW + 12, strawY + 16, 10, 10);
            ctx.fillStyle = "#991b1b";
            ctx.strokeRect(trX + c * stallW + 12, strawY + 16, 10, 10);
        }

        // 5. 우사 지붕 목조 트러스 및 양철 슬레이트 지붕 (Corrugated Roof & Trusses)
        const roofH = 100;
        const roofY = barnY;

        // 양철/슬레이트 골강판 지붕 (녹슨 양철판과 회색 슬레이트 혼합)
        helpers.drawCorrugatedRoof(barnX - 10, roofY, barnW + 20, roofH, "#64748b", "#94a3b8", "#334155", 10);

        // 지붕 부분 녹슨 패치 (Rust Patches)
        ctx.fillStyle = "rgba(180, 83, 9, 0.45)";
        ctx.fillRect(barnX + 40, roofY + 10, 80, 40);
        ctx.fillRect(barnX + 260, roofY + 25, 110, 50);

        // 지붕 처마 목조 서까래 및 보 (Eaves & Wooden Beams)
        ctx.fillStyle = "#451a03";
        ctx.fillRect(barnX - 12, roofY + roofH - 4, barnW + 24, 6);
        // 5개 굵은 지지 목재 기둥 (Heavy Timber Columns)
        for (let p = 0; p < 5; p++) {
            const px = barnX + p * Math.floor(barnW / 4);
            ctx.fillStyle = "#78350f";
            ctx.fillRect(px - 5, roofY + roofH, 10, floorY - (roofY + roofH));
            ctx.fillStyle = "#451a03";
            ctx.fillRect(px + 2, roofY + roofH, 3, floorY - (roofY + roofH));
            // 기둥 상부 사선 가새 (Diagonal Knee Bracing)
            ctx.strokeStyle = "#78350f";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(px, roofY + roofH + 30);
            ctx.lineTo(px - 20, roofY + roofH + 2);
            ctx.moveTo(px, roofY + roofH + 30);
            ctx.lineTo(px + 20, roofY + roofH + 2);
            ctx.stroke();
        }

        // 중앙 지붕 용마루 환기창 (Ridge Ventilation Monitor)
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(barnX + 40, roofY - 14, barnW - 80, 16);
        ctx.fillStyle = "#475569";
        ctx.fillRect(barnX + 42, roofY - 12, barnW - 84, 4);

        // 6. 야외 사일리지 곤포 적치장 (우측 상단: 230px x 240px)
        const silYardX = barnX + barnW + 20;
        const silYardY = 50;

        // 적치장 안내 팻말 "사일리지 보관장"
        ctx.fillStyle = "#78350f";
        ctx.fillRect(silYardX + 10, silYardY, 4, 30);
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(silYardX + 2, silYardY, 68, 18);
        ctx.fillStyle = "#451a03";
        ctx.font = "bold 9px 'Pretendard', sans-serif";
        ctx.fillText("사일리지 적치장", silYardX + 6, silYardY + 12);

        // 거대 원형 곤포 사일리지 ("마시멜로" White Plastic Bales: 50px x 42px)
        // 1단 3개, 2단 2개 피라미드 적재
        const balePositions = [
            { x: silYardX + 10, y: silYardY + 110 },
            { x: silYardX + 72, y: silYardY + 110 },
            { x: silYardX + 134, y: silYardY + 110 },
            { x: silYardX + 41, y: silYardY + 64 },
            { x: silYardX + 103, y: silYardY + 64 }
        ];

        balePositions.forEach((bp, idx) => {
            // 바닥 그림자
            helpers.drawShadow(bp.x + 2, bp.y + 36, 56, 12, 0.4);

            // 흰색 비닐 랩핑 원통형 사일리지
            ctx.fillStyle = "#f8fafc";
            ctx.beginPath();
            ctx.ellipse(bp.x + 28, bp.y + 20, 26, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#e2e8f0";
            ctx.stroke();

            // 비닐 랩 겹침 주름선 (Plastic Wrap Seams)
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(bp.x + 28, bp.y + 20, 20, 15, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(bp.x + 28, bp.y + 20, 12, 9, 0, 0, Math.PI * 2);
            ctx.stroke();

            // 빛 반사 하이라이트
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(bp.x + 14, bp.y + 8, 16, 4);

            // 포장재 인쇄 번호 도트
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(bp.x + 22, bp.y + 18, 12, 4);
        });

        // 7. 친환경 발효 퇴비사 (우측 하단: 220px x 240px)
        const compX = silYardX;
        const compY = 320;
        const compW = 210;
        const compH = 210;

        // 콘크리트 침전 방지 옹벽 (Concrete Retaining Wall)
        ctx.fillStyle = "#475569";
        ctx.fillRect(compX, compY, compW, compH);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(compX + 8, compY + 8, compW - 16, compH - 16);

        // 발효 우분 퇴비 더미 (Organic Compost Mound)
        ctx.fillStyle = "#3f1d0b";
        ctx.beginPath();
        ctx.arc(compX + compW / 2, compY + compH / 2 + 10, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#58260b";
        ctx.beginPath();
        ctx.arc(compX + compW / 2 - 10, compY + compH / 2 + 4, 50, 0, Math.PI * 2);
        ctx.fill();

        // 볏짚 혼합 질감 도트
        ctx.fillStyle = "#eab308";
        for (let dy = compY + 40; dy < compY + compH - 40; dy += 12) {
            for (let dx = compX + 40; dx < compX + compW - 40; dx += 16) {
                if ((dx + dy) % 5 === 0) {
                    ctx.fillRect(dx, dy, 6, 2);
                }
            }
        }

        // [퇴비사 앞 소품: 외발 손수레 (Wheelbarrow) & 쇠스랑 (Pitchfork)]
        const cartX = compX + 16;
        const cartY = compY + compH + 10;
        // 외발 바퀴
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(cartX + 6, cartY + 16, 6, 0, Math.PI * 2);
        ctx.fill();
        // 적색 손수레 짐칸
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(cartX + 8, cartY + 4, 26, 14);
        // 손잡이 파이프
        ctx.fillStyle = "#475569";
        ctx.fillRect(cartX + 30, cartY + 6, 18, 3);
        ctx.fillRect(cartX + 30, cartY + 14, 18, 3);

        // 쇠스랑 (Pitchfork)
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cartX + 56, cartY + 24);
        ctx.lineTo(cartX + 70, cartY - 2);
        ctx.stroke();
        // 쇠스랑 갈퀴날 (Steel Prongs)
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(cartX + 68, cartY - 8, 8, 4);
        ctx.fillRect(cartX + 68, cartY - 12, 2, 8);
        ctx.fillRect(cartX + 71, cartY - 12, 2, 8);
        ctx.fillRect(cartX + 74, cartY - 12, 2, 8);
    });
})();
