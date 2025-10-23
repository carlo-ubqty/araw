================================================================================
ARAW V3.0 - DEPLOYMENT & MIGRATION DOCUMENTATION
================================================================================
Date: October 23, 2025
================================================================================


QUICK START
================================================================================

This folder contains everything you need to deploy and migrate the ARAW
Climate Finance Dashboard to UAT and Production environments.

All deployments use GIT for code and data distribution.
No manual file uploads required.


DOCUMENTATION FILES
================================================================================

1. DATA_MIGRATION_UAT.txt
   - Complete step-by-step guide for UAT data migration
   - RHEL + MySQL environment
   - ~20 minutes deployment time
   - 11 steps with verification

2. DATA_MIGRATION_PRODUCTION.txt
   - Enterprise production deployment guide
   - AWS EC2 + RDS MySQL environment
   - ~30-35 minutes deployment time
   - 14 steps with full monitoring setup
   - Includes rollback procedures

3. GIT_DEPLOYMENT_NOTES.txt
   - Git workflow and best practices
   - Branch strategy
   - Deployment checklist
   - Rollback via git
   - Security considerations

4. MIGRATION_SUMMARY.txt
   - Overview of entire migration process
   - Files required
   - Success criteria
   - Contact information

5. validate-migration.sql (in ../scripts/)
   - Automated validation script
   - Run after migration to verify data integrity
   - Generates comprehensive report


DEPLOYMENT METHOD: GIT PUSH/PULL
================================================================================

✓ All code deployed via git clone/pull
✓ All data files committed to repository
✓ No manual file uploads needed
✓ Version control for all assets
✓ Easy rollback with git

Workflow:
  Local → Git Push → UAT/Prod Git Pull → Run Migration Scripts


DATA BEING MIGRATED
================================================================================

Main Dataset (CCET):
  - File: data/parsed-ccet-data.json (140 MB)
  - Records: 33,523
  - Projects: 32,405
  - Investments: 32,641
  - Agencies: 249
  - Total Value: PHP 1,400.76 Billion

GHG Inventory:
  - File: data/Araw Available Datasets (10.16.2025).xlsx
  - Records: 19 (7 sectors × 2 years + totals)
  - Years: 2015, 2020

Database Schema:
  - File: database/schema.sql
  - Tables: 12
  - Constraints: Foreign keys, indexes

Master Data:
  - File: database/seed.sql
  - Sectors, Regions, Funders, Climate Drivers


DEPLOYMENT SEQUENCE
================================================================================

1. LOCAL DEVELOPMENT
   ✓ Data imported to local MySQL
   ✓ Application tested locally
   ✓ All tests passing (150/150)
   ✓ Build successful

2. UAT DEPLOYMENT
   → Push code to feature/v3.0-implementation branch
   → Pull on UAT server
   → Run DATA_MIGRATION_UAT.txt steps
   → Test with stakeholders
   → Fix any issues

3. PRODUCTION DEPLOYMENT
   → Merge feature branch to main
   → Create release tag
   → Pull on production server from main
   → Run DATA_MIGRATION_PRODUCTION.txt steps
   → Monitor and verify


BEFORE YOU START
================================================================================

UAT Prerequisites:
  [ ] UAT server access (SSH)
  [ ] Git repository access
  [ ] MySQL 8.0+ installed on UAT
  [ ] Database admin credentials
  [ ] Deployment window scheduled

Production Prerequisites:
  [ ] Production server access (SSH + VPN)
  [ ] Git repository access
  [ ] AWS RDS MySQL 8.0+ provisioned
  [ ] RDS credentials in AWS Secrets Manager
  [ ] Change management approval
  [ ] Production deployment window
  [ ] Team on standby


WHAT TO DO
================================================================================

FOR UAT:
  1. Read: DATA_MIGRATION_UAT.txt
  2. Follow all 11 steps sequentially
  3. Run: scripts/validate-migration.sql
  4. Verify all checks PASS
  5. Test application

FOR PRODUCTION:
  1. Read: DATA_MIGRATION_PRODUCTION.txt
  2. Follow all 14 steps sequentially
  3. Run: scripts/validate-migration.sql
  4. Create RDS snapshot
  5. Monitor for 24-48 hours


TIME ESTIMATES
================================================================================

UAT:
  - Git pull: < 5 minutes
  - Database setup: 5 minutes
  - Data import: ~20 seconds
  - Verification: 5 minutes
  - Total: ~20 minutes

Production:
  - Git pull: < 5 minutes
  - Database setup: 10 minutes
  - Data import: ~30 seconds
  - Verification: 10 minutes
  - Snapshot: 10 minutes
  - Total: ~35 minutes


SUCCESS CRITERIA
================================================================================

Migration successful when validation shows:
  ✓ Total Investment: PHP 1,400.76 Billion
  ✓ Projects: 32,405
  ✓ Agencies: 249
  ✓ Investments: 32,641
  ✓ GHG Records: 19
  ✓ Orphaned Records: 0
  ✓ All integrity checks: PASS
  ✓ Application connects successfully


SUPPORT
================================================================================

Questions? Check these resources:

Documentation:
  - local/DATA_MANAGEMENT_HANDOFF.txt
  - local/DATA_IMPORT_COMPLETE.txt
  - database/schema.sql (schema reference)

Git Issues:
  - GIT_DEPLOYMENT_NOTES.txt

Technical Support:
  - DevOps: devops@example.com
  - Database: dba@example.com
  - Development: tech-lead@example.com


TROUBLESHOOTING
================================================================================

See detailed troubleshooting sections in:
  - DATA_MIGRATION_UAT.txt (Section 9)
  - DATA_MIGRATION_PRODUCTION.txt (Section 9)

Common issues:
  - Database connection failures
  - Git authentication issues
  - Import script errors
  - Slow performance


IMPORTANT NOTES
================================================================================

⚠️ CRITICAL:
  - Always create backups before migration
  - Test in UAT before production
  - Never skip verification steps
  - Document any deviations
  - Production requires change approval

✓ BEST PRACTICES:
  - Use git tags for production releases
  - Keep deployment logs
  - Monitor performance after deployment
  - Update documentation
  - Notify stakeholders


NEXT STEPS AFTER MIGRATION
================================================================================

UAT:
  1. Notify QA team
  2. Conduct acceptance testing
  3. Document findings
  4. Prepare for production

Production:
  1. Monitor for 24-48 hours
  2. Review slow query logs
  3. Optimize if needed
  4. Update disaster recovery docs
  5. Schedule next deployment


GETTING STARTED
================================================================================

Ready to deploy?

1. Choose your environment (UAT or Production)
2. Open the appropriate DATA_MIGRATION_*.txt file
3. Complete the pre-requisites checklist
4. Follow steps 1 through N
5. Run validation script
6. Celebrate! 🎉


================================================================================
GOOD LUCK WITH YOUR DEPLOYMENT!
================================================================================

All documentation is complete, tested, and ready to use.
Follow the guides carefully and your deployment will succeed.

Questions? Contact the technical team.
Issues? Check troubleshooting sections.

You've got this! 💪

