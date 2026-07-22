"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const items = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#footer" },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const handle = () => {
      setScrolled(window.scrollY > 60)
      const ids = items.map((x) => x.href.slice(1)).reverse()
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 300) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener("scroll", handle, { passive: true })
    return () => window.removeEventListener("scroll", handle)
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#07070d]/80 backdrop-blur-2xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <button onClick={() => scrollTo("#hero")} className="text-lg font-bold tracking-tight text-[#d4a555]">
          NJ<span className="text-[#3a3a4a]">.</span>
        </button>
        <div className="hidden items-center gap-10 md:flex">
          {items.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className={`relative text-xs tracking-widest uppercase transition-colors ${
                active === item.href.slice(1) ? "text-[#d4a555]" : "text-[#5a5a6a] hover:text-[#9a9aae]"
              }`}
            >
              {item.label}
              {active === item.href.slice(1) && (
                <motion.div layoutId="nav" className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-[#d4a555] to-transparent" />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
