"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, Copy, RefreshCw } from "lucide-react"
import type { Message } from "@/types/chat"
import { TypingIndicator } from "./typing-indicator"

interface MessageBubbleProps {
  message: Message
  onCopy: (content: string) => void
}

export function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  return (
    <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.type === "bot" ? "bg-gradient-to-r from-emerald-400 to-blue-500" : "bg-blue-500"
        }`}
      >
        {message.type === "bot" ? <Bot className="w-4 h-4 text-black" /> : <User className="w-4 h-4 text-white" />}
      </div>

      <div className={`max-w-2xl ${message.type === "user" ? "ml-auto" : "mr-auto"}`}>
        <Card
          className={`${
            message.type === "bot" ? "bg-white/5 border-white/10" : "bg-emerald-500/20 border-emerald-400/30"
          } backdrop-blur-xl`}
        >
          <CardContent className="p-4">
            {message.isTyping ? (
              <TypingIndicator />
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
                      onClick={() => onCopy(message.content)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {message.type === "bot" && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
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
  )
}
