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
import { Habit } from "@/store/useHabitStore"
import { FormEditHabit } from "./FormEditHabit"

interface DialogCreateHabitProps {
  trigger: ReactNode
  habit: Habit
  atHabitPage?: boolean
}

export function DialogEditHabit({ trigger, habit, atHabitPage }: DialogCreateHabitProps) {
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
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update the details of your habit below and click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormEditHabit onSuccess={handleClose} habit={habit} atHabitPage={atHabitPage} />
      </DialogContent>
    </Dialog>
  )
}
