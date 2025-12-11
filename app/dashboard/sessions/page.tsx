"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Loader2,
  Car,
  LogOut,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SessionsLoading from "./loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Session {
  id: string;
  reason: string;
  status: string;
  exitFeedback: string | null;
  exitRating: number | null;
  createdAt: string;
  visitor: {
    id: string;
    firstName: string;
    lastName: string;
    whatsappNumber: string;
  };
  testDrives: Array<{
    id: string;
    outcome: string | null;
    feedback: string | null;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
  visitorInterests?: Array<{
    id: string;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
}

interface VehicleVariant {
  id: string;
  name: string;
}

interface VehicleModel {
  id: string;
  name: string;
  year: number | null;
  variants?: VehicleVariant[];
}

interface VehicleCategory {
  id: string;
  name: string;
  models: VehicleModel[];
}

export default function SessionsPage() {
  const searchParams = useSearchParams();
  const sessionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [testDriveDialogOpen, setTestDriveDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );

  // Test drive form
  const [testDriveData, setTestDriveData] = useState({
    modelId: "",
    variantId: "",
    outcome: "",
    feedback: "",
  });

  // Exit form
  const [exitData, setExitData] = useState({
    exitFeedback: "",
    exitRating: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Handle auto-expand and scroll when coming from dashboard
  useEffect(() => {
    if (sessions.length === 0 || loading) return;

    const sessionId = searchParams.get("sessionId");
    const visitorId = searchParams.get("visitorId");

    if (sessionId || visitorId) {
      // Find the matching session
      const targetSession = sessions.find(
        (s) =>
          (sessionId && s.id === sessionId) ||
          (visitorId && s.visitor.id === visitorId)
      );

      if (targetSession) {
        // Expand the session (override default collapsed state if needed)
        setExpandedSessions((prev) => {
          const newSet = new Set(prev);
          newSet.add(targetSession.id);
          return newSet;
        });

        // Scroll to the session after a short delay to allow expansion
        setTimeout(() => {
          const element = sessionRefs.current[targetSession.id];
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Highlight the session briefly
            element.classList.add(
              "ring-2",
              "ring-primary",
              "ring-offset-2",
              "rounded-lg"
            );
            setTimeout(() => {
              element.classList.remove(
                "ring-2",
                "ring-primary",
                "ring-offset-2",
                "rounded-lg"
              );
            }, 2000);
          }
        }, 400);
      }
    }
  }, [sessions, loading, searchParams]);

  const fetchData = async () => {
    try {
      const [sessionsRes, categoriesRes] = await Promise.all([
        axios.get("/api/sessions"),
        axios.get("/api/categories"),
      ]);
      setSessions(sessionsRes.data.sessions);
      setCategories(categoriesRes.data.categories);

      // Only expand active (non-exited) sessions by default
      const activeSessions = sessionsRes.data.sessions
        .filter((s: Session) => s.status !== "exited")
        .map((s: Session) => s.id);
      setExpandedSessions(new Set(activeSessions));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    if (!testDriveData.modelId) {
      alert("Please select a vehicle model");
      return;
    }

    setSubmitting(true);
    try {
      // Parse modelId and variantId if variant is selected
      const [modelId, variantId] = testDriveData.modelId.includes(":")
        ? testDriveData.modelId.split(":")
        : [testDriveData.modelId, undefined];

      await axios.post("/api/test-drives", {
        sessionId: selectedSession.id,
        modelId,
        variantId: variantId || testDriveData.variantId || undefined,
        outcome: testDriveData.outcome,
        feedback: testDriveData.feedback,
      });

      setTestDriveDialogOpen(false);
      setTestDriveData({
        modelId: "",
        variantId: "",
        outcome: "",
        feedback: "",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to create test drive:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    setSubmitting(true);
    try {
      await axios.post("/api/sessions/exit", {
        sessionId: selectedSession.id,
        ...exitData,
      });

      setExitDialogOpen(false);
      setExitData({ exitFeedback: "", exitRating: "" });

      // Collapse the session after exit
      setExpandedSessions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedSession.id);
        return newSet;
      });

      fetchData();
    } catch (error) {
      console.error("Failed to exit session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <SessionsLoading />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Visitor Sessions
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2">
          Manage test drives and session exits
        </p>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1">
        {sessions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center px-4 font-medium">
                No active sessions. Create a visitor to start a session.
              </p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => {
            const isExpanded = expandedSessions.has(session.id);
            const isExited = session.status === "exited";
            const hasTestDrives = session.testDrives.length > 0;
            const reasonPreview =
              session.reason.length > 60
                ? session.reason.substring(0, 60) + "..."
                : session.reason;

            return (
              <Card
                key={session.id}
                ref={(el) => {
                  sessionRefs.current[session.id] = el;
                }}
                className="overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleSession(session.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent border-b cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm sm:text-base md:text-lg truncate">
                              {session.visitor.firstName}{" "}
                              {session.visitor.lastName}
                            </CardTitle>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                              <CardDescription className="text-xs sm:text-sm truncate">
                                {session.visitor.whatsappNumber}
                              </CardDescription>
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                •
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(session.createdAt)}
                              </span>
                            </div>
                            {!isExpanded && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {reasonPreview}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant={
                              isExited
                                ? "default"
                                : session.status === "test_drive"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {session.status}
                          </Badge>
                          {hasTestDrives && (
                            <Badge variant="outline" className="text-xs">
                              {session.testDrives.length} TD
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-4 text-sm pt-4 pb-4 sm:pb-6">
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <span className="text-xs font-semibold text-muted-foreground uppercase min-w-fit">
                          Reason:
                        </span>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">
                          {session.reason}
                        </p>
                      </div>

                      {session.visitorInterests &&
                        session.visitorInterests.length > 0 && (
                          <div>
                            <p className="text-xs sm:text-sm font-semibold mb-2">
                              Vehicle Interests for This Visit:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {session.visitorInterests.map((interest) => (
                                <Badge
                                  key={interest.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {interest.model.category.name} -{" "}
                                  {interest.model.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {hasTestDrives && (
                        <div>
                          <p className="text-xs sm:text-sm font-semibold mb-2">
                            Test Drives ({session.testDrives.length}):
                          </p>
                          <div className="space-y-2">
                            {session.testDrives.map((td) => (
                              <div
                                key={td.id}
                                className="text-xs sm:text-sm pl-4 border-l-2 border-primary/30"
                              >
                                <p className="font-medium">
                                  {td.model.category.name} - {td.model.name}
                                </p>
                                {td.outcome && (
                                  <p className="text-muted-foreground text-xs">
                                    Outcome: {td.outcome}
                                  </p>
                                )}
                                {td.feedback && (
                                  <p className="text-muted-foreground break-words text-xs mt-1">
                                    {td.feedback}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {session.exitFeedback && (
                        <div>
                          <p className="text-xs sm:text-sm font-semibold mb-1">
                            Exit Feedback:
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">
                            {session.exitFeedback}
                          </p>
                          {session.exitRating && (
                            <div className="flex items-center gap-1 mt-2">
                              {Array.from({ length: session.exitRating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {!isExited && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                          <Dialog
                            open={
                              testDriveDialogOpen &&
                              selectedSession?.id === session.id
                            }
                            onOpenChange={setTestDriveDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSession(session)}
                                className="w-full sm:w-auto text-xs sm:text-sm"
                              >
                                <Car className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Add Test Drive
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg md:text-xl">
                                  Add Test Drive
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                  Record a test drive and send a follow-up
                                  WhatsApp message.
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={handleTestDriveSubmit}
                                className="space-y-4 mt-4"
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="modelId" className="text-sm">
                                    Vehicle Model *
                                  </Label>
                                  <Select
                                    value={testDriveData.modelId}
                                    onValueChange={(value) => {
                                      // Reset variant when model changes
                                      setTestDriveData({
                                        ...testDriveData,
                                        modelId: value,
                                        variantId: "",
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((cat) => (
                                        <SelectGroup key={cat.id}>
                                          <SelectLabel>{cat.name}</SelectLabel>
                                          {cat.models.map((model) => {
                                            const hasVariants =
                                              model.variants &&
                                              model.variants.length > 0;
                                            if (!hasVariants) {
                                              return (
                                                <SelectItem
                                                  key={model.id}
                                                  value={model.id}
                                                >
                                                  {model.name}{" "}
                                                  {model.year
                                                    ? `(${model.year})`
                                                    : ""}
                                                </SelectItem>
                                              );
                                            }
                                            return (
                                              <div key={model.id}>
                                                <SelectItem value={model.id}>
                                                  {model.name} (Base){" "}
                                                  {model.year
                                                    ? `(${model.year})`
                                                    : ""}
                                                </SelectItem>
                                                {model.variants?.map(
                                                  (variant) => (
                                                    <SelectItem
                                                      key={variant.id}
                                                      value={`${model.id}:${variant.id}`}
                                                    >
                                                      {model.name}.
                                                      {variant.name}{" "}
                                                      {model.year
                                                        ? `(${model.year})`
                                                        : ""}
                                                    </SelectItem>
                                                  )
                                                )}
                                              </div>
                                            );
                                          })}
                                        </SelectGroup>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {testDriveData.modelId.includes(":") && (
                                  <div className="text-xs text-muted-foreground">
                                    Variant selected:{" "}
                                    {testDriveData.modelId.split(":")[1]}
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="outcome" className="text-sm">
                                    Outcome
                                  </Label>
                                  <Select
                                    value={testDriveData.outcome}
                                    onValueChange={(value) =>
                                      setTestDriveData({
                                        ...testDriveData,
                                        outcome: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select outcome" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="excellent">
                                        Excellent
                                      </SelectItem>
                                      <SelectItem value="good">Good</SelectItem>
                                      <SelectItem value="fair">Fair</SelectItem>
                                      <SelectItem value="poor">Poor</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="feedback" className="text-sm">
                                    Feedback
                                  </Label>
                                  <Textarea
                                    id="feedback"
                                    value={testDriveData.feedback}
                                    onChange={(e) =>
                                      setTestDriveData({
                                        ...testDriveData,
                                        feedback: e.target.value,
                                      })
                                    }
                                    className="min-h-24"
                                  />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      setTestDriveDialogOpen(false)
                                    }
                                    className="w-full sm:w-auto"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto"
                                  >
                                    {submitting ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Save & Send Message"
                                    )}
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={
                              exitDialogOpen &&
                              selectedSession?.id === session.id
                            }
                            onOpenChange={setExitDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSession(session)}
                                className="w-full sm:w-auto text-xs sm:text-sm"
                              >
                                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                Exit Session
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg md:text-xl">
                                  Exit Session
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                  Mark session as completed and send a thank you
                                  WhatsApp message.
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={handleExitSubmit}
                                className="space-y-4 mt-4"
                              >
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="exitFeedback"
                                    className="text-sm"
                                  >
                                    Feedback
                                  </Label>
                                  <Textarea
                                    id="exitFeedback"
                                    placeholder="Any feedback from the visitor?"
                                    value={exitData.exitFeedback}
                                    onChange={(e) =>
                                      setExitData({
                                        ...exitData,
                                        exitFeedback: e.target.value,
                                      })
                                    }
                                    className="min-h-24"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor="exitRating"
                                    className="text-sm"
                                  >
                                    Rating (1-5)
                                  </Label>
                                  <Select
                                    value={exitData.exitRating}
                                    onValueChange={(value) =>
                                      setExitData({
                                        ...exitData,
                                        exitRating: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">
                                        1 - Poor
                                      </SelectItem>
                                      <SelectItem value="2">
                                        2 - Fair
                                      </SelectItem>
                                      <SelectItem value="3">
                                        3 - Good
                                      </SelectItem>
                                      <SelectItem value="4">
                                        4 - Very Good
                                      </SelectItem>
                                      <SelectItem value="5">
                                        5 - Excellent
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setExitDialogOpen(false)}
                                    className="w-full sm:w-auto"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto"
                                  >
                                    {submitting ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Exit & Send Message"
                                    )}
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
