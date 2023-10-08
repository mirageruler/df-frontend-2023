import React from 'react'

type ContextType = {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const ThemeContext = React.createContext<ContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})
