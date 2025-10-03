// Data Source Types for 165+ Integration Points
export interface DataSource {
  id: string;
  name: string;
  agency: string;
  type: 'api' | 'excel' | 'csv' | 'database';
  status: 'connected' | 'pending' | 'error' | 'manual';
  lastSync?: Date;
  recordCount?: number;
  description: string;
}

// Government Agencies
export type GovernmentAgency = 
  | 'BOI' | 'BSP' | 'BTr' | 'CCC' | 'DBM' | 'DENR' 
  | 'DEPDev' | 'DOF' | 'SEC' | 'LGU' | 'MDB' | 'ODA' 
  | 'PSA' | 'IC' | 'Private' | 'NGO' | 'Academe' | 'Other';

// Data Categories aligned with NAP/NDCIP
export interface DataCategory {
  id: string;
  name: string;
  pillar?: 'adaptation' | 'mitigation' | 'cross-cutting';
  framework: 'NAP' | 'NDCIP' | 'BUDGET' | 'PROJECTS';
}

// Investment Data Structure
export interface ClimateInvestment {
  id: string;
  title: string;
  amount: number;
  currency: 'PHP' | 'USD' | 'EUR';
  source: 'public' | 'private' | 'international' | 'mixed';
  sector: string;
  region: string;
  lgu?: string;
  category: 'adaptation' | 'mitigation' | 'biodiversity';
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  implementingAgency: string;
  fundingSource: DataSource[];
  genderAssessment?: boolean;
  ghgReduction?: number; // tCO2e
  vulnerabilityIndex?: number;
  napAlignment?: string[];
  ndcAlignment?: string[];
}

// Project Data Structure
export interface ClimateProject {
  id: string;
  name: string;
  description: string;
  investments: ClimateInvestment[];
  location: {
    region: string;
    province: string;
    municipality?: string;
    coordinates?: [number, number];
  };
  timeline: {
    planned: Date;
    started?: Date;
    completed?: Date;
  };
  stakeholders: string[];
  outcomes: {
    ghgReduction: number;
    adaptationBenefits: string[];
    beneficiaries: number;
  };
}

// BOI Specific Data Types (12 datasets)
export interface BOIDataset {
  registeredProjects: ClimateInvestment[];
  industryRoadmaps: any[];
  geoMapData: any[];
  investorsGuide: any[];
  rfoLocations: any[];
  evRoadmap: any[];
  criticalMinerals: any[];
  sippActivities: any[];
  approvedInvestments: any[];
  fiscalIncentives: any[];
  nonFiscalIncentives: any[];
  investmentPromotionData: any[];
}

// BSP Specific Data Types (6 datasets)  
export interface BSPDataset {
  bankingLoans: ClimateInvestment[];
  bondIssuances: any[];
  climateInvestments: ClimateInvestment[];
  damageAssessment: any[];
  sustainabilityPolicies: any[];
  regulatoryFramework: any[];
}

// Data Integration Status
export interface DataIntegrationStatus {
  totalSources: number;
  connectedSources: number;
  pendingSources: number;
  errorSources: number;
  lastUpdate: Date;
  dataQuality: {
    completeness: number; // percentage
    accuracy: number; // percentage
    timeliness: number; // hours since last update
  };
}

// User Role System for Tiered Access
export interface UserRole {
  id: string;
  name: string;
  permissions: {
    viewPublicData: boolean;
    viewSensitiveData: boolean;
    exportData: boolean;
    manageUsers: boolean;
    accessAdminPanel: boolean;
    viewDetailedFinancials: boolean;
  };
  dataAccess: {
    agencies: GovernmentAgency[];
    categories: string[];
    regions: string[];
  };
}

// Export Configuration
export interface ExportRequest {
  format: 'CSV' | 'XLSX' | 'PDF' | 'JSON';
  dataTypes: string[];
  filters: Record<string, any>;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeMetadata: boolean;
  requestedBy: string;
  purpose: string;
}



