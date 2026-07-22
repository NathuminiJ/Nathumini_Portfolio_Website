"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ExternalLink, Code } from "lucide-react"
import { profile } from "@/data/profile-data"
import Magnetic from "@/components/shared/Magnetic"

function Greeting() {
  const [greeting, setGreeting] = useState("Hello")
  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) setGreeting("Good Morning")
    else if (h >= 12 && h < 17) setGreeting("Good Afternoon")
    else if (h >= 17 && h < 22) setGreeting("Good Evening")
    else setGreeting("Good Night")
  }, [])
  return <>{greeting}</>
}

function FloatingDots() {
  const [dots] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 5 + 5,
      opacity: Math.random() * 0.2 + 0.05,
    }))
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="data-dot animate-float"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState("")
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const full = words[idx] || ""
    if (typing) {
      if (display.length < full.length) {
        const t = setTimeout(() => setDisplay(full.slice(0, display.length + 1)), 50)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setTyping(false), 1500)
      return () => clearTimeout(t)
    } else {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(display.slice(0, -1)), 25)
        return () => clearTimeout(t)
      }
      setTyping(true)
      setIdx((idx + 1) % words.length)
    }
  }, [display, typing, idx, words])

  return (
    <span className="gradient-text">
      {display}
      <span className="inline-block w-[2px] h-[1em] ml-0.5 bg-[#d4a555] animate-pulse align-middle" />
    </span>
  )
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const scroll = () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })

  if (!mounted) return null

  return (
    <section id="hero" ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <FloatingDots />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 w-full">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-3 font-mono text-[10px] tracking-[0.3em] text-[#5a5a6a]"
          >
            <Greeting />, I&apos;M
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="mb-4 text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
          >
            <span className="text-[#e8e8f0]">{profile.name.split(" ")[0]}</span>{" "}
            <span className="gradient-text">{profile.name.split(" ").slice(1).join(" ")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-3 h-6 text-sm text-[#7a7a8a]"
          >
            <Typewriter words={profile.roles} />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mb-2 text-xs text-[#5a5a6a]"
          >
            {profile.location.city}, {profile.location.country}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic>
              <button onClick={scroll} className="btn-primary">
                View Work <ArrowRight size={14} />
              </button>
            </Magnetic>
            <Magnetic>
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <ExternalLink size={14} /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Code size={14} /> GitHub
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] tracking-[0.3em] text-[#3a3a4a]">SCROLL</span>
          <div className="h-10 w-px bg-gradient-to-b from-[#d4a555]/20 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
