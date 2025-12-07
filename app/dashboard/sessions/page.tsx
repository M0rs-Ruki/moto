"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Car, LogOut, Star } from "lucide-react";
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
}

interface VehicleModel {
  id: string;
  name: string;
  year: number | null;
}

interface VehicleCategory {
  id: string;
  name: string;
  models: VehicleModel[];
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [testDriveDialogOpen, setTestDriveDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Test drive form
  const [testDriveData, setTestDriveData] = useState({
    modelId: "",
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

  const fetchData = async () => {
    try {
      const [sessionsRes, categoriesRes] = await Promise.all([
        axios.get("/api/sessions"),
        axios.get("/api/categories"),
      ]);
      setSessions(sessionsRes.data.sessions);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    setSubmitting(true);
    try {
      await axios.post("/api/test-drives", {
        sessionId: selectedSession.id,
        ...testDriveData,
      });

      setTestDriveDialogOpen(false);
      setTestDriveData({ modelId: "", outcome: "", feedback: "" });
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
      fetchData();
    } catch (error) {
      console.error("Failed to exit session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Visitor Sessions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Manage test drives and session exits
        </p>
      </div>

      {/* Sessions List */}
      <div className="grid gap-6 grid-cols-1">
        {sessions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-sm sm:text-base text-muted-foreground text-center px-4 font-medium">
                No active sessions. Create a visitor to start a session.
              </p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent border-b">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">
                      {session.visitor.firstName} {session.visitor.lastName}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm truncate">
                      {session.visitor.whatsappNumber}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      session.status === "exited"
                        ? "default"
                        : session.status === "test_drive"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs flex-shrink-0"
                  >
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm pt-4">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="text-xs font-semibold text-muted-foreground uppercase min-w-fit">
                    Reason:
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    {session.reason}
                  </p>
                </div>

                {session.testDrives.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold mb-2">
                      Test Drives:
                    </p>
                    {session.testDrives.map((td) => (
                      <div
                        key={td.id}
                        className="text-xs sm:text-sm pl-4 border-l-2 mb-2"
                      >
                        <p className="font-medium truncate">
                          {td.model.category.name} - {td.model.name}
                        </p>
                        {td.outcome && (
                          <p className="text-muted-foreground">
                            Outcome: {td.outcome}
                          </p>
                        )}
                        {td.feedback && (
                          <p className="text-muted-foreground break-words">
                            Feedback: {td.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {session.exitFeedback && (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">
                      Exit Feedback:
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {session.exitFeedback}
                    </p>
                    {session.exitRating && (
                      <div className="flex items-center gap-1 mt-1">
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

                {session.status !== "exited" && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
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
                          <DialogTitle className="text-lg sm:text-xl">
                            Add Test Drive
                          </DialogTitle>
                          <DialogDescription className="text-xs sm:text-sm">
                            Record a test drive and send a follow-up WhatsApp
                            message.
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
                            <select
                              id="modelId"
                              className="w-full p-2 border rounded text-sm"
                              value={testDriveData.modelId}
                              onChange={(e) =>
                                setTestDriveData({
                                  ...testDriveData,
                                  modelId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">Select a model</option>
                              {categories.map((cat) => (
                                <optgroup key={cat.id} label={cat.name}>
                                  {cat.models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                      {model.name}{" "}
                                      {model.year ? `(${model.year})` : ""}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="outcome" className="text-sm">
                              Outcome
                            </Label>
                            <select
                              id="outcome"
                              className="w-full p-2 border rounded text-sm"
                              value={testDriveData.outcome}
                              onChange={(e) =>
                                setTestDriveData({
                                  ...testDriveData,
                                  outcome: e.target.value,
                                })
                              }
                            >
                              <option value="">Select outcome</option>
                              <option value="excellent">Excellent</option>
                              <option value="good">Good</option>
                              <option value="fair">Fair</option>
                              <option value="poor">Poor</option>
                            </select>
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
                              onClick={() => setTestDriveDialogOpen(false)}
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
                        exitDialogOpen && selectedSession?.id === session.id
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
                          <DialogTitle className="text-lg sm:text-xl">
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
                            <Label htmlFor="exitFeedback" className="text-sm">
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
                            <Label htmlFor="exitRating" className="text-sm">
                              Rating (1-5)
                            </Label>
                            <select
                              id="exitRating"
                              className="w-full p-2 border rounded text-sm"
                              value={exitData.exitRating}
                              onChange={(e) =>
                                setExitData({
                                  ...exitData,
                                  exitRating: e.target.value,
                                })
                              }
                            >
                              <option value="">Select rating</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>
                            </select>
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
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
