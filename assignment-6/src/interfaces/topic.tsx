export interface ITopic {
  id: number
  name: string
  code: string
}

export interface ITopics extends Array<ITopic> {}
