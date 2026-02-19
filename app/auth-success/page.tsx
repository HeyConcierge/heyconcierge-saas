'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const userId = searchParams?.get('user_id')
    const userEmail = searchParams?.get('user_email')
    const redirect = searchParams?.get('redirect') || '/signup?step=2'

    console.log('[Auth Success] Received:', { userId, userEmail, redirect })

    if (userId && userEmail) {
      // Set cookies client-side
      document.cookie = `user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
      document.cookie = `user_email=${userEmail}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
      
      console.log('[Auth Success] Cookies set, redirecting to:', redirect)
      
      // Small delay to ensure cookies are set
      setTimeout(() => {
        router.push(redirect)
      }, 100)
    } else {
      console.error('[Auth Success] Missing user data, redirecting to login')
      router.push('/login?error=auth_failed')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-dark font-bold">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  )
}
