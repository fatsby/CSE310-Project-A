import {
  Fieldset,
  NativeSelect,
  NumberInput,
  SegmentedControl,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

// ===========================
// Assets
// ===========================
import PurpleBgIMG from "../assets/Landing/purple-bg.png";
import { useState } from "react";

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

  return (
    <>
      <form className="w-full mx-auto bg-[#ffffff] px-13 py-10">
        <div className="flex md:flex-row gap-7">
          <div className="w-2/3 px-4">
            {/* Filename input */}
            <TextInput
              label="Title"
              data-autofocus
              className="text-left mb-4"
              radius="md"
              required
              withAsterisk
              placeholder="Add a title that describes your material"
              key={form.key("filename")}
              {...form.getInputProps("filename")}
              size="md"
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
              size="md"
              mt={7}
            />
            <div className="flex flex-col md:flex-row w-full gap-3">
              <div className="md:w-1/2 w-full flex items-center">
                {/* School input */}
                <Select
                  className="w-full my-4"
                  checkIconPosition="right"
                  data={["EIU", "VNU", "HUST", "HUB"]}
                  placeholder="Select Course"
                  radius="md"
                  size="md"
                  key={form.key("school")}
                  {...form.getInputProps("school")}
                />
              </div>
              <div className="md:w-1/2 w-full flex items-center">
                {/* Course input */}
                <Select
                  className="w-full my-4"
                  checkIconPosition="right"
                  data={["EIU", "VNU", "HUST", "HUB"]}
                  placeholder="Select Course"
                  radius="md"
                  size="md"
                  key={form.key("course")}
                  {...form.getInputProps("course")}
                />
              </div>
            </div>
            <span className="text-left text-md font-medium mt-7">
              View Mode <span className="text-red-500 font-semi-bold">*</span>
            </span>
            <div className="flex flex-col md:flex-row w-full gap-3">
              <div className="md:w-1/2 w-full">
                <SegmentedControl
                  className="w-full"
                  required
                  fullWidth
                  color="blue"
                  data={["Free", "Paid"]}
                  radius="md"
                  size="md"
                  value={accessType}
                  onChange={(value) => {
                    setAccessType(value);
                    form.setFieldValue("priceMode", value);
                  }}
                />
              </div>
              {accessType === "Paid" && (
                <div className="md:w-1/2 w-full flex items-center">
                  {/* Price input */}
                  <TextInput
                    className="text-left w-full"
                    placeholder="Enter Price"
                    type="number"
                    radius="md"
                    size="md"
                    key={form.key("price")}
                    {...form.getInputProps("price")}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 flex flex-col justify-between items-start pt-6">
            <img
              src={PurpleBgIMG}
              alt="Thumbnail"
              className="aspect-[12/9] rounded-[10px] object-cover shadow-md"
            />
            {/* Submit button */}
            <div className="w-full flex justify-end">
              <button
                onClick={form.onSubmit(async (values) => {
                  onSubmit(values);
                  onClose();
                  onCloseUp();
                })}
                className="text-white bg-[#4e93fc] hover:bg-[#3776e8] px-4 py-2 rounded-full text-[13px] font-bold mt-8 mb-3 cursor-pointer justify-end"
              >
                <b className="text-[13px]">Finish</b>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
