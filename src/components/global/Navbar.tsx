"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Drawer, Typography } from "@material-tailwind/react";
import CustomButton from "./Button";
import Logo from "../../assets/logo/logo.svg";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleMenuItemClick = () => {
    closeDrawer();
  };

  return (
    <nav className="bg-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Wallet
          </a>

          {/* Dropdown for Buy & sell crypto */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              Buy & sell crypto
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Buy Crypto
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Sell Crypto
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Exchange
                </a>
              </div>
            )}
          </div>

          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Contact
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-gray-700 hover:text-gray-900 font-medium">
            Login
          </button>
          <CustomButton buttonText="Create Account" />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={openDrawer}
            className="text-gray-700 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
