# 🚀 ARAW Dashboard - Quick Start Guide

## For New Developers

### ⚡ 5-Minute Setup

```bash
# 1. Clone & Navigate
git clone [repo-url]
cd araw

# 2. Install Dependencies
npm install

# 3. Start Development
npm run build && npm run dev

# 4. Open Browser
# → http://localhost:3000
```

---

## 🎯 Current Feature: v3.0 Sidebar Navigation

### What We're Building
- **Left Sidebar**: Replacing horizontal filters
- **Collapsible Sections**: Filters, NAP, NDCIP
- **MVC Architecture**: Clean separation of concerns

### Active Branch
```bash
git checkout feature/v3.0-redesign
```

---

## 🏗️ Architecture Quick Reference

### File Structure You Need to Know
```
src/
├── models/          # Business logic & data
├── controllers/     # State management hooks  
├── components/
│   ├── layout/      # Main layout components
│   └── ui/         # Reusable UI components
└── app/page.tsx    # Main dashboard page
```

### Key Components (v3.0)
- **LeftSidebar.tsx**: Main sidebar navigation
- **useFilterController.ts**: Filter state management
- **FilterModel.ts**: Business logic & validation

---

## 🎨 Design System

### Colors (v3.0 Theme)
- **Primary**: `#3C6866` (teal)
- **Secondary**: `#2f8964` (green) 
- **Accent**: `#3B82F6` (blue)

### Component Patterns
- **SidebarSection**: Collapsible sections
- **FilterCheckbox**: Styled checkboxes
- **SidebarActionButton**: Action buttons with variants

---

## 🛠️ Development Workflow

### Command Shortcuts (from SOPs)
- **bfe**: Build and fix errors + restart server
- **g**: Go ahead with implementation
- **ho**: Hold on, step back and review

### Build & Test
```bash
npm run build     # Compile TypeScript & build
npm run dev       # Start development server
npm run lint      # Check code quality
```

---

## 🔍 Current Progress

### ✅ Completed
- [x] Header with teal theme
- [x] MVC architecture foundation
- [x] Reusable UI components
- [x] Layout restructure (sidebar + content)

### 🔄 In Progress
- [ ] Complete sidebar functionality
- [ ] KPI cards color scheme update
- [ ] Chart sections reorganization

### 📋 Next Steps
- Sidebar filtering logic
- Color scheme consistency
- Mobile responsiveness

---

## 🚨 Important Notes

### Development Rules
1. **TypeScript**: Always use explicit types
2. **Components**: Functional components only
3. **Styling**: Tailwind classes, no custom CSS
4. **State**: Use custom hooks for complex logic

### Don't Break These
- Header teal color: `#3C6866`
- MVC separation of concerns
- DRY principles for components
- Build must pass before commits

---

## 📞 Need Help?

### Resources
- **Full Architecture**: `dev_notes/ARCHITECTURE.md`
- **SOPs**: `local/user-agent_sops_araw.txt`
- **Project Context**: `local/docs_context_summary.txt`

### Quick Questions?
1. Check the models folder for business logic
2. Look at existing controllers for state patterns
3. Use reusable UI components in `components/ui/`

---

**Happy Coding!** 🎉

*Last Updated: September 29, 2025*



