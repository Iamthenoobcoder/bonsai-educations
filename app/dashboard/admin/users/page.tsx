import { createClient } from '@/lib/supabase/server'
import { PlusCircle, UserCog, Mail } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">User Management</h1>
          <p className="text-neutral-500 mt-1">Manage staff, students, and parent accounts.</p>
        </div>
        <button className="flex items-center bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-amber-700 transition">
          <PlusCircle className="w-5 h-5 mr-2" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 text-neutral-500 text-sm border-b border-neutral-100">
              <th className="font-medium p-4 pl-6">Name</th>
              <th className="font-medium p-4">Role</th>
              <th className="font-medium p-4">Email</th>
              <th className="font-medium p-4">Phone</th>
              <th className="font-medium p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  {error ? "Ensure your Supabase connection is configured." : "No users found."}
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition">
                  <td className="p-4 pl-6 font-medium text-neutral-900">{u.name}</td>
                  <td className="p-4">
                    <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold uppercase tracking-wider rounded-full">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500 flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> {u.email}
                  </td>
                  <td className="p-4 text-neutral-500">{u.phone || '-'}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-amber-600 hover:text-amber-800 font-medium text-sm">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
