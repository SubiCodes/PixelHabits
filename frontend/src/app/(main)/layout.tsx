"use client"

import { AuthGuard } from '@/components/AuthGuard'
import { MainSidebar } from '@/components/MainSidebar'
import { MobileHeader } from '@/components/MobileHeader'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/home"

  return (
    <AuthGuard>
      <div className="h-screen w-full md:flex md:justify-center bg-background overflow-hidden">
        <div className="flex flex-col md:flex-row w-full md:max-w-7xl h-screen md:border-x border-border bg-background">
          <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
          <MainSidebar open={drawerOpen} onOpenChange={setDrawerOpen} />
          <main className={`flex-1 min-h-0 md:border-x border-border ${
            isHome
              ? "h-full overflow-hidden"
              : "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full"
          }`}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
