"use client"

import { useState, useEffect, useRef } from "react"
import type { Message } from "@/types/chat"

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

    const typingMessage: Message = {
      id: "typing",
      type: "bot",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))
    addMessage("bot", response)
    setIsTyping(false)
  }

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content:
        "Hi! I'm your Interview Buddy AI. Upload your resume and provide a job description to get started with personalized interview questions.",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const resetChat = () => {
    setMessages([])
    initializeChat()
  }

  return {
    messages,
    setMessages,
    isTyping,
    messagesEndRef,
    addMessage,
    simulateTyping,
    initializeChat,
    resetChat,
  }
}
