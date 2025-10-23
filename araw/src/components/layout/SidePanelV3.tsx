/**
 * ARAW V3.0 Dashboard - Side Panel Component
 * 
 * Left sidebar with collapsible filter groups
 * JIRA: ARAW-313
 */

'use client';

import { useState } from 'react';
import { FilterState } from '@/lib/types-v3';

export interface SidePanelV3Props {
  onFilterChange?: (filters: Partial<FilterState>) => void;
  className?: string;
}

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left py-2 hover:bg-gray-50 rounded px-2 transition-colors"
      >
        <span className="font-semibold" style={{ fontSize: '16px' }}>
          {title}
        </span>
        <span className="text-gray-500" style={{ fontSize: '16px' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 space-y-2 px-2">
          {children}
        </div>
      )}
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
      />
      <span className="text-gray-700" style={{ fontSize: '14px' }}>
        {label}
      </span>
    </label>
  );
}

export default function SidePanelV3({ onFilterChange, className = '' }: SidePanelV3Props) {
  // Section expansion states
  const [openSections, setOpenSections] = useState({
    fundSource: false,
    fundType: true,
    funder: false,
    implementingAgency: false,
    climateImpactDrivers: false,
    incomeClass: false
  });

  // Filter states
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedFundTypes, setSelectedFundTypes] = useState<string[]>(['Public', 'Private']);
  const [selectedFunders, setSelectedFunders] = useState<string[]>([
    'Asian Development Bank',
    'United Nations Development Programme (UNDP)',
    'World Bank'
  ]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([
    'Department of Energy',
    'Department of Human Settlements and Urban Development'
  ]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleYearToggle = (year: number) => {
    const newYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    
    setSelectedYears(newYears);
    onFilterChange?.({ selectedYears: newYears });
  };

  const handleFundTypeToggle = (type: string) => {
    setSelectedFundTypes(prev => {
      const newTypes = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      return newTypes;
    });
  };

  const handleFunderToggle = (funder: string) => {
    setSelectedFunders(prev => {
      const newFunders = prev.includes(funder)
        ? prev.filter(f => f !== funder)
        : [...prev, funder];
      return newFunders;
    });
  };

  const handleAgencyToggle = (agency: string) => {
    setSelectedAgencies(prev => {
      const newAgencies = prev.includes(agency)
        ? prev.filter(a => a !== agency)
        : [...prev, agency];
      return newAgencies;
    });
  };

  const years = [2025, 2024, 2023, 2022, 2021];
  const fundTypes = ['Public', 'Private', 'Mixed'];
  const funders = [
    'Asian Development Bank',
    'United Nations Development Programme (UNDP)',
    'World Bank',
    'Green Climate Fund'
  ];
  const agencies = [
    'Department of Agriculture',
    'Department of Energy',
    'Department of Human Settlements and Urban Development',
    'Department of Tourism'
  ];

  return (
    <aside
      className={`w-[295px] h-full overflow-y-auto ${className}`}
      style={{ backgroundColor: '#FAFAFA' }}
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pb-2 border-b-2 border-gray-300">
          <h2 className="font-semibold text-gray-800" style={{ fontSize: '18px' }}>
            Filters
          </h2>
        </div>

        {/* Year Filter - Always visible */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold mb-3" style={{ fontSize: '16px' }}>
            Year
          </h3>
          <div className="space-y-2">
            {years.map(year => (
              <CheckboxItem
                key={year}
                label={year.toString()}
                checked={selectedYears.includes(year)}
                onChange={() => handleYearToggle(year)}
              />
            ))}
          </div>
        </div>

        {/* Fund Source */}
        <CollapsibleSection
          title="Fund Source"
          isOpen={openSections.fundSource}
          onToggle={() => toggleSection('fundSource')}
        >
          <div className="text-sm text-gray-600">
            Fund source options will be populated here
          </div>
        </CollapsibleSection>

        {/* Fund Type */}
        <CollapsibleSection
          title="Fund Type"
          isOpen={openSections.fundType}
          onToggle={() => toggleSection('fundType')}
        >
          {fundTypes.map(type => (
            <CheckboxItem
              key={type}
              label={type}
              checked={selectedFundTypes.includes(type)}
              onChange={() => handleFundTypeToggle(type)}
            />
          ))}
        </CollapsibleSection>

        {/* Funder */}
        <CollapsibleSection
          title="Funder"
          isOpen={openSections.funder}
          onToggle={() => toggleSection('funder')}
        >
          {funders.map(funder => (
            <CheckboxItem
              key={funder}
              label={funder}
              checked={selectedFunders.includes(funder)}
              onChange={() => handleFunderToggle(funder)}
            />
          ))}
        </CollapsibleSection>

        {/* Implementing Agency */}
        <CollapsibleSection
          title="Implementing Agency"
          isOpen={openSections.implementingAgency}
          onToggle={() => toggleSection('implementingAgency')}
        >
          {agencies.map(agency => (
            <CheckboxItem
              key={agency}
              label={agency}
              checked={selectedAgencies.includes(agency)}
              onChange={() => handleAgencyToggle(agency)}
            />
          ))}
        </CollapsibleSection>

        {/* Climate Impact Drivers */}
        <CollapsibleSection
          title="Climate Impact Drivers"
          isOpen={openSections.climateImpactDrivers}
          onToggle={() => toggleSection('climateImpactDrivers')}
        >
          <div className="text-sm text-gray-600">
            Climate impact drivers will be populated here
          </div>
        </CollapsibleSection>

        {/* Income Class */}
        <CollapsibleSection
          title="Income Class"
          isOpen={openSections.incomeClass}
          onToggle={() => toggleSection('incomeClass')}
        >
          <div className="text-sm text-gray-600">
            Income class options will be populated here
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
}


