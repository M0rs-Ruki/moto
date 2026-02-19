"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeliveryUpdateLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="pb-2 border-b">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-56" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>

      {/* Action Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-20" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-24" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-20" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <tr key={i} className="border-b">
                    {/* Customer Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    {/* Model Column */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    {/* Delivery Date Column */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </td>
                    {/* Status Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    {/* Messages Column */}
                    <td className="py-3 px-4">
                      <div className="flex gap-4">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-6 rounded" />
                      </div>
                    </td>
                    {/* Actions Column */}
                    <td className="py-3 px-4">
                      <div className="flex gap-4">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  );
}
