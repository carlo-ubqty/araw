"use client";

import { Button } from "@heroui/react";
import { Settings, Bell } from "lucide-react";
import { useState, useEffect } from "react";

// TypeScript interfaces for proper typing
interface NavigationItem {
  id: string;
  label: string;
  active?: boolean;
}

interface HeaderProps {
  title?: string;
  logoText?: string;
  logoSrc?: string; // optional image logo
  navigationItems?: NavigationItem[];
  showDateTime?: boolean;
  className?: string;
}

// Navigation configuration (DRY principle)
const DEFAULT_NAVIGATION: NavigationItem[] = [
  { id: "all", label: "All Data", active: true },
  { id: "nap", label: "NAP Data", active: false },
  { id: "ndcip", label: "NDCIP Data", active: false },
];

// Real-time date formatting utility - matching mockup format (no comma between date and time)
const formatDateTime = (): string => {
  const now = new Date();
  return now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(", ", " ");
};

export function Header({
  title = "Climate Finance Dashboard",
  logoText = "CF",
  logoSrc,
  navigationItems = DEFAULT_NAVIGATION,
  showDateTime = true,
  className = "",
}: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [activeNav, setActiveNav] = useState<string>("all");

  // Real-time clock update
  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDateTime(formatDateTime());
    };
    
    updateDateTime(); // Initial update
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Navigation handler
  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    // TODO: Implement actual navigation logic
  };

  return (
    <header className={`bg-[#4b1f63] text-white ${className}`}>
      <div className="px-6 py-2.5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between relative">
          {/* Left Section: Logo & Title */}
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-800 font-bold text-sm">{logoText}</span>
              </div>
            )}
            <h1 className="text-base lg:text-lg font-normal tracking-normal">{title}</h1>
          </div>

          {/* Center Section: Navigation Pills */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={activeNav === item.id ? "solid" : "light"}
                className={
                  activeNav === item.id
                    ? "bg-white/15 text-white text-xs px-3 py-1 h-auto min-w-0 rounded hover:bg-white/25"
                    : "text-white/90 text-xs px-3 py-1 h-auto min-w-0 rounded hover:bg-white/10"
                }
                onPress={() => handleNavClick(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Section: DateTime & Actions */}
          <div className="flex items-center gap-4">
            {/* Real-time DateTime */}
            {showDateTime && (
              <div className="text-xs lg:text-sm text-white/90 font-mono tracking-wider">
                {currentDateTime}
              </div>
            )}

            {/* Action Icons */}
            <div className="flex gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="p-1 text-white/90 hover:bg-white/10 rounded min-w-0 w-6 h-6"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="p-1 text-white/90 hover:bg-white/10 rounded min-w-0 w-6 h-6"
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}

// Export types for external use (DRY principle)
export type { HeaderProps, NavigationItem };