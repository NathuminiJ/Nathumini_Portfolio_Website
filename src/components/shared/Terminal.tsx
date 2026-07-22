"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { profile } from "@/data/profile-data"

const RESPONSES: Record<string, string> = {
  whoami: `${profile.name}\n${profile.headline}\n${profile.location.city}, ${profile.location.country}`,
  skills: profile.skills.join(", "),
  projects: profile.projects.map((p) => `  \u2022 ${p.title}`).join("\n"),
  contact: `email: ${profile.social.email}\nlinkedin: ${profile.social.linkedin}\ngithub: ${profile.social.github}`,
  education: profile.education.map((e) => `  \u2022 ${e.degree} @ ${e.university} (${e.period})`).join("\n"),
  experience: profile.experience.map((e) => `  \u2022 ${e.role} @ ${e.organization} (${e.period})`).join("\n"),
  about: profile.about.split("\n\n")[0],
  ls: "about  education  experience  projects  skills  contact",
}

const HELP = `Available commands:
  whoami     \u2014 About me
  skills     \u2014 My skills
  projects   \u2014 My projects
  education  \u2014 My education
  experience \u2014 My experience
  contact    \u2014 How to reach me
  about      \u2014 Short bio
  ls         \u2014 List all topics
  clear      \u2014 Clear terminal
  help       \u2014 Show this message`

type Line = { text: string; output: boolean }

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: "Welcome to Nathumini's interactive terminal. Type 'help' to get started.", output: true },
    { text: "", output: true },
  ])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines: Line[] = [...lines, { text: `$ ${cmd}`, output: false }]
    setHistory((p) => [...p, trimmed])
    setHistIdx(-1)

    if (trimmed === "clear") {
      setLines([])
      return
    }

    const response = trimmed === "help" ? HELP : RESPONSES[trimmed]
    if (response) {
      newLines.push({ text: response, output: true })
    } else if (trimmed === "") {
      newLines.push({ text: "", output: true })
    } else {
      newLines.push({ text: `Command not found: ${trimmed}. Type 'help' for available commands.`, output: true })
    }
    setLines(newLines)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input)
      setInput("")
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next])
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (histIdx === -1) return
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(-1)
        setInput("")
      } else {
        setHistIdx(next)
        setInput(history[next])
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => inputRef.current?.focus()}
      className="card overflow-hidden cursor-text"
    >
      <div className="flex items-center gap-1.5 border-b border-[rgba(212,165,85,0.06)] px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#5a5a6a]/40" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#5a5a6a]/20" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#5a5a6a]/20" />
        <span className="ml-2 font-mono text-[9px] text-[#5a5a6a]">terminal — nathumini@portfolio</span>
      </div>

      <div className="p-4 font-mono text-xs leading-relaxed max-h-64 overflow-y-auto scrollbar-hide">
        {lines.map((line, i) => (
          <div key={i} className={line.output ? "text-[#7a7a8a]" : "text-[#d4a555]/80"}>
            {line.text.split("\n").map((s, j) => (
              <div key={j}>{s}</div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[#d4a555]/80 shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none text-[#e8e8f0] caret-[#d4a555]"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={endRef} />
      </div>
    </motion.div>
  )
}
