"use client"

import { useScroll, useSpring, motion } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      style={{ scaleX: scaleY }}
      className="fixed top-0 left-0 right-0 z-[100] h-[1.5px] origin-left bg-gradient-to-r from-[#d4a555] via-[#e8c67a] to-[#d4a555]"
    />
  )
}
