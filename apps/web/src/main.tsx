import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18nContext.tsx'
import { SharedScheduleView } from './components/SharedScheduleView'
import { AdminLayout } from './components/AdminLayout'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminLogin } from './components/AdminLogin'

import { AdminUniversities } from './components/AdminUniversities'
import { AdminSchedules } from './components/AdminSchedules'
import { AdminSettings } from './components/AdminSettings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/s/:slug" element={<SharedScheduleView />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="universities" element={<AdminUniversities />} />
            <Route path="schedules" element={<AdminSchedules />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
)
