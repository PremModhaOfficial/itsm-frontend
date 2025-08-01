import './App.css'
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TechnicianProfilePage } from './pages/TechnicianProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/technician/:id" element={<TechnicianProfilePage />} />
    </Routes>
  )
}

export default App
