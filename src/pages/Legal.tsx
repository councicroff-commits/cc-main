import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Legal: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [search, setSearch] = useState("");

  const lastUpdated = "June 12, 2026";

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress((current / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section observer
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { id: "priv-overview", label: "System Declaration" },
    { id: "priv-collection", label: "Data Ingestion" },
    { id: "priv-processing", label: "Processing" },
    { id: "priv-protection", label: "Encryption" },
    { id: "priv-rights", label: "User Rights" },
    { id: "terms-intro", label: "Execution Bound" },
    { id: "terms-authorization", label: "Registration" },
    { id: "terms-assets", label: "Intellectual Property" },
    { id: "terms-valuation", label: "Pricing" },
    { id: "terms-liability", label: "Liability" },
  ];

  const filtered = navItems.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 relative overflow-hidden">

      {/* PROGRESS BAR */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-sky-400 z-50 transition-all"
        style={{ width: `${progress}%` }}
      />

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-32">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border border-zinc-800 bg-white/5 backdrop-blur-xl p-10 mb-16 overflow-hidden"
        >
          <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-sky-500/10 blur-[140px]" />
          <div className="absolute -bottom-20 left-0 w-[300px] h-[300px] bg-purple-500/10 blur-[120px]" />

          <p className="text-xs tracking-[0.35em] text-sky-400 uppercase">
            Legal Compliance System
          </p>

          <h1 className="text-4xl text-white font-light mt-3">
            Legal Framework & Governance
          </h1>

          <p className="text-xs text-zinc-500 mt-2">
            Last updated: {lastUpdated}
          </p>

          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search legal sections..."
            className="mt-6 w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none"
          />
        </motion.div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* SIDEBAR */}
          <aside className="hidden lg:block sticky top-28 h-fit border-l border-zinc-800 pl-6">
            <p className="text-xs tracking-[0.3em] text-zinc-500 mb-4">
              NAVIGATION
            </p>

            <div className="space-y-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-xs transition ${
                    activeSection === item.id
                      ? "text-sky-400"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-3 space-y-20">

            {/* PRIVACY */}
            <section className="space-y-12">

              <h2 className="text-xl text-white border-b border-zinc-800 pb-3">
                Privacy Charter
              </h2>

              <motion.section
                id="priv-overview"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sky-400 text-xs tracking-[0.3em] uppercase mb-2">
                  System Declaration
                </h3>
                <p>
                  This Privacy Charter defines how user data is collected,
                  processed, and secured within the CC Ecom ecosystem.
                </p>
              </motion.section>

              <section id="priv-collection">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Data Ingestion
                </h3>
                <p>
                  We collect only essential operational data including identity,
                  payment credentials, and system telemetry.
                </p>
              </section>

              <section id="priv-processing">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Processing
                </h3>
                <p>
                  Data is processed securely for order fulfillment, analytics,
                  and service optimization.
                </p>
              </section>

              <section id="priv-protection">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Encryption
                </h3>
                <p>
                  All sensitive data is protected using SSL encryption and
                  tokenized security layers.
                </p>
              </section>

              <section id="priv-rights">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  User Rights
                </h3>
                <p>
                  Users may request access, modification, or deletion of personal
                  data at any time.
                </p>
              </section>
            </section>

            {/* TERMS */}
            <section className="space-y-12">

              <h2 className="text-xl text-white border-b border-zinc-800 pb-3">
                Terms of Service
              </h2>

              <section id="terms-intro">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Execution Bound
                </h3>
                <p>
                  By accessing this platform, you agree to comply with all legal
                  system rules and operational policies.
                </p>
              </section>

              <section id="terms-authorization">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Registration
                </h3>
                <p>
                  Users are responsible for maintaining secure authentication
                  credentials and account safety.
                </p>
              </section>

              <section id="terms-assets">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Intellectual Property
                </h3>
                <p>
                  All UI systems, branding, design assets, and code structures are
                  protected under intellectual property law.
                </p>
              </section>

              <section id="terms-valuation">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Pricing Policy
                </h3>
                <p>
                  Pricing may change at any time without prior notice due to system
                  updates or market adjustments.
                </p>
              </section>

              <section id="terms-liability">
                <h3 className="text-xs tracking-[0.3em] uppercase mb-2">
                  Liability
                </h3>
                <p>
                  We are not responsible for downtime, interruptions, or external
                  system failures.
                </p>
              </section>
            </section>
          </main>
        </div>

        {/* FLOATING BUTTON */}
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-sky-500 text-black shadow-lg hover:scale-110 transition"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default Legal;