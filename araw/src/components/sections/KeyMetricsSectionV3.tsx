/**
 * ARAW V3.0 Dashboard - Key Metrics Section
 * 
 * White container section containing the 5 KPI cards
 * JIRA: ARAW-314
 */

'use client';

import KPICardsRowV3 from '@/components/dashboard/KPICardsRowV3';

export interface KeyMetricsSectionV3Props {
  totalInvestment: string;
  ghgReduction: string;
  ghgReductionSubtitle?: string;
  adaptationInvestment: string;
  mitigationInvestment: string;
  totalProjects: string;
  className?: string;
}

export default function KeyMetricsSectionV3({
  totalInvestment,
  ghgReduction,
  ghgReductionSubtitle,
  adaptationInvestment,
  mitigationInvestment,
  totalProjects,
  className = ''
}: KeyMetricsSectionV3Props) {
  return (
    <div className={`bg-white rounded-lg border-4 border-gray-200 p-3 ${className}`}>
      {/* KPI Cards Row */}
      <KPICardsRowV3 
        totalInvestment={totalInvestment}
        ghgReduction={ghgReduction}
        ghgReductionSubtitle={ghgReductionSubtitle}
        adaptationInvestment={adaptationInvestment}
        mitigationInvestment={mitigationInvestment}
        totalProjects={totalProjects}
      />
    </div>
  );
}


