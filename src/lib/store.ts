import fs from "fs"
import path from "path"

const storePath = path.join(process.cwd(), "src", "data", "store.json")

export type StoreData = {
  profile: any
  projects: any[]
  experience: any[]
  education: any[]
  skills: string[]
  certifications: any[]
  achievements: any[]
  volunteering: any[]
  articles: any[]
}

export function readStore(): StoreData {
  const raw = fs.readFileSync(storePath, "utf-8")
  return JSON.parse(raw)
}

export function writeStore(data: StoreData) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf-8")
}
