import {
  Fieldset,
  NativeSelect,
  NumberInput,
  SegmentedControl,
  Select,
  Textarea,
  TextInput,
  Group,
  Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHelpOctagon } from "@tabler/icons-react";

// ===========================
// Assets
// ===========================
import { useEffect, useRef, useState } from "react";

export default function SetFileName({ onSubmit, onClose, onCloseUp }) {
  const [accessType, setAccessType] = useState("Free");

  // ---------------------------
  // Form setup
  // ---------------------------
  const form = useForm({
    initialValues: {
      filename: "",
      description: "",
      school: "",
      course: "",
      priceMode: "",
      price: "",
    },
    validate: {
      filename: (value) =>
        value.trim().length === 0 ? "Title is required" : null,
      description: (value) =>
        value.trim().length < 40 ? "Minimum 40 characters required" : null,
      school: (value) => (!value ? "School is required" : null),
      course: (value) => (!value ? "Course is required" : null),
      price: (value, values) =>
        values.priceMode === "Paid" && (!value || Number(value) <= 0)
          ? "Price is required"
          : null,
    },
  });

  // ---------------------------
  // Auto-focus
  // ---------------------------
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className="container mx-auto bg-white">
      <form className="px-13 py-10 pt-[125px]">
        <div className="flex md:flex-row gap-7">
          <div className="w-2/3 px-4">
            <div class="relative">
              <input
                type="text"
                id="floating_helper"
                aria-describedby="floating_helper_text"
                class="block rounded-lg px-4 pb-2.5 pt-7 w-full text-[14px] text-gray-900 bg-transparent border-[1px] border-[#ced4da] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Add a title that describes your material"
              />
              <label
                for="floating_helper"
                class="absolute flex items-center text-[18px] text-[#676767] dark:text-gray-400 font-semibold scale-75 -translate-y-4 top-5 z-10 origin-[0] start-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                Title{" "}
                <IconHelpOctagon size={18} stroke={1.25} className="pl-0.5" />
              </label>
            </div>

            {/* Filename input */}
            <TextInput
              label="Title"
              ref={titleRef}
              className="text-left mb-4"
              radius="md"
              required
              withAsterisk
              placeholder="Add a title that describes your material"
              key={form.key("filename")}
              {...form.getInputProps("filename")}
            />
            {/* Description input */}
            <Textarea
              label="Description"
              className="text-left my-4"
              autosize
              minRows={6}
              maxRows={30}
              radius="md"
              required
              withAsterisk
              placeholder="Tell viewers about your material (minimum 40 words recommended)."
              key={form.key("description")}
              {...form.getInputProps("description")}
              mt={7}
            />
            <div className="flex flex-col md:flex-row w-full gap-3">
              <div className="md:w-1/2 w-full flex items-center">
                {/* School input */}
                <Select
                  label="Select your school"
                  withAsterisk
                  className="w-full my-4"
                  checkIconPosition="right"
                  data={["EIU", "VNU", "HUST", "HUB"]}
                  placeholder="Select Course"
                  radius="md"
                  key={form.key("school")}
                  {...form.getInputProps("school")}
                />
              </div>
              <div className="md:w-1/2 w-full flex items-center">
                {/* Course input */}
                <Select
                  label="Select your course"
                  withAsterisk
                  className="w-full my-4"
                  checkIconPosition="right"
                  data={["EIU", "VNU", "HUST", "HUB"]}
                  placeholder="Select Course"
                  radius="md"
                  key={form.key("course")}
                  {...form.getInputProps("course")}
                />
              </div>
            </div>
            <div className="mt-2">
              <Radio.Group
                name="priceMode"
                label="View Mode"
                description="Choose access type"
                withAsterisk
                value={accessType}
                onChange={(value) => {
                  setAccessType(value);
                  form.setFieldValue("priceMode", value);
                }}
              >
                <div className="flex flex-col gap-2 mt-2">
                  <Radio value="Free" label="Free" />
                  <Radio value="Paid" label="Paid" />
                </div>
              </Radio.Group>
              {accessType === "Paid" && (
                <div className="mt-3 w-fit">
                  {/* Price input */}
                  <TextInput
                    className="text-left w-full"
                    placeholder="Enter Price"
                    type="number"
                    radius="md"
                    key={form.key("price")}
                    {...form.getInputProps("price")}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 flex flex-col items-start pt-6 rounded-2xl bg-[#f9f9f9] p-10">
            <span className="text-[13px] font-medium">
              Thumbnail<span className="text-red-500">*</span>
            </span>
          </div>
        </div>
        {/* Submit button */}
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={form.onSubmit(async (values) => {
              onSubmit(values);
              onClose();
              onCloseUp();
            })}
            className="text-white bg-[#4e93fc] hover:bg-[#3776e8] px-7 py-3 rounded-full font-bold mt-8 mb-3 cursor-pointer justify-end"
          >
            <b className="text-lg">Finish</b>
          </button>
        </div>
      </form>
    </div>
  );
}
// notifications.show({
//   title: "Upload Complete",
//   message: `${title} Uploaded! 🎉`,
//   color: "#12b886",
//   icon: checkIcon,
//   styles: (theme) => ({
//     root: {
//       backgroundColor: "#ffffff",
//     },
//   }),
// });
// {
//   isUploading && (
//     <div className="absolute flex justify-center items-center mt-6 inset-0 z-[9999]">
//       <RingProgress
//         size={120}
//         thickness={12}
//         roundCaps
//         sections={[{ value: uploadProgress, color: "#439aff" }]}
//         rootColor="#bde7f7"
//         label={
//           <Text size="sm" ta="center">
//             {uploadProgress}%
//           </Text>
//         }
//       />
//     </div>
//   );
// }
