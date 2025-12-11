"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Calendar, 
  Trophy, 
  User, 
  Settings, 
  Search,
  MoreHorizontal,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useStackApp, useUser } from "@stackframe/stack"

const navigationItems = [
  {
    name: "Home",
    href: "/home",
    icon: Home,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Habits",
    href: "/habits",
    icon: Calendar,
  },
  {
    name: "Leaderboards",
    href: "/leaderboards",
    icon: Trophy,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface MainSidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MainSidebar({ open, onOpenChange }: MainSidebarProps) {
  const pathname = usePathname()
  const app = useStackApp()
  const user = useUser()

  const handleSignOut = async () => {
    await app.redirectToSignOut()
  }

  const handleLinkClick = () => {
    // Close drawer on mobile when a link is clicked
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  // Sidebar content component (shared between desktop and mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full p-3">
      {/* Logo */}
      <div className="mb-3 px-2">
        <Link href="/home" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="relative h-8 w-8">
            <Image
              src="/logos/logo_icon.png"
              alt="Pixel Habits"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold text-black">Pixel Habits</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-full transition-colors text-black",
                "hover:bg-accent",
                isActive && "font-bold"
              )}
            >
              <Icon className={cn("h-5 w-5 text-black", isActive && "stroke-[2.5]")} />
              <span className={cn("text-base text-black", isActive && "font-bold")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="mt-auto space-y-1">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-full hover:bg-accent text-base text-black"
        >
          <LogOut className="h-5 w-5 text-black" />
          <span className="text-black">Sign out</span>
        </Button>

        {user && (
          <Link
            href="/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 p-2.5 rounded-full hover:bg-accent transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm overflow-hidden relative">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.displayName || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{user.displayName?.[0]?.toUpperCase() || user.primaryEmail?.[0]?.toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-black">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-black/60 truncate">
                @{user.primaryEmail?.split('@')[0] || "username"}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-80 p-0 md:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-col h-screen border-r border-border">
        <div className="flex flex-col h-full p-3 xl:p-4">
          {/* Logo */}
          <div className="mb-3 px-2 xl:mb-4">
            <Link href="/home" className="flex items-center gap-2">
              <div className="relative h-8 w-8 xl:h-9 xl:w-9">
                <Image
                  src="/logos/logo_icon.png"
                  alt="Pixel Habits"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden lg:inline text-lg xl:text-xl font-bold text-black">Pixel Habits</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 xl:space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 rounded-full transition-colors text-black",
                    "hover:bg-accent",
                    isActive && "font-bold"
                  )}
                >
                  <Icon className={cn("h-5 w-5 xl:h-6 xl:w-6 text-black", isActive && "stroke-[2.5]")} />
                  <span className={cn("hidden lg:inline text-base xl:text-lg text-black", isActive && "font-bold")}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Sign Out */}
          <div className="mt-auto space-y-1">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 h-auto rounded-full hover:bg-accent text-base xl:text-lg text-black"
            >
              <LogOut className="h-5 w-5 xl:h-6 xl:w-6 text-black" />
              <span className="hidden lg:inline text-black">Sign out</span>
            </Button>

            {user && (
              <Link
                href="/profile"
                className="flex items-center gap-2.5 xl:gap-3 p-2.5 xl:p-3 rounded-full hover:bg-accent transition-colors"
              >
                <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm overflow-hidden relative">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.displayName || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{user.displayName?.[0]?.toUpperCase() || user.primaryEmail?.[0]?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <div className="hidden lg:block flex-1 min-w-0">
                  <p className="font-semibold text-sm xl:text-base truncate text-black">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs xl:text-sm text-black/60 truncate">
                    @{user.primaryEmail?.split('@')[0] || "username"}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
