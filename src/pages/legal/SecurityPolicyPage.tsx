import PublicNavbar from "../../components/global/navbar/PublicNavbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import { Fragment } from "react";

const SecurityPolicyPage = () => {
  const formattedDate = "24 November 2025";

  return (
    <Fragment>
      <PublicNavbar />
      <section className="w-full md:w-[90%] 2xl:max-w-8xl mx-auto mt-[34px] mb-[30px] lg:mb-[143px] px-4 text-lg text-[#454745] flex flex-col lg:grid lg:grid-cols-[30%_70%] lg:gap-8 items-start gap-x-6 lg:gap-x-24">
        {/* LHS Table of Content */}
        <nav
          aria-label="Table of contents"
          className="w-full hidden lg:w-[650px] text-nowrap font-medium lg:sticky lg:top-[34px] lg:self-start lg:max-h-[calc(100vh-68px)] lg:overflow-y-auto overflow-hidden lg:block"
        >
          <h2 className="text-lg lg:text-2xl text-[#0E0F0C] mb-4">
            Table of content
          </h2>

          <ul className="list-none space-y-4 text-base text-[#0E0F0C]">
            <li className="whitespace-nowrap">
              <a href="#scope" className="hover:underline text-sm whitespace-nowrap">
                1. Scope
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#governance" className="hover:underline text-sm whitespace-nowrap">
                2. Governance and Responsibility
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#access-control" className="hover:underline text-sm whitespace-nowrap">
                3. Access Control
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#payment-mechanisms" className="hover:underline text-sm whitespace-nowrap">
                4. Payment Mechanisms
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#risk-mechanisms" className="hover:underline text-sm whitespace-nowrap">
                5. Risk Mechanisms
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#data-protection" className="hover:underline text-sm whitespace-nowrap">
                6. Data Protection
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#network-security" className="hover:underline text-sm whitespace-nowrap">
                7. Network Security
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#downtimes" className="hover:underline text-sm whitespace-nowrap">
                8. Downtimes
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#incident-response" className="hover:underline text-sm whitespace-nowrap">
                9. Incident Response
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#software-updates" className="hover:underline text-sm whitespace-nowrap">
                10. Software Updates and Maintenance Schedule
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#compliance" className="hover:underline text-sm whitespace-nowrap">
                11. Compliance and Legal
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#third-party" className="hover:underline text-sm whitespace-nowrap">
                12. Third-Party Management
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#continuous-improvement" className="hover:underline text-sm whitespace-nowrap">
                13. Continuous Improvement
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#ownership" className="hover:underline text-sm whitespace-nowrap">
                14. Ownership
              </a>
            </li>
          </ul>
        </nav>
        {/* RHS */}
        <div className="mt-6 md:mt-0 lg:max-w-5xl">
          <aside>
            <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
              Security Policy
            </h1>
            <p className="text-[#0E0F0C] text-base">
              Last updated: {formattedDate}
            </p>
          </aside>

          <aside className="mt-6 md:mt-12 space-y-4">
            <p>
              This Security Policy is designed by <strong>Alarora Innovations Limited</strong>. It
              establishes a robust and comprehensive framework designed to protect
              our organization, safeguard customer information, and maintain the
              integrity of our operational infrastructure against various threats
              and vulnerabilities. It ensures compliance with relevant regulations
              and fosters a culture of security awareness among all stakeholders.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="scope">
              1. Scope
            </h2>
            <p className="mt-4">
              This Security Policy is applicable to all employees, users,
              contractors, partners, and third-party service providers who
              access, manage, or interact with our systems, networks, or data
              related to our cryptocurrency operations. It encompasses all
              activities involving the handling of sensitive information and
              operational processes.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="governance"
            >
              2. Governance and Responsibility
            </h2>
            <p className="mt-4">
              All employees are mandated to adhere strictly to the established
              security policies and procedures. They are also responsible for
              promptly reporting any suspicious activities or security incidents
              to the designated security personnel. This collective
              responsibility is crucial in maintaining a secure environment.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="access-control"
            >
              3. Access Control
            </h2>
            <p className="mt-4">
              We are committed to implementing stringent access control measures,
              which include:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Role-based access control that restricts system access to
                authenticated and authorized users only. Personnel will be
                granted the minimum access rights and permissions necessary to
                perform their functions, particularly concerning financial
                transactions.
              </li>
              <li>
                Utilization of secure and HttpOnly cookies for effective session
                management, ensuring that user sessions are protected against
                common web vulnerabilities.
              </li>
              <li>
                Mandatory use of strong passwords for all regular users, coupled
                with encouragement for two-factor authentication (2FA) for enhanced
                security during website logins.
              </li>
              <li>
                Regular reviews of user access rights, with prompt revocation of
                access for inactive or departing users to prevent unauthorized
                access.
              </li>
              <li>
                Comprehensive activity logging to ensure transparency and
                traceability of user actions within the system.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="payment-mechanisms"
            >
              4. Payment Mechanisms
            </h2>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Incoming Payments
                </h3>
                <p className="mt-4">
                  Verification of payments will be required before confirming any
                  transaction to ensure legitimacy, to achieve this:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    users must upload a receipt that serves as evidence of
                    payment, which will be validated by the designated
                    administrative officer.
                  </li>
                  <li>
                    we use matching logic to confirm that the payer's name matches
                    the beneficiary details to prevent fraud.
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Cryptocurrency Disbursements
                </h3>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    Users are required to provide their decentralized wallet
                    address for the receipt of cryptocurrency
                  </li>
                  <li>
                    The crypto equivalent is disbursed after confirmation of the
                    payment by our administrative officer
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. Fiat Payouts
                </h3>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    Users are required to add and save a bank details for
                    withdrawals
                  </li>
                  <li>
                    Our administrative officer manually confirms all withdrawals
                    to mitigate the risk of automated withdrawal fraud.
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="risk-mechanisms"
            >
              5. Risk Mechanisms
            </h2>
            <p className="mt-4">
              We are dedicated to ensuring continuous server monitoring to
              identify and respond to potential threats proactively. To achieve
              this objective, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Ensure server monitoring for abnormal spikes in requests or
                brute-force attempts
              </li>
              <li>
                Activate failed login tracking with auto-lock after repeated
                unsuccessful attempts
              </li>
              <li>Ensure real-time error logging to detect issues early</li>
              <li>Temporarily suspend accounts for high-risk behaviour</li>
              <li>
                Freeze transactions for inconsistent or suspicious payment
                records
              </li>
              <li>Initiate admin review for escalated cases</li>
              <li>Ensure daily reconciliation of trades and payouts.</li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="data-protection"
            >
              6. Data Protection
            </h2>
            <p className="mt-4">We will:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                encrypt all sensitive data at rest and in transit using
                industry-standard algorithms.
              </li>
              <li>
                store private keys in hardware security modules or equivalent
                secure environments.
              </li>
              <li>use bcyrpt or equivalent for hashed and salted passwords</li>
              <li>
                Backup critical data regularly and store backups securely
                offsite.
              </li>
              <li>
                A bi-annual security risk assessment will be carried out on each
                server and endpoint to identify the level of protection necessary.
                The security and control procedures required will consider the
                sensitivity and value of such information.
              </li>
              <li>
                Ensure that no sensitive bank data, including PIN, OTP, Password
                is collected or stored
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="network-security"
            >
              7. Network Security
            </h2>
            <p className="mt-4">We will</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                use Web Application Firewall to block SQL injection, XSS, bots
                and malicious requests.
              </li>
              <li>
                Use Network Firewalls to restrict access to necessary internal
                services
              </li>
              <li>
                Segment networks to isolate critical systems from general access
              </li>
              <li>Ensure DDoS is provided by the hosting environment</li>
              <li>
                Conduct regular vulnerability assessments and penetration
                testing.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="downtimes">
              8. Downtimes
            </h2>
            <p className="mt-4">There will be:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Scheduled maintenance for backend or database upgrades.
              </li>
              <li>Cloud provider outages (e.g., hosting/server downtime).</li>
              <li>High traffic load causing temporary service slowdowns.</li>
              <li>
                Security patch deployment requiring short service restarts.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="incident-response"
            >
              9. Incident Response
            </h2>
            <p className="mt-4">We will:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Establish an incident response team (IRT) with clear roles and
                communication protocols.
              </li>
              <li>
                Define procedures for detecting, reporting, and mitigating
                security incidents.
              </li>
              <li>
                Maintain logs and audit trails to support investigations.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="software-updates"
            >
              10. Software Updates and Maintenance Schedule
            </h2>
            <p className="mt-4">We Will:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                implement bug fixes and performance optimizations on a regular
                schedule. These updates are typically released weekly or
                bi-weekly, depending on the complexity and urgency of the issues
                identified. These updates will address any known errors, improve
                system performance, and enhance overall platform stability. This
                is to ensure a stable and efficient user experience.
              </li>
              <li>
                promptly address any identified security vulnerabilities.
                Security patches are deployed immediately upon discovery of a
                vulnerability. This rapid response ensures that potential threats
                are mitigated as quickly as possible, minimizing any risk to user
                accounts and data.
              </li>
              <li>
                ensure the underlying server operating systems are regularly
                updated to maintain a secure and reliable infrastructure. Server
                OS updates are performed monthly or quarterly, depending on the
                severity and criticality of the updates. These updates include
                security patches, performance improvements, and other
                enhancements to ensure the servers are running optimally and
                securely.
              </li>
              <li>
                on demand, release new features and enhancements. This allows us
                to respond quickly to user feedback, adapt to market changes, and
                introduce innovative functionalities. Feature updates undergo
                rigorous testing and are deployed in a controlled manner to
                minimize disruption and ensure a smooth user experience.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="compliance"
            >
              11. Compliance and Legal
            </h2>
            <p className="mt-4">
              We Adhere to applicable laws, regulations, and industry standards
              related to cryptocurrency and data privacy. Regular audits checks
              are conducted to ensure compliance with this policy.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="third-party"
            >
              12. Third-Party Management
            </h2>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Assess the security posture of third-party vendors before
                engagement.
              </li>
              <li>
                Include security requirements in contracts and monitor third-party
                compliance.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="continuous-improvement"
            >
              13. Continuous Improvement
            </h2>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Review and update the security policy annually or after
                significant changes.
              </li>
              <li>
                Encourage feedback and incorporate lessons learned from security
                incidents.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="ownership">
              14. Ownership
            </h2>
            <p className="mt-4">
              This policy is and remains the property of Alarora Innovations
              Limited. It is not to be distributed, published or displayed by any
              other person or entity.
            </p>
          </aside>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

export default SecurityPolicyPage;
