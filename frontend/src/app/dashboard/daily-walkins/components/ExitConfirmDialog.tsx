import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Session } from "../types";

interface ExitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExitConfirmDialog({
  open,
  onOpenChange,
  session,
  submitting,
  onConfirm,
  onCancel,
}: ExitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exit Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to exit this session? This will close the
            session and send a thank you message to the visitor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exiting...
              </>
            ) : (
              "Exit Session"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
