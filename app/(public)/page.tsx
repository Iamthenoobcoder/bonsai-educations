"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, TrendingUp, Check, Trophy } from "lucide-react";

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
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center">
        <nav
          className={`w-full max-w-6xl flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-300 backdrop-blur-md border ${
            scrolled
              ? "bg-white/90 border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-navy"
              : "bg-navy/80 border-white/10 shadow-none text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Bonsai Logo" width={32} height={32} className="rounded-lg object-contain bg-white" />
            <span className="font-bold text-[14px] tracking-wide">
              BONSAI EDUCATIONS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {[
              { label: "About", href: "#about" },
              { label: "Courses", href: "#courses" },
              { label: "Faculty", href: "#faculty" },
              { label: "Results", href: "#results" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 relative group py-1.5 px-3 rounded-full ${
                  scrolled
                    ? "text-gray-600 hover:text-navy hover:bg-zinc-100"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-1/2" />
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                scrolled
                  ? "border-zinc-200 text-navy hover:bg-zinc-50"
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-xs font-semibold rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-all duration-200 shadow-md shadow-teal-600/20"
            >
              Enroll Now
            </Link>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-navy) 0%, #163a5c 50%, var(--color-teal) 100%)",
          backgroundSize: "200% 200%",
        }}
        className="relative min-h-[560px] px-6 md:px-[5%] pt-[110px] pb-[60px] overflow-hidden flex flex-col md:flex-row items-center gap-12"
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
            <Link href="#courses" className="px-8 py-3.5 rounded-lg border-2 border-white/50 text-white font-medium text-[15px] hover:bg-white/10 hover:border-white/80 transition-all">
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
            Founded in 2009, Bonsai Educations has grown to become Ludhiana&apos;s most trusted name in secondary and senior secondary coaching. We don&apos;t just teach the syllabus — we nurture critical thinking and build lasting subject mastery.
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
      <section id="courses" className="py-20 px-6 md:px-[5%] bg-surface">
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
      <section id="results" className="py-20 px-6 md:px-[5%] bg-white">
        <div className="text-center mb-12">
          <span className="text-gold text-[13px] font-semibold tracking-widest uppercase">Our Students Excel</span>
          <h2 className="display text-[38px] font-bold text-navy mt-2.5">A Record of Excellence</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5 mb-10">
          {toppers.map((t, i) => (
            <div key={i} className="border border-border rounded-xl p-6 border-l-4 border-l-gold animate-[count_.5s_both] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-navy/5 cursor-pointer bg-white" style={{ animationDelay: `${i * 0.1}s` }}>
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

      {/* FACULTY/DIRECTOR */}
      <section id="faculty" className="py-20 px-6 md:px-[5%] bg-gradient-to-b from-navy to-[#163a5c]">
        <div className="text-center mb-12">
          <span className="text-white/50 text-[13px] font-semibold tracking-widest uppercase">The Leadership</span>
          <h2 className="display text-[38px] font-bold text-white mt-2.5">Educational Director</h2>
        </div>

        <div className="w-full max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 text-white shadow-2xl backdrop-blur-sm">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-white/10">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-navy font-bold text-3xl shadow-lg shrink-0">
              NG
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Neeraj Gupta</h3>
              <p className="text-teal-400 font-medium mt-1 text-sm md:text-base">
                Educational Director at Bonsai | PostGrad @Punjab University
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-white/60 text-xs md:text-sm">
                <span className="flex items-center gap-1.5">📍 Punjab, India</span>
                <span className="flex items-center gap-1.5">📞 (+91) 97819 92924</span>
                <span className="flex items-center gap-1.5">✉️ neerajgupta1068@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid md:grid-cols-3 gap-10 mt-8">
            {/* Left/Middle Column - Bio, Experience & Education */}
            <div className="md:col-span-2 space-y-8">
              {/* Bio */}
              <div>
                <p className="text-white/80 leading-relaxed text-sm md:text-base italic">
                  &quot;Ever since I remember, I have envisioned contributing in the educational sector with my expertise in mathematics and science. Currently, this vision is manifested by my institution Bonsai that thrives on students&apos; academic excellence and helping them shape a better future.&quot;
                </p>
              </div>

              {/* Professional Experience */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-4">Professional Experience</h4>
                <div className="space-y-6">
                  {[
                    {
                      title: "Director",
                      company: "Bonsai Educational Initiatives",
                      period: "Since 2010",
                      desc: "Has helped over 1000 students achieve their academic goals through comprehensive educational training for entrance examinations and olympiads."
                    },
                    {
                      title: "Special Trainer for Board Exams",
                      company: "Manav Rachna International School",
                      period: "March 2017 - March 2018",
                      desc: "Prepared a rigorous yet practical pedagogy for students to practice for their crucial board examinations and helping them achieve positive results."
                    },
                    {
                      title: "HOD Mathematics - Guest Faculty",
                      company: "Sahil Study Circle",
                      period: "March 2012 - March 2013",
                      desc: "Directed the Institution on integration of practical expertise into scientific theories for a better learning experience for students pursuing higher education in STEM."
                    },
                    {
                      title: "HOD Mathematics - Guest Faculty",
                      company: "Dr. RC Drishti Jain School",
                      period: "March 2011 - March 2012",
                      desc: "First hand teaching experience, and led academic curriculum preparation for science students."
                    }
                  ].map((exp, idx) => (
                    <div key={idx} className="relative pl-5 border-l-2 border-teal-500/30 hover:border-teal-400 transition-colors">
                      <div className="absolute w-2 h-2 rounded-full bg-teal-500 left-[-5px] top-1.5" />
                      <div className="flex justify-between items-baseline flex-wrap gap-2">
                        <span className="font-bold text-[15px] text-white">{exp.company}</span>
                        <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{exp.period}</span>
                      </div>
                      <p className="text-xs text-teal-300 font-medium mt-0.5">{exp.title}</p>
                      <p className="text-white/70 text-xs md:text-sm mt-1.5 leading-relaxed">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-4">Education</h4>
                <div className="space-y-4">
                  {[
                    {
                      degree: "M.Sc B.Ed Chemistry",
                      inst: "Department of Chemistry, Punjab University",
                      period: "July 2011 - May 2013"
                    },
                    {
                      degree: "B.Sc Chemistry, Physics, Mathematics",
                      inst: "Punjab University",
                      period: "July 2006 - May 2009"
                    }
                  ].map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-amber-500/30 pl-5 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-amber-500 left-[-5px] top-1.5" />
                      <div className="flex justify-between items-baseline flex-wrap gap-2">
                        <span className="font-bold text-[15px] text-white">{edu.inst}</span>
                        <span className="text-[11px] font-semibold text-white/40">{edu.period}</span>
                      </div>
                      <p className="text-xs text-amber-300 font-medium mt-0.5">{edu.degree}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Skills, Achievements, Languages */}
            <div className="space-y-8">
              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Practical Pedagogy",
                    "Data Analysis",
                    "Interpersonal Skills",
                    "Problem Solving",
                    "Team Management",
                    "Written Communication"
                  ].map((skill) => (
                    <span key={skill} className="text-xs bg-white/10 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-4">Other Achievements</h4>
                <div className="space-y-4">
                  {[
                    { title: "Trek to Everest Base Camp", subtitle: "June 2023" },
                    { title: "Academic Excellence Award, GTEA", subtitle: "2022" },
                    { title: "Appeared for Civil Services Examination", subtitle: "2021 · India's toughest government services exam (over 10 lakh aspirants)" }
                  ].map((ach, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 p-3.5 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="font-semibold text-xs md:text-sm text-white">{ach.title}</p>
                      <p className="text-white/50 text-[11px] mt-1">{ach.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-4">Languages</h4>
                <div className="space-y-2">
                  {[
                    { lang: "English", prof: "Native Bilingual" },
                    { lang: "Hindi", prof: "Native Fluency" },
                    { lang: "Punjabi", prof: "Native Fluency" }
                  ].map((l) => (
                    <div key={l.lang} className="flex justify-between items-center text-xs md:text-sm">
                      <span className="font-medium text-white">{l.lang}</span>
                      <span className="text-teal-400 text-xs">{l.prof}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              <div className="text-gold text-5xl leading-[0.8] mb-4 font-serif">&quot;</div>
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
          <div className="grid md:grid-cols-[2fr_1.5fr] gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.jpg" alt="Bonsai Logo" width={32} height={32} className="rounded-lg object-contain bg-white" />
              <span className="text-white font-bold text-[14px]">BONSAI EDUCATIONS</span>
              </div>
              <p className="text-white/60 text-[13.5px] leading-[1.8] max-w-[380px]">
                Empowering minds and shaping the leaders of tomorrow through unparalleled educational standards. We don&apos;t just teach the syllabus — we nurture critical thinking.
              </p>
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
          <div className="border-t border-white/10 pt-6 mt-4 flex justify-center items-center text-center">
            <span className="text-white/40 text-xs">© 2026 BONSAI EDUCATIONS. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
