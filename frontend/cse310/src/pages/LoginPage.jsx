import apple from "../assets/apple-logo.png";
import google from "../assets/google-logo.png";
import { AtSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from '../stores/userStore';
import {
    TextInput,
    PasswordInput,
    Button,
    Checkbox,
    Notification,
} from "@mantine/core";
import {
    useForm,
} from "@mantine/form";

function LoginPage({ onSwitchToRegister }) {
    const navigate = useNavigate();
    
    // Zustand store selectors
    const login = useUserStore((state) => state.login);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);
    
    // Local state for notifications
    const [loginError, setLoginError] = useState(null);
    
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            password: "",
            remember: false,
        },

        validate: {
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

    const handleLogin = async (values) => {
        setLoginError(null);
        
        const result = await login({
            username: values.username,
            password: values.password,
            remember: values.remember
        });

        if (result.success) {
            // Redirect to home
            console.log("Login Success");
            navigate('/');
        } else {
            setLoginError(result.error || 'Login failed. Please try again.');
        }
    };

    return (
        <>
            <div className="flex flex-col w-[400px] mx-auto px-[20px]">
                {/* Error notification */}
                {loginError && (
                    <Notification
                        color="red"
                        title="Login Error"
                        onClose={() => setLoginError(null)}
                        className="mb-4"
                    >
                        {loginError}
                    </Notification>
                )}

                <p className="text-center">with</p>
                
                {/* Login via google/apple */}
                <div className="grid grid-cols-2 gap-4 p-[10px]">
                    <Link
                        className="flex justify-center cursor-pointer pt-[5px] pb-[5px] bg-white rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        to={""}
                    >
                        <img className="w-[30px] h-[30px]" src={google} alt="" />
                    </Link>
                    <Link
                        className="flex justify-center cursor-pointer pt-[5px] pb-[5px] bg-black rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
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
                    <form onSubmit={form.onSubmit(handleLogin)}>
                        <TextInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Username"
                            disabled={isLoading}
                            key={form.key("username")}
                            {...form.getInputProps("username")}
                        />
                        <PasswordInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Password"
                            disabled={isLoading}
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />
                        <div className="grid grid-cols-2">
                            <Checkbox
                                size="xs"
                                label="Remember me"
                                disabled={isLoading}
                                key={form.key("remember")}
                                {...form.getInputProps("remember", {
                                    type: "checkbox",
                                })}
                            />
                            <a className="text-blue-600 text-right text-xs" href="">
                                Forgot password?
                            </a>
                        </div>
                        <Button
                            type="submit"
                            fullWidth
                            className="my-3"
                            size="md"
                            radius="xl"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </Button>
                    </form>
                    <p className="text-center">
                        Don't have an account?{" "}
                        <a
                            className="text-blue-600 font-bold"
                            href=""
                            onClick={(e) => {
                                e.preventDefault();
                                onSwitchToRegister();
                            }}
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
