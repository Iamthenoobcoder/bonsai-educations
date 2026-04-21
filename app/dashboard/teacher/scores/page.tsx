export default async function ScoreUploadPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Upload Scores</h1>
      <p className="text-neutral-500 mb-8">Enter offline exam scores for your students.</p>

      <form className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Student</label>
            <select className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-amber-500 focus:border-amber-500 block p-3">
              <option>Select Student...</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Subject</label>
            <input type="text" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-amber-500 block p-3" placeholder="e.g. Mathematics" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Exam Name</label>
            <input type="text" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-amber-500 block p-3" placeholder="e.g. Midterms" />
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-medium text-neutral-700 mb-1">Marks</label>
               <input type="number" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-amber-500 block p-3" placeholder="0" />
             </div>
             <div className="flex-1">
               <label className="block text-sm font-medium text-neutral-700 mb-1">Max</label>
               <input type="number" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-amber-500 block p-3" defaultValue="100" />
             </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-neutral-100">
          <button type="button" className="w-full bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition">
            Save Record
          </button>
        </div>
      </form>
    </div>
  )
}
