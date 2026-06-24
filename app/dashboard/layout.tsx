import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Calendar, LogOut, Bell, ClipboardCheck, Award } from 'lucide-react'

import { cookies } from 'next/headers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user = null
  let profile = null

  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
    const cookieStore = await cookies()
    const role = cookieStore.get('sb-role')?.value || 'student'
    user = {
      id: role === 'teacher' ? 'teacher-id' : role === 'parent' ? 'parent-id' : 'stud-1',
      email: `${role}@bonsaiedu.com`,
      user_metadata: {
        name: role === 'teacher' ? 'Dr. Ramesh Kumar' : role === 'parent' ? 'Sanjay Sharma' : 'Rahul Sharma',
        role
      }
    }
    profile = {
      role,
      name: user.user_metadata.name
    }
  } else {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) redirect('/auth/login')
    user = authUser

    const { data: dbProfile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single()
    profile = dbProfile
  }

  if (!profile) {
    profile = {
       role: 'student',
       name: 'New User',
     }
  }

  const handleSignOut = async () => {
    'use server'
    const cookieStore = await cookies()
    cookieStore.set('sb-role', '', { maxAge: -1 })
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
          <Image src="/logo.jpg" alt="Bonsai Logo" width={30} height={30} className="rounded-lg object-contain bg-white" />
          <span className="text-white font-bold text-[13px] tracking-wide">BONSAI</span>
        </div>
        
        <nav className="flex-1 mt-3 px-2 space-y-1">
          <Link href={`/dashboard/${profile.role}`} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
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

          {profile.role === 'teacher' && (
            <>
              <Link href="/dashboard/teacher/attendance" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <ClipboardCheck size={15} />
                Mark Attendance
              </Link>
              <Link href="/dashboard/teacher/scores" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <Award size={15} />
                Upload Scores
              </Link>
            </>
          )}

          {profile.role === 'student' && (
            <>
              <Link href="/dashboard/student/timetable" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <Calendar size={15} />
                My Timetable
              </Link>
              <Link href="/dashboard/student/scores" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <Award size={15} />
                My Scores
              </Link>
              <Link href="/dashboard/student/attendance" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <ClipboardCheck size={15} />
                My Attendance
              </Link>
            </>
          )}

          {profile.role === 'parent' && (
            <>
              <Link href="/dashboard/parent/attendance" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all text-white/60 hover:bg-white/10 hover:text-white">
                <ClipboardCheck size={15} />
                Ward Attendance
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
