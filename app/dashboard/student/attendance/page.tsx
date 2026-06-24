"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { getISTDateString } from "@/lib/utils"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  HelpCircle,
  TrendingUp, 
  Calendar,
  RefreshCw,
  Info
} from "lucide-react"

// Interfaces
interface AttendanceSummary {
  present_count: number
  absent_count: number
  late_count: number
  pending_count: number
  total_classes: number
  attendance_percentage: number
}

interface AttendanceLog {
  id: string
  date: string
  class_name: string
  status: 'Present' | 'Absent' | 'Late' | 'Pending'
}

interface MockRecord {
  class_id: string
  class_name: string
  date: string
  status: 'Present' | 'Absent' | 'Late' | 'Pending'
}

// Mock student profile & history for fallback
const DEFAULT_STUDENT_ID = "stud-1"

const MOCK_SUMMARY: AttendanceSummary = {
  present_count: 48,
  absent_count: 4,
  late_count: 0,
  pending_count: 0,
  total_classes: 52,
  attendance_percentage: 92.3
}

const MOCK_HISTORY: AttendanceLog[] = [
  { id: "h1", date: "2026-06-04", class_name: "Grade 10 - Mathematics", status: "Present" },
  { id: "h2", date: "2026-06-03", class_name: "Grade 10 - Mathematics", status: "Absent" },
  { id: "h3", date: "2026-06-02", class_name: "Grade 10 - Mathematics", status: "Present" },
  { id: "h4", date: "2026-06-01", class_name: "Grade 10 - Mathematics", status: "Present" },
  { id: "h5", date: "2026-05-31", class_name: "Grade 10 - Mathematics", status: "Present" }
]

export default function StudentAttendance() {
  const supabase = createClient()
  
  // State
  const [summary, setSummary] = useState<AttendanceSummary>(MOCK_SUMMARY)
  const [history, setHistory] = useState<AttendanceLog[]>(MOCK_HISTORY)
  const [todayStatus, setTodayStatus] = useState<string>("Pending")
  const [studentId, setStudentId] = useState<string>(DEFAULT_STUDENT_ID)
  
  const [loading, setLoading] = useState(true)
  const [isMockMode, setIsMockMode] = useState(false)

  // Fetch all attendance statistics and history logs
  const fetchAttendance = useCallback(async (userId: string, isMock: boolean) => {
    if (isMock) {
      const savedHistoryStr = localStorage.getItem(`mock_history_${userId}`)
      const todayDate = getISTDateString()
      
      let localHistory: AttendanceLog[] = MOCK_HISTORY
      if (savedHistoryStr) {
        const parsedHistory = JSON.parse(savedHistoryStr) as MockRecord[]
        localHistory = parsedHistory.map((h, index) => ({
          id: `lh-${index}`,
          date: h.date,
          class_name: h.class_name,
          status: h.status
        })).sort((a, b) => b.date.localeCompare(a.date))
      } else {
        localStorage.setItem(`mock_history_${userId}`, JSON.stringify(
          MOCK_HISTORY.map(h => ({
            class_id: "class-1-uuid",
            class_name: h.class_name,
            date: h.date,
            status: h.status
          }))
        ))
      }

      setHistory(localHistory)

      // Calculate stats from history
      const total = localHistory.length
      const present = localHistory.filter(h => h.status === 'Present').length
      const absent = localHistory.filter(h => h.status === 'Absent').length
      const late = localHistory.filter(h => h.status === 'Late').length
      const pending = localHistory.filter(h => h.status === 'Pending').length
      const percentage = total > 0 ? Math.round(((present + late) / total) * 1000) / 10 : 0
      
      setSummary({
        present_count: present,
        absent_count: absent,
        late_count: late,
        pending_count: pending,
        total_classes: total,
        attendance_percentage: percentage
      })

      const todayMarkings = localHistory.filter(h => h.date === todayDate)
      if (todayMarkings.length > 0) {
        setTodayStatus(todayMarkings[0].status)
      } else {
        setTodayStatus("Pending")
      }
      
      setLoading(false)
      return
    }

    try {
      const todayDate = getISTDateString()
      
      const { data: todayRecords, error: todayError } = await supabase
        .from('attendance_records')
        .select('status, attendance_sessions!inner(attendance_date)')
        .eq('student_id', userId)
        .eq('attendance_sessions.attendance_date', todayDate)
      
      if (!todayError && todayRecords && todayRecords.length > 0) {
        setTodayStatus(todayRecords[0].status)
      } else {
        setTodayStatus("Pending")
      }

      const { data: summaryData, error: summaryError } = await supabase
        .from('attendance_summary')
        .select('*')
        .eq('student_id', userId)

      if (summaryError) throw summaryError

      interface SummaryAggregatedItem {
        present_count: number
        absent_count: number
        late_count: number
        pending_count: number
        total_classes: number
      }

      if (summaryData && summaryData.length > 0) {
        const aggregated = (summaryData as unknown as SummaryAggregatedItem[]).reduce((acc, curr) => {
          return {
            present_count: acc.present_count + (curr.present_count || 0),
            absent_count: acc.absent_count + (curr.absent_count || 0),
            late_count: acc.late_count + (curr.late_count || 0),
            pending_count: acc.pending_count + (curr.pending_count || 0),
            total_classes: acc.total_classes + (curr.total_classes || 0),
          }
        }, { present_count: 0, absent_count: 0, late_count: 0, pending_count: 0, total_classes: 0 })

        const total = aggregated.total_classes
        const present = aggregated.present_count
        const late = aggregated.late_count
        const percentage = total > 0 
          ? Math.round(((present + late) / total) * 1000) / 10 
          : 0

        setSummary({
          ...aggregated,
          attendance_percentage: percentage
        })
      } else {
        setSummary({
          present_count: 0,
          absent_count: 0,
          late_count: 0,
          pending_count: 0,
          total_classes: 0,
          attendance_percentage: 0
        })
      }

      interface LogsJoinedRelation {
        id: string
        status: 'Present' | 'Absent' | 'Late' | 'Pending'
        attendance_sessions: {
          id: string
          attendance_date: string
          class_id: string
        } | null
      }

      const { data: logs, error: logsError } = await supabase
        .from('attendance_records')
        .select('id, status, attendance_sessions!inner(id, attendance_date, class_id)')
        .eq('student_id', userId)
        .order('attendance_sessions(attendance_date)', { ascending: false })

      if (logsError) throw logsError

      if (logs && logs.length > 0) {
        const castLogs = logs as unknown as LogsJoinedRelation[]
        const classIds = Array.from(new Set(castLogs.map((l) => l.attendance_sessions?.class_id as string)))
        const { data: classesData } = await supabase
          .from('classes')
          .select('id, name')
          .in('id', classIds)

        const classMap = (classesData || []).reduce((acc: Record<string, string>, c) => {
          acc[c.id] = c.name
          return acc
        }, {}) || {}

        const mappedLogs: AttendanceLog[] = castLogs.map((l) => ({
          id: l.id,
          date: (l.attendance_sessions?.attendance_date) || todayDate,
          class_name: classMap[l.attendance_sessions?.class_id as string] || "Standard Class",
          status: l.status
        }))
        setHistory(mappedLogs)
      } else {
        setHistory([])
      }

    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Error fetching logs")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Hook Up Supabase Authentication & Realtime Subscriptions
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsMockMode(true)
          fetchAttendance(DEFAULT_STUDENT_ID, true)
          return
        }

        setStudentId(user.id)
        setIsMockMode(false)
        fetchAttendance(user.id, false)

        channel = supabase
          .channel('student-attendance-realtime')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'attendance_records',
            filter: `student_id=eq.${user.id}`
          }, () => {
            fetchAttendance(user.id, false)
          })
          .subscribe()

      } catch {
        setIsMockMode(true)
        fetchAttendance(DEFAULT_STUDENT_ID, true)
      }
    }

    init()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, fetchAttendance])

  // Listen to cross-tab localStorage changes when running mock simulation
  useEffect(() => {
    if (!isMockMode) return
    const handleStorageChange = () => {
      fetchAttendance(studentId, true)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [isMockMode, studentId, fetchAttendance])

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header Title bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">My Attendance Ledger</h1>
          <p className="text-muted text-sm mt-1">Real-time attendance logs synchronized with the classroom.</p>
        </div>
        {isMockMode && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
            <RefreshCw size={12} className="animate-spin" /> Live Sync Enabled (Mock)
          </span>
        )}
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Today's Status Box */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] flex flex-col justify-between">
          <p className="text-xs font-bold text-navy uppercase tracking-wider">Today&apos;s Status</p>
          <div className="my-4 flex items-center gap-3">
            {todayStatus === 'Present' && (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-navy">Present</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">Logs updated</p>
                </div>
              </>
            )}
            {todayStatus === 'Absent' && (
              <>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-navy">Absent</p>
                  <p className="text-[10px] text-rose-600 font-bold uppercase mt-0.5">Attendance taken</p>
                </div>
              </>
            )}
            {todayStatus === 'Late' && (
              <>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-navy">Late</p>
                  <p className="text-[10px] text-amber-600 font-bold uppercase mt-0.5">Marked Late</p>
                </div>
              </>
            )}
            {todayStatus === 'Pending' && (
              <>
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 text-neutral-400 flex items-center justify-center border border-neutral-200">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-neutral-600">Pending</p>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Not marked yet</p>
                </div>
              </>
            )}
          </div>
          <p className="text-[11px] text-muted">Refreshed in real time</p>
        </div>

        {/* Total & Ratios KPI Box */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] col-span-2 flex flex-col justify-between">
          <p className="text-xs font-bold text-navy uppercase tracking-wider">Attendance Breakdown</p>
          <div className="grid grid-cols-3 gap-4 my-3 text-center">
            <div className="p-3 bg-surface rounded-2xl">
              <p className="text-[10px] text-muted font-bold uppercase">Total classes</p>
              <p className="text-2xl font-extrabold text-navy mt-1">{summary.total_classes}</p>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Present</p>
              <p className="text-2xl font-extrabold text-emerald-800 mt-1">{summary.present_count}</p>
            </div>
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl">
              <p className="text-[10px] text-rose-700 font-bold uppercase">Absent</p>
              <p className="text-2xl font-extrabold text-rose-800 mt-1">{summary.absent_count}</p>
            </div>
          </div>
          {summary.late_count > 0 && (
            <p className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-md self-start">
              * Includes {summary.late_count} classes marked as Late (counted as Present).
            </p>
          )}
        </div>

        {/* Circular Percentage Widget */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] flex flex-col items-center justify-center relative overflow-hidden">
          <p className="text-xs font-bold text-navy uppercase tracking-wider absolute top-6 left-6">Aggregate %</p>
          
          <div className="mt-8 mb-2 relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle cx="48" cy="48" r="40" stroke="#0F6E56" strokeWidth="8" fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - summary.attendance_percentage / 100)}`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-navy">{summary.attendance_percentage}%</span>
            </div>
          </div>
          <span className="text-[10px] text-muted mt-2 font-medium flex items-center gap-1"><TrendingUp size={11} className="text-teal-700"/> Target: &gt; 90%</span>
        </div>

      </div>

      {/* History Ledger Table */}
      <div className="bg-white rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] overflow-hidden">
        
        {/* Table Header toolbar */}
        <div className="px-6 py-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-navy text-[14px]">Historical Log History</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Info size={13} className="text-teal-600" />
            <span>Class records default to Indian Standard Time (IST)</span>
          </div>
        </div>

        {/* Main Table */}
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-muted">Fetching history records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center text-muted">
             No attendance sessions have been logged yet for your profile.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wider font-semibold border-b border-border">
                  <th className="p-4 pl-6">Attendance Date</th>
                  <th className="p-4">Subject / Course Class</th>
                  <th className="p-4 pr-6 text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((row) => {
                  const statusColors = 
                    row.status === 'Present' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                    row.status === 'Absent' ? 'text-rose-700 bg-rose-50 border-rose-100' :
                    row.status === 'Late' ? 'text-amber-700 bg-amber-50 border-amber-100' :
                    'text-neutral-500 bg-neutral-50 border-neutral-100';

                  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }
                  const formattedDate = new Date(row.date).toLocaleDateString('en-IN', dateOptions)

                  return (
                    <tr key={row.id} className="hover:bg-surface/30 transition text-sm">
                      <td className="p-4 pl-6 font-semibold text-navy flex items-center gap-2">
                        {row.date} 
                        <span className="text-xs font-normal text-muted">({formattedDate})</span>
                      </td>
                      <td className="p-4 text-neutral-600 font-medium">{row.class_name}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${statusColors}`}>
                          {row.status === 'Present' && <CheckCircle size={10} />}
                          {row.status === 'Absent' && <XCircle size={10} />}
                          {row.status === 'Late' && <Clock size={10} />}
                          {row.status === 'Pending' && <HelpCircle size={10} />}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  )
}
