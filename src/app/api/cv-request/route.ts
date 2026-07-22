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

async function sendEmailNotification({ name, email, message }: { name: string; email: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log("[CV Request] No RESEND_API_KEY set. Skipping email notification.")
    return
  }

  const adminEmail = process.env.ADMIN_EMAIL || "nathuminijayathilake@outlook.com"
  const subject = `CV Request from ${name}`
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Message: ${message || "(none)"}`,
    `---`,
    `Sent from your portfolio CV request form.`,
  ].join("\n")

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Portfolio Contact <onboarding@resend.dev>`,
        to: adminEmail,
        subject,
        text: body,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error("[CV Request] Resend error:", err)
    } else {
      console.log("[CV Request] Email notification sent to", adminEmail)
    }
  } catch (err) {
    console.error("[CV Request] Failed to send email:", err)
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

  await sendEmailNotification({ name, email, message })

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
