import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Legal: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [search, setSearch] = useState("");

  const effectiveDate = "June 12, 2026";
  const version = "1.0";

  /*
   * IMPORTANT:
   * Replace these placeholders with the actual registered business details.
   */
  const company = {
    name: "CC Ecom",
    legalName: "[REGISTERED LEGAL ENTITY NAME]",
    address: "[REGISTERED BUSINESS ADDRESS]",
    email: "[LEGAL / SUPPORT EMAIL]",
    privacyEmail: "[PRIVACY / DPO EMAIL]",
    phone: "[CONTACT NUMBER]",
    country: "Republic of the Philippines",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;

      if (total <= 0) {
        setProgress(0);
        return;
      }

      const current = window.scrollY;
      setProgress(Math.min(100, Math.max(0, (current / total) * 100)));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-80px 0px -60% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const navItems = [
    {
      id: "terms-introduction",
      label: "Introduction",
    },
    {
      id: "terms-eligibility",
      label: "Eligibility & Accounts",
    },
    {
      id: "terms-orders",
      label: "Orders & Contracts",
    },
    {
      id: "terms-products",
      label: "Products & Availability",
    },
    {
      id: "terms-pricing",
      label: "Prices & Taxes",
    },
    {
      id: "terms-payment",
      label: "Payment",
    },
    {
      id: "terms-delivery",
      label: "Delivery",
    },
    {
      id: "terms-returns",
      label: "Returns & Refunds",
    },
    {
      id: "terms-warranty",
      label: "Consumer Rights",
    },
    {
      id: "terms-ip",
      label: "Intellectual Property",
    },
    {
      id: "terms-prohibited",
      label: "Prohibited Use",
    },
    {
      id: "terms-liability",
      label: "Liability",
    },
    {
      id: "terms-disputes",
      label: "Disputes & Law",
    },
    {
      id: "terms-changes",
      label: "Changes",
    },
    {
      id: "privacy-overview",
      label: "Privacy Overview",
    },
    {
      id: "privacy-collection",
      label: "Information We Collect",
    },
    {
      id: "privacy-processing",
      label: "How We Use Data",
    },
    {
      id: "privacy-sharing",
      label: "Data Sharing",
    },
    {
      id: "privacy-retention",
      label: "Data Retention",
    },
    {
      id: "privacy-rights",
      label: "Your Privacy Rights",
    },
    {
      id: "privacy-security",
      label: "Security",
    },
    {
      id: "privacy-contact",
      label: "Privacy Contact",
    },
  ];

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const sectionClass =
    "scroll-mt-28 border-b border-zinc-200 pb-10";

  const headingClass =
    "text-lg font-semibold tracking-tight text-zinc-900 mb-4";

  const paragraphClass =
    "text-[15px] leading-7 text-zinc-600";

  const listClass =
    "mt-4 space-y-3 text-[15px] leading-7 text-zinc-600";

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-zinc-800">
      {/* READING PROGRESS */}
      <div
        className="fixed left-0 top-0 z-50 h-[3px] bg-zinc-900 transition-all"
        style={{ width: `${progress}%` }}
      />

      {/* HEADER */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {company.name}
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
                Legal & Policies
              </h1>
            </div>

            <div className="text-left text-sm text-zinc-500 sm:text-right">
              <p>Version {version}</p>
              <p>Effective {effectiveDate}</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* INTRODUCTION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm lg:p-9"
        >
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Legal Information
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              Terms & Conditions and Privacy Notice
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-zinc-600">
              These Terms & Conditions govern your use of the {company.name}
              online store and your purchase of products through our website.
              Our Privacy Notice explains how we collect, use, disclose,
              retain, and protect personal information in connection with our
              services.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Business
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {company.legalName}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Jurisdiction
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {company.country}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Effective Date
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-900">
                  {effectiveDate}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-6 text-amber-900">
                <strong>Important:</strong> These policies are intended as a
                general e-commerce legal template. They should be reviewed and
                adapted to the actual business structure, products, payment
                methods, delivery arrangements, data-processing activities,
                consumer policies, and applicable laws before publication.
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-2xl">
            <label
              htmlFor="legal-search"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Search this page
            </label>

            <input
              id="legal-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search legal sections..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Contents
              </p>

              <nav className="space-y-1">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      activeSection === item.id
                        ? "bg-zinc-900 font-medium text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-3">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="space-y-0 p-7 lg:p-10">

                {/* =====================================================
                    TERMS & CONDITIONS
                ====================================================== */}

                <div className="mb-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Part I
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                    Terms & Conditions
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    Please read these terms carefully before using the website
                    or placing an order.
                  </p>
                </div>

                <section
                  id="terms-introduction"
                  className={sectionClass}
                >
                  <h3 className={headingClass}>
                    1. Introduction and Acceptance
                  </h3>

                  <p className={paragraphClass}>
                    These Terms & Conditions ("Terms") govern access to and use
                    of the {company.name} website, online store, applications,
                    and related services (collectively, the "Services").
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    By accessing the Services, creating an account, or placing
                    an order, you acknowledge that you have read and understood
                    these Terms and agree to be bound by them, to the extent
                    permitted by applicable law.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    If you do not agree with these Terms, please do not use the
                    Services or place an order.
                  </p>
                </section>

                <section
                  id="terms-eligibility"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    2. Eligibility and Customer Accounts
                  </h3>

                  <p className={paragraphClass}>
                    You must provide accurate and complete information when
                    creating an account or placing an order.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for activities performed
                    through your account, except where unauthorized use is
                    attributable to our failure to apply reasonable security
                    measures or otherwise required by law.
                  </p>
                </section>

                <section
                  id="terms-orders"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    3. Orders and Contract Formation
                  </h3>

                  <p className={paragraphClass}>
                    Product listings, descriptions, and prices displayed on the
                    website constitute invitations to purchase, subject to
                    availability and applicable law.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    When you submit an order, we may acknowledge receipt of the
                    order electronically. An order is accepted only when we
                    confirm acceptance, dispatch, or otherwise communicate
                    acceptance in accordance with our ordering process.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    We reserve the right to refuse or cancel an order where
                    permitted by law, including where a product is unavailable,
                    a material pricing or listing error occurred, fraud or
                    unauthorized activity is reasonably suspected, or payment
                    cannot be completed.
                  </p>
                </section>

                <section
                  id="terms-products"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    4. Products and Availability
                  </h3>

                  <p className={paragraphClass}>
                    We make reasonable efforts to ensure that product
                    descriptions, images, specifications, and availability
                    information are accurate.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Product colors and appearance may vary depending on your
                    device or display. Availability may change without notice.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Nothing in these Terms removes or limits rights or remedies
                    that cannot lawfully be excluded under applicable consumer
                    protection laws.
                  </p>
                </section>

                <section
                  id="terms-pricing"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    5. Prices, Taxes, and Promotional Offers
                  </h3>

                  <p className={paragraphClass}>
                    Prices displayed on the website are stated in the currency
                    indicated at checkout and are subject to applicable taxes,
                    delivery charges, and other charges disclosed before the
                    order is completed.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Promotional offers may be subject to additional terms,
                    eligibility requirements, validity periods, or quantity
                    limits, which will be disclosed with the relevant
                    promotion.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    If an obvious pricing or listing error occurs, we may take
                    appropriate corrective action consistent with applicable
                    law and will provide any required notice or refund.
                  </p>
                </section>

                <section
                  id="terms-payment"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    6. Payment
                  </h3>

                  <p className={paragraphClass}>
                    Payment must be completed using one of the payment methods
                    made available at checkout.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Payment information may be processed by authorized
                    third-party payment service providers. We do not intend to
                    store full payment-card credentials unless specifically
                    required and lawfully permitted for the applicable service.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Transactions may be subject to verification, fraud
                    prevention, authentication, and other security controls.
                  </p>
                </section>

                <section
                  id="terms-delivery"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    7. Shipping and Delivery
                  </h3>

                  <p className={paragraphClass}>
                    Delivery estimates are provided during checkout or in the
                    order confirmation. Actual delivery times may vary due to
                    location, courier operations, weather, public holidays,
                    customs procedures, or other circumstances outside our
                    reasonable control.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    We will provide available tracking information where
                    applicable.
                  </p>
                </section>

                <section
                  id="terms-returns"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    8. Returns, Cancellations, and Refunds
                  </h3>

                  <p className={paragraphClass}>
                    Returns, cancellations, replacements, and refunds are
                    governed by our published Return and Refund Policy, as well
                    as any mandatory rights available to consumers under
                    applicable law.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Where a refund is approved, the refund method and processing
                    period may depend on the original payment method and the
                    applicable payment provider.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Nothing in this section is intended to exclude or restrict
                    mandatory consumer remedies.
                  </p>
                </section>

                <section
                  id="terms-warranty"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    9. Consumer Rights and Product Warranties
                  </h3>

                  <p className={paragraphClass}>
                    We recognize applicable statutory consumer rights and
                    remedies. Where products are covered by manufacturer or
                    seller warranties, the applicable warranty terms will be
                    provided to the customer.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Nothing in these Terms limits rights that cannot legally be
                    waived, excluded, or restricted under applicable consumer
                    protection law.
                  </p>
                </section>

                <section
                  id="terms-ip"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    10. Intellectual Property
                  </h3>

                  <p className={paragraphClass}>
                    Unless otherwise stated, the website and its content,
                    including trademarks, logos, text, graphics, photographs,
                    product materials, software, layouts, and other materials,
                    are owned by or licensed to {company.name}.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    You may use the website for lawful personal or authorized
                    commercial purposes. You may not reproduce, modify,
                    distribute, reverse engineer, or commercially exploit
                    protected content without appropriate authorization.
                  </p>
                </section>

                <section
                  id="terms-prohibited"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    11. Prohibited Activities
                  </h3>

                  <p className={paragraphClass}>
                    You must not use the Services for unlawful purposes or in a
                    manner that may compromise the security, availability, or
                    integrity of the website or other users.
                  </p>

                  <ul className={listClass}>
                    <li>• Attempting unauthorized access to systems or accounts.</li>
                    <li>• Using automated tools to interfere with the Services.</li>
                    <li>• Submitting fraudulent or materially misleading information.</li>
                    <li>• Attempting to circumvent payment or security controls.</li>
                    <li>• Using the Services in violation of applicable law.</li>
                  </ul>
                </section>

                <section
                  id="terms-liability"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    12. Limitation of Liability
                  </h3>

                  <p className={paragraphClass}>
                    To the maximum extent permitted by applicable law,
                    {company.name} will not be liable for indirect or
                    consequential losses arising from use of the Services where
                    such limitation is legally enforceable.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Nothing in these Terms excludes or limits liability that
                    cannot lawfully be excluded or limited, including liability
                    arising from fraud, willful misconduct, or mandatory
                    statutory consumer rights where applicable.
                  </p>
                </section>

                <section
                  id="terms-disputes"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    13. Governing Law and Dispute Resolution
                  </h3>

                  <p className={paragraphClass}>
                    These Terms shall be governed by the laws applicable to the
                    transaction and the parties, subject to mandatory consumer
                    protection and other applicable laws.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Customers may contact us first to attempt to resolve
                    complaints or disputes informally. Nothing in these Terms
                    prevents a consumer from exercising a right or remedy
                    available under applicable law or from contacting an
                    appropriate government or regulatory authority.
                  </p>
                </section>

                <section
                  id="terms-changes"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    14. Changes to These Terms
                  </h3>

                  <p className={paragraphClass}>
                    We may update these Terms from time to time to reflect
                    changes in our Services, business practices, technology, or
                    applicable legal requirements.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    The updated version will display a new effective date. Where
                    applicable law requires additional notice or consent for a
                    material change, we will provide such notice or obtain such
                    consent.
                  </p>
                </section>

                {/* =====================================================
                    PRIVACY NOTICE
                ====================================================== */}

                <div className="mb-10 mt-16 border-t border-zinc-200 pt-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Part II
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                    Privacy Notice
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    Information regarding the collection and processing of
                    personal information.
                  </p>
                </div>

                <section
                  id="privacy-overview"
                  className={sectionClass}
                >
                  <h3 className={headingClass}>
                    15. Privacy and Data Protection
                  </h3>

                  <p className={paragraphClass}>
                    {company.legalName} respects your privacy and is committed
                    to protecting personal information in accordance with
                    applicable data protection and privacy laws, including
                    Republic Act No. 10173, the Data Privacy Act of 2012, and
                    its applicable implementing rules and regulations.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    This Privacy Notice explains what personal information we
                    collect, why we process it, how it may be shared, how long
                    it may be retained, and the rights available to data
                    subjects.
                  </p>
                </section>

                <section
                  id="privacy-collection"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    16. Information We Collect
                  </h3>

                  <p className={paragraphClass}>
                    Depending on how you use our Services, we may collect
                    information such as:
                  </p>

                  <ul className={listClass}>
                    <li>• Name and contact information.</li>
                    <li>• Billing and delivery information.</li>
                    <li>• Account credentials and account information.</li>
                    <li>• Order and transaction information.</li>
                    <li>• Customer service communications.</li>
                    <li>• Device, browser, and website usage information.</li>
                    <li>• Information required for fraud prevention and security.</li>
                  </ul>

                  <p className={`${paragraphClass} mt-4`}>
                    We will seek to collect only information that is relevant
                    and necessary for identified and legitimate purposes.
                  </p>
                </section>

                <section
                  id="privacy-processing"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    17. How We Use Personal Information
                  </h3>

                  <p className={paragraphClass}>
                    Depending on the circumstances and applicable legal basis,
                    personal information may be processed to:
                  </p>

                  <ul className={listClass}>
                    <li>• Process and fulfill orders.</li>
                    <li>• Process payments and refunds.</li>
                    <li>• Deliver products and provide customer support.</li>
                    <li>• Maintain and secure customer accounts.</li>
                    <li>• Prevent fraud and unauthorized transactions.</li>
                    <li>• Improve website performance and services.</li>
                    <li>• Comply with legal and regulatory obligations.</li>
                    <li>• Send marketing communications where legally permitted and appropriately authorized.</li>
                  </ul>

                  <p className={`${paragraphClass} mt-4`}>
                    The applicable legal basis for processing will depend on
                    the specific processing activity and applicable law.
                  </p>
                </section>

                <section
                  id="privacy-sharing"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    18. Data Sharing and Service Providers
                  </h3>

                  <p className={paragraphClass}>
                    We may disclose personal information to service providers
                    and other recipients when reasonably necessary for
                    legitimate business operations, order fulfillment, payment
                    processing, delivery, customer support, security, legal
                    compliance, or other disclosed purposes.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Depending on the service involved, recipients may include
                    payment processors, logistics providers, technology
                    providers, hosting providers, customer support providers,
                    fraud prevention providers, and professional advisers.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    We require appropriate contractual, organizational,
                    physical, and technical safeguards where required by
                    applicable law.
                  </p>
                </section>

                <section
                  id="privacy-retention"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    19. Data Retention
                  </h3>

                  <p className={paragraphClass}>
                    Personal information will be retained only for as long as
                    reasonably necessary for the purposes for which it was
                    collected, for legitimate business purposes, or as required
                    by applicable law.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    When personal information is no longer required, it will be
                    securely deleted, destroyed, anonymized, or otherwise
                    disposed of in accordance with applicable requirements.
                  </p>
                </section>

                <section
                  id="privacy-rights"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    20. Your Data Privacy Rights
                  </h3>

                  <p className={paragraphClass}>
                    Subject to applicable law and any lawful limitations, data
                    subjects may have rights including:
                  </p>

                  <ul className={listClass}>
                    <li>• The right to be informed.</li>
                    <li>• The right to access personal information.</li>
                    <li>• The right to correct inaccurate information.</li>
                    <li>• The right to object to certain processing.</li>
                    <li>• The right to request erasure or blocking where applicable.</li>
                    <li>• The right to data portability where applicable.</li>
                    <li>• The right to file a complaint with the appropriate authority.</li>
                    <li>• The right to seek damages where provided by law.</li>
                  </ul>

                  <p className={`${paragraphClass} mt-4`}>
                    Requests may be subject to verification and applicable
                    legal exceptions.
                  </p>
                </section>

                <section
                  id="privacy-security"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    21. Information Security
                  </h3>

                  <p className={paragraphClass}>
                    We maintain reasonable organizational, physical, and
                    technical safeguards designed to protect personal
                    information against unauthorized access, alteration,
                    disclosure, loss, or destruction.
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    No method of electronic transmission or storage can be
                    guaranteed to be completely secure. We therefore cannot
                    guarantee absolute security, but we will maintain
                    safeguards appropriate to the risks associated with the
                    processing of personal information.
                  </p>
                </section>

                <section
                  id="privacy-contact"
                  className={`${sectionClass} mt-10`}
                >
                  <h3 className={headingClass}>
                    22. Privacy Contact and Complaints
                  </h3>

                  <p className={paragraphClass}>
                    For questions, requests, or concerns regarding the
                    processing of personal information, please contact:
                  </p>

                  <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                    <div className="space-y-2 text-sm leading-6 text-zinc-700">
                      <p>
                        <strong>Legal Entity:</strong>{" "}
                        {company.legalName}
                      </p>

                      <p>
                        <strong>Business Address:</strong>{" "}
                        {company.address}
                      </p>

                      <p>
                        <strong>Privacy Contact:</strong>{" "}
                        {company.privacyEmail}
                      </p>

                      <p>
                        <strong>General Contact:</strong>{" "}
                        {company.email}
                      </p>

                      <p>
                        <strong>Telephone:</strong>{" "}
                        {company.phone}
                      </p>
                    </div>
                  </div>

                  <p className={`${paragraphClass} mt-5`}>
                    If you believe your data privacy rights have been violated,
                    you may also have the right to lodge a complaint with the
                    National Privacy Commission, subject to its applicable
                    procedures and jurisdiction.
                  </p>
                </section>

                {/* GENERAL */}
                <section className="mt-16 border-t border-zinc-200 pt-10">
                  <h3 className={headingClass}>
                    Contact Information
                  </h3>

                  <p className={paragraphClass}>
                    Questions regarding these Terms & Conditions may be directed
                    to{" "}
                    <a
                      href={`mailto:${company.email}`}
                      className="font-medium text-zinc-900 underline underline-offset-4"
                    >
                      {company.email}
                    </a>
                    .
                  </p>

                  <p className={`${paragraphClass} mt-4`}>
                    Questions regarding privacy and personal information may be
                    directed to{" "}
                    <a
                      href={`mailto:${company.privacyEmail}`}
                      className="font-medium text-zinc-900 underline underline-offset-4"
                    >
                      {company.privacyEmail}
                    </a>
                    .
                  </p>

                  <p className="mt-8 text-xs leading-6 text-zinc-400">
                    Last updated: {effectiveDate} · Version {version}
                  </p>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* BACK TO TOP */}
      <button
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
      >
        ↑
      </button>
    </div>
  );
};

export default Legal;
