import apple from "../assets/apple-logo.png";
import google from "../assets/google-logo.png";
import { AtSign } from "lucide-react";
import { Link } from "react-router-dom";
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

function LoginPage() {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            password: "",
            remember: false,
        },

        validate: {
            email: isEmail("Invalid email"),
            username: (value) => {
                if (value.trim().length === 0)
                    return "Username can not be empty";
                if (value.trim().length < 7)
                    return "Username must be > 6 characters long";
                return null;
            },
            password: (value) => {
                if (value.trim().length === 0)
                    return "Password can not be empty";
                if (value.trim().length < 7)
                    return "Password must be > 6 characters long";
                return null;
            },
        },
    });
    return (
        <>
            <div className="flex flex-col w-[400px] mx-auto border-2 border-solid border-[#E0E0E0] p-[20px] rounded-[40px] bg-[#F5F5F5]">
                <h2 className="text-center text-[30px] font-bold">Log in</h2>
                <p className="text-center">with</p>
                {/* Login via google/apple */}
                <div className="grid grid-cols-2 gap-4 p-[10px] ">
                    <Link
                        className="flex justify-center cursor-pointer  pt-[5px] pb-[5px] bg-white rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        to={""}
                    >
                        <img
                            className="w-[30px] h-[30px] "
                            src={google}
                            alt=""
                        />
                    </Link>
                    <Link
                        className="flex justify-center cursor-pointer  pt-[5px] pb-[5px] bg-black rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        to={""}
                    >
                        <img className="w-[30px] h-[30px]" src={apple} alt="" />
                    </Link>
                </div>
                <div className="flex items-center w-full">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                {/* Login form */}
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
                        <PasswordInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Password"
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />
                        <div className="grid grid-cols-2">
                            <Checkbox
                                size="xs"
                                label="Remember me"
                                key={form.key("remember")}
                                {...form.getInputProps("remember", {
                                    type: "checkbox",
                                })}
                            />
                            <a
                                className="text-blue-600 text-right text-xs"
                                href=""
                            >
                                Forgot password?
                            </a>
                        </div>
                        <Button
                            type="submit"
                            fullWidth
                            className="my-3"
                            size="md"
                            radius="xl"
                        >
                            Log in
                        </Button>
                    </form>
                    <p className="text-center">
                        Don't have an account?{" "}
                        <a className="text-blue-600 font-bold " href="">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
