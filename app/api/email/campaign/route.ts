// app/api/email/campaign/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Example usage of NextResponse
  return NextResponse.json({ message: "Hello from email campaign route!" })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, targetAudience, schedule, content } = body

    if (!name || !description || !targetAudience || !schedule || !content) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    // TODO: Save to database

    return NextResponse.json({ name, description, targetAudience, schedule, content })
  } catch (error) {
    console.log("[EMAIL_CAMPAIGN_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

