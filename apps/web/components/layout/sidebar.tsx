'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  FileText,
  UserCheck,
  CreditCard,
  Megaphone,
  BarChart3,
  Building2,
  Settings,
  LogOut
} from 'lucide-react'

const superAdminNavItems = [
  { href: '/super-admin', label: 'All Schools', icon: Building2 },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/fees', label: 'Fees', icon: DollarSign },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/marks', label: 'Marks', icon: ClipboardList },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/parents', label: 'Parents', icon: UserCheck },
  { href: '/payroll', label: 'Payroll', icon: CreditCard },
  { href: '/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const bursarNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fees', label: 'Fee Management', icon: DollarSign },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const teacherNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/marks', label: 'Marks', icon: ClipboardList },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/students', label: 'My Students', icon: Users },
  { href: '/announcements', label: 'Announcements', icon: Megaphone },
]

const parentNavItems = [
  { href: '/parent', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/parent/fees', label: 'Fees & Payments', icon: DollarSign },
  { href: '/parent/reports', label: 'Report Cards', icon: FileText },
  { href: '/parent/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/parent/announcements', label: 'Announcements', icon: Megaphone },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const getNavItems = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return superAdminNavItems
      case 'SCHOOL_ADMIN':
        return adminNavItems
      case 'BURSAR':
        return bursarNavItems
      case 'TEACHER':
        return teacherNavItems
      case 'PARENT':
        return parentNavItems
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

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon || LayoutDashboard
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  ? 'bg-[#F5A623] text-[#0A1628]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
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
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
