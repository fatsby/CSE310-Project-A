// import React
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// import Mantine
import { Select, TextInput, Radio, RingProgress, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

// import Lucide React Icon
import {
  BadgeQuestionMark,
  DollarSign,
  ImagePlus,
  X,
  Check,
} from "lucide-react";

// import Img
import defaultIMG from "../assets/Upload/SetFileName/mountain.jpg";

export default function SetFileName({ onSubmit }) {
  // navigate back Home + smooth transformation effect
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  // ---------------------------
  // Form setup
  // ---------------------------
  const form = useForm({
    initialValues: {
      filename: "",
      description: "",
      thumbnail: null,
      school: "",
      course: "",
      priceMode: "",
      price: "",
    },
    validate: {
      filename: (value) =>
        value.trim().length === 0 ? "Title is required" : null,
      description: (value) =>
        value.trim().length < 10 ? "Minimum 10 characters required" : null,
      school: (value) => (!value ? "School is required" : null),
      course: (value) => (!value ? "Course is required" : null),
      price: (value, values) =>
        values.priceMode === "Paid" && (!value || Number(value) <= 0)
          ? "Price is required"
          : null,
      thumbnail: (value) => (!value ? "Thumbnail is required" : null),
    },
  });

  // auto-focus on Title TextInput
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // thumbnail state
  const [thumbnails, setThumbnails] = useState([]);

  // view access state
  const [accessType, setAccessType] = useState("Free");

  // uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // onDrop for thumbnail img uploading
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setThumbnails((prev) => [...prev, ...newFiles]);

      form.setFieldValue("thumbnail", [...thumbnails, ...newFiles]);
    },
    [thumbnails, form]
  );

  // only accepts img
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // ---------------------------
  // Handle Ring Progess & Noti
  // ---------------------------
  const handleSubmit = form.onSubmit(async (values) => {
    console.log("handle submit");

    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    let notificationShown = false;

    const interval = setInterval(() => {
      console.log("set interval");

      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          if (!notificationShown) {
            notificationShown = true;

            setIsFadingOut(true);
            setTimeout(() => {
              navigate("/");
            }, 500);

            setTimeout(() => {
              setIsUploading(false);

              console.log(
                "Notification triggered at:",
                new Date().toISOString()
              );
              notifications.show({
                title: "Upload Complete",
                message: `${values.filename || "Your file"} Uploaded! 🎉`,
                color: "green",
                icon: <Check size={20} />,
                styles: () => ({
                  root: { backgroundColor: "#ffffff" },
                }),
              });
            }, 300);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  });

  return (
    <div className="container mx-auto bg-white pt-[125px] relative">
      {/* Ring Progress Overlay */}
      {isUploading && (
        <div className="absolute flex justify-center items-center mt-6 inset-0 z-[9999] bg-white/80">
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

      {/* Form */}
      <form className="px-13 py-10 text-[13px]" onSubmit={handleSubmit}>
        <div className="flex md:flex-row gap-7">
          <div className="w-2/3 px-4">
            <h2 className="text-[20px] font-bold">Details</h2>

            {/* Filename input */}
            <div class="relative">
              <input
                type="text"
                id="filename"
                ref={titleRef}
                key={form.key("filename")}
                {...form.getInputProps("filename")}
                className={`block mt-6 rounded-lg px-4 pb-2.5 pt-7 w-full text-gray-900 bg-transparent border-[1px] ${
                  form.errors.filename ? "border-red-500" : "border-[#ced4da]"
                } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#448ce8] focus:outline-none focus:ring-0 focus:border-[#448ce8] peer`}
                placeholder="Add a title that describes your material"
              />

              <label
                for="floating_helper"
                className="absolute flex items-center text-[18px] text-[#606060] dark:text-gray-400 font-semibold scale-75 -translate-y-4 top-5 z-10 origin-[0] start-4"
              >
                Title{" "}
                <BadgeQuestionMark
                  size={18}
                  strokeWidth={1.75}
                  className="pl-0.5"
                />
              </label>

              {form.errors.filename && (
                <div className="text-red-600 text-[12px] mt-1">
                  {form.errors.filename}
                </div>
              )}
            </div>

            {/* Description input */}
            <div className="relative">
              <textarea
                id="description"
                rows="4"
                key={form.key("description")}
                {...form.getInputProps("description")}
                className={`block rounded-lg mt-6 px-4 pb-2.5 pt-7 w-full text-gray-900 bg-transparent border-[1px] ${
                  form.errors.description
                    ? "border-red-500"
                    : "border-[#ced4da]"
                } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#448ce8] focus:outline-none focus:ring-0 focus:border-[#448ce8] peer resize-none`}
                placeholder="Tell viewers about your material (minimum 10 words recommended)."
              />

              <label
                htmlFor="floating_helper"
                className="absolute flex items-center text-[18px] text-[#606060] dark:text-gray-400 font-semibold scale-75 -translate-y-4 top-5 z-10 origin-[0] start-4"
              >
                Description{" "}
                <BadgeQuestionMark
                  size={18}
                  strokeWidth={1.75}
                  className="pl-0.5"
                />
              </label>

              {form.errors.description && (
                <div className="text-red-600 text-[12px] mt-1">
                  {form.errors.description}
                </div>
              )}
            </div>

            {/* Thumbnail input */}
            <div className="mt-6">
              <p className="text-[13px] font-semibold">Thumbnail</p>
              <p className="text-[12px] text-[#878e96]">
                Set a thumbnail that stands out and draws viewers' attention.
              </p>
            </div>

            <div className="mt-3 flex gap-3 flex-wrap">
              {thumbnails.map((file, index) => (
                <div
                  key={index}
                  className="relative w-24 h-16 rounded-sm overflow-hidden"
                >
                  <img
                    src={file.preview}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = thumbnails.filter((_, i) => i !== index);
                      setThumbnails(updated);
                      form.setFieldValue("thumbnail", updated);
                    }}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-[6px] py-[3px]"
                  >
                    <X strokeWidth={2} size={17} />
                  </button>
                </div>
              ))}

              <div
                {...getRootProps()}
                className="w-24 h-16 border border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
              >
                <input {...getInputProps()} />

                <ImagePlus strokeWidth={2} size={15} />
                <span className="text-[#606060] text-[8px] font-medium">
                  Upload
                </span>
              </div>
            </div>

            {form.errors.thumbnail && (
              <div className="text-red-600 text-[12px] mt-1">
                {form.errors.thumbnail}
              </div>
            )}

            <div className="flex flex-col md:flex-row w-full gap-3 mt-6">
              <div className="md:w-1/2 w-full flex items-center">
                {/* School input */}
                <div className="w-full">
                  <span className="text-[13px] font-semibold">School</span>

                  <Select
                    description="Choose your school"
                    checkIconPosition="right"
                    data={["EIU", "VNU", "HUST", "HUB"]}
                    placeholder="Select Course"
                    radius="md"
                    key={form.key("school")}
                    {...form.getInputProps("school")}
                  />
                </div>
              </div>
              <div className="md:w-1/2 w-full flex items-center">
                {/* Course input */}
                <div className="w-full">
                  <span className="text-[13px] font-semibold">Course</span>

                  <Select
                    description="Choose the related course"
                    checkIconPosition="right"
                    data={["EIU", "VNU", "HUST", "HUB"]}
                    placeholder="Select Course"
                    radius="md"
                    key={form.key("course")}
                    {...form.getInputProps("course")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-[13px] font-semibold">View Mode</span>

              <Radio.Group
                name="priceMode"
                description="Choose access type"
                value={accessType}
                onChange={(value) => {
                  setAccessType(value);
                  form.setFieldValue("priceMode", value);
                }}
              >
                <div className="flex flex-col gap-2 mt-2">
                  <Radio value="Free" label="Free" />

                  <div className="flex items-center gap-2">
                    <Radio value="Paid" label="Paid" />

                    <TextInput
                      placeholder="Enter Price"
                      type="number"
                      radius="md"
                      rightSectionPointerEvents="none"
                      rightSection={<DollarSign size={18} strokeWidth={1.5} />}
                      className={`w-[330px] transition-opacity duration-200 ${
                        accessType === "Paid"
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                      key={form.key("price")}
                      {...form.getInputProps("price")}
                    />
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
          <div className="w-1/3 items-start rounded-xl sticky top-4 self-start pt-14">
            <div className="w-full aspect-[6/7] bg-[#f9f9f9] rounded-2xl">
              <img
                src={defaultIMG}
                alt=""
                className="rounded-t-2xl aspect-[12/9] object-cover"
              />

              <div className="p-6">
                <p className="text-[#606060] font-medium text-[13px]">
                  Material Link
                </p>
                <p className="text-[#2e60d6] font-medium text-[15px] break-all">
                  https://www.gradelevate.com/v=H4MMiLKKu7U
                </p>

                <p className="text-[#606060] font-medium text-[13px] mt-5">
                  File Name
                </p>
                <ul className="list-none text-[#151515] font-medium text-[15px]">
                  <li>Midterm_Operating_System.docx</li>
                  <li>Lab2_Operating_System.pdf</li>
                  <li>Lab1_Operating_System.pdf</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Submit button */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="submit"
            className="text-white bg-[#4e93fc] hover:bg-[#3776e8] px-7 py-3 rounded-full font-bold mt-8 mb-3 cursor-pointer justify-end"
          >
            <b className="text-lg">Finish</b>
          </button>
        </div>
      </form>
    </div>
  );
}
