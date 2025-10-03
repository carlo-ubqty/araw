// Filter Controller - Custom hook for filter state management
import { useState, useCallback } from 'react';
import { 
  FilterState, 
  DEFAULT_FILTER_STATE, 
  FilterValidation, 
  FilterTransforms 
} from '@/models/FilterModel';

export function useFilterController(initialState?: FilterState) {
  const [filterState, setFilterState] = useState<FilterState>(
    initialState || DEFAULT_FILTER_STATE
  );

  // Year filter handler
  const handleYearChange = useCallback((year: string) => {
    if (!FilterValidation.isValidYear(year)) {
      console.warn(`Invalid year selected: ${year}`);
      return;
    }
    
    setFilterState(prev => ({ ...prev, year }));
  }, []);

  // Sector filter handlers
  const handleSectorChange = useCallback((sectorKey: string) => {
    if (!FilterValidation.isValidSector(sectorKey)) {
      console.warn(`Invalid sector selected: ${sectorKey}`);
      return;
    }

    setFilterState(prev => {
      let newSectors = { ...prev.sectors };

      if (sectorKey === 'allSectors') {
        // Toggle all sectors
        const newValue = !newSectors.allSectors;
        newSectors = Object.keys(newSectors).reduce((acc, key) => ({
          ...acc,
          [key]: newValue
        }), {});
      } else {
        // Toggle individual sector
        newSectors[sectorKey] = !newSectors[sectorKey];
        // Update allSectors flag based on individual selections
        newSectors = FilterTransforms.updateAllSectorsFlag(newSectors);
      }

      return { ...prev, sectors: newSectors };
    });
  }, []);

  // Additional filter handlers
  const handleFundSourceChange = useCallback((fundSource: string) => {
    setFilterState(prev => ({ ...prev, fundSource }));
  }, []);

  const handleFundTypeChange = useCallback((fundType: string) => {
    setFilterState(prev => ({ ...prev, fundType }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilterState(DEFAULT_FILTER_STATE);
  }, []);

  // Get applied filters summary
  const getAppliedFiltersCount = useCallback(() => {
    let count = 0;
    
    if (filterState.year !== 'All Years') count++;
    if (!filterState.sectors.allSectors) count++;
    if (filterState.fundSource) count++;
    if (filterState.fundType) count++;
    
    return count;
  }, [filterState]);

  // Get selected sectors array
  const getSelectedSectors = useCallback(() => {
    return FilterTransforms.getSelectedSectors(filterState.sectors);
  }, [filterState.sectors]);

  return {
    // State
    filterState,
    
    // Handlers
    handleYearChange,
    handleSectorChange,
    handleFundSourceChange,
    handleFundTypeChange,
    
    // Utilities
    resetFilters,
    getAppliedFiltersCount,
    getSelectedSectors,
    
    // Validation
    isValidState: FilterValidation.hasSelectedSectors(filterState.sectors)
  };
}



