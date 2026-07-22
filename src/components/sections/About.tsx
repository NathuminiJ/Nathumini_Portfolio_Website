"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { profile } from "@/data/profile-data"
import RevealTitle from "@/components/shared/RevealTitle"
import Terminal from "@/components/shared/Terminal"

function JourneyItem({ item, i }: { item: (typeof profile.aboutJourney)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const y = useTransform(scrollYProgress, [0, 1], [20, 0])
  const o = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])

  return (
    <motion.div ref={ref} style={{ y, opacity: o }} className="relative pl-8">
      <div className="absolute left-0 top-1">
        <div className="h-2 w-2 rounded-full border border-[#d4a555]/30 bg-[#07070d]" />
      </div>
      <div className="card card-accent p-5">
        <span className="font-mono text-[10px] text-[#d4a555]/50">{item.year}</span>
        <h3 className="mt-1.5 text-sm font-semibold text-[#e8e8f0]">{item.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[#7a7a8a]">{item.description}</p>
      </div>
    </motion.div>
  )
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="about" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }}>
          <RevealTitle label="About" accent="Journey">The Journey</RevealTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="grid gap-8 md:grid-cols-5"
        >
          <div className="md:col-span-3 space-y-4 text-sm leading-relaxed text-[#7a7a8a]">
            {profile.about.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-2"
          >
            <div className="card p-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">3+</div>
                <p className="mt-1 font-mono text-[10px] text-[#5a5a6a]">Years of Academic Journey</p>
              </div>
              <div className="my-4 h-px bg-[rgba(212,165,85,0.06)]" />
              <div className="grid grid-cols-2 gap-4 text-center">
                {[["10", "Projects"], ["11", "Certifications"], ["3", "Leadership"], ["1", "Finalist"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-lg font-bold text-[#e8e8f0]">{n}</div>
                    <p className="font-mono text-[10px] text-[#5a5a6a]">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative mt-10">
          <div className="absolute left-[3px] top-0 h-full w-px bg-gradient-to-b from-[#d4a555]/15 via-[#d4a555]/8 to-transparent" />
          <div className="space-y-4">
            {profile.aboutJourney.map((item, i) => (
              <JourneyItem key={item.year} item={item} i={i} />
            ))}
          </div>
        </div>

        <div className="mt-10 max-w-lg">
          <div className="section-label mb-3">Interactive</div>
          <Terminal />
        </div>
      </div>
    </section>
  )
}
