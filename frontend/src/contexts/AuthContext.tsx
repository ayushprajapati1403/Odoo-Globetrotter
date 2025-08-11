import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  debugTokens: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Debug function to check tokens in localStorage
  const debugTokens = () => {
    console.log('=== TOKEN DEBUG INFO ===')
    
    // Check Supabase tokens
    const supabaseAccessToken = localStorage.getItem('sb-access-token')
    const supabaseRefreshToken = localStorage.getItem('sb-refresh-token')
    
    console.log('Supabase Access Token:', supabaseAccessToken ? '✅ Present' : '❌ Missing')
    console.log('Supabase Refresh Token:', supabaseRefreshToken ? '✅ Present' : '❌ Missing')
    
    // Check current session
    console.log('Current Session:', session)
    console.log('Current User:', user)
    
    // Check all localStorage items
    console.log('All localStorage items:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        console.log(`  ${key}: ${value ? '✅ Present' : '❌ Missing'}`)
      }
    }
    console.log('=== END TOKEN DEBUG ===')
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session loaded:', session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Debug tokens after initial load
      if (session) {
        debugTokens()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Debug tokens after auth state change
      if (session) {
        debugTokens()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
      console.log('Sign in successful:', data)
      debugTokens()
      return { error: null }
    } catch (err) {
      console.error('Sign in exception:', err)
      return { error: err }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting sign up for:', email, name)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      
      if (error) {
        console.error('Sign up error:', error)
        return { data: null, error }
      }
      
      console.log('Sign up successful:', data)
      debugTokens()
      return { data, error: null }
    } catch (err) {
      console.error('Sign up exception:', err)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      
      // First, clear local state immediately
      setUser(null)
      setSession(null)
      
      // Clear all Supabase-related localStorage items
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        console.log('Removed localStorage item:', key)
      })
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.warn('Supabase sign out error (this is often expected):', error)
        // Don't throw error here as we've already cleared local state
      } else {
        console.log('Supabase sign out successful')
      }
      
      console.log('Sign out completed')
      debugTokens()
      
    } catch (err) {
      console.error('Sign out error:', err)
      // Even if there's an error, ensure local state is cleared
      setUser(null)
      setSession(null)
    }
  }

  const value = { user, session, loading, signIn, signUp, signOut, debugTokens }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
