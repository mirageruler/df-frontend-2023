'use client'

import React from 'react'
import { HomePage } from '../pages/Home'
import ThemeProvider from '../components/ThemeProvider'

export default function Home() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  )
}
