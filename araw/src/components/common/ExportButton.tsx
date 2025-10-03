"use client";

import { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { ExportService } from '@/services/ExportService';
import { ClimateInvestment } from '@/types/DataSources';

interface ExportButtonProps {
  data: any[];
  dataType: 'investments' | 'projects' | 'general';
  filename?: string;
  className?: string;
}

export function ExportButton({ data, dataType, filename, className = "" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const exportService = ExportService.getInstance();

  const handleExport = async (format: 'CSV' | 'XLSX' | 'PDF') => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    try {
      setIsExporting(true);
      
      let blob: Blob;
      let suggestedFilename: string;

      if (dataType === 'investments') {
        blob = await exportService.exportClimateInvestments(
          data as ClimateInvestment[], 
          format,
          'current-user', // Would get from auth context
          'Dashboard Export'
        );
        suggestedFilename = `climate-investments-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      } else {
        const request = {
          format,
          dataTypes: [dataType],
          filters: {},
          dateRange: {
            start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
            end: new Date()
          },
          includeMetadata: true,
          requestedBy: 'current-user',
          purpose: 'Dashboard Export'
        };
        
        blob = await exportService.exportData(request, data);
        suggestedFilename = exportService.getSuggestedFilename(request);
      }

      const finalFilename = filename || suggestedFilename;
      exportService.triggerDownload(blob, finalFilename);
      
      setShowOptions(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'CSV': return <Table className="w-4 h-4" />;
      case 'XLSX': return <FileSpreadsheet className="w-4 h-4" />;
      case 'PDF': return <FileText className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-[#2f8964] text-white rounded-lg hover:bg-[#2f8964]/90 transition-colors duration-200 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export Data'}
      </button>

      {showOptions && (
        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b">Export Format</div>
            
            <button
              onClick={() => handleExport('CSV')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              {getFormatIcon('CSV')}
              <span>CSV File</span>
            </button>
            
            <button
              onClick={() => handleExport('XLSX')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              {getFormatIcon('XLSX')}
              <span>Excel File</span>
            </button>
            
            <button
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              {getFormatIcon('PDF')}
              <span>PDF Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



