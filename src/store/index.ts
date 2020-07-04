import { createStore, createTypedHooks } from 'easy-peasy'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
// import { AsyncStorage } from 'react-native'
import { AuthStoreModel, AuthStore } from './auth'
import { WalletStoreModel, WalletStore } from './wallets'
import { ExpenseStoreModel, ExpenseStore } from './expenses'
import { SettingsStoreModel, SettingsStore } from './theme'

interface RootStoreModel {
  Auth: AuthStoreModel
  Wallet: WalletStoreModel
  Expense: ExpenseStoreModel
  Settings: SettingsStoreModel
}
const RootStore: RootStoreModel = {
  Auth: AuthStore,
  Wallet: WalletStore,
  Expense: ExpenseStore,
  Settings: SettingsStore
}
export const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<RootStoreModel>()

export default () => {
  const store = createStore(RootStore, {
    ...(__DEV__ ? {
      middleware: [
        require('rn-redux-middleware-flipper').default(),
        require('redux-flipper').default(),
      ]
    } : {}),
    reducerEnhancer: reducer => persistReducer({
      key: 'root',
      storage: AsyncStorage,
    }, reducer)
  })
  const persistor = persistStore(store)
  return { store, persistor }
}
