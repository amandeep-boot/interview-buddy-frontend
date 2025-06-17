export const API_BASE_URL = "https://interview-buddy-backend.vercel.app"

export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/chat`,
  UPLOAD_RESUME: `${API_BASE_URL}/chat/upload/resume`,
  UPLOAD_JD: `${API_BASE_URL}/chat/upload/jd`,
} as const
