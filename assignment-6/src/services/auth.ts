import axios, { AxiosResponse } from 'axios'
import { API_URL } from 'src/constant'

const setSession = (accessToken: string): void => {
  // Check if localStorage is available
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('accessToken', accessToken)
  }
}

const clearSession = (): void => {
  // Check if localStorage is available
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('accessToken')
  }
}

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ data: { accessToken: string } }> =
      await axios.post(`${API_URL}/auth/login`, { email, password })

    const { accessToken } = response.data?.data || response.data

    setSession(accessToken)

    return true
  } catch (error) {
    alert(error?.message)
    return false
  }
}

const logout = (): void => {
  clearSession()
}

export { login, logout }
