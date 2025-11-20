import apple from "../assets/apple-logo.png";
import google from "../assets/google-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    TextInput,
    PasswordInput,
    Button,
    Checkbox,
    Notification,
} from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import { saveToken, saveUser } from "../../utils/auth";

function LoginPage({ onSwitchToRegister }) {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },

        validate: {
            email: isEmail("Invalid email"),
            password: (value) => {
                if (value.trim().length === 0)
                    return "Password can not be empty";
                if (value.trim().length < 7)
                    return "Password must be > 6 characters long";
                return null;
            },
        },
    });

    //Tri edited to add user fetch and save
    const handleLogin = async (values) => {
        setLoginError(null);
        setIsLoading(true);

        try {
            // login request
            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Email: values.email,
                    Password: values.password,
                }),
            });

            if (!loginResponse.ok) {
                setLoginError("Invalid email or password.");
                setIsLoading(false);
                return;
            }

            const tokenData = await loginResponse.json();

            // save token IMMEDIATELY to use with /me fetch
            saveToken(tokenData, values.remember);

            // fetch user details
            const meResponse = await fetch(`${API_URL}/api/users/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${tokenData.accessToken}`
                }
            });

            if (meResponse.ok) {
                const userData = await meResponse.json();

                // save user data using our new helper
                saveUser(userData, values.remember);

                console.log("Login & User Fetch Success", userData);
                navigate("/", { replace: true });
            } else {
                setLoginError("Could not fetch user details.");
            }

        } catch (error) {
            console.error("Network error:", error);
            setLoginError("A network error occurred.");
        } finally {
            setIsLoading(false);
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
                        <img
                            className="w-[30px] h-[30px]"
                            src={google}
                            alt=""
                        />
                    </Link>
                    <Link
                        className="flex justify-center cursor-pointer pt-[5px] pb-[5px] bg-black rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        to={""}
                    >
                        <img
                            className="w-[30px] h-[30px]"
                            src={apple}
                            alt=""
                        />
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
                            placeholder="Email"
                            disabled={isLoading}
                            key={form.key("email")}
                            {...form.getInputProps("email")}
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
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Log in"}
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
