"use client";

import { useState, useEffect } from "react";
import { usePermissions } from "@/contexts/permissions";
import { toast } from "sonner";

// Local imports
import { Session, VisitorFormData, VehicleCategory, Visitor } from "./types";
import { CACHE_KEYS, CACHE_DURATIONS } from "./constants";
import { getCachedData, getCacheAge } from "@/lib/cache";
import { useCategories } from "./hooks/useCategories";
import { useVisitors } from "./hooks/useVisitors";
import { useSessions } from "./hooks/useSessions";
import { DateFilterDialog } from "./components/DateFilterDialog";
import { VisitorDialog } from "./components/VisitorDialog";
import { VisitorsTab } from "./components/VisitorsTab";
import { VisitorDetailsModal } from "./components/VisitorDetailsModal";
import { TestDriveDialog } from "./components/TestDriveDialog";
import { FeedbackDialog } from "./components/FeedbackDialog";
import { ExitConfirmDialog } from "./components/ExitConfirmDialog";
import DailyWalkinsLoading from "./loading";

export default function DailyWalkinsPage() {
  const { hasPermission } = usePermissions();
  const canViewVisitors = hasPermission("dailyWalkinsVisitors");
  const canViewSessions = hasPermission("dailyWalkinsSessions");

  // Custom hooks
  const { categories, loading: categoriesLoading } = useCategories();
  const visitorsHook = useVisitors(canViewVisitors);
  const sessionsHook = useSessions(canViewSessions);

  // Dialog states
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false);
  const [visitorSubmitting, setVisitorSubmitting] = useState(false);
  const [visitorError, setVisitorError] = useState("");

  // Modal states for visitor details
  const [visitorDetailsModalOpen, setVisitorDetailsModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [modalRefreshTrigger, setModalRefreshTrigger] = useState(0);

  // Session-related states
  const [testDriveDialogOpen, setTestDriveDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [exitConfirmDialogOpen, setExitConfirmDialogOpen] = useState(false);
  const [sessionToExit, setSessionToExit] = useState<Session | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  // Initialize data with cache
  useEffect(() => {
    const cachedCategories = getCachedData<VehicleCategory[]>(
      CACHE_KEYS.CATEGORIES,
      CACHE_DURATIONS.CATEGORIES,
    );
    const cachedVisitors = getCachedData<Visitor[]>(
      CACHE_KEYS.VISITORS,
      CACHE_DURATIONS.VISITORS,
    );
    const cachedSessions = getCachedData<Session[]>(
      CACHE_KEYS.SESSIONS,
      CACHE_DURATIONS.SESSIONS,
    );

    const hasCache = cachedCategories || cachedVisitors || cachedSessions;

    if (hasCache) {
      // Cache age check for background refresh
      const cacheAge = getCacheAge(CACHE_KEYS.VISITORS);
      if (cacheAge < CACHE_DURATIONS.FRESH_THRESHOLD) {
        return; // Cache is fresh, no need to fetch
      }
    }

    // Fetch data
    visitorsHook.fetchVisitors(0, false, !!hasCache);
    sessionsHook.fetchSessions(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    visitorsHook.applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visitorsHook.dateFilter,
    visitorsHook.visitors,
    visitorsHook.searchQuery,
  ]);

  // Handlers
  const handleViewVisitorDetails = async (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setVisitorDetailsModalOpen(true);
  };

  const handleVisitorSubmit = async (formData: VisitorFormData) => {
    setVisitorSubmitting(true);
    setVisitorError("");

    if (!canViewVisitors) {
      toast.error("You don't have permission to create visitors");
      setVisitorSubmitting(false);
      return;
    }

    const result = await visitorsHook.createVisitor(formData);

    if (result.success) {
      setVisitorDialogOpen(false);
      // Refresh sessions in background
      sessionsHook.fetchSessions(0, false);
    } else {
      setVisitorError(result.error || "Failed to create visitor");
    }

    setVisitorSubmitting(false);
  };

  const handleTestDriveSubmit = async (
    sessionId: string,
    modelId: string,
    variantId?: string,
  ) => {
    setSessionSubmitting(true);
    const result = await sessionsHook.createTestDrive(
      sessionId,
      modelId,
      variantId,
    );

    if (result.success) {
      setTestDriveDialogOpen(false);
      setSelectedSession(null);
      // Trigger modal refresh
      setModalRefreshTrigger((prev) => prev + 1);
    }

    setSessionSubmitting(false);
  };

  const handleExitSession = (session: Session) => {
    setSessionToExit(session);
    setSelectedFeedback(null);
    setFeedbackDialogOpen(true);
  };

  const handleFeedbackSubmit = () => {
    setFeedbackDialogOpen(false);
    setExitConfirmDialogOpen(true);
  };

  const confirmExitSession = async () => {
    if (!sessionToExit) return;

    setExitConfirmDialogOpen(false);
    setSessionSubmitting(true);

    if (!canViewSessions) {
      toast.error("You don't have permission to exit sessions");
      setSessionSubmitting(false);
      return;
    }

    await sessionsHook.exitSession(sessionToExit.id, selectedFeedback);

    setSessionSubmitting(false);
    setSessionToExit(null);
    setSelectedFeedback(null);
    // Trigger modal refresh
    setModalRefreshTrigger((prev) => prev + 1);
  };

  if (categoriesLoading || visitorsHook.loading) {
    return <DailyWalkinsLoading />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-2 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Daily Walkins
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
              Manage daily walk-in visitors
            </p>
          </div>

          <DateFilterDialog
            open={dateFilterOpen}
            onOpenChange={setDateFilterOpen}
            dateFilter={visitorsHook.dateFilter}
            onDateFilterChange={visitorsHook.setDateFilter}
            onClearFilter={visitorsHook.clearDateFilter}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {canViewVisitors ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-end">
              <div className="w-full sm:w-auto order-2 sm:order-1" />
              <div className="order-1 sm:order-2">
                <VisitorDialog
                  open={visitorDialogOpen}
                  onOpenChange={setVisitorDialogOpen}
                  categories={categories}
                  onSubmit={handleVisitorSubmit}
                  submitting={visitorSubmitting}
                  error={visitorError}
                />
              </div>
            </div>

            <VisitorsTab
              visitors={visitorsHook.filteredVisitors}
              searchQuery={visitorsHook.searchQuery}
              onSearchChange={visitorsHook.setSearchQuery}
              onClearSearch={visitorsHook.clearSearch}
              currentPage={visitorsHook.visitorPage}
              totalItems={
                visitorsHook.hasMore
                  ? Math.max(
                      visitorsHook.totalVisitors,
                      visitorsHook.filteredVisitors.length,
                    )
                  : visitorsHook.filteredVisitors.length
              }
              onPageChange={visitorsHook.handleVisitorPageChange}
              pageLoading={visitorsHook.visitorPageLoading}
              phoneLookups={visitorsHook.phoneLookups}
              onViewDetails={handleViewVisitorDetails}
            />
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm sm:text-base">
              You don't have permission to view visitors.
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <VisitorDetailsModal
        open={visitorDetailsModalOpen}
        onOpenChange={setVisitorDetailsModalOpen}
        visitor={selectedVisitor}
        expandedSessions={sessionsHook.expandedSessions}
        onToggleSession={(sessionId, open) => {
          sessionsHook.setExpandedSessions((prev) => {
            const newSet = new Set(prev);
            if (open) {
              newSet.add(sessionId);
            } else {
              newSet.delete(sessionId);
            }
            return newSet;
          });
        }}
        onAddTestDrive={(session) => {
          setSelectedSession(session);
          setTestDriveDialogOpen(true);
        }}
        onExitSession={handleExitSession}
        sessionSubmitting={sessionSubmitting}
        refreshTrigger={modalRefreshTrigger}
      />

      <TestDriveDialog
        open={testDriveDialogOpen}
        onOpenChange={setTestDriveDialogOpen}
        session={selectedSession}
        categories={categories}
        onSubmit={handleTestDriveSubmit}
        submitting={sessionSubmitting}
      />

      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        selectedFeedback={selectedFeedback}
        onFeedbackSelect={setSelectedFeedback}
        onSubmit={handleFeedbackSubmit}
        onSkip={() => {
          setSelectedFeedback(null);
          handleFeedbackSubmit();
        }}
        onCancel={() => {
          setFeedbackDialogOpen(false);
          setSessionToExit(null);
          setSelectedFeedback(null);
        }}
      />

      <ExitConfirmDialog
        open={exitConfirmDialogOpen}
        onOpenChange={setExitConfirmDialogOpen}
        session={sessionToExit}
        submitting={sessionSubmitting}
        onConfirm={confirmExitSession}
        onCancel={() => {
          setExitConfirmDialogOpen(false);
          setSessionToExit(null);
          setSelectedFeedback(null);
        }}
      />
    </div>
  );
}
