import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split(".").pop()
  const name = `${Date.now()}.${ext}`
  const dir = path.join(process.cwd(), "public", "uploads")
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), buffer)

  return NextResponse.json({ url: `/uploads/${name}` })
}
