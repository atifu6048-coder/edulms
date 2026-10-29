import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconSize?: string
  textSize?: string
}

export function Logo({
  className,
  iconSize = "h-5 w-5",
  textSize = "text-xl",
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-90 dark:text-zinc-50",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 transition-transform duration-200 group-hover:scale-105">
        <GraduationCap className={iconSize} />
      </div>
      <span className={cn("font-extrabold tracking-tight", textSize)}>
        Edu<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
      </span>
    </Link>
  )
}

