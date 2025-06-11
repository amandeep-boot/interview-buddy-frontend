import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const formBody = new URLSearchParams({
      grant_type: "password",
      username: email,
      password,
      scope: "",
      client_id: "string",
      client_secret: "string",
    })

    const backendRes = await fetch("https://interview-buddy-backend.vercel.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formBody.toString(),
    })

    const data = await backendRes.json()

    if (!backendRes.ok || !data.access_token) {
      return NextResponse.json({ message: data.detail || "Login failed" }, { status: backendRes.status || 401 })
    }

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
    })
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
