import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")

    if (!token) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const body = await request.json()

    const backendRes = await fetch("https://interview-buddy-backend.vercel.app/chat/upload/jd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.detail || "Job description upload failed" },
        { status: backendRes.status || 400 },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Job description upload error:", err)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
