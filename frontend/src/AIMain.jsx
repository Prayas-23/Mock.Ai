import React from 'react'
import App from './AIApp.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "1076489462113-94c8nj5rsrcq52uq7aeji2uq2268qlci.apps.googleusercontent.com"

export default function AIMain() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <AuthProvider>
          <QuizProvider>
            <App />
          </QuizProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}