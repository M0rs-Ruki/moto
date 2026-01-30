import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Session } from "../types";
import { SessionCard } from "./SessionCard";

interface SessionsListProps {
  sessions: Session[];
  expandedSessions: Set<string>;
  onToggleSession: (sessionId: string, open: boolean) => void;
  onAddTestDrive: (session: Session) => void;
  onExitSession: (session: Session) => void;
  sessionSubmitting: boolean;
}

export function SessionsList({
  sessions,
  expandedSessions,
  onToggleSession,
  onAddTestDrive,
  onExitSession,
  sessionSubmitting,
}: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No sessions found for this visitor.</p>
      </div>
    );
  }

  // Sort sessions by creation date (newest first)
  const sortedSessions = sessions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-4">
      {sortedSessions.map((session, index) => {
        const isExpanded = expandedSessions.has(session.id);

        if (sortedSessions.length === 1) {
          // If there's only one session, show it expanded without collapsible
          return (
            <SessionCard
              key={session.id}
              session={session}
              onAddTestDrive={onAddTestDrive}
              onExitSession={onExitSession}
              sessionSubmitting={sessionSubmitting}
            />
          );
        }

        return (
          <Collapsible
            key={session.id}
            open={isExpanded}
            onOpenChange={(open) => onToggleSession(session.id, open)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left h-auto p-3 hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    Session {index + 1} - {session.status}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString()} •{" "}
                    {session.reason}
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "transform rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-2">
              <SessionCard
                session={session}
                onAddTestDrive={onAddTestDrive}
                onExitSession={onExitSession}
                sessionSubmitting={sessionSubmitting}
              />
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
