import { createClient } from '@/lib/supabase/server'
import { Award, TrendingUp } from 'lucide-react'

export default async function StudentScores() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('student_id', user?.id)
    .order('date', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">My Academic Record</h1>
      <p className="text-neutral-500 mb-8">View your test performances and grading insights.</p>

      {/* Aggregate insight card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-md text-white mb-8 flex items-center justify-between">
        <div>
           <p className="text-amber-100 font-medium mb-1 flex items-center"><TrendingUp className="w-4 h-4 mr-2"/> Performance Trend</p>
           <h2 className="text-2xl font-bold">You're doing great! Keep it up.</h2>
        </div>
        <div className="bg-white/20 p-4 rounded-2xl flex items-center justify-center">
           <Award className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50/50">
            <tr>
              <th className="p-5 pl-6 font-medium text-neutral-500 text-sm">Subject</th>
              <th className="p-5 font-medium text-neutral-500 text-sm">Exam Name</th>
              <th className="p-5 font-medium text-neutral-500 text-sm">Date</th>
              <th className="p-5 font-medium text-neutral-500 text-sm text-right pr-6">Score</th>
            </tr>
          </thead>
          <tbody>
            {!scores || scores.length === 0 ? (
               <tr>
                 <td colSpan={4} className="p-8 text-center text-neutral-400">No score records found.</td>
               </tr>
            ) : (
               scores.map((s: any) => {
                 const pct = Math.round((s.marks / s.max_marks) * 100);
                 const colors = pct >= 80 ? "text-green-600 bg-green-50" : pct >= 60 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50";
                 
                 return (
                   <tr key={s.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition">
                     <td className="p-5 pl-6 font-semibold text-neutral-900">{s.subject}</td>
                     <td className="p-5 text-neutral-600 font-medium">{s.exam_name}</td>
                     <td className="p-5 text-neutral-500">{new Date(s.date).toLocaleDateString()}</td>
                     <td className="p-5 text-right pr-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${colors}`}>
                          {s.marks} / {s.max_marks} ({pct}%)
                        </span>
                     </td>
                   </tr>
                 )
               })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
