import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"

const requestsFile = path.join(process.cwd(), "data", "cv-requests.json")

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

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  const requests = await getRequests()
  requests.push({
    id: Date.now(),
    name,
    email,
    message: message || "",
    requestedAt: new Date().toISOString(),
  })
  await saveRequests(requests)

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const requests = await getRequests()
  return NextResponse.json(requests)
}
