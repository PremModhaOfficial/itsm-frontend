import React from "react";

// Replace with your actual relative paths
import logo from "../assets/logosaas.png";
import SocialX from "../assets/social-x.svg";
import SocialInsta from "../assets/social-insta.svg";
import SocialLinkedIn from "../assets/social-linkedin.svg";
import SocialPin from "../assets/social-pin.svg";
import SocialYoutube from "../assets/social-youtube.svg";

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center justify-items-center">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#f87bff,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <img src={logo} height={40} alt="Skill Intelligence Logo" className="relative" />
        </div>

        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="#">Solutions</a>
          <a href="#">Features</a>
          <a href="#">Integrations</a>
          <a href="#">Pricing</a>
          <a href="#">Support</a>
          <a href="#">Careers</a>
        </nav>

        <div className="flex justify-center gap-6 mt-6">
          <img src={SocialX} alt="Social X" />
          <img src={SocialInsta} alt="Instagram" />
          <img src={SocialLinkedIn} alt="LinkedIn" />
          <img src={SocialPin} alt="Pinterest" />
          <img src={SocialYoutube} alt="YouTube" />
        </div>

        <p className="mt-6">
          &copy; 2025 Skill Intelligence Platform, All rights reserved.
          <br />
          <a
            className="hover:text-white transition-all"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI-Powered ITSM Solutions
          </a>
        </p>
      </div>
    </footer>
  );
};
