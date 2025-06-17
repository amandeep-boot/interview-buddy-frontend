"use client"

import { useState, useEffect } from "react"
import type { ChatSession } from "@/types/chat"

export function useChatSessions() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  useEffect(() => {
    const savedSessions = localStorage.getItem("chat_sessions")
    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions))
    }
  }, [])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      resumeUploaded: false,
    }

    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    return newSession
  }

  return {
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
  }
}
