import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Define your state type
interface Habit {
  id: string
  ownerId: string
  title: string
  description: string
  isPublic: boolean
  createdAt: Date
}

interface HabitStore {
  // State
  habits: Habit[]
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  addingHabit: boolean
}

// Create the store
export const useHabitStore = create<HabitStore>()(
  devtools(
    persist(
      (set) => ({

        habits: [],
        addHabit: (habit) => {
          const newHabit: Habit = {
            ...habit,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          }
          set((state) => ({
            habits: [...state.habits, newHabit],
          }))
        },
        addingHabit: false,
      }),
      {
        name: 'habit-storage', 
        partialize: (state) => ({
          habits: state.habits,
        }),
      }
    )
  )
)
