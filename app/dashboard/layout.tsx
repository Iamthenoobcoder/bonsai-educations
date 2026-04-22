import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Calendar, LogOut, BookOpen, Bell } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  let { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  if (!profile) {
    profile = {
       role: user.user_metadata?.role || 'student',
       name: user.user_metadata?.name || 'New User',
    }
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  const initials = profile.name.split(' ').map((n: string) => n[0]).join('').substring(0,2) || 'U'

  return (
    <div className="flex h-screen font-sans bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-navy flex flex-col py-5 shrink-0">
        <div className="flex items-center gap-2 px-4 pb-5 border-b border-white/10">
          <div className="w-[30px] h-[30px] rounded-lg bg-teal-600 flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="text-white font-bold text-[13px] tracking-wide">BONSAI</span>
        </div>
        
        <nav className="flex-1 mt-3 px-2 space-y-1">
          <Link href={`/dashboard/${profile.role}`} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all bg-teal-600/25 text-[#4ade80] border-l-[3px] border-[#4ade80]">
            <LayoutDashboard size={15} />
            Overview
          </Link>
          
          {profile.role === 'admin' && (
            <>
              <Link href="/dashboard/admin/users" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <Users size={15} />
                Manage Users
              </Link>
              <Link href="/dashboard/admin/timetable" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <Calendar size={15} />
                Timetable
              </Link>
            </>
          )}
        </nav>

        <div className="px-2.5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 px-1.5 py-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{profile.name}</p>
              <p className="text-white/40 text-[10px] capitalize">{profile.role}</p>
            </div>
          </div>
          <form action={handleSignOut}>
             <button type="submit" className="flex w-full items-center px-3 py-2 mt-2 text-xs font-medium rounded-lg text-red-400 hover:bg-white/5 transition-colors">
               <LogOut size={14} className="mr-2" />
               Sign Out
             </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-6 py-3.5 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-lg font-bold text-navy capitalize">
              {profile.role} Portal
            </h1>
            <p className="text-muted text-xs">Welcome back to Bonsai Educations</p>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="relative cursor-pointer">
              <Bell size={18} className="text-muted hover:text-navy transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </div>
            <div className="w-[34px] h-[34px] rounded-lg bg-navy flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-surface">
           {children}
        </main>
      </div>
    </div>
  )
}
