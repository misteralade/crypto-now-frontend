"use client";

import {useState, useRef, Fragment} from "react";
import { Menu } from "lucide-react";
import Button from "../Button.tsx";
import Logo from "../../../assets/logo/logo.svg";
import { Link } from "@tanstack/react-router";
import NavbarDropdown from "./NavbarDropdown.tsx";
import { ChevronDown } from "lucide-react";
import type { DropItem } from "../../../types/navbar.types.ts";
import ProfileNav from "./ProfileNav.tsx";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../../util/constants.util.ts";
import { handleLogout } from "../../../util/index.util.ts";
import useClickOutside from "../../../hooks/useClickOutside.ts";
import { useLocation } from "@tanstack/react-router";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isLoggedIn =
    localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) !== null;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  return (
    <>
      <nav className="bg-white px-3 md:px-0 py-3">
        <div className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src={Logo} />
          </div>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center space-x-8">
            <a
              href={ROUTES.HOMEPAGE}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </a>

            {/* Dropdown for Buy & sell crypto */}
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Buy & sell crypto
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  {isDropdownOpen && <NavbarDropdown dropItems={dropItems} />}
                </>
              ) : (
                <a
                  href={ROUTES.SIGNUP}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Finish setup to start trading
                </a>
              )}
            </div>

            <a
              href={ROUTES.ABOUT}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </a>
            <a
              href={ROUTES.CONTACT}
              className="text-gray-700 hover:text-gray-900 font-medium"
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
                  className="text-gray-700 hover:text-gray-900 font-medium hidden xl:block"
                >
                  Dashboard
                </a>
              ) : (
                <div className={`hidden xl:block`}>
                  <ProfileNav />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="hidden xl:flex items-center space-x-4">
                <Link
                  to={ROUTES.SIGNIN}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button buttonText="Create Account" />
                </Link>
              </div>
            </>
          )}

          {/* Mobile menu button */}
          <div className={`flex gap-x-2 items-center xl:hidden`}>
            {isLoggedIn && <ProfileNav />}

            <div>
              <button
                onClick={openDrawer}
                className="text-gray-700 hover:text-gray-900"
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
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              onClick={closeDrawer}
              className="text-gray-500 hover:text-gray-700"
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
                  className="text-gray-700 hover:text-gray-900 font-medium py-2 border-b border-gray-100"
                >
                  Dashboard
                </a>
                <a
                  href={ROUTES.PROFILE}
                  onClick={handleMenuItemClick}
                  className="text-gray-700 hover:text-gray-900 font-medium py-2 border-b border-gray-100"
                >
                  Profile
                </a>
              </Fragment>
            )}
            <a
              href={ROUTES.CONTACT}
              onClick={handleMenuItemClick}
              className="text-gray-700 hover:text-gray-900 font-medium py-2 border-b border-gray-100"
            >
              Contact
            </a>

            {/* Auth Buttons in Mobile Drawer */}
            {isLoggedIn ? (
              <div className={`absolute bottom-5`}>
                <button
                  type={`button`}
                  className={`text-lg cursor-pointer text-grey font-bold`}
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="absolute bottom-5 space-y-1 w-4/5">
                <button className="text-gray-700 hover:text-gray-900 font-medium py-2 w-full text-left border border-gray-300 rounded-3xl px-4 hover:bg-gray-50 transition-colors duration-200 my-3">
                  <Link to={ROUTES.SIGNIN}>Login</Link>
                </button>

                <div className="w-full mt-3">
                  <Link to={ROUTES.SIGNUP}>
                    <Button className="w-full" buttonText="Create Account" />
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
