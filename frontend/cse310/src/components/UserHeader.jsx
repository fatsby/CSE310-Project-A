import React from "react";
import { Link } from "react-router-dom";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks"; // ✅ Add this
import Upload from "../pages/Upload";

export default function UserHeader() {
  // ✅ 1. Add this to manage modal state
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <header>
      <nav className="fixed top-0 z-50 w-full flex items-center justify-between h-[92px] transition-transform duration-300 bg-[#F6F8FA] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] ">
        <div className="max-w-7xl w-full mx-auto px-18 flex items-center justify-between">
          {/* Logo with yellow mark */}
          <div className="flex items-center gap-8 text-2xl font-bold">
            <img
              src="src/assets/logo.png"
              alt=""
              className="max-w-[80px] min-w-[80px] cursor-pointer"
            />

            {/* ✅ 2. Use button to open modal */}
            <button
              onClick={open}
              className="hover:underline rounded-full cursor-pointer"
            >
              <span className="text-base text-black font-medium px-4 py-2 ">
                Upload
              </span>
            </button>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Link to="/userinfo">
              <div className="w-[43px] h-[43px] bg-black rounded-full overflow-hidden">
                <img
                  src="src/assets/dog.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ✅ 3. Mantine Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Upload Files"
        size="auto"
        radius="20px"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          // Change the modal box background
          content: {
            backgroundColor: "#f9f9f9", // your custom bg
          },
          // Title text
          title: {
            fontSize: "24px",
            fontWeight: "500",
            color: "#333",
          },
          // Close (X) button
          close: {
            color: "#333",
            marginRight: "30px",
          },
          // Optional: header area if you want to style it
          header: {
            height: "100px",
            borderBottom: "1px solid #CECFD2",
            paddingLeft: "50px",
          },
        }}
      >
        <Upload /> {/* ✅ Pass close if Upload needs it */}
      </Modal>
    </header>
  );
}
