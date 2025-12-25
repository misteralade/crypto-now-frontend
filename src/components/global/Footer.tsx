import {FaFacebookF, FaInstagram, FaTiktok, FaTwitter, FaWhatsapp} from "react-icons/fa6";
import {ROUTES} from "../../util/constants.util.ts";
import { useLocation } from "@tanstack/react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const currentRoute = useLocation().pathname;

  const inHomepage = currentRoute === ROUTES.HOMEPAGE;

  return (
    <footer className="py-12 max-md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Layout - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick links</h3>
            <ul className="space-y-3">
              <li>
                <a href={inHomepage ? `#${ROUTES.HOMEPAGE_TAG_IDS.HOW_IT_WORKS}` : `${ROUTES.HOMEPAGE}#${ROUTES.HOMEPAGE_TAG_IDS.HOW_IT_WORKS}`} className="text-gray-600 hover:text-gray-900">
                  How It Works
                </a>
              </li>
              <li>
                <a href={ROUTES.RATES} className="text-gray-600 hover:text-gray-900">
                  Rates
                </a>
              </li>
              <li>
                <a href={inHomepage ? `#${ROUTES.HOMEPAGE_TAG_IDS.FAQ}` : `${ROUTES.HOMEPAGE}#${ROUTES.HOMEPAGE_TAG_IDS.FAQ}`} className="text-gray-600 hover:text-gray-900">
                  FAQs
                </a>
              </li>
              <li>
                <a href={ROUTES.CONTACT} className="text-gray-600 hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={ROUTES.TERMS_OF_SERVICES}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </a>
              </li>
              
              <li>
                <a
                  href={ROUTES.PRIVACY_POLICY}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </li>
              
              <li>
                <a href={ROUTES.SECURITY_POLICY} className="text-gray-600 hover:text-gray-900">
                  Security Policy
                </a>
              </li>
              
              <li>
                <a
                  href={ROUTES.AML_POLICY}
                  className="text-gray-600 hover:text-gray-900"
                >
                  AML/Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="max-sm:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Contact info</h3>
            <div className="space-y-3 gap-0.5 flex flex-col">
              <a
                  href="mailto:cryptonownaijahelpdesk@gmail.com"
                  target="_blank"
                  className="text-gray-600 hover:text-gray-900"
              >
                cryptonownaijahelpdesk@gmail.com
              </a>

              <a
                  href={ROUTES.SOCIALS.WHATSAPP}
                  target="_blank"
                  className="text-gray-600 hover:text-gray-900"
              >
                Chat us on WhatsApp
              </a>

              <p className="text-gray-600">Lagos, Nigeria</p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Socials</h3>
            <div className="flex space-x-4">
              {/* TikTok */}
              <a href={ROUTES.SOCIALS.TIK_TOK} target="_blank" className="text-gray-600 hover:text-gray-900">
                <FaTiktok size={24} />
              </a>
              
              {/* Instagram */}
              <a href={ROUTES.SOCIALS.INSTAGRAM} target="_blank" className="text-gray-600 hover:text-gray-900">
                <FaInstagram size={28}/>
              </a>

              {/* X (Twitter) */}
              <a href={ROUTES.SOCIALS.TWITTER} target="_blank" className="text-gray-600 hover:text-gray-900">
                <FaTwitter size={28}/>
              </a>
              
              {/* Facebook */}
              <a href={ROUTES.SOCIALS.FACEBOOK} target="_blank" className="text-gray-600 hover:text-gray-900">
                <FaFacebookF size={24}/>
              </a>

              {/* WhatsApp */}
              <a href={ROUTES.SOCIALS.WHATSAPP} target="_blank" className="text-gray-600 hover:text-gray-900">
                <FaWhatsapp size={24}/>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8">
          <p className="text-center text-gray-600">
            © {currentYear} CryptoNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
