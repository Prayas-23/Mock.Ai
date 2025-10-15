import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

const AuthContext = createContext({})

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
}

// Local storage keys
const LOCAL_USER_KEY = 'mock_ai_user'
const LOCAL_USERS_KEY = 'mock_ai_users'

// Local user management
const getLocalUsers = () => {
  try {
    const users = localStorage.getItem(LOCAL_USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch {
    return []
  }
}

const saveLocalUser = (userData) => {
  try {
    const users = getLocalUsers()
    const existingUserIndex = users.findIndex(u => u.email === userData.email)
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = userData
    } else {
      users.push(userData)
    }
    
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
    return true
  } catch {
    return false
  }
}

const findLocalUser = (email, password) => {
  const users = getLocalUsers()
  return users.find(u => u.email === email && u.password === password)
}

const getCurrentLocalUser = () => {
  try {
    const user = localStorage.getItem(LOCAL_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const setCurrentLocalUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(LOCAL_USER_KEY)
    }
    return true
  } catch {
    return false
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Supabase configured:', isSupabaseConfigured())
      
      if (isSupabaseConfigured()) {
        // Try Supabase first
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            console.log('Active Supabase session found:', session.user.email)
            setUser(session.user)
            setLoading(false)
            return
          }
        } catch (error) {
          console.log('Supabase session check failed, falling back to local auth')
        }
      }
      
      // Fall back to local authentication
      const localUser = getCurrentLocalUser()
      if (localUser) {
        console.log('Local user session found:', localUser.email)
        setUser(localUser)
      }
      
      setLoading(false)
    }

    initializeAuth()

    // Listen for Supabase auth changes only if configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event !== 'INITIAL_SESSION') {
            console.log('Supabase auth state change:', event)
          }
          
          if (session?.user) {
            setUser(session.user)
            // Clear local user when Supabase user is active
            setCurrentLocalUser(null)
          } else if (!getCurrentLocalUser()) {
            setUser(null)
          }
          
          setLoading(false)
          
          if (event === 'SIGNED_IN') {
            toast.success('Welcome back!')
          } else if (event === 'SIGNED_OUT') {
            toast.success('Signed out successfully!')
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  // Sign up with email and password
  const signUp = async ({ email, password, fullName }) => {
    try {
      setLoading(true)
      const cleanEmail = email.trim().toLowerCase()
      console.log('Starting signup process for:', cleanEmail)
      
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: fullName,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`
              }
            }
          })

          if (!error && data?.user) {
            console.log('Supabase user created successfully')
            toast.success('Account created successfully!')
            return { success: true, data, needsEmailConfirmation: !data.user.email_confirmed_at }
          }
          
          if (error && !error.message.includes('Invalid API key')) {
            console.log('Supabase signup failed, falling back to local auth:', error.message)
          }
        } catch (supabaseError) {
          console.log('Supabase signup error, falling back to local auth:', supabaseError.message)
        }
      }
      
      // Local authentication fallback
      console.log('Using local authentication for signup')
      
      // Check if user already exists locally
      const existingUsers = getLocalUsers()
      if (existingUsers.find(u => u.email === cleanEmail)) {
        toast.error('An account with this email already exists. Please try signing in instead.')
        return { success: false, error: { message: 'User already exists' } }
      }
      
      // Create local user
      const newUser = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: cleanEmail,
        password: password, // In production, this should be hashed
        user_metadata: {
          full_name: fullName,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`
        },
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString() // Auto-confirm for local users
      }
      
      if (saveLocalUser(newUser)) {
        console.log('Local user created successfully:', cleanEmail)
        toast.success('Account created successfully! You can now sign in.')
        return { success: true, data: { user: newUser }, needsEmailConfirmation: false }
      } else {
        toast.error('Failed to create account. Please try again.')
        return { success: false, error: { message: 'Failed to save user locally' } }
      }
      
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(`Something went wrong during signup: ${error.message}`)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async ({ email, password }) => {
    try {
      setLoading(true)
      const cleanEmail = email.trim().toLowerCase()
      
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
          })

          if (!error && data?.user) {
            console.log('Supabase sign in successful')
            toast.success('Welcome back!')
            return { success: true, data }
          }
          
          if (error && !error.message.includes('Invalid API key')) {
            console.log('Supabase signin failed, trying local auth:', error.message)
          }
        } catch (supabaseError) {
          console.log('Supabase signin error, trying local auth:', supabaseError.message)
        }
      }
      
      // Local authentication fallback
      console.log('Using local authentication for signin')
      const localUser = findLocalUser(cleanEmail, password)
      
      if (localUser) {
        // Remove password from user object for security
        const { password: _, ...userWithoutPassword } = localUser
        setCurrentLocalUser(userWithoutPassword)
        setUser(userWithoutPassword)
        console.log('Local sign in successful:', cleanEmail)
        toast.success('Welcome back!')
        return { success: true, data: { user: userWithoutPassword } }
      } else {
        toast.error('Invalid email or password')
        return { success: false, error: { message: 'Invalid credentials' } }
      }
      
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Something went wrong!')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      
      // Only try Google OAuth if Supabase is configured
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          toast.error(error.message)
          return { success: false, error }
        }

        return { success: true, data }
      } else {
        toast.error('Google sign-in is not available in local mode')
        return { success: false, error: { message: 'Google OAuth not configured' } }
      }
    } catch (error) {
      toast.error('Something went wrong!')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      
      // Sign out from Supabase if configured and user is signed in via Supabase
      if (isSupabaseConfigured() && user && !user.id?.startsWith('local_')) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.log('Supabase signout error:', error.message)
        }
      }
      
      // Clear local user session
      setCurrentLocalUser(null)
      setUser(null)
      
      toast.success('Signed out successfully!')
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Something went wrong!')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      
      // Only try Supabase password reset if configured
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        })

        if (error) {
          toast.error(error.message)
          return { success: false, error }
        }

        toast.success('Check your email for reset link!')
        return { success: true, data }
      } else {
        toast.error('Password reset is not available in local mode')
        return { success: false, error: { message: 'Password reset not available' } }
      }
    } catch (error) {
      toast.error('Something went wrong!')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Update password
  const updatePassword = async (password) => {
    try {
      setLoading(true)
      
      // Try Supabase first if user is signed in via Supabase
      if (isSupabaseConfigured() && user && !user.id?.startsWith('local_')) {
        const { data, error } = await supabase.auth.updateUser({
          password
        })

        if (error) {
          toast.error(error.message)
          return { success: false, error }
        }

        toast.success('Password updated successfully!')
        return { success: true, data }
      } else if (user?.id?.startsWith('local_')) {
        // Update local user password
        const users = getLocalUsers()
        const userIndex = users.findIndex(u => u.id === user.id)
        
        if (userIndex >= 0) {
          users[userIndex].password = password
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
          toast.success('Password updated successfully!')
          return { success: true }
        } else {
          toast.error('User not found')
          return { success: false, error: { message: 'User not found' } }
        }
      } else {
        toast.error('No user signed in')
        return { success: false, error: { message: 'No user signed in' } }
      }
    } catch (error) {
      toast.error('Something went wrong!')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    authUser: user, // For backward compatibility
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthProvider