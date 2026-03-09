import { Link } from "@tanstack/react-router";
import HeroSectionNew from "../components/pages/homepage/HeroSectionNew.tsx";
import { ROUTES } from "../util/constants.util.ts";

const HeroNavbar = () => (
  <nav
    className="fixed top-4 left-1/2 z-50 flex items-center justify-between px-5 py-3"
    style={{
      transform: "translateX(-50%)",
      width: "min(92vw, 860px)",
      background: "rgba(255, 255, 255, 0.72)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: "9999px",
      border: "1px solid rgba(148, 142, 238, 0.18)",
      boxShadow:
        "0 2px 12px rgba(3, 3, 77, 0.05), 0 1px 3px rgba(148, 142, 238, 0.07), inset 0 1px 0 rgba(255,255,255,0.7)",
    }}
  >
    {/* Logo */}
    <Link to={ROUTES.HOMEPAGE}>
      <img src="/logo.svg" alt="CryptoNow" className="h-8 w-auto" />
    </Link>

    {/* Auth buttons — joined pill group */}
    <div
      className="flex items-stretch overflow-hidden"
      style={{
        borderRadius: "9999px",
        border: "1px solid rgba(148, 142, 238, 0.35)",
        boxShadow:
          "0 2px 8px rgba(148, 142, 238, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <Link
        to={ROUTES.SIGNIN}
        className="px-6 py-2.5 text-sm font-semibold text-[#0E0F0C] transition-colors border-r border-[#948EEE]/30 hover:bg-white/80"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,240,232,0.85) 100%)",
          textShadow: "0 1px 0 rgba(255,255,255,0.8)",
          borderRadius: "9999px 0 0 9999px",
        }}
      >
        Login
      </Link>
      <Link
        to={ROUTES.SIGNUP}
        className="px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{
          background:
            "linear-gradient(135deg, #a8a4f0 0%, #948EEE 50%, #7b74e8 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          borderRadius: "0 9999px 9999px 0",
        }}
      >
        Sign up
      </Link>
    </div>
  </nav>
);

const HeroPreviewPage = () => {
  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh" }}>
      <HeroNavbar />
      <div style={{ paddingTop: "80px" }}>
      <HeroSectionNew />
      </div>
    </div>
  );
};

export default HeroPreviewPage;
