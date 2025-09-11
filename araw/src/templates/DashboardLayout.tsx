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
    <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* Header Section */}
      <Header {...headerProps} />
      
      {/* Filter Bar Section (Optional) */}
      {showFilterBar && <FilterBar />}
      
      {/* Main Content Section */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer Section */}
      <footer className="bg-[#4b1f63] text-white py-3">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-sm">
            © 2025 Climate Finance Dashboard. All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}

// Export types for external use
export type { DashboardLayoutProps };


