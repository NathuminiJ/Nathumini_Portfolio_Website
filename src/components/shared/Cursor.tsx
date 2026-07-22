"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function Cursor() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)
  const springX = useSpring(cx, { stiffness: 200, damping: 20 })
  const springY = useSpring(cy, { stiffness: 200, damping: 20 })
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const dotSpringX = useSpring(dotX, { stiffness: 400, damping: 30 })
  const dotSpringY = useSpring(dotY, { stiffness: 400, damping: 30 })

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches
    if (!isFine) return

    setVisible(true)
    const move = (e: MouseEvent) => {
      cx.set(e.clientX)
      cy.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }
    const over = () => setHovered(true)
    const out = () => setHovered(false)

    window.addEventListener("mousemove", move)
    document.querySelectorAll("a, button, .card").forEach((el) => {
      el.addEventListener("mouseenter", over)
      el.addEventListener("mouseleave", out)
    })
    return () => {
      window.removeEventListener("mousemove", move)
      document.querySelectorAll("a, button, .card").forEach((el) => {
        el.removeEventListener("mouseenter", over)
        el.removeEventListener("mouseleave", out)
      })
    }
  }, [cx, cy, dotX, dotY])

  if (!visible) return null

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-300 rounded-full border border-[#d4a555]/30"
        animate={{ width: hovered ? 36 : 24, height: hovered ? 36 : 24 }}
      />
      <motion.div
        style={{ x: dotSpringX, y: dotSpringY }}
        className="pointer-events-none fixed top-0 left-0 z-[999] h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a555]/60"
        animate={{ scale: hovered ? 0.5 : 1 }}
      />
    </>
  )
}
