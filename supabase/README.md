# SKULI Database Setup Guide

## Overview

This directory contains the complete Supabase database schema for SKULI - a School Management & Fee Collection SaaS for Ugandan private schools.

## Migration Files

### 001_initial_schema.sql
**Purpose:** Core database structure with all tables, indexes, and triggers

**Includes:**
- Enums (user_role, payment_method, payment_status, sms_status, attendance_status)
- Core Tables:
  - `schools` - Tenant isolation root
  - `users` - Extends Supabase auth with RBAC
  - `students`, `parents`, `classes`, `subjects`
  - `fee_structures`, `fee_accounts`, `fee_payments`
  - `attendance`, `marks`, `report_cards`
  - `sms_logs`, `audit_logs`, `subscriptions`, `announcements`
- Performance indexes on all foreign keys and frequently queried columns
- Auto-updating `updated_at` triggers
- Soft delete function

### 002_rls_policies.sql
**Purpose:** Row Level Security policies for multi-tenant isolation and role-based access

**Security Model:**
- **SUPER_ADMIN**: Full platform access across all schools
- **SCHOOL_ADMIN**: Full access within their school only
- **BURSAR**: Fee management only
- **TEACHER**: Academic functions (attendance, marks)
- **PARENT**: Read-only access to their children's data

**Key Features:**
- Helper functions (`get_current_school_id()`, `is_super_admin()`, `belongs_to_school()`)
- Comprehensive RLS policies on every table
- Automatic audit logging trigger on all mutations
- Parent-child relationship validation for portal access

### 003_seed_data.sql
**Purpose:** Helper functions, seed data, and utility views

**Includes:**
- `generate_receipt_number()` - Unique receipt generation per school/month
- `recalculate_fee_account_balance()` - Auto-balance calculation on payments
- SMS templates for automated messaging
- Sample school, classes, subjects, and fee structures
- Utility views:
  - `student_summaries` - Quick student overview with fees
  - `class_performance` - Class analytics
  - `revenue_summary` - Monthly revenue breakdown
- `format_ugx()` - Currency formatting
- `get_current_academic_period()` - Ugandan academic calendar helper

## Installation

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon/service keys

### Step 2: Run Migrations

Execute migrations in order via Supabase SQL Editor:

```bash
# Option A: Using Supabase CLI
supabase db push

# Option B: Copy-paste each file into SQL Editor
# Run: 001_initial_schema.sql → 002_rls_policies.sql → 003_seed_data.sql
```

### Step 3: Configure Auth

1. Enable email/password authentication
2. Enable magic link authentication (optional)
3. Set up email templates in Supabase Auth settings

### Step 4: Create First Super Admin

```sql
-- After running migrations, create your first user via Supabase Auth UI
-- Then link them to the users table:

INSERT INTO users (
    supabase_user_id,
    school_id,
    email,
    full_name,
    role
) VALUES (
    'YOUR_AUTH_USER_ID_HERE', -- Get from auth.users after signup
    NULL, -- No school for super admin
    'admin@skuli.ug',
    'Platform Administrator',
    'SUPER_ADMIN'
);
```

### Step 5: Onboard First School

```sql
-- Create school
INSERT INTO schools (name, code, email, phone, address)
VALUES (
    'Your School Name',
    'YSN', -- 3-letter code
    'info@yourschool.ac.ug',
    '+256700000000',
    'School Address, Uganda'
) RETURNING id;

-- Create school admin user
INSERT INTO users (
    supabase_user_id,
    school_id,
    email,
    full_name,
    role
) VALUES (
    'AUTH_USER_ID_FOR_ADMIN',
    'SCHOOL_ID_FROM_ABOVE',
    'admin@yourschool.ac.ug',
    'School Administrator',
    'SCHOOL_ADMIN'
);
```

## Environment Variables

Required for application layer:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Africa's Talking (SMS + Mobile Money)
AFRICAS_TALKING_USERNAME=your-username
AFRICAS_TALKING_API_KEY=your-api-key
AFRICAS_TALKING_SHORTCODE=your-shortcode

# Flutterwave (Subscriptions)
FLUTTERWAVE_PUBLIC_KEY=your-public-key
FLUTTERWAVE_SECRET_KEY=your-secret-key

# App Settings
NEXT_PUBLIC_APP_URL=https://app.skuli.ug
```

## Key Business Rules

### Receipt Number Format
```
SKULI-{SCHOOL_CODE}-{YYYYMM}-{SEQUENCE}
Example: SKULI-KIS-202401-000001
```

### Fee Account Structure
- Each student has one fee account per academic year per term
- Payments are linked to fee accounts
- Balance auto-recalculates on payment completion
- Status automatically updates: ACTIVE → OVERDUE (if past due) → CLOSED (if paid)

### SMS Automation
- Payment receipts: Sent immediately on payment
- Fee reminders: Weekly for overdue accounts
- Absence notifications: Daily at 9 AM for absent students
- Report card ready: On PDF generation completion

### Audit Trail
Every CREATE, UPDATE, DELETE operation is logged with:
- User who performed action
- Old and new values
- IP address and user agent
- Timestamp

## Testing

### Test Tenant Isolation

```sql
-- Verify RLS is working
SET ROLE authenticated;
SET request.jwt.claims.sub TO 'user-uuid-here';

-- Should only see data from user's school
SELECT * FROM students;
```

### Test Payment Flow

```sql
-- 1. Create fee account
INSERT INTO fee_accounts (school_id, student_id, academic_year, term, total_charged)
VALUES ('school-uuid', 'student-uuid', '2024', 'TERM_1', 500000);

-- 2. Record payment
INSERT INTO fee_payments (school_id, fee_account_id, receipt_number, amount, payment_method, payment_status)
VALUES ('school-uuid', 'fee-account-uuid', generate_receipt_number('school-uuid', NOW()), 200000, 'MOBILE_MONEY', 'COMPLETED');

-- 3. Verify balance recalculated
SELECT total_charged, total_paid, balance FROM fee_accounts WHERE id = 'fee-account-uuid';
-- Expected: balance = 300000
```

## Support

For issues or questions:
- Email: support@skuli.ug
- Documentation: https://docs.skuli.ug

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Database:** PostgreSQL 15 (Supabase)
