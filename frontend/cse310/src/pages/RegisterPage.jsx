import apple from '../assets/apple-logo.png'
import google from '../assets/google-logo.png'
import { AtSign, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
    TextInput,
    PasswordInput,
    Button,
    Checkbox,
    Notification,
} from '@mantine/core'
import { useForm, isEmail, hasLength } from '@mantine/form'

function RegisterPage({ onSwitchToLogin }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const API_URL = import.meta.env.VITE_API_BASE_URL

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            username: '',
            termsOfService: false,
            password: '',
            confirmPass: '',
        },

        validate: {
            email: isEmail('Invalid email'),
            username: hasLength(
                { min: 6 },
                'Username must be > 6 characters long'
            ),
            termsOfService: (value) =>
                value ? null : 'You must agree to the terms',
            password: hasLength(
                { min: 6 },
                'Password must be > 6 characters long'
            ),
            confirmPass: (value, values) =>
                value !== values.password ? 'Password did not match' : null,
        },
    })

    const handleRegister = async (values) => {
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserName: values.username,
                    Email: values.email,
                    Password: values.password,
                }),
            })

            if (response.ok) {
                // API return Results.Empty
                console.log('Register Success')
                form.reset()
                setSuccess('Registration successful! Switching to login tab...')
                setTimeout(() => {
                    onSwitchToLogin()
                }, 2500)
            } else {
                // API return BadRequest(create.Errors)
                const errorData = await response.json()
                const errorMessages = errorData
                    .map((err) => err.description)
                    .join('\n')
                setError(
                    errorMessages || 'Registration failed. Please try again.'
                )
            }
        } catch (err) {
            console.error('Network error:', err)
            setError('A network error occurred. Please try again.')
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className="flex flex-col w-[400px] mx-auto px-[20px]">
                {/* Display success message */}
                {success && (
                    <Notification
                        icon={<Check size={20} />}
                        color="green"
                        title="Registration Success"
                        onClose={() => setSuccess(null)}
                        className="mb-4"
                    >
                        {success}
                    </Notification>
                )}
                {/* Display Error */}
                {error && (
                    <Notification
                        color="red"
                        title="Registration Error"
                        onClose={() => setError(null)}
                        className="mb-4"
                    >
                        <div style={{ whiteSpace: 'pre-wrap' }}>{error}</div>
                    </Notification>
                )}

                <p className="text-center">with</p>
                {/* Sign up via google/apple */}
                <div className="grid grid-cols-2 gap-4 p-[10px] ">
                    <Link
                        className="flex justify-center cursor-pointer  pt-[5px] pb-[5px] bg-white rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        to={''}
                    >
                        <img
                            className="w-[30px] h-[30px] "
                            src={google}
                            alt=""
                        />
                    </Link>
                    <Link
                        className="flex justify-center cursor-pointer  pt-[5px] pb-[5px] bg-black rounded-full shadow-[0px_0px_30px_10px_rgba(0,_0,_0,_0.1)]"
                        to={''}
                    >
                        <img className="w-[30px] h-[30px]" src={apple} alt="" />
                    </Link>
                </div>
                <div className="flex items-center w-full">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                {/* Register form */}
                <div className="">
                    <form onSubmit={form.onSubmit(handleRegister)}>
                        <TextInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Username"
                            disabled={isLoading}
                            key={form.key('username')}
                            {...form.getInputProps('username')}
                        />
                        <TextInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Your email"
                            rightSection={<AtSign size={20} />}
                            disabled={isLoading}
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Password"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            className="my-3"
                            size="md"
                            radius="xl"
                            withAsterisk
                            placeholder="Confirm Password"
                            disabled={isLoading}
                            key={form.key('confirmPass')}
                            {...form.getInputProps('confirmPass')}
                        />
                        <Checkbox
                            label="Agree terms and conditions"
                            size="xs"
                            disabled={isLoading}
                            key={form.key('termsOfService')}
                            {...form.getInputProps('termsOfService', {
                                type: 'checkbox',
                            })}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            className="my-3"
                            size="md"
                            radius="xl"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing up...' : 'Sign up'}{' '}
                        </Button>
                    </form>
                    <p className="text-center">
                        Already have an account?{' '}
                        <a
                            className="text-blue-600 font-bold "
                            href=""
                            onClick={(e) => {
                                e.preventDefault()
                                onSwitchToLogin()
                            }}
                        >
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default RegisterPage
