import React from "react";
import { Link } from "react-router-dom";
import { Modal, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Upload from "../pages/Upload";

// ===========================
// Images
// ===========================
import LogoIMG from "../assets/logo.png";
import avatarIMG from "../assets/dog.jpg";

export default function UserHeader() {
  // ===========================
  // State to manage modal visibility
  // ===========================
  const [opened, { open, close }] = useDisclosure(false);
  const CustomScrollArea = (props) => (
    <ScrollArea.Autosize type="never" {...props} />
  );

  return (
    <header>
      {/* ===========================
          Navigation Bar (Fixed Top)
      =========================== */}
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between h-[92px] transition-transform duration-300 bg-[#F6F8FA] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] ">
        <div className="container w-full mx-auto px-18 flex items-center justify-between">
          {/* ========= Left: Logo + Upload Button ========= */}
          <div className="flex items-center gap-8 text-2xl font-bold">
            {/* Logo */}
            <Link to="/">
              <img
                src={LogoIMG}
                alt="logo"
                className="max-w-[80px] min-w-[80px] cursor-pointer"
              />
            </Link>

            {/* Upload Button - opens modal */}
            <button
              onClick={open}
              className="hover:underline rounded-full cursor-pointer"
            >
              <span className="text-base text-black font-medium px-4 py-2">
                Upload
              </span>
            </button>
          </div>

          {/* ========= Right: User Avatar ========= */}
          <div className="flex items-center gap-4">
            <Link to="/userinfo">
              <div className="w-[43px] h-[43px] bg-black rounded-full overflow-hidden">
                <img
                  src={avatarIMG}
                  alt="user-avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===========================
          Upload Modal using Mantine
      =========================== */}
      <Modal
        opened={opened}
        onClose={close}
        title="Upload Files"
        size="100%"
        radius="20px"
        scrollAreaComponent={CustomScrollArea}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            backgroundColor: "#f9f9f9",
            height: "600px",
          },
          title: {
            fontSize: "24px",
            fontWeight: "500",
            color: "#333",
          },
          close: {
            color: "#333",
            marginRight: "30px",
          },
          header: {
            height: "100px",
            borderBottom: "1px solid #CECFD2",
            paddingLeft: "50px",
          },
        }}
      >
        {/* Upload component inside modal */}
        <Upload onCloseUpload={close} />
      </Modal>
    </header>
  );
}
