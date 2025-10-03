# 📚 Developer Documentation

## Welcome to ARAW Climate Finance Dashboard

This folder contains comprehensive documentation for developers working on the ARAW project.

---

## 📖 Documentation Files

### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
**Complete technical architecture guide**
- Technology stack details
- MVC pattern implementation  
- Project structure deep dive
- Development workflow
- Data architecture planning

### 🚀 [QUICK_START.md](./QUICK_START.md)  
**5-minute setup for new developers**
- Instant setup commands
- Current feature overview
- Key file locations
- Development shortcuts

### 🧩 [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
**Component development patterns**
- MVC component patterns
- Reusable UI components
- State management hooks
- Styling guidelines
- Testing patterns

---

## 🎯 For New Developers

### Start Here:
1. **Read**: [QUICK_START.md](./QUICK_START.md) (5 minutes)
2. **Setup**: Follow the 5-minute setup guide  
3. **Explore**: Review [ARCHITECTURE.md](./ARCHITECTURE.md) for deep understanding
4. **Build**: Use [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) for development patterns

### Current Project State (v3.0)
- **Active Feature**: Left sidebar navigation (MVC architecture)
- **Branch**: `feature/v3.0-redesign`
- **Status**: Architecture foundation complete, UI implementation in progress

---

## 🏛️ Architecture Summary

```
┌─── Models ────────┐    ┌─── Controllers ────┐    ┌─── Views ──────┐
│                   │    │                    │    │                │
│ • FilterModel.ts  │────│ • useFilterController │────│ • LeftSidebar  │
│ • ThemeModel.ts   │    │ • useSidebarController│    │ • FilterCheckbox│  
│ • Business Logic  │    │ • State Management │    │ • Pure UI      │
│                   │    │                    │    │                │
└───────────────────┘    └────────────────────┘    └────────────────┘
```

### Key Principles
- **MVC Pattern**: Clear separation of concerns
- **DRY Principle**: Reusable components and logic
- **TypeScript**: Full type safety throughout
- **Component Composition**: Small, focused, reusable pieces

---

## 📋 Development Standards

### Code Organization
- **Models**: Business logic & data structures (`src/models/`)
- **Controllers**: State management hooks (`src/controllers/`)  
- **Components**: Pure UI components (`src/components/`)
- **Services**: API & external data (`src/services/`)

### Naming Conventions
- **Components**: PascalCase (`FilterCheckbox`)
- **Hooks**: camelCase with `use` prefix (`useFilterController`)
- **Files**: PascalCase for components, camelCase for utilities
- **Props**: Explicit TypeScript interfaces

### Quality Standards
- TypeScript strict mode
- ESLint compliance
- Build must pass before commits
- MVC pattern adherence

---

## 🌟 Project Context

### Domain: Philippine Climate Finance
- **Purpose**: Track climate finance flows aligned with Paris Agreement
- **Stakeholders**: Government agencies, international organizations
- **Data**: Multi-source finance tracking (public, international, private)
- **Compliance**: NDC, NAP, CCET reporting requirements

### Technical Goals
- **Transparency**: Government climate finance visibility
- **Scalability**: Handle large datasets efficiently  
- **Maintainability**: Clean architecture for long-term development
- **Performance**: Fast, responsive dashboard experience

---

## 🔄 Current Development Cycle

### v3.0 Implementation Progress
- ✅ **Architecture**: MVC pattern established
- ✅ **Header**: Teal theme applied (`#3C6866`)
- ✅ **Layout**: Sidebar + content structure
- 🔄 **Sidebar**: Filter functionality in progress
- 📋 **Next**: KPI cards, chart reorganization

### Branch Strategy
- **main**: Production stable
- **qa**: Pre-production testing
- **dev**: Development integration  
- **feature/v3.0-redesign**: Current active development

---

## 📞 Getting Help

### Quick References
- **SOPs**: `local/user-agent_sops_araw.txt`
- **Project Context**: `local/docs_context_summary.txt`
- **Build Logs**: `local/wus_logs.txt`

### Development Shortcuts
- **bfe**: Build and fix errors + restart server
- **g**: Go ahead with implementation  
- **ho**: Hold on, step back and review

---

## 🚀 Contributing

### Before You Start
1. Read the architecture documentation
2. Understand the MVC pattern implementation
3. Follow the component development guide
4. Maintain code quality standards

### Development Flow
1. **Plan**: Review architecture patterns
2. **Model**: Create business logic (if needed)
3. **Control**: Implement state management
4. **View**: Create pure UI components  
5. **Test**: Build and validate
6. **Document**: Update relevant docs

---

**Happy Coding!** 🎉

*Building transparent climate finance tracking for the Philippines* 🇵🇭

---

**Last Updated**: September 29, 2025  
**Current Version**: v3.0 Architecture Implementation



