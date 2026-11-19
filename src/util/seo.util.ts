/**
 * SEO Utility for managing meta tags dynamically
 */

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const DEFAULT_SITE_NAME = 'CryptoNow';
const DEFAULT_SITE_URL = 'https://cryptonow.ng';
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/logo.svg`;

/**
 * Updates meta tags in the document head
 */
export function updateSEO(data: SEOData) {
  const {
    title,
    description,
    keywords,
    image = DEFAULT_IMAGE,
    url = DEFAULT_SITE_URL,
    type = 'website',
    noindex = false,
  } = data;

  // Update or create title
  if (title) {
    document.title = `${title} | ${DEFAULT_SITE_NAME}`;
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('name', 'twitter:title', title);
  }

  // Update description
  if (description) {
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('name', 'twitter:description', description);
  }

  // Update keywords
  if (keywords) {
    updateMetaTag('name', 'keywords', keywords);
  }

  // Update image
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('name', 'twitter:image', image);

  // Update URL
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('property', 'twitter:url', url);
  updateCanonicalLink(url);

  // Update type
  updateMetaTag('property', 'og:type', type);

  // Update robots
  if (noindex) {
    updateMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    updateMetaTag('name', 'robots', 'index, follow');
  }
}

/**
 * Helper function to update or create a meta tag
 */
function updateMetaTag(
  attribute: 'name' | 'property',
  value: string,
  content: string
) {
  let meta = document.querySelector(
    `meta[${attribute}="${value}"]`
  ) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

/**
 * Updates the canonical link
 */
function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
}

/**
 * Adds structured data (JSON-LD) to the page
 */
export function addStructuredData(data: object) {
  // Remove existing structured data script if any
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * SEO configurations for different pages
 */
export const SEO_CONFIGS: Record<string, SEOData> = {
  '/': {
    title: 'CryptoNow - Buy and Sell Cryptocurrency in Nigeria',
    description:
      'CryptoNow is a Nigerian cryptocurrency exchange. Exchange crypto for naira with clear rates, direct bank payouts, and responsive support.',
    keywords:
      'CryptoNow, CryptoNow NG, cryptocurrency Nigeria, buy bitcoin Nigeria, sell bitcoin Nigeria, crypto exchange Nigeria, buy ethereum Nigeria, cryptocurrency trading, crypto Nigeria',
  },
  '/about': {
    title: 'About Us - CryptoNow',
    description:
      'Learn about CryptoNow, our platform for exchanging crypto and naira with clear rates and direct bank transfers.',
    keywords: 'CryptoNow, CryptoNow NG, about cryptonow, cryptocurrency exchange Nigeria, crypto platform',
  },
  '/rates': {
    title: 'Cryptocurrency Exchange Rates - CryptoNow',
    description:
      'View real-time cryptocurrency exchange rates for naira on CryptoNow. Check live buy and sell prices for supported coins.',
    keywords:
      'CryptoNow, CryptoNow NG, crypto rates Nigeria, bitcoin rate, ethereum rate, cryptocurrency prices Nigeria',
  },
  '/contact': {
    title: 'Contact Us - CryptoNow',
    description:
      'Get in touch with CryptoNow. Contact our support team for help with transactions and account inquiries.',
    keywords: 'CryptoNow, CryptoNow NG, contact cryptonow, crypto support Nigeria, customer service',
  },
  '/privacy-policy': {
    title: 'Privacy Policy - CryptoNow',
    description: 'Read CryptoNow\'s privacy policy to understand how we protect and handle your personal information.',
    keywords: 'CryptoNow, privacy policy, data protection, cryptocurrency privacy',
    noindex: true,
  },
  '/terms-of-service': {
    title: 'Terms of Service - CryptoNow',
    description: 'Read CryptoNow\'s terms of service for using our cryptocurrency exchange platform.',
    keywords: 'CryptoNow, terms of service, user agreement, crypto exchange terms',
    noindex: true,
  },
  '/security-policy': {
    title: 'Security Policy - CryptoNow',
    description: 'Learn about CryptoNow\'s security measures and how we protect your cryptocurrency transactions.',
    keywords: 'CryptoNow, security policy, crypto security, secure trading',
    noindex: true,
  },
  '/aml-policy': {
    title: 'AML Policy - CryptoNow',
    description: 'Read CryptoNow\'s Anti-Money Laundering (AML) policy and compliance measures.',
    keywords: 'CryptoNow, AML policy, anti-money laundering, compliance',
    noindex: true,
  },
};
