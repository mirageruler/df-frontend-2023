export interface IBook {
  id: string
  title: string
  author: string
  topic: string
}

export interface IBooks extends Array<IBook> {}
