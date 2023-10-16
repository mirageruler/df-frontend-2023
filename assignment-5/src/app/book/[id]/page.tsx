'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NotFound from 'src/app/not-found'
import { Layout, Modal } from 'src/components'
import Button from 'src/components/Button'

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [openModal, setOpenModal] = useState(false)

  const { id: bookId } = params

  const lsBook = JSON.parse(localStorage.getItem('books') || '{}')
  const currentBook = lsBook.find((book) => book.id === bookId)

  const onCloseModalDelete = () => {
    setOpenModal(false)
  }

  const onDelete = () => {
    const newBooks = lsBook.filter((lsBook) => lsBook['id'] !== bookId)
    localStorage.setItem('books', JSON.stringify(newBooks))
    router.back()
  }

  return !currentBook ? (
    <NotFound />
  ) : (
    <Layout>
      <div className="p-5">
        <Button
          color="none"
          className="text-pink-700"
          onClick={() => router.back()}
        >
          {`< Back`}
        </Button>
        <div className="flex flex-col gap-2 py-4">
          <p>
            <strong>{currentBook?.title}</strong>
          </p>
          <p>
            <strong>Author:</strong> {currentBook?.author}
          </p>
          <p>
            <strong>Topic:</strong> {currentBook?.topic}
          </p>
        </div>
        <Button
          color="none"
          className="text-pink-700 underline"
          onClick={() => setOpenModal(true)}
        >
          Delete
        </Button>
      </div>
      <Modal open={openModal} title="Delete book" onClose={onCloseModalDelete}>
        <h1 className="self-center">{`Do you want to delete ${currentBook?.title}`}</h1>
        <div className="flex gap-5 self-center p-2">
          <Button color="none" onClick={onCloseModalDelete}>
            Cancel
          </Button>
          <Button color="primary" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  )
}
