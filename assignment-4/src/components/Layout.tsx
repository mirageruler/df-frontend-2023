'use client'

import Header from './Header'

interface Props {
  children: React.ReactNode
}

interface Props {}

const Layout: React.FC<Props> = ({ children }): JSX.Element => {
  return (
    <div className="bg-white dark:bg-gray-800 w-screen h-screen text-gray-900 dark:text-gray-300 p-5">
      <Header />
      {children}
    </div>
  )
}

export default Layout
