import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logosaas.png";

export const About = () => {
  return (
    <div className="antialiased bg-[#EAEEFE] min-h-screen">
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-sm z-20">
        <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
          <p className="text-white/60 hidden md:block">
            Streamline your workflow and boost your productivity
          </p>
          <div className="inline-flex gap-1 items-center">
            <p>Get started for free</p>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="py-5 justify-items-center">
          <div className="container">
            <div className="flex items-center justify-between">
              <Link to="/">
                <img src={logo} alt="Saas Logo" height={40} width={40} />
              </Link>
              <nav className="hidden md:flex gap-6 text-black/60 items-center">
                <Link to="/about" className="text-black font-medium">About</Link>
                <Link to="/" className="hover:text-black transition-colors">Features</Link>
                <Link to="/" className="hover:text-black transition-colors">Customers</Link>
                <Link to="/" className="hover:text-black transition-colors">Updates</Link>
                <Link to="/" className="hover:text-black transition-colors">Help</Link>
                <Link to="/" className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight hover:bg-[#001e80] transition-colors">
                  Get Started
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              About <span className="text-blue-600">Our Mission</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of IT Service Management, making it easier for teams to collaborate, 
              track issues, and deliver exceptional service to their customers.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To revolutionize how organizations manage their IT services by providing intuitive, 
                powerful tools that streamline workflows and enhance productivity. We believe that 
                great software should be both powerful and easy to use.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-black mb-4">Key Values</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Innovation at every step</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Customer-centric design</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Reliability and security</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Continuous improvement</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">JD</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">John Doe</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">JS</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Jane Smith</h3>
                <p className="text-gray-600">CTO</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">MJ</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Mike Johnson</h3>
                <p className="text-gray-600">Head of Product</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">50M+</div>
                <p className="text-gray-600">Tickets Resolved</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                <p className="text-gray-600">Uptime</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <p className="text-gray-600">Support</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who are already using our platform to streamline their IT service management.
            </p>
            <Link 
              to="/"
              className="bg-black text-white px-8 py-4 rounded-lg font-medium inline-flex align-items justify-center tracking-tight hover:bg-[#001e80] transition-colors text-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center justify-items-center">
        <div className="container">
          <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#f87bff,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
            <Link to="/">
              <img src={logo} height={40} alt="SaaS logo" className="relative" />
            </Link>
          </div>

          <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
            <Link to="/about" className="text-white">About</Link>
            <Link to="/" className="hover:text-white transition-colors">Features</Link>
            <Link to="/" className="hover:text-white transition-colors">Customers</Link>
            <Link to="/" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/" className="hover:text-white transition-colors">Help</Link>
            <Link to="/" className="hover:text-white transition-colors">Careers</Link>
          </nav>

          <p className="mt-6">
            &copy; 2025 mind array private limited, All rights reserved.
            <br />
            <a
              className="hover:text-white transition-all"
              href="https://github.com/MiladJoodi/Light-Saas-Landing-Page"
              target="_blank"
              rel="noopener noreferrer"
            >
              Copied with ❤️ by Gunjan
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}; 