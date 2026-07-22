import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"

const requestsFile = path.join(process.cwd(), "data", "cv-requests.json")
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

async function getRequests(): Promise<any[]> {
  try {
    const data = await readFile(requestsFile, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveRequests(requests: any[]) {
  await mkdir(path.dirname(requestsFile), { recursive: true })
  await writeFile(requestsFile, JSON.stringify(requests, null, 2))
}

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

  const requests = await getRequests()
  requests.push(entry)
  await saveRequests(requests).catch(() => {})

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const requests = await getRequests()
  return NextResponse.json(requests)
}
