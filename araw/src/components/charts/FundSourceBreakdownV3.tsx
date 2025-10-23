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
    color: '#00AE9A'  // Investment by Sector palette
  },
  subSources = [
    { label: 'GRANT', amount: '₱ 310 M', percentage: '32%', color: '#63CD00' },
    { label: 'LOAN', amount: '₱ 175 M', percentage: '18%', color: '#129900' },
    { label: 'PRIVATE', amount: '₱ 95 M', percentage: '10%', color: '#A6C012' }
  ],
  title = 'FUND SOURCE',
  showContainer = true,
  className = ''
}: FundSourceBreakdownV3Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Extract percentage numbers for proportional sizing
  const govPercent = parseInt(mainSource.percentage) || 0;
  const grantPercent = parseInt(subSources[0]?.percentage) || 0;
  const loanPercent = parseInt(subSources[1]?.percentage) || 0;
  const privatePercent = parseInt(subSources[2]?.percentage) || 0;
  
  // Calculate external funding percentage (non-government)
  const externalPercent = grantPercent + loanPercent + privatePercent;
  
  // Add minimum base size to ensure visibility, then add actual percentage
  // This exaggerates small values while keeping proportions
  const govFlex = Math.max(10, govPercent);
  const grantFlex = Math.max(8, grantPercent);
  const loanFlex = Math.max(5, loanPercent);
  const privateFlex = Math.max(3, privatePercent);
  
  // Make Loan+Private column equal to Grant (50% of row)
  const loanPrivateTotal = loanFlex + privateFlex;

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
          {externalPercent}% of funding comes from external sources
        </p>
      </div>

      {/* Proportional Layout - sizes match funding percentages */}
      {/* Calculated flex values ensure proportions with minimum visibility */}
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        {/* Row 1: Government Budget - proportional to percentage */}
        <div 
          className="rounded-md p-4 relative cursor-pointer transition-shadow hover:shadow-lg"
          style={{ backgroundColor: mainSource.color, flex: govFlex, minHeight: 0 }}
          onMouseEnter={() => setHoveredCard('gov')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="text-white font-medium opacity-95 mb-2" style={{ fontSize: '11px' }}>
                {mainSource.label}
              </div>
              <div className="text-white font-bold" style={{ fontSize: '48px', lineHeight: '1' }}>
                {mainSource.amount}
              </div>
            </div>
            <div className="text-white font-bold" style={{ fontSize: '36px', lineHeight: '1' }}>
              {mainSource.percentage}
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
                <p className="font-bold text-gray-900" style={{ fontSize: '13px' }}>
                  {mainSource.amount} ({mainSource.percentage})
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1" style={{ fontSize: '10px' }}>Insights</p>
                <p className="text-gray-700" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                  • Largest funding source, contributing {mainSource.percentage} of total climate funds.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Bottom row - Grant + (Loan + Private stacked) */}
        <div className="flex gap-2" style={{ flex: grantFlex + loanFlex + privateFlex, minHeight: 0 }}>
          {/* Grant - 50% of row */}
          <div 
            className="rounded-md p-4 cursor-pointer transition-shadow hover:shadow-lg" 
            style={{ backgroundColor: subSources[0].color, flex: 1, minHeight: 0 }}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="text-white font-medium opacity-95 mb-2" style={{ fontSize: '10px' }}>
                  {subSources[0].label}
                </div>
                <div className="text-white font-bold" style={{ fontSize: '24px', lineHeight: '1' }}>
                  {subSources[0].amount}
                </div>
              </div>
              <div className="text-white font-semibold" style={{ fontSize: '18px', lineHeight: '1' }}>
                {subSources[0].percentage}
              </div>
            </div>
          </div>

          {/* Right column: Loan + Private stacked - 50% of row */}
          <div className="flex flex-col gap-2" style={{ flex: 1, minHeight: 0 }}>
            {/* Loan - proportional to percentage */}
            <div 
              className="rounded-md p-2 cursor-pointer transition-shadow hover:shadow-lg" 
              style={{ backgroundColor: subSources[1].color, flex: loanFlex, minHeight: 0 }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-white font-medium opacity-95 mb-1" style={{ fontSize: '9px' }}>
                    {subSources[1].label}
                  </div>
                  <div className="text-white font-bold" style={{ fontSize: '16px', lineHeight: '1' }}>
                    {subSources[1].amount}
                  </div>
                </div>
                <div className="text-white font-semibold" style={{ fontSize: '14px', lineHeight: '1' }}>
                  {subSources[1].percentage}
                </div>
              </div>
            </div>

            {/* Private - proportional to percentage - smallest fonts */}
            <div 
              className="rounded-md p-2 cursor-pointer transition-shadow hover:shadow-lg" 
              style={{ backgroundColor: subSources[2].color, flex: privateFlex, minHeight: 0 }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-white font-medium opacity-95 mb-1" style={{ fontSize: '9px' }}>
                    {subSources[2].label}
                  </div>
                  <div className="text-white font-bold" style={{ fontSize: '14px', lineHeight: '1' }}>
                    {subSources[2].amount}
                  </div>
                </div>
                <div className="text-white font-semibold" style={{ fontSize: '12px', lineHeight: '1' }}>
                  {subSources[2].percentage}
                </div>
              </div>
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


