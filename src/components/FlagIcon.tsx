import React from 'react';

interface FlagIconProps {
  countryCode: string;
  className?: string;
}

export default function FlagIcon({ countryCode, className = "w-5 h-3.5" }: FlagIconProps) {
  const cn = `inline-block rounded-xs shadow-xs border border-zinc-200/50 object-cover shrink-0 select-none ${className}`;

  if (countryCode === 'VI') {
    return (
      <svg className={cn} viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#da251d" />
        <polygon fill="#ffff00" points="15,4 16.2,8.5 20.8,8.5 17.1,11.3 18.5,15.8 15,13 11.5,15.8 12.9,11.3 9.2,8.5 13.8,8.5" />
      </svg>
    );
  }
  if (countryCode === 'EN') {
    return (
      <svg className={cn} viewBox="0 0 50 30">
        <rect width="50" height="30" fill="#012169" />
        <path d="M0,0 L50,30 M50,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L50,30 M50,0 L0,30" stroke="#c8102e" strokeWidth="4" fill="none" />
        <path d="M25,0 L25,30 M0,15 L50,15" stroke="#fff" strokeWidth="10" />
        <path d="M25,0 L25,30 M0,15 L50,15" stroke="#c8102e" strokeWidth="6" fill="none" />
      </svg>
    );
  }
  if (countryCode === 'DE') {
    return (
      <svg className={cn} viewBox="0 0 5 3">
        <rect width="5" height="1" fill="#000" />
        <rect y="1" width="5" height="1" fill="#dd0000" />
        <rect y="2" width="5" height="1" fill="#ffce00" />
      </svg>
    );
  }
  if (countryCode === 'KO') {
    return (
      <svg className={cn} viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#ffffff" />
        {/* Taegeuk: Outer circle split */}
        <g transform="translate(15, 10) rotate(-33.7)">
          {/* Lower half (blue) */}
          <path d="M-6,0 A6,6 0 0,0 6,0 Z" fill="#0f4c81" />
          {/* Upper half (red) */}
          <path d="M-6,0 A6,6 0 0,1 6,0 Z" fill="#c21d24" />
          {/* Sub-circles to make the S-curve */}
          <circle cx="-3" cy="0" r="3" fill="#c21d24" />
          <circle cx="3" cy="0" r="3" fill="#0f4c81" />
        </g>
        {/* Four black trigrams in corners */}
        {/* 1. Top-Left (Geon - 3 unbroken bars) */}
        <g transform="translate(7.5, 5) rotate(56.3)">
          <rect x="-3" y="-1.5" width="6" height="0.6" fill="#000000" />
          <rect x="-3" y="-0.5" width="6" height="0.6" fill="#000000" />
          <rect x="-3" y="0.5" width="6" height="0.6" fill="#000000" />
        </g>
        {/* 2. Bottom-Right (Gon - 3 broken bars) */}
        <g transform="translate(22.5, 15) rotate(56.3)">
          <rect x="-3" y="-1.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="0.3" y="-1.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="-3" y="-0.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="0.3" y="-0.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="-3" y="0.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="0.3" y="0.5" width="2.7" height="0.6" fill="#000000" />
        </g>
        {/* 3. Top-Right (Gam - broken, unbroken, broken) */}
        <g transform="translate(22.5, 5) rotate(-56.3)">
          <rect x="-3" y="-1.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="0.3" y="-1.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="-3" y="-0.5" width="6" height="0.6" fill="#000000" />
          <rect x="-3" y="0.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="0.3" y="0.5" width="2.7" height="0.6" fill="#000000" />
        </g>
        {/* 4. Bottom-Left (Ri - unbroken, broken, unbroken) */}
        <g transform="translate(7.5, 15) rotate(-56.3)">
          <rect x="-3" y="-1.5" width="6" height="0.6" fill="#000000" />
          <rect x="-3" y="-0.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="0.3" y="-0.5" width="2.7" height="0.6" fill="#000000" />
          <rect x="-3" y="0.5" width="6" height="0.6" fill="#000000" />
        </g>
      </svg>
    );
  }
  if (countryCode === 'ZH') {
    return (
      <svg className={cn} viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#ee1c25" />
        <path fill="#ffde00" d="M5,2 L5.6,3.8 L7.4,3.8 L5.9,4.9 L6.5,6.7 L5,5.6 L3.5,6.7 L4.1,4.9 L2.6,3.8 L4.4,3.8 Z" />
        <path fill="#ffde00" d="M9.3,2 L9.5,2.6 L10.1,2.4 L9.7,2.9 L10,3.4 L9.5,3.2 L9.1,3.6 L9.2,3 L8.7,2.6 L9.3,2.6 Z" />
        <path fill="#ffde00" d="M11,4 L11.2,4.6 L11.8,4.4 L11.4,4.9 L11.7,5.4 L11.2,5.2 L10.8,5.6 L10.9,5 L10.4,4.6 L11,4.6 Z" />
      </svg>
    );
  }
  if (countryCode === 'JA') {
    return (
      <svg className={cn} viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#fff" />
        <circle cx="1.5" cy="1" r="0.6" fill="#bc002d" />
      </svg>
    );
  }
  if (countryCode === 'TH') {
    return (
      <svg className={cn} viewBox="0 0 9 6">
        <rect width="9" height="1" fill="#A51931" />
        <rect y="1" width="9" height="1" fill="#F4F5F7" />
        <rect y="2" width="9" height="2" fill="#2D2C62" />
        <rect y="4" width="9" height="1" fill="#F4F5F7" />
        <rect y="5" width="9" height="1" fill="#A51931" />
      </svg>
    );
  }
  return null;
}
