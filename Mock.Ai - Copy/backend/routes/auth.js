import express from 'express'
import supabase from '../config/supabase.js'
import { verifySupabaseToken } from '../middleware/auth.js'

const router = express.Router()

// Get current user profile
router.get('/profile', verifySupabaseToken, async (req, res) => {
  try {
    const { user } = req
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name,
        avatarUrl: user.user_metadata?.avatar_url,
        emailVerified: !!user.email_confirmed_at,
        createdAt: user.created_at
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    })
  }
})

// Update user profile
router.put('/profile', verifySupabaseToken, async (req, res) => {
  try {
    const { fullName, avatarUrl } = req.body
    
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl
      }
    })
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(200).json({
      success: true,
      user: data.user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
})

// Verify token endpoint
router.get('/verify', verifySupabaseToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: req.user
  })
})

export default router