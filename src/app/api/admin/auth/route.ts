import { NextResponse } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(req: Request) {
  const { password } = await req.json()
  if (password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${Date.now()}:${ADMIN_PASSWORD}`).toString("base64")
    return NextResponse.json({ token })
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 })
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const decoded = Buffer.from(auth.slice(7), "base64").toString()
    const [, pwd] = decoded.split(":")
    if (pwd !== ADMIN_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
