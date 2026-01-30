import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Phone, Mail, Calendar } from "lucide-react";
import { Visitor, Session } from "../types";
import { SessionsList } from "./SessionsList";
import { formatDate, getInitials } from "../utils/formatters";
import apiClient from "@/lib/api";

interface VisitorDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitor: Visitor | null;
  expandedSessions: Set<string>;
  onToggleSession: (sessionId: string, open: boolean) => void;
  onAddTestDrive: (session: Session) => void;
  onExitSession: (session: Session) => void;
  sessionSubmitting: boolean;
  refreshTrigger?: number; // Add this to force refresh when sessions are updated
}

export function VisitorDetailsModal({
  open,
  onOpenChange,
  visitor,
  expandedSessions,
  onToggleSession,
  onAddTestDrive,
  onExitSession,
  sessionSubmitting,
  refreshTrigger,
}: VisitorDetailsModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch sessions when modal opens, visitor changes, or refresh is triggered
  useEffect(() => {
    const fetchVisitorSessions = async () => {
      if (!visitor || !open) {
        setSessions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await apiClient.get(
          `/sessions?visitorId=${visitor.id}&limit=100`,
        );
        setSessions(response.data.sessions || []);
      } catch (error) {
        console.error("Failed to fetch visitor sessions:", error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorSessions();
  }, [visitor, open, refreshTrigger]);

  if (!visitor) return null;

  const initials = getInitials(visitor.firstName, visitor.lastName);
  const lastVisit =
    sessions.length > 0
      ? formatDate(
          sessions.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0].createdAt,
        )
      : formatDate(visitor.createdAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg flex-shrink-0">
              {initials}
            </div>

            {/* Visitor Info */}
            <div className="flex-1 space-y-3">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {visitor.firstName} {visitor.lastName}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {visitor.whatsappNumber}
                  </div>
                  {visitor.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {visitor.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Last visit: {lastVisit}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3 flex-wrap">
                <Badge variant="secondary" className="text-xs font-medium">
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </Badge>
                {visitor.interests && visitor.interests.length > 0 && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {visitor.interests.length} interest
                    {visitor.interests.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              {/* Interested Models */}
              {visitor.interests && visitor.interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Interested Models:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {visitor.interests.map((interest, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {interest.model.category.name} - {interest.model.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Sessions Content */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Session History
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading sessions...
                  </span>
                </div>
              ) : (
                <SessionsList
                  sessions={sessions}
                  expandedSessions={expandedSessions}
                  onToggleSession={onToggleSession}
                  onAddTestDrive={onAddTestDrive}
                  onExitSession={onExitSession}
                  sessionSubmitting={sessionSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
