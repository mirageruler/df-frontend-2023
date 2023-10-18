import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<Props> = (props): JSX.Element => {
  const { children, color = 'primary', className = '', type = 'button' } = props
  const colorMap = new Map([
    [
      'primary',
      'text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-pink-600 dark:hover:bg-pink-700 focus:outline-none dark:focus:ring-pink-800',
    ],
    [
      'secondary',
      'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
    ],
  ])
  return (
    <button
      {...props}
      type={type}
      className={`${colorMap.get(color) || ''} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
