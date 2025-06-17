"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/config/api"

export function useAIChat(getToken: () => string | null, simulateTyping: (response: string) => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const extractCleanResponse = (responseData: any): string => {
    if (typeof responseData === "string") {
      try {
        const parsed = JSON.parse(responseData)
        if (parsed && typeof parsed === "object") {
          return extractCleanResponse(parsed)
        }
        return responseData
      } catch (e) {
        return responseData
      }
    }

    if (responseData && typeof responseData === "object") {
      const possibleFields = ["response", "message", "answer", "content", "text", "data"]

      for (const field of possibleFields) {
        if (responseData[field]) {
          const fieldValue = responseData[field]

          if (typeof fieldValue === "string") {
            try {
              const parsed = JSON.parse(fieldValue)
              if (parsed && typeof parsed === "object") {
                return extractCleanResponse(parsed)
              }
              return fieldValue
            } catch (e) {
              return fieldValue
            }
          }

          if (typeof fieldValue === "object") {
            return extractCleanResponse(fieldValue)
          }

          return String(fieldValue)
        }
      }

      return JSON.stringify(responseData, null, 2)
    }

    return String(responseData)
  }

  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      })

      if (response.ok) {
        const data = await response.json()
        const responseText = extractCleanResponse(data)
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

  return { isLoading, generateAIResponse }
}
