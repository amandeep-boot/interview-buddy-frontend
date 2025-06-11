"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Send,
  Upload,
  FileText,
  User,
  ArrowLeft,
  Paperclip,
  Copy,
  RefreshCw,
  Sparkles,
  MessageCircle,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  resumeUploaded: boolean
  jobDescription?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [showUploadPanel, setShowUploadPanel] = useState(true)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content:
        "Hi! I'm your Interview Buddy AI. Upload your resume and provide a job description to get started with personalized interview questions.",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])

    // Load chat sessions from localStorage
    const savedSessions = localStorage.getItem("chat_sessions")
    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions))
    }
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size must be less than 10MB")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch("https://interview-buddy-backend.vercel.app/chat/upload/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to upload resume"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Upload failed with status: ${response.status} - ${errorText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setResumeFile(file)
      addMessage("user", `📄 Uploaded resume: ${file.name}`)
      addMessage("bot", data.message || "Resume uploaded successfully! I can now analyze your background.")
    } catch (error) {
      console.error("Resume upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to upload resume. Please try again."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const addMessage = (type: "user" | "bot", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = async (response: string) => {
    setIsTyping(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: "typing",
      type: "bot",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Remove typing indicator and add actual response
    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))
    addMessage("bot", response)
    setIsTyping(false)
  }

  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch("https://interview-buddy-backend.vercel.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        console.log("Raw response data:", data) // Debug log

        // Function to extract clean response from various formats
        const extractCleanResponse = (responseData: any): string => {
          // If responseData is a string, try to parse it as JSON first
          if (typeof responseData === "string") {
            try {
              const parsed = JSON.parse(responseData)
              if (parsed && typeof parsed === "object") {
                return extractCleanResponse(parsed)
              }
              // If it's just a plain string, return it
              return responseData
            } catch (e) {
              // If parsing fails, it's probably just a plain string
              return responseData
            }
          }

          // If responseData is an object
          if (responseData && typeof responseData === "object") {
            // Check for common response fields in order of preference
            const possibleFields = ["response", "message", "answer", "content", "text", "data"]

            for (const field of possibleFields) {
              if (responseData[field]) {
                const fieldValue = responseData[field]

                // If the field value is a string, check if it contains JSON
                if (typeof fieldValue === "string") {
                  // Try to parse as JSON first
                  try {
                    const parsed = JSON.parse(fieldValue)
                    if (parsed && typeof parsed === "object") {
                      return extractCleanResponse(parsed)
                    }
                    // If not JSON, return the string as-is
                    return fieldValue
                  } catch (e) {
                    // If parsing fails, return the string as-is
                    return fieldValue
                  }
                }

                // If the field value is an object, recursively extract
                if (typeof fieldValue === "object") {
                  return extractCleanResponse(fieldValue)
                }

                // For other types, convert to string
                return String(fieldValue)
              }
            }

            // If no common fields found, try to stringify the object
            return JSON.stringify(responseData, null, 2)
          }

          // Fallback for other types
          return String(responseData)
        }

        const responseText = extractCleanResponse(data)
        console.log("Extracted response:", responseText) // Debug log

        await simulateTyping(responseText)
      } else {
        const errorText = await response.text()
        let errorMessage = "I apologize, but I'm having trouble generating a response right now."

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Error: ${response.status} - ${errorText}`
        }

        await simulateTyping(errorMessage)
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      await simulateTyping(
        "I apologize, but I'm having trouble connecting to the server. Please check your connection and try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setInputMessage("")
    addMessage("user", userMessage)

    await generateAIResponse(userMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      resumeUploaded: false,
    }

    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setResumeFile(null)
    setJobDescription("")
    setShowUploadPanel(true)

    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome-new",
      type: "bot",
      content:
        "Hi! I'm ready to help you with a new interview preparation session. Upload your resume and provide a job description to get started.",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  const uploadJobDescription = async (description: string) => {
    if (!description.trim()) return

    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch("https://interview-buddy-backend.vercel.app/chat/upload/jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          job_description: description,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to upload job description"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Upload failed with status: ${response.status}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setJobDescription("") // Clear the textarea after successful upload
      addMessage("user", `📋 Job description provided`)
      addMessage("bot", data.message || "Job description received! I can now generate tailored interview questions.")
    } catch (error) {
      console.error("Job description upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload job description. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Interview Buddy AI</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Groq AI
            </Badge>
            <Button
              onClick={startNewChat}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 bg-black/30 backdrop-blur-xl p-4 overflow-y-auto">
          {/* Upload Panel */}
          {showUploadPanel && (
            <Card className="mb-6 bg-white/5 border border-white/10 backdrop-blur-xl">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm text-emerald-400 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Setup Interview Session
                </h3>

                {/* Resume Upload */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-300">Resume (PDF)</label>
                  <div
                    onClick={() => !isLoading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed ${
                      isLoading
                        ? "border-gray-500 cursor-not-allowed"
                        : "border-white/20 cursor-pointer hover:border-emerald-400/50"
                    } rounded-lg p-4 text-center transition-colors group`}
                  >
                    {resumeFile ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs">{resumeFile.name}</span>
                      </div>
                    ) : isLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-2"></div>
                        <p className="text-xs text-gray-400">Processing...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        <p className="text-xs text-gray-400 group-hover:text-gray-300">Click to upload resume</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-300">Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isLoading}
                    className={`min-h-[80px] bg-white/5 border-white/20 text-white placeholder:text-gray-500 text-xs resize-none ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <Button
                    onClick={() => uploadJobDescription(jobDescription)}
                    disabled={!jobDescription.trim() || isLoading}
                    size="sm"
                    variant="outline"
                    className="mt-2 text-xs border-white/20 hover:bg-white/10"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>Submit Job Description</>
                    )}
                  </Button>
                </div>

                {resumeFile && jobDescription && (
                  <Button
                    onClick={() => setShowUploadPanel(false)}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-xs ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Start Interview Prep
                    <Sparkles className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Chat Sessions */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Recent Chats</h3>
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <Card
                  key={session.id}
                  className={`bg-white/5 border border-white/10 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition-all ${
                    currentSessionId === session.id ? "border-emerald-400/50" : ""
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{session.title}</h4>
                        <p className="text-xs text-gray-400">{session.createdAt.toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "bot" ? "bg-gradient-to-r from-emerald-400 to-blue-500" : "bg-blue-500"
                  }`}
                >
                  {message.type === "bot" ? (
                    <Bot className="w-4 h-4 text-black" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`max-w-2xl ${message.type === "user" ? "ml-auto" : "mr-auto"}`}>
                  <Card
                    className={`${
                      message.type === "bot" ? "bg-white/5 border-white/10" : "bg-emerald-500/20 border-emerald-400/30"
                    } backdrop-blur-xl`}
                  >
                    <CardContent className="p-4">
                      {message.isTyping ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-sm text-gray-400">AI is thinking...</span>
                        </div>
                      ) : (
                        <>
                          <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {message.type === "bot" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about interview preparation..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 pr-12 py-3 resize-none"
                    disabled={isLoading || isTyping}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || isTyping}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 px-4 py-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>Press Enter to send, Shift + Enter for new line</span>
              <span>Powered by Groq AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
