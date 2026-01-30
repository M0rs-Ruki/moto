"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, FileSpreadsheet, Upload } from "lucide-react";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  uploading: boolean;
  uploadError: string;
  uploadResults: {
    summary: { total: number; success: number; errors: number };
    results: Array<{
      success: boolean;
      rowNumber: number;
      enquiryId?: string;
      error?: string;
    }>;
  } | null;
  onClose: () => void;
}

export default function BulkUploadDialog({
  open,
  onOpenChange,
  onSubmit,
  uploading,
  uploadError,
  uploadResults,
  onClose,
}: BulkUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Field Enquiries</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx or .xls) with columns: Date, Name,
            WhatsApp Number, Location, Model, Source
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {uploadError && (
            <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-3 rounded">
              {uploadError}
            </div>
          )}

          {uploadResults && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Upload Results</h3>
                <Badge
                  variant={
                    uploadResults.summary.errors === 0 ? "default" : "secondary"
                  }
                >
                  {uploadResults.summary.success} /{" "}
                  {uploadResults.summary.total} successful
                </Badge>
              </div>
              {uploadResults.summary.errors > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <p className="text-xs font-medium text-destructive">
                    Errors ({uploadResults.summary.errors}):
                  </p>
                  <div className="space-y-1 text-xs">
                    {uploadResults.results
                      .filter((r) => !r.success)
                      .map((result, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-background rounded border-l-2 border-destructive"
                        >
                          <span className="font-medium">
                            Row {result.rowNumber}:
                          </span>{" "}
                          {result.error}
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {uploadResults.summary.success > 0 && (
                <p className="text-xs text-muted-foreground">
                  {uploadResults.summary.success} enquiries created
                  successfully. All enquiries have been set to &quot;Cold&quot;
                  lead scope.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="excelFile" className="text-sm">
              Excel File *
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls"
                required
                disabled={uploading}
                className="cursor-pointer"
              />
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Required columns: Date, Name, WhatsApp Number, Location, Model,
              Source
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={uploading}
            >
              {uploadResults ? "Close" : "Cancel"}
            </Button>
            {!uploadResults && (
              <Button
                type="submit"
                disabled={uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Process
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
