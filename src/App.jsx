import './App.css'
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TechnicianProfilePage } from './pages/TechnicianProfilePage';
import { TechnicianPerformancePage } from './pages/TechnicianPerformancePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/technician/:id" element={<TechnicianProfilePage />} />
      <Route path="/technician/:id/performance" element={<TechnicianPerformancePage />} />
    </Routes>
  )
}

export default App
