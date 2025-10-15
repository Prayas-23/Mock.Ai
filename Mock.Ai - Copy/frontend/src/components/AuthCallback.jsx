import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import { Box, Typography, CircularProgress } from '@mui/material'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('Authentication failed')
          toast.error('Email confirmation failed. Please try again.')
          setTimeout(() => navigate('/auth/login'), 3000)
          return
        }

        if (data.session) {
          console.log('Email confirmed successfully:', data.session.user)
          setStatus('Email confirmed successfully!')
          toast.success('Email confirmed! You are now logged in.')
          setTimeout(() => navigate('/'), 2000)
        } else {
          setStatus('No session found')
          toast.error('No active session found. Please try signing in.')
          setTimeout(() => navigate('/auth/login'), 3000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('An error occurred')
        toast.error('An error occurred during confirmation.')
        setTimeout(() => navigate('/auth/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: 4
      }}
    >
      <CircularProgress sx={{ mb: 4, color: '#90caf9' }} />
      <Typography variant="h4" sx={{ mb: 2, color: '#90caf9' }}>
        Confirming Email
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        {status}
      </Typography>
    </Box>
  )
}

export default AuthCallback