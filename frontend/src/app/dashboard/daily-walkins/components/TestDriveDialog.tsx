import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { VehicleCategory, Session, TestDriveFormData } from "../types";
import { toast } from "sonner";

interface TestDriveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  categories: VehicleCategory[];
  onSubmit: (
    sessionId: string,
    modelId: string,
    variantId?: string,
  ) => Promise<void>;
  submitting: boolean;
}

export function TestDriveDialog({
  open,
  onOpenChange,
  session,
  categories,
  onSubmit,
  submitting,
}: TestDriveDialogProps) {
  const [formData, setFormData] = useState<TestDriveFormData>({
    modelId: "",
    variantId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (!formData.modelId) {
      toast.error("Please select a vehicle model");
      return;
    }

    const [modelId, variantId] = formData.modelId.includes(":")
      ? formData.modelId.split(":")
      : [formData.modelId, undefined];

    await onSubmit(session.id, modelId, variantId || formData.variantId);

    // Reset form
    setFormData({
      modelId: "",
      variantId: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">
            Add Test Drive
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Record a test drive and send a follow-up WhatsApp message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="modelId" className="text-sm">
              Vehicle Model *
            </Label>
            <Select
              value={formData.modelId}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  modelId: value,
                  variantId: "",
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectGroup key={cat.id}>
                    <SelectLabel>{cat.name}</SelectLabel>
                    {cat.models.map((model) => {
                      const hasVariants =
                        model.variants && model.variants.length > 0;
                      if (!hasVariants) {
                        return (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} {model.year ? `(${model.year})` : ""}
                          </SelectItem>
                        );
                      }
                      return (
                        <div key={model.id}>
                          <SelectItem value={model.id}>
                            {model.name} (Base){" "}
                            {model.year ? `(${model.year})` : ""}
                          </SelectItem>
                          {model.variants?.map((variant) => (
                            <SelectItem
                              key={variant.id}
                              value={`${model.id}:${variant.id}`}
                            >
                              {model.name}.{variant.name}{" "}
                              {model.year ? `(${model.year})` : ""}
                            </SelectItem>
                          ))}
                        </div>
                      );
                    })}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save & Send Message"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
