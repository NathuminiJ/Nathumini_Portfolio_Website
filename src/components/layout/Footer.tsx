"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUp, ExternalLink, Code, Mail } from "lucide-react"
import { profile } from "@/data/profile-data"

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const o = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer id="footer" ref={ref}>
      <motion.div style={{ opacity: o }} className="section-container">
        <div className="flex flex-col items-center gap-6 py-6">
          <button onClick={() => scrollTo("#hero")} className="text-xl font-bold tracking-tight text-[#d4a555]">
            NJ<span className="text-[#3a3a4a]">.</span>
          </button>

          <p className="text-xs text-[#5a5a6a] max-w-xs text-center leading-relaxed">
            Turning Data Into Decisions. Building Ideas Into Reality.
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: ExternalLink, href: profile.social.linkedin, label: "LinkedIn" },
              { icon: Code, href: profile.social.github, label: "GitHub" },
              { icon: Mail, href: `mailto:${profile.social.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(212,165,85,0.06)] text-[#5a5a6a] transition-all hover:border-[#d4a555]/20 hover:text-[#d4a555] hover:bg-[#d4a555]/4">
                <Icon size={14} />
              </a>
            ))}
            <button onClick={() => scrollTo("#hero")} aria-label="Scroll to top"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(212,165,85,0.06)] text-[#5a5a6a] transition-all hover:border-[#d4a555]/20 hover:text-[#d4a555] hover:bg-[#d4a555]/4">
              <ArrowUp size={14} />
            </button>
          </div>

          <div className="border-t border-[rgba(212,165,85,0.04)] pt-5 w-full text-center">
            <p className="font-mono text-[10px] text-[#4a4a5a]">
              &copy; 2026 {profile.name}. All rights reserved.
            </p>
            {profile.repository && (
              <a href={profile.repository} target="_blank" rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 font-mono text-[9px] text-[#3a3a4a] hover:text-[#d4a555]/40 transition-colors">
                <Code size={9} /> View Source
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
