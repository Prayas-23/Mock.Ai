import supabase from '../config/supabase.js'

export const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access token is required' 
      })
    }

    const token = authHeader.split(' ')[1]
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ 
        message: 'Invalid or expired token' 
      })
    }

    // Add user to request object
    req.user = user
    next()
    
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const { data: { user } } = await supabase.auth.getUser(token)
      req.user = user || null
    } else {
      req.user = null
    }
    
    next()
  } catch (error) {
    req.user = null
    next()
  }
}

export default verifySupabaseToken