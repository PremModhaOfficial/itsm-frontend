import './App.css'


import { CallToAction } from "./sections/CallToAction";
import { Faqs } from './sections/Faqs';
import { Features } from './sections/Features';
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Integrations } from "./sections/Integrations"
import { LogoTicker } from "./sections/LogoTicker";
import { ProductShowcase } from "./sections/ProductShowcase";
import { Testimonials } from "./sections/Testimonials";

function App() {

  return (
    <div className='antialiased bg-[#EAEEFE]'>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Testimonials />
      <Features />
      <Integrations />
      <Faqs />
      <CallToAction />
      <Footer />
    </div>
  )
}


export default App
