"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bot, LogOut, User, Calendar, MessageCircle, Target, ArrowRight } from "lucide-react"

interface UserSession {
  username: string
  token_type: string
  expires_in?: number
  login_time: number
  remember_me: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token")
    const sessionData = localStorage.getItem("user_session")

    if (!token || !sessionData) {
      router.push("/auth/login")
      return
    }

    try {
      const session = JSON.parse(sessionData) as UserSession
      setUserSession(session)
    } catch (error) {
      console.error("Error parsing session data:", error)
      router.push("/auth/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_session")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!userSession) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold">Interview Buddy</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {userSession.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Ready to practice your interview skills?</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle>Start Interview Chat</CardTitle>
              <CardDescription>Begin a new AI-powered interview session with personalized questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 group">
                  Start Chat
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Practice History</CardTitle>
              <CardDescription>Review your previous interview sessions and track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                View History
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your profile, preferences, and interview goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Session Info */}
        <Card className="mt-8 bg-white/5 border border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Username:</span>
                <span className="ml-2 text-white">{userSession.username}</span>
              </div>
              <div>
                <span className="text-gray-400">Login Time:</span>
                <span className="ml-2 text-white">{new Date(userSession.login_time).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Token Type:</span>
                <span className="ml-2 text-white">{userSession.token_type}</span>
              </div>
              <div>
                <span className="text-gray-400">Remember Me:</span>
                <span className="ml-2 text-white">{userSession.remember_me ? "Yes" : "No"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-emerald-400">🚀 Quick Start</CardTitle>
              <CardDescription>Jump right into an interview session with our AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                  Start Interview Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-400">📚 Learn More</CardTitle>
              <CardDescription>Explore tips and strategies for successful interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10">
                View Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
