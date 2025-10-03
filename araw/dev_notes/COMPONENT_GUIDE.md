# 🧩 Component Development Guide

## Component Architecture Patterns

### 1. **Pure UI Components** (Views)
Components that only handle presentation and user interaction.

```typescript
// ✅ Good: Pure UI Component
interface SidebarSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function SidebarSection({ title, expanded, onToggle, children }: SidebarSectionProps) {
  // Only UI logic, no business logic
  return (
    <div>
      <button onClick={onToggle}>
        {title} {expanded ? <ChevronDown /> : <ChevronRight />}
      </button>
      {expanded && children}
    </div>
  );
}
```

### 2. **Controller Hooks** (Logic)
Custom hooks that manage state and business logic.

```typescript
// ✅ Good: Controller Hook
export function useFilterController() {
  const [filterState, setFilterState] = useState(DEFAULT_FILTER_STATE);
  
  const handleSectorChange = useCallback((sectorKey: string) => {
    // Business logic here
    setFilterState(prev => FilterTransforms.updateSectors(prev, sectorKey));
  }, []);

  return {
    filterState,
    handleSectorChange,
    // ... other handlers
  };
}
```

### 3. **Smart Components** (Containers)
Components that combine UI and logic using controllers.

```typescript
// ✅ Good: Smart Component
export function FilterSection() {
  // Use controller for logic
  const { filterState, handleSectorChange } = useFilterController();
  const { toggleSection } = useSidebarController();

  return (
    <SidebarSection 
      title="Filters" 
      expanded={true}
      onToggle={() => toggleSection('filters')}
    >
      {SECTOR_OPTIONS.map(sector => (
        <FilterCheckbox
          key={sector.key}
          label={sector.label}
          checked={filterState.sectors[sector.key]}
          onChange={() => handleSectorChange(sector.key)}
        />
      ))}
    </SidebarSection>
  );
}
```

---

## 🎨 UI Component Patterns

### Reusable Component Checklist
- [ ] **Single Responsibility**: Does one thing well
- [ ] **Props Interface**: Clear TypeScript interface
- [ ] **No Business Logic**: Pure presentation only  
- [ ] **Composable**: Can be combined with other components
- [ ] **Styled with Tailwind**: No custom CSS
- [ ] **Accessible**: ARIA attributes where needed

### Example: Building a Reusable Component
```typescript
// 1. Define clear props interface
interface ActionButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'default';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

// 2. Use design system constants
import { SIDEBAR_VARIANTS } from '@/models/ThemeModel';

// 3. Implement with composition patterns
export function ActionButton({ 
  children, 
  variant = 'default', 
  size = 'md',
  onClick,
  disabled = false,
  className = ""
}: ActionButtonProps) {
  const variantStyles = SIDEBAR_VARIANTS[variant];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles.background}
        ${variantStyles.text} 
        ${variantStyles.hover}
        ${size === 'sm' ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
```

---

## 🎛️ State Management Patterns

### Controller Hook Pattern
```typescript
export function useFeatureController(initialState?: FeatureState) {
  // 1. State definition
  const [state, setState] = useState(initialState || DEFAULT_STATE);
  
  // 2. Action handlers (memoized)
  const handleAction = useCallback((param: string) => {
    setState(prev => FeatureModel.transform(prev, param));
  }, []);
  
  // 3. Computed values (memoized)  
  const computedValue = useMemo(() => {
    return FeatureModel.calculate(state);
  }, [state]);
  
  // 4. Return interface
  return {
    // State
    state,
    computedValue,
    
    // Actions  
    handleAction,
    
    // Utilities
    reset: () => setState(DEFAULT_STATE),
    isValid: FeatureModel.validate(state)
  };
}
```

### Component Integration Pattern
```typescript
// Smart Component using controller
export function FeatureComponent() {
  const controller = useFeatureController();
  
  return (
    <div>
      <FeatureDisplay 
        value={controller.state.value}
        computed={controller.computedValue}
      />
      <FeatureActions
        onAction={controller.handleAction}
        onReset={controller.reset}
        disabled={!controller.isValid}
      />
    </div>
  );
}
```

---

## 📊 Model Layer Patterns

### Data Models
```typescript
// 1. Type definitions
export interface FeatureState {
  value: string;
  options: FeatureOption[];
  metadata?: FeatureMetadata;
}

// 2. Default state
export const DEFAULT_FEATURE_STATE: FeatureState = {
  value: '',
  options: [],
  metadata: undefined
};

// 3. Validation functions
export const FeatureValidation = {
  isValidValue: (value: string): boolean => {
    return value.length > 0 && value.length <= 100;
  },
  
  hasRequiredFields: (state: FeatureState): boolean => {
    return state.value !== '' && state.options.length > 0;
  }
};

// 4. Transformation functions  
export const FeatureTransforms = {
  updateValue: (state: FeatureState, newValue: string): FeatureState => {
    return { ...state, value: newValue };
  },
  
  addOption: (state: FeatureState, option: FeatureOption): FeatureState => {
    return { ...state, options: [...state.options, option] };
  }
};
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Patterns
```typescript
// ✅ Good: Use design system constants
import { THEME_COLORS, LAYOUT } from '@/models/ThemeModel';

const styles = {
  container: `${LAYOUT.sidebar.width} bg-white border-r border-gray-200`,
  button: `px-4 py-2 rounded-md text-[${THEME_COLORS.primary.main}]`,
  text: 'text-sm text-gray-700 font-medium'
};

// ✅ Good: Conditional classes with clsx (if needed)
import clsx from 'clsx';

const buttonClasses = clsx(
  'px-4 py-2 rounded-md transition-colors',
  isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700',
  disabled && 'opacity-50 cursor-not-allowed'
);
```

### Component Styling Best Practices
- **Use Tailwind Classes**: No custom CSS
- **Design System**: Reference theme constants
- **Conditional Styling**: Use template literals or clsx
- **Responsive**: Include responsive breakpoints (md:, lg:)
- **Hover States**: Always include hover states for interactive elements

---

## 🧪 Testing Patterns

### Component Testing (Planned)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterCheckbox } from '@/components/ui/FilterCheckbox';

describe('FilterCheckbox', () => {
  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    
    render(
      <FilterCheckbox
        id="test"
        label="Test Label"
        checked={false}
        onChange={handleChange}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Test Label'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
```

### Controller Testing (Planned)
```typescript
import { renderHook, act } from '@testing-library/react';
import { useFilterController } from '@/controllers/useFilterController';

describe('useFilterController', () => {
  it('updates sector selection correctly', () => {
    const { result } = renderHook(() => useFilterController());
    
    act(() => {
      result.current.handleSectorChange('agriculture');
    });
    
    expect(result.current.filterState.sectors.agriculture).toBe(true);
  });
});
```

---

## 📋 Development Checklist

### Before Creating a New Component
- [ ] Check if similar component exists
- [ ] Define clear single responsibility
- [ ] Plan props interface
- [ ] Determine if it needs business logic (controller)
- [ ] Consider reusability across project

### Component Development Steps
1. **Create Model** (if business logic needed)
2. **Create Controller Hook** (if state management needed) 
3. **Create UI Component** (pure presentation)
4. **Create Smart Component** (combine UI + logic)
5. **Add to Storybook** (planned)
6. **Write Tests** (planned)

### Code Review Checklist
- [ ] Follows MVC separation
- [ ] Uses TypeScript interfaces
- [ ] No business logic in UI components
- [ ] Uses design system constants
- [ ] Follows naming conventions
- [ ] Includes proper error handling

---

**Remember**: Every component should be a small, focused, reusable piece that follows our architectural patterns! 🎯



