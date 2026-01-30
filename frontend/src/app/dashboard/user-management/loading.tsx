"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="pb-2 border-b">
        <Skeleton className="h-8 sm:h-10 w-52 sm:w-64" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Users Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-28" />
        </CardHeader>
        <CardContent>
          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-4 w-12" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="text-left py-3 px-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <tr key={i} className="border-b">
                    {/* Email Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    {/* Role Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    {/* Dealership Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    {/* Status Column */}
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    {/* Actions Column */}
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
