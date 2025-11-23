"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-4 left-4 z-50 w-auto">
      <div className="flex h-14 items-center justify-center px-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-9 w-9 bg-transparent shadow-none border-none"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
    </header>
  )
}
