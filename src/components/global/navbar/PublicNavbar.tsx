import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../assets/logo/logo.svg";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../../../util/constants.util.ts";
import { userServiceApi } from "../../../api/user.api.ts";

const NAVBAR_H = 56;

const AuthButtons = ({ isLoggedIn }: { isLoggedIn: boolean | null }) => {
  if (isLoggedIn === null) return null;

  if (isLoggedIn) {
    return (
      <div className="flex items-stretch" style={{ borderRadius: "9999px", border: "1px solid rgba(148,142,238,0.35)", overflow: "hidden", flexShrink: 0 }}>
        <Link
          to={ROUTES.DASHBOARD}
          className="px-4 py-2 text-sm font-semibold text-[#0E0F0C] bg-white hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center"
        >
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-stretch" style={{ borderRadius: "9999px", border: "1px solid rgba(148,142,238,0.35)", overflow: "hidden", flexShrink: 0 }}>
      <Link
        to={ROUTES.SIGNIN}
        className="px-4 py-2 text-sm font-semibold text-[#0E0F0C] bg-white hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center"
        style={{ borderRight: "1px solid rgba(148,142,238,0.25)" }}
      >
        Login
      </Link>
      <Link
        to={ROUTES.SIGNUP}
        className="px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap flex items-center"
        style={{ background: "#948EEE" }}
      >
        Sign up
      </Link>
    </div>
  );
};

export default function PublicNavbar({ innerClassName }: { innerClassName?: string } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // Add a 5s timeout to the ping check to ensure buttons eventually show
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );
        const { success } = (await Promise.race([
          userServiceApi.pingUser(),
          timeoutPromise,
        ])) as any;

        setIsLoggedIn(success);
        if (!success) localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      } catch (err) {
        console.error("Ping failed or timed out:", err);
        setIsLoggedIn(false);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      }
    };
    check();
  }, []);

  return (
    <>
      <div style={{ height: NAVBAR_H, position: "relative" }}>
        <AnimatePresence>
          {!scrolled && (
            <motion.header
              className="absolute inset-x-0 top-0 z-50 flex items-center justify-center"
              style={{ height: NAVBAR_H }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`w-full flex items-center justify-between px-4 ${innerClassName ?? ""}`}
              >
                <Link to={ROUTES.HOMEPAGE} className="flex-shrink-0">
                  <img src={Logo} alt="CryptoNow" className="h-8 w-auto" />
                </Link>
                <AuthButtons isLoggedIn={isLoggedIn} />
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            className="fixed z-50 inset-x-0 flex justify-center pointer-events-none"
            style={{ top: "12px" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <nav
              className="flex items-center justify-between pointer-events-auto"
              style={{
                height: "48px",
                width: "min(calc(100vw - 24px), 560px)",
                paddingLeft: "16px",
                paddingRight: "4px",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "9999px",
                border: "1px solid rgba(148,142,238,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Link to={ROUTES.HOMEPAGE} className="flex-shrink-0">
                <img src={Logo} alt="CryptoNow" className="h-6 w-auto" />
              </Link>
              <AuthButtons isLoggedIn={isLoggedIn} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
