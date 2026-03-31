"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-gradient-to-b from-ink to-trust py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/70 text-lg">
            Questions about verification, partnerships, or custom sourcing
            projects — we&apos;re here.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-ink text-xl mb-4">
                Contact Details
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: "Canada Office",
                    info: "Ontario, Canada",
                    sub: "Canada-registered entity",
                  },
                  {
                    icon: MapPin,
                    title: "India Office",
                    info: "Ahmedabad, Gujarat",
                    sub: "Audit operations base",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    info: "hello@verifyindia.com",
                    sub: "Response within 24 hours",
                  },
                  {
                    icon: MessageSquare,
                    title: "WhatsApp",
                    info: "For India suppliers",
                    sub: "Click to message",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-trust/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-trust" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-ink">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-700">{item.info}</div>
                        <div className="text-xs text-gray-400">{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-ink text-sm mb-3">
                Common Inquiries
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Supplier verification application",
                  "Bulk audit package pricing",
                  "Trade association partnerships",
                  "Custom sourcing concierge",
                  "Press & media inquiries",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2">
                    Message Received!
                  </h3>
                  <p className="text-gray-500">
                    We&apos;ll get back to you within 24 hours. If you&apos;re a supplier
                    ready to apply, check out our{" "}
                    <a href="/pricing" className="text-trust font-medium hover:underline">
                      pricing page
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-ink mb-1">
                    Send a Message
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Fill out the form and we&apos;ll respond within one business day.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company / Organisation
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        I am a...
                      </label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white">
                        <option>Select one</option>
                        <option>Buyer (seeking India suppliers)</option>
                        <option>Gujarat Supplier (want to get listed)</option>
                        <option>Trade Association / Partner</option>
                        <option>Press / Media</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none"
                      placeholder="Tell us more about what you need..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-trust text-white font-bold py-3.5 rounded-xl hover:bg-trust/90 transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
