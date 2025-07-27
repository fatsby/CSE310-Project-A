import React from "react";
import { Link } from "react-router-dom";
import { Modal, ScrollArea, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Upload from "../pages/Upload";
import useUserStore from "../stores/userStore";

// Lucide Logo Imports
import { User, LogOut, Wallet, Archive } from "lucide-react";

// Images
import LogoIMG from "../assets/logo.png";
import avatarIMG from "../assets/dog.jpg";

export default function UserHeader() {
  // Modal state
  const [opened, { open, close }] = useDisclosure(false);

  // Zustand selectors
  const userData = useUserStore((state) => state.userData);
  const userName = useUserStore((state) => state.getUserName());
  const balance = useUserStore((state) => state.getBalance());
  const profilePicture = useUserStore((state) => state.getProfilePicture());

  const CustomScrollArea = (props) => (
    <ScrollArea.Autosize type="never" {...props} />
  );

  return (
    <header>
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between h-[92px] transition-transform duration-300 bg-[#F6F8FA] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)]">
        <div className="container w-full mx-auto px-18 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-8 text-2xl font-bold">
            <Link to="/">
              <img
                src={LogoIMG}
                alt="logo"
                className="max-w-[80px] min-w-[80px] cursor-pointer"
              />
            </Link>
            <button
              onClick={open}
              className="hover:underline rounded-full cursor-pointer"
            >
              <span className="text-base text-black font-medium px-4 py-2">
                Upload
              </span>
            </button>
          </div>

          {/* Right: User section */}
          <div className="flex items-center gap-4">
            {/* Balance */}
            <div className={`flex items-center gap-2 text-sm font-medium transition-opacity duration-300 ${userData && balance > 0 ? 'opacity-100' : 'opacity-0'
              }`}>
              <Wallet size={16} />
              <span>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(balance)}
              </span>
            </div>

            <Menu trigger="click-hover" shadow="md" width={200} transitionProps={{ transition: 'fade-down', duration: 150 }}>
              <Menu.Target>
                <div className="w-[43px] h-[43px] bg-black rounded-full overflow-hidden">
                  <div className={`w-full h-full transition-all duration-300 ${userData ? 'opacity-100' : 'opacity-70'
                    }`}>
                    <img
                      src={profilePicture || avatarIMG}
                      alt="user-avatar"
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>
                </div>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  {userData ? userName : "Loading...."}
                </Menu.Label>
                <Menu.Item leftSection={<User size={16} />}>
                  Your profile
                </Menu.Item>
                <Menu.Item component={Link} to="/purchased" leftSection={<Archive size={16} />}>
                  Your Purchased
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<LogOut size={16} />}
                  onClick={() => useUserStore.getState().clearUser()}
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
        size="50%"
        radius="20px"
        scrollAreaComponent={CustomScrollArea}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: { backgroundColor: "#f9f9f9", height: "600px" },
          title: { fontSize: "24px", fontWeight: "500", color: "#333" },
          close: { color: "#333", marginRight: "30px" },
          header: { height: "100px", borderBottom: "1px solid #CECFD2", paddingLeft: "50px" },
        }}
      >
        <Upload onCloseUpload={close} />
      </Modal>
    </header>
  );
}
