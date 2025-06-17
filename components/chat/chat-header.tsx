"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, ArrowLeft, Sparkles, MessageCircle } from "lucide-react"

interface ChatHeaderProps {
  onNewChat: () => void
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
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
            onClick={onNewChat}
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
  )
}
