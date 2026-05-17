import PublicNavbar from "../../components/global/navbar/PublicNavbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import { Fragment } from "react";

const TermsOfServicePage = () => {
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
              <a href="#contract" className="hover:underline text-sm whitespace-nowrap">
                1. This is a contract
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#eligibility" className="hover:underline text-sm whitespace-nowrap">
                2. Eligibility
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#account-registration" className="hover:underline text-sm whitespace-nowrap">
                3. Account Registration and Security
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#use-of-services" className="hover:underline text-sm whitespace-nowrap">
                4. Use of our Services
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#cryptocurrency-transactions" className="hover:underline text-sm whitespace-nowrap">
                5. Cryptocurrency Transactions
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#overpayment-recovery" className="hover:underline text-sm whitespace-nowrap">
                6. Overpayment Recovery
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#fees-and-rates" className="hover:underline text-sm whitespace-nowrap">
                7. Fees and Rates
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#privacy" className="hover:underline text-sm whitespace-nowrap">
                8. Privacy
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#direct-contact" className="hover:underline text-sm whitespace-nowrap">
                9. Direct Contact
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#discontinuance" className="hover:underline text-sm whitespace-nowrap">
                10. Discontinuance
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#intellectual-property" className="hover:underline text-sm whitespace-nowrap">
                11. Intellectual Property
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#disclaimers" className="hover:underline text-sm whitespace-nowrap">
                12. Disclaimers and Limitation of Liability
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#indemnification" className="hover:underline text-sm whitespace-nowrap">
                13. Indemnification
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#governing-law" className="hover:underline text-sm whitespace-nowrap">
                14. Governing Law
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#changes-to-terms" className="hover:underline text-sm whitespace-nowrap">
                15. Changes to Terms
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#alterations" className="hover:underline text-sm whitespace-nowrap">
                16. Alterations
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#whole-agreement" className="hover:underline text-sm whitespace-nowrap">
                17. Whole Agreement
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#waiver" className="hover:underline text-sm whitespace-nowrap">
                18. Waiver/Relaxation
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#survival" className="hover:underline text-sm whitespace-nowrap">
                19. Survival
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#contact" className="hover:underline text-sm whitespace-nowrap">
                20. Contact
              </a>
            </li>
          </ul>
        </nav>
        {/* RHS */}
        <div className="mt-6 md:mt-0 lg:max-w-5xl">
          <aside>
            <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-[#0E0F0C] text-base">
              Last updated: {formattedDate}
            </p>
          </aside>

          <aside className="mt-6 md:mt-12 space-y-4">
            <p>
              Welcome to <strong>Alarora Innovations Limited</strong>. These Terms and
              Conditions ("Terms") govern our services, limited to buying and selling
              preferred digital currencies, and disbursement of funds to the
              beneficiary bank account for processing the equivalents of the digital
              currencies in naira, (collectively, the "Services"). By accessing or
              using our Services, you agree to be bound by these Terms.
            </p>
            <p>
              The Service is operated by Alarora Innovations Limited
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="contract">
              1. This is a contract
            </h2>
            <p className="mt-4">
              These Terms constitute a contract between you ('you', 'user', 'your')
              and Alarora Innovations Limited ('us', 'we', 'our'). By using any part
              of the Service, you accept these Terms. If you do not accept these
              Terms, please do not use the Service.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="eligibility">
              2. Eligibility
            </h2>
            <p className="mt-4">
              You must be at least 18 years old to use our Services. By using our
              Services, you represent and warrant that you meet this eligibility
              requirement.
            </p>
            <p className="mt-4">
              If you are under eighteen (18) years of age, you may only be eligible
              to use our service under the supervision and with the consent of your
              parent (s) or guardian (s), by checking the Consent Authorization
              form provided on our sign-up page.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="account-registration"
            >
              3. Account Registration and Security
            </h2>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Regular Users
                </h3>
                <p className="mt-4">
                  To use our Services as a regular user, you must create an account.
                  You agree to provide accurate, current, and complete information
                  during registration and to update it as necessary. You are
                  responsible for maintaining the confidentiality of your account
                  credentials and for all activities that occur under your account.
                  This information includes (a) your full name (b) valid email
                  address (c) date of birth (d) a valid mobile number (d) proof of
                  national identity (this is to be uploaded in picture format).
                </p>
                <p className="mt-4">
                  You agree that an account associated with such details will be
                  created, accept the current Terms, and agree to submit such other
                  (and additional) information as we may request in line with
                  regulatory/legal provisions. To make reusing your account and
                  trading easier, you will be required to set up a unique Password.
                  It is your responsibility to always keep this Password confidential
                  and secure. Also note that you will be required to set up a payment
                  PIN. Please be aware that we are not responsible for any losses
                  that occur if you compromise your security by revealing your
                  Password/PIN to others. As a result, you will be held liable for
                  all transactions initiated from your account, including those that
                  are not authorized by you or are made in error.
                </p>
                <p className="mt-4">
                  You are advised to use two (2) factor authentications to strengthen
                  the security of your account and protect unauthorized usage.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Guest Users
                </h3>
                <p className="mt-4">
                  This is applicable to users who do not want to sign up to our
                  platform, but desire to conduct transactions. To do this, we require,
                  (a) your bank details (b) beneficiary wallet details (c) your valid
                  email address. Please note however that as a guest user, you are
                  only entitled to use some of our services. The scope of
                  transactions and transaction limits are as follows: purchase
                  transactions range from $1 to $50, while sale transactions range
                  from $1 to $100. You will not be allowed to conduct transactions
                  beyond these.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="use-of-services"
            >
              4. Use of our Services
            </h2>
            <p className="mt-4">
              To further use our services, you must add an active bank account to
              process payments in naira. This account must be owned by you,
              ensuring the details on the existing account and your registered
              account with us, tally.
            </p>
            <p className="mt-4">Please note:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                In the event your bank account is in direct conflict with your
                registered account with us, payments will not be processed.
              </li>
              <li>
                We will not be liable for any experienced downtime from your bank,
                particularly as the availability and functionality is subject to them
                as third-party platforms, which operations we have no control over.
              </li>
              <li>
                We will not take responsibility for funds lost during any
                transaction. Please:
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li>
                    ensure to precheck all wallet, bank and blockchain transaction
                    details before initiating any
                  </li>
                  <li>
                    be informed that we regularly update our bank account and wallet
                    information. Transactions to outdated wallet details cannot be
                    recovered. However, payments made to old bank account details may
                    be refundable if you contact our support service.
                  </li>
                </ul>
              </li>
              <li>
                You agree to use our Services only for lawful purposes and in
                compliance with all applicable laws and regulations. You shall not
                use the Services to engage in any fraudulent, illegal, or
                unauthorized activities.
              </li>
              <li>
                In the event of any inconsistency arising from any transaction, you
                may initiate a dispute on our platform. All disputes will be
                reviewed and resolved by our administrative team.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="cryptocurrency-transactions"
            >
              5. Cryptocurrency Transactions
            </h2>
            <p className="mt-4">
              All cryptocurrency transactions are final, irreversible and untraceable.
              We do not guarantee the value, liquidity or legality of any
              cryptocurrency.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                You acknowledge the risks associated with cryptocurrency trading,
                including the volatility, potential loss of funds and the inherent
                risks involved in purchasing coins created by an unknown entity.
              </li>
              <li>
                We reserve the right, at all times, to refuse/prevent a payment where
                our risk system flags a potential discrepancy in the nature or on
                reasonable suspicion of fraud, money-laundering;
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="overpayment-recovery"
            >
              6. Overpayment Recovery
            </h2>
            <p className="mt-4">
              In the unlikely event of an overpayment (whether fiat or crypto), we
              will take the appropriate steps to recover the excess funds.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="fees-and-rates"
            >
              7. Fees and Rates
            </h2>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Buying and Selling Rates
                </h3>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>
                    when you buy or sell cryptocurrency on our platform, the rates
                    are determined by our real-time market data. We strive to offer
                    competitive rates that reflect the current market value of each
                    cryptocurrency.
                  </li>
                  <li>
                    the price you see at the time of your transaction is the price
                    you will pay or receive.
                  </li>
                  <li>
                    before you confirm a trade, the exact buy or sell rate, will be
                    clearly displayed.
                  </li>
                  <li>
                    our rates are solely fixed at our discretion upon consideration
                    of market data and are subject to changes as stipulated by us.
                  </li>
                  <li>
                    The timeframe for completing all transactions is strictly limited
                    to a duration of three (3) minutes from the initiation of the
                    transaction. Please note that any transaction not finalized
                    within this three-minute window may be subject to updated rates,
                    as the applicable rates are subject to change once this period
                    has elapsed. You are advised to complete your transactions
                    promptly to ensure the rates initially displayed remain valid.
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">b. Fee</h3>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>
                    You are to pay the fees, as deducted and claimed by your
                    third-party banks for initiating a transaction.
                  </li>
                  <li>
                    The send-out fee is not covered by us and will be deducted
                    directly from the amount of cryptocurrency you purchase. This fee
                    is not collected by us but is a network charge imposed by the
                    blockchain network (e.g., Ethereum gas fee, BNB Chain fee, etc.).
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="privacy">
              8. Privacy
            </h2>
            <p className="mt-4">
              Your use of our Services is subject to our Privacy Policy, which
              explains how we collect, use and protect your information. Our Privacy
              Policy governing the Service is attached to these Terms ("Privacy
              Policy"). By using the Service, you agree to the use of your data
              under our Privacy Policy. The Privacy Policy addresses only the
              personal information processed by us in providing the Service to you.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="direct-contact"
            >
              9. Direct Contact
            </h2>
            <p className="mt-4">
              We may contact you regarding your account or the Service. You
              expressly agree that, as part of the Service, you may, from time to
              time, receive communications from us via email, text message (SMS),
              or other means. You may elect to stop receiving promotional messages
              by emailing your request to opt-out, along with your mobile number, to
              our contact lines, or following the opt-out instructions in the
              message. Even if you choose to opt out of receiving promotional
              messages, you may not opt out of receiving service-related messages as
              these ensure that we are able to deliver accurate, relevant,
              sensitive and security-related services to you.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="discontinuance"
            >
              10. Discontinuance
            </h2>
            <p className="mt-4">
              We reserve the right to suspend or discontinue your account and access
              to the Services at our sole discretion, without prior notice. In
              furtherance of regulatory, time-sensitive and security-related
              purposes, we may terminate your access to the Service or discontinue
              providing the Service or any part of the Service, with due notice to
              you [or without notice where the suspension or termination is
              necessary to forestall, curb or extinguish some ongoing fraud,
              industry-wide compromise or an ongoing financial crime-related
              investigation, including violation of these Terms]. Rest assured that
              we will provide as much notice as the circumstance allows and restore
              the Service at the earliest convenience. You agree that in the event of
              the foregoing, we will not be responsible or liable to you or any
              third party.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="intellectual-property"
            >
              11. Intellectual Property
            </h2>
            <p className="mt-4">
              All content and materials provided through the Services, including
              software, trademarks, and logos, are the property of Alarora
              Innovations Limited. You may not use, reproduce, or distribute such
              materials.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="disclaimers"
            >
              12. Disclaimers and Limitation of Liability
            </h2>
            <p className="mt-4">
              Our Services are provided "as is" and "as available" without
              warranties of any kind. We do not guarantee uninterrupted or error-free
              operations. To the maximum extent permitted by law, we disclaim all
              liability for any damages arising from your use of the Services. In
              no event shall we be liable for any direct, indirect, punitive,
              incidental, special, consequential damages, or any damages
              whatsoever arising out of, or in any way connected with the use or
              performance of the service, with the delay or inability to use the
              service, the provision of (or failure to provide services), or
              otherwise arising out of the use of the service, whether based on
              contract, tort, negligence, strict liability, or otherwise, even if
              we have been advised of the possibility of such damages.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="indemnification"
            >
              13. Indemnification
            </h2>
            <p className="mt-4">
              You agree to defend, indemnify and hold harmless Alarora Innovations
              Limited, our affiliates, officers, and employees from any claims,
              damages, losses, or expenses arising out of your use of the Services
              or violation of these Terms.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="governing-law"
            >
              14. Governing Law
            </h2>
            <p className="mt-4">
              This Agreement is subject to, and shall be governed by, and construed
              in accordance with the laws of Nigeria, without reference to the
              principles of conflict of laws thereof. Any matters arising concerning
              the interpretation, validity or implementation of this Agreement not
              solved by mutual agreement between the Parties shall be submitted to
              mediation at the Oyo State Multi-Door Courthouse, in the English
              language, before a sole mediator to take place in Oyo, Nigeria, unless
              impractical to do so. Nothing in this Agreement will be deemed as
              preventing us from seeking injunctive relief (or any other provisional
              remedy) from any court having jurisdiction over the Parties and the
              subject matter of the dispute as is necessary to protect our name,
              proprietary information, trade secrets, know-how, or any other
              intellectual property rights.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="changes-to-terms"
            >
              15. Changes to Terms
            </h2>
            <p className="mt-4">
              We may modify these Terms from time to time. Where this happens, we
              will notify you of any material changes by posting the updated Terms
              on our app or through other communication channels. Your continued use
              of the Services after such changes constitutes your acceptance of the
              revised Terms.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="alterations"
            >
              16. Alterations
            </h2>
            <p className="mt-4">
              No alteration, variation or agreed cancellation of this agreement, and
              the Privacy Policy, shall be of any effect unless so directed by us.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="whole-agreement"
            >
              17. Whole Agreement
            </h2>
            <p className="mt-4">
              This Agreement constitutes the whole agreement between the parties in
              regard to the subject matter hereof and no warranties or
              representations of any nature whatsoever other than set out in this
              agreement have been given by any of the parties.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="waiver">
              18. Waiver/Relaxation
            </h2>
            <p className="mt-4">
              No failure or delay by us in exercising any right, power, or privilege
              hereunder shall operate as a waiver thereof, nor shall any single or
              partial exercise preclude any other or further exercise of any right,
              power or privilege by us.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="survival">
              19. Survival
            </h2>
            <p className="mt-4">
              Each and every provision of this Agreement (excluding only those
              provisions which are essential at law for a valid and binding
              Agreement to be constituted) shall be deemed to be separate and
              severable from the remaining provisions of this Agreement. If any of
              the provisions of this Agreement (excluding only those provisions which
              are essential at law for a valid and binding Agreement to be
              constituted) is found by any court of competent jurisdiction to be
              invalid and/or unenforceable then, notwithstanding such invalidity
              and/or unenforceability, the remaining provisions of this Agreement
              shall be (and remain) of full force and effect.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="contact">
              20. Contact
            </h2>
            <p className="mt-4">
              If you have any questions regarding this Terms, please contact us
              through:
            </p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Email:</strong> cryptonownaija@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> 07016568181
              </p>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

export default TermsOfServicePage;
