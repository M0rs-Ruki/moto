import React from "react";
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
  const hasInterests =
    session.visitorInterests && session.visitorInterests.length > 0;
  const hasTestDrives = session.testDrives && session.testDrives.length > 0;

  return (
    <div className="space-y-3">
      {/* Session Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDateTime(session.createdAt)}
        </div>
        <div className="text-sm text-muted-foreground">{session.reason}</div>
      </div>

      {/* Vehicle Interests */}
      {hasInterests && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Vehicle Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {session.visitorInterests!.map((interest) => (
              <Badge key={interest.id} variant="outline" className="text-xs">
                {interest.model.category.name} - {interest.model.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Test Drives */}
      {hasTestDrives && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Test Drives</p>
          <div className="space-y-1">
            {session.testDrives!.map((testDrive) => (
              <div
                key={testDrive.id}
                className="flex items-center gap-2 text-sm"
              >
                <Car className="h-3.5 w-3.5" />
                <span>
                  {testDrive.model.category.name} - {testDrive.model.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {session.status === "intake" && (
        <div className="pt-3 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddTestDrive(session)}
            disabled={sessionSubmitting}
            className="flex-1 sm:flex-none"
          >
            <Car className="h-3.5 w-3.5 mr-2" />
            Add Test Drive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExitSession(session)}
            disabled={sessionSubmitting}
            className="flex-1 sm:flex-none"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Exit Session
          </Button>
        </div>
      )}
    </div>
  );
}
