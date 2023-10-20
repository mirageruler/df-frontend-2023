'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NotFound from 'src/app/not-found'
import { Layout, Modal } from 'src/components'
import Button from 'src/components/Button'
import * as bookClient from '../../../_generated/book/book'

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()

  const { data: books } = bookClient.useGetBooks()

  const [openModal, setOpenModal] = useState(false)

  const { id: bookId } = params

  const currentBook = books?.data?.find((book) => {
    return book.id === parseFloat(bookId)
  })

  const onCloseModalDelete = () => {
    setOpenModal(false)
  }

  const onDelete = async () => {
    try {
      await bookClient.deleteBook(parseFloat(bookId))
      router.back()
      // Handle success
    } catch (error) {
      // Handle error
    }
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
            <strong>{currentBook?.name}</strong>
          </p>
          <p>
            <strong>Author:</strong> {currentBook?.author}
          </p>
          <p>
            <strong>Topic:</strong> {currentBook?.topic?.name}
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
        <h1 className="self-center">{`Do you want to delete ${currentBook?.name}`}</h1>
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
