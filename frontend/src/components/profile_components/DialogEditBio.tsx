"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FormEditBio from "./FormEditBio";

interface DialogEditBioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bio?: string | null;
}

export function DialogEditBio({ open, onOpenChange, bio }: DialogEditBioProps) {
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
        <FormEditBio bio={bio || null}/>
      </DialogContent>
    </Dialog>
  )
}
