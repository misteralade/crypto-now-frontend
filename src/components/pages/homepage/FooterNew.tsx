import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import { ROUTES } from "../../../util/constants.util.ts";

const currentYear = new Date().getFullYear();

const colHead = {
  color: "rgba(255,255,255,0.3)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  marginBottom: "16px",
};

const linkStyle = {
  color: "rgba(255,255,255,0.55)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  textDecoration: "none",
  transition: "color 0.2s",
};

const FooterLink = ({
  href,
  to,
  children,
}: {
  href?: string;
  to?: string;
  children: React.ReactNode;
}) => {
  const cls =
    "block mb-3 text-sm transition-colors hover:text-[#948EEE]";
  if (to) {
    return (
      <Link to={to} className={cls} style={linkStyle}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={linkStyle}>
      {children}
    </a>
  );
};

const FooterNew = () => (
  <footer
    className="relative overflow-hidden"
    style={{ background: "#0E0F0C" }}
  >
    {/* Giant decorative wordmark */}
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none whitespace-nowrap"
      style={{
        fontSize: "clamp(72px, 14vw, 160px)",
        fontWeight: 800,
        fontFamily: "'DM Sans', sans-serif",
        color: "rgba(255,255,255,0.04)",
        lineHeight: 1,
        letterSpacing: "-0.03em",
        zIndex: 0,
        bottom: "-0.15em",
      }}
      aria-hidden
    >
      CryptoNow
    </div>

    {/* Divider from FAQ */}
    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

    {/* Main footer content */}
    <div className="relative z-10 max-w-6xl mx-auto px-4 pt-14 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <img src="/logo.svg" alt="CryptoNow" className="h-7 w-auto mb-4 brightness-0 invert" />
          <p
            className="text-sm leading-relaxed mb-5 max-w-[200px]"
            style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Buy &amp; sell crypto with Naira. Fast, simple, no account needed.
          </p>

          {/* Social icons */}
          <div className="flex gap-3">
            {([
              { href: ROUTES.SOCIALS.TIK_TOK, Icon: FaTiktok },
              { href: ROUTES.SOCIALS.INSTAGRAM, Icon: FaInstagram },
              { href: ROUTES.SOCIALS.TWITTER, Icon: FaTwitter },
              { href: ROUTES.SOCIALS.FACEBOOK, Icon: FaFacebookF },
              { href: ROUTES.SOCIALS.WHATSAPP, Icon: FaWhatsapp },
            ] as const).map(({ href, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 12px rgba(148,142,238,0.45)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(148,142,238,0.5)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#948EEE";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)";
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Product */}
        <div>
          <p style={colHead}>Product</p>
          <FooterLink to={ROUTES.TRADE_CRYPTO}>Trade</FooterLink>
          <FooterLink to={ROUTES.RATES}>Rates</FooterLink>
          <FooterLink to={ROUTES.SIGNUP}>Sign Up</FooterLink>
          <FooterLink to={ROUTES.SIGNIN}>Login</FooterLink>
        </div>

        {/* Support */}
        <div>
          <p style={colHead}>Support</p>
          <FooterLink href={`${ROUTES.HOMEPAGE}#${ROUTES.HOMEPAGE_TAG_IDS.FAQ}`}>FAQs</FooterLink>
          <FooterLink href={`${ROUTES.HOMEPAGE}#${ROUTES.HOMEPAGE_TAG_IDS.HOW_IT_WORKS}`}>How it works</FooterLink>
          <FooterLink to={ROUTES.CONTACT}>Contact</FooterLink>
          <FooterLink href={ROUTES.SOCIALS.WHATSAPP}>WhatsApp</FooterLink>
        </div>

        {/* Legal */}
        <div>
          <p style={colHead}>Legal</p>
          <FooterLink to={ROUTES.TERMS_OF_SERVICES}>Terms of Service</FooterLink>
          <FooterLink to={ROUTES.PRIVACY_POLICY}>Privacy Policy</FooterLink>
          <FooterLink to={ROUTES.SECURITY_POLICY}>Security Policy</FooterLink>
          <FooterLink href={ROUTES.AML_POLICY}>AML / Compliance</FooterLink>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p
          className="text-xs"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}
        >
          © {currentYear} CryptoNow. All rights reserved.
        </p>
        <p
          className="text-xs"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Built in Nigeria 🇳🇬
        </p>
      </div>
    </div>
  </footer>
);

export default FooterNew;
