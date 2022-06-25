import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ReactTooltip from 'react-tooltip'

import 'react-toastify/dist/ReactToastify.min.css'

import ErrorBoundary from '../components/ErrorBoundary'
import PageNotFound from './PageNotFound'
import StartPage from './Start'

function AppWrapper({ children }: { children: ReactNode }) {
  return <div className="flex flex-col justify-between w-screen min-h-screen bg-white text-black">{children}</div>
}

function App() {
  return (
    <ErrorBoundary>
      <AppWrapper>
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta name="description" content="ETHNYC KYC" />
          <title>ETHNYC KYC</title>
          <link rel="canonical" href="https://ethglobal.com" />
        </Helmet>
        {/* <Header /> */}
        <div className="mb-auto">
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/">
              <Route index element={<StartPage />} />
            </Route>
          </Routes>
        </div>
        {/* <Footer /> */}
      </AppWrapper>
      <ReactTooltip />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </ErrorBoundary>
  )
}

export default App
