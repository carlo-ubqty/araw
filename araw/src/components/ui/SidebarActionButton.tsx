// Reusable Sidebar Action Button Component
import { Button } from "@heroui/react";
import { SIDEBAR_VARIANTS } from '@/models/ThemeModel';
import { SidebarSectionItem } from '@/models/FilterModel';

interface SidebarActionButtonProps {
  item: SidebarSectionItem;
  onClick: () => void;
  className?: string;
}

export function SidebarActionButton({ 
  item, 
  onClick, 
  className = "" 
}: SidebarActionButtonProps) {
  const variant = item.variant || 'default';
  const variantStyles = SIDEBAR_VARIANTS[variant];
  
  return (
    <Button
      size="sm"
      variant="flat"
      onClick={onClick}
      className={`
        w-full justify-start 
        ${variantStyles.background} 
        ${variantStyles.text} 
        ${variantStyles.hover}
        ${item.active ? 'ring-1 ring-gray-300' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {item.label}
    </Button>
  );
}



