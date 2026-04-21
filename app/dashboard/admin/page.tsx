export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
           <p className="text-sm font-medium text-neutral-500 mb-2">Total Students</p>
           <p className="text-3xl font-bold text-neutral-900">-</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
           <p className="text-sm font-medium text-neutral-500 mb-2">Active Teachers</p>
           <p className="text-3xl font-bold text-neutral-900">-</p>
        </div>
      </div>
    </div>
  )
}
