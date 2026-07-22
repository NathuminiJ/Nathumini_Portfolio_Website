import { NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) return new Redis({ url, token })
  return null
}

const KEY = "cv_requests"

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return false
  const raw = auth.slice(7)
  if (raw === ADMIN_PASSWORD) return true
  try {
    const decoded = Buffer.from(raw, "base64").toString()
    const [, pwd] = decoded.split(":")
    return pwd === ADMIN_PASSWORD
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    message: message || "",
    requestedAt: new Date().toISOString(),
  }

  const redis = getRedis()
  if (redis) {
    const requests = (await redis.get<any[]>(KEY)) || []
    requests.push(entry)
    await redis.set(KEY, requests)
  } else {
    console.log("[CV Request] No UPSTASH_REDIS configured. Entry saved to log:", entry)
  }

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const redis = getRedis()
  if (redis) {
    const requests = (await redis.get<any[]>(KEY)) || []
    return NextResponse.json(requests)
  }

  return NextResponse.json([])
}
