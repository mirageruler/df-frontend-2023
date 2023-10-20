'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from 'src/services/auth'

const LogoutPage = (): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    logout()
    router.push('/login')
  }, [router])

  return <div>Logging out...</div>
}

export default LogoutPage
