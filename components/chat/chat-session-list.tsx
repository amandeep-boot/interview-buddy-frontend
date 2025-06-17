"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import type { ChatSession } from "@/types/chat"

interface ChatSessionListProps {
  sessions: ChatSession[]
  currentSessionId: string | null
  onSessionSelect: (sessionId: string) => void
}

export function ChatSessionList({ sessions, currentSessionId, onSessionSelect }: ChatSessionListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-gray-300">Recent Chats</h3>
      <div className="space-y-2">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className={`bg-white/5 border border-white/10 backdrop-blur-xl cursor-pointer hover:bg-white/10 transition-all ${
              currentSessionId === session.id ? "border-emerald-400/50" : ""
            }`}
            onClick={() => onSessionSelect(session.id)}
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
  )
}
