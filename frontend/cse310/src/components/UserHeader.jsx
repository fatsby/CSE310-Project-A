import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function UserHeader() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and scrolled more than 50px
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header>
      <nav
        className={`fixed top-0 z-50 w-full flex items-center justify-between h-[92px] transition-transform duration-300 bg-[#F6F8FA] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-18 flex items-center justify-between">
          {/* Logo with yellow mark */}
          <div className="flex items-center gap-4 text-2xl font-bold">
            <img
              src="src\assets\logo.png"
              alt=""
              className="max-w-[80px] min-w-[80px] cursor-pointer"
            />
            <Link
              to="/upload"
              className="text-base text-black hover:underline font-medium rounded-ful  px-4 py-2 cursor-pointer"
            >
              Upload
            </Link>
          </div>
          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Link to="/userinfo">
              <div className="w-[43px] h-[43px] bg-black rounded-full"></div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
