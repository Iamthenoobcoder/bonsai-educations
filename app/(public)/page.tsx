"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Star, Calculator, Atom, FlaskConical, Dna, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
  init: string;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [zoomedResultImage, setZoomedResultImage] = useState<string | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resultBoards = [
    {
      title: "CBSE Board Results",
      image: "/results_1.jpg",
      tag: "CBSE",
      desc: "Outstanding achievements in the Central Board of Secondary Education curriculum."
    },
    {
      title: "Cambridge Board Results",
      image: "/results_2.jpg",
      tag: "Cambridge (IGCSE)",
      desc: "Excellent global standard results in the Cambridge assessment programs."
    },
    {
      title: "ICSE & Boarding Schools Results",
      image: "/results_3.jpg",
      tag: "ICSE / Boarding",
      desc: "Pioneering scores from Sat Paul Mittal, Mayo College, Sanawar, Doon, and other prestigious boarding schools."
    }
  ];

  useEffect(() => {
    if (isAutoplayPaused || zoomedResultImage) return;
    const timer = setInterval(() => {
      setActiveResultIndex((prev) => (prev + 1) % resultBoards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoplayPaused, zoomedResultImage, resultBoards.length]);

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
      <section id="about" className="py-20 px-6 md:px-[5%] bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.6fr_1fr] gap-10 md:gap-16 items-center">
          <div className="text-left">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[3px] h-8 bg-gold rounded-full" />
              <span className="text-gold text-[13px] font-semibold tracking-widest uppercase">About Us</span>
            </div>
            <h2 className="display text-[40px] font-bold text-navy mb-5 leading-tight">A legacy of brilliant minds.</h2>
            <p className="text-muted text-base leading-[1.8] mb-4">
              Founded in 2009, Bonsai Educations has grown to become Ludhiana&apos;s most trusted name in secondary and senior secondary coaching. We don&apos;t just teach the syllabus — we nurture critical thinking and build lasting subject mastery.
            </p>
            <p className="text-muted text-base leading-[1.8]">
              Located at 157-I, Sarabha Nagar, our campus serves students from Class 8 through 12 across Science, Commerce, and Arts streams.
            </p>
          </div>
          
          <div className="flex flex-col gap-5 border-l-2 border-zinc-100 pl-6 md:pl-8 py-2">
            {[
              "Focused batch sizes for personal engagement",
              "Personalised attention and doubt-clearing sessions",
              "Regular mock exams aligned to board patterns"
            ].map((t) => (
              <div key={t} className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded bg-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[14.5px] text-gray-700 leading-normal text-left">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section id="courses" className="py-20 px-6 md:px-[5%] bg-surface">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12 items-center">
          {/* Left Column: Description */}
          <div className="text-left space-y-5">
            <div>
              <span className="text-teal-600 text-[13px] font-semibold tracking-widest uppercase">Academic Programs</span>
              <h2 className="display text-[38px] font-bold text-navy mt-2.5 leading-tight">Courses We Offer</h2>
              <div className="h-1 w-16 bg-teal-500 rounded-full mt-4" />
            </div>
            <p className="text-muted text-base leading-relaxed">
              Bonsai delivers specialized academic instruction in Physics, Chemistry, Biology, and Mathematics, specifically designed for students in <strong>Classes 8th to 11th</strong>. Our curriculum provides robust preparation tailored to the rigorous standards of <strong>ICSE, IGCSE (Cambridge), and CBSE</strong> board examinations, fostering both deep conceptual clarity and academic excellence.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["CBSE", "ICSE", "IGCSE (Cambridge)"].map((board) => (
                <span key={board} className="text-xs font-semibold bg-white border border-border/80 px-3 py-1.5 rounded-full text-navy shadow-sm">
                  {board}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Grid of Subjects */}
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Calculator,
                title: "Mathematics",
                desc: "Building deep conceptual understanding from algebraic structures to calculus, fostering problem-solving skills.",
                color: "bg-blue-500/10 text-blue-600 border-blue-500/10"
              },
              {
                icon: Atom,
                title: "Physics",
                desc: "Exploring mechanics, electromagnetism, and physics theories through deductive reasoning and mathematical modeling.",
                color: "bg-teal-500/10 text-teal-600 border-teal-500/10"
              },
              {
                icon: FlaskConical,
                title: "Chemistry",
                desc: "Mastering chemical equations, organic structures, and stoichiometry with clear, structured logic and conceptual clarity.",
                color: "bg-purple-500/10 text-purple-600 border-purple-500/10"
              },
              {
                icon: Dna,
                title: "Biology",
                desc: "Understanding cellular systems, genetics, and anatomical structures, establishing a strong foundation for advanced science pathways.",
                color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10"
              }
            ].map((subject) => (
              <div
                key={subject.title}
                className="bg-white border border-border/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/20 hover:shadow-lg hover:shadow-navy/5"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${subject.color}`}>
                  <subject.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-navy mb-1.5">{subject.title}</h3>
                <p className="text-muted text-[13px] leading-relaxed">{subject.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS / RESULTS */}
      <section id="results" className="py-20 px-6 md:px-[5%] bg-white">
        <div className="text-center mb-12">
          <span className="text-gold text-[13px] font-semibold tracking-widest uppercase">Our Students Excel</span>
          <h2 className="display text-[38px] font-bold text-navy mt-2.5">A Record of Excellence</h2>
          <p className="text-muted text-sm mt-3 max-w-xl mx-auto">
            Click on any board results card to view the full resolution image and inspect individual scores in detail.
          </p>
        </div>

        {/* Board Selection Tabs */}
        <div className="flex justify-center gap-3 mb-10 max-w-lg mx-auto">
          {resultBoards.map((board, idx) => (
            <button
              key={idx}
              onClick={() => setActiveResultIndex(idx)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                activeResultIndex === idx
                  ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/25"
                  : "bg-surface border-border text-navy hover:bg-zinc-100"
              }`}
            >
              {board.tag}
            </button>
          ))}
        </div>

        {/* Rotating Cards Container */}
        <div 
          className="relative max-w-5xl mx-auto h-[480px] md:h-[620px] flex items-center justify-center overflow-hidden px-4 select-none"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
        >
          {/* Previous Arrow */}
          <button
            onClick={() => setActiveResultIndex((prev) => (prev - 1 + resultBoards.length) % resultBoards.length)}
            className="absolute left-2 md:left-10 z-30 p-3 rounded-full bg-white/80 border border-zinc-200 text-navy hover:bg-white hover:scale-105 transition-all shadow-md cursor-pointer"
            aria-label="Previous board"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next Arrow */}
          <button
            onClick={() => setActiveResultIndex((prev) => (prev + 1) % resultBoards.length)}
            className="absolute right-2 md:right-10 z-30 p-3 rounded-full bg-white/80 border border-zinc-200 text-navy hover:bg-white hover:scale-105 transition-all shadow-md cursor-pointer"
            aria-label="Next board"
          >
            <ChevronRight size={20} />
          </button>

          {/* 3D Rotating Stack */}
          <div className="relative w-full max-w-[340px] md:max-w-[440px] h-[400px] md:h-[540px] flex items-center justify-center">
            {resultBoards.map((board, idx) => {
              // Calculate relative position index (-1, 0, 1)
              let offset = idx - activeResultIndex;
              // Handle wrapping for infinite rotation visual structure
              if (offset < -1) offset += resultBoards.length;
              if (offset > 1) offset -= resultBoards.length;

              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;

              // Compute transform classes based on active state
              let transformStyles = "";
              let opacity = 0;
              let zIndex = 0;
              let pointerEvents: "auto" | "none" = "auto";

              if (isActive) {
                transformStyles = "translate-x-0 scale-100 rotate-0";
                opacity = 1;
                zIndex = 20;
                pointerEvents = "auto";
              } else if (isPrev) {
                transformStyles = "-translate-x-[40%] md:-translate-x-[60%] scale-80 -rotate-6";
                opacity = 0.5;
                zIndex = 10;
                pointerEvents = "auto"; // Allow clicking to switch
              } else if (isNext) {
                transformStyles = "translate-x-[40%] md:translate-x-[60%] scale-80 rotate-6";
                opacity = 0.5;
                zIndex = 10;
                pointerEvents = "auto"; // Allow clicking to switch
              } else {
                transformStyles = "scale-50 opacity-0 pointer-events-none";
                opacity = 0;
                zIndex = 0;
                pointerEvents = "none";
              }

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isActive) {
                      setZoomedResultImage(board.image);
                    } else {
                      setActiveResultIndex(idx);
                    }
                  }}
                  style={{
                    opacity,
                    zIndex,
                    pointerEvents,
                  }}
                  className={`absolute w-full h-full transition-all duration-500 ease-out cursor-pointer transform ${transformStyles}`}
                >
                  {/* Card wrapper */}
                  <div className="w-full h-full bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative flex-1 w-full bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 flex items-center justify-center p-2 group">
                      <Image
                        src={board.image}
                        alt={board.title}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-w-768px) 100vw, 440px"
                        priority={idx === 0}
                      />
                      
                      {/* Hover overlay with zoom icon for active card */}
                      {isActive && (
                        <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-navy shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Maximize2 size={20} />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <span className="text-[10px] font-bold tracking-widest uppercase bg-teal-50 text-teal-600 px-2 py-0.5 rounded border border-teal-100">
                        {board.tag}
                      </span>
                      <h3 className="text-base font-bold text-navy mt-2 mb-1">{board.title}</h3>
                      <p className="text-muted text-[11px] md:text-xs leading-normal line-clamp-1">{board.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="flex justify-center gap-2 mt-4">
          {resultBoards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveResultIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeResultIndex === idx
                  ? "bg-teal-600 w-6"
                  : "bg-zinc-300 hover:bg-zinc-400"
              }`}
              aria-label={`Go to board ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Result Image Zoom Modal */}
      {zoomedResultImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setZoomedResultImage(null)}
        >
          <div
            className="relative max-w-4xl w-full h-[85vh] flex flex-col items-center justify-center animate-[count_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setZoomedResultImage(null)}
              className="absolute -top-12 right-2 md:right-0 w-10 h-10 rounded-full bg-white hover:bg-zinc-200 text-navy flex items-center justify-center transition-colors text-xl font-bold z-50 cursor-pointer shadow-lg"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Zoomed Image Container */}
            <div className="relative w-full h-full bg-white border border-zinc-800 rounded-2xl overflow-hidden p-4 flex items-center justify-center">
              <Image
                src={zoomedResultImage}
                alt="Zoomed board results"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}

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
          <div className={`animate-marquee flex gap-6 w-max px-6 ${selectedTestimonial ? "[animation-play-state:paused]" : "hover:[animation-play-state:paused]"}`}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                onClick={() => setSelectedTestimonial(t)}
                className="bg-white border border-border/80 rounded-2xl p-6 md:p-8 w-[320px] md:w-[420px] shrink-0 transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg hover:shadow-navy/5 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transform"
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

      {/* Testimonial Zoom-in Modal */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl relative animate-[count_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-navy flex items-center justify-center transition-colors text-lg font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Star Rating */}
            <div className="flex gap-1 text-gold mb-5">
              {Array.from({ length: selectedTestimonial.rating }).map((_, s) => (
                <Star key={s} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>

            {/* Quote */}
            <p className="text-navy text-base md:text-lg leading-relaxed font-light italic mb-8">
              &quot;{selectedTestimonial.quote}&quot;
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-navy to-teal-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                {selectedTestimonial.init}
              </div>
              <div>
                <p className="font-extrabold text-[15px] md:text-base text-navy leading-tight">
                  {selectedTestimonial.name}
                </p>
                <p className="text-muted text-xs md:text-sm mt-0.5">
                  {selectedTestimonial.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
