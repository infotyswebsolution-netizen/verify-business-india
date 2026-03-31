import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const INDUSTRY_DATA = {
  textiles: {
    name: "Textiles & Fabrics",
    tagline: "Surat — India's Textile Capital",
    description:
      "Surat produces 40% of India's synthetic fabric output. Our verified textile suppliers cover everything from raw fabric production to finished garments, embroidery, and specialty textiles.",
    stats: [
      { value: "120+", label: "Verified Suppliers" },
      { value: "$3.2B", label: "Annual Export Value" },
      { value: "1,000+", label: "Product Variants" },
      { value: "40+", label: "Export Countries" },
    ],
    categories: [
      "Synthetic Fabrics", "Sarees & Dress Material", "Embroidery & Lace",
      "Georgette & Chiffon", "Polyester Fabrics", "Silk Blends",
      "Cotton Fabrics", "Technical Textiles", "Knitted Fabrics",
    ],
    cities: ["Surat", "Ahmedabad", "Bhavnagar"],
    buyers: ["Fashion brands", "Wholesale distributors", "Garment manufacturers", "Retail importers"],
    certifications: ["OEKO-TEX Standard 100", "ISO 9001", "GOTS (Organic Textiles)", "Export License"],
    color: "from-purple-900 to-purple-700",
    iconColor: "text-purple-300",
  },
  diamonds: {
    name: "Diamonds & Gems",
    tagline: "Surat — Diamond Polishing Capital of the World",
    description:
      "Surat polishes 90% of the world's diamonds by volume. Our verified gem suppliers are established polishing houses with documented export histories to the US, Belgium, UAE, and Hong Kong.",
    stats: [
      { value: "80+", label: "Verified Suppliers" },
      { value: "$24B", label: "Annual Export Value" },
      { value: "100+", label: "Diamond Grades" },
      { value: "20+", label: "Export Countries" },
    ],
    categories: [
      "Brilliant Cut Diamonds", "Princess Cut", "Pear & Oval Shapes",
      "Loose Polished Diamonds", "Diamond Melee", "Colored Diamonds",
      "Gemstones", "Lab-Grown Diamonds", "Diamond Jewellery",
    ],
    cities: ["Surat"],
    buyers: ["Jewelry retailers", "Diamond traders", "Wholesale gem buyers", "Luxury brands"],
    certifications: ["GIA Certification", "IGI Certification", "Export License", "KP Certificate"],
    color: "from-blue-900 to-blue-700",
    iconColor: "text-blue-300",
  },
  metals: {
    name: "Metals & Welding",
    tagline: "Rajkot — Engineering Hub of India",
    description:
      "Rajkot is home to 3,000+ precision engineering and welding units. Our verified metal suppliers specialize in CNC machining, castings, forgings, and custom fabrication for global industrial buyers.",
    stats: [
      { value: "150+", label: "Verified Suppliers" },
      { value: "$1.8B", label: "Annual Export Value" },
      { value: "500+", label: "Component Types" },
      { value: "35+", label: "Export Countries" },
    ],
    categories: [
      "CNC Machined Parts", "Investment Castings", "Die Castings",
      "Steel Forgings", "Welded Assemblies", "Automotive Components",
      "Pump & Valve Parts", "Agricultural Equipment", "Custom Fabrication",
    ],
    cities: ["Rajkot", "Ahmedabad", "Jamnagar", "Morbi"],
    buyers: ["Industrial OEMs", "Automotive suppliers", "Agricultural equipment buyers", "Infrastructure companies"],
    certifications: ["ISO 9001", "ISO/TS 16949", "CE Marking", "Export License"],
    color: "from-slate-800 to-slate-600",
    iconColor: "text-slate-300",
  },
  chemicals: {
    name: "Chemicals",
    tagline: "Ahmedabad — Chemical Manufacturing Corridor",
    description:
      "Gujarat produces 65% of India's chemicals and petrochemicals. Our verified chemical suppliers operate under strict environmental and safety compliance, with documented export histories.",
    stats: [
      { value: "90+", label: "Verified Suppliers" },
      { value: "$4.1B", label: "Annual Export Value" },
      { value: "300+", label: "Chemical Grades" },
      { value: "45+", label: "Export Countries" },
    ],
    categories: [
      "Specialty Chemicals", "Surfactants", "Dyes & Pigments",
      "Agrochemicals", "Polymer Additives", "Industrial Solvents",
      "Pharmaceutical Intermediates", "Rubber Chemicals", "Water Treatment",
    ],
    cities: ["Ahmedabad", "Vadodara", "Ankleshwar", "Surat"],
    buyers: ["Industrial processors", "Pharma companies", "Agri-input distributors", "Paint manufacturers"],
    certifications: ["ISO 14001", "REACH Compliance", "Export License", "Factory Inspection Certificate"],
    color: "from-green-900 to-green-700",
    iconColor: "text-green-300",
  },
  pharmaceuticals: {
    name: "Pharmaceuticals",
    tagline: "Ahmedabad — India's Pharma Valley",
    description:
      "Gujarat is home to 40% of India's pharmaceutical exports. Our verified pharma suppliers hold WHO-GMP, FDA, and EU-GMP certifications, making them qualified for regulated markets.",
    stats: [
      { value: "60+", label: "Verified Suppliers" },
      { value: "$8.2B", label: "Annual Export Value" },
      { value: "200+", label: "Drug Formulations" },
      { value: "50+", label: "Export Countries" },
    ],
    categories: [
      "Generic Drugs (Solid Dose)", "API & Intermediates",
      "Nutraceuticals", "Herbal Extracts", "Injectables",
      "OTC Products", "Veterinary Pharmaceuticals", "CDMO Services",
    ],
    cities: ["Ahmedabad", "Vadodara", "Ankleshwar"],
    buyers: ["Pharma distributors", "Hospital procurement", "Retail pharmacy chains", "Export trading companies"],
    certifications: ["WHO-GMP", "US FDA Approved", "EU-GMP", "ISO 13485"],
    color: "from-red-900 to-red-700",
    iconColor: "text-red-300",
  },
  engineering: {
    name: "Engineering & Machinery",
    tagline: "Rajkot & Ahmedabad — Industrial Engineering Heartland",
    description:
      "Gujarat's engineering sector produces industrial machinery, pumps, compressors, and specialized equipment exported to 50+ countries. Our verified suppliers serve OEMs across North America, Europe, and Southeast Asia.",
    stats: [
      { value: "100+", label: "Verified Suppliers" },
      { value: "$2.3B", label: "Annual Export Value" },
      { value: "400+", label: "Equipment Types" },
      { value: "50+", label: "Export Countries" },
    ],
    categories: [
      "Industrial Pumps", "Air Compressors", "Textile Machinery",
      "Food Processing Equipment", "Packaging Machinery", "Construction Equipment",
      "Agricultural Machinery", "Material Handling", "Custom Engineering",
    ],
    cities: ["Rajkot", "Ahmedabad", "Vadodara", "Anand"],
    buyers: ["Industrial OEMs", "Infrastructure developers", "Food processors", "Construction companies"],
    certifications: ["ISO 9001", "CE Marking", "BIS Certification", "Export License"],
    color: "from-orange-900 to-orange-700",
    iconColor: "text-orange-300",
  },
};

export async function generateStaticParams() {
  return Object.keys(INDUSTRY_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRY_DATA[slug as keyof typeof INDUSTRY_DATA];
  if (!industry) return { title: "Industry Not Found" };

  return {
    title: `Verified ${industry.name} Suppliers in Gujarat, India`,
    description: `Find physically audited ${industry.name.toLowerCase()} suppliers from Gujarat. ${industry.description.slice(0, 120)}...`,
  };
}

const DEMO_SUPPLIERS_BY_INDUSTRY: Record<string, Array<{
  name: string; slug: string; city: string;
  tier: "bronze" | "silver" | "gold"; score: number; reviews: number;
}>> = {
  textiles: [
    { name: "Shree Textile Mills", slug: "shree-textile-mills", city: "Surat", tier: "gold", score: 92, reviews: 18 },
    { name: "Akar Fabrics", slug: "akar-fabrics", city: "Surat", tier: "silver", score: 78, reviews: 6 },
    { name: "Gujarat Weaves", slug: "gujarat-weaves", city: "Ahmedabad", tier: "bronze", score: 64, reviews: 3 },
  ],
  metals: [
    { name: "Rajkot Precision Engineering", slug: "rajkot-precision-engineering", city: "Rajkot", tier: "gold", score: 88, reviews: 12 },
    { name: "Jamnagar Brass Parts", slug: "jamnagar-brass-parts", city: "Jamnagar", tier: "bronze", score: 65, reviews: 4 },
  ],
  diamonds: [
    { name: "Diamond Star Exports", slug: "diamond-star-exports", city: "Surat", tier: "silver", score: 79, reviews: 7 },
  ],
  pharmaceuticals: [
    { name: "Vadodara Pharma Labs", slug: "vadodara-pharma-labs", city: "Vadodara", tier: "gold", score: 95, reviews: 22 },
  ],
  chemicals: [
    { name: "Ahmedabad Chem Industries", slug: "ahmedabad-chem-industries", city: "Ahmedabad", tier: "silver", score: 74, reviews: 5 },
  ],
  engineering: [],
};

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = INDUSTRY_DATA[slug as keyof typeof INDUSTRY_DATA];
  if (!industry) notFound();

  const suppliers = DEMO_SUPPLIERS_BY_INDUSTRY[slug] ?? [];

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${industry.color} py-16`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/suppliers" className="hover:text-white">Suppliers</Link>
            {" / "}
            <span className="text-white">{industry.name}</span>
          </nav>

          <h1 className="text-4xl font-bold text-white mb-2">{industry.name}</h1>
          <p className={`text-base font-medium mb-4 ${industry.iconColor}`}>
            {industry.tagline}
          </p>
          <p className="text-white/80 max-w-2xl leading-relaxed text-base">
            {industry.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {industry.stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Suppliers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-ink">
                  Verified Suppliers
                </h2>
                <Link
                  href={`/suppliers?industry=${slug}`}
                  className="text-sm text-trust font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View all <ArrowRight size={13} />
                </Link>
              </div>

              {suppliers.length > 0 ? (
                <div className="space-y-3">
                  {suppliers.map((supplier) => (
                    <Link
                      key={supplier.slug}
                      href={`/suppliers/${supplier.slug}`}
                      className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 hover:border-gold/30 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-paper-dark flex items-center justify-center flex-shrink-0">
                          <Package size={18} className="text-gray-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm group-hover:text-trust transition-colors">
                            {supplier.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={10} />
                            {supplier.city}
                            <span className="mx-1">·</span>
                            <span className="text-emerald-600 font-medium">
                              {supplier.score}/100
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <VerificationBadge tier={supplier.tier} size="sm" />
                        <ArrowRight size={14} className="text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <Package size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Onboarding suppliers in this category now.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-1 text-sm text-trust font-medium hover:underline"
                  >
                    Request a specific supplier audit
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* Product Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-ink mb-4">Product Categories</h2>
              <div className="flex flex-wrap gap-2">
                {industry.categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/suppliers?industry=${slug}&q=${encodeURIComponent(cat)}`}
                    className="text-sm bg-paper border border-paper-dark text-gray-700 px-3 py-1.5 rounded-full hover:border-gold hover:text-trust transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Cities */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-ink text-sm mb-3">
                Key Manufacturing Cities
              </h3>
              <div className="space-y-2">
                {industry.cities.map((city) => (
                  <Link
                    key={city}
                    href={`/suppliers?industry=${slug}&city=${city}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-paper transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-gold" />
                      <span className="text-sm text-gray-700">{city}</span>
                    </div>
                    <ArrowRight size={12} className="text-gray-400 group-hover:text-trust" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Who Buys */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-ink text-sm mb-3">
                Common Buyer Types
              </h3>
              <ul className="space-y-1.5">
                {industry.buyers.map((buyer) => (
                  <li key={buyer} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {buyer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Certifications */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-ink text-sm mb-3">
                Key Certifications We Verify
              </h3>
              <ul className="space-y-1.5">
                {industry.certifications.map((cert) => (
                  <li key={cert} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-trust rounded-2xl p-5 text-white">
              <h3 className="font-bold text-base mb-2">
                Need a specific supplier?
              </h3>
              <p className="text-white/80 text-xs mb-4">
                Tell us what you need. We&apos;ll find and audit the right
                {" "}{industry.name.toLowerCase()} supplier within 21 days.
              </p>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 bg-white text-trust font-bold py-2.5 rounded-xl hover:bg-paper text-sm transition-colors"
              >
                Request a Supplier <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
