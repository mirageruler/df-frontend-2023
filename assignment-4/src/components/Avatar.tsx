'use client'

import Image from 'next/image'
import React from 'react'

interface Props {
  name: string
  src: string
}

const Avatar: React.FC<Props> = (props) => {
  const { name = '', src = '' } = props

  return (
    <div className="flex items-center space-x-4">
      <Image
        className="w-10 h-10 rounded-full"
        src={src}
        alt=""
        width={40}
        height={40}
      />
      <div className="font-medium dark:text-white">{name}</div>
    </div>
  )
}

export default Avatar
