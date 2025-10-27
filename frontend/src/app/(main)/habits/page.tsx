import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogCreateHabit } from '@/components/DialogCreateHabit'

function Habits() {
  return (
    <div className="w-full">
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
        {/* Habit cards will go here */}
        <div className="text-center text-muted-foreground py-12">
          <p>No habits yet. Create your first habit to get started!</p>
        </div>
      </div>
    </div>
  )
}

export default Habits
