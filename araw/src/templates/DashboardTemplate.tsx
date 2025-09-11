// Dashboard layout template with proper Server/Client separation
import { ReactNode } from 'react';

interface DashboardTemplateProps {
  header: ReactNode;
  filters: ReactNode;
  kpis: ReactNode;
  charts: ReactNode;
  title?: string;
  lastUpdated?: string;
}

export function DashboardTemplate({ 
  header, 
  filters, 
  kpis, 
  charts, 
  title = "Dashboard",
  lastUpdated 
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        {header}
      </header>

      {/* Filter Section */}
      <section className="filter-section">
        {filters}
      </section>

      {/* Main Dashboard Content */}
      <main className="dashboard-content">
        <div className="px-6 py-6">
          {/* Dashboard Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {/* KPI Section */}
          <section className="kpi-section mb-8" aria-label="Key Performance Indicators">
            {kpis}
          </section>

          {/* Charts Section */}
          <section className="charts-section" aria-label="Data Visualizations">
            {charts}
          </section>
        </div>
      </main>
    </div>
  );
}

interface DashboardHeaderProps {
  title: string;
  badges?: Array<{ label: string; color: string; bgColor: string }>;
  lastUpdated?: string;
}

export function DashboardHeader({ title, badges, lastUpdated }: DashboardHeaderProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {badges && (
            <div className="flex gap-2">
              {badges.map((badge, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 ${badge.bgColor} ${badge.color} text-sm rounded-full`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
        {lastUpdated && (
          <div className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
