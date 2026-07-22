import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function linkify(text: string): string {
  return text.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#d4a555]/70 hover:text-[#d4a555] underline underline-offset-2 transition-colors">$1</a>'
  )
}
