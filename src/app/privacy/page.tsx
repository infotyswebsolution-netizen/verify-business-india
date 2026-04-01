import { Metadata } from "next";
import Link from "next/link";
import { Shield, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | VerifyIndia",
  description:
    "VerifyIndia's privacy policy — how we collect, use, and protect your personal data.",
};

const LAST_UPDATED = "March 30, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-ink to-trust py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield size={32} className="text-gold" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70 text-base">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-10 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">1. Who We Are</h2>
            <p className="text-sm leading-relaxed">
              VerifyIndia is a Canada-registered B2B verification platform that connects
              international buyers with physically audited Gujarat manufacturers. References
              to &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo; in this policy
              refer to VerifyIndia. Our platform is accessible at{" "}
              <a
                href="https://verify-business-ind.vercel.app"
                className="text-trust hover:underline"
              >
                verify-business-ind.vercel.app
              </a>{" "}
              and we can be reached at{" "}
              <a
                href="mailto:hello@verifyindia.com"
                className="text-trust hover:underline"
              >
                hello@verifyindia.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold text-ink mb-1">Account Information</h3>
                <p>
                  When you register as a buyer or supplier, we collect your full name,
                  company name, email address, country, and (for suppliers) your GSTIN
                  and industry details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Usage Data</h3>
                <p>
                  We collect information about how you interact with our platform,
                  including pages visited, searches made, inquiries sent, and features used.
                  This data helps us improve the service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Payment Information</h3>
                <p>
                  Subscription payments are processed by Stripe. We do not store your
                  full credit card number. Stripe handles all payment data in compliance
                  with PCI DSS standards.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Supplier Verification Data</h3>
                <p>
                  For suppliers undergoing our audit process, we collect factory
                  inspection records, photographs, certification documents, and
                  financial compliance data. This information is used solely to
                  generate verification reports.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-2 text-sm leading-relaxed list-disc list-inside">
              <li>To create and manage your account</li>
              <li>To verify supplier credentials and publish verification reports</li>
              <li>To facilitate buyer–supplier inquiries and communications</li>
              <li>To process subscription payments and manage billing</li>
              <li>To send transactional emails (signup confirmations, inquiry notifications, verification updates)</li>
              <li>To improve and personalize the platform experience</li>
              <li>To comply with legal obligations and resolve disputes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">4. Information Sharing</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                We do <strong>not</strong> sell your personal information to third parties.
                We share data only as follows:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Supabase</strong> — our database and authentication provider
                  (data stored in EU-West region)
                </li>
                <li>
                  <strong>Stripe</strong> — for subscription payment processing
                </li>
                <li>
                  <strong>Resend</strong> — for transactional email delivery
                </li>
                <li>
                  <strong>Vercel</strong> — for platform hosting and deployment
                </li>
                <li>
                  <strong>Between buyers and suppliers</strong> — your company name and
                  country are visible on the platform; contact details are only shared
                  after an inquiry is accepted
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">5. Data Retention</h2>
            <p className="text-sm leading-relaxed">
              We retain your personal data for as long as your account is active or as
              needed to provide services. If you close your account, we will delete or
              anonymize your personal data within 90 days, except where we are required
              to retain it for legal compliance (e.g., tax records for up to 7 years).
              Verification reports for suppliers may be retained in anonymized form for
              platform analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">6. Your Rights (PIPEDA)</h2>
            <p className="text-sm leading-relaxed mb-3">
              As a Canada-registered business, we comply with the Personal Information
              Protection and Electronic Documents Act (PIPEDA). You have the right to:
            </p>
            <ul className="space-y-2 text-sm leading-relaxed list-disc list-inside">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Withdraw consent for processing (subject to legal requirements)</li>
              <li>Request deletion of your account and associated data</li>
              <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              To exercise these rights, email us at{" "}
              <a href="mailto:hello@verifyindia.com" className="text-trust hover:underline">
                hello@verifyindia.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">7. Cookies</h2>
            <p className="text-sm leading-relaxed">
              We use essential session cookies required for authentication and platform
              functionality (provided by Supabase Auth). We do not use advertising or
              tracking cookies. You can configure your browser to block or delete cookies,
              but this may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">8. Security</h2>
            <p className="text-sm leading-relaxed">
              We use industry-standard security measures including TLS encryption for
              data in transit, Row Level Security (RLS) on our database, and regular
              security reviews. However, no online system is 100% secure. We encourage
              you to use a strong password and to contact us immediately if you suspect
              unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">9. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify
              registered users by email when material changes are made. Continued use of
              the platform after any changes constitutes acceptance of the updated policy.
              The &ldquo;Last updated&rdquo; date at the top of this page will always
              reflect the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink mb-4">10. Contact</h2>
            <p className="text-sm leading-relaxed">
              For any privacy-related questions or requests, please contact our Privacy
              Officer:
            </p>
            <div className="mt-3 p-4 bg-paper rounded-xl border border-paper-dark text-sm">
              <p className="font-semibold text-ink">VerifyIndia Privacy Officer</p>
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
          <Link href="/terms" className="hover:text-gold transition-colors">
            Terms of Service
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
