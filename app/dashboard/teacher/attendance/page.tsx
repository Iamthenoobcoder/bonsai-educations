import { createClient } from '@/lib/supabase/server'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default async function AttendancePage() {
  const supabase = await createClient()

  // For UI testing, we'll assume we fetched some students if the DB was connected
  // However, without DB data we just render a placeholder.
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Mark Attendance</h1>
      <p className="text-neutral-500 mb-8">Select a class and record attendance for today.</p>

      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm mb-6 flex gap-4">
        <select className="flex-1 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-amber-500 focus:border-amber-500 block p-3">
          <option>Select Class...</option>
          <option>Grade 10-A (Mathematics)</option>
        </select>
        <button className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-neutral-800 transition">
          Load Students
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-12 text-center text-neutral-400">
           Select a class above to load the student roster.
        </div>
      </div>
    </div>
  )
}
