import React from 'react'

interface HabitPageParams {
    params: { id: string }
}

function Habit({ params }: HabitPageParams) {
  return (
    <div>
      <h1>Habit ID: {params.id}</h1>
    </div>
  )
}

export default Habit
