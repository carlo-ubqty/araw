/**
 * ARAW V3.0 Dashboard - Subheader Component
 * 
 * Filter controls bar with NAP/NDCIP toggle, sector chips, and action buttons
 * JIRA: ARAW-312
 */

'use client';

import { useState } from 'react';
import { COLORS } from '@/lib/design-system-v3';
import { NAP_SECTORS, NDCIP_SECTORS } from '@/lib/types-v3';
import type { DataView } from '@/lib/types-v3';

export interface SubheaderV3Props {
  className?: string;
  onDataViewChange?: (view: DataView) => void;
  onSectorsChange?: (sectors: string[]) => void;
  onDisplayModeChange?: (mode: 'amount' | 'projects') => void;
  onStatusChange?: (status: 'ongoing' | 'completed') => void;
}

export default function SubheaderV3({
  className = '',
  onDataViewChange,
  onSectorsChange,
  onDisplayModeChange,
  onStatusChange
}: SubheaderV3Props) {
  const [dataView, setDataView] = useState<DataView>('NAP');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'amount' | 'projects'>('amount');
  const [status, setStatus] = useState<'ongoing' | 'completed'>('completed');

  // Get current sector list based on data view
  const currentSectors = dataView === 'NAP' ? NAP_SECTORS : NDCIP_SECTORS;

  const handleDataViewChange = (view: DataView) => {
    setDataView(view);
    setSelectedSectors([]); // Reset sectors when switching views
    onDataViewChange?.(view);
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter(s => s !== sector)
      : [...selectedSectors, sector];
    
    setSelectedSectors(newSectors);
    onSectorsChange?.(newSectors);
  };

  const handleDisplayModeChange = (mode: 'amount' | 'projects') => {
    setDisplayMode(mode);
    onDisplayModeChange?.(mode);
  };

  const handleStatusChange = (newStatus: 'ongoing' | 'completed') => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  return (
    <div
      className={`w-full border-t-2 ${className}`}
      style={{
        backgroundColor: COLORS.subheaderBg,
        borderColor: COLORS.teal
      }}
    >
      {/* Container: Full width (parent is already 1625px) */}
      <div className="w-full">
        <div>
          {/* Row 1: Data View Toggle + Action Buttons - WHITE BACKGROUND, 80px height */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-300 bg-white h-[80px] px-5">
            {/* Left: NAP/NDCIP Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-gray-700 whitespace-nowrap" style={{ fontSize: '13px' }}>
                Adjust display by:
              </label>
              
              {/* NAP Button */}
              <button
                onClick={() => handleDataViewChange('NAP')}
                className={`px-4 py-2 rounded-lg font-normal transition-colors whitespace-nowrap ${
                  dataView === 'NAP'
                    ? 'bg-gradient-to-r from-[#00ACC1] to-[#00BCD4] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontSize: '13px' }}
              >
                {dataView === 'NAP' ? '◉' : '○'} NATIONAL ADAPTATION PLAN (NAP) DATA
              </button>

              {/* NDCIP Button */}
              <button
                onClick={() => handleDataViewChange('NDCIP')}
                className={`px-4 py-2 rounded-lg font-normal transition-colors whitespace-nowrap ${
                  dataView === 'NDCIP'
                    ? 'bg-gradient-to-r from-[#00ACC1] to-[#00BCD4] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontSize: '13px' }}
              >
                {dataView === 'NDCIP' ? '◉' : '○'} NDC IMPLEMENTATION PLAN (NDCIP) DATA
              </button>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              {/* AMOUNT Button */}
              <button
                onClick={() => handleDisplayModeChange('amount')}
                className={`px-4 py-2 rounded-lg font-normal transition-colors whitespace-nowrap ${
                  displayMode === 'amount'
                    ? 'bg-[#4CAF50] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontSize: '13px' }}
              >
                {displayMode === 'amount' ? '◉' : '○'} AMOUNT
              </button>

              {/* PROJECTS Button */}
              <button
                onClick={() => handleDisplayModeChange('projects')}
                className={`px-4 py-2 rounded-lg font-normal transition-colors whitespace-nowrap ${
                  displayMode === 'projects'
                    ? 'bg-[#4CAF50] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontSize: '13px' }}
              >
                {displayMode === 'projects' ? '◉' : '○'} PROJECTS
              </button>

              {/* ONGOING Button */}
              <button
                onClick={() => handleStatusChange('ongoing')}
                className={`px-4 py-2 rounded-lg font-normal transition-colors whitespace-nowrap ${
                  status === 'ongoing'
                    ? 'bg-gradient-to-r from-[#007CF8] to-[#6F37FF] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontSize: '13px' }}
              >
                {status === 'ongoing' ? '◉' : '○'} ONGOING
              </button>

              {/* COMPLETED Button */}
              <button
                onClick={() => handleStatusChange('completed')}
                className={`px-4 py-2 rounded-lg font-normal transition-colors whitespace-nowrap ${
                  status === 'completed'
                    ? 'bg-gradient-to-r from-[#007CF8] to-[#6F37FF] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontSize: '13px' }}
              >
                {status === 'completed' ? '◉' : '○'} COMPLETED
              </button>
            </div>
          </div>

          {/* Row 2: Sector Chips - LIGHT GRAY BACKGROUND */}
          <div className="flex items-center gap-3 bg-gray-50 py-4 min-h-[60px] px-5">
            <label className="text-gray-800 whitespace-nowrap font-medium" style={{ fontSize: '16px' }}>
              Select sectors:
            </label>
            <div className="flex flex-wrap gap-2">
              {currentSectors.map((sector) => {
                const isSelected = selectedSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    onClick={() => handleSectorToggle(sector)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-normal transition-all whitespace-nowrap ${
                      isSelected
                        ? 'text-gray-900 border-2 border-teal-600'
                        : 'bg-white border-2 border-gray-300 text-gray-800 hover:border-teal-500'
                    }`}
                    style={{ 
                      backgroundColor: isSelected ? '#DDFFF6' : 'white'
                    }}
                  >
                    {sector}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

