/**
 * landmark_engine.js
 * 고밀도 도트 판(Pixel Matrix) 및 절차적 픽셀 아트 텍스처를
 * 오프스크린 캔버스에 1회 사전 베이킹(Pre-baking)하여 60FPS로 렌더링하는 전용 엔진
 */

class LandmarkEngine {
    constructor() {
        this.cache = {};       // { landmarkId: HTMLCanvasElement }
        this.registry = {};    // { landmarkId: { width, height, renderFunc } }
        this.isReady = true;
    }

    /**
     * 개별 랜드마크 도트 스크립트 등록 및 자동 베이킹
     */
    register(id, width, height, renderFunc) {
        this.registry[id] = { width, height, renderFunc };
        this.bake(id);
    }

    /**
     * 오프스크린 캔버스에 도트 판 그래픽 1회 렌더링 후 캐시 보관
     */
    bake(id) {
        const item = this.registry[id];
        if (!item) return;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = item.width;
        offCanvas.height = item.height;
        const ctx = offCanvas.getContext('2d');

        // 픽셀 아트 보간 왜곡 방지
        ctx.imageSmoothingEnabled = false;

        // 픽셀 렌더 도우미 라이브러리 제공
        const helpers = this.createHelpers(ctx, item.width, item.height);

        // 개별 건물 렌더러 함수 실행
        try {
            item.renderFunc(ctx, item.width, item.height, helpers);
            this.cache[id] = offCanvas;
        } catch (err) {
            console.error(`[LandmarkEngine] ${id} 렌더링 오류:`, err);
        }
    }

    /**
     * 메인 뷰포트 캔버스에 사전 베이킹된 도트 판 전송
     */
    draw(ctx, id, x, y, w, h) {
        const cached = this.cache[id];
        if (cached) {
            ctx.drawImage(cached, x, y, w, h);
            return true;
        }
        return false;
    }

    /**
     * 고밀도 픽셀 아트 전용 도우미 라이브러리
     */
    createHelpers(ctx, fullW, fullH) {
        return {
            // 1. 도트 매트릭스 문자열 배열 렌더러 (Dot Matrix Stamp)
            drawMatrix: (matrix, palette, pixelSize, startX, startY) => {
                for (let r = 0; r < matrix.length; r++) {
                    const row = matrix[r];
                    for (let c = 0; c < row.length; c++) {
                        const char = row[c];
                        const color = palette[char];
                        if (color && color !== 'none' && color !== ' ') {
                            ctx.fillStyle = color;
                            ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
                        }
                    }
                }
            },

            // 2. 한식 전통 기와 지붕 텍스처 렌더러 (Curved Korean Roof Tiles)
            drawRoofTiles: (x, y, w, h, tileColor, hiColor, shadowColor, tileW = 16, tileH = 12) => {
                ctx.save();
                ctx.fillStyle = tileColor;
                ctx.fillRect(x, y, w, h);

                const rows = Math.ceil(h / tileH);
                const cols = Math.ceil(w / tileW);

                for (let r = 0; r < rows; r++) {
                    const ry = y + r * tileH;
                    // 가로 기와 골 그림자선
                    ctx.fillStyle = shadowColor;
                    ctx.fillRect(x, ry + tileH - 2, w, 2);

                    // 세로 수막새 기와 곡선
                    for (let c = 0; c < cols; c++) {
                        const rx = x + c * tileW + (r % 2 === 0 ? 0 : tileW / 2);
                        if (rx + tileW > x + w) continue;

                        // 기와 하이라이트 (빛 반사)
                        ctx.fillStyle = hiColor;
                        ctx.fillRect(rx + 2, ry + 2, tileW - 6, 2);

                        // 기와 골 음영
                        ctx.fillStyle = shadowColor;
                        ctx.fillRect(rx, ry, 2, tileH);
                    }
                }
                ctx.restore();
            },

            // 3. 고벽돌/외벽 질감 렌더러 (Staggered Brickwork with Mortar)
            drawBrickWall: (x, y, w, h, brickColor, mortarColor, brickW = 16, brickH = 8, noise = true) => {
                ctx.save();
                ctx.fillStyle = mortarColor;
                ctx.fillRect(x, y, w, h);

                const rows = Math.ceil(h / brickH);
                const cols = Math.ceil(w / brickW);

                for (let r = 0; r < rows; r++) {
                    const offset = (r % 2) * (brickW / 2);
                    for (let c = -1; c < cols + 1; c++) {
                        const bx = x + c * brickW + offset;
                        const by = y + r * brickH;

                        // 클리핑 체크
                        const drawX = Math.max(x, bx + 1);
                        const drawY = Math.max(y, by + 1);
                        const drawW = Math.min(x + w, bx + brickW - 1) - drawX;
                        const drawH = Math.min(y + h, by + brickH - 1) - drawY;

                        if (drawW > 0 && drawH > 0) {
                            ctx.fillStyle = brickColor;
                            ctx.fillRect(drawX, drawY, drawW, drawH);

                            if (noise && ((r * 7 + c * 13) % 5 === 0)) {
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                                ctx.fillRect(drawX, drawY, drawW, drawH);
                            } else if (noise && ((r * 3 + c * 11) % 7 === 0)) {
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                                ctx.fillRect(drawX, drawY, drawW, drawH);
                            }
                        }
                    }
                }
                ctx.restore();
            },

            // 4. 원목 평상/마루/외벽 나뭇결 렌더러 (Wood Planks)
            drawWoodPlanks: (x, y, w, h, woodColor, grainColor, plankH = 10, isVertical = false) => {
                ctx.save();
                ctx.fillStyle = woodColor;
                ctx.fillRect(x, y, w, h);

                if (!isVertical) {
                    const rows = Math.ceil(h / plankH);
                    for (let r = 0; r < rows; r++) {
                        const py = y + r * plankH;
                        // 판자 이음새 음영선
                        ctx.fillStyle = grainColor;
                        ctx.fillRect(x, py + plankH - 1, w, 1);

                        // 나뭇결 하이라이트
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                        ctx.fillRect(x, py + 1, w, 1);

                        // 옹이 점 질감
                        const knotX = x + ((r * 67) % (w - 20));
                        ctx.fillStyle = grainColor;
                        ctx.fillRect(knotX, py + 3, 4, 2);
                    }
                } else {
                    const plankW = plankH;
                    const cols = Math.ceil(w / plankW);
                    for (let c = 0; c < cols; c++) {
                        const px = x + c * plankW;
                        ctx.fillStyle = grainColor;
                        ctx.fillRect(px + plankW - 1, y, 1, h);
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                        ctx.fillRect(px + 1, y, 1, h);
                    }
                }
                ctx.restore();
            },

            // 5. 양철 슬레이트/골강판 지붕 렌더러 (Corrugated Metal Roofing)
            drawCorrugatedRoof: (x, y, w, h, baseColor, hiColor, shadowColor, ridgeW = 8) => {
                ctx.save();
                ctx.fillStyle = baseColor;
                ctx.fillRect(x, y, w, h);

                const cols = Math.ceil(w / ridgeW);
                for (let c = 0; c < cols; c++) {
                    const rx = x + c * ridgeW;
                    // 골 그림자
                    ctx.fillStyle = shadowColor;
                    ctx.fillRect(rx, y, 2, h);
                    // 골 하이라이트
                    ctx.fillStyle = hiColor;
                    ctx.fillRect(rx + 2, y, ridgeW - 4, h);
                }
                ctx.restore();
            },

            // 6. 16비트 레트로 유리창 렌더러 (Glass with 45° Sky Reflection Glare)
            drawGlassWindow: (x, y, w, h, frameColor, glassColor, glareColor = 'rgba(255, 255, 255, 0.4)') => {
                ctx.save();
                // 창틀
                ctx.fillStyle = frameColor;
                ctx.fillRect(x, y, w, h);

                // 유리 알
                const pad = 2;
                ctx.fillStyle = glassColor;
                ctx.fillRect(x + pad, y + pad, w - pad * 2, h - pad * 2);

                // 대각선 45도 반사광
                ctx.fillStyle = glareColor;
                const glareW = Math.max(3, Math.floor(w / 6));
                ctx.beginPath();
                ctx.moveTo(x + pad + 4, y + pad);
                ctx.lineTo(x + pad + 4 + glareW, y + pad);
                ctx.lineTo(x + pad, y + pad + 4 + glareW);
                ctx.lineTo(x + pad, y + pad + 4);
                ctx.closePath();
                ctx.fill();

                if (w > 20 && h > 20) {
                    ctx.beginPath();
                    ctx.moveTo(x + pad + 12, y + pad);
                    ctx.lineTo(x + pad + 12 + glareW, y + pad);
                    ctx.lineTo(x + pad, y + pad + 12 + glareW);
                    ctx.lineTo(x + pad, y + pad + 12);
                    ctx.closePath();
                    ctx.fill();
                }

                // 창살 분할 (십자틀)
                if (w >= 30 && h >= 24) {
                    ctx.fillStyle = frameColor;
                    ctx.fillRect(x + Math.floor(w / 2) - 1, y + pad, 2, h - pad * 2);
                    ctx.fillRect(x + pad, y + Math.floor(h / 2) - 1, w - pad * 2, 2);
                }
                ctx.restore();
            },

            // 7. 바닥 그림자 렌더러 (Ground Drop Shadow)
            drawShadow: (x, y, w, h, opacity = 0.25) => {
                ctx.save();
                ctx.fillStyle = `rgba(15, 23, 42, ${opacity})`;
                ctx.fillRect(x, y, w, h);
                ctx.restore();
            },

            // 8. 디더링 음영 사각형 (16-bit Dither Rect)
            drawDitherRect: (x, y, w, h, color, ditherDensity = 2) => {
                ctx.save();
                ctx.fillStyle = color;
                for (let r = 0; r < h; r += 2) {
                    for (let c = 0; c < w; c += 2) {
                        if ((Math.floor(r / 2) + Math.floor(c / 2)) % ditherDensity === 0) {
                            ctx.fillRect(x + c, y + r, 2, 2);
                        }
                    }
                }
                ctx.restore();
            }
        };
    }
}

// 글로벌 싱글톤 인스턴스
window.landmarkEngine = new LandmarkEngine();
