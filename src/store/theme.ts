import { Action, action } from 'easy-peasy'
import { Themes } from '../utils/constants'


export interface SettingsStoreModel {
  theme: string
  setTheme: Action<SettingsStoreModel, string>
}

export const SettingsStore: SettingsStoreModel = {
  theme: Themes.SYSTEM,
  setTheme: action((state, payload) => { state.theme = payload }),
}