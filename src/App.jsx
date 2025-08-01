import './App.css'
import { TechnicianProfilePage } from './pages/TechnicianProfilePage';
import { useState } from 'react';
import { CallToAction } from "./sections/CallToAction";
import { Features } from './sections/Features';
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { LogoTicker } from "./sections/LogoTicker";
import { Pricing } from "./sections/Pricing";
import { ProductShowcase } from "./sections/ProductShowcase";
import { Testimonials } from "./sections/Testimonials";
import { Integrations } from "./sections/Integrations"
import { Faqs } from './sections/Faqs';
import { LoginModal } from "./components/LoginModal";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import { About } from './pages/About';

function Landing() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleGetStartedClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className='antialiased bg-[#EAEEFE]'>
            <Header onGetStartedClick={handleGetStartedClick} />
            <Hero onGetStartedClick={handleGetStartedClick} />
            <LogoTicker />
            <ProductShowcase />
            <Pricing />
            <Testimonials />
            <CallToAction onGetStartedClick={handleGetStartedClick} />
            <Footer />
            <Features />
            <Integrations />
            <Faqs />
            <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
        </div>
    )
}


function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/ticket' element={<TicketForm />} />
                <Route path="/technician/:id" element={<TechnicianProfilePage />} />
                <Route path='/about' element={<About />} />
            </Routes>
        </BrowserRouter>
    )

}

export default App
