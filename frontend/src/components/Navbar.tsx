"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useActiveSection } from "@/lib/hooks"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavLink } from "@/components/NavLink"
import { Button } from "@/components/ui/button"

const navigationLinks = [
  { sectionId: "hero", label: "Home" },
  { sectionId: "features", label: "Features" },
  { sectionId: "preview", label: "Preview" },
  { sectionId: "fyp", label: "FYP" }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const activeSection = useActiveSection()

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4">
      {/* Mobile Navbar (full width) */}
      <nav className="md:hidden w-full h-16 px-4 flex items-center justify-between border-b backdrop-blur-md bg-background/80 shadow-sm">
        {/* Logo */}
        <Link href="/" className="relative h-8 w-32">
          <Image
            src="/logos/logo.png"
            alt="Pixel Habits"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-1">
            {navigationLinks.map((link) => (
              <NavLink 
                key={link.sectionId} 
                sectionId={link.sectionId}
                isActive={activeSection === link.sectionId}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 ml-4 border-l pl-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="text-left">Navigation</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.sectionId}
                  sectionId={link.sectionId}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-lg"
                  isActive={activeSection === link.sectionId}
                >
                  {link.label}
                </NavLink>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="border-t pt-4 mt-4">
                <div className="grid gap-2">
                  <Link href="/sign-in" className="w-full">
                    <Button variant="ghost" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Desktop Navbar (floating bubble) */}
      <nav className="hidden md:flex mx-auto max-w-3xl w-full items-center gap-6 rounded-full border bg-background/90 backdrop-blur-md shadow-lg px-6 py-2">
        {/* Logo */}
        <Link href="/" className="relative h-8 w-32">
          <Image
            src="/logos/logo.png"
            alt="Pixel Habits"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 px-6 border-l border-r flex-1 justify-center">
          {navigationLinks.map((link) => (
            <NavLink 
              key={link.sectionId} 
              sectionId={link.sectionId}
              isActive={activeSection === link.sectionId}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}