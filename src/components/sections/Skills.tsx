"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const grouped = [
  {
    category: "Data & Analytics",
    skills: ["Python", "SQL", "Power BI", "Machine Learning", "Data Analysis", "Data Visualization", "Pandas", "Scikit-learn", "Database Management", "Business Intelligence"],
  },
  {
    category: "Web & Mobile",
    skills: ["Next.js", "Tailwind CSS", "JavaScript", "HTML & CSS", "PHP", "Laravel", "Kotlin", "Jetpack Compose", ".NET Framework"],
  },
  {
    category: "Tools & Methods",
    skills: ["Git & GitHub", "Figma", "Agile & Scrum"],
  },
]

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="skills" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }} className="section-header">
          <div className="section-label">Skills</div>
          <h2 className="section-title">
            Technical <span className="section-title-accent">Expertise</span>
          </h2>
          <div className="accent-divider mt-3" />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {grouped.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: gi * 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3 className="mb-4 text-xs font-semibold tracking-wider text-[#7a7a8a]">{group.category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((name, i) => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.15 + i * 0.04, duration: 0.25 }}
                    className="tag"
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
