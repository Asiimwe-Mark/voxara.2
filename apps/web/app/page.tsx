'use client'

import { redirect } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useEffect } from 'react'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/login'
      }
    }
  }, [isAuthenticated, isLoading])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#0A1628] mb-2">SKULI</h1>
        <p className="text-gray-600">School Operating System</p>
        <div className="mt-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A1628] border-t-[#F5A623] mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
