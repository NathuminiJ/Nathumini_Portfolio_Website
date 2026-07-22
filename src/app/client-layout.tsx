"use client"

import dynamic from "next/dynamic"
import Navigation from "@/components/layout/Navigation"
import Footer from "@/components/layout/Footer"
import ScrollProgress from "@/components/shared/ScrollProgress"
import AmbientGlow from "@/components/shared/AmbientGlow"
import BackToTop from "@/components/shared/BackToTop"
import CommandPalette from "@/components/shared/CommandPalette"

const Cursor = dynamic(() => import("@/components/shared/Cursor"), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <AmbientGlow />
      <BackToTop />
      <ScrollProgress />
      <CommandPalette />
      <div className="bg-grid pointer-events-none fixed inset-0 z-0" />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-[#d4a555]/6 blur-[180px]" />
        <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-[#b8893a]/4 blur-[180px]" />
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[#d4a555]/3 blur-[120px]" />
      </div>
      <div className="relative z-10">
        <Navigation />
        {children}
        <Footer />
      </div>
    </>
  )
}
