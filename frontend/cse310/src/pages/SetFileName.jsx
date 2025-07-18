import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function SetFileName({ onSubmit, onClose, onCloseUp }) {
  const form = useForm({
    initialValues: {
      filename: "",
      description: "",
    },
  });

  return (
    <div className="w-[786px] h-[577px] bg-[#f9f9f9] p-4">
      <form className="text-center">
        <TextInput
          className="my-3"
          size="md"
          radius="xl"
          withAsterisk
          placeholder="Filename"
          key={form.key("filename")}
          {...form.getInputProps("filename")}
        />
        <TextInput
          className="my-3"
          size="md"
          radius="xl"
          withAsterisk
          placeholder="Description"
          key={form.key("description")}
          {...form.getInputProps("description")}
        />
        <button
          onClick={form.onSubmit(async (values) => {
            console.log("Form Values:", values);
            await onSubmit(); // Upload files
            onClose(); // ✅ Close modal after upload
            onCloseUp();
          })}
          className="text-white bg-[#4e93fc] hover:bg-[#3776e8] px-4 py-2 rounded-full text-[13px] font-bold mt-3"
        >
          <b className="text-[13px]">Finish</b>
        </button>
      </form>
    </div>
  );
}
