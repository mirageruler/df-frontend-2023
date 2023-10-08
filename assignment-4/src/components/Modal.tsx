import React, { useEffect, useState } from 'react'

const Modal = (props) => {
  const { title = '', children, open = false, onClose } = props

  const [openState, setOpenState] = useState(open)

  const onCloseModal = () => {
    setOpenState(false)
    onClose?.()
  }

  useEffect(() => {
    if (open) {
      setOpenState(open)
    } else {
      onCloseModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    openState && (
      <div className="absolute w-full h-full top-0 flex justify-center">
        <div className="flex self-center w-4/12 h-fit flex-col shadow-md rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex justify-between">
            <h1>{title}</h1>
            <button className="close" onClick={onCloseModal}>
              &times;
            </button>
          </div>
          <div className="flex flex-col w-full">{children}</div>
        </div>
      </div>
    )
  )
}

export default Modal
