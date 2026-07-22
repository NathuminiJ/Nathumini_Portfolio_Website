"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, FileText, X } from "lucide-react"
import { clamp } from "@/lib/utils"
import { profile } from "@/data/profile-data"
import { linkify } from "@/lib/utils"
import RevealTitle from "@/components/shared/RevealTitle"

function TiltCard({ p, onClick }: { p: (typeof profile.projects)[0]; onClick: () => void }) {
  const img = p.images?.[0]
  const cardRef = useRef<HTMLButtonElement>(null)
  const rx = useMotionValue(0.5)
  const ry = useMotionValue(0.5)
  const springRx = useSpring(rx, { stiffness: 200, damping: 25 })
  const springRy = useSpring(ry, { stiffness: 200, damping: 25 })
  const rotateX = useTransform(springRx, [0, 1], [6, -6])
  const rotateY = useTransform(springRy, [0, 1], [-6, 6])

  const handleMouse = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1)
    rx.set(y)
    ry.set(x)
  }
  const handleLeave = () => { rx.set(0.5); ry.set(0.5) }

  return (
    <motion.button
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="group relative flex-shrink-0 w-[80vw] md:w-[420px] lg:w-[480px] snap-start text-left rounded-xl overflow-hidden border border-[rgba(212,165,85,0.06)] bg-[rgba(14,14,24,0.6)] transition-all hover:border-[rgba(212,165,85,0.15)] hover:shadow-lg hover:shadow-[rgba(212,165,85,0.03)]"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-[#07070d]">
        {img ? (
          <img src={img} alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-3xl font-bold tracking-tight text-[#2a2a3a]">{p.title[0]}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/90 via-[#07070d]/30 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="font-mono text-[10px] text-[#8a8a9a]/70">{p.period}</span>
        <h3 className="mt-0.5 text-sm font-semibold text-[#e8e8f0] group-hover:gradient-text transition-all">{p.title}</h3>
        {p.techStack?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {p.techStack.slice(0, 4).map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(212,165,85,0.08)] text-[#d4a555]/60">{t}</span>
            ))}
            {p.techStack.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)] text-[#5a5a6a]">+{p.techStack.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.button>
  )
}

function ImageLightbox({ images, active, onClose }: { images: string[]; active: number; onClose: () => void }) {
  const [idx, setIdx] = useState(active)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") setIdx((i) => (i > 0 ? i - 1 : images.length - 1))
      if (e.key === "ArrowRight") setIdx((i) => (i < images.length - 1 ? i + 1 : 0))
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [images.length, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute right-5 top-5 z-10 text-[#5a5a6a] hover:text-[#e8e8f0] transition-colors">
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i > 0 ? i - 1 : images.length - 1)) }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,165,85,0.1)] bg-[#07070d]/60 text-[#5a5a6a] hover:text-[#d4a555] hover:border-[#d4a555]/20 transition-colors backdrop-blur-sm">
            <ChevronLeft size={18} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i < images.length - 1 ? i + 1 : 0)) }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,165,85,0.1)] bg-[#07070d]/60 text-[#5a5a6a] hover:text-[#d4a555] hover:border-[#d4a555]/20 transition-colors backdrop-blur-sm">
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full flex items-center justify-center"
      >
        <img
          src={images[idx]} alt=""
          className="max-w-full max-h-[85vh] object-contain cursor-grab active:cursor-grabbing select-none"
          style={{ transform: `scale(${scale}) translate(${pos.x}px, ${pos.y}px)` }}
          onWheel={(e) => setScale((s) => clamp(s - e.deltaY * 0.001, 1, 4))}
          onMouseDown={(e) => { dragging.current = true; lastPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y } }}
          onMouseMove={(e) => { if (dragging.current) setPos({ x: e.clientX - lastPos.current.x, y: e.clientY - lastPos.current.y }) }}
          onMouseUp={() => { dragging.current = false }}
          onMouseLeave={() => { dragging.current = false }}
        />
      </motion.div>

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i) }}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-[#d4a555]" : "w-1.5 bg-[rgba(212,165,85,0.2)]"}`} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function ProjectModal({ p, onClose }: { p: (typeof profile.projects)[0]; onClose: () => void }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const imgs = p.images || []

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="card relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8"
        >
          <button onClick={onClose} className="absolute right-4 top-4 z-10 text-[#5a5a6a] hover:text-[#e8e8f0] transition-colors">
            <X size={18} />
          </button>

          {imgs.length > 0 && (
            <div className="-mx-6 -mt-6 mb-5 md:-mx-8 md:-mt-8">
              <button onClick={() => setLightbox(galleryIdx)} className="w-full relative group">
                <img src={imgs[galleryIdx]} alt={p.title} className="max-h-48 w-full object-cover transition-opacity group-hover:opacity-80" />
                {imgs.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span onClick={(e) => { e.stopPropagation(); setGalleryIdx((i) => (i > 0 ? i - 1 : imgs.length - 1)) }}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70">
                      <ChevronLeft size={14} />
                    </span>
                    <span onClick={(e) => { e.stopPropagation(); setGalleryIdx((i) => (i < imgs.length - 1 ? i + 1 : 0)) }}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70">
                      <ChevronRight size={14} />
                    </span>
                  </div>
                )}
              </button>
              {imgs.length > 1 && (
                <div className="flex gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
                  {imgs.map((url, i) => (
                    <button key={i} onClick={() => setGalleryIdx(i)}
                      className={`flex-shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${i === galleryIdx ? "border-[#d4a555] opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}>
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <span className="font-mono text-[10px] text-[#5a5a6a]">{p.period}</span>
          <h3 className="mt-1 text-lg font-semibold text-[#e8e8f0]">{p.title}</h3>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#7a7a8a]">
            {p.details ? (
              p.details.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: linkify(para) }} />
              ))
            ) : p.description ? (
              <p dangerouslySetInnerHTML={{ __html: linkify(p.description) }} />
            ) : null}
          </div>

          {p.techStack?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.techStack.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer"
                className="btn-outline">
                <ExternalLink size={13} /> Live Site
              </a>
            )}
            {p.documents?.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                className="btn-outline">
                <FileText size={13} /> {d.label || `Document ${i + 1}`}
              </a>
            ))}
          </div>
        </motion.div>
        <AnimatePresence>
          {lightbox !== null && p.images && (
            <ImageLightbox images={p.images} active={lightbox} onClose={() => setLightbox(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default function Projects() {
  const [active, setActive] = useState(0)
  const [modal, setModal] = useState<(typeof profile.projects)[0] | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const items = profile.projects

  const scrollTo = useCallback((i: number) => {
    scrollRef.current?.children[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    setActive(i)
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth)
    if (idx !== active) setActive(idx)
  }, [active])

  if (items.length === 0) return null

  return (
    <>
      <section id="projects" className="overflow-hidden">
        <div className="section-container">
          <RevealTitle label="Projects" accent="Work">Featured Work</RevealTitle>
        </div>

        <div className="relative">
          <button onClick={() => scrollTo(Math.max(0, active - 1))}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,165,85,0.08)] bg-[#07070d]/80 text-[#5a5a6a] hover:text-[#d4a555] hover:border-[#d4a555]/20 transition-colors backdrop-blur-sm">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,165,85,0.08)] bg-[#07070d]/80 text-[#5a5a6a] hover:text-[#d4a555] hover:border-[#d4a555]/20 transition-colors backdrop-blur-sm">
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:px-16 pb-4 scrollbar-hide"
          >
            {items.map((p, i) => (
              <TiltCard key={p.id} p={p} onClick={() => setModal(p)} />
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-4">
            {items.map((_, i) => (
              <button key={i} onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-[#d4a555]" : "w-1.5 bg-[rgba(212,165,85,0.12)] hover:bg-[rgba(212,165,85,0.25)]"}`} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal && <ProjectModal p={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}
