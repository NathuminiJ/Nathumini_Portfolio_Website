"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { profile } from "@/data/profile-data"

export default function Certifications() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const items = profile.certifications
  const doubled = [...items, ...items]

  const x = useMotionValue(0)
  const [paused, setPaused] = useState(false)
  const [cardW, setCardW] = useState(216)

  useEffect(() => {
    const el = trackRef.current?.children[0]
    if (el) {
      const w = el.getBoundingClientRect().width
      const gap = 24
      setCardW(w + gap)
    }
  }, [])

  const oneSetW = cardW * items.length

  useEffect(() => {
    if (paused || oneSetW === 0) return
    let id: number
    const tick = () => {
      let nx = x.get() - 0.5
      if (nx <= -oneSetW) nx += oneSetW
      x.set(nx)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [paused, oneSetW, x])

  const pause = useCallback(() => {
    setPaused(true)
    setTimeout(() => setPaused(false), 4000)
  }, [])

  const prev = useCallback(() => {
    let nx = x.get() + cardW
    if (nx > 0) nx -= oneSetW
    x.set(nx)
    pause()
  }, [cardW, oneSetW, x, pause])

  const next = useCallback(() => {
    let nx = x.get() - cardW
    if (nx < -oneSetW) nx += oneSetW
    x.set(nx)
    pause()
  }, [cardW, oneSetW, x, pause])

  if (items.length === 0) return null

  return (
    <section id="certifications" ref={sectionRef}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }} className="section-header">
          <div className="section-label">Certifications</div>
          <h2 className="section-title">Credentials</h2>
          <div className="accent-divider mt-3" />
        </motion.div>
      </div>

      <div
        className="relative overflow-hidden py-4 group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button onClick={prev} aria-label="Previous"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,165,85,0.08)] bg-[#07070d]/80 text-[#5a5a6a] backdrop-blur-sm transition-all hover:border-[#d4a555]/20 hover:text-[#d4a555] opacity-0 group-hover:opacity-100">
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} aria-label="Next"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,165,85,0.08)] bg-[#07070d]/80 text-[#5a5a6a] backdrop-blur-sm transition-all hover:border-[#d4a555]/20 hover:text-[#d4a555] opacity-0 group-hover:opacity-100">
          <ChevronRight size={16} />
        </button>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6"
        >
          {doubled.map((c, i) => (
            <div key={`${c.name}-${i}`} className="card flex-shrink-0 w-48 p-4">
              <h3 className="text-xs font-medium text-[#e8e8f0]">{c.name}</h3>
              <p className="mt-0.5 text-[10px] text-[#7a7a8a]">{c.issuer}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#5a5a6a]">{c.year}</span>
                {c.link && (
                  <a href={c.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-[9px] text-[#d4a555]/30 hover:text-[#d4a555] transition-colors">
                    Verify <ExternalLink size={8} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
