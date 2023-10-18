'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Modal, Paging } from 'src/components'
import { API_URL, defaultForm, pageSize } from 'src/constant'
import { IBook, IBooks, ITopic, ITopics } from 'src/interfaces'
import fetcher from 'src/services/fetcher'
import { validateBookForm } from 'src/utils'
import useSWR from 'swr'

const BookStore = () => {
  const { data: books, mutate } = useSWR<IBooks>(`${API_URL}/books`, fetcher)
  const { data: topics } = useSWR<ITopics>(`${API_URL}/topics`, fetcher)

  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState({
    open: false,
    name: '',
    id: 0,
  })
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [dataState, setDataState] = useState<IBooks>(books || [])
  const [errorState, setErrorState] = useState({
    name: '',
    author: '',
    topic: '',
  })

  const formData = useRef({ ...defaultForm })

  useEffect(() => {
    setDataState(books || [])
  }, [books])

  const dataFilter = dataState.filter((book: IBook) =>
    String(book.name).toLowerCase().startsWith(search.toLowerCase()),
  )
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const dataRender = dataFilter.slice(startIndex, endIndex)

  const resetForm = () => {
    formData.current = { ...defaultForm }
    setErrorState({ name: '', author: '', topic: '' })
  }

  const handleOpenModalCreate = () => {
    setModalCreate(true)
  }

  const handleOpenModalEdit = (data) => {
    formData.current.id = data?.id
    formData.current.name = data?.name
    formData.current.author = data?.author
    formData.current.topicId = data?.topic?.id
    setModalEdit(true)
  }

  const handleOpenModalDelete = (data: IBook) => {
    setModalDelete({ open: true, name: data?.name, id: data?.id })
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
  const handleSubmit = async (event) => {
    event.preventDefault()

    const { name, author, topicId } = formData.current
    const newBook = { author, name, topicId }

    // validate
    const validateErrors = validateBookForm(
      name,
      author,
      topics?.find((topic) => topic.id === topicId),
    )
    setErrorState(validateErrors)
    if (
      validateErrors?.name ||
      validateErrors?.author ||
      validateErrors?.topic
    ) {
      return
    }
    try {
      // Make the POST request
      await fetcher(`${API_URL}/books`, 'POST', JSON.stringify(newBook))
      mutate()
    } catch (error) {
      // Handle the error
    }

    return modalEdit ? onCloseModalEdit() : onCloseModalCreate()
  }

  const onDelete = async (id) => {
    try {
      // Make the POST request
      await fetcher(`${API_URL}/books/${id}`, 'DELETE')
      mutate()
    } catch (error) {
      // Handle the error
    }
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
                Name
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
                  <td className="px-6 py-4">{data.name}</td>
                  <td className="px-6 py-4">{data.author}</td>
                  <td className="px-6 py-4">{data.topic.name}</td>
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
        data={dataState}
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
            defaultValue={formData.current.name}
            error={errorState.name}
            onChange={(e) => {
              formData.current = { ...formData.current, name: e.target.value }
            }}
          />
          <Input
            label="Author:"
            type="text"
            id="modalAuthor"
            placeholder="Enter author..."
            defaultValue={formData.current.author}
            error={errorState.author}
            onChange={(e) => {
              formData.current = { ...formData.current, author: e.target.value }
            }}
          />
          <p>Topic:</p>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="modalTopic"
            defaultValue={formData.current.topicId}
            onChange={(e) => {
              formData.current = {
                ...formData.current,
                topicId: Number(e.target.value),
              }
            }}
          >
            {topics?.map((topic: ITopic, idx) => {
              return (
                <option key={idx} value={topic?.id}>
                  {topic?.name}
                </option>
              )
            })}
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
        <h1 className="self-center">{`Do you want to delete ${modalDelete.name}`}</h1>
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
