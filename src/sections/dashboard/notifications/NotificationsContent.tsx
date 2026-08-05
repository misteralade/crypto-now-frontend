import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import moment from "moment";
import { Bell, ChevronLeft } from "lucide-react";
import { useNotificationQuery } from "../../../queries/notification.query.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import type { NotificationResponseEntity } from "../../../types/response.payload.types.ts";

function NotificationRow({ notification }: { notification: NotificationResponseEntity }) {
  return (
    <div className="w-full px-4 py-3.5 flex items-start gap-3">
      <div
        className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "#F0EFFD" }}
      >
        <Bell size={15} style={{ color: "#948EEE" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug" style={{ color: "#0E0F0C" }}>
          {notification.title}
        </p>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#6B6E6B" }}>
          {notification.message}
        </p>
        <p className="text-[11px] mt-1" style={{ color: "#9A9A9A" }}>
          {moment(notification.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}

export default function NotificationsContent() {
  const navigate = useNavigate();
  const {
    userNotifications,
    loadingUserNotifications,
    fetchMoreNotifications,
    hasMoreNotifications,
    loadingMoreNotifications,
    markAllNotificationsReadMutation,
  } = useNotificationQuery();

  // Fire a single request marking every notification as read on entry. We don't
  // track per-item read state, so this is the only "read" write in the feature.
  useEffect(() => {
    markAllNotificationsReadMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifications = userNotifications;

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: ROUTES.DASHBOARD })}
          aria-label="Back to dashboard"
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#F7F7F9" }}
        >
          <ChevronLeft size={18} style={{ color: "#0E0F0C" }} />
        </button>
        <h2
          className="text-lg font-extrabold"
          style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}
        >
          Notifications
        </h2>
      </div>

      <div className="px-5">
        {loadingUserNotifications ? (
          <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-4 py-3.5 flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-2xl shrink-0 animate-pulse"
                  style={{ background: "#F0F0F0" }}
                />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded animate-pulse" style={{ width: "60%", background: "#EEEEEE" }} />
                  <div className="h-3 rounded animate-pulse" style={{ width: "90%", background: "#EEEEEE" }} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div
            className="rounded-3xl px-6 py-10 flex flex-col items-center gap-3 text-center"
            style={{ border: "1px solid #F0F0F0" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "#F0EFFD" }}
            >
              <Bell size={20} style={{ color: "#948EEE" }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
              No notifications yet
            </p>
            <p className="text-xs" style={{ color: "#9A9A9A" }}>
              Updates about your orders and account will show up here
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
              {notifications.map((notification, i) => (
                <div key={notification.id}>
                  <NotificationRow notification={notification} />
                  {i < notifications.length - 1 && (
                    <div style={{ height: "1px", background: "#F7F7F9", margin: "0 16px" }} />
                  )}
                </div>
              ))}
            </div>

            {hasMoreNotifications && (
              <div className="flex items-center justify-center mt-4">
                <button
                  type="button"
                  onClick={() => fetchMoreNotifications()}
                  disabled={loadingMoreNotifications}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold disabled:opacity-50"
                  style={{ background: "#F0EFFD", color: "#575AE5" }}
                >
                  {loadingMoreNotifications ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
