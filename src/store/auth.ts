import { Action, action } from 'easy-peasy'

type User = {
  email: string
  name: string
  id: string
}

export interface AuthStoreModel {
  user: User | null | undefined
  authenticating: boolean
  setUser: Action<AuthStoreModel, User | null>
  setAuthenticating: Action<AuthStoreModel, boolean>
}

export const AuthStore: AuthStoreModel = {
  user: null,
  authenticating: false,
  setUser: action((state, payload) => { state.user = payload }),
  setAuthenticating: action((state, payload) => { state.authenticating = payload })
}