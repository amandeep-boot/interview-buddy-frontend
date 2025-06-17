"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip } from "lucide-react"

interface ChatInputProps {
  inputMessage: string
  isLoading: boolean
  isTyping: boolean
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export function ChatInput({
  inputMessage,
  isLoading,
  isTyping,
  onInputChange,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) {
  return (
    <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="relative">
            <Input
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
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
          onClick={onSendMessage}
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
  )
}
