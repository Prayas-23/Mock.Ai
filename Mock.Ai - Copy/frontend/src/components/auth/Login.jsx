import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { toast } from 'react-hot-toast'
import { cn } from "../../lib/utils.js";
import { TextGenerateEffect } from "../ui/text-generate-effect.jsx";
import { BackgroundLines } from "../ui/background-lines.jsx";
import { SparklesCore } from "../ui/sparkles-core.jsx";
import { FlipWords } from "../ui/flip-words.jsx";
import { MovingBorder } from "../ui/moving-border.jsx";
import { TypewriterEffect } from "../ui/typewriter-effect.jsx";
import { LampContainer } from "../ui/lamp.jsx";

const Login = () => {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    const result = await signIn(formData)
    if (result.success) {
      navigate('/')
    }
  }

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle()
    if (result.success) {
      // Google OAuth will redirect automatically
    }
  }

  const words = ["Login", "Authenticate", "Access"];
  
  const typewriterWords = [
    {
      text: "Welcome",
    },
    {
      text: "to",
    },
    {
      text: "Mock.Ai",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black">
      <LampContainer>
        <BackgroundLines className="flex items-center justify-center w-full min-h-screen">
          <div className="relative w-full max-w-md mx-auto p-4">
            <div className="absolute inset-0 h-full w-full pointer-events-none">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </div>
            
            <div className="relative z-10 bg-black/70 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <TypewriterEffect words={typewriterWords} />
                <div className="mt-4">
                  <TextGenerateEffect
                    words="Access your Mock.Ai account to continue your interview preparation journey"
                    className="text-neutral-300 text-sm md:text-base"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-500"
                      placeholder="you@example.com"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-5 w-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                        <>
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <svg className="h-5 w-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                        {showPassword ? (
                          <>
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          </>
                        ) : (
                          <>
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-700 rounded bg-neutral-800"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/auth/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <MovingBorder duration={3000}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-black"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </MovingBorder>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-neutral-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-3 border border-neutral-700 rounded-lg shadow-sm text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-black transition duration-300"
                  >
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                    </svg>
                    <span className="ml-3">Sign in with Google</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-400">
                  Don't have an account?{' '}
                  <Link to="/auth/signup" className="font-medium text-blue-400 hover:text-blue-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </BackgroundLines>
      </LampContainer>
    </div>
  )
}

export default Login