/* eslint-disable @typescript-eslint/ban-ts-comment */
// custom-instance.ts

import { isSSR } from '@dwarvesf/react-utils'
import Axios, { AxiosRequestConfig } from 'axios'
import { API_URL } from 'src/constant'

console.log('API_URL:', API_URL)
export const AXIOS_INSTANCE = Axios.create({ baseURL: API_URL }) // use your own URL here or environment variable

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()
  const token = isSSR() ? undefined : localStorage.getItem('accessToken')
  if (token) {
    console.log('has Token! ')
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data)

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}
