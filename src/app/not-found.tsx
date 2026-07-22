import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <span className="font-mono text-[10px] tracking-[0.3em] text-[#5a5a6a] mb-3">404</span>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-[#3a3a4a]">{"> "}</span>
        <span className="gradient-text">Lost?</span>
      </h1>
      <p className="mt-3 text-xs text-[#7a7a8a] max-w-xs text-center">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back Home
      </Link>
    </div>
  )
}
