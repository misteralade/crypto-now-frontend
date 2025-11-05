import React from "react";

import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";

const PrivacyPolicyPage = () => (
  <>
    <Navbar />
    <section className="max-w-3xl md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mt-[34px] mb-[30px] lg:mb-[242px] px-4 text-lg text-[#454745]">
      <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
        Privacy Policy
      </h1>
      <p className="text-[#0E0F0C] text-base">Last updated: 04 November 2025</p>

      <aside className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0E0F0C]">1. Introduction</h2>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website and use our
          services.
        </p>
      </aside>

      <aside className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0E0F0C]">
          2. Information We Collect
        </h2>
        <p>
          We may collect personal data (such as name, email, phone) and
          non-personal data (such as usage statistics) as described in this
          policy.
        </p>
      </aside>

      <aside className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0E0F0C]">
          3. How We Use Information
        </h2>
        <p>
          We use your information to provide and improve our services,
          communicate with you, comply with legal obligations, and protect our
          legitimate interests.
        </p>
      </aside>
    </section>
    <Footer />
  </>
);

export default PrivacyPolicyPage;
