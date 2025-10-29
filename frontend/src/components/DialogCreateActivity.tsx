"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreateHabit } from "./FormCreateHabit"


interface DialogCreateActivityProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogCreateActivity({ open, onOpenChange }: DialogCreateActivityProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add an Activity</DialogTitle>
          <DialogDescription>
            Add a new activity and gain a green block to your calendar. Fill in the details below and click add when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormCreateHabit onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
