"use client";

import { ReactNode } from "react";
import { Header, HeaderProps } from "@/components/layout/Header";
import { FilterBar } from "@/components/dashboard/FilterBar";

// TypeScript interface for layout props
interface DashboardLayoutProps {
  children: ReactNode;
  headerProps?: Partial<HeaderProps>;
  showFilterBar?: boolean;
  className?: string;
}

/**
 * DashboardLayout Template - Main layout for dashboard pages
 * Implements DRY principles with configurable header and filter bar
 */
export function DashboardLayout({
  children,
  headerProps = {},
  showFilterBar = true,
  className = "",
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header Section */}
      <Header {...headerProps} />
      
      {/* Filter Bar Section (Optional) */}
      {showFilterBar && <FilterBar />}
      
      {/* Main Content Section */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Export types for external use
export type { DashboardLayoutProps };

