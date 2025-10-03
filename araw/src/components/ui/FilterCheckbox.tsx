// Reusable Filter Checkbox Component
import { THEME_COLORS } from '@/models/ThemeModel';

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function FilterCheckbox({ 
  id, 
  label, 
  checked, 
  onChange, 
  className = "" 
}: FilterCheckboxProps) {
  return (
    <label className={`flex items-center cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`
          rounded border-gray-300 
          text-[${THEME_COLORS.primary.main}] 
          focus:ring-[${THEME_COLORS.primary.main}] 
          focus:ring-opacity-50
          transition-colors
        `}
      />
      <span className="ml-2 text-sm text-gray-700 select-none">
        {label}
      </span>
    </label>
  );
}



