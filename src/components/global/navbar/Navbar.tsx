"use client";

import { useState, useRef, Fragment, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import Logo from "../../../assets/logo/logo.svg";
import NavbarDropdown from "./NavbarDropdown.tsx";
import type { DropItem } from "../../../types/navbar.types.ts";
import ProfileNav from "./ProfileNav.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../../../util/constants.util.ts";
import useClickOutside from "../../../hooks/useClickOutside.ts";
import { userServiceApi } from "../../../api/user.api.ts";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Do not render on dashboard pages — AuthenticatedLayout handles navigation there
  const isDashboard = location.pathname.startsWith("/dashboard");

  // Ping user to check authentication status
  useEffect(() => {
    if (isDashboard) return;

    const checkAuthentication = async () => {
      // Protected routes that require authentication
      // Transaction details page should be accessible to all users (authenticated and anonymous)
      const isTransactionDetailsPage = location.pathname.match(
        /^\/dashboard\/transactions\/[^/]+$/
      );

      const protectedRoutes = [
        ROUTES.DASHBOARD,
        ROUTES.PROFILE,
        ROUTES.TRANSACTION,
      ];

      const isProtectedRoute =
        !isTransactionDetailsPage &&
        protectedRoutes.some(
          (route) =>
            location.pathname.startsWith(route) ||
            location.pathname === route
        );

      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

      if (!accessToken) {
        setIsAuthenticated(false);
        // If on protected route and no token, redirect to signin
        if (isProtectedRoute) {
          navigate({ to: ROUTES.SIGNIN });
        }
        return;
      }

      try {
        const { success } = await userServiceApi.pingUser();

        if (!success) {
          // User is unauthenticated
          setIsAuthenticated(false);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

          // If on protected route, redirect to signin
          if (isProtectedRoute) {
            navigate({ to: ROUTES.SIGNIN });
          }
        } else {
          // User is authenticated
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Ping failed, treat as unauthenticated
        setIsAuthenticated(false);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

        // If on protected route, redirect to signin
        if (isProtectedRoute) {
          navigate({ to: ROUTES.SIGNIN });
        }
      }
    };

    checkAuthentication();
  }, [location.pathname, navigate, isDashboard]);

  // Return null early for dashboard pages
  if (isDashboard) return null;

  // Use authenticated state, fallback to token check if state is null
  const isLoggedIn =
    isAuthenticated ??
    localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) !== null;

  const dropItems: DropItem[] = [
    {
      text: "buy",
      id: 1,
    },
    {
      text: "sell",
      id: 2,
    },
  ];

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
    closeDrawer();
  };

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    setIsAuthenticated(false);
    navigate({ to: ROUTES.HOMEPAGE });
  };

  return (
    <>
      <nav
        className="bg-white px-3 md:px-0 py-3"
        style={{ borderBottom: "1px solid #ECECEC" }}
      >
        <div className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOMEPAGE}>
              <img src={Logo} alt="CryptoNow" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center space-x-8">
            <a
              href={ROUTES.HOMEPAGE}
              className="font-medium transition-colors"
              style={{ color: "#03034D" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              Home
            </a>

            <a
              href={ROUTES.RATES}
              className="font-medium transition-colors"
              style={{ color: "#03034D" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              Rates
            </a>

            {/* Dropdown for Buy & sell crypto */}
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 font-medium transition-colors"
                    style={{ color: "#03034D" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.opacity =
                        "0.7")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.opacity =
                        "1")
                    }
                  >
                    Buy & sell crypto
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  {isDropdownOpen && <NavbarDropdown dropItems={dropItems} />}
                </>
              ) : (
                <a
                  href={ROUTES.SIGNUP}
                  className="font-medium transition-colors"
                  style={{ color: "#03034D" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.opacity =
                      "0.7")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.opacity =
                      "1")
                  }
                >
                  Finish setup to start trading
                </a>
              )}
            </div>

            <a
              href={ROUTES.ABOUT}
              className="font-medium transition-colors"
              style={{ color: "#03034D" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              About
            </a>
            <a
              href={ROUTES.CONTACT}
              className="font-medium transition-colors"
              style={{ color: "#03034D" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
            >
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <>
              {location.pathname === ROUTES.HOMEPAGE ? (
                <a
                  href={ROUTES.DASHBOARD}
                  className="font-medium hidden xl:block transition-colors"
                  style={{ color: "#03034D" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.opacity =
                      "0.7")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.opacity =
                      "1")
                  }
                >
                  Dashboard
                </a>
              ) : (
                <div className="hidden xl:block">
                  <ProfileNav />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="hidden xl:flex items-center space-x-4">
                <Link
                  to={ROUTES.SIGNIN}
                  className="font-medium transition-colors"
                  style={{ color: "#03034D" }}
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.SIGNUP}
                  className="rounded-full text-white font-medium px-6 py-3 inline-block text-center transition-opacity hover:opacity-90"
                  style={{ background: "#948EEE" }}
                >
                  Create Account
                </Link>
              </div>
            </>
          )}

          {/* Mobile menu button */}
          <div className="flex gap-x-2 items-center xl:hidden">
            {isLoggedIn && <ProfileNav />}

            <div>
              <button
                onClick={openDrawer}
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#03034D" }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom Drawer */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-xl font-semibold"
              style={{ color: "#0E0F0C" }}
            >
              Menu
            </h2>
            <button
              onClick={closeDrawer}
              className="transition-opacity hover:opacity-60"
              style={{ color: "#6B6E6B" }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            {isLoggedIn && (
              <Fragment>
                <a
                  href={ROUTES.DASHBOARD}
                  onClick={handleMenuItemClick}
                  className="font-medium py-2 border-b border-gray-100 transition-opacity hover:opacity-70"
                  style={{ color: "#03034D" }}
                >
                  Dashboard
                </a>
                <a
                  href={ROUTES.PROFILE}
                  onClick={handleMenuItemClick}
                  className="font-medium py-2 border-b border-gray-100 transition-opacity hover:opacity-70"
                  style={{ color: "#03034D" }}
                >
                  Profile
                </a>
              </Fragment>
            )}

            <a
              href={ROUTES.RATES}
              onClick={handleMenuItemClick}
              className="font-medium py-2 border-b border-gray-100 transition-opacity hover:opacity-70"
              style={{ color: "#03034D" }}
            >
              Rates
            </a>

            <a
              href={ROUTES.CONTACT}
              onClick={handleMenuItemClick}
              className="font-medium py-2 border-b border-gray-100 transition-opacity hover:opacity-70"
              style={{ color: "#03034D" }}
            >
              Contact
            </a>

            <a
              href={ROUTES.HOMEPAGE}
              onClick={handleMenuItemClick}
              className="font-medium py-2 border-b border-gray-100 transition-opacity hover:opacity-70"
              style={{ color: "#03034D" }}
            >
              Home
            </a>

            {/* Auth Buttons in Mobile Drawer */}
            {isLoggedIn ? (
              <div className="absolute bottom-5">
                <button
                  type="button"
                  className="text-lg cursor-pointer font-bold transition-opacity hover:opacity-70"
                  style={{ color: "#03034D" }}
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="absolute bottom-5 space-y-1 w-4/5">
                <button
                  onClick={() => navigate({ to: ROUTES.SIGNIN })}
                  className="font-medium py-2 w-full text-center border rounded-3xl px-4 transition-colors duration-200 my-3 hover:cursor-pointer hover:bg-gray-50"
                  style={{ color: "#03034D", borderColor: "#ECECEC" }}
                >
                  Login
                </button>

                <div className="w-full mt-3">
                  <Link
                    to={ROUTES.SIGNUP}
                    className="w-full rounded-full text-white font-medium px-6 py-3 inline-block text-center transition-opacity hover:opacity-90"
                    style={{ background: "#948EEE" }}
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
