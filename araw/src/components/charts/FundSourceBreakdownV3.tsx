/**
 * ARAW V3.0 Dashboard - Fund Source Breakdown Component
 * 
 * Displays funding breakdown with main card and three sub-cards
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-316
 */

'use client';

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
  className?: string;
}

export default function FundSourceBreakdownV3({
  mainSource = {
    label: 'GOVERNMENT BUDGET',
    amount: '₱ 980 M',
    percentage: '40%',
    color: '#049688'
  },
  subSources = [
    { label: 'GRANT', amount: '₱ 310 M', percentage: '32%', color: '#63CD00' },
    { label: 'LOAN', amount: '₱ 175 M', percentage: '18%', color: '#00AE9A' },
    { label: 'PRIVATE', amount: '₱ 95 M', percentage: '10%', color: '#A6C012' }
  ],
  title = 'FUND SOURCE',
  className = ''
}: FundSourceBreakdownV3Props) {
  return (
    <div className={`${className}`}>
      {/* Title */}
      {title && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900" style={{ fontSize: '20px' }}>
            {title}
          </h3>
        </div>
      )}

      {/* Main Card - Government Budget */}
      <div 
        className="rounded-lg p-6 mb-4 shadow-sm"
        style={{ backgroundColor: mainSource.color }}
      >
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium opacity-90 mb-2">
            {mainSource.label}
          </span>
          <div className="flex items-end justify-between">
            <span className="text-white font-bold" style={{ fontSize: '48px', lineHeight: '1' }}>
              {mainSource.amount}
            </span>
            <span className="text-white font-bold" style={{ fontSize: '36px', lineHeight: '1' }}>
              {mainSource.percentage}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Cards - Grant, Loan, Private */}
      <div className="grid grid-cols-3 gap-3">
        {subSources.map((source, index) => (
          <div 
            key={index}
            className="rounded-lg p-4 shadow-sm"
            style={{ backgroundColor: source.color }}
          >
            <div className="flex flex-col">
              <span className="text-white text-xs font-medium opacity-90 mb-2">
                {source.label}
              </span>
              <span className="text-white font-bold mb-1" style={{ fontSize: '24px', lineHeight: '1' }}>
                {source.amount}
              </span>
              <span className="text-white font-semibold" style={{ fontSize: '18px' }}>
                {source.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


