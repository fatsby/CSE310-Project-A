import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 30); // adjust 50 to whatever offset you want
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`fixed top-0 z-50 w-full flex items-center transition-colors duration-300 h-[92px] justify-between drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] ${
          isScrolled ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-18 flex items-center justify-between">
          {/* Logo with yellow mark */}
          <div className="flex items-center gap-1 text-2xl font-bold">
            <img
              src="src\assets\logo.png"
              alt="Logo"
              className="max-w-[80px] min-w-[80px] cursor-pointer"
            />
          </div>
          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-base text-gray-700 hover:underline font-medium rounded-full px-4 py-2 cursor-pointer"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-base px-4 py-2 bg-[#4192fd] text-white rounded-[10px] hover:bg-blue-600 transition font-medium cursor-pointer"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
