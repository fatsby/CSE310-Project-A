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
  });

  return (
    <div className="w-full bg-[#f9f9f9] px-14">
      <form className="text-center w-full">
        <div className="flex md:flex-row w-full">
          <div className="md:w-1/3 flex justify-center items-start my-6 px-4">
            <img
              src={PurpleBgIMG}
              alt="Thumbnail"
              className="aspect-[12/9] rounded-[10px] object-cover shadow-md"
            />
          </div>
          <Fieldset className="md:w-2/3 w-full my-6 px-4">
            {/* Filename input */}
            <TextInput
              label="Title"
              data-autofocus
              className="text-left"
              radius="md"
              required
              withAsterisk
              placeholder="Enter Name For The Material"
              key={form.key("filename")}
              {...form.getInputProps("filename")}
              size="md"
            />
            {/* Description input */}
            <Textarea
              label="Description"
              className="text-left"
              autosize
              minRows={6}
              maxRows={30}
              radius="md"
              required
              withAsterisk
              placeholder="Provide a detailed summary of the material (minimum 40 words recommended)."
              key={form.key("description")}
              {...form.getInputProps("description")}
              size="md"
              mt={7}
            />
            <div className="flex flex-col md:flex-row w-full mt-3 gap-3">
              <div className="md:w-1/2 w-full flex items-center">
                {/* School input */}
                <Select
                  className="w-full"
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
                  className="w-full"
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
            <div className="flex flex-col md:flex-row w-full mt-3 gap-3">
              <div className="md:w-1/2 w-full">
                <SegmentedControl
                  className="w-full"
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
          </Fieldset>
        </div>
        {/* Submit button */}
        <button
          onClick={form.onSubmit(async (values) => {
            console.log("Form Values:", values);
            await onSubmit({
              filename: values.filename,
              description: values.description,
              school: values.school,
              course: values.course,
              priceMode: accessType,
              price: accessType === "Paid" ? values.price : "0",
            });
            onClose();
            onCloseUp();
          })}
          className="text-white bg-[#4e93fc] hover:bg-[#3776e8] px-4 py-2 rounded-full text-[13px] font-bold mt-8 mb-3 cursor-pointer"
        >
          <b className="text-[13px]">Finish</b>
        </button>
      </form>
    </div>
  );
}
