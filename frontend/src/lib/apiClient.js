import axios from 'axios'
import { supabase } from './supabase'

// Create axios instance
const apiClient = axios.create()

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
      
      return config
    } catch (error) {
      console.error('Error adding auth token:', error)
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      window.location.href = '/auth/login'
    }
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default apiClient