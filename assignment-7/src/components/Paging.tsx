'use client'

import React, { useEffect, useState } from 'react'
import { pageSize } from 'src/constant'
import { Book } from '../_generated/model/book'
import Button from './Button'

interface Props {
  data: Book[]
  currentPage: number
  onChangePage: (number) => void
}

const Paging: React.FC<Props> = (props) => {
  const { data = [], currentPage = 0, onChangePage } = props

  const [currentPageState, setCurrentPageState] = useState(currentPage)

  const totalPage = Math.ceil((data?.length || 0) / pageSize)

  const handleChangePage = (page: number) => {
    setCurrentPageState(page)
    onChangePage?.(page)
  }

  useEffect(() => {
    setCurrentPageState(currentPage)
  }, [currentPage])

  return (
    <div className="flex justify-end gap-2 p-5">
      {Array(totalPage)
        .fill(0)
        .map((_, idx) => {
          const page = idx + 1
          return (
            <Button
              key={page}
              color={page === currentPageState ? 'primary' : 'secondary'}
              onClick={() => handleChangePage?.(page)}
            >
              {page}
            </Button>
          )
        })}
    </div>
  )
}

export default Paging
