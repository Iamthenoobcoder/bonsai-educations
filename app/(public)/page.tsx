"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, TrendingUp, Check, Star, Trophy } from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: BookOpen, title: "Modern Curriculum", desc: "Adaptive learning pathways engineered for today's competitive examinations and tomorrow's challenges." },
    { icon: Users, title: "Expert Faculty", desc: "Learn from educators who have shaped top achievers and rank holders consistently." },
    { icon: TrendingUp, title: "Proven Results", desc: "Consistent excellence across all subjects, with multiple state and district recognitions." },
  ];

  const faculty = [
    { name: "Dr. Rajesh Kumar", sub: "Mathematics", qual: "Ph.D, IIT Delhi", init: "RK", color: "#1e3a5f" },
    { name: "Ms. Priya Sharma", sub: "Physics", qual: "M.Sc., B.Ed.", init: "PS", color: "#0F6E56" },
    { name: "Mr. Anil Kapoor", sub: "Chemistry", qual: "M.Sc., Experienced", init: "AK", color: "#7c3aed" },
    { name: "Mrs. Sunita Rao", sub: "English", qual: "M.A., B.Ed.", init: "SR", color: "#b45309" },
  ];

  const toppers = [
    { name: "Arjun Mehta", score: "Top Scorer", year: "Recent", stream: "PCM", rank: "State Ranked" },
    { name: "Priya Nair", score: "Exceptional", year: "Recent", stream: "Commerce", rank: "District Topper" },
    { name: "Rahul Gupta", score: "Merit List", year: "Alumni", stream: "PCM", rank: "State Recognized" },
    { name: "Sneha Joshi", score: "Outstanding", year: "Alumni", stream: "Science", rank: "District Topper" },
  ];

  const testimonials = [
    { quote: "Bonsai transformed my daughter's understanding of Mathematics. She went from struggling to excelling in boards.", name: "Pradeep Verma", role: "Parent" },
    { quote: "The faculty here genuinely cares. My competitive exam rank improved drastically after joining Bonsai.", name: "Aryan Singh", role: "Engineering Aspirant" },
    { quote: "Best institute in Ludhiana for Science students. Clear concepts, regular tests, and personal attention.", name: "Meera Patel", role: "Student" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  return (
    <div className="overflow-x-hidden text-gray-900 bg-white">
      {/* NAV */}
      <nav
        style={{
          background: scrolled ? "rgba(255,255,255,.95)" : "var(--color-navy)",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "none",
        }}
        className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 md:px-[5%] backdrop-blur-md transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600 text-white">
            <BookOpen size={18} />
          </div>
          <span className={`font-bold text-[15px] tracking-wide ${scrolled ? "text-navy" : "text-white"}`}>
            BONSAI EDUCATIONS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["About", "Courses", "Faculty", "Results"].map((l) => (
            <span key={l} className={`text-sm font-medium cursor-pointer transition-colors ${scrolled ? "text-gray-600 hover:text-navy" : "text-white/75 hover:text-white"}`}>
              {l}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className={`px-5 py-2 text-sm font-medium rounded-lg border-2 transition-all ${scrolled ? "border-gray-200 text-navy hover:bg-gray-50" : "border-white/50 text-white hover:bg-white/10 hover:border-white/80"}`}>
            Sign In
          </Link>
          <Link href="/auth/signup" className="px-5 py-2 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 hover:-translate-y-0.5 transition-all shadow-md shadow-teal-600/30">
            Enroll Now
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-navy) 0%, #163a5c 50%, var(--color-teal) 100%)",
          backgroundSize: "200% 200%",
        }}
        className="relative min-h-[560px] px-6 md:px-[5%] py-[72px] pb-[60px] overflow-hidden flex flex-col md:flex-row items-center gap-12"
      >
        <div className="absolute top-[-80px] right-[25%] w-[320px] h-[320px] rounded-full bg-[rgba(15,110,86,.2)] blur-[60px] animate-[pulse_5s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-60px] left-[10%] w-[240px] h-[240px] rounded-full bg-[rgba(201,148,10,.15)] blur-[50px] animate-[pulse_6s_ease-in-out_infinite_.5s]" />

        <div className="flex-1 relative z-10">
          <div className="fade-up inline-block bg-[rgba(201,148,10,.2)] border border-[rgba(201,148,10,.4)] rounded-full px-4 py-1.5 mb-5">
            <span className="text-gold text-[13px] font-semibold tracking-wide">
              ✦ Premier Tuition Institute · Ludhiana, Punjab
            </span>
          </div>
          <h1 className="display fade-up-2 text-white text-5xl md:text-[58px] font-bold leading-[1.1] mb-5 tracking-tight">
            Profound learning.<br />
            <span className="text-gold">Absolute clarity.</span>
          </h1>
          <p className="fade-up-3 text-white/75 text-[17px] leading-relaxed max-w-[440px] mb-8">
            Serving students across Ludhiana with excellence. Consistent top performers, state ranks, and remarkable success rates.
          </p>
          <div className="fade-up-4 flex gap-3">
            <Link href="/auth/login" className="px-8 py-3.5 rounded-lg bg-teal-600 text-white font-semibold text-[15px] hover:bg-teal-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-teal-600/30">
              Sign In to Portal
            </Link>
            <Link href="#about" className="px-8 py-3.5 rounded-lg border-2 border-white/50 text-white font-medium text-[15px] hover:bg-white/10 hover:border-white/80 transition-all">
              Explore Courses ↓
            </Link>
          </div>
        </div>

        <div className="glass float fade-up-3 p-7 md:min-w-[280px] relative z-10">
          <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-5">At a glance</p>
          {[
            ["Growing", "Student Community"],
            ["Exceptional", "Board Performance"],
            ["Proven", "Legacy of Excellence"],
            ["Expert", "Teaching Faculty"],
          ].map(([v, l]) => (
            <div key={l} className="flex justify-between items-center mb-3.5 pb-3.5 border-b border-white/10">
              <span className="text-gold text-xl font-bold">{v}</span>
              <span className="text-white/70 text-xs text-right max-w-[110px]">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-6 md:px-[5%] bg-white grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-[3px] h-8 bg-gold rounded-full" />
            <span className="text-gold text-[13px] font-semibold tracking-widest uppercase">About Us</span>
          </div>
          <h2 className="display text-[40px] font-bold text-navy mb-4 leading-tight">A legacy of brilliant minds.</h2>
          <p className="text-muted text-base leading-[1.8] mb-4">
            Founded in 2009, Bonsai Educations has grown to become Ludhiana's most trusted name in secondary and senior secondary coaching. We don't just teach the syllabus — we nurture critical thinking and build lasting subject mastery.
          </p>
          <p className="text-muted text-base leading-[1.8] mb-7">
            Located at 157-I, Sarabha Nagar, our campus serves students from Class 8 through 12 across Science, Commerce, and Arts streams.
          </p>
          {["Focused batch sizes for personal engagement", "Personalised attention and doubt-clearing sessions", "Regular mock exams aligned to board patterns"].map((t) => (
            <div key={t} className="flex items-center gap-2.5 mb-2.5">
              <div className="w-5 h-5 rounded bg-teal-600 flex items-center justify-center shrink-0">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[14px] text-gray-700">{t}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["#EEF3FA", "var(--color-navy)", "Founded", "Established", "Pioneering education in Ludhiana"],
            ["#E1F5EE", "var(--color-teal)", "Subjects", "Comprehensive", "Science, Commerce & Arts"],
            ["#FEF9EC", "var(--color-gold)", "Batches", "Flexible", "Morning & Evening timings"],
            ["#F3F0FF", "#5b21b6", "Reach", "Expanding", "Serving students across the city"],
          ].map(([bg, ac, label, v, sub]) => (
            <div key={label} style={{ background: bg }} className="rounded-xl p-5">
              <p style={{ color: ac }} className="text-[11px] font-bold tracking-widest uppercase mb-1.5">{label}</p>
              <p className="text-navy text-xl font-extrabold mb-1">{v}</p>
              <p className="text-muted text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="py-20 px-6 md:px-[5%] bg-surface">
        <div className="text-center mb-12">
          <span className="text-teal-600 text-[13px] font-semibold tracking-widest uppercase">Why Choose Us</span>
          <h2 className="display text-[38px] font-bold text-navy mt-2.5">What sets us apart</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/5">
              <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center mb-5 text-teal-600">
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2.5">{f.title}</h3>
              <p className="text-muted text-[14px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-20 px-6 md:px-[5%] bg-white">
        <div className="text-center mb-12">
          <span className="text-gold text-[13px] font-semibold tracking-widest uppercase">Our Students Excel</span>
          <h2 className="display text-[38px] font-bold text-navy mt-2.5">A Record of Excellence</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5 mb-10">
          {toppers.map((t, i) => (
            <div key={i} className="border border-border rounded-xl p-6 border-l-4 border-l-gold animate-[count_.5s_both]" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-11 h-11 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-[15px] mb-3.5">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="font-bold text-navy text-[15px]">{t.name}</p>
              <p className="text-gold text-xl font-extrabold my-1.5">{t.score}</p>
              <p className="text-muted text-xs">{t.stream} · {t.year}</p>
              <div className="mt-2.5 inline-block bg-[#fef9ec] rounded-full px-2.5 py-1">
                <span className="text-gold text-[11px] font-semibold flex items-center gap-1">
                  <Trophy size={10} /> {t.rank}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FACULTY */}
      <section className="py-20 px-6 md:px-[5%] bg-gradient-to-b from-navy to-[#163a5c]">
        <div className="text-center mb-12">
          <span className="text-white/50 text-[13px] font-semibold tracking-widest uppercase">The Team</span>
          <h2 className="display text-[38px] font-bold text-white mt-2.5">Meet Our Faculty</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {faculty.map((f) => (
            <div key={f.name} className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center transition-colors hover:bg-white/10">
              <div style={{ background: f.color }} className="w-[60px] h-[60px] rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-lg mb-3.5">
                {f.init}
              </div>
              <p className="text-white font-semibold text-[15px] mb-1">{f.name}</p>
              <p className="text-teal-400 text-[13px] font-medium mb-1">{f.sub}</p>
              <p className="text-white/40 text-xs">{f.qual}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 md:px-[5%] bg-surface overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="display text-[38px] font-bold text-navy">What our students say</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-2xl p-8 flex-1 transition-all duration-400"
              style={{
                opacity: i === activeTestimonial ? 1 : 0.6,
                transform: i === activeTestimonial ? "scale(1.02)" : "scale(0.98)",
              }}
            >
              <div className="text-gold text-5xl leading-[0.8] mb-4 font-serif">"</div>
              <p className="text-gray-700 text-[14px] leading-[1.85] mb-5 italic">{t.quote}</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-white text-xs font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-[13px] text-navy">{t.name}</p>
                  <p className="text-muted text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-7">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${i === activeTestimonial ? "w-6 bg-teal-600" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy pt-14 pb-7 border-t-[3px] border-teal-600">
        <div className="max-w-7xl mx-auto px-6 md:px-[5%]">
          <div className="grid md:grid-cols-[2fr_1fr_1.5fr] gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                  <BookOpen size={15} className="text-white" />
                </div>
                <span className="text-white font-bold text-[14px]">BONSAI EDUCATIONS</span>
              </div>
              <p className="text-white/60 text-[13.5px] leading-[1.8] max-w-[380px]">
                Empowering minds and shaping the leaders of tomorrow through unparalleled educational standards. We don't just teach the syllabus — we nurture critical thinking.
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase mb-5">Quick Links</p>
              <div className="flex flex-col gap-3">
                {["About Us", "Courses", "Faculty", "Results", "Contact Us", "Student Portal"].map((l) => (
                  <Link key={l} href={l === "Student Portal" ? "/auth/login" : `#${l.toLowerCase().replace(" ", "-")}`} className="text-white/60 hover:text-white text-[13px] w-fit transition-colors">
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-bold tracking-widest uppercase mb-5">Contact</p>
              <div className="flex flex-col gap-3.5">
                <span className="text-white/60 text-[13px] leading-[1.6]">157-I, Sarabha Nagar, Ludhiana, Punjab - 141001</span>
                <span className="text-white/60 text-[13px] leading-[1.6]">+91 97819 92924</span>
                <span className="text-white/60 text-[13px] leading-[1.6]">info@bonsaieducations.in</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-white/40 text-xs">© 2026 BONSAI EDUCATIONS. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="#" className="text-white/40 text-xs hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-white/40 text-xs hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
