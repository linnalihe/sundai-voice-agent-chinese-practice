'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSettings } from '@/lib/storage'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const { anthropicKey } = getSettings()
    router.replace(anthropicKey ? '/dashboard' : '/setup')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="font-serif text-4xl text-red-100">普通话练习</div>
    </div>
  )
}
