import Image from 'next/image'
import ThemeSwitcher from './ThemeSwitcher'

const Header = (
  <div className="flex flex-row justify-between items-center p-10 border">
    <h1>Bookstore</h1>
    <div className="flex flex-row items-center gap-2">
      <ThemeSwitcher />
      <Image
        className="avatar rounded-full"
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
        alt="user avatar"
        width={40}
        height={40}
      />
      <div className="profile-name">John Doe</div>
    </div>
  </div>
)

export default Header
