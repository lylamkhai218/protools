import React, { useMemo } from 'react';

export interface CableItemForCad {
  id: string;
  name: string;
  diameterMm: number;
  count: number;
  color?: string;
}

interface ConduitCadCrossSectionProps {
  conduitInnerDiameterMm: number;
  cables: CableItemForCad[];
  className?: string;
}

interface PlacedCircle {
  id: string;
  label: string;
  diaMm: number;
  x: number;
  y: number;
  rPx: number;
  color: string;
}

// Helper vẽ mũi tên CAD 2D chuẩn kỹ thuật cơ khí (AutoCAD / SolidWorks)
function renderCadArrow(tipX: number, tipY: number, dirX: number, dirY: number, length = 8, width = 2.4) {
  const norm = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / norm;
  const uy = dirY / norm;
  const baseX = tipX - ux * length;
  const baseY = tipY - uy * length;
  const perpX = -uy * width;
  const perpY = ux * width;

  const p1 = `${tipX.toFixed(1)},${tipY.toFixed(1)}`;
  const p2 = `${(baseX + perpX).toFixed(1)},${(baseY + perpY).toFixed(1)}`;
  const p3 = `${(baseX - perpX).toFixed(1)},${(baseY - perpY).toFixed(1)}`;

  return (
    <polygon
      points={`${p1} ${p2} ${p3}`}
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="0.85"
      strokeLinejoin="round"
    />
  );
}

export default function ConduitCadCrossSection({
  conduitInnerDiameterMm,
  cables,
  className = ''
}: ConduitCadCrossSectionProps) {
  const R_PX = 118; // Bán kính đường tròn ống luồn trên SVG canvas
  const scale = R_PX / (conduitInnerDiameterMm / 2); // Tỷ lệ quy đổi mm sang px

  // Giải thuật sắp xếp dây (Circle Packing) chuẩn xác theo bản vẽ CAD Murrplastik
  const placedCables: PlacedCircle[] = useMemo(() => {
    // 1. Phẳng hóa danh sách từng sợi cáp
    const individualCables: { id: string; label: string; diaMm: number; rPx: number; color: string }[] = [];
    let cableIndex = 0;

    cables.forEach((c) => {
      const rPx = (c.diameterMm / 2) * scale;
      for (let i = 0; i < c.count; i++) {
        individualCables.push({
          id: `${c.id}-${i}`,
          label: `d${cableIndex}`,
          diaMm: c.diameterMm,
          rPx,
          color: c.color || '#7C3AED'
        });
        cableIndex++;
      }
    });

    // 2. Sắp xếp dây có đường kính lớn xếp trước (dây lớn thường ở đáy hoặc trung tâm)
    individualCables.sort((a, b) => b.diaMm - a.diaMm);

    // 3. Khởi tạo vị trí ban đầu (khớp 100% hình mẫu CAD: dây lớn nằm dưới trục hoành, 2 dây nhỏ góc trên)
    const placed: PlacedCircle[] = [];

    individualCables.forEach((item, idx) => {
      let initX = 0;
      let initY = 0;

      if (idx === 0) {
        // Dây lớn nhất đặt ở nửa dưới (trục Y dương), khớp vị trí d0 trong ảnh mẫu
        initY = Math.min(R_PX - item.rPx - 6, Math.max(22, item.rPx * 0.55));
      } else if (idx === 1) {
        // Dây thứ 2 ở góc trên bên trái (-X, -Y), khớp d1
        initX = -R_PX * 0.42;
        initY = -R_PX * 0.45;
      } else if (idx === 2) {
        // Dây thứ 3 ở góc trên bên phải (+X, -Y), khớp d2
        initX = R_PX * 0.42;
        initY = -R_PX * 0.45;
      } else {
        // Các dây bổ sung tiếp theo phân bố đều
        const angle = ((idx - 3) * (2 * Math.PI)) / Math.max(1, individualCables.length - 3) - Math.PI / 2;
        const dist = Math.min(R_PX - item.rPx - 8, R_PX * 0.52);
        initX = Math.cos(angle) * dist;
        initY = Math.sin(angle) * dist;
      }

      placed.push({
        id: item.id,
        label: item.label,
        diaMm: item.diaMm,
        x: initX,
        y: initY,
        rPx: item.rPx,
        color: item.color
      });
    });

    // 4. Giải thuật đẩy nén hồi quy (Iterative Relaxation) đảm bảo dây không đè lên nhau và không tràn ra ngoài ống
    const iterations = 50;
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          const dx = placed[j].x - placed[i].x;
          const dy = placed[j].y - placed[i].y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist = placed[i].rPx + placed[j].rPx + 2.5;

          if (dist < minDist) {
            const overlap = (minDist - dist) * 0.5;
            const nx = (dx / dist) * overlap;
            const ny = (dy / dist) * overlap;
            placed[i].x -= nx;
            placed[i].y -= ny;
            placed[j].x += nx;
            placed[j].y += ny;
          }
        }

        // Ràng buộc giới hạn trong thành ống luồn
        const currentDist = Math.hypot(placed[i].x, placed[i].y);
        const maxAllowed = R_PX - placed[i].rPx - 2;
        if (currentDist > maxAllowed) {
          const ratio = maxAllowed / currentDist;
          placed[i].x *= ratio;
          placed[i].y *= ratio;
        }
      }
    }

    return placed;
  }, [cables, conduitInnerDiameterMm, scale]);

  // Tính toán diện tích & Fill Factor
  const conduitArea = Math.PI * Math.pow(conduitInnerDiameterMm / 2, 2);
  let totalCableArea = 0;
  cables.forEach(c => {
    totalCableArea += c.count * (Math.PI * Math.pow(c.diameterMm / 2, 2));
  });
  const fillFactor = conduitArea > 0 ? (totalCableArea / conduitArea) * 100 : 0;

  // Góc gióng kích thước đường kính ống ngoài (conduit)
  const conduitAngle = Math.PI / 6.5; // ~28 độ theo chuẩn CAD
  const conduitTip1 = {
    x: -R_PX * Math.cos(conduitAngle),
    y: -R_PX * Math.sin(conduitAngle)
  };
  const conduitTip2 = {
    x: R_PX * Math.cos(conduitAngle),
    y: R_PX * Math.sin(conduitAngle)
  };

  const arrowLen = 8;
  const conduitLineStart = {
    x: conduitTip1.x + arrowLen * Math.cos(conduitAngle),
    y: conduitTip1.y + arrowLen * Math.sin(conduitAngle)
  };
  const conduitLineEnd = {
    x: conduitTip2.x - arrowLen * Math.cos(conduitAngle),
    y: conduitTip2.y - arrowLen * Math.sin(conduitAngle)
  };

  // Điểm dóng ra nhãn ống luồn d3
  const conduitLeaderP1 = conduitTip2;
  const conduitLeaderP2 = { x: conduitTip2.x + 38, y: conduitTip2.y + 24 };
  const conduitLeaderP3 = { x: conduitTip2.x + 38, y: conduitTip2.y + 68 };
  const conduitLeaderP4 = { x: conduitTip2.x + 48, y: conduitTip2.y + 68 };

  return (
    <div className={`bg-[#E6EDF5] rounded-xs border border-slate-300 p-4 font-mono select-none ${className}`}>
      
      {/* Header kỹ thuật gọn gàng */}
      <div className="flex items-center justify-between text-[11px] text-slate-700 border-b border-slate-300/80 pb-2 mb-3">
        <span className="font-bold tracking-wider uppercase text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-xs bg-[#00478D]"></span>
          BẢN VẼ MẶT CẮT 2D (SECTION A-A)
        </span>
        <span className="text-[10px] bg-white px-2 py-0.5 rounded-xs border border-slate-300 font-semibold text-slate-800">
          ỐNG ID = {conduitInnerDiameterMm} mm
        </span>
      </div>

      {/* SVG Canvas 2D CAD Drawing */}
      <div className="flex items-center justify-center relative">
        <svg
          viewBox="-165 -160 355 330"
          className="w-full max-w-[350px] aspect-square"
          style={{ overflow: 'visible' }}
        >
          {/* 1. Lưới kỹ thuật tọa độ & trục tâm (Crosshair Axes xuyên tâm) */}
          <line x1="-155" y1="0" x2="155" y2="0" stroke="#000000" strokeWidth="0.8" />
          <line x1="0" y1="-155" x2="0" y2="155" stroke="#000000" strokeWidth="0.8" />
          <rect x="-2" y="-2" width="4" height="4" fill="#000000" />

          {/* 2. Đường tròn lòng trong ống luồn Murrflex (Conduit Inner Wall) */}
          <circle
            cx="0"
            cy="0"
            r={R_PX}
            fill="#E6EDF5"
            stroke="#000000"
            strokeWidth="2.2"
          />

          {/* 3. Đường gióng kích thước đường kính ống ngoài kèm 2 mũi tên nhọn chạm chu vi */}
          <g>
            {/* Đường kính chạy qua tâm */}
            <line
              x1={conduitLineStart.x}
              y1={conduitLineStart.y}
              x2={conduitLineEnd.x}
              y2={conduitLineEnd.y}
              stroke="#000000"
              strokeWidth="0.8"
            />
            {/* Mũi tên góc trên bên trái (chạm chu vi ống) */}
            {renderCadArrow(
              conduitTip1.x,
              conduitTip1.y,
              -Math.cos(conduitAngle),
              -Math.sin(conduitAngle),
              arrowLen,
              2.4
            )}
            {/* Mũi tên góc dưới bên phải (chạm chu vi ống) */}
            {renderCadArrow(
              conduitTip2.x,
              conduitTip2.y,
              Math.cos(conduitAngle),
              Math.sin(conduitAngle),
              arrowLen,
              2.4
            )}

            {/* Đường chỉ dẫn leader line gập góc ra nhãn */}
            <path
              d={`M ${conduitLeaderP1.x} ${conduitLeaderP1.y} L ${conduitLeaderP2.x} ${conduitLeaderP2.y} L ${conduitLeaderP3.x} ${conduitLeaderP3.y} L ${conduitLeaderP4.x} ${conduitLeaderP4.y}`}
              fill="none"
              stroke="#000000"
              strokeWidth="0.8"
            />
            {/* Nhãn kích thước đường kính ống luồn (d3 = 24 mm) */}
            <text
              x={conduitLeaderP3.x - 12}
              y={conduitLeaderP3.y + 22}
              fontSize="11"
              fontWeight="bold"
              fill="#000000"
              fontFamily="monospace"
              className="select-none"
            >
              d{placedCables.length} = {conduitInnerDiameterMm} mm
            </text>
          </g>

          {/* 4. Vẽ các sợi cáp lõi dây điện bên trong theo đúng chuẩn ảnh mẫu */}
          {placedCables.map((cable, idx) => {
            // Góc nghiêng đường đo đường kính (chuẩn CAD cơ khí: ~35 - 45 độ)
            const angle = idx === 0 ? Math.PI / 6.8 : Math.PI / 4.2;
            const tip1 = {
              x: cable.x - cable.rPx * Math.cos(angle),
              y: cable.y - cable.rPx * Math.sin(angle)
            };
            const tip2 = {
              x: cable.x + cable.rPx * Math.cos(angle),
              y: cable.y + cable.rPx * Math.sin(angle)
            };

            const lStart = {
              x: tip1.x + arrowLen * Math.cos(angle),
              y: tip1.y + arrowLen * Math.sin(angle)
            };
            const lEnd = {
              x: tip2.x - arrowLen * Math.cos(angle),
              y: tip2.y - arrowLen * Math.sin(angle)
            };

            // Leader line cho từng sợi
            const isLargeCore = cable.rPx >= 30; // Dây lớn (như d0 = 14mm)

            return (
              <g key={cable.id}>
                {/* Vòng tròn tiết diện dây (viền tím chuẩn Murrplastik) */}
                <circle
                  cx={cable.x}
                  cy={cable.y}
                  r={cable.rPx}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="1.8"
                />

                {/* Điểm tâm vuông màu tím */}
                <rect
                  x={cable.x - 1.5}
                  y={cable.y - 1.5}
                  width="3"
                  height="3"
                  fill="#7C3AED"
                />

                {/* Đường kính xuyên tâm của sợi cáp */}
                <line
                  x1={lStart.x}
                  y1={lStart.y}
                  x2={lEnd.x}
                  y2={lEnd.y}
                  stroke="#000000"
                  strokeWidth="0.8"
                />

                {/* 2 MŨI TÊN CAD NHỌN CHẠM SÁT CHU VI ĐƯỜNG TRÒN CÁP (KHẮC PHỤC LỖI THIẾU MŨI TÊN) */}
                {renderCadArrow(
                  tip1.x,
                  tip1.y,
                  -Math.cos(angle),
                  -Math.sin(angle),
                  Math.min(arrowLen, cable.rPx * 0.45),
                  2.2
                )}
                {renderCadArrow(
                  tip2.x,
                  tip2.y,
                  Math.cos(angle),
                  Math.sin(angle),
                  Math.min(arrowLen, cable.rPx * 0.45),
                  2.2
                )}

                {/* Nhãn và đường gióng chỉ dẫn (Leader Line) */}
                {isLargeCore ? (
                  // Dây lớn d0: nhãn nằm trực tiếp cạnh tâm đường kính như ảnh mẫu
                  <text
                    x={cable.x + 8}
                    y={cable.y + 14}
                    fontSize="10"
                    fontWeight="bold"
                    fill="#000000"
                    fontFamily="monospace"
                    className="select-none"
                  >
                    {cable.label} = {cable.diaMm} mm
                  </text>
                ) : (
                  // Dây nhỏ d1, d2: đường dóng gập góc ra nhãn chuẩn CAD
                  <g>
                    {cable.x < 0 ? (
                      // Dây bên trái d1: dóng xuống trục hoành
                      <>
                        <path
                          d={`M ${tip2.x} ${tip2.y} L ${tip2.x + 10} ${tip2.y + 14} L ${tip2.x + 10} -4`}
                          fill="none"
                          stroke="#000000"
                          strokeWidth="0.8"
                        />
                        <text
                          x={tip2.x - 22}
                          y={6}
                          fontSize="10"
                          fontWeight="bold"
                          fill="#000000"
                          fontFamily="monospace"
                          className="select-none"
                        >
                          {cable.label} = {cable.diaMm} mm
                        </text>
                      </>
                    ) : (
                      // Dây bên phải d2: dóng xuống và sang phải
                      <>
                        <path
                          d={`M ${tip2.x} ${tip2.y} L ${tip2.x + 11} ${tip2.y + 14} L ${tip2.x + 11} 8`}
                          fill="none"
                          stroke="#000000"
                          strokeWidth="0.8"
                        />
                        <text
                          x={tip2.x + 16}
                          y={11}
                          fontSize="10"
                          fontWeight="bold"
                          fill="#000000"
                          fontFamily="monospace"
                          className="select-none"
                        >
                          {cable.label} = {cable.diaMm} mm
                        </text>
                      </>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 5. CÔNG THỨC TOÁN HỌC CHUẨN XÁC & KẾT QUẢ THỜI GIAN THỰC */}
      <div className="mt-3 pt-2.5 border-t border-slate-300 text-[11px] space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700">
          <span>Công thức toán học:</span>
          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-xs border border-slate-300">
            FF = (Σ A_dây / A_ống) × 100%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-700 bg-white p-2 rounded-xs border border-slate-300">
          <div>
            <span className="text-slate-400 block font-sans">A_ống:</span>
            <strong>{Math.round(conduitArea)} mm²</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Σ A_dây:</span>
            <strong className="text-[#00478D]">{Math.round(totalCableArea * 10) / 10} mm²</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Fill Factor:</span>
            <strong className={fillFactor > 60 ? 'text-red-600' : 'text-emerald-700'}>
              {Math.round(fillFactor * 10) / 10}%
            </strong>
          </div>
        </div>
      </div>

    </div>
  );
}
