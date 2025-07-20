import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { notifications } from "@mantine/notifications";
import {
  ActionIcon,
  Center,
  CheckIcon,
  Modal,
  RingProgress,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SetFileName from "./SetFileName";

// ===========================
// Assets
// ===========================
import BLUE_UP_IMG from "../assets/Upload/blue_up.png";
import GGDOCS_IMG from "../assets/Upload/ggdoc.png";

export default function Upload({ onCloseUpload }) {
  // ===========================
  // State Management
  // ===========================
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedURL, setUploadedURL] = useState([]);
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const checkIcon = <CheckIcon size={20} />;

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
  // Upload all selected files
  // ===========================
  const uploadAllUserFiles = async (title) => {
    if (files.length === 0) {
      console.error("No files selected.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/raw/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        console.log(`Uploaded URL for ${file.name}:`, data.secure_url);
        setUploadedURL((prevURLs) => [...prevURLs, data.secure_url]);

        const progress = Math.round(((i + 1) / files.length) * 100);
        setUploadProgress(progress);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
      }
    }
    setIsUploading(false);
    notifications.show({
      title: "Upload Complete",
      message: `${title} Uploaded! 🎉`,
      color: "#12b886",
      icon: checkIcon,
      styles: (theme) => ({
        root: {
          backgroundColor: "#ffffff",
        },
      }),
    });
  };

  // ===========================
  // Component Rendering
  // ===========================
  return (
    <div className="relative w-full h-full bg-[#f9f9f9] mx-auto">
      {/* === Dropzone Area === */}
      <div className="px-16">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="pt-10 pb-5">
              <div
                className="relative w-full h-[350px] flex justify-center items-center text-center rounded-[15px] bg-[#f2f7fe]"
                style={{ border: "2px dashed #b1d2ff" }}
              >
                <div className="flex flex-col items-center">
                  <img src={BLUE_UP_IMG} alt="Upload" className="w-[80px]" />
                  <p className="text-[15px] mt-5 text-[#4e5966] font-bold">
                    Drag & Drop
                  </p>
                  <p className="text-[#a0a9b5] text-[11px] mb-5">
                    ( doc, pdf, pptx, zip )
                  </p>
                  <div className="text-transparent bg-transparent px-4 py-2 rounded-[10px] text-[13px] font-bold">
                    Select files
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-10 pb-5">
              <div className="relative w-full h-[350px] flex justify-center items-center text-center border-[2px] border-transparent">
                <div className="flex flex-col items-center">
                  <img src={BLUE_UP_IMG} alt="Upload" className="w-[80px]" />
                  <p className="text-[15px] mt-5 text-[#4e5966] font-bold">
                    Drag & Drop
                  </p>
                  <p className="text-[#a0a9b5] text-[11px] mb-5">
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
        <div className="mx-auto flex flex-col justify-center items-center">
          <div>
            <ul className="mt-8">
              {files.map((file) => (
                <li key={file.name} className="mb-4">
                  <div className="flex items-center w-full h-[60px] px-4 bg-white rounded-[10px] drop-shadow-[0_4px_12px_rgba(22,34,55,0.06)]">
                    <div className="flex-shrink-0 w-8 h-8 mr-4">
                      <img
                        src={GGDOCS_IMG}
                        alt="Document"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.name)}
                      className="ml-4 text-[#C3C5C9] hover:text-red-600"
                    >
                      <i className="fa-solid fa-trash text-lg"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <span>
              <span className="text-[#2596be]">{files.length}</span> Files
              Uploaded.
            </span>
          </div>

          {/* === Upload Button === */}
          <button
            onClick={openModal}
            className="text-white bg-[#4e93fc] px-4 py-2 mt-5 rounded-full hover:bg-[#3776e8] font-bold cursor-pointer"
          >
            <b className="text-[13px]">Upload</b>
          </button>
        </div>
      )}

      {/* === Upload Confirmation Modal === */}
      <Modal
        opened={opened}
        onClose={closeModal}
        title="Set File Details"
        size="100%"
        radius="20px"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            backgroundColor: "#f9f9f9",
            height: "600px",
            position: "relative",
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
        <SetFileName
          onSubmit={(title) => uploadAllUserFiles(title)}
          onClose={closeModal}
          onCloseUp={onCloseUpload}
        />
        {isUploading && (
          <div className="absolute flex justify-center items-center mt-6 inset-0 z-[9999]">
            <RingProgress
              size={120}
              thickness={12}
              roundCaps
              sections={[{ value: uploadProgress, color: "#439aff" }]}
              rootColor="#bde7f7"
              label={
                <Text size="sm" ta="center">
                  {uploadProgress}%
                </Text>
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
