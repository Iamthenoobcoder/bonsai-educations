"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="BONSAI EDUCATIONS" width={40} height={40} className="object-contain" />
            <span className="font-bold text-xl tracking-tight text-neutral-900 mt-1">BONSAI EDUCATIONS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
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
                 BONSAI EDUCATIONS is a premier destination for holistic education. We don't just teach the syllabus; we nurture critical thinking, instilling a profound understanding of the sciences, mathematics, and arts.
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
               <li className="flex items-start">
                 <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" /> 
                 <a href="https://g.co/kgs/1m94DNY" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                   157-I, Sarabha Nagar, Lane opposite to Nav Durga Temple,<br/>Ludhiana, Punjab - 141001
                 </a>
               </li>
               <li className="flex items-center">
                 <Phone className="w-5 h-5 mr-3" /> 
                 <a href="tel:+919781992924" className="hover:text-white transition-colors">+91 97819 92924</a>
               </li>
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
