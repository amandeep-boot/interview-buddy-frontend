"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useMessages } from "@/hooks/use-messages"
import { useChatSessions } from "@/hooks/use-chat-sessions"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useAIChat } from "@/hooks/use-ai-chat"
import { ChatHeader } from "@/components/chat/chat-header"
import { UploadPanel } from "@/components/chat/upload-panel"
import { ChatSessionList } from "@/components/chat/chat-session-list"
import { MessageBubble } from "@/components/chat/message-bubble"
import { ChatInput } from "@/components/chat/chat-input"

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState("")
  const [showUploadPanel, setShowUploadPanel] = useState(true)

  // Custom hooks
  const { getToken } = useAuth()
  const { messages, isTyping, messagesEndRef, addMessage, simulateTyping, initializeChat, resetChat } = useMessages()
  const { chatSessions, currentSessionId, setCurrentSessionId, createNewSession } = useChatSessions()
  const {
    resumeFile,
    setResumeFile,
    jobDescription,
    setJobDescription,
    isLoading: uploadLoading,
    handleFileUpload,
    uploadJobDescription,
  } = useFileUpload(getToken, addMessage)
  const { isLoading: chatLoading, generateAIResponse } = useAIChat(getToken, simulateTyping)

  // Initialize chat on mount
  useEffect(() => {
    initializeChat()
  }, [])

  // Event handlers
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

  const handleNewChat = () => {
    createNewSession()
    resetChat()
    setResumeFile(null)
    setJobDescription("")
    setShowUploadPanel(true)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const isLoading = chatLoading || uploadLoading

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <ChatHeader onNewChat={handleNewChat} />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 bg-black/30 backdrop-blur-xl p-4 overflow-y-auto">
          {showUploadPanel && (
            <UploadPanel
              resumeFile={resumeFile}
              jobDescription={jobDescription}
              isLoading={isLoading}
              onFileUpload={handleFileUpload}
              onJobDescriptionChange={setJobDescription}
              onJobDescriptionSubmit={() => uploadJobDescription(jobDescription)}
              onStartInterview={() => setShowUploadPanel(false)}
            />
          )}

          <ChatSessionList
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSessionSelect={setCurrentSessionId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onCopy={copyMessage} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            inputMessage={inputMessage}
            isLoading={isLoading}
            isTyping={isTyping}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  )
}
