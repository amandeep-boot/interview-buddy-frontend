import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Interview Buddy",
  description: "An AI-powered interview preparation platform that acts as AI chatbot, resume analyzer, and interview coach.",
  keywords: [
    "AI interview preparation",
    "AI chatbot",
    "resume analyzer",
    "interview coach",
    "mock interviews",
    "job interview practice",
    "AI resume feedback",
    "interview tips",
    "AI career coach",
    "AI job preparation",
    "AI interview simulator",
    "AI interview assistant",
    "AI interview questions",
    "AI interview feedback",
    "AI interview training",
    "AI interview practice",
    "AI interview skills",
    "AI interview techniques",
    "AI interview strategies",
    "AI interview guidance",
    "AI interview support",
    "AI interview analysis",
    "AI interview performance", 
  ],
  authors: [
    {
      name: "Interview Buddy Team", 
      url: "https://github.com/amandeep-boot/interview-buddy",
    },],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
