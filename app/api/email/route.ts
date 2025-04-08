import { NextResponse } from "next/server"

// Manejar cualquier solicitud a /api/email
export async function GET() {
  return NextResponse.json({ message: "La funcionalidad de email ha sido desactivada" }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ message: "La funcionalidad de email ha sido desactivada" }, { status: 404 })
}
