"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DialogEditBioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogEditBio({ open, onOpenChange }: DialogEditBioProps) {
  const handleClose = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
          <DialogDescription>
            Update your bio below and click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* <FormEditBio onSuccess={handleClose} /> */}
      </DialogContent>
    </Dialog>
  )
}
