import './App.css'

import { useState } from 'react';

import { CallToAction } from "./sections/CallToAction";
import { Features } from './sections/Features';
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Integrations } from "./sections/Integrations"
import { LogoTicker } from "./sections/LogoTicker";
import { ProductShowcase } from "./sections/ProductShowcase";
import { Testimonials } from "./sections/Testimonials";
import { Faqs } from './sections/Faqs';
import { LoginModal } from "./components/LoginModal";
import { Analytics } from './sections/Analytics';

function App() {
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
            <Analytics />
            <Testimonials />
            <Features />
            <Integrations />
            <Faqs />
            <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
            <CallToAction onGetStartedClick={handleGetStartedClick} />
            <Footer />
        </div>
    )
}


export default App
