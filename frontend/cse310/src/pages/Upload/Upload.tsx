import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Upload() {
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      console.log("File: " + file.name);
      console.log("Type: " + file.type);
      console.log("Size: " + formatBytes(file.size));
    });
  }, []);

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({ onDrop });

  const selectedFile = acceptedFiles[0];

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
  };

  return (
    <div className="max-w-screen h-full bg-[#393a4645] p-28">
      <div className="relative w-[786px] min-h-[577px] bg-[#f9f9f9] rounded-[20px] mx-auto">
        <div className="absolute top-[-20px] right-[-20px] text-black bg-white rounded-full">
          <i className="fa-solid fa-circle-xmark text-[54px]"></i>
        </div>
        <div className="h-[100px] border-b-[#CECFD2] border-b-[1px] pl-[50px]">
          <h1 className="leading-[100px] text-[24px] font-medium">
            Upload Files
          </h1>
        </div>
        <div className="px-16">
          <div {...getRootProps()} className="">
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="pt-10 pb-5">
                <div
                  className="relative w-full h-[350px] flex justify-center items-center text-center rounded-[15px] bg-[#f2f7fe]"
                  style={{
                    border: "2px dashed #b1d2ff",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <img src="/img/blue_up.png" alt="" className="w-[80px]" />
                    <p className="text-[15px] p-0 m-0 text-black mt-5">
                      Drag & Drop
                    </p>
                    <p className="text-[#a0a9b5] text-[11px] mb-5 p-0">
                      ( doc, pdf, pptx, zip ){" "}
                    </p>
                    <div className="text-transparent bg-transparent px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold">
                      Select files
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-10 pb-5">
                <div className="relative w-full h-[350px] flex justify-center items-center text-center">
                  <div className="flex flex-col items-center">
                    <img src="/img/blue_up.png" alt="" className="w-[80px]" />
                    <p className="text-[15px] p-0 m-0 text-black mt-5">
                      Drag & Drop
                    </p>
                    <p className="text-[#a0a9b5] text-[11px] mb-5 p-0">
                      ( doc, pdf, pptx, zip ){" "}
                    </p>
                    <button className="text-white bg-[#4e93fc] px-[16px] py-[8px] rounded-[10px] hover:bg-[#327BFB] text-[13px] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                      Select files
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {acceptedFiles.length > 0 && (
          <div className="mx-auto flex flex-col justify-center items-center pb-5">
            <ul>
              {acceptedFiles.map((file) => (
                <li key={file.name} className="m-4">
                  <div className="flex items-center w-[512px] h-[60px] px-4 bg-white rounded-[10px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-8 h-8 mr-4">
                      <img
                        src="/img/ggdoc.png"
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* File info */}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>

                    {/* Trash icon */}
                    <button className="ml-4 text-[#C3C5C9] hover:text-red-600">
                      <i className="fa-solid fa-trash text-lg"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={uploadUserFile}
              className="text-white bg-[#4e93fc] px-[16px] py-[8px] rounded-[10px] hover:bg-[#327BFB] text-[13px] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] mt-3"
            >
              Upload
            </button>
          </div>
        )}

        {uploadedURL && (
          <div>
            <p>Uploaded successfully:</p>
            <a href={uploadedURL} target="_blank" rel="noreferrer">
              {uploadedURL}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
