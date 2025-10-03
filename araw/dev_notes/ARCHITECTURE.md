# ARAW Climate Finance Dashboard - Architecture & Development Guide

## 🏗️ Project Overview

**ARAW** is a comprehensive climate finance tracking dashboard for the Philippines, supporting government transparency and international reporting obligations for climate finance flows.

### Purpose & Domain Context
- **Primary Goal**: Track and visualize climate finance flows in the Philippines
- **Alignment**: Paris Agreement commitments, National Climate Change Action Plan (NCCAP), National Adaptation Plan (NAP)
- **Stakeholders**: Climate Change Commission (CCC), Department of Finance (DOF), sectoral leads, LGUs
- **Key Features**: MRV Integration, CCET Visualization, Multi-source Finance Tracking, NDC/NAP Progress

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + HeroUI 2.8.4 (UI components)
- **Charts**: Recharts (React charting library)
- **Maps**: Leaflet + react-leaflet (Philippines choropleth)
- **Icons**: Lucide React

### Backend & Data
- **Database**: PostgreSQL (local: root/root)
- **Data Processing**: Python (planned for Excel → DB transformation)
- **API**: Next.js API routes (/api/dashboard/*)

### Development & Deployment
- **Runtime**: Node.js 18.x LTS
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js)
- **Version Control**: Git (feature branch workflow)
- **Production**: AWS EC2 + Nginx + PM2 + Ubuntu

---

## 🏛️ Architecture Patterns

### MVC Pattern Implementation

We follow a **Model-View-Controller** architecture with clear separation of concerns:

```
src/
├── models/           # 📊 Business Logic & Data Structures
│   ├── FilterModel.ts      # Filter state, validation, transforms
│   ├── ThemeModel.ts       # Centralized colors & styling constants
│   └── types/              # Shared TypeScript interfaces
│
├── controllers/      # 🎮 Logic & State Management  
│   ├── useFilterController.ts    # Filter state management hook
│   ├── useSidebarController.ts   # Sidebar state management hook
│   └── useDashboard.ts           # Main dashboard orchestration
│
├── components/       # 🎨 Pure UI Components (Views)
│   ├── layout/             # Layout components
│   ├── ui/                 # Reusable UI components  
│   ├── charts/             # Chart visualization components
│   └── dashboard/          # Dashboard-specific components
│
├── services/         # 🔌 External API & Data Services
│   └── dashboardService.ts       # API communication layer
│
└── templates/        # 📋 Page-level layout templates
    └── DashboardLayout.tsx       # Main dashboard template
```

### Key Design Principles

#### 1. **Separation of Concerns**
- **Models**: Pure business logic, no UI dependencies
- **Controllers**: State management, no direct DOM manipulation  
- **Views**: Pure UI components, minimal logic

#### 2. **DRY (Don't Repeat Yourself)**
- **Shared Components**: Reusable UI elements (`SidebarSection`, `FilterCheckbox`)
- **Centralized Constants**: Colors, layouts in models
- **Custom Hooks**: Reusable state logic patterns

#### 3. **Component Composition**
- Small, focused components with single responsibilities
- Props-based configuration for flexibility
- TypeScript interfaces for type safety

---

## 📁 Project Structure Deep Dive

### Component Organization
```
components/
├── layout/
│   ├── Header.tsx           # Main header with navigation
│   ├── LeftSidebar.tsx      # Main sidebar navigation
│   └── Footer.tsx           # Site footer
│
├── ui/ (Reusable)
│   ├── SidebarSection.tsx   # Collapsible sidebar sections
│   ├── FilterCheckbox.tsx   # Styled filter checkboxes  
│   ├── SidebarActionButton.tsx # Action buttons with variants
│   ├── ChartContainer.tsx   # Chart wrapper with titles/legends
│   └── KPICard.tsx         # Key performance indicator cards
│
├── charts/ (Data Visualization)
│   ├── FundsMobilizedChart.tsx
│   ├── GHGLevelsChart.tsx
│   ├── InvestmentBySectorChart.tsx
│   └── [other chart components]
│
└── dashboard/ (Feature-Specific)
    ├── DashboardContent.tsx
    ├── DashboardKPIs.tsx
    └── FilterBar.tsx (deprecated in v3.0)
```

### API Layer Structure
```
app/api/dashboard/
├── route.ts              # Main dashboard data endpoint
├── kpis/route.ts         # KPI-specific data
├── charts/route.ts       # Chart data endpoint
└── filters/route.ts      # Filter options & validation
```

### Data Flow Architecture
```
API Routes → Services → Controllers → Components
     ↓           ↓           ↓           ↓
  Raw Data → Processed → State Mgmt → UI Render
```

---

## 🎨 Design System & Theming

### Color Palette (v3.0)
```typescript
THEME_COLORS = {
  primary: {
    main: '#3C6866',    // Main teal (headers, buttons)
    light: '#4A7875',   // Lighter teal
    dark: '#2E5450'     // Darker teal
  },
  secondary: {
    green: '#2f8964',   // KPI card backgrounds
    lightGreen: '#54d06c',
    blue: '#3B82F6',    // Charts and accents
    lightBlue: '#60A5FA'
  }
}
```

### Component Variants
- **Sidebar Actions**: Primary (green), Secondary (blue), Default (gray)
- **KPI Cards**: Gradient backgrounds with specific color mappings
- **Charts**: Consistent color scheme across all visualizations

---

## 🔄 Development Workflow

### Branch Strategy
- **main**: Production-ready stable code
- **qa**: Pre-production testing branch  
- **dev**: Development integration branch
- **feature/***: Individual feature development

### Build & Development Process
```bash
# Development workflow
npm run build                    # Build & compile
pkill -f localhost && npm run dev # Kill processes & restart server

# Quality checks
npm run lint                     # ESLint validation
npm run type-check              # TypeScript validation
```

### Code Standards
- **TypeScript**: Strict mode, explicit typing
- **Components**: Functional components with TypeScript interfaces
- **Styling**: Tailwind classes, no custom CSS
- **State**: Custom hooks for complex state logic
- **Naming**: PascalCase components, camelCase functions/variables

---

## 🚀 Getting Started (New Developer)

### Prerequisites
- Node.js 18.x LTS
- PostgreSQL (local development)
- Git

### Setup Steps
```bash
# 1. Clone repository
git clone [repository-url]
cd araw

# 2. Install dependencies  
npm install

# 3. Set up environment
# Copy local/.env.example to .env.local
# Configure database connection

# 4. Run development server
npm run dev

# 5. Access application
# http://localhost:3000 (or 3001 if 3000 is busy)
```

### Key Files to Understand
1. **src/app/page.tsx** - Main dashboard page
2. **src/models/FilterModel.ts** - Business logic & data structures
3. **src/controllers/useFilterController.ts** - State management patterns
4. **src/components/layout/LeftSidebar.tsx** - Main navigation component
5. **local/user-agent_sops_araw.txt** - Development SOPs & shortcuts

---

## 📊 Data Architecture

### Current Data Sources
- **Mock Data**: Static JSON for development
- **Excel Sheets**: Primary data source (government agencies)
- **API Endpoints**: RESTful APIs for dashboard data

### Planned Data Pipeline
```
Excel Files → Python ETL → PostgreSQL → Next.js API → React Components
```

### Database Schema (Planned)
- **Projects**: Climate finance projects
- **Sectors**: Economic sectors (agriculture, water, etc.)
- **Regions**: Geographic regions in Philippines
- **Funding**: Financial data and sources
- **KPIs**: Key performance indicators

---

## 🧪 Testing Strategy

### Current Testing Approach
- **Build Validation**: TypeScript compilation
- **Linting**: ESLint rules enforcement
- **Manual Testing**: Browser-based UI testing

### Planned Testing Implementation
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Cypress for user workflows

---

## 🚨 Known Issues & Technical Debt

### Current Limitations
1. **Static Data**: Using mock data for development
2. **Mobile Optimization**: Basic responsive design (needs enhancement)
3. **Accessibility**: Limited ARIA support (needs improvement)
4. **Performance**: No lazy loading or virtualization yet

### Upcoming Priorities
1. **Real Data Integration**: PostgreSQL + Python ETL pipeline
2. **Advanced Filtering**: Dynamic filter combinations
3. **Export Features**: PDF/Excel export capabilities
4. **User Authentication**: Role-based access control

---

## 📞 Support & Collaboration

### Development SOPs
- **Communication**: Clear commit messages (one-liner format)
- **Code Review**: Feature branch → dev → qa → main workflow
- **Documentation**: Update this guide with architectural changes
- **Issues**: Use GitHub issues for bug reports and feature requests

### Key Contacts
- **Project**: Philippine Climate Finance Dashboard (ARAW)
- **Domain**: Climate finance tracking and transparency
- **Repository**: [Add repository URL]
- **Documentation**: This folder (`dev_notes/`)

---

**Last Updated**: September 29, 2025
**Version**: v3.0 Architecture (MVC + DRY Implementation)



