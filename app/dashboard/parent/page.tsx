import { createClient } from '@/lib/supabase/server'
import { TrendingDown, CheckSquare, BookOpen } from 'lucide-react'

export default async function ParentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: links } = await supabase
    .from('parent_child')
    .select('student_id, profiles:student_id(name)')
    .eq('parent_id', user?.id)

  const childrenIds = links?.map(l => l.student_id) || []
  
  // Fetch latest scores
  const { data: scores } = childrenIds.length > 0 
     ? await supabase.from('scores').select('*, profiles:student_id(name)').in('student_id', childrenIds).order('date', { ascending: false }).limit(10)
     : { data: [] }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Parent Portal</h1>
        <p className="text-neutral-500 mt-1">Holistic insights into your child's academic journey.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
               ★
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Selected Ward</p>
              <select className="font-bold text-lg text-neutral-900 bg-transparent focus:outline-none cursor-pointer">
                {links && links.length > 0 ? (
                  links.map((l: any) => <option key={l.student_id}>{l.profiles?.name}</option>)
                ) : (
                  <option>No children linked</option>
                )}
              </select>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm col-span-2">
            <h3 className="font-semibold text-lg text-neutral-900 mb-6 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-amber-600" /> Recent Assessments
            </h3>
            <div className="space-y-4 text-sm font-medium">
               {scores && scores.length > 0 ? (
                 scores.map((s: any) => (
                   <div key={s.id} className="flex justify-between items-center p-3 hover:bg-neutral-50 rounded-xl transition cursor-default">
                     <span className="text-neutral-900">{s.subject} <span className="text-neutral-400">({s.exam_name})</span></span>
                     <span className="text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">{s.marks}/{s.max_marks}</span>
                   </div>
                 ))
               ) : (
                 <p className="text-neutral-400 italic">No scores available</p>
               )}
            </div>
         </div>

         <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
            <h3 className="font-semibold text-lg text-red-900 mb-6 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" /> Improvement Areas
            </h3>
            <p className="text-red-700 text-sm mb-4">Subjects with average scores below 60%</p>
            <div className="flex flex-wrap gap-2">
               <span className="text-xs text-neutral-400 italic">No weak areas identified yet.</span>
            </div>
         </div>
      </div>
    </div>
  )
}
