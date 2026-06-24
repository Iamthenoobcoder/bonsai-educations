"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getISTDateString } from "@/lib/utils"
import { 
  TrendingDown, 
  CheckSquare, 
  ClipboardCheck, 
  ChevronRight,
  TrendingUp
} from 'lucide-react'

// Interfaces
interface WardProfile {
  student_id: string
  profiles: {
    name: string
  } | null
}

interface ScoreRecord {
  id: string
  subject: string
  exam_name: string
  marks: number
  max_marks: number
  date: string
}

interface HistoryItem {
  session_id: string
  class_id: string
  class_name: string
  date: string
  status: 'Present' | 'Absent' | 'Late' | 'Pending'
}

// Mock Fallbacks
const MOCK_CHILDREN: WardProfile[] = [
  { student_id: "stud-1", profiles: { name: "Rahul Sharma" } },
  { student_id: "stud-2", profiles: { name: "Priya Singh" } }
]

const MOCK_SCORES: Record<string, ScoreRecord[]> = {
  "stud-1": [
    { id: "s1", subject: "Mathematics", exam_name: "Unit Test 3", marks: 88, max_marks: 100, date: "2026-06-01" },
    { id: "s2", subject: "Physics", exam_name: "Mid-Term", marks: 74, max_marks: 100, date: "2026-05-15" },
    { id: "s3", subject: "Chemistry", exam_name: "Unit Test 3", marks: 82, max_marks: 100, date: "2026-06-01" }
  ],
  "stud-2": [
    { id: "s4", subject: "Mathematics", exam_name: "Unit Test 3", marks: 95, max_marks: 100, date: "2026-06-01" },
    { id: "s5", subject: "Physics", exam_name: "Mid-Term", marks: 91, max_marks: 100, date: "2026-05-15" }
  ]
}

export default function ParentDashboard() {
  const supabase = createClient()

  // State
  const [wards, setWards] = useState<WardProfile[]>([])
  const [selectedWardId, setSelectedWardId] = useState<string>("")
  const [scores, setScores] = useState<ScoreRecord[]>([])
  const [attendancePct, setAttendancePct] = useState<string>("TBA")
  const [todayStatus, setTodayStatus] = useState<string>("Pending")
  const [isMockMode, setIsMockMode] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load Wards Links
  useEffect(() => {
    async function loadWards() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsMockMode(true)
          setWards(MOCK_CHILDREN)
          setSelectedWardId(MOCK_CHILDREN[0].student_id)
          return
        }

        const { data: links, error } = await supabase
          .from('parent_child')
          .select('student_id, profiles:student_id(name)')
          .eq('parent_id', user.id)

        if (error || !links || links.length === 0) {
          setIsMockMode(true)
          setWards(MOCK_CHILDREN)
          setSelectedWardId(MOCK_CHILDREN[0].student_id)
        } else {
          setIsMockMode(false)
          const mappedLinks: WardProfile[] = (links as unknown as Array<{ student_id: string; profiles: { name: string } | null }>).map((l) => ({
            student_id: l.student_id,
            profiles: l.profiles ? { name: l.profiles.name } : null
          }))
          setWards(mappedLinks)
          setSelectedWardId(mappedLinks[0].student_id)
        }
      } catch (err) {
        console.error("Error loading wards, using mock fallbacks", err)
        setIsMockMode(true)
        setWards(MOCK_CHILDREN)
        setSelectedWardId(MOCK_CHILDREN[0].student_id)
      } finally {
        setLoading(false)
      }
    }
    loadWards()
  }, [supabase])

  // Load selected ward information
  useEffect(() => {
    if (!selectedWardId) return

    async function loadWardData() {
      if (isMockMode) {
        setScores(MOCK_SCORES[selectedWardId] || [])
        
        const todayDate = getISTDateString()
        const savedHistoryStr = localStorage.getItem(`mock_history_${selectedWardId}`)
        
        if (savedHistoryStr) {
          const history = JSON.parse(savedHistoryStr) as HistoryItem[]
          const todayMarking = history.find(h => h.date === todayDate)
          setTodayStatus(todayMarking ? todayMarking.status : "Pending")

          const present = history.filter(h => h.status === 'Present').length
          const late = history.filter(h => h.status === 'Late').length
          const total = history.length
          setAttendancePct(total > 0 ? `${Math.round(((present + late) / total) * 100)}%` : "0%")
        } else {
          setTodayStatus("Present")
          setAttendancePct(selectedWardId === "stud-1" ? "92.3%" : "94.8%")
        }
        return
      }

      try {
        const { data: scoresData } = await supabase
          .from('scores')
          .select('id, subject, exam_name, marks, max_marks, date')
          .eq('student_id', selectedWardId)
          .order('date', { ascending: false })
          .limit(10)

        setScores((scoresData as ScoreRecord[]) || [])

        const todayDate = getISTDateString()
        const { data: todayRecords } = await supabase
          .from('attendance_records')
          .select('status, attendance_sessions!inner(attendance_date)')
          .eq('student_id', selectedWardId)
          .eq('attendance_sessions.attendance_date', todayDate)

        if (todayRecords && todayRecords.length > 0) {
          setTodayStatus(todayRecords[0].status)
        } else {
          setTodayStatus("Pending")
        }

        const { data: summaryData } = await supabase
          .from('attendance_summary')
          .select('attendance_percentage')
          .eq('student_id', selectedWardId)

        if (summaryData && summaryData.length > 0) {
          const totalPct = summaryData.reduce((acc, curr) => acc + (curr.attendance_percentage || 0), 0)
          const avgPct = Math.round(totalPct / summaryData.length)
          setAttendancePct(`${avgPct}%`)
        } else {
          setAttendancePct("No Logs")
        }
      } catch (err) {
        console.error("Error loading ward detailed data", err)
      }
    }

    loadWardData()
  }, [selectedWardId, isMockMode, supabase])

  // Real-time Storage Event Sync for offline demo simulation
  useEffect(() => {
    if (!isMockMode || !selectedWardId) return
    const handleStorage = () => {
      const todayDate = getISTDateString()
      const savedHistoryStr = localStorage.getItem(`mock_history_${selectedWardId}`)
      if (savedHistoryStr) {
        const history = JSON.parse(savedHistoryStr) as HistoryItem[]
        const todayMarking = history.find(h => h.date === todayDate)
        setTodayStatus(todayMarking ? todayMarking.status : "Pending")

        const present = history.filter(h => h.status === 'Present').length
        const late = history.filter(h => h.status === 'Late').length
        const total = history.length
        setAttendancePct(total > 0 ? `${Math.round(((present + late) / total) * 100)}%` : "0%")
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [isMockMode, selectedWardId])

  // Calculate weak areas (average marks below 60%)
  const weakAreas = scores.filter(s => (s.marks / s.max_marks) < 0.6)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy">Parent Dashboard</h1>
        <p className="text-muted text-sm mt-1">Holistic insights into your child&apos;s academic journey.</p>
      </div>

      {/* Ward Selector and Quick KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Selection Ward Card */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl border border-amber-100 shrink-0">
            ★
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-navy uppercase tracking-wider">Select Ward Profile</p>
            {loading ? (
              <p className="text-sm text-muted">Loading children...</p>
            ) : (
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="font-bold text-lg text-navy bg-transparent border-none focus:outline-none cursor-pointer w-full mt-1 appearance-none"
              >
                {wards.map((w) => (
                  <option key={w.student_id} value={w.student_id}>
                    {w.profiles?.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <ChevronRight size={14} className="text-muted/40 shrink-0" />
        </div>

        {/* Live Today Attendance Quick KPI Card */}
        <Link 
          href="/dashboard/parent/attendance"
          className="group bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-navy uppercase tracking-wider">Today&apos;s Attendance</p>
              <p className="text-lg font-bold text-navy mt-1 group-hover:text-teal-700 transition-colors">{todayStatus}</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-muted/40 group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* Aggregate Rate Quick KPI Card */}
        <Link 
          href="/dashboard/parent/attendance"
          className="group bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-navy uppercase tracking-wider">Attendance Percentage</p>
              <p className="text-lg font-bold text-navy mt-1 group-hover:text-blue-700 transition-colors">{attendancePct}</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-muted/40 group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
        </Link>

      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent assessments card */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] col-span-2">
          <h3 className="font-bold text-navy text-base mb-6 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-teal-600" /> Recent Assessments
          </h3>
          <div className="space-y-3.5 text-sm font-medium">
             {scores && scores.length > 0 ? (
               scores.map((s) => {
                 const pct = Math.round((s.marks / s.max_marks) * 100)
                 return (
                   <div key={s.id} className="flex justify-between items-center p-3 hover:bg-surface rounded-2xl transition cursor-default">
                     <span className="text-navy font-semibold">{s.subject} <span className="text-muted text-xs font-normal">({s.exam_name})</span></span>
                     <span className={`px-3.5 py-1 rounded-full text-xs font-bold border 
                       ${pct >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                         pct >= 60 ? 'text-amber-700 bg-amber-50 border-amber-100' :
                         'text-rose-700 bg-rose-50 border-rose-100'}`}>
                       {s.marks} / {s.max_marks} ({pct}%)
                     </span>
                   </div>
                 )
               })
             ) : (
               <p className="text-muted italic py-4">No assessments logged yet for the selected ward.</p>
             )}
          </div>
        </div>

        {/* Improvement Areas card */}
        <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 shadow-[0_1px_4px_rgba(0,0,0,.04)]">
          <h3 className="font-bold text-rose-950 text-base mb-6 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-rose-700" /> Improvement Areas
          </h3>
          <p className="text-rose-800 text-xs font-medium mb-4 leading-relaxed">Subjects with average scores below 60% which need additional guidance.</p>
          <div className="flex flex-col gap-2">
             {weakAreas.length > 0 ? (
               weakAreas.map((s) => (
                 <div key={s.id} className="bg-white border border-rose-100 p-3 rounded-xl flex items-center justify-between">
                   <span className="text-xs text-rose-900 font-bold">{s.subject}</span>
                   <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">{Math.round((s.marks / s.max_marks) * 100)}%</span>
                 </div>
               ))
             ) : (
               <p className="text-rose-700 text-xs italic py-2">No critical weak areas identified. Excellent progress!</p>
             )}
          </div>
        </div>

      </div>

    </div>
  )
}
