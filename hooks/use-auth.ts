"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/auth/login")
    }
  }, [router])

  const getToken = () => localStorage.getItem("access_token")
  return { getToken }
}
