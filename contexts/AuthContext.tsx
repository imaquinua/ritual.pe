'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User, Session } from '@supabase/supabase-js'
import type { User as ProfileUser } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: ProfileUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: { name: string; phone?: string }) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (updates: Partial<ProfileUser>) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}