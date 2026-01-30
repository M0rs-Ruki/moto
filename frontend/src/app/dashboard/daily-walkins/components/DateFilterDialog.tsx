import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, X } from "lucide-react";
import { DateFilter } from "../types";

interface DateFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  onClearFilter: () => void;
}

export function DateFilterDialog({
  open,
  onOpenChange,
  dateFilter,
  onDateFilterChange,
  onClearFilter,
}: DateFilterDialogProps) {
  const hasFilter = dateFilter.startDate || dateFilter.endDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Calendar className="mr-2 h-4 w-4" />
          Filter by Date
          {hasFilter && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter by Date Range</DialogTitle>
          <DialogDescription>
            Select a date range to filter visitors
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                onDateFilterChange({
                  ...dateFilter,
                  startDate: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                onDateFilterChange({
                  ...dateFilter,
                  endDate: e.target.value,
                })
              }
              min={dateFilter.startDate}
            />
          </div>
          {hasFilter && (
            <Button
              variant="outline"
              onClick={onClearFilter}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filter
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
