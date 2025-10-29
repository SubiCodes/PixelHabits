"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormCreateActivity } from "./FormCreateActivity";


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
      <DialogContent className="sm:max-w-[425px] lg:min-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add an Activity</DialogTitle>
          <DialogDescription>
            Add a new activity and gain a green block to your calendar. Fill in the details below and click add when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormCreateActivity onSuccess={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
