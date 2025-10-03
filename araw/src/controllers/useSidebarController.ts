// Sidebar Controller - Custom hook for sidebar state management
import { useState, useCallback } from 'react';
import { SidebarSection, SIDEBAR_SECTIONS } from '@/models/FilterModel';

export function useSidebarController(initialSections?: SidebarSection[]) {
  const [sections, setSections] = useState<SidebarSection[]>(
    initialSections || SIDEBAR_SECTIONS
  );

  // Toggle section expanded state
  const toggleSection = useCallback((sectionId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  }, []);

  // Set active item in section
  const setActiveItem = useCallback((sectionId: string, itemId: string) => {
    setSections(prev => 
      prev.map(section => {
        if (section.id === sectionId && section.items) {
          return {
            ...section,
            items: section.items.map(item => ({
              ...item,
              active: item.id === itemId
            }))
          };
        }
        return section;
      })
    );
  }, []);

  // Get section by ID
  const getSection = useCallback((sectionId: string) => {
    return sections.find(section => section.id === sectionId);
  }, [sections]);

  // Get active item in section
  const getActiveItem = useCallback((sectionId: string) => {
    const section = getSection(sectionId);
    return section?.items?.find(item => item.active);
  }, [getSection]);

  // Expand/collapse all sections
  const expandAllSections = useCallback(() => {
    setSections(prev => 
      prev.map(section => ({ ...section, expanded: true }))
    );
  }, []);

  const collapseAllSections = useCallback(() => {
    setSections(prev => 
      prev.map(section => ({ ...section, expanded: false }))
    );
  }, []);

  return {
    // State
    sections,
    
    // Section handlers
    toggleSection,
    expandAllSections,
    collapseAllSections,
    
    // Item handlers
    setActiveItem,
    
    // Getters
    getSection,
    getActiveItem
  };
}



