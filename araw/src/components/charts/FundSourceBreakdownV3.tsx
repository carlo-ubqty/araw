/**
 * ARAW V3.0 Dashboard - Fund Source Breakdown Component
 * 
 * Displays funding breakdown with main card and three sub-cards
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-316
 */

'use client';

import { useState } from 'react';

export interface FundSourceItem {
  label: string;
  amount: string;
  percentage: string;
  color: string;
}

export interface FundSourceBreakdownV3Props {
  mainSource?: FundSourceItem;
  subSources?: FundSourceItem[];
  title?: string;
  showContainer?: boolean;
  className?: string;
}

export default function FundSourceBreakdownV3({
  mainSource = {
    label: 'GOVERNMENT BUDGET',
    amount: '₱ 980 M',
    percentage: '40%',
    color: '#1B9988'
  },
  subSources = [
    { label: 'GRANT', amount: '₱ 310 M', percentage: '32%', color: '#85C928' },
    { label: 'LOAN', amount: '₱ 175 M', percentage: '18%', color: '#1B9988' },
    { label: 'PRIVATE', amount: '₱ 95 M', percentage: '10%', color: '#C1CD23' }
  ],
  title = 'FUND SOURCE',
  showContainer = true,
  className = ''
}: FundSourceBreakdownV3Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const content = (
    <>
      {/* Title */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2" style={{ fontSize: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {title}
        </h3>
        <p className="text-gray-600 mt-1" style={{ fontSize: '11px' }}>
          72% of funding comes from external sources
        </p>
      </div>

      {/* Main Card - Government Budget with hover tooltip */}
      <div 
        className="rounded-md p-5 mb-3 relative cursor-pointer transition-shadow hover:shadow-lg"
        style={{ backgroundColor: mainSource.color, minHeight: '160px' }}
        onMouseEnter={() => setHoveredCard('gov')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col h-full justify-between">
          <span className="text-white font-medium opacity-95 mb-2" style={{ fontSize: '11px' }}>
            {mainSource.label}
          </span>
          <div className="flex items-end justify-between mt-auto">
            <span className="text-white font-bold" style={{ fontSize: '48px', lineHeight: '1' }}>
              {mainSource.amount}
            </span>
            <span className="text-white font-bold" style={{ fontSize: '36px', lineHeight: '1' }}>
              {mainSource.percentage}
            </span>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredCard === 'gov' && (
          <div 
            className="absolute top-4 right-4 bg-white rounded-md shadow-xl p-3 z-10"
            style={{ width: '200px' }}
          >
            <p className="font-semibold text-gray-900 mb-2" style={{ fontSize: '11px' }}>
              Government Budget
            </p>
            <div className="mb-3">
              <p className="text-gray-600 mb-1" style={{ fontSize: '9px' }}>₱ Amount</p>
              <p className="font-bold text-gray-900" style={{ fontSize: '13px' }}>₱980 M (40%)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1" style={{ fontSize: '10px' }}>Insights</p>
              <p className="text-gray-700" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                • Largest funding source, contributing nearly half of total climate funds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Cards Grid - Grant (left, tall), Loan and Private (right, stacked) */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto' }}>
        {/* Grant - spans 2 rows */}
        <div 
          className="rounded-md p-4 cursor-pointer transition-shadow hover:shadow-lg" 
          style={{ backgroundColor: subSources[0].color, gridRow: 'span 2', minHeight: '240px' }}
        >
          <div className="flex flex-col h-full justify-between">
            <span className="text-white font-medium opacity-95 mb-2" style={{ fontSize: '11px' }}>
              {subSources[0].label}
            </span>
            <div className="mt-auto">
              <span className="text-white font-bold block mb-2" style={{ fontSize: '32px', lineHeight: '1' }}>
                {subSources[0].amount}
              </span>
              <span className="text-white font-semibold" style={{ fontSize: '24px' }}>
                {subSources[0].percentage}
              </span>
            </div>
          </div>
        </div>

        {/* Loan - top right */}
        <div 
          className="rounded-md p-4 cursor-pointer transition-shadow hover:shadow-lg" 
          style={{ backgroundColor: subSources[1].color, minHeight: '115px' }}
        >
          <div className="flex flex-col h-full justify-between">
            <span className="text-white font-medium opacity-95 mb-2" style={{ fontSize: '11px' }}>
              {subSources[1].label}
            </span>
            <div className="mt-auto">
              <span className="text-white font-bold block mb-1" style={{ fontSize: '28px', lineHeight: '1' }}>
                {subSources[1].amount}
              </span>
              <span className="text-white font-semibold" style={{ fontSize: '20px' }}>
                {subSources[1].percentage}
              </span>
            </div>
          </div>
        </div>

        {/* Private - bottom right */}
        <div 
          className="rounded-md p-4 cursor-pointer transition-shadow hover:shadow-lg" 
          style={{ backgroundColor: subSources[2].color, minHeight: '115px' }}
        >
          <div className="flex flex-col h-full justify-between">
            <span className="text-white font-medium opacity-95 mb-2" style={{ fontSize: '11px' }}>
              {subSources[2].label}
            </span>
            <div className="mt-auto">
              <span className="text-white font-bold block mb-1" style={{ fontSize: '28px', lineHeight: '1' }}>
                {subSources[2].amount}
              </span>
              <span className="text-white font-semibold" style={{ fontSize: '20px' }}>
                {subSources[2].percentage}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (!showContainer) {
    return content;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {content}
    </div>
  );
}


