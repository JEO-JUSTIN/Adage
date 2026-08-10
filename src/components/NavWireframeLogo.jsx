import React from 'react';

/**
 * NavWireframeLogo renders a clean architectural vector logo for ADAGE '26.
 * - animated={false} (default for Navbar): renders static with crisp gold outlines.
 * - animated={true} (for Main Hero Title): renders with progressive stroke-drawing animation.
 */
export default function NavWireframeLogo({ className = '', animated = false }) {
  const drawClass = animated ? 'cad-path-animate' : '';

  return (
    <div className={`inline-flex items-center gap-1 select-none ${className}`}>
      {animated && (
        <style>{`
          @keyframes cadStrokeDraw {
            0% {
              stroke-dashoffset: 400;
              opacity: 0;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
          @keyframes cadFillFade {
            0% { fill-opacity: 0; }
            100% { fill-opacity: 0.25; }
          }
          @keyframes cadApostropheFade {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          .cad-path-animate {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            opacity: 0;
            animation: cadStrokeDraw 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .cad-fill-animate {
            fill-opacity: 0;
            animation: cadFillFade 0.8s ease-out 1.8s forwards;
          }
          .cad-apostrophe-animate {
            opacity: 0;
            animation: cadApostropheFade 0.5s ease-out 1.7s forwards;
          }
        `}</style>
      )}

      <svg
        viewBox="0 0 420 90"
        className="h-full w-auto filter drop-shadow-[0_0_10px_rgba(200,146,42,0.45)] transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wireframe-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0B3" />
            <stop offset="50%" stopColor="#C8922A" />
            <stop offset="100%" stopColor="#996610" />
          </linearGradient>
        </defs>

        {/* ── Letter A (First) ── */}
        <g stroke="url(#wireframe-gold-grad)" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="M 10 80 L 40 10 L 70 80" className={drawClass} style={animated ? { animationDelay: '0.05s' } : {}} />
          <line x1="22" y1="52" x2="58" y2="52" strokeWidth="2" className={drawClass} style={animated ? { animationDelay: '0.2s' } : {}} />
        </g>

        {/* ── Letter D ── */}
        <g stroke="url(#wireframe-gold-grad)" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="M 85 10 L 115 10 C 140 10 152 26 152 45 C 152 64 140 80 115 80 L 85 80 Z" className={drawClass} style={animated ? { animationDelay: '0.35s' } : {}} />
        </g>

        {/* ── Letter A (Second) ── */}
        <g stroke="url(#wireframe-gold-grad)" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="M 165 80 L 195 10 L 225 80" className={drawClass} style={animated ? { animationDelay: '0.5s' } : {}} />
          <line x1="177" y1="52" x2="213" y2="52" strokeWidth="2" className={drawClass} style={animated ? { animationDelay: '0.65s' } : {}} />
          <polygon points="195,52 183,80 207,80" fill="rgba(200,146,42,0.25)" strokeWidth="1" className={animated ? 'cad-path-animate cad-fill-animate' : ''} style={animated ? { animationDelay: '0.8s' } : {}} />
        </g>

        {/* ── Letter G ── */}
        <g stroke="url(#wireframe-gold-grad)" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="M 290 28 C 280 15 262 10 248 10 C 230 10 216 26 216 45 C 216 64 230 80 248 80 C 265 80 285 70 285 48 L 255 48" className={drawClass} style={animated ? { animationDelay: '0.95s' } : {}} />
        </g>

        {/* ── Letter E ── */}
        <g stroke="url(#wireframe-gold-grad)" strokeWidth="2.5" strokeLinejoin="miter">
          <path d="M 335 10 L 300 10 L 300 80 L 335 80" className={drawClass} style={animated ? { animationDelay: '1.15s' } : {}} />
          <line x1="300" y1="45" x2="330" y2="45" strokeWidth="2" className={drawClass} style={animated ? { animationDelay: '1.3s' } : {}} />
        </g>

        {/* ── Wireframe Curved Blade / Swoosh crossing A & D ── */}
        <path
          d="M 5 80 Q 50 48 135 48"
          stroke="url(#wireframe-gold-grad)"
          strokeWidth="2.75"
          fill="none"
          className={drawClass}
          style={animated ? { animationDelay: '1.45s' } : {}}
        />

        {/* ── '26 Wireframe Suffix ── */}
        <g transform="translate(345, 12)">
          {/* Apostrophe ' */}
          <path d="M 5 8 L 12 8 L 7 20 L 2 20 Z" fill="#C8922A" className={animated ? 'cad-apostrophe-animate' : ''} style={animated ? { animationDelay: '1.6s' } : {}} />
          <path
            d="M 18 10 C 18 5, 38 5, 38 18 C 38 28, 18 36, 18 48 L 40 48"
            stroke="url(#wireframe-gold-grad)"
            strokeWidth="2.5"
            fill="none"
            className={drawClass}
            style={animated ? { animationDelay: '1.75s' } : {}}
          />
          <path
            d="M 68 12 C 60 12, 50 20, 50 32 C 50 46, 68 46, 68 34 C 68 25, 52 25, 52 34"
            stroke="url(#wireframe-gold-grad)"
            strokeWidth="2.5"
            fill="none"
            className={drawClass}
            style={animated ? { animationDelay: '1.9s' } : {}}
          />
        </g>
      </svg>
    </div>
  );
}
