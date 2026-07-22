"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, ExternalLink, Mail, Terminal, User, Briefcase, GraduationCap, Cpu, Award, Heart, FileText, BookOpen, Star } from "lucide-react"
import { profile } from "@/data/profile-data"

type Action = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

const actions: Action[] = [
  { id: "about", label: "About", description: "Journey & bio", icon: <User size={14} />, action: () => scrollTo("about") },
  { id: "projects", label: "Projects", description: "Featured work", icon: <Star size={14} />, action: () => scrollTo("projects") },
  { id: "experience", label: "Experience", description: "Professional background", icon: <Briefcase size={14} />, action: () => scrollTo("experience") },
  { id: "education", label: "Education", description: "Academic foundation", icon: <GraduationCap size={14} />, action: () => scrollTo("education") },
  { id: "skills", label: "Skills", description: "Technologies & tools", icon: <Cpu size={14} />, action: () => scrollTo("skills") },
  { id: "certifications", label: "Certifications", description: "Credentials", icon: <Award size={14} />, action: () => scrollTo("certifications") },
  { id: "achievements", label: "Achievements", description: "Awards & recognition", icon: <TrophyIcon />, action: () => scrollTo("achievements") },
  { id: "volunteering", label: "Volunteering", description: "Community", icon: <Heart size={14} />, action: () => scrollTo("volunteering") },
  { id: "articles", label: "Articles", description: "Writings", icon: <BookOpen size={14} />, action: () => scrollTo("articles") },
  { id: "resume", label: "Resume", description: "Request CV", icon: <FileText size={14} />, action: () => scrollTo("resume") },
  { id: "terminal", label: "Terminal", description: "Interactive terminal", icon: <Terminal size={14} />, action: () => scrollTo("about") },
  { id: "email", label: "Email Me", description: profile.social.email, icon: <Mail size={14} />, action: () => window.open(`mailto:${profile.social.email}`) },
  { id: "linkedin", label: "LinkedIn", description: "Connect on LinkedIn", icon: <ExternalLink size={14} />, action: () => window.open(profile.social.linkedin, "_blank") },
  { id: "github", label: "GitHub", description: "View GitHub profile", icon: <ExternalLink size={14} />, action: () => window.open(profile.social.github, "_blank") },
]

function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 8 7 9 9" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 16 7 15 9" /><path d="M8 21h8" /><path d="M12 17v4" /><path d="M9 9h6l-1 8H10Z" />
    </svg>
  )
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((p) => !p)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery("")
      setActiveIdx(0)
    }
  }, [open])

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  )

  const execute = useCallback(
    (a: Action) => {
      a.action()
      setOpen(false)
    },
    []
  )

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); return }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); return }
    if (e.key === "Enter" && filtered[activeIdx]) { execute(filtered[activeIdx]); return }
  }

  useEffect(() => {
    if (listRef.current && activeIdx >= 0) {
      const el = listRef.current.children[activeIdx] as HTMLElement
      el?.scrollIntoView({ block: "nearest" })
    }
  }, [activeIdx])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-lg overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-2 border-b border-[rgba(212,165,85,0.06)] px-4">
              <Search size={14} className="text-[#5a5a6a] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0) }}
                onKeyDown={handleKey}
                placeholder="Type a command or section..."
                className="w-full bg-transparent py-3 text-sm text-[#e8e8f0] placeholder-[#5a5a6a] outline-none"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="hidden md:inline-flex rounded border border-[rgba(212,165,85,0.08)] bg-[rgba(212,165,85,0.03)] px-1.5 py-0.5 font-mono text-[9px] text-[#5a5a6a]">ESC</kbd>
            </div>

            <div ref={listRef} className="max-h-64 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
              {filtered.length === 0 && (
                <p className="py-6 text-center text-xs text-[#5a5a6a]">No results for &ldquo;{query}&rdquo;</p>
              )}
              {filtered.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => execute(a)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    i === activeIdx
                      ? "bg-[rgba(212,165,85,0.08)] text-[#e8e8f0]"
                      : "text-[#7a7a8a] hover:bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  <span className={`shrink-0 ${i === activeIdx ? "text-[#d4a555]" : "text-[#5a5a6a]"}`}>{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{a.label}</div>
                    <div className="text-[10px] text-[#5a5a6a] truncate">{a.description}</div>
                  </div>
                  {i === activeIdx && <ArrowRight size={12} className="shrink-0 text-[#d4a555]" />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
