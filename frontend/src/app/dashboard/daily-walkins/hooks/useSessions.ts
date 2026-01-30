import { useState, useCallback } from "react";
import { Session } from "../types";
import { SESSION_PAGE_SIZE, CACHE_KEYS, CACHE_DURATIONS } from "../constants";
import { getCachedData, setCachedData } from "@/lib/cache";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export function useSessions(canViewSessions: boolean) {
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionPageLoading, setSessionPageLoading] = useState(false);
  const [sessionsHasMore, setSessionsHasMore] = useState(false);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  );
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set(),
  );

  const fetchSessions = async (
    skip: number = 0,
    append: boolean = false,
    visitorIdOverride?: string | null,
  ) => {
    if (!canViewSessions) return;

    if (!append) {
      setLoadingSessions(true);
    } else {
      setSessionPageLoading(true);
    }

    try {
      const visitorId =
        visitorIdOverride !== undefined ? visitorIdOverride : selectedVisitorId;
      const visitorIdParam = visitorId ? `&visitorId=${visitorId}` : "";
      const response = await apiClient.get(
        `/sessions?limit=${SESSION_PAGE_SIZE}&skip=${skip}${visitorIdParam}`,
      );

      if (append) {
        setAllSessions([...allSessions, ...(response.data.sessions || [])]);
      } else {
        setAllSessions(response.data.sessions || []);
        setSessionPage(1);
        if (!visitorId) {
          setCachedData(CACHE_KEYS.SESSIONS, response.data.sessions || []);
        }
      }

      setSessionsHasMore(response.data.hasMore || false);
      setSessionsTotal(
        response.data.total || response.data.sessions?.length || 0,
      );
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      if (!append) {
        setAllSessions([]);
      }
    } finally {
      setLoadingSessions(false);
      setSessionPageLoading(false);
    }
  };

  const handleSessionPageChange = async (page: number) => {
    const currentSessions = selectedVisitorId
      ? allSessions.filter((s) => s.visitor.id === selectedVisitorId)
      : allSessions;

    const totalPages = Math.max(
      1,
      Math.ceil(
        (sessionsHasMore
          ? Math.max(sessionsTotal, currentSessions.length)
          : currentSessions.length) / SESSION_PAGE_SIZE,
      ),
    );
    const targetPage = Math.min(Math.max(page, 1), totalPages);

    if (
      targetPage * SESSION_PAGE_SIZE <= currentSessions.length ||
      !sessionsHasMore
    ) {
      setSessionPage(targetPage);
      return;
    }

    if (sessionsHasMore && !sessionPageLoading) {
      await fetchSessions(allSessions.length, true);
      setSessionPage(targetPage);
    }
  };

  const exitSession = async (sessionId: string, feedback: string | null) => {
    try {
      const response = await apiClient.post("/sessions/exit", {
        sessionId,
        feedback,
      });

      if (response.data.success) {
        const updatedSession = response.data.session;

        // Immediate UI update
        setAllSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, ...updatedSession } : s,
          ),
        );

        // Update cache
        const cached = getCachedData<Session[]>(
          CACHE_KEYS.SESSIONS,
          CACHE_DURATIONS.SESSIONS,
        );
        if (cached) {
          const updatedCache = cached.map((s) =>
            s.id === sessionId ? { ...s, ...updatedSession } : s,
          );
          setCachedData(CACHE_KEYS.SESSIONS, updatedCache);
        }

        // Background refetch
        fetchSessions(0, false);

        return { success: true };
      } else {
        throw new Error(response.data.error || "Failed to exit session");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to exit session. Please try again.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const createTestDrive = async (
    sessionId: string,
    modelId: string,
    variantId?: string,
  ) => {
    try {
      const response = await apiClient.post("/test-drives", {
        sessionId,
        modelId,
        variantId: variantId || undefined,
      });

      if (response.data.success) {
        // Refresh sessions
        await fetchSessions();
        return { success: true };
      } else {
        throw new Error(response.data.error || "Failed to create test drive");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create test drive. Please try again.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleViewSessions = useCallback(
    async (visitorId: string) => {
      setSelectedVisitorId(visitorId);
      setSessionPage(1);
      await fetchSessions(0, false, visitorId);

      // Expand latest session
      const visitorSessions = allSessions
        .filter((s) => s.visitor.id === visitorId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      if (visitorSessions.length > 0) {
        setExpandedSessions(new Set([visitorSessions[0].id]));
      }
    },
    [allSessions],
  );

  return {
    allSessions,
    loadingSessions,
    sessionPage,
    setSessionPage,
    sessionPageLoading,
    sessionsHasMore,
    sessionsTotal,
    selectedVisitorId,
    expandedSessions,
    setSelectedVisitorId,
    setExpandedSessions,
    fetchSessions,
    handleSessionPageChange,
    exitSession,
    createTestDrive,
    handleViewSessions,
  };
}
