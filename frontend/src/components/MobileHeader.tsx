"use client"

import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <Link href="/home" className="absolute left-1/2 -translate-x-1/2">
          <div className="relative h-8 w-8">
            <Image
              src="/logos/logo_icon.png"
              alt="Pixel Habits"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="w-9" /> {/* Spacer for centering */}
      </div>
    </header>
  )
}
