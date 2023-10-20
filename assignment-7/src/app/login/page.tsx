'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Button, Input } from 'src/components'
import { validateLoginForm } from 'src/utils'
import * as authClient from '../../_generated/auth/auth'

export default function Login() {
  const router = useRouter()

  const [errorState, setErrorState] = useState({ email: '', password: '' })

  const formData = useRef({ email: '', password: '' })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { email, password } = formData.current
    // validate
    const validateErrors = validateLoginForm(email, password)
    setErrorState(validateErrors)
    if (!validateErrors?.email && !validateErrors?.password) {
      // handle login
      const resp = await authClient.login({ email, password })
      const token = resp.data?.accessToken
      if (token) {
        // SET O DAY
        setSession(token)
        router.push('/')
      } else {
        // Handle login error
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 w-screen h-screen text-gray-900 dark:text-gray-300 p-5 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-1/4 gap-4">
        <h1 className="self-center text-pink-700 font-bold text-4xl">
          Bookstore
        </h1>
        <Input
          label="Email (*)"
          error={errorState.email}
          onChange={(e) => {
            formData.current = { ...formData.current, email: e.target.value }
          }}
        />
        <Input
          label="Password (*)"
          type="password"
          error={errorState.password}
          onChange={(e) => {
            formData.current = { ...formData.current, password: e.target.value }
          }}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}

const setSession = (accessToken: string): void => {
  // Check if localStorage is available
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('accessToken', accessToken)
  }
}
