import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './style/index.css'

import App from './pages/App'
import { persistor, store } from './states'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
