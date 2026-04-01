import { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | VerifyIndia",
  description:
    "VerifyIndia's Terms of Service — the rules and conditions for using our supplier verification platform.",
};

const LAST_UPDATED = "March 30, 2026";

export default function TermsPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-ink to-trust py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText size={32} className="text-gold" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-white/70 text-base">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-10 text-gray-700">

          <section>
            <p className="text-sm leading-relaxed">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use
              of the VerifyIndia platform. By creating an account or using any part of our
              service, you agree to these Terms. If you do not agree, please do not use
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">1. About VerifyIndia</h2>
            <p className="text-sm leading-relaxed">
              VerifyIndia is a B2B supplier verification platform that connects
              international buyers with physically audited manufacturers in Gujarat, India.
              We provide supplier listings, verification scores, audit reports, and a
              buyer–supplier inquiry system. We are a Canada-registered business. Our
              platform does not act as an agent, broker, or intermediary in any commercial
              transaction between buyers and suppliers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">2. Account Registration</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                You must register for an account to use most platform features. You agree to:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Provide accurate and complete registration information</li>
                <li>Keep your password secure and notify us of any unauthorized access</li>
                <li>Not share your account credentials with others</li>
                <li>Be at least 18 years old and have legal authority to bind your company</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these
                Terms or that we reasonably believe are being used fraudulently.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">3. Buyer Terms</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>As a buyer, you may:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Browse and search verified supplier listings</li>
                <li>Send inquiries to suppliers through our platform</li>
                <li>Save suppliers to your account for reference</li>
                <li>Request audit reports for additional due diligence</li>
              </ul>
              <p>
                You agree not to misuse the inquiry system (e.g., spam, solicitation
                unrelated to sourcing, or attempts to harvest contact information).
                You are solely responsible for any commercial decisions made based on
                information found on our platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">4. Supplier Terms</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>As a supplier, you agree to:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Provide accurate information about your business, products, capacity,
                  and certifications
                </li>
                <li>
                  Cooperate fully with our audit team during scheduled physical inspections
                </li>
                <li>
                  Not upload content that infringes third-party intellectual property rights
                </li>
                <li>
                  Respond to buyer inquiries in a timely and professional manner
                </li>
                <li>
                  Notify us promptly of any material changes to your business that may
                  affect your verification status
                </li>
              </ul>
              <p>
                Providing false information to obtain or maintain verification is grounds
                for immediate suspension and may result in legal action.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">5. Verification &amp; Audit Process</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Our verification scores and tier badges are based on a 25-point physical
                audit conducted by our Gujarat-based team. Please note:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Verification is valid at the time of the audit and does not guarantee
                  ongoing compliance
                </li>
                <li>
                  We may re-audit suppliers periodically or upon complaint
                </li>
                <li>
                  Verification status may be suspended or revoked if a supplier is found
                  to have provided false information
                </li>
                <li>
                  VerifyIndia verification is an independent assessment and does not
                  constitute a legal certification, warranty, or endorsement of a supplier
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">6. Subscriptions &amp; Payments</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Supplier listings on VerifyIndia require a paid subscription (Bronze,
                Silver, or Gold plan). By subscribing:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  You authorize us to charge your payment method on a recurring monthly basis
                </li>
                <li>
                  Subscription fees are non-refundable unless required by applicable law
                </li>
                <li>
                  We may change pricing with 30 days&apos; notice to active subscribers
                </li>
                <li>
                  Payments are processed by Stripe and subject to Stripe&apos;s Terms of Service
                </li>
              </ul>
              <p>
                Failure to maintain an active subscription will result in your listing
                being hidden from the platform until payment is restored.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">7. Prohibited Conduct</h2>
            <p className="text-sm leading-relaxed mb-2">You must not:</p>
            <ul className="space-y-1 text-sm leading-relaxed list-disc list-inside">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any account or system</li>
              <li>Scrape, crawl, or systematically extract data from the platform</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate any person or business</li>
              <li>Use the platform to send unsolicited commercial communications</li>
              <li>Circumvent any security or access controls</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">8. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              All platform content, branding, logos, and software are owned by VerifyIndia
              or licensed to us. You may not copy, reproduce, distribute, or create
              derivative works without our prior written consent. Suppliers grant VerifyIndia
              a non-exclusive, royalty-free license to display submitted photos and content
              on the platform for the duration of their subscription.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-sm leading-relaxed">
              THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND.
              WE DO NOT WARRANT THAT SUPPLIER INFORMATION IS ACCURATE, COMPLETE, OR
              CURRENT. WE DO NOT GUARANTEE THE OUTCOME OF ANY BUSINESS TRANSACTION BETWEEN
              BUYERS AND SUPPLIERS. USE OF THE PLATFORM AND ANY RELIANCE ON ITS CONTENT IS
              AT YOUR SOLE RISK.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">10. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, VERIFYINDIA SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
              ARISING FROM YOUR USE OF THE PLATFORM, INCLUDING ANY COMMERCIAL LOSSES
              RESULTING FROM BUYER–SUPPLIER TRANSACTIONS. OUR TOTAL LIABILITY SHALL NOT
              EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">11. Governing Law</h2>
            <p className="text-sm leading-relaxed">
              These Terms are governed by the laws of the Province of Ontario and the
              federal laws of Canada applicable therein. Any disputes arising under these
              Terms shall be resolved in the courts of Ontario, Canada, unless otherwise
              agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">12. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">
              We may update these Terms at any time. We will notify registered users by
              email of material changes at least 14 days before they take effect. Your
              continued use of the platform after changes take effect constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">13. Contact</h2>
            <p className="text-sm leading-relaxed">
              For questions about these Terms, please contact us:
            </p>
            <div className="mt-3 p-4 bg-paper rounded-xl border border-paper-dark text-sm">
              <p className="font-semibold text-ink">VerifyIndia Legal</p>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Mail size={13} />
                <a href="mailto:hello@verifyindia.com" className="text-trust hover:underline">
                  hello@verifyindia.com
                </a>
              </div>
              <p className="text-gray-500 mt-1">Ontario, Canada</p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gold transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-gold transition-colors">
            Contact Us
          </Link>
          <span>·</span>
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
