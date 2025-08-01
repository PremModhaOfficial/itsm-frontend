import React from "react";
import { motion } from "framer-motion";

// Replace with your actual relative paths
import acmeLogo from "../assets/logo-acme.png";
import quantumLogo from "../assets/logo-quantum.png";
import echoLogo from "../assets/logo-echo.png";
import celestialLogo from "../assets/logo-celestial.png";
import pulseLogo from "../assets/logo-pulse.png";
import apexLogo from "../assets/logo-apex.png";

export const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12 bg-white justify-items-center">
      <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-14 flex-none pr-14"
            animate={{
              translateX: "-50%",
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {[acmeLogo, quantumLogo, echoLogo, celestialLogo, pulseLogo, apexLogo]
              .concat([acmeLogo, quantumLogo, echoLogo, celestialLogo, pulseLogo, apexLogo]) // second set
              .map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt={`Logo ${index}`}
                  className="logo-ticker-image"
                />
              ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
