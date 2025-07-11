import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { notifications } from "@mantine/notifications";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploadedURL, setUploadedURL] = useState(null);

  // Helper to format bytes
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  }

  // Handle drop
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      console.log("File:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", formatBytes(file.size));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Remove single file by name
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const selectedFile = files[0];

  const uploadUserFile = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Uploaded URL:", data.secure_url);
    setUploadedURL(data.secure_url);
    notifications.show({
      title: "Upload Complete",
      message: "Material added! 🎉",
    });
  };

  return (
    <div className="relative w-[786px] max-h-[577px] bg-[#f9f9f9] rounded-[20px] mx-auto">
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
                  <img
                    src="src/assets/grey_up.png"
                    alt="Upload"
                    className="w-[80px]"
                  />
                  <p className="text-[15px] mt-5">Drag & Drop</p>
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
                  <img
                    src="src/assets/grey_up.png"
                    alt="Upload"
                    className="w-[80px]"
                  />
                  <p className="text-[15px] mt-5">Drag & Drop</p>
                  <p className="text-[#a0a9b5] text-[11px] mb-5">
                    ( doc, pdf, pptx, zip )
                  </p>
                  <button className="text-white bg-black px-4 py-2 rounded-[10px] hover:bg-[#282829] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                    <b className="text-[13px]">Select files</b>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mx-auto flex flex-col justify-center items-center pb-5">
          <ul>
            {files.map((file) => (
              <li key={file.name} className="m-4">
                <div className="flex items-center w-[512px] h-[60px] px-4 bg-white rounded-[10px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                  <div className="flex-shrink-0 w-8 h-8 mr-4">
                    <img
                      src="src/assets/ggdoc.png"
                      alt="Document"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
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
          <button
            onClick={uploadUserFile}
            className="text-white bg-black px-4 py-2 rounded-[10px] hover:bg-[#282829] text-[13px] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-3"
          >
            <b className="text-[13px]">Upload</b>
          </button>
        </div>
      )}
    </div>
  );
}
