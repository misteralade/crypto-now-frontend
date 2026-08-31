import { type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, User, LogOut, Settings, Wallet, History, Bell } from "lucide-react";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";
import { useUserQuery } from "../queries/user.query.ts";
import { useNotificationQuery } from "../queries/notification.query.ts";
import { clearUserSessionStorage } from "../util/tradeProgress.storage.util.ts";
import Logo from "../assets/logo/logo.svg";
import PageTransition from "../components/global/PageTransition.tsx";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

/* ─── bottom tab config ─────────────────────────────────────── */
const mobileTabs = [
  { to: ROUTES.DASHBOARD, label: "Home",    icon: LayoutDashboard, exact: true },
  { to: ROUTES.PROFILE,   label: "Profile", icon: User,            exact: false },
];

/* ─── desktop sidebar config ────────────────────────────────── */
const sidebarNav = [
  { to: ROUTES.DASHBOARD,         label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { to: ROUTES.DASHBOARD_WALLETS, label: "Wallets",    icon: Wallet,          exact: false },
  { to: ROUTES.TRANSACTION,       label: "History",    icon: History,         exact: false },
  { to: ROUTES.PROFILE,           label: "Settings",   icon: Settings,        exact: false },
];

const getPageTitle = (pathname: string) => {
  if (pathname === ROUTES.DASHBOARD) return "Home";
  if (pathname.startsWith(ROUTES.DASHBOARD_WALLETS)) return "Wallets";
  if (pathname.startsWith(ROUTES.TRANSACTION)) return "History";
  if (pathname.startsWith(ROUTES.PROFILE)) return "Profile";
  return "Home";
};

const getInitials = (firstName?: string, lastName?: string) => {
  const f = firstName?.[0]?.toUpperCase() ?? "";
  const l = lastName?.[0]?.toUpperCase() ?? "";
  return (f + l) || "U";
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { userProfileData } = useUserQuery();
  const { hasNewNotifications } = useNotificationQuery();

  const initials  = getInitials(userProfileData?.profile?.firstName, userProfileData?.profile?.lastName);
  const fullName  = userProfileData?.profile?.firstName
    ? `${userProfileData.profile.firstName} ${userProfileData.profile.lastName ?? ""}`.trim()
    : "Account";
  const email     = userProfileData?.email ?? "";
  const pageTitle = getPageTitle(location.pathname);

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const handleLogout = () => {
    clearUserSessionStorage();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.HOMEPAGE });
  };

  // Profile subpages already include their own section headers on desktop.
  const shouldHideDesktopPageHeader = location.pathname.startsWith(ROUTES.PROFILE);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>

      {/* ══════════════════════════════════════
          DESKTOP — fixed sidebar (chrome only — content renders once, below)
      ══════════════════════════════════════ */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col"
        style={{ background: "#03034D", zIndex: 50 }}>

        {/* logo */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link to={ROUTES.HOMEPAGE} preload="intent">
            <img src={Logo} alt="CryptoNow" className="h-7 w-auto brightness-0 invert" />
          </Link>
        </div>

        {/* nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
          {sidebarNav.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link key={to} to={to} preload="intent"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
                style={{
                  background: active ? "rgba(148,142,238,0.18)" : "transparent",
                  color: active ? "#C8C5F8" : "rgba(255,255,255,0.5)",
                }}
              >
                <Icon size={17} />
                {label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#948EEE]" />}
              </Link>
            );
          })}
        </nav>

        {/* user + logout */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#948EEE,#575AE5)" }}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{fullName}</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.38)" }}>{email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#EB5757"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(235,87,87,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          DESKTOP — sticky top bar (chrome only)
      ══════════════════════════════════════ */}
      <div className="hidden lg:block lg:pl-60">
        {!shouldHideDesktopPageHeader && (
          <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-8"
            style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
            <h1 className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>{pageTitle}</h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: ROUTES.NOTIFICATIONS })}
                aria-label="View notifications"
                className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-50 active:scale-[0.96]"
                style={{ background: "#F7F7F9" }}
              >
                <Bell size={16} style={{ color: "#0E0F0C" }} />
                {hasNewNotifications?.hasNew ? (
                  <span
                    className="absolute top-1 right-1 min-w-[6px] h-1.5 px-0.5 rounded-full bg-[#EB5757] border border-white"
                    aria-hidden
                  />
                ) : null}
              </button>

              <Link to={ROUTES.PROFILE} preload="intent">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.96]"
                  style={{ background: "linear-gradient(135deg,#948EEE,#575AE5)" }}>
                  {initials}
                </div>
              </Link>
            </div>
          </header>
        ) }
      </div>

      {/* ══════════════════════════════════════
          CONTENT — rendered exactly once wrapped in PageTransition.
      ══════════════════════════════════════ */}
      <main className="pb-[72px] lg:pb-8 lg:pl-[272px] lg:pt-8 lg:pr-8 overflow-hidden">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* ══════════════════════════════════════
          MOBILE — bottom tab bar (chrome only)
      ══════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F0F0F0",
          height: "64px",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
        }}>
        {mobileTabs.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link key={to} to={to} preload="intent"
              className="flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-[0.95] transition-transform"
              style={{ color: active ? "#948EEE" : "#BDBDBD" }}>
              <Icon size={21} strokeWidth={active ? 2.2 : 1.7} />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              {active && (
                <span className="absolute bottom-2.5 w-1 h-1 rounded-full bg-[#948EEE]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
