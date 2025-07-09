import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ItemPage from './pages/ItemPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, //CHANGE THIS TO HOME PAGE
  },
  {
    path: '/item',
    element: <ItemPage />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
