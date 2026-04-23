"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const roles = [
    { v: "student", label: "Student", icon: GraduationCap },
    { v: "parent", label: "Parent", icon: Users },
    { v: "teacher", label: "Teacher", icon: BookOpen },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert(`Sign up successful! You are registered as a ${role}.`);
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-white">
      {/* Left brand panel */}
      <div className="hidden md:flex w-[58%] bg-gradient-to-br from-navy to-teal-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-80px] left-[-40px] w-[320px] h-[320px] rounded-full bg-gold/10" />
        
        <div className="text-center relative z-10">
          <Link href="/" className="w-[72px] h-[72px] rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5 border border-white/20 transition-transform hover:scale-105 cursor-pointer overflow-hidden p-2">
            <Image src="/logo.jpg" alt="Bonsai Logo" width={56} height={56} className="rounded-xl object-contain bg-white" />
          </Link>
          <h1 className="display text-white text-4xl font-bold mb-2.5">BONSAI EDUCATIONS</h1>
          <p className="text-white/65 text-base mb-12 italic">Profound learning. Absolute clarity.</p>
          
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 px-7 max-w-[320px] text-left mx-auto">
            <div className="text-gold text-4xl font-serif leading-[0.8] mb-2.5">&quot;</div>
            <p className="text-white/80 text-[13px] leading-[1.8] italic mb-3.5">
              The faculty genuinely cares. I highly recommend Bonsai for anyone serious about their academic future.
            </p>
            <p className="text-white/50 text-xs">— Meera Patel, Alumni</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-[380px]">
          <h2 className="text-[26px] font-bold text-navy mb-1.5">Create Account</h2>
          <p className="text-muted text-[14px] mb-6">Join the Bonsai Educations platform.</p>

          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {roles.map((r) => (
              <div
                key={r.v}
                onClick={() => setRole(r.v)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all text-center bg-white flex flex-col items-center justify-center
                  ${role === r.v ? "border-teal-600 bg-[#f0f9f5]" : "border-border hover:border-gray-400"}
                `}
              >
                <r.icon size={20} className={role === r.v ? "text-teal-600" : "text-muted"} />
                <p className={`text-[13px] font-semibold mt-1.5 ${role === r.v ? "text-teal-600" : "text-muted"}`}>
                  {r.label}
                </p>
                {role === r.v && (
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5" />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1.5">Full Name</label>
              <input
                className="w-full p-3.5 border-2 border-border rounded-xl font-sans text-[15px] outline-none transition-colors bg-white focus:border-teal-600 focus:shadow-[0_0_0_3px_rgba(15,110,86,.1)]"
                placeholder="John Doe"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1.5">Email address</label>
              <input
                className="w-full p-3.5 border-2 border-border rounded-xl font-sans text-[15px] outline-none transition-colors bg-white focus:border-teal-600 focus:shadow-[0_0_0_3px_rgba(15,110,86,.1)]"
                placeholder="you@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-navy mb-1.5">Password</label>
              <div className="relative">
                <input
                  className="w-full p-3.5 pr-11 border-2 border-border rounded-xl font-sans text-[15px] outline-none transition-colors bg-white focus:border-teal-600 focus:shadow-[0_0_0_3px_rgba(15,110,86,.1)]"
                  placeholder="••••••••"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted text-[13px] hover:text-navy"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white border-none py-3.5 rounded-xl font-sans text-[15px] font-semibold cursor-pointer transition-all hover:bg-teal-700 hover:-translate-y-0.5 shadow-md shadow-teal-600/30 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Signing up..." : "Sign Up →"}
            </button>
          </form>

          <p className="text-center mt-5 text-[13px] text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-600 font-semibold cursor-pointer hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
