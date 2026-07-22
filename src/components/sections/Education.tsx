"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { profile } from "@/data/profile-data"
import RevealTitle from "@/components/shared/RevealTitle"

function EduCard({ item, i }: { item: (typeof profile.education)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const y = useTransform(scrollYProgress, [0, 1], [20, 0])
  const o = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity: o }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      className="card card-accent p-5 md:p-6"
    >
      <span className="font-mono text-[10px] text-[#5a5a6a]">{item.period}</span>
      <h3 className="mt-1.5 text-base font-semibold text-[#e8e8f0]">{item.degree}</h3>
      <p className="mt-1 text-xs text-[#d4a555]/50">{item.university}{item.institute ? ` \u00B7 ${item.institute}` : ""}</p>
      {item.activities && (
        <p className="mt-2 text-[10px] text-[#5a5a6a]">{item.activities}</p>
      )}
      {item.highlights?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.highlights.map((h, j) => (
            <span key={j} className="tag">{h}</span>
          ))}
        </div>
      )}
      {item.skills?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.skills.map((s, j) => (
            <span key={j} className="tag">{s}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function Education() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="education" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }}>
          <RevealTitle label="Education" accent="Foundation">Academic Foundation</RevealTitle>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {profile.education.map((item, i) => (
            <EduCard key={i} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
