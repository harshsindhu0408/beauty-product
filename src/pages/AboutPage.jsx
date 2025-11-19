"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import dynamic from 'next/dynamic';


const ReactLenis = dynamic(
  () => import('@studio-freight/react-lenis').then((mod) => mod.ReactLenis),
  { ssr: false }
);

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const teamMembers = [
    {
      id: 1,
      name: "Mr. Anirudh Dalal",
      role: "CEO & MD",
      imageSrc:
        "https://res.cloudinary.com/dnvjct2if/image/upload/v1752659080/Gemini_Generated_Image_mrz04nmrz04nmrz0_wyivyp.png",
    },
    {
      id: 2,
      name: "Ms. Anushka",
      role: "Head Herbalist & Botanist",
      imageSrc:
        "https://res.cloudinary.com/dnvjct2if/image/upload/v1752658912/Gemini_Generated_Image_tt0c78tt0c78tt0c_uun3pn.png",
    },
    {
      id: 3,
      name: "Me. Harsh Sindhu",
      role: "Tech Lead",
      imageSrc:
        "https://media.licdn.com/dms/image/v2/D4D03AQEARa1CJpVydw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1693982290041?e=1764201600&v=beta&t=Ebvg_Cqz4tJ1ty9ANB--Op5CafrLpYIA4g4_Ow38PZE",
    },
  ];

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-transparent border-r-transparent border-pink-500 border-l-pink-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main
          ref={containerRef}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        >
          {/* Floating gradient blobs */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute w-[80vw] h-[60vh] bg-pink-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 top-1/4 left-1/4"
              animate={{
                x: ["0%", "5%", "0%"],
                y: ["0%", "10%", "0%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-[80vw] h-[60vh] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 bottom-1/4 right-1/4"
              animate={{
                x: ["0%", "-8%", "0%"],
                y: ["0%", "-12%", "0%"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute w-[60vw] h-[50vh] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 top-1/3 right-1/3"
              animate={{
                x: ["0%", "15%", "0%"],
                y: ["0%", "-5%", "0%"],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 4,
              }}
            />
          </div>

          {/* Hero Section */}
          <section className="relative pt-26 flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.3,
                    },
                  },
                }}
                className="text-center"
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="block">Redefining</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Beauty</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 w-full h-4 bg-pink-200/60 z-0 transform origin-left"
                      style={{ bottom: "15%" }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
                >
                  Where science meets soul in the pursuit of conscious beauty
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  transition={{ delay: 1 }}
                  className="flex justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-bounce"
                    >
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="relative z-20 py-20">
            <div className="container mx-auto px-6 max-w-5xl">
              {/* Philosophy Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-32"
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      Our Ethos
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-full my-8" />
                    <p className="text-pink-600 font-medium">01 — Philosophy</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        We don&apos;t just create skincare — we craft
                        transformative experiences that reconnect you with your
                        most authentic self. At Saundrya Earth, we reject the
                        conventional beauty paradigm that prioritizes
                        concealment over celebration.
                      </motion.p>
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        Our philosophy is rooted in three fundamental
                        principles: radical transparency, intentional
                        formulation, and holistic wellbeing. Each product is
                        meticulously designed to work in harmony with your
                        skin&apos;s natural biology rather than against it.
                      </motion.p>
                      <motion.div
                        variants={fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8"
                      >
                        <div className="flex items-start">
                          <div className="text-pink-500 mr-4 text-2xl"></div>
                          <p className="text-gray-700 italic text-lg">
                            Beauty should celebrate your uniqueness, not mask
                            it. Our formulations enhance rather than alter,
                            working with your skin&apos;s natural intelligence.
                          </p>
                        </div>
                        <div className="mt-6 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold mr-4">
                            AD
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Anirudh Dalal
                            </p>
                            <p className="text-sm text-gray-500">CEO</p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Values Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-32"
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      Ethical Impact
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full my-8" />
                    <p className="text-purple-600 font-medium">02 — Values</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        We don&apos;t just create skincare — we craft
                        transformative experiences that reconnect you with your
                        most authentic self. At Saundrya Earth, we reject the
                        conventional beauty paradigm that prioritizes
                        concealment over celebration.
                      </motion.p>

                      <motion.div
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
                      >
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <div className="text-4xl text-purple-500 mb-4">
                            2,300+
                          </div>
                          <p className="text-gray-700">
                            Farming families supported through ethical sourcing
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <div className="text-4xl text-purple-500 mb-4">
                            48
                          </div>
                          <p className="text-gray-700">
                            Foundation shades with undertone variations
                          </p>
                        </div>
                      </motion.div>

                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed mt-8"
                      >
                        Our commitment to inclusivity extends beyond sourcing.
                        We&apos;ve developed the beauty industry&apos;s most
                        comprehensive shade matching system, offering 48
                        foundation shades with undertone variations for all skin
                        types.
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Sustainability Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-32"
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      Our Sustainable Foundation
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-full my-8" />
                    <p className="text-blue-600 font-medium">
                      03 — Core Commitment
                    </p>
                  </div>

                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        At our core, sustainability isn&apos;t a marketing
                        tactic—it&apos;s the bedrock of our existence.
                        We&apos;ve built our operations around principles that
                        actively regenerate rather than simply reduce harm.
                      </motion.p>

                      <motion.div
                        variants={fadeIn}
                        className="bg-blue-50 rounded-2xl p-8 border border-blue-100"
                      >
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">
                          Carbon-Negative Achievements
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              100% renewable energy across all facilities
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Regenerative agricultural partnerships that
                              restore topsoil
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Pioneering carbon capture implementation
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Closed-loop water systems in manufacturing
                            </span>
                          </li>
                        </ul>
                      </motion.div>

                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        Our innovations extend to every touchpoint—from
                        plant-derived, biodegradable packaging that nourishes
                        the earth to supply chains that strengthen local
                        ecosystems.
                      </motion.p>

                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        We measure success not just by what we create, but by
                        what we preserve. For every product made, we ensure a
                        net-positive environmental impact through verified
                        offsets and restorative practices.
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Ritual Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-32"
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      The Ritual
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-full my-8" />
                    <p className="text-pink-600 font-medium">04 — Experience</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        We believe skincare is sacred self-care — a daily ritual
                        that nourishes both complexion and spirit. Our products
                        are designed with circadian rhythm science to sync with
                        your body&apos;s natural cycles.
                      </motion.p>

                      <motion.div
                        variants={fadeIn}
                        className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl shadow-sm border border-pink-100 mt-8"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
                          The Saundrya Earth Method
                        </h3>
                        <div className="space-y-4">
                          {[
                            "Morning Revival Serum with adaptogenic mushrooms",
                            "Midnight Restoration Cream with chronobiology",
                            "Sensory Wellness technology for stress reduction",
                            "Mindfulness integration with breathwork",
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              whileInView={{ x: 0, opacity: 1 }}
                              transition={{
                                delay: index * 0.1 + 0.5,
                                ease: "easeOut",
                              }}
                              viewport={{ once: true }}
                              className="flex items-start"
                            >
                              <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mr-4 mt-1 flex-shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                              <p className="text-gray-700">{item}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Team Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      Our Collective
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full my-8" />
                    <p className="text-purple-600 font-medium">05 — People</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        **Saundrya Earth** is powered by an extraordinary
                        collective of scientists, healers, artists, and
                        change-makers. Our team includes PhD chemists, master
                        herbalists, sustainable packaging engineers, and
                        community impact specialists, all united by a shared
                        vision.
                      </motion.p>

                      <motion.div
                        variants={fadeIn}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8"
                      >
                        {teamMembers.map((member) => (
                          <motion.div
                            key={member.id}
                            whileHover={{ y: -5 }}
                            transition={{ ease: "easeOut" }}
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                          >
                            {/* This is where the image will be rendered */}
                            <div className="aspect-square w-full relative">
                              <img
                                src={member.imageSrc}
                                alt={member.name}
                                className="w-full h-full object-cover" // Ensures image fills the container and covers it
                              />
                            </div>
                            <div className="p-4">
                              <p className="font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {member.role}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed mt-8"
                      >
                        As we look to the future, our North Star remains
                        unchanged: to prove that business can be a force for
                        healing — of skin, of community, of planet. We&apos;re
                        driven by the belief that conscious choices lead to
                        profound impact.
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </main>
      </ReactLenis>
    </>
  );
}
