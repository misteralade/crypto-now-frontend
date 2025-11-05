import React from "react";

import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";

const AmlPolicyPage = () => (
  <>
    <Navbar />
    <section className="max-w-3xl md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mt-[34px] mb-[30px] lg:mb-[242px] px-4 text-lg text-[#454745]">
      <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
        AML Policy
      </h1>
      <p className="text-[#0E0F0C] text-base">Last updated: 04 November 2025</p>

      <aside className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0E0F0C]">1. Introduction</h2>
        <p>
          This Anti-Money Laundering (AML) Policy outlines the principles and
          procedures we follow to prevent money laundering and terrorist
          financing in accordance with applicable regulations.
        </p>
      </aside>

      <aside className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0E0F0C]">
          2. Customer Due Diligence
        </h2>
        <p>
          We implement risk-based KYC/KYB procedures to verify customer identity
          and monitor transactions for unusual activity.
        </p>
      </aside>

      <aside className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-[#0E0F0C]">
          3. Reporting and Record-Keeping
        </h2>
        <p>
          We maintain appropriate records and report suspicious activities to
          the relevant authorities as required by law.
        </p>
      </aside>
    </section>
    <Footer />
  </>
);

export default AmlPolicyPage;
