"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { profile } from "@/data/profile-data"
import RevealTitle from "@/components/shared/RevealTitle"

function Card({ item, i }: { item: (typeof profile.experience)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const y = useTransform(scrollYProgress, [0, 1], [20, 0])
  const o = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity: o }}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.1, duration: 0.4 }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-2">
        <div className="h-2 w-2 rounded-full border border-[#d4a555]/30 bg-[#07070d]" />
      </div>
      <div className="card card-accent overflow-hidden p-5 md:p-6">
        {item.image && (
          <div className="-mx-5 -mt-5 mb-4 md:-mx-6 md:-mt-6 bg-[#07070d] overflow-hidden">
            <img src={item.image} alt={item.organization} className="max-h-24 w-full object-contain" />
          </div>
        )}
        <div className="flex items-center gap-2 text-[10px] text-[#5a5a6a]">
          <span className="font-mono">{item.period}</span>
          {item.employmentType && (
            <>
              <span className="text-[#3a3a4a]">&middot;</span>
              <span>{item.employmentType}</span>
            </>
          )}
        </div>
        <h3 className="mt-1 text-sm font-semibold text-[#e8e8f0]">{item.role}</h3>
        <p className="text-xs text-[#d4a555]/50">{item.organization}</p>
        {item.location && (
          <p className="text-[10px] text-[#5a5a6a] mt-0.5">{item.location}</p>
        )}
        <p className="mt-2.5 text-xs leading-relaxed text-[#7a7a8a]">{item.description}</p>
        {item.skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.skills.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="experience" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }}>
          <RevealTitle label="Experience" accent="Background">Professional Background</RevealTitle>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[3px] top-0 h-full w-px bg-gradient-to-b from-[#d4a555]/12 via-[#d4a555]/6 to-transparent" />
          <div className="space-y-5">
            {profile.experience.map((item, i) => (
              <Card key={item.id} item={item} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
