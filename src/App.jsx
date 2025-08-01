import './App.css'
import { CallToAction } from "./sections/CallToAction";
import {Features} from './sections/Features';
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { LogoTicker } from "./sections/LogoTicker";
import { Pricing } from "./sections/Pricing";
import { ProductShowcase } from "./sections/ProductShowcase";
import { Testimonials } from "./sections/Testimonials";
import {Integrations} from "./sections/Integrations"
import {Faqs} from './sections/Faqs';
import { Analytics } from "./sections/Analytics";
import { Gamification } from "./sections/Gamification";
// import { TechAutomation } from "./pages/TechAutomation";

function App() {

  return (
    <div className='antialiased bg-[#EAEEFE]'>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Analytics />
      <Gamification />
      <Testimonials />
      <Features />
      <Integrations/>
      <Faqs />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default App
