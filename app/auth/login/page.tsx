"use client"

import type React from "react"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, Eye, EyeOff, ArrowLeft, Github, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"

export default function LoginPage() {
  const router = useRouter()
  const googleLoginRef = useRef<HTMLDivElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (res.ok && data.access_token) {
        // Store tokens
        localStorage.setItem("access_token", data.access_token)
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token)
        }

        // Store user session info
        const userSession = {
          email: formData.email,
          token_type: data.token_type,
          expires_in: data.expires_in,
          login_time: Date.now(),
          remember_me: formData.rememberMe,
        }
        localStorage.setItem("user_session", JSON.stringify(userSession))

        setSuccess("Login successful! Redirecting...")

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getGoogleErrorMessage = (message?: string) => {
    const normalizedMessage = message?.toLowerCase() || ""

    if (normalizedMessage.includes("invalid") || normalizedMessage.includes("expired")) {
      return "Invalid or expired Google token. Please try again."
    }

    if (
      normalizedMessage.includes("different provider") ||
      normalizedMessage.includes("password login") ||
      normalizedMessage.includes("already registered")
    ) {
      return "This email is already linked to another sign-in method."
    }

    return message || "Unable to sign in with Google right now. Please try again."
  }

  const handleGoogleLogin = async (googleResponse: CredentialResponse) => {
    if (isLoading) return

    const credential = googleResponse.credential
    if (!credential) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: credential }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.access_token) {
        localStorage.setItem("access_token", data.access_token)
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token)
        }

        const userSession = {
          email: data.email ?? null,
          token_type: data.token_type,
          expires_in: data.expires_in,
          login_time: Date.now(),
          remember_me: formData.rememberMe,
          provider: "google",
        }
        localStorage.setItem("user_session", JSON.stringify(userSession))

        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError(getGoogleErrorMessage(data.message))
      }
    } catch (error) {
      console.error("Google login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleButtonClick = () => {
    if (isLoading) return
    const hiddenGoogleButton = googleLoginRef.current?.querySelector('[role="button"]') as HTMLDivElement | null
    hiddenGoogleButton?.click()
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-white text-black dark:bg-black dark:text-white transition-colors">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-white to-blue-100/20 dark:from-emerald-900/20 dark:via-black dark:to-blue-900/20"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="relative bg-white/90 dark:bg-black/90 border border-black/10 dark:border-white/20 backdrop-blur-xl w-full max-w-md z-10 transition-colors">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-black dark:text-white" />
              </div>
              <h1 className="text-2xl font-bold">Interview Buddy</h1>
            </div>
            <CardTitle className="text-3xl font-bold text-black dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Sign in to continue your interview preparation journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-emerald-500/50 bg-emerald-500/10">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <AlertDescription className="text-emerald-700 dark:text-emerald-300">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/20 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link href="/auth/forgot-password" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/20 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-10 pr-10 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                  className="border-black/10 dark:border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10 dark:border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleButtonClick}
                  disabled={isLoading}
                  className="w-full border-black/10 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <div ref={googleLoginRef} className="absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      if (!isLoading) {
                        setError("Unable to sign in with Google right now. Please try again.")
                      }
                    }}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="signin_with"
                    width="180"
                  />
                </div>
              </div>
              <div title="Coming soon" className="cursor-not-allowed">
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  className="w-full border-black/10 dark:border-white/20 text-black dark:text-white opacity-50"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}
