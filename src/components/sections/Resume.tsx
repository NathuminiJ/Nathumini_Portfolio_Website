"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Send, Check } from "lucide-react"
import { profile } from "@/data/profile-data"

export default function Resume() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  const o = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSending(true)
    try {
      await fetch("/api/cv-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setSent(true)
    } catch {
      alert("Something went wrong. Please try emailing directly.")
    }
    setSending(false)
  }

  return (
    <section id="resume" ref={ref}>
      <div className="section-container">
        <motion.div style={{ y, opacity: o }} className="section-header">
          <div className="section-label">Resume</div>
          <h2 className="section-title">
            Request My <span className="section-title-accent">CV</span>
          </h2>
          <div className="accent-divider mt-3" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="card card-accent mx-auto max-w-md p-8"
        >
          <div className="mb-6 text-center">
            <h3 className="text-base font-semibold text-[#e8e8f0]">{profile.name}</h3>
            <p className="mt-1 text-xs text-[#7a7a8a]">{profile.headline}</p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a555]/10">
                <Check size={22} className="text-[#d4a555]" />
              </div>
              <p className="text-sm text-[#7a7a8a] text-center">Request sent! I&apos;ll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full rounded-lg border border-[rgba(212,165,85,0.08)] bg-[rgba(14,14,24,0.4)] px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/30 transition-colors" />
              <input type="email" placeholder="Your Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                className="w-full rounded-lg border border-[rgba(212,165,85,0.08)] bg-[rgba(14,14,24,0.4)] px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/30 transition-colors" />
              <textarea placeholder="Brief message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                className="w-full rounded-lg border border-[rgba(212,165,85,0.08)] bg-[rgba(14,14,24,0.4)] px-3 py-2.5 text-sm text-[#e8e8f0] placeholder-[#5a5a6a] outline-none focus:border-[#d4a555]/30 transition-colors" />
              <button type="submit" disabled={sending}
                className="btn-primary w-full justify-center">
                {sending ? "Sending..." : "Request CV"} <Send size={14} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
