import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-full">
      <h1 className="font-bold text-9xl">404</h1>
      <h2>Page not found</h2>
      <Link href="/" className="text-pink-700">{`< Back to home page`}</Link>
    </div>
  )
}
