'use client'

import { useRouter } from 'next/navigation'
import { API_URL } from 'src/constant'
import { IUser } from 'src/interfaces'
import fetcher from 'src/services/fetcher'
import useSWR from 'swr'
import Avatar from './Avatar'
import Button from './Button'
import ThemeSwitcher from './ThemeSwitcher'

interface Props {}

const Header: React.FC<Props> = (): JSX.Element => {
  const router = useRouter()

  const { data } = useSWR<IUser>(`${API_URL}/me`, fetcher)

  return (
    <div className="flex flex-row justify-between items-center p-5 border">
      <h1>Bookstore</h1>
      <div className="flex flex-col-reverse md:flex-row items-center gap-2">
        <ThemeSwitcher />
        <Avatar
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          name={data?.fullName || ''}
        />
        <Button onClick={() => router.push('/logout')}>Logout</Button>
      </div>
    </div>
  )
}
export default Header
