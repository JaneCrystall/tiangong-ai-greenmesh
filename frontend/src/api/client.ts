import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type LoginResponse = {
  token: string
  user: {
    username: string
    role: string
  }
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', { username, password })
  return data
}
