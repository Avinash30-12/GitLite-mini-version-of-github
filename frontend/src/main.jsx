import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './authContext.jsx'
import { BrowserRouter as Routes } from 'react-router-dom'
import ProjectRoutes from './Routes.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Routes>
      <ProjectRoutes/>
    </Routes>
  </AuthProvider>,
)
