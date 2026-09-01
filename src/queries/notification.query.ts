import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { QUERY_KEYS } from "./query.keys.ts";
import { notificationServiceApi } from "../api/notification.api.ts";
import { ROUTES, TIME_IN_MILLISECONDS } from "../util/constants.util.ts";

const NOTIFICATIONS_PAGE_SIZE = 10;

export const useNotificationQuery = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isDashboardShell =
    location.pathname === ROUTES.DASHBOARD ||
    location.pathname.startsWith(`${ROUTES.DASHBOARD}/`);
  const isNotificationsPage = location.pathname === ROUTES.NOTIFICATIONS;

  // Lightweight unread check. Must never block the rest of the dashboard from
  // loading, so failures resolve to "no new notifications" instead of throwing.
  //
  // Deliberately NOT polled — this was refetching every 10s regardless of
  // whether anything could plausibly have changed. It now only fetches at the
  // three moments that can actually produce a new notification:
  //  1. First load of any dashboard-shell page (React Query's default
  //     refetchOnMount behavior, since `enabled` flips true on mount there).
  //  2. Visiting the dedicated Notifications page — NotificationsContent.tsx
  //     fires markAllNotificationsReadMutation on mount, whose onSuccess below
  //     invalidates this same query key.
  //  3. Right after a transaction is submitted/completes — the relevant
  //     mutations in transaction.query.ts and the completion effect in
  //     DashboardTradeStep2.tsx invalidate this query key directly.
  const { data: hasNewNotifications, isLoading: loadingHasNewNotifications } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION.HAS_NEW],
    queryFn: async () => {
      try {
        const { data, success } = await notificationServiceApi.hasNewNotifications();
        return success ? data : { hasNew: false };
      } catch {
        return { hasNew: false };
      }
    },
    enabled: isDashboardShell,
    staleTime: TIME_IN_MILLISECONDS.TEN_SECONDS,
    retry: 1,
  });

  const {
    data: userNotificationsPages,
    isLoading: loadingUserNotifications,
    fetchNextPage: fetchMoreNotifications,
    hasNextPage: hasMoreNotifications,
    isFetchingNextPage: loadingMoreNotifications,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION.USER_LIST],
    queryFn: async ({ pageParam }) => {
      const { data, success } = await notificationServiceApi.getUserNotifications(
        pageParam,
        NOTIFICATIONS_PAGE_SIZE,
      );

      return success ? data : null;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: isNotificationsPage,
  });

  const userNotifications = userNotificationsPages?.pages.flatMap((page) => page?.notifications ?? []) ?? [];

  const markAllNotificationsReadMutation = useMutation({
    mutationKey: [QUERY_KEYS.NOTIFICATION.MARK_ALL_READ],
    mutationFn: async () => {
      return await notificationServiceApi.markAllNotificationsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATION.HAS_NEW] });
    },
  });

  return {
    hasNewNotifications,
    loadingHasNewNotifications,
    userNotifications,
    loadingUserNotifications,
    fetchMoreNotifications,
    hasMoreNotifications,
    loadingMoreNotifications,
    markAllNotificationsReadMutation,
  };
};
