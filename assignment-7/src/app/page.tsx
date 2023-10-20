'use client'

import React from 'react'
import { Layout } from 'src/components'
import BookStore from 'src/components/BookStore'

export default function Home() {
  return (
    <Layout>
      <BookStore />
    </Layout>
  )
}
