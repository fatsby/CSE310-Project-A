import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, ScrollArea, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Upload from "../pages/Upload";
import useUserStore from "../stores/userStore";
import { getCurrentUser } from "../data/SampleData"; // Import for simulated fetch

// Lucide Logo Imports
import { User, LogOut, Wallet, Archive, ShoppingCart } from "lucide-react";

// Images
import LogoIMG from "../assets/LogoBanner_Trans.png";
import avatarIMG from "../assets/dog.jpg";

export default function UserHeader() {
  // Modal state
  const [opened, { open, close }] = useDisclosure(false);

  // ZUSTAND SELECTORS
  const userData = useUserStore((state) => state.userData);
  const profilePicture = useUserStore((state) => state.getProfilePicture());
  const loadUser = useUserStore((state) => state.loadUser);
  const clearUser = useUserStore((state) => state.clearUser);

  // SENSITIVE user data that must be fetched
  const [sensitiveUserData, setSensitiveUserData] = useState(null);

  // Effect 1: load basic user data
  useEffect(() => {
    if (!userData) {
      loadUser();
    }
  }, [userData, loadUser]);

  // Effect 2: load sensitive user data
  useEffect(() => {
    if (userData) {
      // Checks if non-sensitive data exists
      // On backend implementation, replace this with secure API call:
      // const data = await fetch('/api/user/details');
      // For now, we simulate it by getting the full user object again.
      const fullUserData = getCurrentUser();
      setSensitiveUserData(fullUserData);
    } else {
      // If userData is null (user logged out), clear sensitive data too
      setSensitiveUserData(null);
    }
  }, [userData]); // This effect runs when the user logs in or out

  const CustomScrollArea = (props) => (
    <ScrollArea.Autosize type="never" {...props} />
  );

  return (
    <header>
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between transition-transform duration-300 bg-[#F6F8FA] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)]">
        <div className="container w-full mx-auto px-18 py-[17px] flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-8 text-2xl font-bold">
            <Link to="/">
              <img
                src={LogoIMG}
                alt="logo"
                className="max-w-[160px] min-w-[160px] cursor-pointer"
              />
            </Link>
            <div
              onClick={open}
              className="hover:text-[#68a8fd] hover:bg-[#ecf2fb] cursor-pointer h-[42px] flex items-center px-4 rounded-[4px]"
            >
              <span className="text-base font-medium">Upload</span>
            </div>
          </div>

          {/* Right: User section */}
          <div className="flex items-center gap-4">
            {/* Balance - reads from sensitiveUserData */}
            <div className="flex flex-row gap-10">
              <Link
                to="/cart"
                className="hover:text-[#68a8fd] hover:bg-[#ecf2fb] cursor-pointer flex items-center h-[42px] w-[42px] justify-center rounded-[4px]"
              >
                <ShoppingCart size={17} />
              </Link>
              <div
                className={`flex items-center gap-2 text-sm font-medium transition-opacity duration-300 hover:text-[#68a8fd] hover:bg-[#ecf2fb] px-4 rounded-[4px] ${
                  sensitiveUserData && sensitiveUserData.balance > 0
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <Wallet size={16} />
                <span>
                  {sensitiveUserData &&
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(sensitiveUserData.balance)}
                </span>
              </div>
            </div>

            <Menu
              trigger="click-hover"
              shadow="md"
              width={200}
              transitionProps={{ transition: "fade-down", duration: 150 }}
            >
              <Menu.Target>
                <div className="w-[43px] h-[43px] bg-black rounded-full overflow-hidden">
                  <div
                    className={`w-full h-full transition-all duration-300 ${
                      userData ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    <img
                      src={profilePicture || avatarIMG}
                      alt="user-avatar"
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                </div>
              </Menu.Target>

              <Menu.Dropdown>
                {/* Menu Label - Reads name from sensitiveUserData */}
                <Menu.Label>
                  {sensitiveUserData ? sensitiveUserData.name : "Loading..."}
                </Menu.Label>

                {/* Profile Link - Reads ID from sensitiveUserData */}
                <Menu.Item
                  component={Link}
                  to={`/profile/${sensitiveUserData?.id}`}
                  disabled={!sensitiveUserData}
                  leftSection={<User size={16} />}
                >
                  Your profile
                </Menu.Item>

                <Menu.Item
                  component={Link}
                  to="/purchased"
                  leftSection={<Archive size={16} />}
                >
                  Your purchased
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<LogOut size={16} />}
                  onClick={() => {
                    clearUser();
                    setSensitiveUserData(null); // Also clear local sensitive state
                  }}
                  component={Link}
                  to="/"
                >
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </nav>

      {/* Upload Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Upload Files"
        size="55vw"
        radius="20px"
        scrollAreaComponent={CustomScrollArea}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            backgroundColor: "#f9f9f9",
          },
          title: { fontSize: "24px", fontWeight: "500", color: "#333" },
          close: { color: "#333", marginRight: "30px" },
          header: {
            height: "100px",
            borderBottom: "1px solid #CECFD2",
            paddingLeft: "50px",
          },
        }}
      >
        <Upload onCloseUpload={close} />
      </Modal>
    </header>
  );
}
