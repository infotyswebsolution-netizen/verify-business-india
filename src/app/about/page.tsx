import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MapPin, Users, Target, Globe, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About VerifyIndia — Connecting Western Buyers with Verified Gujarat Suppliers",
  description:
    "VerifyIndia is a Canada-registered B2B platform that physically audits Gujarat manufacturers so Western buyers can source with confidence. Learn our story, mission, and team.",
};

export default function AboutPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-trust/10 text-trust px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <ShieldCheck size={15} />
            Canada Registered · Gujarat Ground Team
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-ink mb-4">
            Trust is the product.<br />
            <span className="text-gold">India is the factory.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            VerifyIndia bridges Western buyers and Gujarat manufacturers by doing the one thing
            IndiaMART and Alibaba never did — physically walking into every factory before
            listing them.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Why We Built This */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">Why We Built VerifyIndia</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4 text-gray-600 leading-relaxed">
            <p>
              In 2022, a Canadian fashion importer contacted a &quot;verified&quot; textile supplier on IndiaMART.
              The factory photos looked professional. The certifications looked real. After wiring
              $40,000 USD, the shipment arrived three months late — and was 60% below the
              agreed specification.
            </p>
            <p>
              That importer was a friend. And that story is not unique. It plays out thousands
              of times a year because online B2B marketplaces have no physical verification layer.
              They verify that an email address exists. Not that a factory does.
            </p>
            <p>
              VerifyIndia was built to fix that. We put a real person inside every factory we list.
              We check the machines, the workers, the GST registration, the export history, and
              the quality processes — before a single buyer ever contacts them.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "500+", label: "Verified Suppliers" },
            { value: "25", label: "Point Audit Checklist" },
            { value: "6", label: "Key Industries" },
            { value: "40+", label: "Export Countries" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-trust mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Our Mission */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">Our Mission</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "Eliminate Sourcing Risk",
                description:
                  "Every supplier on our platform has been physically visited, audited against a 25-point checklist, and scored before they appear in search results.",
              },
              {
                icon: Globe,
                title: "Make Gujarat Accessible",
                description:
                  "Gujarat is one of the world's most productive manufacturing regions. Our platform makes it navigable for buyers who have never set foot in India.",
              },
              {
                icon: Award,
                title: "Reward Quality Manufacturers",
                description:
                  "The Gold, Silver, and Bronze tiers give honest manufacturers a way to differentiate themselves from unverified competitors.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="w-10 h-10 rounded-xl bg-trust/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-trust" />
                  </div>
                  <h3 className="font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">The Team</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-trust/10 flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-trust" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-ink">Canada Office</h3>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">Ontario, CA</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Operations, buyer relations, compliance, and platform development.
                  Our Canadian entity handles all contracts and payments, giving
                  Western buyers the legal protection they need.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-ink">Gujarat Field Team</h3>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">Ahmedabad, IN</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our India-based auditors conduct physical factory visits across Surat,
                  Rajkot, Ahmedabad, and Vadodara. They speak Gujarati, understand local
                  business culture, and know how to spot quality issues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-trust rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to source from Gujarat?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Browse 500+ physically verified manufacturers across textiles, engineering,
            pharmaceuticals, diamonds, chemicals, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/suppliers"
              className="inline-flex items-center justify-center gap-2 bg-white text-trust font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              Browse Verified Suppliers
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
