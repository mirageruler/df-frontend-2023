/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const fetcher = async <T>(
  url: string,
  method: string = 'GET',
  data?: any,
): Promise<T> => {
  const accessToken: string | null = localStorage.getItem('accessToken')

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await axios.request({
    url,
    method,
    data,
    ...config,
  })

  return response.data.data
}

export default fetcher
