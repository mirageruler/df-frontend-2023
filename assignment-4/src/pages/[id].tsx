import { useRouter } from 'next/router'

const BookDetail = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <button type="button" onClick={() => router.back()}>
        Back
      </button>
      <p>Book: {id}</p>
    </>
  )
}

export default BookDetail
