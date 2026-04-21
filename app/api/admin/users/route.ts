import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Requires SUPABASE_SERVICE_ROLE_KEY
export async function POST(req: Request) {
  try {
    const { email, password, name, role, phone } = await req.json()
    
    // We would use the service role key to bypass RLS and create an auth user directly.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Server missing SERVICE_ROLE_KEY" }, { status: 500 })
    }

    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        cookies: {
          getAll() { return [] },
          setAll() {},
        },
      }
    )

    // 1. Create user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) throw authError

    // 2. Create profile manually (or via trigger, but we'll do it manually to ensure atomicity with name/role)
    if (authData.user) {
       const { error: profileError } = await supabaseAdmin.from('profiles').insert({
         id: authData.user.id,
         name,
         email,
         role,
         phone
       })
       if (profileError) throw profileError
    }

    return NextResponse.json({ success: true, user: authData.user })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
