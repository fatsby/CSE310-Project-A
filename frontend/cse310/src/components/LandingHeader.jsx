import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";

// ===========================
// Assets
// ===========================
import LogoIMG from "../assets/LogoBanner_Trans.png";

// ===========================
// Component: LandingHeader
// ===========================
export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Modal state
  const [loginOpened, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [registerOpened, { open: openRegister, close: closeRegister }] =
    useDisclosure(false);

  // Switch from register modal to login modal
  const switchToLogin = () => {
    closeRegister();
    openLogin();
  };

  // Switch from login modal to register modal
  const switchToRegister = () => {
    closeLogin();
    openRegister();
  };

  // Effect for scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 z-50 w-full flex items-center transition-colors duration-300 h-[92px] justify-between drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] ${
          isScrolled ? "bg-white" : "bg-transparent"
        }`}
      >
        {/* Navigation Container */}
        <div className="container w-full mx-auto px-18 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-1 text-2xl font-bold">
            <Link to="/">
              <img
                src={LogoIMG}
                alt="Logo"
                className="max-w-[160px] min-w-[160px] cursor-pointer"
              />
            </Link>
          </div>

          {/* Authentication Buttons */}
          <div className="flex items-center gap-4">
            {/* Login Button */}
            <Button
              variant="transparent"
              color="#364153"
              size="md"
              onClick={openLogin}
              style={{ fontWeight: 400 }}
            >
              Login
            </Button>

            {/* Register Button */}
            <Button
              onClick={openRegister}
              radius="lg"
              color="#155dfc"
              size="md"
              style={{
                fontWeight: 400,
                backgroundColor: "#4192fd",
              }}
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* ====================== */}
      {/* Register Modal Window */}
      {/* ====================== */}
      <Modal
        opened={registerOpened}
        onClose={closeRegister}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="xl"
        styles={{
          close: {
            position: "relative",
            marginRight: "15px",
          },
          header: {
            paddingTop: "30px",
          },
          title: {
            fontSize: "30px",
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          },
        }}
        title="Sign Up"
      >
        {/* Register Switch to login option */}
        <RegisterPage onSwitchToLogin={switchToLogin} />
      </Modal>

      {/* ================== */}
      {/* Login Modal Window */}
      {/* ================== */}
      <Modal
        opened={loginOpened}
        onClose={closeLogin}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="xl"
        styles={{
          close: {
            position: "relative",
            marginRight: "15px",
          },
          header: {
            paddingTop: "30px",
          },
          title: {
            fontSize: "30px",
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          },
        }}
        title="Log In"
      >
        {/* Login Switch to register option */}
        <LoginPage onSwitchToRegister={switchToRegister} />
      </Modal>
    </header>
  );
}
