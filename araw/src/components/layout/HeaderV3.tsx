/**
 * ARAW V3.0 Dashboard - Header Component
 * 
 * Main header with DOF logo, title, and real-time clock
 * JIRA: ARAW-311
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HEADER } from '@/lib/design-system-v3';
import { formatDateTime } from '@/lib/utils-v3';

export interface HeaderV3Props {
  title?: string;
  logoSrc?: string;
  showDateTime?: boolean;
  className?: string;
}

export default function HeaderV3({
  title = 'ARAW: Climate Finance Dashboard',
  logoSrc = '/Department_of_Finance_(DOF).svg',
  showDateTime = true,
  className = ''
}: HeaderV3Props) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Initialize clock on mount
  useEffect(() => {
    setMounted(true);
    setCurrentTime(formatDateTime());

    const intervalId = setInterval(() => {
      setCurrentTime(formatDateTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header
      className={`w-full flex items-center justify-between px-6 ${className}`}
      style={{
        backgroundColor: HEADER.backgroundColor,
        height: HEADER.height,
        color: HEADER.textColor
      }}
    >
      {/* Left: DOF Logo */}
      <div className="flex items-center gap-3">
        <div
          className="relative flex-shrink-0"
          style={{
            width: HEADER.logoSize,
            height: HEADER.logoSize
          }}
        >
          <Image
            src={logoSrc}
            alt="Department of Finance Logo"
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Center: Title */}
      <div className="flex-1 flex justify-center">
        <h1 
          className="font-semibold text-center"
          style={{
            fontSize: '18px',
            letterSpacing: '0.02em'
          }}
        >
          {title}
        </h1>
      </div>

      {/* Right: Real-time Clock */}
      <div className="flex items-center gap-2">
        {showDateTime && mounted && (
          <>
            {/* Clock Icon */}
            <svg
              width={HEADER.iconSize}
              height={HEADER.iconSize}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Time Display */}
            <span
              className="font-medium whitespace-nowrap"
              style={{
                fontSize: '14px',
                letterSpacing: '0.01em'
              }}
            >
              {currentTime}
            </span>
          </>
        )}
      </div>
    </header>
  );
}

