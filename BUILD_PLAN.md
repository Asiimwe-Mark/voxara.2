# SKULI Frontend Build Plan

## Overview
Production-grade Next.js 14 SaaS for Ugandan schools
**Priority:** FEES → SMS → PARENTS → TRUST → RETENTION

---

## PHASE 1: REVENUE CORE (Weeks 1-4)
### Week 1: Foundation & Auth
- [x] Project setup (monorepo structure)
- [ ] Supabase client configuration
- [ ] Auth system (login, signup, magic links)
- [ ] RBAC middleware & guards
- [ ] Dashboard shell layout

### Week 2: Student Management
- [ ] Student list view with filters
- [ ] Student CRUD forms
- [ ] Class management
- [ ] Bulk import (CSV)

### Week 3: Fee Engine
- [ ] Fee structure builder
- [ ] Fee account creation (invoicing)
- [ ] Balance tracking
- [ ] Payment recording (cash + Mobile Money)
- [ ] Receipt generation & SMS

### Week 4: Parent Portal & Polish
- [ ] Parent login (magic link)
- [ ] Fee balance view
- [ ] Payment history
- [ ] SMS notifications integration
- [ ] Offline-first caching
- [ ] Performance audit

---

## PHASE 2: ACADEMICS (Weeks 5-7)
### Week 5: Attendance
- [ ] Daily attendance marking
- [ ] Class-wise views
- [ ] Absence SMS automation
- [ ] Offline support

### Week 6: Marks & Subjects
- [ ] Subject management
- [ ] Marks entry forms
- [ ] Grade calculations
- [ ] Teacher workflows

### Week 7: Report Cards
- [ ] PDF generation (async)
- [ ] Template system
- [ ] Parent academic portal
- [ ] Download/share features

---

## PHASE 3: ENTERPRISE (Weeks 8-10)
### Week 8: Communication
- [ ] Announcements
- [ ] Bulk SMS campaigns
- [ ] Message templates
- [ ] Delivery tracking

### Week 9: Payroll
- [ ] Staff management
- [ ] Salary structures
- [ ] Payslip generation
- [ ] Payment tracking

### Week 10: Super Admin & Analytics
- [ ] Super admin dashboard
- [ ] School onboarding flow
- [ ] Revenue analytics
- [ ] System health monitoring
- [ ] Feature flags

---

## Tech Stack Summary
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **DB:** Supabase (PostgreSQL + RLS)
- **Auth:** Supabase Auth
- **Payments:** Flutterwave (subscriptions)
- **SMS:** Africa's Talking
- **PDF:** @react-pdf/renderer (async)
- **Charts:** Recharts
- **Motion:** Framer Motion

---

## Execution Status
Phase 1, Week 1: IN PROGRESS
