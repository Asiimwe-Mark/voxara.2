'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        // Get user profile with role and school info
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            role,
            school_id,
            schools (name, code)
          `)
          .eq('id', data.user.id)
          .single()

        if (profileError) throw profileError

        // Login with complete user data
        login({
          id: data.user.id,
          email: data.user.email!,
          full_name: profile.full_name,
          role: profile.role as any,
          school_id: profile.school_id || undefined,
          school_name: profile.schools?.name || undefined,
        })

        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0A1628] mb-2">SKULI</h1>
          <p className="text-gray-600">School Operating System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0A1628]">Sign In</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none transition-all"
                placeholder="admin@school.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#F5A623] focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#F5A623] focus:ring-[#F5A623]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#0A1628] hover:text-[#F5A623] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white font-medium py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/contact"
                className="text-[#0A1628] hover:text-[#F5A623] font-medium"
              >
                Contact your school administrator
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin@school.com / password</p>
            <p><strong>Bursar:</strong> bursar@school.com / password</p>
            <p><strong>Teacher:</strong> teacher@school.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
