-- ============================================================================
-- ARAW V3.0 Philippine Climate Finance Dashboard
-- Seed Data Script
-- ============================================================================
-- Version: 1.0
-- Date: October 23, 2025
-- Target: MySQL 8.0+
-- Description: Master data and sample data for development/testing
-- ============================================================================

-- ============================================================================
-- SECTORS DATA
-- ============================================================================

-- NAP Sectors (8 sectors)
INSERT INTO sectors (code, name, data_view, display_order) VALUES
('NAP_AGR', 'Agriculture, Fisheries, and Food Security', 'NAP', 1),
('NAP_WAT', 'Water Resources', 'NAP', 2),
('NAP_HLT', 'Health', 'NAP', 3),
('NAP_ECO', 'Ecosystems and Biodiversity', 'NAP', 4),
('NAP_CUL', 'Cultural Heritage, Population Displacement, and Migration', 'NAP', 5),
('NAP_LND', 'Land Use and Human Settlements', 'NAP', 6),
('NAP_LIV', 'Livelihoods and Industries', 'NAP', 7),
('NAP_ENE', 'Energy, Transport, and Communications', 'NAP', 8);

-- NDCIP Sectors (5 sectors)
INSERT INTO sectors (code, name, data_view, display_order) VALUES
('NDCIP_AGR', 'Agriculture', 'NDCIP', 1),
('NDCIP_WST', 'Waste', 'NDCIP', 2),
('NDCIP_IND', 'Industry', 'NDCIP', 3),
('NDCIP_TRN', 'Transport', 'NDCIP', 4),
('NDCIP_ENE', 'Energy', 'NDCIP', 5);

-- ============================================================================
-- REGIONS DATA (17 Philippine Regions)
-- ============================================================================

INSERT INTO regions (code, name, full_name, coordinates_lat, coordinates_lon, income_class) VALUES
('BARMM', 'BARMM', 'Bangsamoro Autonomous Region in Muslim Mindanao', 7.2231, 124.2452, '1'),
('CAR', 'CAR', 'Cordillera Administrative Region', 16.4023, 120.5960, '2'),
('NCR', 'NCR', 'National Capital Region', 14.5995, 120.9842, '5'),
('REGION_I', 'Region I', 'Ilocos Region', 16.0834, 120.6200, '3'),
('REGION_II', 'Region II', 'Cagayan Valley', 16.9754, 121.8107, '2'),
('REGION_III', 'Region III', 'Central Luzon', 15.4830, 120.7100, '4'),
('REGION_IV_A', 'Region IV-A', 'CALABARZON', 14.1008, 121.0793, '4'),
('REGION_IV_B', 'Region IV-B', 'MIMAROPA', 12.8797, 121.7740, '2'),
('REGION_V', 'Region V', 'Bicol Region', 13.4209, 123.4133, '2'),
('REGION_VI', 'Region VI', 'Western Visayas', 10.7202, 122.5621, '3'),
('REGION_VII', 'Region VII', 'Central Visayas', 10.3157, 123.8854, '4'),
('REGION_VIII', 'Region VIII', 'Eastern Visayas', 11.2428, 125.0039, '2'),
('REGION_IX', 'Region IX', 'Zamboanga Peninsula', 8.5000, 123.2500, '3'),
('REGION_X', 'Region X', 'Northern Mindanao', 8.4542, 124.6319, '3'),
('REGION_XI', 'Region XI', 'Davao Region', 7.1907, 125.4553, '4'),
('REGION_XII', 'Region XII', 'SOCCSKSARGEN', 6.5000, 124.5833, '2'),
('REGION_XIII', 'Region XIII', 'Caraga', 9.0600, 125.5300, '2');

-- ============================================================================
-- FUNDERS DATA
-- ============================================================================

INSERT INTO funders (code, name, funder_type, country, is_active) VALUES
('GCF', 'Green Climate Fund', 'multilateral', 'International', TRUE),
('ADB', 'Asian Development Bank', 'multilateral', 'International', TRUE),
('WB', 'World Bank', 'multilateral', 'International', TRUE),
('GEF', 'Global Environment Facility', 'multilateral', 'International', TRUE),
('UNDP', 'United Nations Development Programme', 'multilateral', 'International', TRUE),
('AF', 'Adaptation Fund', 'multilateral', 'International', TRUE),
('JICA', 'Japan International Cooperation Agency', 'bilateral', 'Japan', TRUE),
('USAID', 'United States Agency for International Development', 'bilateral', 'United States', TRUE),
('KfW', 'KfW Development Bank', 'bilateral', 'Germany', TRUE),
('AFD', 'Agence Française de Développement', 'bilateral', 'France', TRUE),
('GOP', 'Government of the Philippines', 'government', 'Philippines', TRUE),
('PSF', 'People\'s Survival Fund', 'government', 'Philippines', TRUE),
('DBP', 'Development Bank of the Philippines', 'government', 'Philippines', TRUE),
('LBP', 'Land Bank of the Philippines', 'government', 'Philippines', TRUE);

-- ============================================================================
-- IMPLEMENTING AGENCIES DATA
-- ============================================================================

INSERT INTO implementing_agencies (code, name, abbreviation, is_active) VALUES
('CCC', 'Climate Change Commission', 'CCC', TRUE),
('DOF', 'Department of Finance', 'DOF', TRUE),
('DA', 'Department of Agriculture', 'DA', TRUE),
('DENR', 'Department of Environment and Natural Resources', 'DENR', TRUE),
('DOE', 'Department of Energy', 'DOE', TRUE),
('DOTr', 'Department of Transportation', 'DOTr', TRUE),
('DPWH', 'Department of Public Works and Highways', 'DPWH', TRUE),
('DHSUD', 'Department of Human Settlements and Urban Development', 'DHSUD', TRUE),
('DOH', 'Department of Health', 'DOH', TRUE),
('DOST', 'Department of Science and Technology', 'DOST', TRUE),
('DILG', 'Department of the Interior and Local Government', 'DILG', TRUE),
('NEDA', 'National Economic and Development Authority', 'NEDA', TRUE),
('DTI', 'Department of Trade and Industry', 'DTI', TRUE),
('DOT', 'Department of Tourism', 'DOT', TRUE),
('BFAR', 'Bureau of Fisheries and Aquatic Resources', 'BFAR', TRUE),
('NIA', 'National Irrigation Administration', 'NIA', TRUE),
('FMB', 'Forest Management Bureau', 'FMB', TRUE);

-- ============================================================================
-- CLIMATE IMPACT DRIVERS DATA (from NICCDIES)
-- ============================================================================

INSERT INTO climate_impact_drivers (code, name, display_order) VALUES
('CID_TEMP', 'Increased Temperature & Drought', 1),
('CID_SEA', 'Sea level rise and extreme sea levels', 2),
('CID_PRECIP', 'Extreme Precipitation', 3),
('CID_WIND', 'Extreme wind and tropical cyclones', 4);

-- ============================================================================
-- SAMPLE GHG EMISSIONS DATA (Historical from NICCDIES)
-- ============================================================================

-- Historical data (1994, 2000, 2010, 2020)
INSERT INTO ghg_emissions (year, sector_id, total_ghg, co2, ch4, n2o, hfc, is_projection, data_source) VALUES
(1994, NULL, 180.000, 120.000, 45.000, 12.000, 3.000, FALSE, 'NICCDIES'),
(2000, NULL, 195.000, 130.000, 48.000, 13.500, 3.500, FALSE, 'NICCDIES'),
(2010, NULL, 220.000, 145.000, 55.000, 15.000, 5.000, FALSE, 'NICCDIES'),
(2020, NULL, 195.000, 128.000, 50.000, 13.000, 4.000, FALSE, 'NICCDIES');

-- 2024 Projection (Target)
INSERT INTO ghg_emissions (year, sector_id, total_ghg, co2, ch4, n2o, hfc, is_projection, data_source) VALUES
(2024, NULL, -230.580, 139.194, 70.155, 17.233, 3.978, TRUE, 'NDC Projection');

-- ============================================================================
-- GHG TARGETS DATA (NDC Commitments)
-- ============================================================================

-- 2030 Targets
INSERT INTO ghg_targets (year, sector_id, target_type, target_value, reduction_percentage, baseline_year, commitment_source) VALUES
(2030, NULL, 'Unconditional', 2.7, 2.70, 2020, 'NDC'),
(2030, NULL, 'Conditional', 72.3, 72.30, 2020, 'NDC');

-- 2050 Targets
INSERT INTO ghg_targets (year, sector_id, target_type, target_value, reduction_percentage, baseline_year, commitment_source) VALUES
(2050, NULL, 'Conditional', 75.0, 75.00, 2020, 'NAP 2023-2050');

-- ============================================================================
-- SAMPLE PROJECTS DATA
-- ============================================================================

-- NAP Projects
INSERT INTO projects (project_code, name, sector_id, region_id, status, total_amount, data_view, start_date, end_date, is_nationwide) VALUES
('NAP-AGR-001', 'Climate-Resilient Agriculture Program', 1, 3, 'ongoing', 250000000.00, 'NAP', '2023-01-01', '2025-12-31', FALSE),
('NAP-AGR-002', 'Sustainable Fisheries Adaptation Project', 1, 8, 'ongoing', 180000000.00, 'NAP', '2023-06-01', '2026-05-31', FALSE),
('NAP-WAT-001', 'Water Resource Management Initiative', 2, 4, 'ongoing', 320000000.00, 'NAP', '2022-01-01', '2025-12-31', FALSE),
('NAP-HLT-001', 'Climate-Sensitive Health Systems', 3, 3, 'ongoing', 150000000.00, 'NAP', '2024-01-01', '2027-12-31', FALSE),
('NAP-ECO-001', 'Biodiversity Conservation Program', 4, 12, 'ongoing', 200000000.00, 'NAP', '2023-01-01', '2026-12-31', FALSE),
('NAP-LND-001', 'Resilient Urban Settlements', 6, 3, 'completed', 450000000.00, 'NAP', '2020-01-01', '2024-06-30', FALSE),
('NAP-ENE-001', 'Renewable Energy Transition Program', 8, NULL, 'ongoing', 1200000000.00, 'NAP', '2023-01-01', '2030-12-31', TRUE);

-- NDCIP Projects
INSERT INTO projects (project_code, name, sector_id, region_id, status, total_amount, data_view, start_date, end_date, is_nationwide) VALUES
('NDCIP-AGR-001', 'Low-Carbon Agriculture Initiative', 9, 1, 'ongoing', 280000000.00, 'NDCIP', '2024-01-01', '2027-12-31', FALSE),
('NDCIP-WST-001', 'Waste-to-Energy Conversion', 10, 3, 'ongoing', 350000000.00, 'NDCIP', '2023-01-01', '2026-12-31', FALSE),
('NDCIP-IND-001', 'Green Industry Transformation', 11, 7, 'ongoing', 420000000.00, 'NDCIP', '2023-06-01', '2027-05-31', FALSE),
('NDCIP-TRN-001', 'Sustainable Transport Systems', 12, 3, 'ongoing', 850000000.00, 'NDCIP', '2022-01-01', '2026-12-31', FALSE),
('NDCIP-ENE-001', 'Solar Energy Expansion', 13, NULL, 'ongoing', 1500000000.00, 'NDCIP', '2023-01-01', '2028-12-31', TRUE);

-- ============================================================================
-- SAMPLE INVESTMENTS DATA (Funds Mobilized)
-- ============================================================================

-- 2020 Investments
INSERT INTO investments (project_id, funder_id, implementing_agency_id, fiscal_year, fund_source, fund_type, climate_type, amount, data_type) VALUES
(1, 11, 3, 2020, 'Government Budget', 'Public', 'Adaptation', 50000000.00, 'Actual'),
(2, 2, 3, 2020, 'Grant', 'Public', 'Adaptation', 80000000.00, 'Actual'),
(3, 1, 16, 2020, 'Grant', 'Public', 'Adaptation', 70000000.00, 'Actual');

-- 2021 Investments
INSERT INTO investments (project_id, funder_id, implementing_agency_id, fiscal_year, fund_source, fund_type, climate_type, amount, data_type) VALUES
(1, 11, 3, 2021, 'Government Budget', 'Public', 'Adaptation', 80000000.00, 'Actual'),
(2, 2, 3, 2021, 'Grant', 'Public', 'Adaptation', 120000000.00, 'Actual'),
(3, 1, 16, 2021, 'Loan', 'Public', 'Adaptation', 200000000.00, 'Actual');

-- 2022 Investments
INSERT INTO investments (project_id, funder_id, implementing_agency_id, fiscal_year, fund_source, fund_type, climate_type, amount, data_type) VALUES
(1, 11, 3, 2022, 'Government Budget', 'Public', 'Adaptation', 120000000.00, 'Actual'),
(3, 1, 16, 2022, 'Loan', 'Public', 'Adaptation', 280000000.00, 'Actual'),
(4, 11, 9, 2022, 'Government Budget', 'Public', 'Adaptation', 150000000.00, 'Actual'),
(7, 5, 5, 2022, 'Grant', 'Public', 'Mitigation', 200000000.00, 'Actual');

-- 2023 Investments
INSERT INTO investments (project_id, funder_id, implementing_agency_id, fiscal_year, fund_source, fund_type, climate_type, amount, data_type) VALUES
(1, 11, 3, 2023, 'Government Budget', 'Public', 'Adaptation', 150000000.00, 'Actual'),
(4, 11, 9, 2023, 'Government Budget', 'Public', 'Adaptation', 150000000.00, 'Actual'),
(5, 4, 4, 2023, 'Grant', 'Public', 'Adaptation', 200000000.00, 'Actual'),
(7, 2, 5, 2023, 'Loan', 'Public', 'Mitigation', 300000000.00, 'Actual'),
(9, 11, 2, 2023, 'Government Budget', 'Public', 'Mitigation', 200000000.00, 'Actual');

-- 2024 Investments
INSERT INTO investments (project_id, funder_id, implementing_agency_id, fiscal_year, fund_source, fund_type, climate_type, amount, data_type) VALUES
(1, 11, 3, 2024, 'Government Budget', 'Public', 'Adaptation', 180000000.00, 'Actual'),
(4, 11, 9, 2024, 'Government Budget', 'Public', 'Adaptation', 150000000.00, 'Actual'),
(5, 4, 4, 2024, 'Grant', 'Public', 'Adaptation', 250000000.00, 'Actual'),
(7, 2, 5, 2024, 'Loan', 'Public', 'Mitigation', 350000000.00, 'Actual'),
(8, 1, 3, 2024, 'Grant', 'Public', 'Mitigation', 280000000.00, 'GAA'),
(11, 11, 6, 2024, 'Government Budget', 'Public', 'Mitigation', 420000000.00, 'GAA');

-- 2025 Investments (GAA Allocations)
INSERT INTO investments (project_id, funder_id, implementing_agency_id, fiscal_year, fund_source, fund_type, climate_type, amount, data_type) VALUES
(1, 11, 3, 2025, 'Government Budget', 'Public', 'Adaptation', 220000000.00, 'GAA'),
(4, 11, 9, 2025, 'Government Budget', 'Public', 'Adaptation', 180000000.00, 'GAA'),
(5, 4, 4, 2025, 'Grant', 'Public', 'Adaptation', 300000000.00, 'GAA'),
(7, 2, 5, 2025, 'Loan', 'Public', 'Mitigation', 420000000.00, 'GAA'),
(8, 1, 3, 2025, 'Grant', 'Public', 'Mitigation', 350000000.00, 'GAA'),
(9, 11, 2, 2025, 'Government Budget', 'Public', 'Mitigation', 380000000.00, 'GAA'),
(11, 11, 6, 2025, 'Government Budget', 'Public', 'Mitigation', 520000000.00, 'GAA'),
(12, 3, 5, 2025, 'Loan', 'Public', 'Mitigation', 850000000.00, 'GAA');

-- ============================================================================
-- JUNCTION TABLE DATA
-- ============================================================================

-- Project Funders
INSERT INTO project_funders (project_id, funder_id, contribution_amount) VALUES
(1, 11, 800000000.00),
(1, 2, 200000000.00),
(2, 2, 180000000.00),
(3, 1, 320000000.00),
(4, 11, 150000000.00),
(5, 4, 200000000.00),
(6, 11, 450000000.00),
(7, 2, 600000000.00),
(7, 5, 600000000.00);

-- Project Implementing Agencies
INSERT INTO project_implementing_agencies (project_id, implementing_agency_id, is_lead_agency) VALUES
(1, 3, TRUE),
(2, 3, TRUE),
(2, 15, FALSE),
(3, 16, TRUE),
(4, 9, TRUE),
(5, 4, TRUE),
(6, 8, TRUE),
(7, 5, TRUE),
(7, 6, FALSE);

-- Project Climate Impact Drivers
INSERT INTO project_climate_impact_drivers (project_id, climate_impact_driver_id) VALUES
(1, 1), -- Agriculture affected by drought
(1, 3), -- Agriculture affected by extreme precipitation
(2, 2), -- Fisheries affected by sea level rise
(2, 4), -- Fisheries affected by typhoons
(3, 1), -- Water resources affected by drought
(3, 3), -- Water resources affected by precipitation
(4, 1), -- Health affected by temperature
(5, 4), -- Ecosystems affected by typhoons
(6, 2), -- Settlements affected by sea level
(7, 1); -- Energy affected by temperature

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================

