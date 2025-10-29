'use client'

import React, { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogCreateHabit } from '@/components/DialogCreateHabit'
import { useHabitStore } from '@/store/useHabitStore'
import CardHabits from '@/components/CardHabits'
import { useUser } from '@stackframe/stack'

function Habits() {
  const user = useUser();
  const habits = useHabitStore((state) => state.habits);

  useEffect(() => {
    if (user) {
      useHabitStore.getState().getHabitsByUserId(user.id, user.id);
    }
  }, [user]);

  return (
    <div className="w-full max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">My Habits</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track and build your daily habits</p>
          </div>
          
          <DialogCreateHabit 
            trigger={
              <Button 
                size="default"
                className="gap-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Create Habit</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {habits.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <CardHabits
                key={habit.id}
                habit={habit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Habits
