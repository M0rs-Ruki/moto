import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="pb-2 border-b">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Sessions List Skeleton */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
                  <Skeleton className="h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24 hidden sm:block" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <Skeleton className="h-3 w-full mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Skeleton className="h-4 w-16 flex-shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full pl-4" />
                  <Skeleton className="h-4 w-3/4 pl-4" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                <Skeleton className="h-9 w-full sm:w-32" />
                <Skeleton className="h-9 w-full sm:w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

