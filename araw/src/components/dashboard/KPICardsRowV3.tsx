/**
 * ARAW V3.0 Dashboard - KPI Cards Row Component
 * 
 * Displays 5 key metric cards in a horizontal row
 * JIRA: ARAW-314
 */

'use client';

import KPICardV3 from './KPICardV3';
import { KPI_GRADIENTS } from '@/lib/design-system-v3';

// Simple SVG Icons for KPI Cards
function PesoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 6H14C16.2091 6 18 7.79086 18 10C18 12.2091 16.2091 14 14 14H7V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 6V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 10H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10C19.6569 10 21 11.3431 21 13C21 14.6569 19.6569 16 18 16H7C4.79086 16 3 14.2091 3 12C3 9.79086 4.79086 8 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17.5523 8 18 8.44772 18 9V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 20C11 20 5 15 5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10C19 15 13 20 13 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 10C14.2091 10 16 8.20914 16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export interface KPICardsRowV3Props {
  totalInvestment?: string;
  ghgReduction?: string;
  ghgReductionSubtitle?: string;
  adaptationInvestment?: string;
  mitigationInvestment?: string;
  totalProjects?: string;
  className?: string;
}

export default function KPICardsRowV3({
  totalInvestment = '₱ 1.16 B',
  ghgReduction = '56%',
  ghgReductionSubtitle = 'vs 2020 baseline',
  adaptationInvestment = '₱ 1.12 B',
  mitigationInvestment = '₱ 32.64 M',
  totalProjects = '579',
  className = ''
}: KPICardsRowV3Props) {
  return (
    <div className={`grid grid-cols-5 gap-3 ${className}`}>
      {/* Card 1: Total Investment */}
      <KPICardV3
        icon={<PesoIcon />}
        label="TOTAL INVESTMENT"
        value={totalInvestment}
        gradientFrom={KPI_GRADIENTS.totalInvestment.from}
        gradientTo={KPI_GRADIENTS.totalInvestment.to}
      />

      {/* Card 2: GHG Reduction Actual */}
      <KPICardV3
        icon={<CloudIcon />}
        label="GHG REDUCTION ACTUAL"
        value={ghgReduction}
        subtitle={ghgReductionSubtitle}
        gradientFrom={KPI_GRADIENTS.ghgReduction.from}
        gradientTo={KPI_GRADIENTS.ghgReduction.to}
      />

      {/* Card 3: Adaptation Investment */}
      <KPICardV3
        icon={<ShieldIcon />}
        label="ADAPTATION INVESTMENT"
        value={adaptationInvestment}
        gradientFrom={KPI_GRADIENTS.adaptationInvestment.from}
        gradientTo={KPI_GRADIENTS.adaptationInvestment.to}
      />

      {/* Card 4: Mitigation Investment */}
      <KPICardV3
        icon={<LeafIcon />}
        label="MITIGATION INVESTMENT"
        value={mitigationInvestment}
        gradientFrom={KPI_GRADIENTS.mitigationInvestment.from}
        gradientTo={KPI_GRADIENTS.mitigationInvestment.to}
      />

      {/* Card 5: Total Projects */}
      <KPICardV3
        icon={<ProjectsIcon />}
        label="TOTAL PROJECTS"
        value={totalProjects}
        gradientFrom={KPI_GRADIENTS.totalProjects.from}
        gradientTo={KPI_GRADIENTS.totalProjects.to}
      />
    </div>
  );
}

