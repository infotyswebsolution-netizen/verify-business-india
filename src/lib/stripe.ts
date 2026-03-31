import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const STRIPE_PLANS = {
  bronze: {
    name: "Bronze",
    priceId: process.env.STRIPE_PRICE_BRONZE!,
    price: 95,
    currency: "usd",
    inrPrice: 8000,
    features: [
      "Basic verified listing",
      "1 factory audit per year",
      "Bronze badge on profile",
      "Up to 10 factory photos",
      "Buyer inquiry access",
    ],
    auditsPerYear: 1,
  },
  silver: {
    name: "Silver",
    priceId: process.env.STRIPE_PRICE_SILVER!,
    price: 240,
    currency: "usd",
    inrPrice: 20000,
    features: [
      "Full verified profile",
      "2 factory audits per year",
      "Silver badge + score display",
      "Up to 20 factory photos",
      "Profile analytics dashboard",
      "Priority in search results",
    ],
    auditsPerYear: 2,
  },
  gold: {
    name: "Gold",
    priceId: process.env.STRIPE_PRICE_GOLD!,
    price: 540,
    currency: "usd",
    inrPrice: 45000,
    features: [
      "Premium featured profile",
      "4 factory audits per year",
      "Gold badge + top placement",
      "Unlimited factory photos",
      "Advanced analytics",
      "Featured on homepage",
      "See buyer details before accepting",
      "Priority email support",
    ],
    auditsPerYear: 4,
  },
};
