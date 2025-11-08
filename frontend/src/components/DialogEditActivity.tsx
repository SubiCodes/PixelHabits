"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormEditActivity } from "./FormEditActivity";
import { Activity } from "@/store/useActivityStore";


interface DialogEditActivityProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
  onEditSuccess?: () => void;
}

export function DialogEditActivity({ open, onOpenChange, activity, onEditSuccess }: DialogEditActivityProps) {
  const handleClose = () => {
    onOpenChange(false);
    // Call onEditSuccess callback if provided
    onEditSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98%] md:min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription className="max-w-md">
            Edit the details of your activity below and click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormEditActivity onSuccess={handleClose} activity={activity} />
      </DialogContent>
    </Dialog>
  );
}
