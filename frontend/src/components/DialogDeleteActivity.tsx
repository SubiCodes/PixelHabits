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
import { useRouter } from "next/navigation"
import { Activity, useActivityStore } from "@/store/useActivityStore"

interface DialogDeleteActivityProps {
    open: boolean;
    activity: Activity | null
    closeViews: () => void
}


export function DialogDeleteActivity({ open, activity, closeViews }: DialogDeleteActivityProps) {

    const activityStore = useActivityStore();
    const deleteActivity = async () => {
        await activityStore.deleteActivity(activity?.id ?? "");
        closeViews();
    }

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete your activity &quot;{activity?.caption}&quot;? This action cannot be undone and may cause you to lose your streak 🔥.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive active:bg-destructive/80 hover:bg-destructive hover:cursor-pointer" onClick={() => deleteActivity()}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
