"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import { FormCreateHabit } from "./FormCreateHabit"

interface DialogCreateHabitProps {
  trigger: ReactNode
}

export function DialogCreateHabit({ trigger }: DialogCreateHabitProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track. Fill in the details below and click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormCreateHabit onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
