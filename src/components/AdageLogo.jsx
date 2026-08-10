import React from 'react';

/**
 * AdageLogo renders the exact ADAGE logo image along with a polished
 * metallic gold '26 year indicator when showYear is true.
 */
export default function AdageLogo({ className = '', showYear = true, height, width, style = {} }) {
  return (
    <div className={`relative inline-flex items-center select-none pr-8 sm:pr-12 md:pr-16 ${className}`} style={{ overflow: 'visible', ...style }}>
      <img
        src="/adage-logo.png"
        alt="ADAGE"
        className="w-full h-auto select-none block"
        width={width}
        height={height}
        draggable={false}
      />
      {showYear && (
        <div className="absolute right-0 top-0 sm:top-1 flex items-center">
          <span className="font-cinzel font-black text-2xl sm:text-4xl md:text-5xl tracking-tighter text-[#C8922A] filter drop-shadow-[0_2px_12px_rgba(200,146,42,0.7)]">
            '26
          </span>
        </div>
      )}
    </div>
  );
}
