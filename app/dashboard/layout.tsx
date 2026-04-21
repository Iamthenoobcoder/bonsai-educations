import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div className="p-8">Profile not found. Contact administrator.</div>
  }

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <span className="font-semibold text-lg tracking-tight">BONSAI PORTAL</span>
          <p className="text-sm text-neutral-500 capitalize mt-1 border border-neutral-200 inline-block px-2 py-0.5 rounded-full">{profile.role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href={`/dashboard/${profile.role}`} className="flex items-center px-3 py-2 text-sm font-medium rounded-xl text-neutral-900 bg-neutral-100/50 hover:bg-neutral-100">
            <LayoutDashboard className="w-5 h-5 mr-3 text-neutral-500" />
            Overview
          </Link>
          {profile.role === 'admin' && (
            <>
              <Link href="/dashboard/admin/users" className="flex items-center px-3 py-2 text-sm font-medium rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
                <Users className="w-5 h-5 mr-3 text-neutral-400" />
                Manage Users
              </Link>
              <Link href="/dashboard/admin/timetable" className="flex items-center px-3 py-2 text-sm font-medium rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
                <Calendar className="w-5 h-5 mr-3 text-neutral-400" />
                Timetable
              </Link>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-neutral-100">
          <p className="text-sm font-medium text-neutral-900 px-3 py-1">{profile.name}</p>
          <form action="/auth/login" method="POST">
             <button className="flex w-full items-center px-3 py-2 mt-2 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 text-left">
               <LogOut className="w-5 h-5 mr-3 text-red-500" />
               Sign Out
             </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full p-8">
         {children}
      </main>
    </div>
  )
}
