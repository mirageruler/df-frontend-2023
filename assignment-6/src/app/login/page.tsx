'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Button, Input } from 'src/components'
import { login } from 'src/services/auth'
import { validateLoginForm } from 'src/utils'

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
      const success: boolean = await login(email, password)

      if (success) {
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
