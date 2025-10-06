================================================================================
DEPLOYMENT SETUP - MOCKUP PDF LANDING PAGE
ARAW Climate Finance Dashboard - October 7, 2025
================================================================================

CURRENT DEPLOYMENT STATUS:
-------------------------
✅ Full Next.js application deployed with all dependencies
✅ Landing page shows Version 3.1 mockup PDF
✅ All infrastructure ready for full app

FILES STRUCTURE:
---------------
/src/app/page.tsx              → PDF viewer landing page (CURRENT)
/src/app/page.dashboard-v2.tsx → Working v2.0 dashboard (BACKUP)
/public/mockup.pdf             → v3.1 Figma mockup

DEPLOYMENT COMMANDS:
-------------------
1. Install dependencies:
   npm install

2. Build application:
   npm run build

3. Start production:
   npm start
   
   OR with PM2:
   pm2 start npm --name "araw-dashboard" -- start
   pm2 save

4. Access:
   http://[server-ip]:3000

WHAT USERS SEE:
--------------
- Professional landing page with DoF branding
- PDF mockup of Version 3.1 design embedded
- "System Under Development" status
- Project stats and timeline
- Clean, modern interface

SWITCHING TO FULL v3.1 APP LATER:
---------------------------------

Option A: Restore v2.0 Dashboard (if needed):
cd /var/www/araw-dashboard/araw/src/app
cp page.dashboard-v2.tsx page.tsx
pm2 restart araw-dashboard

Option B: Deploy v3.1 (when ready):
1. Complete v3.1 development on local machine
2. Test and build: npm run build
3. Git commit and push
4. On server:
   cd /var/www/araw-dashboard/araw
   git pull origin main
   npm install
   npm run build
   pm2 restart araw-dashboard

INFRASTRUCTURE BENEFITS:
-----------------------
✅ Node.js 20+ installed and configured
✅ All npm dependencies installed (670 packages)
✅ PM2 process manager configured
✅ Nginx reverse proxy ready (optional)
✅ Firewall configured
✅ Production build system tested
✅ Environment ready for immediate app deployment

NEXT STEPS:
----------
1. After meeting: Continue v3.1 development (3-5 days)
2. Test v3.1 thoroughly on local machine
3. Deploy v3.1 by simply replacing page.tsx
4. Restart PM2, done!

FILES TO KEEP:
-------------
- Keep page.dashboard-v2.tsx (working v2.0 backup)
- Keep mockup.pdf (for reference)
- All deployment guides in /local/

SUPPORT:
-------
Project Manager: Jhonnel
Development Team: UBQTY
Deployment Target: October 2025

================================================================================

