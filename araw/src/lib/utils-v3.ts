/**
 * ARAW V3.0 Dashboard - Utility Functions
 * 
 * Helper functions for formatting, calculations, and common operations
 */

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Formats a number as Philippine Peso with abbreviations (B for billion, M for million)
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted string (e.g., "₱ 1.16 B", "₱ 980 M")
 */
export function formatCurrency(
  value: number,
  options?: {
    includeSymbol?: boolean;
    decimals?: number;
    abbreviate?: boolean;
  }
): string {
  const {
    includeSymbol = true,
    decimals = 2,
    abbreviate = true
  } = options || {};

  const symbol = includeSymbol ? '₱ ' : '';

  if (!abbreviate) {
    return `${symbol}${value.toLocaleString('en-PH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  }

  // Abbreviate large numbers
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `${symbol}${billions.toFixed(decimals)} B`;
  } else if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${symbol}${millions.toFixed(decimals)} M`;
  } else if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${symbol}${thousands.toFixed(decimals)} K`;
  }

  return `${symbol}${value.toFixed(decimals)}`;
}

/**
 * Parses a currency string back to number
 * @param value - Currency string (e.g., "₱ 1.16 B")
 * @returns Numeric value
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[₱,\s]/g, '');
  
  if (cleaned.endsWith('B')) {
    return parseFloat(cleaned.replace('B', '')) * 1_000_000_000;
  } else if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.replace('M', '')) * 1_000_000;
  } else if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1_000;
  }
  
  return parseFloat(cleaned);
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Abbreviates large numbers with suffixes
 * @param value - Number to abbreviate
 * @param decimals - Number of decimal places
 * @returns Abbreviated string (e.g., "1.2 B", "980 M")
 */
export function abbreviateNumber(value: number, decimals: number = 2): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals)} B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)} M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)} K`;
  }
  return value.toFixed(decimals);
}

/**
 * Formats a number with thousands separators
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string (e.g., "1,234,567.89")
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// ============================================================================
// PERCENTAGE FORMATTING
// ============================================================================

/**
 * Formats a number as a percentage
 * @param value - Number to format (e.g., 0.56 for 56%)
 * @param decimals - Number of decimal places
 * @param isDecimal - Whether the input is already a decimal (0-1) or a percentage (0-100)
 * @returns Formatted percentage string (e.g., "56%", "56.3%")
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  isDecimal: boolean = false
): string {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

// ============================================================================
// DATE/TIME FORMATTING
// ============================================================================

/**
 * Formats a Date object to match the dashboard timestamp format
 * @param date - Date object to format
 * @returns Formatted string (e.g., "09/10/2025 12:47:06 AM")
 */
export function formatDateTime(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).replace(', ', ' ');
}

/**
 * Formats a date to just date portion
 * @param date - Date object
 * @returns Formatted date string (e.g., "Sep 10, 2025")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats a year for display
 * @param year - Year number
 * @returns Formatted year string
 */
export function formatYear(year: number): string {
  return year.toString();
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Converts hex color to RGB
 * @param hex - Hex color code (e.g., "#049688")
 * @returns RGB object {r, g, b}
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts hex color to RGBA string
 * @param hex - Hex color code
 * @param alpha - Alpha value (0-1)
 * @returns RGBA string (e.g., "rgba(4, 150, 136, 0.4)")
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Determines if a color is light or dark (for text contrast)
 * @param hex - Hex color code
 * @returns 'light' or 'dark'
 */
export function getColorBrightness(hex: string): 'light' | 'dark' {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'dark';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'light' : 'dark';
}

// ============================================================================
// DATA UTILITIES
// ============================================================================

/**
 * Calculates percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculates sum of array of numbers
 * @param values - Array of numbers
 * @returns Sum
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculates average of array of numbers
 * @param values - Array of numbers
 * @returns Average
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

/**
 * Rounds a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncates a string to specified length with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalizes first letter of each word
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Converts string to kebab-case
 * @param str - String to convert
 * @returns Kebab-cased string
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Sorts array of objects by a numeric property
 * @param array - Array to sort
 * @param key - Property key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByKey<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });
}

/**
 * Groups array of objects by a property value
 * @param array - Array to group
 * @param key - Property key to group by
 * @returns Object with grouped arrays
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Checks if a value is a valid number
 * @param value - Value to check
 * @returns True if valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Checks if a string is empty or only whitespace
 * @param str - String to check
 * @returns True if empty
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

// ============================================================================
// DEBOUNCE/THROTTLE
// ============================================================================

/**
 * Creates a debounced function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Conditionally joins class names
 * @param classes - Class names or conditional objects
 * @returns Joined class name string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================================================
// EXPORT UTILITIES OBJECT
// ============================================================================

export const utils = {
  // Currency
  formatCurrency,
  parseCurrency,
  
  // Numbers
  abbreviateNumber,
  formatNumber,
  formatPercentage,
  
  // Date/Time
  formatDateTime,
  formatDate,
  formatYear,
  
  // Colors
  hexToRgb,
  hexToRgba,
  getColorBrightness,
  
  // Data
  calculatePercentageChange,
  sum,
  average,
  roundTo,
  
  // Strings
  truncate,
  capitalize,
  toKebabCase,
  
  // Arrays
  sortByKey,
  groupBy,
  
  // Validation
  isValidNumber,
  isEmpty,
  
  // Performance
  debounce,
  
  // Styling
  cn
} as const;

export default utils;

