"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/config/api"

export function useFileUpload(
  getToken: () => string | null,
  addMessage: (type: "user" | "bot", content: string) => void,
) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch(API_ENDPOINTS.UPLOAD_RESUME, {
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

  const uploadJobDescription = async (description: string) => {
    if (!description.trim()) return

    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch(API_ENDPOINTS.UPLOAD_JD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ job_description: description }),
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
      setJobDescription("")
      addMessage("user", `📋 Job description provided`)
      addMessage("bot", data.message || "Job description received! I can now generate tailored interview questions.")
    } catch (error) {
      console.error("Job description upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload job description. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    resumeFile,
    setResumeFile,
    jobDescription,
    setJobDescription,
    isLoading,
    handleFileUpload,
    uploadJobDescription,
  }
}
