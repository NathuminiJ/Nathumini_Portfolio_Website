"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { profile } from "@/data/profile-data"

export default function Volunteering() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="volunteering" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }} className="section-header">
          <div className="section-label">Volunteering</div>
          <h2 className="section-title">Community</h2>
          <div className="accent-divider mt-3" />
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {profile.volunteering.map((v, i) => (
            <motion.div
              key={v.organization + v.role}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card p-4"
            >
              <span className="font-mono text-[10px] text-[#5a5a6a]">{v.period}</span>
              <h3 className="mt-1 text-sm font-semibold text-[#e8e8f0]">{v.organization}</h3>
              <p className="text-[10px] text-[#d4a555]/50">{v.role}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#7a7a8a]">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
