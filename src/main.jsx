import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import About from './pages/About/About.jsx'
import ErrorPage from './ErrorPage.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import 'remixicon/fonts/remixicon.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </>,
)
