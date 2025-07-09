import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ItemPage from './pages/ItemPage.jsx'

import { MantineProvider } from '@mantine/core';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, //CHANGE THIS TO HOME PAGE
  },
  {
    path: '/item/:id',
    element: <ItemPage />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)
