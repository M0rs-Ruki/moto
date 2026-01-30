import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
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
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No sessions found for this visitor.</p>
      </div>
    );
  }

  const sortedSessions = sessions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-2">
      {sortedSessions.map((session, index) => {
        const isExpanded = expandedSessions.has(session.id);

        if (sortedSessions.length === 1) {
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
              <div className="w-full cursor-pointer border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between p-4 min-h-[60px]">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          Session {index + 1}
                        </span>
                        <Badge
                          variant={
                            session.status === "intake"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {new Date(session.createdAt).toLocaleDateString()} •{" "}
                        {session.reason}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 pb-4">
              <div className="pt-2 border-t mt-2">
                <SessionCard
                  session={session}
                  onAddTestDrive={onAddTestDrive}
                  onExitSession={onExitSession}
                  sessionSubmitting={sessionSubmitting}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
