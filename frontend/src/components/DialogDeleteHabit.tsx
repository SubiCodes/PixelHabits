import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Habit, useHabitStore } from "@/store/useHabitStore"

interface DialogDeleteHabitProps {
    trigger: ReactNode
    habit: Habit
}


export function DialogDeleteHabit({ trigger, habit }: DialogDeleteHabitProps) {
    const [open, setOpen] = useState(false);

    const habitStore = useHabitStore();

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete your habit &quot;{habit.title}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive active:bg-destructive/80 hover:bg-destructive hover:cursor-pointer" onClick={() => habitStore.deleteHabit(habit.id)}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
