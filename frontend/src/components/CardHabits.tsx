import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { Habit } from '@/store/useHabitStore'
import { DialogEditHabit } from './DialogEditHabit'

interface CardHabitsProps {
  habit: Habit
}

function CardHabits({ habit }: CardHabitsProps) {
  // Format the date
  const formattedDate = new Date(habit.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl">{habit.title}</CardTitle>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          <DialogEditHabit
            habit={habit}
            trigger={
              <Button variant="ghost" size="icon" className="shrink-0">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
        </div>
        {habit.description && (
          <CardDescription className="mt-2 text-sm">
            {habit.description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  )
}

export default CardHabits

