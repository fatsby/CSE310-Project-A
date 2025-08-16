import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

import { CheckIcon, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { X } from "lucide-react";

// ===========================
// Assets
// ===========================
import BLUE_UP_IMG from "../assets/Upload/blue_up.png";
import GGDOCS_IMG from "../assets/Upload/ggdoc.png";

export default function Upload({ onCloseUpload }) {
  // ===========================
  // Navigate
  // ===========================
  const navigate = useNavigate();

  // ===========================
  // State Management
  // ===========================
  const [files, setFiles] = useState([]);
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const checkIcon = <CheckIcon size={20} />;
  const CustomScrollArea = (props) => (
    <ScrollArea.Autosize type="never" {...props} />
  );

  // ===========================
  // Utility: Format file size
  // ===========================
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  }

  // ===========================
  // Handle file drop event
  // ===========================
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      console.log("File:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", formatBytes(file.size));
    });
  }, []);

  // ===========================
  // Configure dropzone behavior
  // ===========================
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    noClick: true,
  });

  // ===========================
  // Remove a single file
  // ===========================
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // ===========================
  // Component Rendering
  // ===========================
  return (
    <div className="relative w-full h-fit bg-[#f9f9f9] mx-auto">
      {/* === Dropzone Area === */}
      <div className="flex justify-center items-center">
        <div
          {...getRootProps()}
          className="w-full flex justify-center items-center rounded-[15px] "
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="w-full flex justify-center items-center rounded-[15px] p-10">
              <div
                className="relative w-full flex justify-center items-center text-center bg-[#f2f7fe] rounded-[15px] aspect-[12/7]"
                style={{ border: "2px dashed #b1d2ff" }}
              >
                <div className="flex flex-col items-center">
                  <img src={BLUE_UP_IMG} alt="Upload" className="w-[80px]" />
                  <p className="text-[15px] text-[#4e5966] font-bold">
                    Drag & Drop
                  </p>
                  <p className="text-[#a0a9b5] text-[11px]">
                    ( doc, pdf, pptx, zip )
                  </p>
                  <div className="text-transparent bg-transparent px-4 py-2 rounded-[10px] text-[13px] font-bold">
                    Select files
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center rounded-[15px] p-10">
              <div
                className="relative w-full flex justify-center items-center text-center rounded-[15px] aspect-[12/7]"
                style={{ border: "2px dashed #b1d2ff" }}
              >
                <div className="flex flex-col items-center">
                  <img src={BLUE_UP_IMG} alt="Upload" className="w-[80px]" />
                  <p className="text-[15px] text-[#4e5966] font-bold">
                    Drag & Drop
                  </p>
                  <p className="text-[#a0a9b5] text-[11px]">
                    ( doc, pdf, pptx, zip )
                  </p>
                  <button
                    onClick={openFileDialog}
                    className="text-white bg-[#4e93fc] px-4 py-2 rounded-full hover:bg-[#3776e8] font-bold cursor-pointer"
                  >
                    <b className="text-[13px]">Select files</b>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === Uploaded File List === */}
      {files.length > 0 && (
        <div className="flex flex-col items-center px-10 pb-8 bg-fff">
          <div className="w-full">
            <span className="px-5">
              <span className="text-[#2596be]">{files.length}</span> Files
              Uploaded
            </span>
            <ul className="mt-4">
              {files.map((file) => (
                <li key={file.name} className="mb-4">
                  <div className="flex items-center w-full h-[60px] px-3 rounded-[10px] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)] bg-white">
                    <div className="w-1/14 h-8 mr-4 ">
                      <img
                        src={GGDOCS_IMG}
                        alt="Document"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-12/14 flex flex-col">
                      <div className="flex-1 overflow-hidden items-end">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                      </div>
                      <div className="items-center">
                        <span className="text-xs text-gray-500 w-[100px]">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/14 text-center">
                      <button
                        onClick={() => handleRemoveFile(file.name)}
                        className="ml-4 text-white bg-gray-300 rounded-full p-[3px] hover:bg-gray-500"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* === Upload Button === */}
          <button
            onClick={() => {
              onCloseUpload?.();
              navigate("/set-file-name");
            }}
            className="text-white bg-[#4e93fc] px-4 py-2 mt-5 rounded-full hover:bg-[#3776e8] font-bold cursor-pointer"
          >
            <b className="text-[13px]">Upload</b>
          </button>
        </div>
      )}
    </div>
  );
}
