# SKULI Web Application

Next.js 14 frontend for SKULI - School Operating System for Ugandan schools.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project (see `/supabase` directory)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your credentials
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - AFRICAS_TALKING_API_KEY
# - FLUTTERWAVE keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Landing page
│   ├── components/       # React components
│   │   └── ui/           # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities & configs
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom glass-morphism
- **State:** Zustand (client) + TanStack Query (server)
- **Forms:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL + RLS)
- **Auth:** Supabase Auth
- **SMS:** Africa's Talking
- **Payments:** Flutterwave

## Design System

### Colors
- Primary: `#0A1628` (Deep navy)
- Accent: `#F5A623` (Amber)
- Success: `#10B981`
- Danger: `#F43F5E`

### Theme
"African Institutional Premium"
- Glass-like cards
- Subtle glow borders
- Soft shadows
- Smooth animations (Framer Motion)

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # TypeScript check
```

## Environment Variables

See `.env.local.example` for required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `AFRICAS_TALKING_*` - SMS provider config
- `FLUTTERWAVE_*` - Payment provider config

## Offline-First Features

The app implements offline-first architecture:
- Local caching with React Query persistence
- IndexedDB for pending operations
- Automatic sync when back online
- Optimistic UI updates

## Phase 1 Modules (Current)

✅ Project setup
✅ Supabase client
✅ Auth system (in progress)
✅ Dashboard shell
⏳ Student management
⏳ Fee engine
⏳ Payment recording
⏳ SMS integration
⏳ Parent portal

## Next Steps

1. Set up Supabase project with migration files
2. Configure authentication
3. Build dashboard layout
4. Implement student CRUD
5. Build fee management system

## License

Proprietary - SKULI School Systems
