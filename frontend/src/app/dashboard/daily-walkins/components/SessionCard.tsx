import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, LogOut, Clock } from "lucide-react";
import { Session } from "../types";
import { formatDateTime } from "../utils/formatters";

interface SessionCardProps {
  session: Session;
  onAddTestDrive: (session: Session) => void;
  onExitSession: (session: Session) => void;
  sessionSubmitting: boolean;
}

export function SessionCard({
  session,
  onAddTestDrive,
  onExitSession,
  sessionSubmitting,
}: SessionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={session.status === "intake" ? "default" : "secondary"}
                className="text-xs font-medium"
              >
                {session.status}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDateTime(session.createdAt)}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Reason:</span> {session.reason}
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {session.status === "intake" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddTestDrive(session)}
                  disabled={sessionSubmitting}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Car className="h-3 w-3" />
                  Add Test Drive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onExitSession(session)}
                  disabled={sessionSubmitting}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <LogOut className="h-3 w-3" />
                  Exit Session
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Vehicle Interests */}
        {session.visitorInterests && session.visitorInterests.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Vehicle Interests:
            </h4>
            <div className="flex flex-wrap gap-2">
              {session.visitorInterests.map((interest, idx) => (
                <Badge key={interest.id} variant="outline" className="text-xs">
                  {interest.model.category.name} - {interest.model.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Test Drives */}
        {session.testDrives && session.testDrives.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Test Drives:
            </h4>
            <div className="space-y-1">
              {session.testDrives.map((testDrive, idx) => (
                <div
                  key={testDrive.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Car className="h-4 w-4 text-primary" />
                  <span>
                    {testDrive.model.category.name} - {testDrive.model.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No additional info */}
        {(!session.visitorInterests || session.visitorInterests.length === 0) &&
          (!session.testDrives || session.testDrives.length === 0) && (
            <div className="text-sm text-muted-foreground italic">
              No additional information available
            </div>
          )}
      </CardContent>
    </Card>
  );
}
