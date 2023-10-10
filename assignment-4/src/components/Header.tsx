import ThemeSwitcher from './ThemeSwitcher'
import Avatar from './Avatar'

interface Props {}

const Header: React.FC<Props> = (): JSX.Element => {
  return (
    <div className="flex flex-row justify-between items-center p-5 border">
      <h1>Bookstore</h1>
      <div className="flex flex-col-reverse md:flex-row items-center gap-2">
        <ThemeSwitcher />
        <Avatar
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          name="John Doe"
        />
      </div>
    </div>
  )
}
export default Header
