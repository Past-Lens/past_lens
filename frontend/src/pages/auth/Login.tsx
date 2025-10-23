import React, { useState } from 'react';
import Header from '../../components/custom/Header';
import { useTheme } from '../../context/themecontext';
import { useNavigate } from 'react-router-dom';
import { EyeClosed, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/authcontext';
import useUserStore from '../../stores/userStore';
import { z } from 'zod';
import axInstance from '@/utils/axiosInstance';
import {
    BackgroundPattern,
    ForegroundAnimations,
    MicroAnimation,
} from '@/components/custom/animations';

// Theme selection (default to roseFlower)
const homepageGradients = {
    roseFlower:
        'linear-gradient(120deg, #f3f4f5 0%, #ffe5d0 40%, #ffd6e0 80%, #eeeff1 100%)',
    coffee: 'linear-gradient(120deg, #B39885 0%, #F5F5E9 60%, #D1C6BB 100%)',
};
const cardGradients = {
    roseFlower:
        'linear-gradient(135deg, #e0e7ef 0%, #f3f4f5 60%, #ffe5d0 100%)',
    coffee: 'linear-gradient(135deg, #F5F5E9 0%, #B39885 60%, #D1C6BB 100%)',
};

// Simple JWT decode function to replace the external library
export const jwtDecode = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const loginSchema = z.object({
    login_identifier: z
        .string()
        .trim()
        .min(3, 'Username or Email is required')
        .refine(
            (val) => val.includes('@') || /^[a-zA-Z0-9_]+$/.test(val),
            'Invalid username or Email'
        ),
    password: z.string().min(1, 'Password is required.'),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login = () => {
    const [formData, setFormData] = useState<LoginSchema>({
        login_identifier: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<{
        message: string;
        showContactSupport: boolean;
    } | null>(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const field =
            name === 'login_identifier'
                ? 'login_identifier'
                : name === 'login_password'
                  ? 'password'
                  : name;

        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }

        if (loginError) {
            setLoginError(null);
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationResult = loginSchema.safeParse(formData);

        if (!validationResult.success) {
            const newErrors: { [key: string]: string } = {};
            validationResult.error.issues.forEach((err) => {
                if (err.path && err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(newErrors);
            console.log(newErrors);
            toast.error('Please fix the highlighted fields.');
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const { login_identifier, password } = validationResult.data;

            const response = await axInstance.post('/auth/login', {
                emailOrUsername: login_identifier,
                password,
                remember_me: rememberMe,
            });

            // Destructure 'token' from the response data and rename it to 'access_token'
            const { token: access_token, refresh_token } = response.data;

            if (access_token) {
                const decodedToken: any = jwtDecode(access_token);
                const userData = {
                    id: decodedToken.user_id || decodedToken.sub,
                    user_name:
                        decodedToken.user_name ||
                        decodedToken.name ||
                        decodedToken.email,
                    user_email: decodedToken.user_email || decodedToken.email,
                    role: decodedToken.role,
                    first_name: decodedToken.first,
                    last_name: decodedToken.last,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                };

                useUserStore.getState().setUser(userData);

                // call auth context adapter (keeps existing behavior for other components)
                login(userData, rememberMe);

                toast.success('Login successful!');
                setFormData({
                    login_identifier: '',
                    password: '',
                });
                setErrors({});
                navigate(
                    (userData.role as string).toLocaleLowerCase() === 'admin'
                        ? '/admin'
                        : '/user/profile'
                );
            } else {
                throw new Error('Access token not received from server.');
            }
        } catch (error: any) {
            console.error('Login error: ', error);
            let message =
                error?.response?.data?.message ||
                'Login failed. Please try again.';
            let showContactSupport = false;

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 401 && data.detail) {
                    message = data.detail;
                    const detail = data.detail.toLowerCase();
                    if (
                        detail.includes('awaiting activation') ||
                        detail.includes('deactivated') ||
                        detail.includes('nolonger exists')
                    ) {
                        showContactSupport = true;
                    }
                } else if (status >= 500) {
                    message = 'Server error. Please try again later.';
                } else if (data.detail) {
                    message = data.detail;
                }
            } else if (error.request) {
                message = 'Network error. Please check your connection.';
            }
            setLoginError({
                message: message,
                showContactSupport: showContactSupport,
            });
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderErrorMessage = () => {
        if (!loginError) return null;

        return (
            <div
                className="p-3 rounded-md border border-red-200 bg-red-50 text-sm"
                style={{
                    borderColor: themeColors.error,
                    color: themeColors.error,
                }}
            >
                <div className="flex items-center justify-between">
                    <span>{loginError.message}</span>
                    {loginError.showContactSupport && (
                        <button
                            type="button"
                            className="ml-2 underline font-medium hover:no-underline"
                            onClick={() => {
                                window.location.href =
                                    'mailto:support@company.com';
                            }}
                            style={{
                                color: themeColors.text || themeColors.primary,
                            }}
                        >
                            Contact Support
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const { themeName, themeColors } = useTheme();
    const homepageGradient =
        homepageGradients[themeName as keyof typeof homepageGradients] ||
        homepageGradients.roseFlower;
    const cardGradient =
        cardGradients[themeName as keyof typeof cardGradients] ||
        cardGradients.roseFlower;

    return (
        <>
            <Header />
            <div
                className="flex min-h-screen relative"
                style={{ background: homepageGradient }}
            >
                <ForegroundAnimations />
                <MicroAnimation />
                <div
                    className="hidden lg:flex w-1/2 items-center justify-center p-8 text-white relative overflow-hidden"
                    style={{
                        background:
                            themeName === 'coffee'
                                ? themeColors.primary
                                : 'linear-gradient(120deg, #232325 0%, #1b1b1d 80%, #1b1b1d 100%)',
                    }}
                >
                    <BackgroundPattern />
                    <ForegroundAnimations />

                    <div className="text-center relative z-10">
                        <div className="flex items-center">
                            <h1 className="text-5xl font-bold font-inter mr-2">
                                Welcome to
                            </h1>
                            <h2 className="text-6xl font-bold font-inter bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                                Past Lens
                            </h2>
                        </div>
                        <p className="text-xl opacity-90 mb-2">
                            Your Digital Museum Experience
                        </p>
                        <p className="text-lg opacity-70">
                            Explore history through the lens of time
                        </p>

                        {/* Decorative elements */}
                        <div className="mt-8 flex justify-center space-x-8">
                            <div className="w-3 h-3 rounded-full bg-yellow-200 animate-pulse"></div>
                            <div
                                className="w-3 h-3 rounded-full bg-orange-200 animate-pulse"
                                style={{ animationDelay: '0.5s' }}
                            ></div>
                            <div
                                className="w-3 h-3 rounded-full bg-yellow-200 animate-pulse"
                                style={{ animationDelay: '1s' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div
                        className="w-full max-w-md p-8 rounded-2xl shadow-xl border relative mt-12"
                        style={{
                            background: cardGradient,
                            borderColor: themeColors.border,
                            boxShadow:
                                themeColors.cardShadow ||
                                '0 8px 32px #64646422',
                        }}
                    >
                        <form
                            onSubmit={handleLogin}
                            className="w-full flex flex-col gap-5 mt-8"
                        >
                            <div>
                                <h2
                                    className="text-3xl font-extrabold mb-2 text-center"
                                    style={{
                                        color:
                                            themeColors.text ||
                                            themeColors.primary,
                                    }}
                                >
                                    Log in
                                </h2>
                                <p
                                    className="text-sm mt-1 text-center"
                                    style={{
                                        color:
                                            themeColors.text ||
                                            themeColors.primary,
                                    }}
                                >
                                    Welcome to Past Lens, enter your credentials
                                    to explore history
                                </p>
                            </div>

                            {renderErrorMessage()}

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="email"
                                    className="font-semibold text-sm font-inter"
                                    style={{
                                        color:
                                            themeColors.text ||
                                            themeColors.primary,
                                    }}
                                >
                                    E-mail or Username
                                </label>
                                <input
                                    id="login_identifier"
                                    type="text"
                                    name="login_identifier"
                                    value={formData.login_identifier}
                                    autoComplete="off"
                                    placeholder="e.g. you@example.com"
                                    onChange={handleInputChange}
                                    className={`p-4 border rounded-md outline-none focus:ring-2`}
                                    style={{
                                        borderColor: errors.email
                                            ? themeColors.error
                                            : '#6b4f2a',
                                        boxShadow: `0 0 0 2px ${
                                            errors.email
                                                ? themeColors.error
                                                : ''
                                        }
                    }`,
                                    }}
                                />
                                <p
                                    className="text-xs min-h-[1rem] font-inter"
                                    style={{ color: themeColors.error }}
                                >
                                    {errors.email}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 relative">
                                <label
                                    htmlFor="password"
                                    className="font-semibold text-sm font-inter"
                                    style={{
                                        color:
                                            themeColors.text ||
                                            themeColors.primary,
                                    }}
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    autoComplete="off"
                                    name="login_password"
                                    placeholder="Enter your password"
                                    onChange={handleInputChange}
                                    className={`p-3 border rounded-md outline-none focus:ring-2`}
                                    style={{
                                        borderColor: errors.password
                                            ? themeColors.error
                                            : '#6b4f2a',
                                        boxShadow: `0 0 0 2px ${
                                            errors.password
                                                ? themeColors.error
                                                : ''
                                        }
                    }`,
                                    }}
                                />
                                {formData.password && (
                                    <span
                                        className="absolute right-3 top-9 cursor-pointer"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        style={{
                                            color:
                                                themeColors.text ||
                                                themeColors.primary,
                                        }}
                                    >
                                        {showPassword ? (
                                            <EyeClosed
                                                className="text-gray-500"
                                                size={18}
                                            />
                                        ) : (
                                            <Eye
                                                className="text-gray-500"
                                                size={18}
                                            />
                                        )}
                                    </span>
                                )}
                                <p
                                    className="text-xs min-h-[1rem] font-inter"
                                    style={{ color: themeColors.error }}
                                >
                                    {errors.password}
                                </p>
                            </div>

                            <div
                                className="flex items-center justify-between text-sm font-inter"
                                style={{
                                    color:
                                        themeColors.text || themeColors.primary,
                                }}
                            >
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="accent-current cursor-pointer"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                    />
                                    Remember me
                                </label>
                                <button
                                    onClick={() => navigate('/forgot-password')}
                                    type="button"
                                    className="hover:underline cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`cursor-pointer mt-2 w-full font-semibold py-3 rounded-full transition-all duration-300 border-2 text-lg`}
                                style={{
                                    background:
                                        themeColors.buttonBg ||
                                        themeColors.primary,
                                    color:
                                        themeColors.buttonText ||
                                        themeColors.cardBackground,
                                    borderColor:
                                        themeColors.buttonBg ||
                                        themeColors.primary,
                                    opacity: isLoading ? 0.5 : 1,
                                    boxShadow:
                                        themeColors.cardShadow ||
                                        '0 2px 8px #1b1b1d22',
                                }}
                            >
                                {isLoading ? 'Logging in...' : 'Log in'}
                            </button>

                            <div className="flex items-center justify-center text-sm mt-2 font-inter">
                                <span
                                    style={{
                                        color:
                                            themeColors.text ||
                                            themeColors.primary,
                                    }}
                                >
                                    Don't have an account?{' '}
                                </span>
                                <button
                                    type="button"
                                    className="ml-1 font-semibold hover:underline"
                                    onClick={() => {
                                        navigate('/signup');
                                    }}
                                    style={{
                                        color:
                                            themeColors.text ||
                                            themeColors.primary,
                                    }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <Toaster position="top-center" reverseOrder={false} />
            </div>
        </>
    );
};

export default Login;
