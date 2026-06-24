"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getISTDateString } from "@/lib/utils";
import { CheckCircle, BarChart3, Star, Clock, ChevronRight } from "lucide-react";

interface MockHistoryItem {
  session_id: string;
  class_id: string;
  class_name: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Pending';
}

export default function StudentOverview() {
  const supabase = createClient();
  
  // State
  const [todayStatus, setTodayStatus] = useState<string>("Pending");
  const [attendancePct, setAttendancePct] = useState<string>("TBA");
  const [isMockMode, setIsMockMode] = useState(false);
  const [studentId, setStudentId] = useState<string>("stud-1");

  // Load Overview Data
  useEffect(() => {
    async function loadOverview() {
      let userId = "stud-1";
      let isMock = false;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          setStudentId(user.id);
        } else {
          isMock = true;
          setIsMockMode(true);
        }
      } catch {
        isMock = true;
        setIsMockMode(true);
      }

      if (isMock) {
        const todayDate = getISTDateString();
        const savedHistoryStr = localStorage.getItem(`mock_history_${userId}`);
        
        if (savedHistoryStr) {
          const history = JSON.parse(savedHistoryStr) as MockHistoryItem[];
          const todayMarking = history.find(h => h.date === todayDate);
          if (todayMarking) {
            setTodayStatus(todayMarking.status);
          } else {
            setTodayStatus("Pending");
          }

          const present = history.filter(h => h.status === 'Present').length;
          const late = history.filter(h => h.status === 'Late').length;
          const total = history.length;
          if (total > 0) {
            setAttendancePct(`${Math.round(((present + late) / total) * 100)}%`);
          } else {
            setAttendancePct("0%");
          }
        } else {
          setTodayStatus("Present");
          setAttendancePct("92.3%");
        }
        return;
      }

      try {
        const todayDate = getISTDateString();

        const { data: todayRecords } = await supabase
          .from('attendance_records')
          .select('status, attendance_sessions!inner(attendance_date)')
          .eq('student_id', userId)
          .eq('attendance_sessions.attendance_date', todayDate);

        if (todayRecords && todayRecords.length > 0) {
          setTodayStatus(todayRecords[0].status);
        } else {
          setTodayStatus("Pending");
        }

        const { data: summaryData } = await supabase
          .from('attendance_summary')
          .select('attendance_percentage')
          .eq('student_id', userId);

        if (summaryData && summaryData.length > 0) {
          const totalPct = summaryData.reduce((acc, curr) => acc + (curr.attendance_percentage || 0), 0);
          const avgPct = Math.round(totalPct / summaryData.length);
          setAttendancePct(`${avgPct}%`);
        } else {
          setAttendancePct("No Logs");
        }
      } catch (err) {
        console.error("Error loading overview stats", err);
      }
    }

    loadOverview();
  }, [supabase]);

  // Listen for realtime storage events (in mock mode)
  useEffect(() => {
    if (!isMockMode) return;
    const handleStorageChange = () => {
      window.dispatchEvent(new Event('storage-update'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isMockMode]);

  // Helper trigger
  useEffect(() => {
    if (!isMockMode) return;
    const handleStorageUpdate = () => {
      const savedHistoryStr = localStorage.getItem(`mock_history_${studentId}`);
      if (savedHistoryStr) {
        const history = JSON.parse(savedHistoryStr) as MockHistoryItem[];
        const todayMarking = history.find(h => h.date === getISTDateString());
        setTodayStatus(todayMarking ? todayMarking.status : "Pending");

        const present = history.filter(h => h.status === 'Present').length;
        const late = history.filter(h => h.status === 'Late').length;
        const total = history.length;
        setAttendancePct(total > 0 ? `${Math.round(((present + late) / total) * 100)}%` : "0%");
      }
    };
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, [isMockMode, studentId]);

  const kpis = [
    { 
      label: "Attendance Status", 
      value: todayStatus, 
      color: "#0F6E56", 
      bg: "#E1F5EE", 
      icon: CheckCircle,
      link: "/dashboard/student/attendance",
      desc: `Total ratio: ${attendancePct}`
    },
    { 
      label: "Overall Performance", 
      value: "A-", 
      color: "#1e40af", 
      bg: "#EFF6FF", 
      icon: BarChart3,
      link: "/dashboard/student/scores",
      desc: "Based on unit tests"
    },
    { 
      label: "Quizzes Completed", 
      value: "14", 
      color: "#7c3aed", 
      bg: "#F3F0FF", 
      icon: Star,
      link: "/dashboard/student/quiz",
      desc: "2 quizzes pending review"
    },
    { 
      label: "Classes Scheduled", 
      value: "3", 
      color: "#b45309", 
      bg: "#FEF9EC", 
      icon: Clock,
      link: "/dashboard/student/timetable",
      desc: "Weekly batch schedule"
    },
  ];

  const scores = [
    { sub: "Mathematics", exam: "Unit Test 3", status: "Pending Evaluation", date: "Recent" },
    { sub: "Physics", exam: "Mid-Term", status: "Awaiting Score", date: "Recent" },
    { sub: "Chemistry", exam: "Unit Test 3", status: "Evaluation in progress", date: "Recent" },
  ];

  const timetable = [
    { time: "Morning Batch", sub: "Mathematics", teacher: "Dr. R. Kumar", room: "B-2" },
    { time: "Noon Batch", sub: "Physics", teacher: "Ms. P. Sharma", room: "A-1" },
    { time: "Evening Batch", sub: "Chemistry", teacher: "Mr. A. Kapoor", room: "C-3" },
  ];

  return (
    <div className="font-sans text-gray-900 space-y-6">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {kpis.map((k) => (
          <Link 
            key={k.label} 
            href={k.link}
            className="group bg-white border border-border rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,.04)] hover:-translate-y-1.5 hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div style={{ backgroundColor: k.bg }} className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <k.icon size={18} color={k.color} />
                </div>
                <ChevronRight size={14} className="text-muted/40 group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-extrabold text-navy tracking-tight">{k.value}</p>
              <p className="text-navy font-bold text-xs mt-1.5">{k.label}</p>
            </div>
            <p className="text-muted text-[10px] mt-2 border-t border-border/60 pt-2">{k.desc}</p>
          </Link>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Timetable */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,.04)]">
          <p className="font-bold text-navy text-[14px] mb-4">Upcoming Schedule</p>
          <div className="space-y-4">
            {timetable.map((t, i) => (
              <div key={i} className={`flex items-center gap-3.5 pb-4 ${i < timetable.length - 1 ? "border-b border-border/60" : ""}`}>
                <div className={`w-1 h-11 rounded-full shrink-0 ${i === 0 ? "bg-teal-600" : i === 1 ? "bg-purple-600" : "bg-amber-600"}`} />
                <div className="flex-1">
                  <p className="font-bold text-[13.5px] text-navy">{t.sub}</p>
                  <p className="text-muted text-[11px] mt-0.5">{t.teacher} · Room {t.room}</p>
                </div>
                <span className="text-muted text-[11px] font-semibold bg-surface px-2.5 py-1.5 rounded-lg border border-border">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scores */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,.04)]">
          <p className="font-bold text-navy text-[14px] mb-4">Recent Evaluations</p>
          <div className="space-y-4">
            {scores.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 pb-3.5 ${i < scores.length - 1 ? "border-b border-border/60" : ""}`}>
                <div className="flex-1">
                  <p className="font-bold text-[13.5px] text-navy">{s.sub}</p>
                  <p className="text-muted text-[11px] mt-0.5">{s.exam} · {s.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-muted text-[11.5px] bg-surface px-2.5 py-1.5 rounded-lg border border-border">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
