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

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeedback: string | null;
  onFeedbackSelect: (feedback: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  selectedFeedback,
  onFeedbackSelect,
  onSubmit,
  onSkip,
  onCancel,
}: FeedbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>
            Please share your feedback about this visitor session.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-6 py-8">
          <button
            type="button"
            onClick={() => onFeedbackSelect("happy")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:bg-green-50 ${
              selectedFeedback === "happy"
                ? "bg-green-100 ring-2 ring-green-500"
                : "bg-gray-50"
            }`}
          >
            <span className="text-5xl">😊</span>
            <span className="text-sm font-medium">Happy</span>
          </button>
          <button
            type="button"
            onClick={() => onFeedbackSelect("okay")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:bg-yellow-50 ${
              selectedFeedback === "okay"
                ? "bg-yellow-100 ring-2 ring-yellow-500"
                : "bg-gray-50"
            }`}
          >
            <span className="text-5xl">😐</span>
            <span className="text-sm font-medium">Okay</span>
          </button>
          <button
            type="button"
            onClick={() => onFeedbackSelect("sad")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:bg-red-50 ${
              selectedFeedback === "sad"
                ? "bg-red-100 ring-2 ring-red-500"
                : "bg-gray-50"
            }`}
          >
            <span className="text-5xl">😞</span>
            <span className="text-sm font-medium">Not Good</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
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
            variant="ghost"
            onClick={onSkip}
            className="w-full sm:w-auto"
          >
            Skip
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!selectedFeedback}
            className="w-full sm:w-auto"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
