/* eslint-disable react/jsx-no-constructed-context-values */
import { useEffect, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'

interface Props {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('ui.theme') as 'light' | 'dark') || 'dark',
  )

  const toggleTheme = (): void => {
    const val = theme === 'light' ? 'dark' : 'light'
    setTheme(val)
    localStorage.setItem('ui.theme', val)

    if (val === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('ui.theme') === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
