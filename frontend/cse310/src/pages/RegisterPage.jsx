import apple from "../assets/apple-logo.png";
import google from "../assets/google-logo.png";
import { AtSign } from "lucide-react";
import {
    TextInput,
    PasswordInput,
    Input,
    Button,
    Checkbox,
} from "@mantine/core";
import {
    useForm,
    isNotEmpty,
    isEmail,
    isInRange,
    hasLength,
    matches,
} from "@mantine/form";

function RegisterPage() {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            username: "",
            termsOfService: false,
            password: "",
            confirmPass: "",
        },

        validate: {
            email: isEmail("Invalid email"),
            username: hasLength(
                { min: 6 },
                "Username must be > 6 characters long"
            ),
            termsOfService: (value) => (value ? null : true),
            password: hasLength(
                { min: 6 },
                "Password must be > 6 characters long"
            ),
            confirmPass: (value, values) =>
                value !== values.password ? "Passwords did not match" : null,
        },
    });
    return (
        <>
            <div className="flex flex-col w-[400px] mx-auto border-2 border-solid border-[#E0E0E0] p-[20px] rounded-[40px] bg-[#F5F5F5]">
                <h2 className="text-center text-[30px] font-bold">Sign up</h2>
                <p className="text-center">with</p>

                <div className="grid grid-cols-2 gap-4 p-[10px] ">
                    <div
                        className="flex justify-center cursor-pointer  pt-[5px] pb-[5px] bg-white rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        onClick={() => (window.location.href = "")}
                    >
                        <img
                            className="w-[30px] h-[30px] "
                            src={google}
                            alt=""
                        />
                    </div>
                    <div
                        className="flex justify-center cursor-pointer  pt-[5px] pb-[5px] bg-black rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        onClick={() => (window.location.href = "")}
                    >
                        <img className="w-[30px] h-[30px]" src={apple} alt="" />
                    </div>
                </div>
                <div className="flex items-center w-full">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                <div className="">
                    <form
                        onSubmit={form.onSubmit((values) =>
                            console.log(values)
                        )}
                    >
                        <TextInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Username"
                            key={form.key("username")}
                            {...form.getInputProps("username")}
                        />
                        <TextInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Your email"
                            rightSection={<AtSign size={20} />}
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                        />
                        <PasswordInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Password"
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />
                        <PasswordInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Confirm Password"
                            key={form.key("confirmPass")}
                            {...form.getInputProps("confirmPass")}
                        />
                        <Checkbox
                            label="Agree terms and conditions"
                            key={form.key("termsOfService")}
                            {...form.getInputProps("termsOfService", {
                                type: "checkbox",
                            })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            className="my-3"
                            size="md"
                            radius="xl"
                        >
                            Sign up
                        </Button>
                    </form>
                    <p className="text-center">
                        Already have an account?{" "}
                        <a className="text-blue-600 font-bold " href="">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
