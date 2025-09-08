"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthService } from "@/lib/auth"
import { AuthGuard } from "@/components/auth-guard"
import type { LoginCredentials, SignupCredentials } from "@/lib/types"
import { Eye, EyeOff, LogIn, UserPlus, Sparkles, Crown, Shield } from "lucide-react"

function AuthPageContent() {
  const router = useRouter()
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [signupCredentials, setSignupCredentials] = useState<SignupCredentials>({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login is active since this is the login page
  const isLogin = true

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await AuthService.login(loginCredentials)
      window.location.href = "/products"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await AuthService.signup(signupCredentials)
      window.location.href = "/products"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Main Auth Card */}
        <div className="glass-strong rounded-3xl p-8 glow-white animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-orange-400" />
              <h1 className="text-3xl font-black text-gradient-rainbow">ASTRAPE</h1>
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </div>
            
            {/* Toggle Buttons */}
            <div className="glass rounded-2xl p-1 flex mb-6">
              <Link href="/auth/login" className="flex-1">
                <button
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                    isLogin
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-black glow-orange"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Login
                </button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <button
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                    !isLogin
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black glow-cyan"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </Link>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? "Welcome Back" : "Join the Elite"}
              </h2>
              <p className="text-white/70">
                {isLogin
                  ? "Access your exclusive collection"
                  : "Unlock premium designer access"}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 glass">
              {error}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white font-medium">
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginCredentials.email}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                  className="glass border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 focus:border-orange-400 focus:ring-orange-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginCredentials.password}
                    onChange={handleLoginChange}
                    required
                    disabled={isLoading}
                    className="glass border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 focus:border-orange-400 focus:ring-orange-400/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 cursor-pointer">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-white font-medium">
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupCredentials.name}
                  onChange={handleSignupChange}
                  required
                  disabled={isLoading}
                  className="glass border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white font-medium">
                  Email Address
                </Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupCredentials.email}
                  onChange={handleSignupChange}
                  required
                  disabled={isLoading}
                  className="glass border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    value={signupCredentials.password}
                    onChange={handleSignupChange}
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="glass border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 focus:border-cyan-400 focus:ring-cyan-400/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-secondary h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-6 text-sm text-white/60">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-orange-400" />
                <span>Premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Exclusive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            By continuing, you agree to our{" "}
            <span className="text-white/80 hover:text-white cursor-pointer">Terms</span> and{" "}
            <span className="text-white/80 hover:text-white cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <AuthPageContent />
    </AuthGuard>
  )
}