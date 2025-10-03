// Filter Model - Business Logic and Data Structures
export interface FilterState {
  year: string;
  sectors: {
    [key: string]: boolean;
  };
  fundSource?: string;
  fundType?: string;
  implementingAgency?: string;
  vulnerabilityIndex?: string;
  incomeClass?: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  expanded: boolean;
  items?: SidebarSectionItem[];
}

export interface SidebarSectionItem {
  id: string;
  label: string;
  active?: boolean;
  variant?: 'primary' | 'secondary' | 'default';
}

// Default filter state
export const DEFAULT_FILTER_STATE: FilterState = {
  year: 'All Years',
  sectors: {
    allSectors: true,
    agriculture: false,
    water: false,
    forestry: false,
    coastalMarine: false,
    humanSettlements: false,
    other: false,
    energy: false
  }
};

// Sector configuration
export const SECTOR_OPTIONS = [
  { key: 'allSectors', label: 'All Sectors' },
  { key: 'agriculture', label: 'Agriculture' },
  { key: 'water', label: 'Water' },
  { key: 'forestry', label: 'Forestry' },
  { key: 'coastalMarine', label: 'Coastal & Marine' },
  { key: 'humanSettlements', label: 'Human Settlements' },
  { key: 'other', label: 'Other' },
  { key: 'energy', label: 'Energy' }
];

// Year options
export const YEAR_OPTIONS = [
  'All Years',
  '2024',
  '2023', 
  '2022',
  '2021',
  '2020'
];

// Sidebar sections configuration
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'filters',
    title: 'Filters',
    expanded: true
  },
  {
    id: 'nap',
    title: 'National Adaptation Plan',
    expanded: false,
    items: [
      { id: 'nap-overview', label: 'NAP Overview', active: true, variant: 'primary' },
      { id: 'adaptation-priorities', label: 'Adaptation Priorities', variant: 'default' },
      { id: 'implementation-status', label: 'Implementation Status', variant: 'default' }
    ]
  },
  {
    id: 'ndcip',
    title: 'NDC Implementation Plan', 
    expanded: false,
    items: [
      { id: 'ndcip-overview', label: 'NDCIP Overview', active: true, variant: 'secondary' },
      { id: 'mitigation-targets', label: 'Mitigation Targets', variant: 'default' },
      { id: 'progress-tracking', label: 'Progress Tracking', variant: 'default' }
    ]
  }
];

// Filter validation functions
export const FilterValidation = {
  isValidYear: (year: string): boolean => {
    return YEAR_OPTIONS.includes(year);
  },

  isValidSector: (sectorKey: string): boolean => {
    return SECTOR_OPTIONS.some(option => option.key === sectorKey);
  },

  hasSelectedSectors: (sectors: { [key: string]: boolean }): boolean => {
    return Object.values(sectors).some(selected => selected);
  }
};

// Filter transformation functions
export const FilterTransforms = {
  getSelectedSectors: (sectors: { [key: string]: boolean }): string[] => {
    return Object.entries(sectors)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);
  },

  updateAllSectorsFlag: (sectors: { [key: string]: boolean }): { [key: string]: boolean } => {
    const individualSectors = Object.entries(sectors)
      .filter(([key]) => key !== 'allSectors')
      .map(([_, value]) => value);
    
    return {
      ...sectors,
      allSectors: individualSectors.every(Boolean)
    };
  }
};



