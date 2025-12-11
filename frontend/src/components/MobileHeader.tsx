"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const pathname = usePathname()
  const isHome = pathname === "/home"
  return (
    <header
      className={
        isHome
          ? "md:hidden fixed top-4 left-4 z-50 w-auto"
          : "md:hidden relative w-full z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border"
      }
    >
      <div
        className={
          isHome
            ? "flex h-14 items-center justify-center px-0"
            : "flex h-14 items-center justify-between px-4"
        }
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className={
            isHome ? "h-9 w-9 bg-transparent shadow-none border-none text-black" : "h-9 w-9 text-black"
          }
        >
          <Menu className="h-5 w-5 text-black" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        {!isHome && (
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
        )}
        {!isHome && <div className="w-9" />}
      </div>
    </header>
  )
}
