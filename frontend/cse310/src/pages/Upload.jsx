import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { notifications } from "@mantine/notifications";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

//IMAGES IMPORT
import GREY_UP_IMG from "../assets/blue_up.png";
import SetFileName from "./SetFileName";

export default function Upload({ onCloseUpload }) {
  // useState returns [currentValue, updaterFunction] => [files, setFiles] = [currentValue, updateFunction]
  const [files, setFiles] = useState([]);
  // useState takes an argument empty [] for files because the user hasnt selected any files => currentValue = [] => files = []
  const [uploadedURL, setUploadedURL] = useState([]);

  // Helper to format bytes
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  }

  // When a new file is dropped into the dropzone, run onDrop
  // useCallBack because:
  //      - Every time setFiles -> state changes -> the whole Upload re-render (the whole Upload runs top-to-bottom again) -> re-create a new object onDrop (onDrop1, onDrop2) even though it is the same code
  //      => useDropzone({onDrop}) call onDrop. Without useCallback, the useDropzone sees that onDrop changes (a new onDrop is created), so useDropzone needs to remove the old listener to the old onDrop and add new listener to the new onDrop when re-render.
  //      . If useCallBack, the onDrop always stay the same, so when Upload re-renders, the useDropzone always just calls back to the old same one. => higher performance

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); //. setFiles with a new array of (taking all old files + new accepted files). Cant use add newfiles because it doesnt change state -> no re-render.
    acceptedFiles.forEach((file) => {
      console.log("File:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", formatBytes(file.size));
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    noClick: true,
  }); //destructure

  // Remove single file by name
  const handleRemoveFile = (fileName) => {
    // setFile take all old files (prevFiles) => filter (only set the files to the array of (the files that are not "the file"))
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const uploadAllUserFiles = async () => {
    if (files.length === 0) {
      console.error("No files selected."); // When the user hit the remove => no files
      return;
    }

    for (const file of files) {
      // formData : {file-name, file-type, raw binary bits of the files}. Can't use json because we can't send the raw binary bits (json doesnt support raw binary). If use json, we need to convert to base64 (increase the size of the file 33%)
      const formData = new FormData(); // formData is like a form in html but invisible
      formData.append("file", file);
      formData.append(
        "upload_preset", // Handles how the data is sent (accepted formats, ...)
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

      try {
        const response = await fetch(
          // wait until fetch successfully and then continue
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/raw/upload`, // raw for pdf, zip (no docx, pptx)
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        console.log(`Uploaded URL for ${file.name}:`, data.secure_url);
        // ✅ Optional: save each uploaded URL
        setUploadedURL((prevURLs) => [...prevURLs, data.secure_url]);
        notifications.show({
          title: "Upload Complete",
          message: `${file.name} uploaded! 🎉`,
        });
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
      }
    }
  };

  //modal state manager
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);

  return (
    <div className="relative w-[786px] h-[577px] bg-[#f9f9f9] rounded-[20px] mx-auto">
      <div className="px-16">
        {/* getRootProps spread all the div: handle "onDragEnter", "onDragLeave", "onDrop", "onClick" */}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {/* isDragActive = true => do after ?, if isDragActive = false => do after :*/}
          {isDragActive ? (
            <div className="pt-10 pb-5">
              <div
                className="relative w-full h-[350px] flex justify-center items-center text-center rounded-[15px] bg-[#f2f7fe]"
                style={{ border: "2px dashed #b1d2ff" }}
              >
                <div className="flex flex-col items-center">
                  <img src={GREY_UP_IMG} alt="Upload" className="w-[80px]" />
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
                  <img src={GREY_UP_IMG} alt="Upload" className="w-[80px]" />
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
          {/* button to open modal */}
          <button
            onClick={openModal}
            className="text-white bg-[#4e93fc] px-4 py-2 rounded-full hover:bg-[#3776e8] font-bold cursor-pointer"
          >
            <b className="text-[13px]">Upload</b>
          </button>
        </div>
      )}
      {/* Mantine Modal */}
      <Modal
        opened={opened}
        onClose={closeModal}
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
        <SetFileName
          onSubmit={uploadAllUserFiles}
          onClose={closeModal}
          onCloseUp={onCloseUpload}
        />{" "}
        {/* ✅ Pass close if Upload needs it */}
      </Modal>
    </div>
  );
}
