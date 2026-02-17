import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { updateSEO, SEO_CONFIGS, addStructuredData } from "../../util/seo.util";

/**
 * SEO Component that updates meta tags based on current route
 */
export default function SEO() {
  const location = useLocation();
  const pathname = location.pathname;
  // trigger PR
  useEffect(() => {
    // Get SEO config for current route or use default
    const seoConfig = SEO_CONFIGS[pathname] || SEO_CONFIGS["/"] || {};

    // Update meta tags
    updateSEO({
      ...seoConfig,
      url: `https://cryptonow.ng${pathname}`,
    });

    // Add structured data for homepage
    if (pathname === "/") {
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "FinancialService",
        name: "CryptoNow",
        alternateName: "CryptoNow NG",
        description:
          "Nigeria's leading cryptocurrency exchange platform for buying and selling Bitcoin, Ethereum, and other cryptocurrencies",
        url: "https://cryptonow.ng",
        logo: "https://cryptonow.ng/logo.svg",
        areaServed: {
          "@type": "Country",
          name: "Nigeria",
        },
        serviceType: "Cryptocurrency Exchange",
        offers: {
          "@type": "Offer",
          description: "Buy and sell cryptocurrencies with Naira",
        },
      });
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
