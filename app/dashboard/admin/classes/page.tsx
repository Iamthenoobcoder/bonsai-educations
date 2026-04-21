import { createClient } from '@/lib/supabase/server'
import { PlusCircle, Users } from 'lucide-react'

export default async function AdminClassesPage() {
  const supabase = await createClient()
  const { data: classes, error } = await supabase
    .from('classes')
    .select('*, profiles:teacher_id(name)')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Manage Classes</h1>
          <p className="text-neutral-500 mt-1">Assign teachers and enroll students into respective classes.</p>
        </div>
        <button className="flex items-center bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-amber-700 transition">
          <PlusCircle className="w-5 h-5 mr-2" /> Create Class
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {classes?.map((c: any) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col hover:border-amber-200 transition">
             <div className="mb-4">
               <h3 className="text-xl font-bold text-neutral-900">{c.name}</h3>
               <p className="text-sm font-medium text-amber-600 mt-1">{c.grade}</p>
             </div>
             <p className="text-sm text-neutral-500 mb-6 flex-1">
               <span className="font-medium">Teacher:</span> {c.profiles?.name || 'Unassigned'}
             </p>
             <button className="w-full bg-neutral-50 text-neutral-900 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-100 transition flex justify-center items-center">
               <Users className="w-4 h-4 mr-2" /> Manage Roster
             </button>
          </div>
        ))}
        {(!classes || classes.length === 0) && (
           <div className="col-span-3 text-center p-12 text-neutral-400 bg-white rounded-3xl border border-neutral-100">
             No classes created yet.
           </div>
        )}
      </div>
    </div>
  )
}
