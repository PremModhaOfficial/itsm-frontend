import './App.css'
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TechnicianProfilePage } from './pages/TechnicianProfilePage';

function App() {
  return (
    <div className='antialiased bg-[#EAEEFE]'>
      <Header onGetStartedClick={handleGetStartedClick} />
      <Hero onGetStartedClick={handleGetStartedClick} />
      <LogoTicker />
      <ProductShowcase />
      <Analytics />
      <Gamification />
      <Testimonials />
      <CallToAction onGetStartedClick={handleGetStartedClick} />
      <Footer />
      <Features />
      <Integrations/>
      <Faqs />
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </div>
  )
}

export default App
