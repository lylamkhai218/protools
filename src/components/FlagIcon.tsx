import React from 'react';

export type SupportedLocale = 'vi' | 'en' | 'de' | 'zh-CN' | 'ko' | 'ja' | 'th';

interface FlagIconProps {
  country: SupportedLocale | string;
  className?: string;
  width?: number;
  height?: number;
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  country,
  className = '',
  width = 18,
  height = 12
}) => {
  const baseClasses = `inline-block shrink-0 rounded-[1.5px] overflow-hidden shadow-2xs border border-black/10 align-middle ${className}`;

  switch (country) {
    case 'vi':
      // Vietnam Flag: Red field with centered gold star
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="Cờ Việt Nam"
        >
          <rect width="18" height="12" fill="#DA251D" />
          <polygon
            fill="#FFFF00"
            points="9,2.2 10.18,5.82 13.98,5.82 10.9,8.06 12.08,11.68 9,9.44 5.92,11.68 7.1,8.06 4.02,5.82 7.82,5.82"
          />
        </svg>
      );

    case 'en':
      // United Kingdom (Union Jack)
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="Flag of the United Kingdom"
        >
          <clipPath id="uk-clip">
            <rect width="18" height="12" />
          </clipPath>
          <g clipPath="url(#uk-clip)">
            <rect width="18" height="12" fill="#012169" />
            <path d="M0,0 L18,12 M18,0 L0,12" stroke="#FFFFFF" strokeWidth="2.4" />
            <path d="M0,0 L18,12 M18,0 L0,12" stroke="#C8102E" strokeWidth="1.2" />
            <path d="M9,0 V12 M0,6 H18" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M9,0 V12 M0,6 H18" stroke="#C8102E" strokeWidth="2.4" />
          </g>
        </svg>
      );

    case 'de':
      // Germany Flag: Black, Red, Gold horizontal stripes
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="Flagge von Deutschland"
        >
          <rect width="18" height="4" y="0" fill="#000000" />
          <rect width="18" height="4" y="4" fill="#DD0000" />
          <rect width="18" height="4" y="8" fill="#FFCE00" />
        </svg>
      );

    case 'zh-CN':
    case 'zh':
      // China Flag: Red field with 5 golden stars
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="中华人民共和国国旗"
        >
          <rect width="18" height="12" fill="#DE2910" />
          {/* Main big star */}
          <polygon
            fill="#FFDE00"
            points="3,1.5 3.5,3.1 5.1,3.1 3.8,4.1 4.3,5.6 3,4.6 1.7,5.6 2.2,4.1 0.9,3.1 2.5,3.1"
          />
          {/* 4 smaller stars */}
          <circle cx="6" cy="1.6" r="0.45" fill="#FFDE00" />
          <circle cx="7.2" cy="2.7" r="0.45" fill="#FFDE00" />
          <circle cx="7.2" cy="4.4" r="0.45" fill="#FFDE00" />
          <circle cx="6" cy="5.5" r="0.45" fill="#FFDE00" />
        </svg>
      );

    case 'ko':
      // South Korea Flag: White field with Taegeuk symbol and 4 trigrams
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="대한민국 국기"
        >
          <rect width="18" height="12" fill="#FFFFFF" />
          {/* Taegeuk Red top & Blue bottom */}
          <path d="M 9,3.5 A 2.5,2.5 0 0,1 9,8.5 A 1.25,1.25 0 0,1 9,6 A 1.25,1.25 0 0,0 9,3.5" fill="#CD2E3A" />
          <path d="M 9,8.5 A 2.5,2.5 0 0,1 9,3.5 A 1.25,1.25 0 0,1 9,6 A 1.25,1.25 0 0,0 9,8.5" fill="#0047A0" />
          {/* Trigrams */}
          <rect x="2.5" y="2.5" width="2" height="0.6" fill="#000000" transform="rotate(33, 3.5, 2.8)" />
          <rect x="13.5" y="2.5" width="2" height="0.6" fill="#000000" transform="rotate(-33, 14.5, 2.8)" />
          <rect x="2.5" y="8.8" width="2" height="0.6" fill="#000000" transform="rotate(-33, 3.5, 9.1)" />
          <rect x="13.5" y="8.8" width="2" height="0.6" fill="#000000" transform="rotate(33, 14.5, 9.1)" />
        </svg>
      );

    case 'ja':
      // Japan Flag: White field with red sun disk
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="日本の国旗"
        >
          <rect width="18" height="12" fill="#FFFFFF" />
          <circle cx="9" cy="6" r="3.6" fill="#BC002D" />
        </svg>
      );

    case 'th':
      // Thailand Flag: Red, White, Blue (double), White, Red horizontal stripes (1:1:2:1:1)
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
          aria-label="ธงชาติไทย"
        >
          <rect width="18" height="2" y="0" fill="#A51931" />
          <rect width="18" height="2" y="2" fill="#F4F5F8" />
          <rect width="18" height="4" y="4" fill="#2D2A4A" />
          <rect width="18" height="2" y="8" fill="#F4F5F8" />
          <rect width="18" height="2" y="10" fill="#A51931" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 18 12"
          width={width}
          height={height}
          className={baseClasses}
        >
          <rect width="18" height="12" fill="#CBD5E1" />
          <text x="9" y="8" fontSize="6" textAnchor="middle" fill="#475569" fontWeight="bold">
            {country?.toUpperCase()?.slice(0, 2)}
          </text>
        </svg>
      );
  }
};
