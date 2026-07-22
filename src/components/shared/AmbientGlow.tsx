"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function AmbientGlow() {
  const [visible, setVisible] = useState(false)
  const mx = useMotionValue(-800)
  const my = useMotionValue(-800)
  const springMx = useSpring(mx, { stiffness: 80, damping: 25 })
  const springMy = useSpring(my, { stiffness: 80, damping: 25 })

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches
    if (!isFine) return
    setVisible(true)
    const move = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [mx, my])

  if (!visible) return null

  return (
    <motion.div
      style={{ x: springMx, y: springMy }}
      className="pointer-events-none fixed top-0 left-0 z-[1] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="h-[500px] w-[500px] rounded-full bg-[#d4a555] opacity-[0.04] blur-[120px]" />
    </motion.div>
  )
}
