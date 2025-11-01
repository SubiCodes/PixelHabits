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
import { useRouter } from "next/navigation"

interface DialogDeleteHabitProps {
    trigger: ReactNode
    habit: Habit
    atHabitPage?: boolean
}


export function DialogDeleteHabit({ trigger, habit, atHabitPage }: DialogDeleteHabitProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const habitStore = useHabitStore();

    const handleClose = () => {
        setOpen(false)
    };

    const deleteHabit = async () => {
        await habitStore.deleteHabit(habit.id);
        if (atHabitPage) {
            router.back();
        }
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
                    <AlertDialogAction className="bg-destructive active:bg-destructive/80 hover:bg-destructive hover:cursor-pointer" onClick={() => deleteHabit()}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
