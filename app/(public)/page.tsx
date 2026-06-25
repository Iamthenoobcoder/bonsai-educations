"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, TrendingUp, Check, Trophy, Star } from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

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
    {
      quote: "BONSAI Educational Initiatives is a excellent platform for enhancing your learning skills. Their approach towards imparting education is both novel & holistic. We have benefited immensely in improving our understanding of Science & Mathematics through their teachings.",
      name: "Saumya Sarup & Shubhra Sarup",
      role: "Class 9, ICSE, Mayo College, Ajmer",
      rating: 5,
      init: "SS"
    },
    {
      quote: "I have studied at Bonsai Educational Initiatives for the academic year 2018-19. I had a very clear and positive experience there, and my grades were good too. My elder brother Salil Garg, cousin Rahul Garg, and younger cousin Naman Garg all studied at this institute and showed excellent results.",
      name: "Archita Garg & Sibling Stories",
      role: "Alumni & Student Families",
      rating: 5,
      init: "AG"
    },
    {
      quote: "Bonsai has been a great institute in shaping my career. The tremendous hard work of teachers to explain every small detail in clarity, the balanced pressure to complete homework, the efficient guidance for board exams and the timely manner to complete the course work way ahead of time - All thanks to Bonsai and Neeraj Sir for being so kind in raising young minds. Thank you so much.",
      name: "Sahiba Libra",
      role: "Alumni",
      rating: 5,
      init: "SL"
    },
    {
      quote: "I joined Bonsai when I was in seventh standard that is in 2011 and continued my journey being a student at Bonsai till 10th Standard, that is 2015. I studied at Bonsai for four years. The experience cannot be expressed, depicted and described. When I joined Bonsai, I used to be afraid of maths and science. I did not used to have a clear vision on how to approach towards difficult and complex questions but after becoming a part of Bonsai, I can proudly say that my concepts and basics got clear right from the beginning, and I was able to see a significant amount of growth and improvement in myself.",
      name: "Harsidak Pal Singh",
      role: "Student (2011 - 2015)",
      rating: 5,
      init: "HP"
    },
    {
      quote: "Bonsai educational initiatives have always done a phenomenal job by inculcating the ability in students to learn and build strong foundational knowledge. This institute has instilled a love for learning through their well prepared assignments, practice papers and test series. I will forever be thankful and indebted to the teaching staff for transforming me in my educational journey.",
      name: "Ishika Madaan",
      role: "B.Sc. Biotechnology Alumni",
      rating: 5,
      init: "IM"
    }
  ];

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
          <span className="text-white/50 text-[13px] font-semibold tracking-widest uppercase">Leadership Profile</span>
          <h2 className="display text-[38px] font-bold text-white mt-2.5">Board of Directors</h2>
        </div>

        <div className="w-full max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-white shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            {/* Left Column: Headshot & Contact */}
            <div className="w-full md:w-1/3 shrink-0 flex flex-col items-center md:items-start">
              <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-navy/50">
                <Image
                  src="/neeraj_gupta_headshot.png"
                  alt="Neeraj Gupta Headshot"
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, 280px"
                  priority
                />
              </div>
              <div className="mt-8 w-full space-y-3.5 border-t border-white/10 pt-6 text-sm text-white/60">
                <p className="flex items-center gap-3">
                  <span className="text-teal-400 font-bold">📍</span> Punjab, India
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-teal-400 font-bold">✉️</span> neerajgupta1068@gmail.com
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-teal-400 font-bold">📞</span> (+91) 97819 92924
                </p>
              </div>
            </div>

            {/* Right Column: Bio Narrative */}
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-teal-400 font-semibold tracking-widest text-xs md:text-sm uppercase block mb-1">
                  Educational Director
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                  Neeraj Gupta
                </h3>
                <div className="h-1 w-20 bg-teal-500 rounded-full" />
              </div>

              <div className="space-y-5 text-white/80 leading-relaxed text-sm md:text-base font-light">
                <p>
                  <strong>Mr. Neeraj Gupta</strong> is the Educational Director of Bonsai, where he spearheads the academic vision and strategic curriculum pathways. Driven by a lifelong commitment to the education sector, he has dedicated his career to sharing his expertise in mathematics and science. In 2010, he established Bonsai Educational Initiatives to cultivate academic excellence and empower students in Ludhiana, Punjab, to build successful academic futures. Under his guidance, the institution has successfully mentored over 1,000 students to achieve top ranks in board examinations, Olympiads, and competitive entrance tests.
                </p>
                <p>
                  Mr. Gupta holds a post-graduate degree (M.Sc. B.Ed.) in Chemistry from the Department of Chemistry, Punjab University, as well as a Bachelor of Science (B.Sc.) in Chemistry, Physics, and Mathematics from Punjab University. This comprehensive training across mathematics and chemistry has shaped his interdisciplinary approach to pedagogical training.
                </p>
                <p>
                  Prior to leading Bonsai, Mr. Gupta served in key academic capacities across several premier institutions. He was the Head of the Mathematics Department (Guest Faculty) at Sahil Study Circle from 2012 to 2013, directing the integration of practical applications into scientific frameworks for STEM education. From 2011 to 2012, he served as HOD Mathematics at Dr. RC Drishti Jain School, leading curriculum design for science streams. He also served as a Special Trainer for Board Exams at Manav Rachna International School from 2017 to 2018, where he designed specialized pedagogical systems that significantly improved student outcomes.
                </p>
                <p>
                  Mr. Gupta is an active outdoor enthusiast who successfully trekked to the Everest Base Camp in June 2023. He was also a civil service aspirant, appearing for the Civil Services Examination in 2021. In recognition of his teaching excellence and leadership in education, he was honored with the Academic Excellence Award at the Global Teaching Excellence Awards (GTEA) in 2022. He is fluent in English, Hindi, and Punjabi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-surface overflow-hidden">
        <div className="text-center mb-12">
          <span className="text-teal-600 text-[13px] font-semibold tracking-widest uppercase">Success Stories</span>
          <h2 className="display text-[38px] font-bold text-navy mt-2.5">What Our Students Say</h2>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Left and Right Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6 w-max px-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="bg-white border border-border/80 rounded-2xl p-6 md:p-8 w-[320px] md:w-[420px] shrink-0 transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg hover:shadow-navy/5 flex flex-col justify-between"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex gap-1 text-gold mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-[13px] md:text-[14px] leading-[1.75] italic mb-6">
                    &quot;{t.quote}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-navy to-teal-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                    {t.init}
                  </div>
                  <div>
                    <p className="font-bold text-[13px] md:text-[14px] text-navy leading-tight">{t.name}</p>
                    <p className="text-muted text-[11px] md:text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
