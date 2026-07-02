"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getISTDateString } from "@/lib/utils"
import { 
  Check, 
  X, 
  Clock, 
  Lock, 
  Unlock, 
  Save, 
  AlertCircle, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  RefreshCw
} from "lucide-react"

// Types
interface ClassItem {
  id: string
  name: string
  grade: string
}

interface StudentItem {
  id: string
  name: string
  email: string
}

interface AttendanceSession {
  id: string
  class_id: string
  attendance_date: string
  locked: boolean
  records: Record<string, 'Present' | 'Absent' | 'Late' | 'Pending'>
}

interface HistoryItem {
  session_id: string
  class_id: string
  class_name: string
  date: string
  status: 'Present' | 'Absent' | 'Late' | 'Pending'
}

// Mock Data for fallback mode
const MOCK_CLASSES: ClassItem[] = [
  { id: "class-1-uuid", name: "Grade 10 - Mathematics", grade: "10" },
  { id: "class-2-uuid", name: "Grade 11 - Physics", grade: "11" },
  { id: "class-3-uuid", name: "Grade 12 - Chemistry", grade: "12" }
]

const MOCK_STUDENTS: Record<string, StudentItem[]> = {
  "class-1-uuid": [
    { id: "stud-1", name: "Rahul Sharma", email: "rahul.sharma@bonsaiedu.com" },
    { id: "stud-2", name: "Priya Singh", email: "priya.singh@bonsaiedu.com" },
    { id: "stud-3", name: "Aman Kumar", email: "aman.kumar@bonsaiedu.com" },
    { id: "stud-4", name: "Sneha Patel", email: "sneha.patel@bonsaiedu.com" },
    { id: "stud-5", name: "Vikram Malhotra", email: "vikram.m@bonsaiedu.com" }
  ],
  "class-2-uuid": [
    { id: "stud-1", name: "Rahul Sharma", email: "rahul.sharma@bonsaiedu.com" },
    { id: "stud-2", name: "Priya Singh", email: "priya.singh@bonsaiedu.com" },
    { id: "stud-6", name: "Aditi Rao", email: "aditi.rao@bonsaiedu.com" }
  ],
  "class-3-uuid": [
    { id: "stud-3", name: "Aman Kumar", email: "aman.kumar@bonsaiedu.com" },
    { id: "stud-4", name: "Sneha Patel", email: "sneha.patel@bonsaiedu.com" },
    { id: "stud-7", name: "Kabir Mehta", email: "kabir.mehta@bonsaiedu.com" },
    { id: "stud-8", name: "Riya Sen", email: "riya.sen@bonsaiedu.com" }
  ]
}

export default function TeacherAttendance() {
  const supabase = createClient()
  
  // State with lazy initialization to avoid setting state in useEffect
  const [classes, setClasses] = useState<ClassItem[]>(MOCK_CLASSES)
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(() => getISTDateString())
  const [students, setStudents] = useState<StudentItem[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Pending'>>({})
  const [isLocked, setIsLocked] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isMockMode, setIsMockMode] = useState(false)

  // Load Classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsMockMode(true)
          return
        }

        const { data, error } = await supabase
          .from('classes')
          .select('id, name, grade')
          .eq('teacher_id', user.id)
          .order('name')
        
        if (error || !data || data.length === 0) {
          setClasses(MOCK_CLASSES)
          setIsMockMode(true)
        } else {
          setClasses(data as ClassItem[])
          setIsMockMode(false)
        }
      } catch {
        setClasses(MOCK_CLASSES)
        setIsMockMode(true)
      }
    }
    loadClasses()
  }, [supabase])

  // Load Session and Students whenever Class or Date changes
  useEffect(() => {
    if (!selectedClassId || !selectedDate) {
      // Defer state update to resolve react-hooks/set-state-in-effect
      Promise.resolve().then(() => {
        setStudents([])
        setAttendanceRecords({})
      })
      return
    }

    async function loadAttendanceData() {
      setLoading(true)
      setMessage(null)
      setSessionId(null)
      
      const todayIST = getISTDateString()
      const isPastDate = selectedDate < todayIST
      
      setIsLocked(isPastDate)

      if (isMockMode) {
        const mockRoster = MOCK_STUDENTS[selectedClassId] || []
        setStudents(mockRoster)
        
        const storageKey = `mock_att_${selectedClassId}_${selectedDate}`
        const savedSessionStr = localStorage.getItem(storageKey)
        
        if (savedSessionStr) {
          const savedSession = JSON.parse(savedSessionStr) as AttendanceSession
          setSessionId(savedSession.id)
          setIsLocked(savedSession.locked)
          setAttendanceRecords(savedSession.records)
        } else {
          const initialRecords: Record<string, 'Present' | 'Absent' | 'Late' | 'Pending'> = {}
          mockRoster.forEach(s => {
            initialRecords[s.id] = 'Pending'
          })
          setAttendanceRecords(initialRecords)
        }
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No user authenticated")

        const { data: roster, error: rosterError } = await supabase
          .from('class_students')
          .select('student_id, profiles:student_id(name, email)')
          .eq('class_id', selectedClassId)

        if (rosterError) throw rosterError

        interface RosterProfileRelation {
          student_id: string
          profiles: {
            name: string
            email: string
          } | null
        }

        const mappedRoster = ((roster || []) as unknown as RosterProfileRelation[]).map((r) => ({
          id: r.student_id,
          name: r.profiles?.name || 'Unknown Student',
          email: r.profiles?.email || ''
        }))
        setStudents(mappedRoster)

        const { data: session, error: sessionError } = await supabase
          .from('attendance_sessions')
          .select('id, locked')
          .eq('class_id', selectedClassId)
          .eq('attendance_date', selectedDate)
          .maybeSingle()

        if (sessionError) throw sessionError

        if (session) {
          setSessionId(session.id)
          setIsLocked(session.locked)

          const { data: records, error: recordsError } = await supabase
            .from('attendance_records')
            .select('student_id, status')
            .eq('session_id', session.id)

          if (recordsError) throw recordsError

          const recordsMap: Record<string, 'Present' | 'Absent' | 'Late' | 'Pending'> = {}
          mappedRoster.forEach(s => {
            recordsMap[s.id] = 'Pending'
          })
          if (records) {
            records.forEach(r => {
              recordsMap[r.student_id] = r.status as 'Present' | 'Absent' | 'Late' | 'Pending'
            })
          }
          setAttendanceRecords(recordsMap)
        } else {
          const recordsMap: Record<string, 'Present' | 'Absent' | 'Late' | 'Pending'> = {}
          mappedRoster.forEach(s => {
            recordsMap[s.id] = 'Pending'
          })
          setAttendanceRecords(recordsMap)
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Error loading records"
        console.error(errorMessage)
        const mockRoster = MOCK_STUDENTS[selectedClassId] || []
        setStudents(mockRoster)
        const initialRecords: Record<string, 'Present' | 'Absent' | 'Late' | 'Pending'> = {}
        mockRoster.forEach(s => {
          initialRecords[s.id] = 'Pending'
        })
        setAttendanceRecords(initialRecords)
      } finally {
        setLoading(false)
      }
    }

    loadAttendanceData()
  }, [selectedClassId, selectedDate, isMockMode, supabase])

  // Save Attendance Handler
  const handleSave = async () => {
    if (!selectedClassId || !selectedDate) return
    setSaving(true)
    setMessage(null)

    if (isMockMode) {
      const currentSessionId = sessionId || `session_${Math.random().toString(36).substring(2, 11)}`
      const sessionPayload: AttendanceSession = {
        id: currentSessionId,
        class_id: selectedClassId,
        attendance_date: selectedDate,
        locked: isLocked,
        records: attendanceRecords
      }
      const storageKey = `mock_att_${selectedClassId}_${selectedDate}`
      localStorage.setItem(storageKey, JSON.stringify(sessionPayload))
      
      students.forEach(student => {
        const studentHistoryKey = `mock_history_${student.id}`
        const historyStr = localStorage.getItem(studentHistoryKey) || "[]"
        let history = JSON.parse(historyStr) as HistoryItem[]
        
        history = history.filter(h => !(h.class_id === selectedClassId && h.date === selectedDate))
        
        history.push({
          session_id: currentSessionId,
          class_id: selectedClassId,
          class_name: classes.find(c => c.id === selectedClassId)?.name || "Class",
          date: selectedDate,
          status: attendanceRecords[student.id] || 'Pending'
        })
        localStorage.setItem(studentHistoryKey, JSON.stringify(history))
      })

      window.dispatchEvent(new Event('storage'))

      setSessionId(currentSessionId)
      setMessage({ type: 'success', text: "Attendance records saved successfully (Mock Mode)!" })
      setSaving(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User unauthorized")

      let currentSessionId = sessionId

      if (!currentSessionId) {
        const { data: newSession, error: sessionError } = await supabase
          .from('attendance_sessions')
          .insert({
            class_id: selectedClassId,
            teacher_id: user.id,
            attendance_date: selectedDate,
            locked: isLocked
          })
          .select('id')
          .single()

        if (sessionError) throw sessionError
        currentSessionId = newSession.id
        setSessionId(currentSessionId)
      } else {
        const { error: sessionUpdateError } = await supabase
          .from('attendance_sessions')
          .update({ locked: isLocked })
          .eq('id', currentSessionId)

        if (sessionUpdateError) throw sessionUpdateError
      }

      const upsertPayload = students.map(student => ({
        session_id: currentSessionId as string,
        student_id: student.id,
        status: attendanceRecords[student.id] || 'Pending'
      }))

      const { error: upsertError } = await supabase
        .from('attendance_records')
        .upsert(upsertPayload, { onConflict: 'session_id, student_id' })

      if (upsertError) throw upsertError

      setMessage({ type: 'success', text: "Attendance records successfully saved and synced to database!" })
      window.dispatchEvent(new Event('storage'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save attendance"
      console.error(errorMessage)
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setSaving(false)
    }
  }

  // Update Status in Local State
  const updateStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Pending') => {
    if (isLocked) return
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  // Set All Students to a particular status
  const setAllStatus = (status: 'Present' | 'Absent' | 'Late') => {
    if (isLocked) return
    const newRecords = { ...attendanceRecords }
    students.forEach(s => {
      newRecords[s.id] = status
    })
    setAttendanceRecords(newRecords)
  }

  // Calculate live stats
  const stats = students.reduce((acc, curr) => {
    const status = attendanceRecords[curr.id] || 'Pending'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, { Present: 0, Absent: 0, Late: 0, Pending: 0 })

  const totalStudents = students.length

  const buttonConfigs = [
    { status: 'Present' as const, label: 'Present', activeColor: 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30', icon: Check },
    { status: 'Absent' as const, label: 'Absent', activeColor: 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-600/30', icon: X },
    { status: 'Late' as const, label: 'Late', activeColor: 'bg-amber-600 border-amber-600 text-white shadow-sm shadow-amber-600/30', icon: Clock },
    { status: 'Pending' as const, label: 'Pending', activeColor: 'bg-neutral-600 border-neutral-600 text-white', icon: ChevronRight }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">Mark Student Attendance</h1>
          <p className="text-muted text-sm mt-1">Record daily logs and sync them in real time across the portal.</p>
        </div>
        
        {isMockMode && (
          <span className="self-start md:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
            <RefreshCw size={12} className="animate-spin" />
            Offline Demo Mode
          </span>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border text-sm
          ${message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'}`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">{message.type === 'success' ? 'Records Synced' : 'Sync Error'}</p>
            <p className="mt-0.5 opacity-90">{message.text}</p>
          </div>
        </div>
      )}

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold">Attendance Session Locked</p>
              <p className="text-xs opacity-90">Historical dates are locked after 24 hours to prevent data changes.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLocked(false)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 hover:border-amber-400 text-amber-800 text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Unlock size={11} /> Force Unlock
          </button>
        </div>
      )}

      {/* Configuration Box */}
      <div className="bg-white p-6 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Select Class</label>
          <div className="relative">
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-surface border-2 border-border text-navy text-sm font-medium rounded-xl p-3 focus:border-teal-600 outline-none transition cursor-pointer appearance-none"
            >
              <option value="">Select a class...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              ▼
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">Select Date (IST)</label>
          <div className="relative">
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-surface border-2 border-border text-navy text-sm font-medium rounded-xl p-3 focus:border-teal-600 outline-none transition cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end">
          {selectedClassId && students.length > 0 && !isLocked && (
            <div className="flex gap-2">
              <button 
                onClick={() => setAllStatus('Present')}
                className="flex-1 py-3 text-xs font-semibold rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition"
              >
                Mark All Present
              </button>
              <button 
                onClick={() => setAllStatus('Absent')}
                className="flex-1 py-3 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition"
              >
                Mark All Absent
              </button>
            </div>
          )}
        </div>
      </div>

      {!selectedClassId ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,.04)]">
          <BookOpen className="w-12 h-12 text-muted/65 mx-auto mb-4" />
          <h3 className="font-bold text-navy text-lg">No Class Selected</h3>
          <p className="text-muted text-sm mt-1 max-w-sm mx-auto">Please select a class and attendance date from the filters above to retrieve the student roster.</p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,.04)] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted text-sm font-medium">Fetching roster and records from Supabase...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,.04)]">
          <Users className="w-12 h-12 text-muted/65 mx-auto mb-4" />
          <h3 className="font-bold text-navy text-lg">Empty Roster</h3>
          <p className="text-muted text-sm mt-1">There are no students enrolled in this class roster.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Roster Table */}
          <div className="bg-white rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
              <span className="text-[13px] font-bold text-navy uppercase tracking-wider">Student Roster ({students.length})</span>
              <span className="text-xs text-muted">All logs will be saved securely under Row Level Security.</span>
            </div>

            <div className="divide-y divide-border">
              {students.map((student) => {
                const currentStatus = attendanceRecords[student.id] || 'Pending'
                const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                
                return (
                  <div key={student.id} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface/30 transition">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center text-navy text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-navy text-[14px]">{student.name}</p>
                        <p className="text-muted text-xs">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {buttonConfigs.map((btn) => {
                        const isActive = currentStatus === btn.status
                        const BtnIcon = btn.icon
                        return (
                          <button
                            key={btn.status}
                            disabled={isLocked}
                            onClick={() => updateStatus(student.id, btn.status)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[12px] font-bold tracking-wide transition-all cursor-pointer select-none
                              ${isLocked ? 'opacity-55 cursor-not-allowed' : ''}
                              ${isActive 
                                ? btn.activeColor 
                                : `border-border text-muted hover:text-navy hover:bg-surface`}`}
                          >
                            <BtnIcon size={12} />
                            {btn.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Confirmation KPI Summary Widget */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white border border-border p-4 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted">Total Students</p>
              <p className="text-2xl font-extrabold text-navy mt-1">{totalStudents}</p>
            </div>
            <div className="bg-white border border-border p-4 rounded-2xl shadow-sm text-center border-l-4 border-l-emerald-600">
              <p className="text-emerald-700 text-[10px] uppercase font-bold tracking-wider">Present</p>
              <p className="text-2xl font-extrabold text-emerald-800 mt-1">{stats.Present}</p>
            </div>
            <div className="bg-white border border-border p-4 rounded-2xl shadow-sm text-center border-l-4 border-l-rose-600">
              <p className="text-rose-700 text-[10px] uppercase font-bold tracking-wider">Absent</p>
              <p className="text-2xl font-extrabold text-rose-800 mt-1">{stats.Absent}</p>
            </div>
            <div className="bg-white border border-border p-4 rounded-2xl shadow-sm text-center border-l-4 border-l-amber-600">
              <p className="text-amber-700 text-[10px] uppercase font-bold tracking-wider">Late</p>
              <p className="text-2xl font-extrabold text-amber-800 mt-1">{stats.Late}</p>
            </div>
            <div className="bg-white border border-border p-4 rounded-2xl shadow-sm text-center">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Pending</p>
              <p className="text-2xl font-extrabold text-neutral-600 mt-1">{stats.Pending}</p>
            </div>
          </div>

          {/* Save Button Bar */}
          <div className="bg-white p-5 rounded-3xl border border-border shadow-[0_1px_4px_rgba(0,0,0,.04)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <AlertCircle size={14} className="text-teal-600" />
              <span>All changes will reflect instantly on the student and parent dashboards.</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || isLocked}
              className="w-full sm:w-auto bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-700 shadow-md shadow-teal-600/35 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Syncing logs...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save & Sync Attendance
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
