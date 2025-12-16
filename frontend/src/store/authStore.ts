import { create } from 'zustand'
import type { LoginResponse } from '../api/client'

type AuthState = {
  token?: string
  user?: LoginResponse['user']
  login: (payload: LoginResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: undefined,
  user: undefined,
  login: (payload) => set({ token: payload.token, user: payload.user }),
  logout: () => set({ token: undefined, user: undefined }),
}))
