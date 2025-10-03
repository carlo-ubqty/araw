"use client";

import { Button } from "@heroui/react";
import { Settings, Bell } from "lucide-react";
import { useState, useEffect } from "react";


interface HeaderProps {
  title?: string;
  logoText?: string;
  logoSrc?: string; // optional image logo
  showDateTime?: boolean;
  className?: string;
}


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
  showDateTime = true,
  className = "",
}: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  // Real-time clock update
  useEffect(() => {
    const updateDateTime = () => {
      setCurrentDateTime(formatDateTime());
    };
    
    updateDateTime(); // Initial update
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);


  return (
    <header className={`bg-[#3C6866] text-white ${className}`}>
      <div className="px-6 py-2.5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
          {/* Left Section: Logo & Title */}
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#3C6866] font-bold text-sm">{logoText}</span>
              </div>
            )}
            <h1 className="text-sm md:text-base lg:text-lg font-normal tracking-normal">{title}</h1>
          </div>


          {/* Right Section: DateTime & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Real-time DateTime - Hidden on small tablets and below */}
            {showDateTime && (
              <div className="hidden lg:block text-xs lg:text-sm text-white/90 font-mono tracking-wider">
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
export type { HeaderProps };