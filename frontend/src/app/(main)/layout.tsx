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
      <div className="min-h-screen w-full md:flex md:justify-center md:bg-muted/20">
        <div className="flex flex-col md:flex-row w-full md:max-w-7xl min-h-screen md:border-x border-border bg-background">
          <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
          <MainSidebar open={drawerOpen} onOpenChange={setDrawerOpen} />
          <main className="flex-1 min-h-screen md:border-x border-border">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
