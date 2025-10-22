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
  title = 'Climate Finance Dashboard',
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
      className={`w-full ${className}`}
      style={{
        backgroundColor: HEADER.backgroundColor,
        height: HEADER.height,
        color: HEADER.textColor
      }}
    >
      {/* Container with max-width matching page content */}
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: Philippines Icon + DOF Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Philippines Flag/Emblem Icon */}
          <div className="flex-shrink-0">
            <svg
              width={HEADER.logoSize}
              height={HEADER.logoSize}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simple Philippines flag representation */}
              <circle cx="16" cy="16" r="15" fill="white" stroke="currentColor" strokeWidth="1"/>
              <path d="M16 4 L16 16 L4 16 Z" fill="#0038A8"/>
              <path d="M16 16 L28 16 L16 28 Z" fill="#CE1126"/>
              <circle cx="16" cy="16" r="4" fill="#FCD116"/>
            </svg>
          </div>

          {/* DOF Logo */}
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

          {/* Title - 24px semibold */}
          <h1 
            className="font-semibold whitespace-nowrap"
            style={{
              fontSize: '24px',
              letterSpacing: '0.02em'
            }}
          >
            {title}
          </h1>
        </div>

        {/* Right: Clock + Action Icons */}
        <div className="flex items-center gap-4">
          {/* Real-time Clock - 16px regular */}
          {showDateTime && mounted && (
            <div className="flex items-center gap-2">
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

              {/* Time Display - 16px regular */}
              <span
                className="font-normal whitespace-nowrap"
                style={{
                  fontSize: '16px',
                  letterSpacing: '0.01em'
                }}
              >
                {currentTime}
              </span>
            </div>
          )}

          {/* Notification Bell Icon */}
          <button
            type="button"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Notifications"
          >
            <svg
              width={HEADER.iconSize}
              height={HEADER.iconSize}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Settings Gear Icon */}
          <button
            type="button"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Settings"
          >
            <svg
              width={HEADER.iconSize}
              height={HEADER.iconSize}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 1V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 21V23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.22 4.22L5.64 5.64"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.36 18.36L19.78 19.78"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.22 19.78L5.64 18.36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.36 5.64L19.78 4.22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

