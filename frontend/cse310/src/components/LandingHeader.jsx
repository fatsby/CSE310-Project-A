import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from "@mantine/hooks";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";


export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  const [loginOpened, { open: openLogin, close: closeLogin }] = useDisclosure(false);
  const [registerOpened, { open: openRegister, close: closeRegister }] = useDisclosure(false);

  const switchToLogin = () => {
    closeRegister();
    openLogin();
  };

  const switchToRegister = () => {
    closeLogin();
    openRegister();
  };

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
      <nav
        className={`fixed top-0 z-50 w-full flex items-center transition-colors duration-300 h-[92px] justify-between drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] ${isScrolled ? "bg-white" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl w-full mx-auto px-18 flex items-center justify-between">
          {/* Logo with yellow mark */}
          <div className="flex items-center gap-1 text-2xl font-bold">
            <Link to="/">
              <img
                src="src\assets\logo.png"
                alt="Logo"
                className="max-w-[80px] min-w-[80px] cursor-pointer"
              />
            </Link>
          </div>
          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Button variant="transparent" color="#364153" size="md" onClick={openLogin}>
              Login
            </Button>
            <Button
              onClick={openRegister}
              radius="lg"
              color="#155dfc"
              size="md"
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* REGISTER MODAL */}
      <Modal opened={registerOpened} onClose={closeRegister}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="xl"
        styles={{
          close: {
            position: "relative",
            marginRight: '15px',
          },
          header: {
            // borderBottom: "1px solid #CECFD2",
            paddingTop: '30px',
          },
          title: {
            fontSize: "30px",
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)"
          },
        }}
        title="Sign Up"
      >
          <RegisterPage onSwitchToLogin={switchToLogin}/>
      </Modal>

      {/* LOGIN MODAL */}
      <Modal opened={loginOpened} onClose={closeLogin}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="xl"
        styles={{
          close: {
            position: "relative",
            marginRight: '15px',
          },
          header: {
            // borderBottom: "1px solid #CECFD2",
            paddingTop: '30px',
          },
          title: {
            fontSize: "30px",
            fontWeight: "bold",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)"
          },
        }}
        title="Log In"
      >
          <LoginPage onSwitchToRegister={switchToRegister}/>
      </Modal>
    </header>
  );
}
