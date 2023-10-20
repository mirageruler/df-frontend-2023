'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'

interface Props {
  children: React.ReactNode
}

interface Props {}

const Layout: React.FC<Props> = ({ children }): JSX.Element => {
  const router = useRouter()

  const accessToken: string | null =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null

  useEffect(() => {
    if (!accessToken) {
      router.push('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return accessToken ? (
    <div className="bg-white dark:bg-gray-800 w-screen h-screen text-gray-900 dark:text-gray-300 p-5">
      <Header />
      {children}
    </div>
  ) : (
    <div>authenticating...</div>
  )
}

export default Layout
