"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DailyWalkinsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="pb-2 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 sm:h-10 w-44 sm:w-52" />
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Action Area Skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
          <div className="w-full sm:w-auto" />
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-10" />
        </div>

        {/* Visitors Grid Skeleton */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="border-t pt-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </CardContent>
              <div className="px-4 pb-4">
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}
