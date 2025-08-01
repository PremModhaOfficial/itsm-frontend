import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import { About } from './pages/About';
import { TechnicianProfilePage } from './pages/TechnicianProfilePage.jsx';
import { TechnicianPerformancePage } from './pages/TechnicianPerformancePage.jsx';

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
