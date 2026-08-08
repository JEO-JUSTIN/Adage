import React from 'react';

const CHAR_DATA = {
  'A': {
    width: 60,
    loops: [
      [ // Outer
        [30, 2],
        [58, 80],
        [44, 80],
        [37, 54],
        [23, 54],
        [16, 80],
        [2, 80]
      ],
      [ // Inner hole
        [30, 18],
        [35, 40],
        [25, 40]
      ]
    ]
  },
  'D': {
    width: 60,
    loops: [
      [ // Outer
        [10, 2],
        [35, 2],
        [48, 12],
        [56, 28],
        [56, 52],
        [48, 68],
        [35, 78],
        [10, 78]
      ],
      [ // Inner hole
        [22, 16],
        [32, 16],
        [40, 26],
        [40, 54],
        [32, 64],
        [22, 64]
      ]
    ]
  },
  'G': {
    width: 60,
    loops: [
      [ // Outer
        [52, 22],
        [44, 8],
        [30, 2],
        [16, 8],
        [8, 22],
        [8, 58],
        [16, 72],
        [30, 78],
        [44, 72],
        [52, 58],
        [52, 42],
        [32, 42],
        [32, 52],
        [42, 52],
        [42, 64],
        [30, 68],
        [20, 64],
        [20, 16],
        [30, 12],
        [44, 18],
        [52, 32]
      ]
    ]
  },
  'E': {
    width: 60,
    loops: [
      [ // Outer
        [10, 2],
        [52, 2],
        [52, 14],
        [22, 14],
        [22, 34],
        [48, 34],
        [48, 46],
        [22, 46],
        [22, 66],
        [52, 66],
        [52, 78],
        [10, 78]
      ]
    ]
  },
  "'": {
    width: 15,
    loops: [
      [
        [2, 2],
        [12, 2],
        [12, 14],
        [6, 26],
        [2, 26],
        [6, 14]
      ]
    ]
  },
  '2': {
    width: 60,
    loops: [
      [
        [10, 22],
        [18, 8],
        [30, 2],
        [42, 8],
        [50, 22],
        [50, 34],
        [26, 58],
        [52, 58],
        [52, 78],
        [8, 78],
        [8, 54],
        [32, 30],
        [38, 22],
        [38, 16],
        [30, 12],
        [22, 16],
        [22, 22]
      ]
    ]
  },
  '6': {
    width: 60,
    loops: [
      [
        [48, 8],
        [32, 2],
        [18, 12],
        [10, 30],
        [10, 56],
        [18, 72],
        [30, 78],
        [42, 72],
        [48, 56],
        [48, 42],
        [38, 32],
        [24, 32],
        [18, 40],
        [18, 26],
        [28, 14],
        [44, 20]
      ],
      [
        [22, 46],
        [36, 46],
        [38, 54],
        [36, 64],
        [22, 64],
        [20, 54]
      ]
    ]
  }
};

const getPathString = (points) => {
  return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
};

export default function ThreeDText({ text, color = '#C8922A', offset = { x: 7, y: -7 }, strokeWidth = 1.2, className = '', filled = false }) {
  const characters = text.split('');
  const spacing = 15;

  // Calculate layout widths
  let currentX = 0;
  const layout = characters.map(char => {
    const data = CHAR_DATA[char];
    if (!data) return { char, width: 25, x: currentX };
    const x = currentX;
    currentX += data.width + spacing;
    return { char, width: data.width, x, data };
  });

  const totalWidth = currentX > 0 ? currentX - spacing : 0;
  const height = 80;

  // Viewbox needs extra padding for the 3D offset
  const padX = Math.max(0, offset.x);
  const padY = Math.max(0, -offset.y);
  const viewWidth = totalWidth + padX + 4;
  const viewHeight = height + padY + 4;

  return (
    <svg
      className={`select-none ${className}`}
      viewBox={`${-2} ${offset.y < 0 ? offset.y - 2 : -2} ${viewWidth} ${viewHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {layout.map((item, charIdx) => {
        if (!item.data) return null;

        const { loops } = item.data;

        return (
          <g key={charIdx} transform={`translate(${item.x}, 0)`}>
            {/* 1. BACK FACE OUTLINES */}
            <g transform={`translate(${offset.x}, ${offset.y})`} opacity="0.4">
              {loops.map((loop, idx) => (
                <path
                  key={`back-${idx}`}
                  className="animate-draw-path"
                  d={getPathString(loop)}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill={filled ? '#5A3E08' : 'none'}
                  style={{ animationDelay: `${0.1 * charIdx}s` }}
                />
              ))}
            </g>

            {/* 2. CONNECTING DEPTH LINES */}
            <g opacity="0.6">
              {loops.map((loop, loopIdx) =>
                loop.map((pt, ptIdx) => {
                  const [x, y] = pt;
                  return (
                    <line
                      key={`conn-${loopIdx}-${ptIdx}`}
                      className="animate-draw-path"
                      x1={x}
                      y1={y}
                      x2={x + offset.x}
                      y2={y + offset.y}
                      stroke={color}
                      strokeWidth={strokeWidth * 0.75}
                      style={{ animationDelay: `${0.1 * charIdx + 0.05 * ptIdx}s` }}
                    />
                  );
                })
              )}
            </g>

            {/* 3. FRONT FACE OUTLINES */}
            <g>
              {loops.map((loop, idx) => (
                <path
                  key={`front-${idx}`}
                  className="animate-draw-path"
                  d={getPathString(loop)}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill={filled ? color : 'none'}
                  style={{ animationDelay: `${0.1 * charIdx}s` }}
                />
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
