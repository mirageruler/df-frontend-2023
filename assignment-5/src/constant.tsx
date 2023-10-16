import { createUniqueId } from './utils'

export const books = [
  {
    title: 'Book 1',
    author: 'Author 1',
    topic: 'Topic 1',
    id: createUniqueId(),
  },
  {
    title: 'Book 2',
    author: 'Author 2',
    topic: 'Topic 2',
    id: createUniqueId(),
  },
  {
    title: 'Book 3',
    author: 'Author 3',
    topic: 'Topic 3',
    id: createUniqueId(),
  },
  {
    title: 'Book 4',
    author: 'Author 3',
    topic: 'Topic 4',
    id: createUniqueId(),
  },
  {
    title: 'Book 5',
    author: 'Author 3',
    topic: 'Topic 5',
    id: createUniqueId(),
  },
  {
    title: 'Book 6',
    author: 'Author 3',
    topic: 'Topic 6',
    id: createUniqueId(),
  },
  {
    title: 'Book 7',
    author: 'Author 3',
    topic: 'Topic 7',
    id: createUniqueId(),
  },
  {
    title: 'Book 8',
    author: 'Author 3',
    topic: 'Topic 8',
    id: createUniqueId(),
  },
  {
    title: 'Book 9',
    author: 'Author 3',
    topic: 'Topic 9',
    id: createUniqueId(),
  },
]

export const pageSize = 5

export const defaultForm = {
  id: '',
  title: '',
  author: '',
  topic: 'Programming',
}
