"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Award, BookOpen, Users, MapPin, Phone, Mail } from "lucide-react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-amber-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-semibold text-xl tracking-tight text-neutral-900">BONSAI EDUCATIONS</span>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 flex flex-col items-center text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-neutral-900 mb-6">
            Profound learning. <br className="hidden md:block"/> Absolute clarity.
          </h1>
          <p className="text-xl md:text-2xl font-medium text-neutral-500 mb-10 max-w-2xl mx-auto tracking-tight">
            The next generation of tuition is here. Powered by top faculty, intelligent analytics, and unyielding dedication to student success.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/auth/login"
              className="bg-neutral-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-neutral-800 transition-transform active:scale-95"
            >
              Sign In to Portal
            </Link>
            <Link
              href="#about"
              className="text-neutral-900 font-medium text-lg flex items-center hover:underline underline-offset-4 group"
            >
              Learn more <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto">
           <motion.div 
             initial="hidden" 
             whileInView="visible" 
             viewport={{ once: true, margin: "-100px" }}
             variants={fadeIn}
             className="grid md:grid-cols-2 gap-16 items-center"
           >
             <div>
               <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">A legacy of brilliant minds.</h2>
               <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                 Founded in 1998, the BONSAI EDUCATIONS has consistently ranked as the #1 destination for holistic education. We don't just teach the syllabus; we nurture critical thinking, instilling a profound understanding of the sciences, mathematics, and arts.
               </p>
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                 <BookOpen className="w-10 h-10 text-amber-600 mb-4" />
                 <h3 className="font-semibold text-xl mb-2">Modern Curriculum</h3>
                 <p className="text-neutral-500 text-sm">Adaptive learning pathways designed for today's dynamic world.</p>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center mt-12">
                 <Users className="w-10 h-10 text-amber-600 mb-4" />
                 <h3 className="font-semibold text-xl mb-2">Expert Faculty</h3>
                 <p className="text-neutral-500 text-sm">Learn from the very best educators and industry veterans.</p>
               </div>
             </div>
           </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-neutral-900">Numbers that speak.</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold text-neutral-900 mb-4">10k+</span>
                <span className="text-lg font-medium text-neutral-500">Students Honored</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold text-neutral-900 mb-4">98%</span>
                <span className="text-lg font-medium text-neutral-500">Success Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold text-neutral-900 mb-4">50+</span>
                <span className="text-lg font-medium text-neutral-500">State Ranks</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="bg-[#1d1d1f] text-[#f5f5f7] py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
           <div>
             <h3 className="text-2xl font-semibold mb-6 text-white">BONSAI EDUCATIONS</h3>
             <p className="text-neutral-400 max-w-sm">
               Empowering minds and shaping the leaders of tomorrow through unparalleled educational standards.
             </p>
           </div>
           <div>
             <h4 className="text-lg font-medium mb-6 text-white">Contact Us</h4>
             <ul className="space-y-4 text-neutral-400">
               <li className="flex items-center"><MapPin className="w-5 h-5 mr-3" /> 123 Education Lane, Knowledge City</li>
               <li className="flex items-center"><Phone className="w-5 h-5 mr-3" /> +1 (555) 123-4567</li>
               <li className="flex items-center"><Mail className="w-5 h-5 mr-3" /> hello@bonsaieducations.com</li>
             </ul>
           </div>
           <div>
             <h4 className="text-lg font-medium mb-6 text-white">Legal</h4>
             <ul className="space-y-3 text-neutral-400">
               <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
             </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-800 text-neutral-500 text-sm">
          © 2026 BONSAI EDUCATIONS. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
