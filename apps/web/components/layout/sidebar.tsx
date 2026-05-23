'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/fees', label: 'Fees' },
  { href: '/attendance', label: 'Attendance' },
  { href: '/parents', label: 'Parents' },
]

const bursarNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/fees', label: 'Fee Management' },
  { href: '/payments', label: 'Payments' },
  { href: '/reports', label: 'Reports' },
]

const teacherNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/attendance', label: 'Attendance' },
  { href: '/marks', label: 'Marks' },
  { href: '/students', label: 'My Students' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const getNavItems = () => {
    switch (user?.role) {
      case 'SCHOOL_ADMIN':
        return adminNavItems
      case 'BURSAR':
        return bursarNavItems
      case 'TEACHER':
        return teacherNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="flex h-screen w-64 flex-col bg-[#0A1628] text-white">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <h1 className="text-xl font-bold text-[#F5A623]">SKULI</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block rounded-md px-3 py-2 text-sm transition-colors',
              pathname === item.href
                ? 'bg-[#F5A623] text-[#0A1628]'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 text-sm text-white/60">
          <p className="font-medium text-white">{user?.full_name}</p>
          <p className="text-xs">{user?.role.replace('_', ' ')}</p>
          {user?.school_name && (
            <p className="text-xs text-white/60">{user.school_name}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
