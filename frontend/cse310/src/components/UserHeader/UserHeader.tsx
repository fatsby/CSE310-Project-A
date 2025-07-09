import React from "react";
import { Link } from "react-router-dom";

export default function UserHeader() {
  return (
    <header>
      <nav className="w-full flex justify-between items-center px-20 py-4 bg-[#F6F8FA] h-[102px] drop-shadow-[0_4px_20px_rgba(22,34,55,0.25)]">
        {/* Logo with yellow mark */}
        <div className="flex items-center gap-4 text-2xl font-bold">
          <img
            src="./img/logo.png"
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
      </nav>
    </header>
  );
}
