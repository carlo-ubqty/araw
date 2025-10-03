// Reusable Sidebar Section Component
import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
  className?: string;
}

export function SidebarSection({ 
  title, 
  expanded, 
  onToggle, 
  children, 
  className = "" 
}: SidebarSectionProps) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 transition-transform" />
        )}
      </button>
      
      {expanded && children && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}



