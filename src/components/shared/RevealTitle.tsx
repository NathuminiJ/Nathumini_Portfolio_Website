"use client"

import { motion } from "framer-motion"

export default function RevealTitle({ label, accent, children }: { label?: string; accent?: string; children?: string }) {
  const text = children || ""
  if (!text) return null

  const words = text.split(" ")
  const accentIdx = accent ? words.findIndex((w) => w.toLowerCase() === accent.toLowerCase()) : -1

  const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  }
  const child = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  }

  return (
    <div className="section-header">
      {label && <div className="section-label">{label}</div>}
      <motion.h2
        className="section-title"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={child}
            className={`inline-block mr-[0.25em] ${i === accentIdx ? "section-title-accent" : ""}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="accent-divider mt-3"
      />
    </div>
  )
}
