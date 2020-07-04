import React from 'react'
import { StoreProvider } from 'easy-peasy'
import { PersistGate } from 'redux-persist/integration/react'
import Routes from './routes'
import createStore from './store'

const appStore = createStore()
export const { store } = appStore
const { persistor } = appStore

function App() {
  return (
    <StoreProvider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <Routes />
      </PersistGate>
    </StoreProvider>
  )
}

export default App