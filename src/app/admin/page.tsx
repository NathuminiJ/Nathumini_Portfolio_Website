"use client"

import { useState, useEffect, useCallback } from "react"

type StoreData = {
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

const SECTIONS = ["Profile", "Projects", "Experience", "Education", "Skills", "Certifications", "Achievements", "Volunteering", "Articles", "CV Requests"] as const

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const { token } = await res.json()
      localStorage.setItem("admin_token", token)
      onLogin(token)
    } else {
      setError("Invalid password")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-[rgba(212,165,85,0.1)] bg-[rgba(22,22,32,0.4)] p-8 backdrop-blur-2xl">
        <h1 className="mb-2 text-center text-xl font-bold text-white">Admin Login</h1>
        <p className="mb-6 text-center text-xs text-[#8a8a9a]">Enter your password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-3 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-sm text-white placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/40"
          autoFocus
        />
        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-[#d4a555] px-4 py-2.5 text-sm font-medium text-[#0a0a0f] transition-colors hover:bg-[#e0b96a]">Login</button>
      </form>
    </div>
  )
}

function Input({ label, value, onChange, multiline, type }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string }) {
  const cls = "w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-white placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/40"
  return (
    <div>
      <label className="mb-1 block text-xs text-[#8a8a9a]">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={cls} />
      ) : (
        <input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  )
}

function ImagesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (res.ok) {
      const { url } = await res.json()
      onChange([...value, url])
    }
    setUploading(false)
  }
  const updateUrl = (i: number, url: string) => {
    const next = [...value]; next[i] = url; onChange(next)
  }
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))

  return (
    <div>
      <label className="mb-1 block text-xs text-[#8a8a9a]">Images</label>
      {value.length > 0 && (
        <div className="mb-2 grid grid-cols-3 gap-1.5">
          {value.map((url, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]">
              <img src={url} alt="" className="h-20 w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => remove(i)} className="rounded bg-red-500/60 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-500">x</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1.5">
        {value.map((url, i) => (
          <div key={i} className="flex gap-1.5">
            <input type="text" value={url} onChange={(e) => updateUrl(i, e.target.value)} placeholder="Image URL" className="flex-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-white placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/40" />
            <button onClick={() => remove(i)} className="rounded-lg bg-red-500/20 px-2.5 text-xs text-red-400 hover:bg-red-500/30">x</button>
          </div>
        ))}
        <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] px-3 py-2 text-xs text-[#5a5a6a] hover:border-[#d4a555]/30 hover:text-[#d4a555]">
          {uploading ? "Uploading..." : "+ Add Image"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
    </div>
  )
}

function DocumentsInput({ value, onChange }: { value: { label: string; url: string }[]; onChange: (v: { label: string; url: string }[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (res.ok) {
      const { url } = await res.json()
      const label = file.name.replace(/\.[^/.]+$/, "")
      onChange([...value, { label, url }])
    }
    setUploading(false)
  }
  const updateLabel = (i: number, label: string) => {
    const next = [...value]; next[i] = { ...next[i], label }; onChange(next)
  }
  const updateUrl = (i: number, url: string) => {
    const next = [...value]; next[i] = { ...next[i], url }; onChange(next)
  }
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))
  const addBlank = () => onChange([...value, { label: "", url: "" }])

  return (
    <div>
      <label className="mb-1 block text-xs text-[#8a8a9a]">Documents (PDF, Reports, Presentations)</label>
      <div className="space-y-2">
        {value.map((doc, i) => (
          <div key={i} className="flex gap-1.5 items-start">
            <div className="flex-1 space-y-1">
              <input type="text" value={doc.label} onChange={(e) => updateLabel(i, e.target.value)} placeholder="Display name" className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-white placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/40" />
              <input type="text" value={doc.url} onChange={(e) => updateUrl(i, e.target.value)} placeholder="Document URL" className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-white placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/40" />
            </div>
            <button onClick={() => remove(i)} className="rounded-lg bg-red-500/20 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/30">x</button>
          </div>
        ))}
        <div className="flex gap-1.5">
          <button onClick={addBlank} className="flex-1 rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] px-3 py-2 text-xs text-[#5a5a6a] hover:border-[#d4a555]/30 hover:text-[#d4a555]">+ Add Link</button>
          <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] px-3 py-2 text-xs text-[#5a5a6a] hover:border-[#d4a555]/30 hover:text-[#d4a555]">
            {uploading ? "..." : "+ Upload File"}
            <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt,.zip" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}

function EditableList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const add = () => onChange([...items, ""])
  const update = (i: number, v: string) => {
    const next = [...items]; next[i] = v; onChange(next)
  }
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5">
          <input value={item} onChange={(e) => update(i, e.target.value)} className="flex-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-white outline-none focus:border-[#d4a555]/40" />
          <button onClick={() => remove(i)} className="rounded-lg bg-red-500/20 px-2.5 text-xs text-red-400 hover:bg-red-500/30">x</button>
        </div>
      ))}
      <button onClick={add} className="rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] px-3 py-1.5 text-xs text-[#5a5a6a] hover:border-[#d4a555]/30 hover:text-[#d4a555]">+ Add</button>
    </div>
  )
}

function ObjectArrayEditor({ items, fields, onChange }: { items: any[]; fields: { key: string; label: string; multiline?: boolean; type?: string }[]; onChange: (items: any[]) => void }) {
  const update = (i: number, key: string, value: any) => {
    const next = [...items]; next[i] = { ...next[i], [key]: value }; onChange(next)
  }
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const add = () => {
    const obj: any = {}
    fields.forEach((f) => { obj[f.key] = f.key === "technologies" || f.key === "tags" || f.key === "skills" || f.key === "highlights" || f.key === "images" || f.key === "documents" ? [] : "" })
    if (items.length > 0) obj.id = Math.max(...items.map((x) => x.id || 0)) + 1
    onChange([...items, obj])
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-[#5a5a6a]">Item {i + 1}</span>
            <button onClick={() => remove(i)} className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400 hover:bg-red-500/30">Delete</button>
          </div>
          <div className="space-y-2.5">
            {fields.map((f) => {
              if (f.type === "images") {
                return <ImagesInput key={f.key} value={item[f.key] || []} onChange={(v) => update(i, f.key, v)} />
              }
              if (f.key === "documents") {
                return <DocumentsInput key={f.key} value={item[f.key] || []} onChange={(v) => update(i, f.key, v)} />
              }
              if (f.key === "technologies" || f.key === "skills" || f.key === "tags" || f.key === "highlights") {
                return <div key={f.key}>
                  <label className="mb-1 block text-xs text-[#8a8a9a]">{f.label}</label>
                  <EditableList items={item[f.key] || []} onChange={(v) => update(i, f.key, v)} />
                </div>
              }
              return <Input key={f.key} label={f.label} value={item[f.key] || ""} onChange={(v) => update(i, f.key, v)} multiline={f.multiline} type={f.type} />
            })}
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] py-3 text-xs text-[#5a5a6a] hover:border-[#d4a555]/30 hover:text-[#d4a555]">+ Add New</button>
    </div>
  )
}

function CVRequests() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null

  useEffect(() => {
    if (!token) return
    fetch("/api/cv-request", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setRequests(data))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <p className="text-xs text-[#5a5a6a]">Loading...</p>
  if (requests.length === 0) return <p className="text-xs text-[#5a5a6a]">No CV requests yet.</p>

  return (
    <div className="space-y-2">
      {requests.map((r) => (
        <div key={r.id} className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-white">{r.name}</span>
            <span className="font-mono text-[10px] text-[#5a5a6a]">{new Date(r.requestedAt).toLocaleDateString()}</span>
          </div>
          <a href={`mailto:${r.email}`} className="text-xs text-[#d4a555]/60 hover:text-[#d4a555]">{r.email}</a>
          {r.message && <p className="mt-1 text-xs text-[#8a8a9a]">{r.message}</p>}
        </div>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [tab, setTab] = useState<string>("Profile")
  const [data, setData] = useState<StoreData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem("admin_token")
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return
    fetch("/api/admin/data", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => setData(d))
      .catch(() => { localStorage.removeItem("admin_token"); setToken(null) })
  }, [token])

  const handleSave = useCallback(async () => {
    if (!data || !token) return
    setSaving(true)
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    setSaving(false)
  }, [data, token])

  const updateSection = (section: string, value: any) => {
    if (!data) return
    const key = section.charAt(0).toLowerCase() + section.slice(1)
    setData({ ...data, [key]: value })
  }

  if (!token) return <LoginForm onLogin={setToken} />
  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-sm text-[#5a5a6a]">Loading...</div>
    </div>
  )

  const sectionKey = tab.charAt(0).toLowerCase() + tab.slice(1)
  const sectionData = (data as any)[sectionKey]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.04)] bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-[#d4a555]">Admin</h1>
            <a href="/" className="text-xs text-[#5a5a6a] hover:text-[#8a8a9a]" target="_blank">View Site</a>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-green-500">Saved!</span>}
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[#d4a555] px-4 py-1.5 text-xs font-medium text-[#0a0a0f] transition-colors hover:bg-[#e0b96a] disabled:opacity-50">
              {saving ? "Saving..." : "Save All"}
            </button>
            <button onClick={() => { localStorage.removeItem("admin_token"); setToken(null) }} className="text-xs text-[#5a5a6a] hover:text-red-400">Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl px-6 py-6 gap-6">
        <nav className="w-44 flex-shrink-0">
          <div className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button key={s} onClick={() => setTab(s)} className={`block w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${tab === s ? "bg-[#d4a555]/10 text-[#d4a555]" : "text-[#5a5a6a] hover:text-[#8a8a9a]"}`}>
                {s}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1">
          <h2 className="mb-5 text-lg font-bold text-white">{tab}</h2>

          {tab === "Profile" && (
            <div className="space-y-4">
              <Input label="Name" value={data.profile.name} onChange={(v) => setData({ ...data, profile: { ...data.profile, name: v } })} />
              <Input label="Headline" value={data.profile.headline} onChange={(v) => setData({ ...data, profile: { ...data.profile, headline: v } })} />
              <Input label="Email" value={data.profile.social.email} onChange={(v) => setData({ ...data, profile: { ...data.profile, social: { ...data.profile.social, email: v } } })} />
              <Input label="LinkedIn URL" value={data.profile.social.linkedin} onChange={(v) => setData({ ...data, profile: { ...data.profile, social: { ...data.profile.social, linkedin: v } } })} />
              <Input label="GitHub URL" value={data.profile.social.github} onChange={(v) => setData({ ...data, profile: { ...data.profile, social: { ...data.profile.social, github: v } } })} />
              <Input label="City" value={data.profile.location.city} onChange={(v) => setData({ ...data, profile: { ...data.profile, location: { ...data.profile.location, city: v } } })} />
              <Input label="Country" value={data.profile.location.country} onChange={(v) => setData({ ...data, profile: { ...data.profile, location: { ...data.profile.location, country: v } } })} />
              <Input label="University" value={data.profile.university.name} onChange={(v) => setData({ ...data, profile: { ...data.profile, university: { ...data.profile.university, name: v } } })} />
              <Input label="Institute" value={data.profile.university.institute} onChange={(v) => setData({ ...data, profile: { ...data.profile, university: { ...data.profile.university, institute: v } } })} />
              <Input label="Currently (live status)" value={data.profile.currently || ""} onChange={(v) => setData({ ...data, profile: { ...data.profile, currently: v } })} />
              <Input label="About" value={data.profile.about} onChange={(v) => setData({ ...data, profile: { ...data.profile, about: v } })} multiline />
              <div>
                <label className="mb-1 block text-xs text-[#8a8a9a]">Roles (typewriter display)</label>
                <EditableList items={data.profile.roles} onChange={(v) => setData({ ...data, profile: { ...data.profile, roles: v } })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[#8a8a9a]">Journey Timeline</label>
                <ObjectArrayEditor
                  items={data.profile.aboutJourney}
                  fields={[
                    { key: "year", label: "Year" },
                    { key: "title", label: "Title" },
                    { key: "description", label: "Description", multiline: true },
                  ]}
                  onChange={(v) => setData({ ...data, profile: { ...data.profile, aboutJourney: v } })}
                />
              </div>
            </div>
          )}

          {tab === "Projects" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "images", label: "Images", type: "images" },
                { key: "documents", label: "Documents" },
                { key: "shortTitle", label: "Short Title" },
                { key: "title", label: "Full Title" },
                { key: "description", label: "Short Description" },
                { key: "details", label: "Details", multiline: true },
                { key: "period", label: "Period (e.g. Jan 2024 - Dec 2024)" },
                { key: "category", label: "Category" },
                { key: "link", label: "Project URL (optional)" },
                { key: "technologies", label: "Technologies" },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "Experience" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "image", label: "Organization Logo URL" },
                { key: "role", label: "Role" },
                { key: "organization", label: "Organization" },
                { key: "employmentType", label: "Employment Type (e.g. Full-time, On-site)" },
                { key: "location", label: "Location" },
                { key: "period", label: "Period (e.g. Sep 2025 - Present)" },
                { key: "description", label: "Description", multiline: true },
                { key: "skills", label: "Skills" },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "Education" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "degree", label: "Degree" },
                { key: "university", label: "School / University" },
                { key: "institute", label: "Institute (optional)" },
                { key: "period", label: "Period" },
                { key: "grade", label: "Grade (optional)" },
                { key: "activities", label: "Activities and Societies", multiline: true },
                { key: "description", label: "Description", multiline: true },
                { key: "highlights", label: "Highlights" },
                { key: "skills", label: "Skills" },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "Skills" && (
            <div>
              <label className="mb-1 block text-xs text-[#8a8a9a]">Skills (type each skill name)</label>
              <EditableList items={sectionData} onChange={(v) => updateSection(tab, v)} />
              <p className="mt-2 text-[10px] text-[#5a5a6a]">Skills shown on the site are grouped into categories (Data & Analytics, Web & Mobile, Tools & Methods). Add all skills here; the site groups them automatically.</p>
            </div>
          )}

          {tab === "Certifications" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "name", label: "Certification Name" },
                { key: "issuer", label: "Issuer" },
                { key: "link", label: "Credential URL (optional)" },
                { key: "year", label: "Year" },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "Achievements" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "title", label: "Title" },
                { key: "event", label: "Event" },
                { key: "year", label: "Year" },
                { key: "description", label: "Description", multiline: true },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "Volunteering" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "organization", label: "Organization" },
                { key: "role", label: "Role" },
                { key: "period", label: "Period" },
                { key: "description", label: "Description", multiline: true },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "Articles" && (
            <ObjectArrayEditor
              items={sectionData}
              fields={[
                { key: "title", label: "Title" },
                { key: "date", label: "Date" },
                { key: "excerpt", label: "Excerpt", multiline: true },
                { key: "link", label: "Article URL (optional)" },
                { key: "tags", label: "Tags" },
              ]}
              onChange={(v) => updateSection(tab, v)}
            />
          )}

          {tab === "CV Requests" && <CVRequests />}
        </main>
      </div>
    </div>
  )
}
