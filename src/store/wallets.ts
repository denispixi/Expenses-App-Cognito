import { Action, action } from 'easy-peasy'

export type Wallet = {
  _id: string
  funds: number
  name: string
  color: string
  walletType: string
}

export interface WalletStoreModel {
  wallets: Wallet[]
  cacheLimit: Date | null
  setWallets: Action<WalletStoreModel, Wallet[]>
  setwallet: Action<WalletStoreModel, Wallet>
  addWallet: Action<WalletStoreModel, Wallet>
  reset: Action<WalletStoreModel>
}


export const WalletStore: WalletStoreModel = {
  wallets: [],
  cacheLimit: null,
  setWallets: action((state, wallets) => {
    state.wallets = wallets
    const cacheLimit = new Date()
    cacheLimit.setHours(cacheLimit.getHours() + 1)
    state.cacheLimit = cacheLimit
  }),
  addWallet: action((state, wallet) => {
    state.wallets = [...state.wallets, wallet]
  }),
  setwallet: action((state, wallet) => {
    const indexToChange = state.wallets.findIndex(w => w._id === wallet._id)
    if (indexToChange >= 0) {
      state.wallets[indexToChange] = wallet
    }
  }),
  reset: action(state => {
    state.cacheLimit = null
    state.wallets = []
  })
}