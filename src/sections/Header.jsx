import React from "react";

// Importing images as URLs
import arrowRight from "../assets/arrow-right.svg";
import logo from "../assets/logosaas.png";
import menuIcon from "../assets/menu.svg";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Streamline your workflow and boost your productivity
        </p>
        <div className="inline-flex gap-1 items-center">
          <p>Get started for free</p>
          <img
            src={arrowRight}
            alt="Arrow right"
            className="h-4 w-4 inline-flex justify-center items-center"
          />
        </div>
      </div>

      <div className="py-5 justify-items-center">
        <div className="container">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Saas Logo" height={40} width={40} />
            <img src={menuIcon} alt="Menu" className="h-5 w-5 md:hidden" />

            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">Customers</a>
              <a href="#">Updates</a>
              <a href="#">Help</a>
              <button className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight">
                Get for free
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
