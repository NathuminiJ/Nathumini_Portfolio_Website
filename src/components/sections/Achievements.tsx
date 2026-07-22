"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Trophy } from "lucide-react"
import { profile } from "@/data/profile-data"
import RevealTitle from "@/components/shared/RevealTitle"

function Counter({ n, label }: { n: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [c, setC] = useState(0)
  useEffect(() => {
    if (!inView) return
    const steps = 40; const inc = n / steps; let cur = 0
    const t = setInterval(() => {
      cur += inc
      if (cur >= n) { setC(n); clearInterval(t) } else setC(Math.floor(cur))
    }, 30)
    return () => clearInterval(t)
  }, [inView, n])
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <span ref={ref} className="text-2xl font-bold gradient-text">{c}+</span>
      <p className="mt-0.5 font-mono text-[10px] text-[#5a5a6a]">{label}</p>
    </motion.div>
  )
}

export default function Achievements() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="achievements" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }}>
          <RevealTitle label="Achievements" accent="Recognition">Awards & Recognition</RevealTitle>
        </motion.div>

        <div className="grid gap-3 mb-8">
          {profile.achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="card card-accent p-5"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#d4a555]/20">
                  <Trophy size={18} />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#5a5a6a]">{a.year}</span>
                  <h3 className="mt-0.5 text-sm font-semibold text-[#e8e8f0]">{a.title}</h3>
                  <p className="text-xs text-[#d4a555]/50">{a.event}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#7a7a8a]">{a.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 rounded-xl border border-[rgba(212,165,85,0.06)] bg-[rgba(14,14,24,0.4)] p-6 md:grid-cols-4"
        >
          {[10, 11, 3, 1].map((n, i) => (
            <Counter key={i} n={n} label={["Projects", "Certifications", "Leadership Roles", "National Finalist"][i]} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
