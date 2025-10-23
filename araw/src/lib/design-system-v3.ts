/**
 * ARAW V3.0 Dashboard - Design System Constants
 * 
 * Color palette, typography, spacing, and other design tokens
 * Based on specifications from v3_design_system.txt
 */

// ============================================================================
// PRIMARY COLOR PALETTE
// ============================================================================

export const COLORS = {
  // Primary Brand Colors
  teal: '#049688',
  black: '#161616',
  white: '#FFFFFF',
  backdropAccent: '#D8EEE8',
  
  // Subheader
  subheaderBg: '#DDFFF6',
  
  // Side Panel
  sidePanelBg: '#FAFAFA',
  
  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// ============================================================================
// KPI CARD GRADIENTS
// ============================================================================

export const KPI_GRADIENTS = {
  totalInvestment: {
    from: '#349260',
    to: '#83BB5B',
    label: 'Green Gradient'
  },
  ghgReduction: {
    from: '#29D2EC',
    to: '#0099FF',
    label: 'Blue Gradient'
  },
  adaptationInvestment: {
    from: '#F16C19',
    to: '#F1DF3C',
    label: 'Orange-Yellow Gradient'
  },
  mitigationInvestment: {
    from: '#F16C19',
    to: '#F1DF3C',
    label: 'Orange-Yellow Gradient'
  },
  totalProjects: {
    from: '#007CF8',
    to: '#6F37FF',
    label: 'Indigo Gradient'
  }
} as const;

// ============================================================================
// CHART COLOR PALETTES
// ============================================================================

// Funds Mobilized Chart Colors
export const FUNDS_CHART_COLORS = {
  adaptation: '#F16C19', // Orange
  mitigation: '#F1DF3C', // Yellow
  adaptationOpacity: 'rgba(241, 108, 25, 0.4)',
  mitigationOpacity: 'rgba(241, 223, 60, 0.4)'
} as const;

// GHG Levels Chart Colors
export const GHG_LEVELS_COLORS = {
  line: '#0099FF', // Blue
  dataPoint: '#0099FF',
  target: '#FF6B6B' // Red/Orange for target marker
} as const;

// Investment by Sector Colors
export const INVESTMENT_SECTOR_COLORS = {
  governmentBudget: '#129900', // Dark green
  grant: '#63CD00',            // Green
  loan: '#00AE9A',             // Teal
  private: '#A6C012',          // Yellow-green
  grid: '#F0F0F0'              // Light gray
} as const;

// Fund Source Card Colors
export const FUND_SOURCE_COLORS = {
  governmentBudget: '#049688', // Teal (primary)
  grant: '#63CD00',            // Bright green
  loan: '#2D8659',             // Medium green
  private: '#A6C012'           // Yellow-green
} as const;

// GHG Baseline Chart Colors
export const GHG_BASELINE_COLORS = {
  actual: '#AFE2FF',           // Light blue
  conditional: '#006FAF',      // Medium blue
  unconditional: '#F38A00',    // Orange
  actualLine: '#AFE2FF',
  conditionalLine: '#006FAF',
  unconditionalLine: '#F38A00'
} as const;

// Regional Investments Colors (Blue Gradient)
export const REGIONAL_COLORS = {
  darkBlue: '#173F75',
  brightBlue: '#007BFF',
  mutedBlue: '#5093E0',
  lightBlue: '#8DB7EC'
} as const;

// Map Bubble Colors (Income Class - Green Shades)
export const MAP_BUBBLE_COLORS = {
  class1: '#E8F4CF', // Light green (Income Class 1)
  class2: '#ABE47D', // Apple green
  class3: '#83DE9E', // Green
  class4: '#65C595', // Bright green
  class5: '#216F82'  // Dark green/teal
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px'
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75'
  }
} as const;

// ============================================================================
// SPACING SCALE
// ============================================================================

export const SPACING = {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem'     // 96px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px'
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// ============================================================================
// COMPONENT-SPECIFIC CONSTANTS
// ============================================================================

// Header
export const HEADER = {
  height: '60px',
  backgroundColor: COLORS.teal,
  textColor: COLORS.white,
  logoSize: '32px',
  iconSize: '20px'
} as const;

// Subheader
export const SUBHEADER = {
  backgroundColor: COLORS.subheaderBg,
  borderColor: COLORS.teal,
  height: '80px',
  padding: SPACING[4]
} as const;

// Side Panel
export const SIDE_PANEL = {
  width: '250px',
  backgroundColor: COLORS.sidePanelBg,
  padding: SPACING[4]
} as const;

// KPI Cards
export const KPI_CARD = {
  height: '140px',
  padding: SPACING[5],
  borderRadius: BORDER_RADIUS.base,
  shadow: SHADOWS.lg,
  gap: SPACING[3],
  iconSize: '16px',
  labelSize: TYPOGRAPHY.fontSize.sm,
  valueSize: TYPOGRAPHY.fontSize['4xl'],
  valueFontWeight: TYPOGRAPHY.fontWeight.bold
} as const;

// Chart Cards
export const CHART_CARD = {
  padding: SPACING[5],
  borderRadius: BORDER_RADIUS.base,
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.gray200}`,
  titleSize: TYPOGRAPHY.fontSize.lg,
  titleWeight: TYPOGRAPHY.fontWeight.semibold,
  subtitleSize: TYPOGRAPHY.fontSize.sm,
  subtitleWeight: TYPOGRAPHY.fontWeight.regular
} as const;

// Footer
export const FOOTER = {
  backgroundColor: COLORS.teal,
  textColor: COLORS.white,
  height: '200px',
  padding: `${SPACING[8]} ${SPACING[10]}`
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a CSS gradient string from gradient colors
 */
export const createGradient = (from: string, to: string, direction = 'to right'): string => {
  return `linear-gradient(${direction}, ${from}, ${to})`;
};

/**
 * Gets gradient for KPI card type
 */
export const getKPIGradient = (type: keyof typeof KPI_GRADIENTS): string => {
  const gradient = KPI_GRADIENTS[type];
  return createGradient(gradient.from, gradient.to);
};

/**
 * Creates rgba color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Simple hex to rgba conversion (assumes 6-digit hex)
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export const DESIGN_SYSTEM = {
  colors: COLORS,
  kpiGradients: KPI_GRADIENTS,
  fundsChartColors: FUNDS_CHART_COLORS,
  ghgLevelsColors: GHG_LEVELS_COLORS,
  investmentSectorColors: INVESTMENT_SECTOR_COLORS,
  fundSourceColors: FUND_SOURCE_COLORS,
  ghgBaselineColors: GHG_BASELINE_COLORS,
  regionalColors: REGIONAL_COLORS,
  mapBubbleColors: MAP_BUBBLE_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  breakpoints: BREAKPOINTS,
  components: {
    header: HEADER,
    subheader: SUBHEADER,
    sidePanel: SIDE_PANEL,
    kpiCard: KPI_CARD,
    chartCard: CHART_CARD,
    footer: FOOTER
  },
  utils: {
    createGradient,
    getKPIGradient,
    withOpacity
  }
} as const;

export default DESIGN_SYSTEM;


