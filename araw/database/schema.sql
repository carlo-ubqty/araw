-- ============================================================================
-- ARAW V3.0 Philippine Climate Finance Dashboard
-- MySQL Database Schema
-- ============================================================================
-- Version: 1.0
-- Date: October 23, 2025
-- Target: MySQL 8.0+
-- Description: Complete database schema for climate finance tracking
-- ============================================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS project_climate_impact_drivers;
DROP TABLE IF EXISTS project_funders;
DROP TABLE IF EXISTS project_implementing_agencies;
DROP TABLE IF EXISTS investments;
DROP TABLE IF EXISTS ghg_emissions;
DROP TABLE IF EXISTS ghg_targets;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS climate_impact_drivers;
DROP TABLE IF EXISTS implementing_agencies;
DROP TABLE IF EXISTS funders;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS sectors;

-- ============================================================================
-- CORE MASTER DATA TABLES
-- ============================================================================

-- Sectors (NAP: 8 sectors, NDCIP: 5 sectors)
CREATE TABLE sectors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    data_view ENUM('NAP', 'NDCIP', 'BOTH') NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_data_view (data_view),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Philippine Regions (17 regions)
CREATE TABLE regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    coordinates_lat DECIMAL(10, 7),
    coordinates_lon DECIMAL(10, 7),
    income_class ENUM('1', '2', '3', '4', '5'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_income_class (income_class)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Funders (International, Multilateral, Bilateral, etc.)
CREATE TABLE funders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    funder_type ENUM('multilateral', 'bilateral', 'private', 'government') NOT NULL,
    country VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (funder_type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Implementing Agencies (Government departments)
CREATE TABLE implementing_agencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Climate Impact Drivers (4 drivers per NICCDIES)
CREATE TABLE climate_impact_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PROJECT AND INVESTMENT TABLES
-- ============================================================================

-- Projects (Climate Finance Projects)
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(100) UNIQUE,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    sector_id INT NOT NULL,
    region_id INT,
    start_date DATE,
    end_date DATE,
    status ENUM('ongoing', 'completed', 'planned', 'cancelled') DEFAULT 'ongoing',
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'PHP',
    data_view ENUM('NAP', 'NDCIP', 'BOTH') NOT NULL,
    is_nationwide BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE RESTRICT,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_sector (sector_id),
    INDEX idx_region (region_id),
    INDEX idx_data_view (data_view),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Investments (Funding breakdown per project)
CREATE TABLE investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    funder_id INT,
    implementing_agency_id INT,
    fiscal_year YEAR NOT NULL,
    fund_source ENUM('Government Budget', 'Grant', 'Loan', 'Private', 'PSF', 'Mixed') NOT NULL,
    fund_type ENUM('Public', 'Private', 'Mixed') NOT NULL,
    climate_type ENUM('Adaptation', 'Mitigation', 'Both') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PHP',
    data_type ENUM('GAA', 'Actual', 'NEP', 'Planned') DEFAULT 'Actual',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (funder_id) REFERENCES funders(id) ON DELETE SET NULL,
    FOREIGN KEY (implementing_agency_id) REFERENCES implementing_agencies(id) ON DELETE SET NULL,
    INDEX idx_project (project_id),
    INDEX idx_fiscal_year (fiscal_year),
    INDEX idx_fund_source (fund_source),
    INDEX idx_fund_type (fund_type),
    INDEX idx_climate_type (climate_type),
    INDEX idx_funder (funder_id),
    INDEX idx_agency (implementing_agency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- GHG EMISSIONS DATA TABLES
-- ============================================================================

-- GHG Emissions (Historical and Projected)
CREATE TABLE ghg_emissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year YEAR NOT NULL,
    sector_id INT,
    total_ghg DECIMAL(12, 3) NOT NULL COMMENT 'Total GHG in Gg (gigagrams)',
    co2 DECIMAL(12, 3) DEFAULT 0.000 COMMENT 'Carbon Dioxide in Gg',
    ch4 DECIMAL(12, 3) DEFAULT 0.000 COMMENT 'Methane in Gg',
    n2o DECIMAL(12, 3) DEFAULT 0.000 COMMENT 'Nitrous Oxide in Gg',
    hfc DECIMAL(12, 3) DEFAULT 0.000 COMMENT 'Hydrofluorocarbon in Gg',
    is_projection BOOLEAN DEFAULT FALSE,
    data_source VARCHAR(255) COMMENT 'e.g., NICCDIES, CCC, etc.',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL,
    UNIQUE KEY unique_year_sector (year, sector_id),
    INDEX idx_year (year),
    INDEX idx_sector (sector_id),
    INDEX idx_projection (is_projection)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- GHG Targets (2030, 2050 targets per NDC/NAP)
CREATE TABLE ghg_targets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year YEAR NOT NULL,
    sector_id INT,
    target_type ENUM('Conditional', 'Unconditional', 'Baseline') NOT NULL,
    target_value DECIMAL(12, 3) NOT NULL COMMENT 'Target GHG in Gg or GT CO2e',
    reduction_percentage DECIMAL(5, 2) COMMENT 'Percentage reduction target',
    baseline_year YEAR DEFAULT 2020,
    commitment_source VARCHAR(100) COMMENT 'e.g., NDC, NAP, NCCAP',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL,
    INDEX idx_year (year),
    INDEX idx_sector (sector_id),
    INDEX idx_type (target_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- JUNCTION TABLES (Many-to-Many Relationships)
-- ============================================================================

-- Project Funders (Many-to-Many)
CREATE TABLE project_funders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    funder_id INT NOT NULL,
    contribution_amount DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (funder_id) REFERENCES funders(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_funder (project_id, funder_id),
    INDEX idx_project (project_id),
    INDEX idx_funder (funder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Implementing Agencies (Many-to-Many)
CREATE TABLE project_implementing_agencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    implementing_agency_id INT NOT NULL,
    is_lead_agency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (implementing_agency_id) REFERENCES implementing_agencies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_agency (project_id, implementing_agency_id),
    INDEX idx_project (project_id),
    INDEX idx_agency (implementing_agency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Climate Impact Drivers (Many-to-Many)
CREATE TABLE project_climate_impact_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    climate_impact_driver_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (climate_impact_driver_id) REFERENCES climate_impact_drivers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_cid (project_id, climate_impact_driver_id),
    INDEX idx_project (project_id),
    INDEX idx_cid (climate_impact_driver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Add comments to tables
ALTER TABLE sectors COMMENT = 'NAP and NDCIP sectors';
ALTER TABLE regions COMMENT = '17 Philippine regions with coordinates';
ALTER TABLE funders COMMENT = 'International and domestic funding organizations';
ALTER TABLE implementing_agencies COMMENT = 'Government departments implementing climate projects';
ALTER TABLE climate_impact_drivers COMMENT = 'NICCDIES climate impact drivers';
ALTER TABLE projects COMMENT = 'Climate finance projects';
ALTER TABLE investments COMMENT = 'Funding breakdown per project';
ALTER TABLE ghg_emissions COMMENT = 'Historical and projected GHG emissions data';
ALTER TABLE ghg_targets COMMENT = 'GHG reduction targets (NDC, NAP)';
ALTER TABLE project_funders COMMENT = 'Many-to-many: Projects to Funders';
ALTER TABLE project_implementing_agencies COMMENT = 'Many-to-many: Projects to Implementing Agencies';
ALTER TABLE project_climate_impact_drivers COMMENT = 'Many-to-many: Projects to Climate Impact Drivers';

