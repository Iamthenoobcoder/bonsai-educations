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
  Users,
  Info
} from "lucide-react"

// Interfaces
interface WardProfile {
  student_id: string
  profiles: {
    name: string
  } | null
}

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

const MOCK_CHILDREN: WardProfile[] = [
  { student_id: "stud-1", profiles: { name: "Rahul Sharma" } },
  { student_id: "stud-2", profiles: { name: "Priya Singh" } }
]

const MOCK_HISTORIES: Record<string, AttendanceLog[]> = {

  "stud-1": [
    { id: "h1", date: "2026-06-04", class_name: "Grade 10 - Mathematics", status: "Present" },
    { id: "h2", date: "2026-06-03", class_name: "Grade 10 - Mathematics", status: "Absent" },
    { id: "h3", date: "2026-06-02", class_name: "Grade 10 - Mathematics", status: "Present" },
    { id: "h4", date: "2026-06-01", class_name: "Grade 10 - Mathematics", status: "Present" },
    { id: "h5", date: "2026-05-31", class_name: "Grade 10 - Mathematics", status: "Present" }
  ],
  "stud-2": [
    { id: "h1", date: "2026-06-04", class_name: "Grade 11 - Physics", status: "Present" },
    { id: "h2", date: "2026-06-03", class_name: "Grade 11 - Physics", status: "Present" },
    { id: "h3", date: "2026-06-02", class_name: "Grade 11 - Physics", status: "Late" },
    { id: "h4", date: "2026-06-01", class_name: "Grade 11 - Physics", status: "Absent" }
  ]
}

export default function ParentAttendance() {
  const supabase = createClient()
  
  // State
  const [wards, setWards] = useState<WardProfile[]>([])
  const [selectedWardId, setSelectedWardId] = useState<string>("")
  const [summary, setSummary] = useState<AttendanceSummary | null>(null)
  const [history, setHistory] = useState<AttendanceLog[]>([])
  const [todayStatus, setTodayStatus] = useState<string>("Pending")
  
  const [loading, setLoading] = useState(true)
  const [loadingWardData, setLoadingWardData] = useState(false)
  const [isMockMode, setIsMockMode] = useState(false)

  // Fetch Ward Attendance Data (Stats, Today's Status, History)
  const fetchWardAttendance = useCallback(async (wardId: string, isMock: boolean) => {
    if (!wardId) return
    setLoadingWardData(true)
    
    if (isMock) {
      const savedHistoryStr = localStorage.getItem(`mock_history_${wardId}`)
      const todayDate = getISTDateString()
      
      let localHistory = MOCK_HISTORIES[wardId] || []
      if (savedHistoryStr) {
        const parsedHistory = JSON.parse(savedHistoryStr) as MockRecord[]
        localHistory = parsedHistory.map((h, index) => ({
          id: `lh-${index}`,
          date: h.date,
          class_name: h.class_name,
          status: h.status
        })).sort((a, b) => b.date.localeCompare(a.date))
      } else {
        localStorage.setItem(`mock_history_${wardId}`, JSON.stringify(
          (MOCK_HISTORIES[wardId] || []).map(h => ({
            class_id: "class-1-uuid",
            class_name: h.class_name,
            date: h.date,
            status: h.status
          }))
        ))
      }

      setHistory(localHistory)

      // Calculate stats
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
      setTodayStatus(todayMarkings.length > 0 ? todayMarkings[0].status : "Pending")
      
      setLoadingWardData(false)
      return
    }

    try {
      const todayDate = getISTDateString()

      // 1. Fetch Ward's Today Status
      const { data: todayRecords } = await supabase
        .from('attendance_records')
        .select('status, attendance_sessions!inner(attendance_date)')
        .eq('student_id', wardId)
        .eq('attendance_sessions.attendance_date', todayDate)
      
      if (todayRecords && todayRecords.length > 0) {
        setTodayStatus(todayRecords[0].status)
      } else {
        setTodayStatus("Pending")
      }

      // 2. Query summary statistics from database view
      const { data: summaryData } = await supabase
        .from('attendance_summary')
        .select('*')
        .eq('student_id', wardId)

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

      // 3. Fetch detailed History Logs joined with Class Details
      const { data: logs } = await supabase
        .from('attendance_records')
        .select('id, status, attendance_sessions!inner(id, attendance_date, class_id)')
        .eq('student_id', wardId)
        .order('attendance_sessions(attendance_date)', { ascending: false })

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
      console.error(err instanceof Error ? err.message : "Error loading ward records")
    } finally {
      setLoadingWardData(false)
    }
  }, [supabase])

  // Load Wards List initially
  useEffect(() => {
    async function loadWards() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsMockMode(true)
          setWards(MOCK_CHILDREN)
          setSelectedWardId(MOCK_CHILDREN[0].student_id)
          fetchWardAttendance(MOCK_CHILDREN[0].student_id, true)
          setLoading(false)
          return
        }

        const { data: links, error: linksError } = await supabase
          .from('parent_child')
          .select('student_id, profiles:student_id(name)')
          .eq('parent_id', user.id)

        if (linksError || !links || links.length === 0) {
          setIsMockMode(true)
          setWards(MOCK_CHILDREN)
          setSelectedWardId(MOCK_CHILDREN[0].student_id)
          fetchWardAttendance(MOCK_CHILDREN[0].student_id, true)
        } else {
          setIsMockMode(false)
          const mappedLinks: WardProfile[] = (links as unknown as Array<{ student_id: string; profiles: { name: string } | null }>).map((l) => ({
            student_id: l.student_id,
            profiles: l.profiles ? { name: l.profiles.name } : null
          }))
          setWards(mappedLinks)
          setSelectedWardId(mappedLinks[0].student_id)
          fetchWardAttendance(mappedLinks[0].student_id, false)
        }
      } catch {
        setIsMockMode(true)
        setWards(MOCK_CHILDREN)
        setSelectedWardId(MOCK_CHILDREN[0].student_id)
        fetchWardAttendance(MOCK_CHILDREN[0].student_id, true)
      } finally {
        setLoading(false)
      }
    }

    loadWards()
  }, [supabase, fetchWardAttendance])

  // Fetch data when ward selector is toggled
  useEffect(() => {
    if (!selectedWardId) return
    Promise.resolve().then(() => {
      fetchWardAttendance(selectedWardId, isMockMode)
    })
  }, [selectedWardId, isMockMode, fetchWardAttendance])

  // Setup Postgres Realtime Channel subscriptions
  useEffect(() => {
    if (isMockMode || !selectedWardId) return
    
    const channel = supabase
      .channel(`parent-ward-${selectedWardId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'attendance_records',
        filter: `student_id=eq.${selectedWardId}`
      }, () => {
        fetchWardAttendance(selectedWardId, false)
      })
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedWardId, isMockMode, supabase, fetchWardAttendance])

  // Local storage cross-tab sync listener for offline demo simulator
  useEffect(() => {
    if (!isMockMode || !selectedWardId) return
    const handleStorage = () => {
      fetchWardAttendance(selectedWardId, true)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [isMockMode, selectedWardId, fetchWardAttendance])

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header and Ward Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">Ward Attendance Logs</h1>
          <p className="text-muted text-sm mt-1">Holistic tracking of your children&apos;s learning session attendance.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg border border-amber-100 shrink-0">
            ★
          </div>
          <div>
            <p className="text-[10px] font-bold text-navy uppercase tracking-wider">Selected Ward</p>
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="font-bold text-base text-navy bg-transparent outline-none border-b-2 border-border focus:border-teal-600 cursor-pointer pt-0.5"
            >
              {wards.map((w) => (
                <option key={w.student_id} value={w.student_id}>
                  {w.profiles?.name || "Child User"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,.04)] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted text-sm font-medium">Fetching linked profile information...</p>
        </div>
      ) : !selectedWardId ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,.04)]">
          <Users className="w-12 h-12 text-muted/65 mx-auto mb-4" />
          <h3 className="font-bold text-navy text-lg">No Ward Profiles Linked</h3>
          <p className="text-muted text-sm mt-1">No children profiles are currently linked to your parent credentials.</p>
        </div>
      ) : loadingWardData || !summary ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,.04)] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted text-sm font-medium">Loading session stats...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            
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
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">Marked Present</p>
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
                      <p className="text-[10px] text-rose-600 font-bold uppercase mt-0.5">Absent logged</p>
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
                      <p className="text-[10px] text-amber-600 font-bold uppercase mt-0.5">Arrived Late</p>
                    </div>
                  </>
                )}
                {todayStatus === 'Pending' && (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 text-neutral-455 flex items-center justify-center border border-neutral-200">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-neutral-600">Pending</p>
                      <p className="text-[10px] text-neutral-450 font-semibold mt-0.5">Awaiting teacher</p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-[11px] text-muted">Synced in real time</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] col-span-2 flex flex-col justify-between">
              <p className="text-xs font-bold text-navy uppercase tracking-wider">Attendance Ratios</p>
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

          <div className="bg-white rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] overflow-hidden">
            
            <div className="px-6 py-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-navy text-[14px]">Historical Session Log ({history.length})</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Info size={13} className="text-teal-600" />
                <span>Times are shown in Indian Standard Time (IST)</span>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="p-16 text-center text-muted text-sm italic">
                No attendance sessions have been logged yet for the selected ward.
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
      )}

    </div>
  )
}
