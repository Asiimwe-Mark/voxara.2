# SKULI - School Management System

## 📋 Overview

SKULI is an enterprise-grade School Management & Fee Collection SaaS built for Ugandan private schools. This is a production system handling real money, real students, and real SMS traffic.

## 🎯 Current Status: Phase 2 (Academics) - COMPLETE

### ✅ Completed Modules

**Phase 1 - Revenue Core:**
- ✅ Authentication (Supabase Auth)
- ✅ Dashboard with analytics
- ✅ Student Management
- ✅ Fee Management & Payments
- ✅ Attendance Tracking
- ✅ Parent Portal

**Phase 2 - Academics System:**
- ✅ Subjects Management
- ✅ Marks Entry & Grading
- ✅ Report Cards (PDF preview)
- ✅ Parent Management

## 📁 Project Structure

```
apps/web/
├── app/
│   ├── login/              # Authentication page
│   ├── dashboard/          # Main dashboard
│   ├── students/           # Student management
│   ├── fees/               # Fee management & payments
│   ├── attendance/         # Daily attendance
│   ├── subjects/           # Subject management (NEW)
│   ├── marks/              # Marks entry & grading (NEW)
│   ├── reports/            # Report cards (NEW)
│   ├── parents/            # Parent management (NEW)
│   ├── parent/             # Parent portal
│   └── settings/           # School settings
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── fees/               # Fee-specific components
├── hooks/                  # Custom React hooks
├── store/                  # Zustand state management
└── lib/                    # Utilities & configurations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
cd apps/web
npm install
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

**Theme:** African Institutional Premium

- **Primary:** `#0A1628` (Deep Navy)
- **Accent:** `#F5A623` (Amber)
- **Success:** `#10B981`
- **Danger:** `#F43F5E`

## 📊 Features by Role

### SCHOOL_ADMIN
- Full access to all modules
- User management
- School settings
- Analytics & reports

### BURSAR
- Fee management
- Payment processing
- Financial reports
- SMS receipts

### TEACHER
- Attendance marking
- Marks entry
- Subject management
- Report generation
- Student lists

### PARENT
- View fee balances
- Payment history
- Report cards
- Attendance summary
- SMS notifications

## 🇺🇬 Uganda-Specific Features

- **Currency:** UGX formatting (UGX 1,200,000)
- **Date Format:** DD/MM/YYYY
- **Mobile Money:** MTN & Airtel support
- **SMS Integration:** Africa's Talking
- **Academic System:** Ugandan classes (Senior 1-6)
- **Grading Scale:** A+ to F with remarks

## 📱 Responsive Design

- Mobile-first approach
- Minimum width: 320px
- Optimized for 3G networks
- Skeleton loading states
- Touch-friendly interfaces

## 🔐 Security Features

- Supabase Row Level Security (RLS)
- Role-based access control (RBAC)
- Audit logging
- Encrypted API keys
- HMAC webhook verification

## 📄 License

Proprietary - SKULI School Management System

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Supabase, Framer Motion
