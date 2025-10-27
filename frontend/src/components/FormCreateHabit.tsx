"use client"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FormCreateHabit() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const description = formData.get('description')
    console.log({ name, description })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="habit-name">Habit Name</Label>
          <Input 
            id="habit-name" 
            name="name" 
            placeholder="e.g., Morning Exercise" 
            required 
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="habit-description">Description (Optional)</Label>
          <Textarea 
            id="habit-description" 
            name="description" 
            placeholder="e.g., 30 minutes of cardio to start the day energized"
            rows={3}
            className="resize-none"
          />
        </div>
      </div>
      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Create Habit</Button>
      </DialogFooter>
    </form>
  )
}
