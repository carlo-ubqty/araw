# ARAW V3.0 Climate Finance Dashboard - Database Management

## Table of Contents
1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Setup Instructions](#setup-instructions)
4. [Data Management](#data-management)
5. [Excel Import](#excel-import)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The ARAW Climate Finance Dashboard uses **MySQL 8.0+** as its primary database system for storing and managing climate finance data across the Philippines.

**Key Features:**
- Normalized relational schema
- Support for NAP and NDCIP data views
- Multi-source funding tracking (Government, Grants, Loans, Private)
- GHG emissions tracking with historical and projection data
- 17 Philippine regions with geospatial data
- Project-level tracking with full metadata

---

## Database Architecture

### Core Tables

1. **sectors** - NAP (8 sectors) and NDCIP (5 sectors)
2. **regions** - 17 Philippine regions with coordinates
3. **funders** - International and domestic funding organizations
4. **implementing_agencies** - Government departments
5. **climate_impact_drivers** - 4 NICCDIES climate impact drivers

### Transactional Tables

6. **projects** - Climate finance projects
7. **investments** - Funding breakdown per project per fiscal year
8. **ghg_emissions** - Historical and projected GHG data
9. **ghg_targets** - NDC/NAP reduction targets

### Junction Tables

10. **project_funders** - Many-to-many: Projects ↔ Funders
11. **project_implementing_agencies** - Many-to-many: Projects ↔ Agencies
12. **project_climate_impact_drivers** - Many-to-many: Projects ↔ CIDs

### Schema Diagram

```
┌──────────┐         ┌──────────┐         ┌────────────┐
│ sectors  │◄────────┤ projects │────────►│   regions  │
└──────────┘         └─────┬────┘         └────────────┘
                           │
                     ┌─────┴─────┐
                     ▼           ▼
              ┌──────────┐  ┌─────────┐
              │investments│  │ project_│
              └──────────┘  │funders  │
                            └─────────┘
```

---

## Setup Instructions

### Prerequisites

- MySQL 8.0 or higher
- Node.js 20+ (for import scripts)
- Bash shell (for deployment scripts)

### 1. Local Development Setup

**Step 1: Install MySQL**

macOS (using Homebrew):
```bash
brew install mysql
brew services start mysql
```

Ubuntu/RHEL:
```bash
sudo apt-get install mysql-server  # Ubuntu
sudo yum install mysql-server      # RHEL

sudo systemctl start mysql
sudo systemctl enable mysql
```

**Step 2: Secure MySQL Installation**
```bash
mysql_secure_installation
```

**Step 3: Create Database and User**
```bash
mysql -u root -p

CREATE DATABASE araw_climate_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'araw_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON araw_climate_finance.* TO 'araw_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Step 4: Configure Environment**

Create `.env.local` file in project root:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=araw_user
DB_PASSWORD=your_secure_password
DB_NAME=araw_climate_finance
DB_CONNECTION_LIMIT=10

# Enable database mode
NEXT_PUBLIC_USE_DATABASE=true
```

**Step 5: Deploy Database Schema and Seed Data**
```bash
# Deploy schema and seed data
./scripts/deploy-db.sh local --with-seed

# Or manually:
mysql -u araw_user -p araw_climate_finance < database/schema.sql
mysql -u araw_user -p araw_climate_finance < database/seed.sql
```

**Step 6: Verify Installation**
```bash
mysql -u araw_user -p araw_climate_finance

SHOW TABLES;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM investments;
SELECT COUNT(*) FROM sectors;
EXIT;
```

---

## Data Management

### Hybrid Mode: Mock vs Real Data

The dashboard service operates in **HYBRID MODE**:
- **Mock Data Mode** (default): Uses static mock data, no database required
- **Database Mode**: Connects to MySQL, falls back to mock data on errors

**Enable Database Mode:**
```env
# In .env.local
NEXT_PUBLIC_USE_DATABASE=true
```

**Disable Database Mode:**
```env
# In .env.local
NEXT_PUBLIC_USE_DATABASE=false
# OR remove the variable entirely
```

### Data Flow

```
┌──────────────┐     ┌─────────────────────┐     ┌────────────┐
│   Excel      │────►│  Import Script      │────►│   MySQL    │
│   Files      │     │  (excel-import.ts)  │     │  Database  │
└──────────────┘     └─────────────────────┘     └──────┬─────┘
                                                         │
                          ┌──────────────────────────────┘
                          ▼
                  ┌──────────────────┐
                  │  Data Service    │
                  │  (dashboardData  │
                  │   Service.ts)    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  Dashboard       │
                  │  Service V3      │
                  │  (with fallback) │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  React           │
                  │  Components      │
                  └──────────────────┘
```

---

## Excel Import

### Import from Excel Files

The dashboard supports importing data from Excel files (from SharePoint or local sources).

**Usage:**
```bash
# Dry run (shows what would be imported without making changes)
npx ts-node scripts/excel-import.ts path/to/file.xlsx --dry-run

# Actual import
npx ts-node scripts/excel-import.ts path/to/file.xlsx
```

### Excel File Structure

The import script expects specific sheet names:

| Sheet Name Pattern | Table Target | Required Columns |
|-------------------|--------------|------------------|
| `*project*` | projects | project_code, name, sector_id |
| `*investment*` or `*fund*` | investments | project_id, fiscal_year, amount |
| `*ghg*` or `*emission*` | ghg_emissions | year, total_ghg |

**Example Excel Structure:**

**Sheet: Projects**
| project_code | name | sector_id | region_id | status | total_amount | data_view |
|--------------|------|-----------|-----------|--------|--------------|-----------|
| NAP-AGR-001 | Climate-Resilient Agriculture | 1 | 3 | ongoing | 250000000 | NAP |

**Sheet: Investments**
| project_id | fiscal_year | fund_source | fund_type | climate_type | amount | data_type |
|------------|-------------|-------------|-----------|--------------|--------|-----------|
| 1 | 2024 | Government Budget | Public | Adaptation | 50000000 | Actual |

### Column Mapping Reference

See `scripts/excel-import.ts` for complete column definitions and mapping logic.

---

## Deployment

### UAT Deployment (On-Premises RHEL)

**Prerequisites:**
- Access to DoF on-premises server
- MySQL 8.0+ installed
- SSH access with sudo privileges

**Step 1: Create UAT Environment File**

Create `.env.uat`:
```env
DB_HOST=<uat-server-ip>
DB_PORT=3306
DB_USER=<uat-db-user>
DB_PASSWORD=<uat-db-password>
DB_NAME=araw_climate_finance_uat
```

**Step 2: Deploy Database**
```bash
./scripts/deploy-db.sh uat --with-seed
```

**Step 3: Backup Database (recommended before any changes)**
```bash
./scripts/backup-db.sh uat
```

### Production Deployment (AWS RDS)

**Prerequisites:**
- AWS RDS MySQL instance provisioned
- Security groups configured
- VPC connectivity established

**Step 1: Create Production Environment File**

Create `.env.prod`:
```env
DB_HOST=<rds-endpoint>.rds.amazonaws.com
DB_PORT=3306
DB_USER=<prod-db-user>
DB_PASSWORD=<prod-db-password>
DB_NAME=araw_climate_finance_prod
```

**Step 2: Deploy Database (Schema Only - No Seed Data)**
```bash
./scripts/deploy-db.sh prod
```

**Step 3: Import Real Data**
```bash
# Use Excel import script with production data
npx ts-node scripts/excel-import.ts production_data.xlsx
```

**Step 4: Regular Backups**
```bash
# Set up cron job for daily backups
0 2 * * * /path/to/scripts/backup-db.sh prod
```

---

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to MySQL

**Solutions:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check connection
mysql -h localhost -u root -p -e "SELECT 1"

# Check user permissions
mysql -u root -p
SHOW GRANTS FOR 'araw_user'@'localhost';
```

### Import Errors

**Problem:** Excel import fails

**Solutions:**
1. Run with `--dry-run` first to validate
2. Check column names match expected format
3. Verify foreign key references exist (sector_id, region_id, etc.)
4. Check data types match schema

### Dashboard Shows Mock Data

**Problem:** Dashboard not using real data

**Solutions:**
1. Verify `.env.local` has `NEXT_PUBLIC_USE_DATABASE=true`
2. Check database connection:
   ```bash
   mysql -u araw_user -p araw_climate_finance -e "SHOW TABLES"
   ```
3. Check browser console for connection errors
4. Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` are correct

### Migration Issues

**Problem:** Schema changes not applied

**Solutions:**
```bash
# Drop and recreate (CAUTION: Deletes all data)
mysql -u root -p -e "DROP DATABASE araw_climate_finance; CREATE DATABASE araw_climate_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
./scripts/deploy-db.sh local --with-seed

# Or apply only schema changes manually
mysql -u araw_user -p araw_climate_finance < database/schema.sql
```

---

## Maintenance Tasks

### Regular Backups

```bash
# Daily backup
./scripts/backup-db.sh local

# Backups are saved to: database/backups/
```

### Data Updates

```bash
# Option 1: Excel Import (Recommended)
npx ts-node scripts/excel-import.ts new_data.xlsx

# Option 2: Direct SQL
mysql -u araw_user -p araw_climate_finance < update_script.sql
```

### Performance Optimization

```sql
-- Analyze tables
ANALYZE TABLE projects, investments, ghg_emissions;

-- Check index usage
SHOW INDEX FROM investments;

-- Optimize tables
OPTIMIZE TABLE investments;
```

---

## Support

For issues or questions:
- **Technical Issues:** Check troubleshooting section above
- **Data Questions:** Contact BAs (Business Analysts)
- **Deployment Issues:** Contact DevOps team

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Maintained By:** ARAW Development Team

