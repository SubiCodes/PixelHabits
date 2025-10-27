import { AuthGuard } from '@/components'
import React from 'react'

export default function Home() {
  return (
    <AuthGuard>
      <div>
        <h1>HOME</h1>
      </div>
    </AuthGuard>
  )
}

