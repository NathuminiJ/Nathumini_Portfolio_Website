"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FileText, ExternalLink } from "lucide-react"
import { profile } from "@/data/profile-data"

export default function Articles() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="articles" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }} className="section-header">
          <div className="section-label">Articles</div>
          <h2 className="section-title">Writings</h2>
          <div className="accent-divider mt-3" />
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2">
          {profile.articles.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="card p-5 group"
            >
              <FileText size={14} className="mb-2 text-[#5a5a6a]" />
              <span className="font-mono text-[10px] text-[#5a5a6a]">{a.date}</span>
              <h3 className="mt-1 text-sm font-semibold text-[#e8e8f0] group-hover:gradient-text transition-all">{a.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#7a7a8a]">{a.excerpt}</p>
              {a.link && (
                <a href={a.link} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#d4a555]/40 hover:text-[#d4a555] transition-colors">
                  Read Article <ExternalLink size={9} />
                </a>
              )}
              <div className="mt-2 flex flex-wrap gap-1">
                {a.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
