"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  FileText,
  Zap,
  Upload,
  MessageCircle,
  Target,
  Github,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Users,
  Clock,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function Page() {
  const [displayedText, setDisplayedText] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const typewriterText = "Interview Excellence, Powered by AI"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < typewriterText.length) {
        setDisplayedText(typewriterText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: Target,
      title: "AI Question Generation",
      description:
        "Generate tailored interview questions based on your resume and job description with advanced AI analysis.",
      stat: "10K+",
      statLabel: "Questions Generated",
    },
    {
      icon: Zap,
      title: "Lightning Fast Analysis",
      description:
        "Get instant results powered by Groq's ultra-fast inference engine for real-time question generation.",
      stat: "98.7%",
      statLabel: "Accuracy Rate",
    },
    {
      icon: Bot,
      title: "Smart Interview Coach",
      description:
        "Interactive AI chatbot that adapts to your experience level and provides personalized interview preparation.",
      stat: "15,000+",
      statLabel: "Success Stories",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-blue-900/20"></div>

        {/* Floating Orbs */}
        <div
          className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
          }}
        ></div>
        <div
          className="absolute w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: `${mousePosition.x * 0.01}px`,
            bottom: `${mousePosition.y * 0.01}px`,
          }}
        ></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold">Interview Buddy</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Services
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <Link href="/auth/login">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
            {displayedText}
            <span className="animate-pulse text-emerald-400">|</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Advanced AI interview assistant trained on thousands of real interviews. Get instant tailored questions,
            expert analysis, and personalized coaching to strengthen your interview strategy.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Start Interview Prep
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Powerful Interview Features</h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              Comprehensive AI-powered interview tools designed to enhance your preparation capabilities and streamline
              your interview success. All features are completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-emerald-400/50 group cursor-pointer"
              >
                <CardHeader className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                      <feature.icon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">{feature.stat}</div>
                      <div className="text-sm text-gray-400">{feature.statLabel}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">See It In Action</h2>
            <p className="text-xl text-gray-400">Experience the power of AI-driven interview preparation</p>
          </div>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                {/* Input Section */}
                <div className="p-8 border-r border-white/10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Upload className="w-6 h-6 text-emerald-400" />
                    Upload & Analyze
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Resume Upload</label>
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-emerald-400/50 transition-colors cursor-pointer group">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        <p className="text-gray-400 group-hover:text-gray-300">
                          Drop your resume here or click to upload
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Job Description</label>
                      <Textarea
                        placeholder="Paste the job description here..."
                        className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-emerald-400/50"
                        defaultValue="Senior React Developer at Google - 5+ years experience required with expertise in modern React patterns, state management, and performance optimization..."
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3">
                      Generate Questions
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Output Section */}
                <div className="p-8 bg-gradient-to-br from-white/5 to-transparent">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Bot className="w-6 h-6 text-emerald-400" />
                    AI Generated Questions
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 mb-2">
                            Based on your React experience and the Google role:
                          </p>
                          <div className="space-y-2 text-white">
                            <p>• How would you optimize a React application with 10,000+ components?</p>
                            <p>• Explain your approach to state management in large-scale applications.</p>
                            <p>• Describe how you would implement code splitting and lazy loading.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Insight: Focus on performance optimization and scalability</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50K+", label: "Questions Generated", icon: MessageCircle },
              { number: "2,500+", label: "Success Stories", icon: Users },
              { number: "<1s", label: "Response Time", icon: Clock },
              { number: "4.9★", label: "User Rating", icon: Star },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/5 border border-white/10 backdrop-blur-xl text-center hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold mb-6">Ready to Ace Your Interview?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of professionals who have transformed their interview performance with AI-powered
            preparation.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full"
            >
              <Github className="w-5 h-5 mr-2" />
              View Source
            </Button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Interview Buddy</span>
            </div>
            <div className="flex items-center gap-8 text-gray-400">
              <a
                href="https://interview-buddy-backend.vercel.app/docs"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                API Docs
              </a>
              <a
                href="https://github.com/amandeep-boot/interview-buddy-backend"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            © 2024 Interview Buddy. Powered by Groq AI • Built with Next.js and shadcn/ui.
          </div>
        </div>
      </footer>
    </div>
  )
}
