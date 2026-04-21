import { createClient } from '@/lib/supabase/server'
import { PlusCircle, Calendar as CalendarIcon, Clock } from 'lucide-react'

export default async function AdminTimetablePage() {
  const supabase = await createClient()
  const { data: timetable, error } = await supabase
    .from('timetable')
    .select('*, classes(name, grade)')
    .order('day')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Timetable Overview</h1>
          <p className="text-neutral-500 mt-1">Manage weekly schedules for all classes.</p>
        </div>
        <button className="flex items-center bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
          <div key={day} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm min-h-[400px]">
            <h2 className="font-semibold text-lg text-neutral-900 mb-4">{day}</h2>
            <div className="space-y-3">
              {timetable?.filter((t: any) => t.day === day).length ? (
                 timetable.filter((t: any) => t.day === day).map((slot: any) => (
                   <div key={slot.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                      <p className="font-semibold text-amber-900 text-sm">{slot.subject}</p>
                      <p className="text-amber-700 text-xs font-medium mt-1">{slot.classes?.name}</p>
                      <div className="flex items-center text-amber-600 mt-2 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      </div>
                   </div>
                 ))
              ) : (
                <p className="text-neutral-400 text-sm text-center py-4">No classes scheduled.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
