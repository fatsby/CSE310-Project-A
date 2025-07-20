import { Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

// ===========================
// SetFileName Component
// ===========================
export default function SetFileName({ onSubmit, onClose, onCloseUp }) {
  // ---------------------------
  // Form setup
  // ---------------------------
  const form = useForm({
    initialValues: {
      filename: "",
      description: "",
    },
  });

  return (
    <div className="w-full h-full bg-[#f9f9f9] px-14 p-y-4">
      <form className="text-center">
        {/* Filename input */}
        <TextInput
          label="Title"
          data-autofocus
          className="my-3 text-left"
          radius="md"
          required
          withAsterisk
          placeholder="Enter Name For The Material"
          key={form.key("filename")}
          {...form.getInputProps("filename")}
        />

        {/* Description input */}
        <Textarea
          label="Description"
          className="my-3 text-left"
          autosize
          minRows={10}
          maxRows={30}
          radius="md"
          required
          withAsterisk
          placeholder="Provide a detailed summary of the material (minimum 40 words recommended)."
          key={form.key("description")}
          {...form.getInputProps("description")}
        />

        {/* Submit button */}
        <button
          onClick={form.onSubmit(async (values) => {
            console.log("Form Values:", values);
            await onSubmit(values.filename);
            onClose();
            onCloseUp();
          })}
          className="text-white bg-[#4e93fc] hover:bg-[#3776e8] px-4 py-2 rounded-full text-[13px] font-bold mt-3 mb-3 cursor-pointer"
        >
          <b className="text-[13px]">Finish</b>
        </button>
      </form>
    </div>
  );
}
