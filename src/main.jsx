import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import { About } from './pages/About';
import { TechnicianProfilePage } from './pages/TechnicianProfilePage.jsx';
import { TechnicianPerformancePage } from './pages/TechnicianPerformancePage.jsx';
import { Home } from './pages/Home.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import TicketDetailsPage from './components/TicketDetails.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/ticket' element={<TicketForm />} />
        <Route path='/ticket/:id' element={<TicketDetailsPage />} />
        <Route path="/technician/:id" element={<TechnicianProfilePage />} />
        <Route path="/technician/:id/performance" element={<TechnicianPerformancePage />} />
        <Route path='/about' element={<About />} />
        <Route path='/dashboard' element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
