"use client"

import { cn } from "@/lib/utils"
import { scrollToSection } from "@/lib/hooks"

interface NavLinkProps {
  sectionId: string
  children: React.ReactNode
  className?: string
  isActive?: boolean
  onClick?: () => void
}

export function NavLink({ sectionId, children, className, isActive, onClick }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection(sectionId)
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-4 py-2 rounded-md transition-all duration-200",
        isActive 
          ? "text-foreground bg-accent/10 hover:bg-accent/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
        className
      )}
    >
      {children}
    </button>
  )
}