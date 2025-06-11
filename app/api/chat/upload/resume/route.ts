import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")

    if (!token) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    // Log the request for debugging
    console.log("Resume upload request received")

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    console.log("File received:", file.name, file.type, file.size)

    // Create a new FormData to forward to the backend
    const forwardFormData = new FormData()
    forwardFormData.append("file", file)

    const backendRes = await fetch("https://interview-buddy-backend.vercel.app/chat/upload/resume", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: forwardFormData,
    })

    // Get the response as text first for debugging
    const responseText = await backendRes.text()
    console.log("Backend response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse backend response as JSON:", e)
      return NextResponse.json({ message: "Invalid response from backend server" }, { status: 502 })
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.detail || "Resume upload failed", error: data },
        { status: backendRes.status || 400 },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Resume upload error:", err)
    return NextResponse.json({ message: err instanceof Error ? err.message : "Invalid request" }, { status: 500 })
  }
}
