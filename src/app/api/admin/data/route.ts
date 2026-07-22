import { NextRequest, NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/store"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return false
  try {
    const decoded = Buffer.from(auth.slice(7), "base64").toString()
    const [, pwd] = decoded.split(":")
    return pwd === ADMIN_PASSWORD
  } catch { return false }
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = readStore()
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const current = readStore()
  const merged = { ...current, ...body }
  writeStore(merged)
  return NextResponse.json({ ok: true })
}
