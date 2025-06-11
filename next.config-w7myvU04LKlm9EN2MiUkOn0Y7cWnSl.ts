import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/signup',
        destination: 'https://interview-buddy-backend.vercel.app/auth/signup',
      },
      {
        source: '/api/auth/login',
        destination: 'https://interview-buddy-backend.vercel.app/auth/login',
      },
      {
        source: '/api/chat',
        destination: 'https://interview-buddy-backend.vercel.app/chat',
      },
      {
        source: '/api/chat/upload/resume',
        destination: 'https://interview-buddy-backend.vercel.app/chat/upload/resume',
      },
      {
        source: '/api/chat/upload/jd',
        destination: 'https://interview-buddy-backend.vercel.app/chat/upload/jd',
      },
    ]
  },
}

export default nextConfig
