import { createClient } from '@/lib/supabase/server'
import { Clock } from 'lucide-react'

export default async function StudentTimetable() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Gets all classes a student is enrolled in
  const { data: enrolments } = await supabase
    .from('class_students')
    .select('class_id')
    .eq('student_id', user?.id)

  const classIds = enrolments?.map(e => e.class_id) || []

  const { data: timetable } = classIds.length > 0 
    ? await supabase.from('timetable').select('*, classes(name)').in('class_id', classIds).order('start_time')
    : { data: [] }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">My Timetable</h1>
      <p className="text-neutral-500 mb-8">Your weekly schedule dynamically filtered by your enrolled classes.</p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
          <div key={day} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm min-h-[400px]">
            <h2 className="font-semibold text-lg text-neutral-900 mb-4">{day}</h2>
             <div className="space-y-3">
              {timetable?.filter((t: any) => t.day === day).map((slot: any) => (
                <div key={slot.id} className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl hover:bg-orange-50 transition">
                  <p className="font-semibold text-orange-900 mb-1">{slot.subject}</p>
                  <p className="text-orange-700 text-xs font-medium">{slot.classes?.name}</p>
                  <div className="flex items-center text-orange-600 mt-3 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </div>
                </div>
              ))}
              {timetable?.filter((t: any) => t.day === day).length === 0 && (
                <p className="text-neutral-400 text-sm text-center py-4">Free day</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
