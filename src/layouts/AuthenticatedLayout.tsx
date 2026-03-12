import { type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, History, User, LogOut, TrendingUp, Bell } from "lucide-react";
import { ROUTES, LOCAL_STORAGE_KEYS } from "../util/constants.util.ts";
import { useUserQuery } from "../queries/user.query.ts";
import Logo from "../assets/logo/logo.svg";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.TRANSACTION, label: "History", icon: History },
  { to: ROUTES.TRADE_CRYPTO, label: "Trade", icon: TrendingUp },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
];

const mobileTabs = [
  { to: ROUTES.DASHBOARD, label: "Home", icon: LayoutDashboard },
  { to: ROUTES.TRANSACTION, label: "History", icon: History },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
];

const pageTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.TRANSACTION]: "Transaction History",
  [ROUTES.PROFILE]: "Account Settings",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [route, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(route) && route !== ROUTES.DASHBOARD) {
      return title;
    }
  }
  return "Dashboard";
}

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? "";
  const last = lastName?.charAt(0)?.toUpperCase() ?? "";
  return first + last || "U";
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfileData } = useUserQuery();

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.HOMEPAGE });
  };

  const pageTitle = getPageTitle(location.pathname);
  const initials = getInitials(
    userProfileData?.profile?.firstName,
    userProfileData?.profile?.lastName
  );

  const isNavActive = (to: string): boolean => {
    if (to === ROUTES.DASHBOARD) {
      return location.pathname === ROUTES.DASHBOARD;
    }
    return location.pathname === to || location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F4F5F7" }}>

      {/* DESKTOP SIDEBAR — hidden on mobile */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col"
        style={{ background: "#03034D", zIndex: 40 }}
      >
        {/* Logo area */}
        <div
          className="p-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Link to={ROUTES.HOMEPAGE}>
            <img src={Logo} alt="CryptoNow" className="h-7 w-auto brightness-0 invert" />
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isNavActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150 font-medium text-sm"
                style={{
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  color: active ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(255,255,255,0.55)";
                  }
                }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user info + logout */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* User info */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-sm font-semibold text-white"
              style={{ background: "#575AE5" }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {userProfileData?.profile?.firstName
                  ? `${userProfileData.profile.firstName} ${userProfileData.profile.lastName || ""}`.trim()
                  : "Account"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {userProfileData?.email ?? ""}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.55)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.55)";
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="lg:pl-64">

        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-white border-b border-[#ECECEC] sticky top-0 z-30">
          {/* Page title */}
          <h1 className="text-base font-semibold" style={{ color: "#0E0F0C" }}>
            {pageTitle}
          </h1>

          {/* Right: bell + avatar */}
          <div className="flex items-center gap-4">
            {/* Notification bell — TODO: connect to real notification count */}
            <button
              className="relative p-2 rounded-full transition-colors hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell size={20} style={{ color: "#6B6E6B" }} />
              {/* Static red dot badge */}
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#EB5757" }}
              />
            </button>

            {/* Profile avatar button */}
            <Link to={ROUTES.PROFILE}>
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: "#575AE5" }}
              >
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-center"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #ECECEC",
          height: "64px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {mobileTabs.map((tab) => {
          const active = isNavActive(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
              style={{ color: active ? "#948EEE" : "#9A9A9A" }}
            >
              <tab.icon size={22} />
              <span className="text-[10px] font-medium leading-tight">
                {tab.label}
              </span>
              {active && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: "#948EEE" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AuthenticatedLayout;
