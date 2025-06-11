import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Send only email and password to the backend
    const requestBody = {
      email,
      password,
    }

    const backendRes = await fetch("https://interview-buddy-backend.vercel.app/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json({ message: data.detail || "Signup failed" }, { status: backendRes.status || 400 })
    }

    return NextResponse.json({
      message: data.message || "User registered successfully.",
    })
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
