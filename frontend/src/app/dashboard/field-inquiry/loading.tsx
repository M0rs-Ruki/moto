"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FieldInquiryLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="pb-2 border-b">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-56" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-20" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-24" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-3 w-16" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <tr key={i} className="border-b">
                    {/* Inquiry Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    </td>
                    {/* Contact Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    {/* Lead Scope Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    {/* Lead Source Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    {/* Model Column */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    {/* Created Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    {/* Actions Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-8 w-20" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
  );
}
