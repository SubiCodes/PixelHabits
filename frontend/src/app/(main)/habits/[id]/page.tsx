"use client"

import LoadingPage from '@/components/LoadingPage';
import React, { useState } from 'react'

interface HabitPageParams {
    params: { id: string }
}

function Habit({ params }: HabitPageParams) {
    const [loading, setLoading] = useState<boolean>(true);

    if (loading) {
        return <LoadingPage />;
    }
  return (
    <div>
      <h1>Habit ID: {params.id}</h1>
    </div>
  )
}

export default Habit
