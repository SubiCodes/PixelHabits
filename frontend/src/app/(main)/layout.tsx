"use client"

import { AuthGuard } from '@/components/AuthGuard'
import { MainSidebar } from '@/components/MainSidebar'
import { MobileHeader } from '@/components/MobileHeader'
import React, { useState } from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <AuthGuard>
      {/* Container: Full width on mobile, centered with max-width on desktop */}
      <div className="min-h-screen w-full md:flex md:justify-center md:bg-muted/20">
        <div className="flex flex-col md:flex-row w-full md:max-w-7xl min-h-screen md:border-x border-border bg-background">
          {/* Mobile Header */}
          <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
          
          {/* Left Sidebar (Desktop) + Drawer (Mobile) */}
          <MainSidebar open={drawerOpen} onOpenChange={setDrawerOpen} />
          
          {/* Main Content Area */}
          <main className="flex-1 min-h-screen md:border-x border-border">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
