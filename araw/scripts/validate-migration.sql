-- ============================================================================
-- ARAW V3.0 - Data Migration Validation Script
-- ============================================================================
-- Purpose: Verify data integrity after migration to UAT or Production
-- Usage: mysql -h <host> -u <user> -p <database> < validate-migration.sql
-- ============================================================================

SELECT '============================================================================' as '';
SELECT 'ARAW V3.0 - DATA MIGRATION VALIDATION REPORT' as '';
SELECT CONCAT('Generated: ', NOW()) as '';
SELECT '============================================================================' as '';

-- ============================================================================
-- 1. DATABASE SUMMARY
-- ============================================================================
SELECT '' as '';
SELECT '1. DATABASE SUMMARY' as '';
SELECT '============================================================================' as '';

SELECT 
  'Database' as Component,
  'Ready' as Status,
  CONCAT('PHP ', ROUND(SUM(amount)/1000000000, 2), ' Billion') as Value
FROM investments
UNION ALL
SELECT 
  'Projects',
  'Loaded',
  CONCAT(COUNT(*), ' projects')
FROM projects
UNION ALL
SELECT
  'Agencies',
  'Loaded',
  CONCAT(COUNT(*), ' agencies')
FROM implementing_agencies
UNION ALL
SELECT
  'Investment Records',
  'Loaded',
  CONCAT(COUNT(*), ' records')
FROM investments
UNION ALL
SELECT
  'GHG Records',
  'Loaded',
  CONCAT(COUNT(*), ' records')
FROM ghg_emissions
UNION ALL
SELECT
  'Fiscal Year Range',
  'Coverage',
  CONCAT(MIN(fiscal_year), ' - ', MAX(fiscal_year))
FROM investments;

-- EXPECTED VALUES:
-- Total Investment: PHP 1400.76 Billion
-- Projects: 32,405
-- Agencies: 249
-- Investment Records: 32,641
-- GHG Records: 19
-- Fiscal Years: 2020 - 2025

-- ============================================================================
-- 2. DATA INTEGRITY CHECKS
-- ============================================================================
SELECT '' as '';
SELECT '2. DATA INTEGRITY CHECKS' as '';
SELECT '============================================================================' as '';

-- Check for orphaned investments (should be 0)
SELECT 
  'Orphaned Investments' as Check_Type,
  COUNT(*) as Count,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS' 
    ELSE 'FAIL' 
  END as Status
FROM investments i
LEFT JOIN projects p ON i.project_id = p.id
WHERE p.id IS NULL;

-- Check for orphaned project assignments (should be 0)
SELECT 
  'Orphaned Project-Agency Links' as Check_Type,
  COUNT(*) as Count,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS' 
    ELSE 'FAIL' 
  END as Status
FROM project_implementing_agencies pia
LEFT JOIN projects p ON pia.project_id = p.id
WHERE p.id IS NULL;

-- Check for NULL critical fields
SELECT 
  'Investments with NULL amounts' as Check_Type,
  COUNT(*) as Count,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS' 
    ELSE 'FAIL' 
  END as Status
FROM investments
WHERE amount IS NULL OR amount = 0;

-- Check for projects without sectors
SELECT 
  'Projects Missing Sector' as Check_Type,
  COUNT(*) as Count,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS' 
    ELSE 'WARNING' 
  END as Status
FROM projects
WHERE sector_id IS NULL;

-- ============================================================================
-- 3. DATA DISTRIBUTION BY FISCAL YEAR
-- ============================================================================
SELECT '' as '';
SELECT '3. DATA DISTRIBUTION BY FISCAL YEAR' as '';
SELECT '============================================================================' as '';

SELECT 
  fiscal_year as 'Fiscal Year',
  COUNT(DISTINCT project_id) as 'Projects',
  COUNT(*) as 'Investment Records',
  ROUND(SUM(amount)/1000000000, 2) as 'Total (Billion PHP)',
  ROUND(AVG(amount)/1000000, 2) as 'Avg per Investment (Million PHP)'
FROM investments
GROUP BY fiscal_year
ORDER BY fiscal_year;

-- ============================================================================
-- 4. DATA DISTRIBUTION BY CLIMATE TYPE
-- ============================================================================
SELECT '' as '';
SELECT '4. DATA DISTRIBUTION BY CLIMATE TYPE' as '';
SELECT '============================================================================' as '';

SELECT 
  climate_type as 'Climate Type',
  COUNT(*) as 'Investment Count',
  ROUND(SUM(amount)/1000000000, 2) as 'Total (Billion PHP)',
  CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM investments), 1), '%') as 'Percentage'
FROM investments
GROUP BY climate_type
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- 5. DATA DISTRIBUTION BY DATA TYPE
-- ============================================================================
SELECT '' as '';
SELECT '5. DATA DISTRIBUTION BY DATA TYPE (GAA/Actual/NEP)' as '';
SELECT '============================================================================' as '';

SELECT 
  data_type as 'Data Type',
  COUNT(*) as 'Count',
  ROUND(SUM(amount)/1000000000, 2) as 'Total (Billion PHP)',
  CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM investments), 1), '%') as 'Percentage'
FROM investments
GROUP BY data_type
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- 6. TOP 10 IMPLEMENTING AGENCIES BY INVESTMENT
-- ============================================================================
SELECT '' as '';
SELECT '6. TOP 10 IMPLEMENTING AGENCIES BY INVESTMENT' as '';
SELECT '============================================================================' as '';

SELECT 
  ia.code as 'Agency Code',
  ia.name as 'Agency Name',
  COUNT(DISTINCT i.project_id) as 'Projects',
  COUNT(*) as 'Investments',
  ROUND(SUM(i.amount)/1000000000, 2) as 'Total (Billion PHP)'
FROM investments i
JOIN implementing_agencies ia ON i.implementing_agency_id = ia.id
GROUP BY ia.id, ia.code, ia.name
ORDER BY SUM(i.amount) DESC
LIMIT 10;

-- ============================================================================
-- 7. PROJECT STATUS DISTRIBUTION
-- ============================================================================
SELECT '' as '';
SELECT '7. PROJECT STATUS DISTRIBUTION' as '';
SELECT '============================================================================' as '';

SELECT 
  status as 'Status',
  COUNT(*) as 'Project Count',
  CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM projects), 1), '%') as 'Percentage'
FROM projects
GROUP BY status
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- 8. GHG EMISSIONS DATA SUMMARY
-- ============================================================================
SELECT '' as '';
SELECT '8. GHG EMISSIONS DATA' as '';
SELECT '============================================================================' as '';

SELECT 
  s.name as 'Sector',
  ge.year as 'Year',
  ROUND(ge.total_ghg, 2) as 'Total GHG (MtCO2e)'
FROM ghg_emissions ge
JOIN sectors s ON ge.sector_id = s.id
ORDER BY ge.year, s.name;

-- ============================================================================
-- 9. DATABASE SIZE AND PERFORMANCE METRICS
-- ============================================================================
SELECT '' as '';
SELECT '9. DATABASE SIZE METRICS' as '';
SELECT '============================================================================' as '';

SELECT 
  TABLE_NAME as 'Table',
  TABLE_ROWS as 'Rows (Approx)',
  ROUND((DATA_LENGTH) / 1024 / 1024, 2) AS 'Data Size (MB)',
  ROUND((INDEX_LENGTH) / 1024 / 1024, 2) AS 'Index Size (MB)',
  ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS 'Total Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- ============================================================================
-- 10. FINAL VALIDATION STATUS
-- ============================================================================
SELECT '' as '';
SELECT '10. FINAL VALIDATION STATUS' as '';
SELECT '============================================================================' as '';

SELECT 
  'Total Validation Checks' as Metric,
  '8' as Value;

SELECT 
  'Critical Checks' as Category,
  CASE 
    WHEN (SELECT COUNT(*) FROM investments i LEFT JOIN projects p ON i.project_id = p.id WHERE p.id IS NULL) = 0
      AND (SELECT COUNT(*) FROM investments WHERE amount IS NULL OR amount = 0) = 0
      AND (SELECT COUNT(*) FROM investments) = 32641
      AND (SELECT COUNT(*) FROM projects) = 32405
      AND (SELECT COUNT(*) FROM implementing_agencies) = 249
    THEN 'PASS ✓'
    ELSE 'FAIL ✗'
  END as Status;

-- ============================================================================
SELECT '' as '';
SELECT '============================================================================' as '';
SELECT 'END OF VALIDATION REPORT' as '';
SELECT '============================================================================' as '';
SELECT '' as '';
SELECT 'NEXT STEPS:' as '';
SELECT '1. Review all PASS/FAIL statuses above' as '';
SELECT '2. Investigate any FAIL or WARNING items' as '';
SELECT '3. Verify expected values match actual values' as '';
SELECT '4. Document any discrepancies' as '';
SELECT '5. If all checks PASS, migration is successful' as '';
SELECT '' as '';

