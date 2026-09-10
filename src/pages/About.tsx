// src/pages/About.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Target,
  Gem,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Trusted & Secure",
      description:
        "Security and customer trust are among our highest priorities.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Reliable shipping designed to get your products to you quickly.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description:
        "A simple and straightforward return process for eligible items.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "Friendly assistance whenever you need help with your orders.",
    },
  ];

  const values = [
    "Quality Products",
    "Customer Satisfaction",
    "Trust & Security",
    "Continuous Improvement",
    "Integrity & Responsibility",
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-sm font-semibold mb-8">
                <Sparkles size={16} />
                About CC Ecom
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
            >
              Our Story,
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
                Our Purpose
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl mx-auto mt-8 text-lg md:text-xl text-zinc-400 leading-relaxed"
            >
              Building a trusted digital shopping experience through quality,
              reliability, innovation, and a commitment to serving customers.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-sky-500/10 blur-3xl rounded-[40px]" />

              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 md:p-14">
                <span className="inline-flex px-4 py-2 rounded-full bg-sky-500/10 text-sky-400 text-sm font-semibold mb-6">
                  Our Story
                </span>

                <h2 className="text-4xl font-bold mb-8">
                  How CC Ecom Started
                </h2>

                <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
                  <p>
                    CC Ecom is a digital commerce platform where customers can
                    directly purchase CounciCroff products from their devices.
                    It was crafted and founded by Yelrah YC (Ygaslavian Concierge) with a
                    simple vision: to provide products that contribute to
                    everyday lifestyle—from clothing and fragrances to food and
                    beverages.
                  </p>

                  <p>
                    The purpose behind this platform was never just about
                    creating another online store. It was about building
                    something meaningful, useful, and capable of serving people
                    while representing Filipino creativity, determination, and
                    innovation.
                  </p>

                  <blockquote className="border-l-4 border-orange-500 bg-zinc-950/50 rounded-r-2xl p-6 italic text-zinc-200">
                    “I started building this platform when I was 16 years old
                    while living in a shelter l can't be consider a house,the life of being nothing but only the empty stomach.Due the poverty the resources i have is limited but my consciousness is continuously sour then limitions and agitate destroyed.
                    Despite those challenges, I realized that every humam being has a different way to survive the white part of life,which is different vision of the chances.”
                  </blockquote>

                  <p>
                    Throughout the journey,i started it from scratch,zero and broke. Rather than focusing on obstacles, I focused on
                    finding solutions and improving my skills. Every challenge
                    became an opportunity to learn something new and move one
                    step closer to my goals.
                  </p>

                  <p>
                    Building a digital platform requires attention, focus, and
                    genuine interest. These three principles became the
                    foundation of both my personal growth and the development of
                    CC Ecom.
                  </p>

                  <p>
                    Starting from scratch meant learning everything step by
                    step. I studied the fundamentals of software development,
                    explored modern technologies, and used artificial
                    intelligence as a tool to improve efficiency and accelerate
                    learning.
                  </p>

                  <p>
                    At the same time, I invested time in understanding software
                    security to ensure that customer trust and safety would
                    always remain a priority.
                  </p>

                  <p>
                    Today, CC Ecom continues to grow with the same values it
                    started with: quality, reliability, continuous learning, and
                    a commitment to serving customers with integrity.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <motion.div
                variants={fadeUp}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-10"
              >
                <Target className="w-12 h-12 text-sky-400 mb-6" />

                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>

                <p className="text-zinc-300 leading-relaxed">
                  To provide quality products, dependable service, and a secure
                  shopping experience while continuously improving the value we
                  deliver to our customers.When the time or seasson turn to me and the dream i struggle the most even my life is the collateral or guarantee.Is will be in my hand and contributing the nation needs.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-10"
              >
                <Gem className="w-12 h-12 text-orange-500 mb-6" />

                <h3 className="text-3xl font-bold mb-4">Our Values</h3>

                <div className="space-y-4">
                  {values.map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-3 text-zinc-300"
                    >
                      <HeartHandshake
                        size={18}
                        className="text-orange-500"
                      />
                      {value}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-bold text-center mb-14"
              >
                Why Choose CC Ecom?
              </motion.h2>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    variants={fadeUp}
                    whileHover={{
                      y: -8,
                    }}
                    className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">
                      <feature.icon className="text-orange-500" size={28} />
                    </div>

                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Customer Promise */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gradient-to-r from-orange-500/10 to-sky-500/10 border border-zinc-800 rounded-[32px] p-10 md:p-14"
            >
              <h2 className="text-4xl font-bold mb-6">
                Our Commitment
              </h2>

              <p className="text-zinc-300 text-lg leading-relaxed">
                Every decision we make is guided by a commitment to quality,
                customer satisfaction, and continuous improvement. We aim to
                provide a shopping experience that customers can trust today and
                in the future.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Explore What CC Ecom Has To Offer
            </motion.h2>

            <p className="text-zinc-400 text-lg mb-10">
              Discover products carefully selected to bring quality,
              convenience, and value to your lifestyle.
            </p>

            <Link to="/Shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-colors"
              >
                Start Shopping
                <ArrowRight size={22} />
              </motion.button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;