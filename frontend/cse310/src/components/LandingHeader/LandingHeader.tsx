import React from "react";
import { Link } from "react-router-dom";

export default function LandingHeader() {
  return (
    <header>
      <nav className="w-full flex justify-between items-center px-20 py-4 bg-[#EEF2F7] h-[102px]">
        {/* Logo with yellow mark */}
        <div className="flex items-center gap-1 text-2xl font-bold">
          <img
            src="./img/logo.png"
            alt=""
            className="max-w-[80px] min-w-[80px] cursor-pointer"
          />
        </div>
        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-base text-gray-700 hover:underline font-medium rounded-full border-white border-1  px-4 py-2 cursor-pointer"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-base px-4 py-2 bg-[#4192FD] text-white rounded-full hover:bg-blue-700 transition font-medium cursor-pointer"
          >
            Sign up for free
          </Link>
        </div>
      </nav>
    </header>
  );
}
