import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardIndex() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const role = profile?.role || user.user_metadata?.role || 'student';

  if (role) {
    redirect(`/dashboard/${role}`)
  }
}
