// Export Service for CSV/XLS/PDF data export
import { ExportRequest, ClimateInvestment } from '@/types/DataSources';

export class ExportService {
  private static instance: ExportService;

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  // Export data based on request configuration
  async exportData(request: ExportRequest, data: any[]): Promise<Blob> {
    switch (request.format) {
      case 'CSV':
        return this.exportToCsv(data, request);
      case 'XLSX':
        return this.exportToExcel(data, request);
      case 'PDF':
        return this.exportToPdf(data, request);
      case 'JSON':
        return this.exportToJson(data, request);
      default:
        throw new Error(`Unsupported export format: ${request.format}`);
    }
  }

  // Export to CSV format
  private async exportToCsv(data: any[], request: ExportRequest): Promise<Blob> {
    const headers = this.getDataHeaders(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(item => headers.map(header => this.sanitizeCsvValue(item[header])).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Export to Excel format
  private async exportToExcel(data: any[], request: ExportRequest): Promise<Blob> {
    // Would use a library like 'xlsx' for actual Excel generation
    const csvBlob = await this.exportToCsv(data, request);
    
    // Placeholder - in real implementation, would generate proper Excel file
    return new Blob([await csvBlob.text()], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // Export to PDF format
  private async exportToPdf(data: any[], request: ExportRequest): Promise<Blob> {
    // Would use a library like 'jsPDF' or 'pdfkit' for PDF generation
    const content = this.generatePdfContent(data, request);
    
    // Placeholder - in real implementation, would generate proper PDF
    return new Blob([content], { type: 'application/pdf' });
  }

  // Export to JSON format
  private async exportToJson(data: any[], request: ExportRequest): Promise<Blob> {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: request.requestedBy,
        purpose: request.purpose,
        filters: request.filters,
        dateRange: request.dateRange
      },
      data: data
    };

    return new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
  }

  // Get data headers from sample object
  private getDataHeaders(sampleObject: any): string[] {
    if (!sampleObject) return [];
    return Object.keys(sampleObject);
  }

  // Sanitize CSV values
  private sanitizeCsvValue(value: any): string {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  // Generate PDF content structure
  private generatePdfContent(data: any[], request: ExportRequest): string {
    // Placeholder for PDF content generation
    return `Climate Finance Data Export
    
Exported: ${new Date().toISOString()}
Exported By: ${request.requestedBy}
Purpose: ${request.purpose}
Date Range: ${request.dateRange.start.toISOString()} to ${request.dateRange.end.toISOString()}

Total Records: ${data.length}

[Data would be formatted as tables/charts here]`;
  }

  // Export climate investments with specialized formatting
  async exportClimateInvestments(
    investments: ClimateInvestment[], 
    format: 'CSV' | 'XLSX' | 'PDF',
    userId: string,
    purpose: string
  ): Promise<Blob> {
    const request: ExportRequest = {
      format,
      dataTypes: ['climate_investments'],
      filters: {},
      dateRange: {
        start: new Date(Math.min(...investments.map(i => i.startDate.getTime()))),
        end: new Date(Math.max(...investments.map(i => (i.endDate || new Date()).getTime())))
      },
      includeMetadata: true,
      requestedBy: userId,
      purpose
    };

    // Transform investments for export
    const exportData = investments.map(investment => ({
      ID: investment.id,
      Title: investment.title,
      'Amount (PHP)': investment.amount,
      Currency: investment.currency,
      Source: investment.source,
      Sector: investment.sector,
      Region: investment.region,
      LGU: investment.lgu || '',
      Category: investment.category,
      Status: investment.status,
      'Start Date': investment.startDate.toISOString().split('T')[0],
      'End Date': investment.endDate?.toISOString().split('T')[0] || '',
      'Implementing Agency': investment.implementingAgency,
      'Gender Assessment': investment.genderAssessment ? 'Yes' : 'No',
      'GHG Reduction (tCO2e)': investment.ghgReduction || 0,
      'Vulnerability Index': investment.vulnerabilityIndex || '',
      'NAP Alignment': investment.napAlignment?.join('; ') || '',
      'NDC Alignment': investment.ndcAlignment?.join('; ') || ''
    }));

    return this.exportData(request, exportData);
  }

  // Generate download link for blob
  generateDownloadLink(blob: Blob, filename: string): string {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    return url;
  }

  // Trigger download
  triggerDownload(blob: Blob, filename: string): void {
    const url = this.generateDownloadLink(blob, filename);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Get suggested filename based on export request
  getSuggestedFilename(request: ExportRequest): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const dataType = request.dataTypes.join('-');
    const extension = request.format.toLowerCase();
    return `climate-finance-${dataType}-${timestamp}.${extension}`;
  }
}



