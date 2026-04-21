"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
       setError(error.message)
       setLoading(false)
    } else {
       router.push('/dashboard')
       router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Sign In</h2>
          <p className="text-neutral-500 mt-2">Access your portal dashboard.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
             <label className="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
             <input
               type="email"
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
               placeholder="name@example.com"
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
             <input
               type="password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
               placeholder="••••••••"
             />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white font-medium py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  )
}
