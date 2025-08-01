import './index.css'
import App from './App.jsx'
import TicketForm from './components/TicketForm';
import { About } from './pages/About';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import { TechnicianPerformancePage } from './pages/TechnicianPerformancePage.jsx';
import { TechnicianProfilePage } from './pages/TechnicianProfilePage.jsx';
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/ticket' element={<TicketForm />} />
                <Route path="/technician/:id" element={<TechnicianProfilePage />} />
                <Route path="/technician/:id/performance" element={<TechnicianPerformancePage />} />
                <Route path='/about' element={<About />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
