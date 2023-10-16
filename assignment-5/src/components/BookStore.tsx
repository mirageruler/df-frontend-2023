'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Modal, Paging } from 'src/components'
import { books, defaultForm, pageSize } from 'src/constant'
import { IBook, IBooks } from 'src/interfaces'
import { createUniqueId, validateBookForm } from 'src/utils'

const BookStore = () => {
  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState({
    open: false,
    title: '',
    id: '',
  })
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<IBooks>([])
  const [error, setError] = useState({ title: '', author: '', topic: '' })

  const formData = useRef({ ...defaultForm })

  const dataFilter = data.filter((book: IBook) =>
    String(book.title).toLowerCase().startsWith(search.toLowerCase()),
  )
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const dataRender = dataFilter.slice(startIndex, endIndex)

  useEffect(() => {
    const lsBook = JSON.parse(localStorage.getItem('books') || '{}')
    if (lsBook && Array.isArray(lsBook)) {
      setData(lsBook)
    } else {
      localStorage.setItem('books', JSON.stringify(books))
    }
  }, [])

  const resetForm = () => {
    formData.current = { ...defaultForm }
    setError({ title: '', author: '', topic: '' })
  }

  const handleOpenModalCreate = () => {
    setModalCreate(true)
  }

  const handleOpenModalEdit = (data) => {
    formData.current.id = data?.id
    formData.current.title = data?.title
    formData.current.author = data?.author
    formData.current.topic = data?.topic
    setModalEdit(true)
  }

  const handleOpenModalDelete = (data: IBook) => {
    setModalDelete({ open: true, title: data?.title, id: data?.id })
  }

  const onCloseModalCreate = () => {
    setModalCreate(false)
    resetForm()
  }

  const onCloseModalEdit = () => {
    setModalEdit(false)
    resetForm()
  }

  const onCloseModalDelete = () => {
    setModalDelete((prevState) => ({ ...prevState, open: false }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const { id, title, author, topic } = formData.current

    // validate
    const validateErrors = validateBookForm(title, author, topic)
    setError(validateErrors)
    if (
      validateErrors?.title ||
      validateErrors?.author ||
      validateErrors?.topic
    ) {
      return
    }

    const lsBooks: IBooks = [...data]

    if (modalEdit) {
      for (let i = 0; i < lsBooks.length; i++) {
        if (lsBooks[i].id === id) {
          lsBooks[i] = {
            ...lsBooks[i],
            ...{
              title,
              author,
              topic,
            },
          }
          break
        }
      }
    } else {
      lsBooks.push({
        title: formData.current.title,
        author: formData.current.author,
        topic: formData.current.topic,
        id: createUniqueId(),
      })
    }
    setData(lsBooks)
    localStorage.setItem('books', JSON.stringify(lsBooks))
    return modalEdit ? onCloseModalEdit() : onCloseModalCreate()
  }

  const onDelete = (id) => {
    const lsBooks = [...data]
    const newBooks = lsBooks.filter((lsBook) => lsBook['id'] !== id)
    localStorage.setItem('books', JSON.stringify(newBooks))
    setData(newBooks)
    onCloseModalDelete()
    setCurrentPage(1)
  }

  return (
    <div className="p-5">
      <div className="flex items-center py-5 gap-5">
        <Input
          type="search"
          placeholder="Enter title to search books (case insensitive)"
          value={search}
          onChange={(e) => {
            setCurrentPage(1)
            setSearch(e.target.value)
          }}
        />
        <Button className="flex-shrink-0 m-0" onClick={handleOpenModalCreate}>
          Add Book
        </Button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Author
              </th>
              <th scope="col" className="px-6 py-3">
                Topic
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRender.map((data: IBook, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{data.title}</td>
                  <td className="px-6 py-4">{data.author}</td>
                  <td className="px-6 py-4">{data.topic}</td>
                  <td className="px-6 py-4 gap-2 flex text-pink-700 underline">
                    <Button
                      color="none"
                      onClick={() => handleOpenModalEdit(data)}
                    >
                      Edit
                    </Button>
                    |
                    <Button
                      color="none"
                      onClick={() => handleOpenModalDelete(data)}
                    >
                      Delete
                    </Button>
                    |
                    <Button color="none">
                      <Link href={`/book/${data.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Paging
        currentPage={currentPage}
        data={data}
        onChangePage={(page) => setCurrentPage(page)}
      />

      {/* Modal Create|Edit */}
      <Modal
        open={modalCreate || modalEdit}
        title={modalCreate ? 'Create Books' : 'Edit Books'}
        onClose={modalCreate ? onCloseModalCreate : onCloseModalEdit}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            label="Title:"
            type="text"
            placeholder="Enter title..."
            defaultValue={formData.current.title}
            error={error.title}
            onChange={(e) => {
              formData.current = { ...formData.current, title: e.target.value }
            }}
          />
          <Input
            label="Author:"
            type="text"
            id="modalAuthor"
            placeholder="Enter author..."
            defaultValue={formData.current.author}
            error={error.author}
            onChange={(e) => {
              formData.current = { ...formData.current, author: e.target.value }
            }}
          />
          <p>Topic:</p>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="modalTopic"
            defaultValue={formData.current.topic}
            onChange={(e) => {
              formData.current = { ...formData.current, topic: e.target.value }
            }}
          >
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps</option>
          </select>
          <Button type="submit" color="primary" className="mt-5">
            {modalCreate ? 'Create' : 'Edit'}
          </Button>
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal
        open={modalDelete.open}
        title="Delete book"
        onClose={onCloseModalDelete}
      >
        <h1 className="self-center">{`Do you want to delete ${modalDelete.title}`}</h1>
        <div className="flex gap-5 self-center p-2">
          <Button color="none" onClick={onCloseModalDelete}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => onDelete(modalDelete.id)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default BookStore
