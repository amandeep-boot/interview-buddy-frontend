import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")

    if (!token) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const body = await request.json()
    const { query } = body

    const backendRes = await fetch("https://interview-buddy-backend.vercel.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json({ message: data.detail || "Chat request failed" }, { status: backendRes.status || 400 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
