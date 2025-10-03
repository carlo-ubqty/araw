// Theme Model - Centralized color and styling constants
export const THEME_COLORS = {
  primary: {
    main: '#3C6866',
    light: '#4A7875', 
    dark: '#2E5450'
  },
  secondary: {
    green: '#2f8964',
    lightGreen: '#54d06c',
    blue: '#3B82F6',
    lightBlue: '#60A5FA'
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4'
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

// Sidebar variant styles
export const SIDEBAR_VARIANTS = {
  primary: {
    background: 'bg-green-50',
    text: 'text-green-700',
    hover: 'hover:bg-green-100'
  },
  secondary: {
    background: 'bg-blue-50', 
    text: 'text-blue-700',
    hover: 'hover:bg-blue-100'
  },
  default: {
    background: '',
    text: 'text-gray-700',
    hover: 'hover:bg-gray-50'
  }
};

// Common spacing and sizing
export const LAYOUT = {
  sidebar: {
    width: 'w-64',
    padding: 'p-4'
  },
  sections: {
    spacing: 'space-y-4',
    padding: 'px-4 pb-4'
  },
  checkboxes: {
    spacing: 'space-y-2',
    color: `text-[${THEME_COLORS.primary.main}]`,
    focusRing: `focus:ring-[${THEME_COLORS.primary.main}]`
  }
};



