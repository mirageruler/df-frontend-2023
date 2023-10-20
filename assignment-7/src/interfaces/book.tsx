import { ITopic } from './topic'

export interface IBook {
  id: number
  name: string
  author: string
  topic: ITopic
}

export interface IBooks extends Array<IBook> {}
