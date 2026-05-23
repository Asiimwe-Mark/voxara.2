import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'BURSAR' | 'TEACHER' | 'PARENT'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  school_id?: string
  school_name?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'skuli-auth-storage',
    }
  )
)
