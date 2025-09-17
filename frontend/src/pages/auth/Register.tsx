import React, { useState } from "react";
import Header from "../../components/custom/Header";
import { useTheme } from "../../context/themecontext";
import { useNavigate } from "react-router-dom";
import { EyeClosed, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { z } from "zod";

// SVG Animation Components
const AnimatedCamera = ({ delay = 0, x = 0, y = 0 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      values={`${x},${y}; ${x},${y - 10}; ${x},${y}`}
      dur="3s"
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
    <rect
      x="0"
      y="10"
      width="40"
      height="25"
      rx="3"
      fill="rgba(245, 245, 233, 0.3)"
      stroke="rgba(245, 245, 233, 0.5)"
      strokeWidth="1"
    />
    <circle
      cx="20"
      cy="22"
      r="8"
      fill="none"
      stroke="rgba(245, 245, 233, 0.6)"
      strokeWidth="2"
    />
    <circle cx="20" cy="22" r="5" fill="rgba(245, 245, 233, 0.4)" />
    <rect
      x="15"
      y="5"
      width="10"
      height="8"
      rx="2"
      fill="rgba(245, 245, 233, 0.4)"
    />
    <circle cx="32" cy="15" r="2" fill="rgba(245, 245, 233, 0.5)" />
  </g>
);

// const AnimatedPerson = ({ delay = 0, x = 0, y = 0 }) => (
//   <g transform={`translate(${x}, ${y})`}>
//     <animateTransform
//       attributeName="transform"
//       attributeType="XML"
//       type="translate"
//       values={`${x},${y}; ${x + 5},${y}; ${x},${y}`}
//       dur="4s"
//       begin={`${delay}s`}
//       repeatCount="indefinite"
//     />
//     {/* Head */}
//     <circle
//       cx="20"
//       cy="15"
//       r="8"
//       fill="rgba(245, 245, 233, 0.3)"
//       stroke="rgba(245, 245, 233, 0.5)"
//       strokeWidth="1"
//     />
//     {/* Hat */}
//     <ellipse cx="20" cy="10" rx="10" ry="4" fill="rgba(245, 245, 233, 0.4)" />
//     {/* Body */}
//     <rect
//       x="12"
//       y="23"
//       width="16"
//       height="25"
//       rx="3"
//       fill="rgba(245, 245, 233, 0.3)"
//       stroke="rgba(245, 245, 233, 0.4)"
//       strokeWidth="1"
//     />
//     {/* Arms */}
//     <rect
//       x="5"
//       y="25"
//       width="12"
//       height="4"
//       rx="2"
//       fill="rgba(245, 245, 233, 0.3)"
//     />
//     <rect
//       x="23"
//       y="25"
//       width="12"
//       height="4"
//       rx="2"
//       fill="rgba(245, 245, 233, 0.3)"
//     />
//     {/* Legs */}
//     <rect
//       x="14"
//       y="45"
//       width="5"
//       height="15"
//       rx="2"
//       fill="rgba(245, 245, 233, 0.3)"
//     />
//     <rect
//       x="21"
//       y="45"
//       width="5"
//       height="15"
//       rx="2"
//       fill="rgba(245, 245, 233, 0.3)"
//     />
//   </g>
// );

const AnimatedArtifact = ({ delay = 0, x = 0, y = 0, type = "vase" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      values="0; 5; -5; 0"
      dur="6s"
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
    {type === "vase" ? (
      <>
        <ellipse
          cx="20"
          cy="35"
          rx="12"
          ry="5"
          fill="rgba(245, 245, 233, 0.3)"
        />
        <rect
          x="12"
          y="15"
          width="16"
          height="20"
          rx="2"
          fill="rgba(245, 245, 233, 0.3)"
          stroke="rgba(245, 245, 233, 0.4)"
          strokeWidth="1"
        />
        <ellipse
          cx="20"
          cy="15"
          rx="8"
          ry="3"
          fill="rgba(245, 245, 233, 0.4)"
        />
        <rect
          x="18"
          y="10"
          width="4"
          height="8"
          rx="1"
          fill="rgba(245, 245, 233, 0.4)"
        />
      </>
    ) : (
      <>
        <rect
          x="8"
          y="20"
          width="24"
          height="16"
          rx="2"
          fill="rgba(245, 245, 233, 0.3)"
          stroke="rgba(245, 245, 233, 0.4)"
          strokeWidth="1"
        />
        <rect
          x="10"
          y="22"
          width="20"
          height="12"
          fill="rgba(245, 245, 233, 0.2)"
        />
        <line
          x1="12"
          y1="24"
          x2="28"
          y2="24"
          stroke="rgba(245, 245, 233, 0.4)"
          strokeWidth="1"
        />
        <line
          x1="12"
          y1="27"
          x2="25"
          y2="27"
          stroke="rgba(245, 245, 233, 0.4)"
          strokeWidth="1"
        />
        <line
          x1="12"
          y1="30"
          x2="22"
          y2="30"
          stroke="rgba(245, 245, 233, 0.4)"
          strokeWidth="1"
        />
      </>
    )}
  </g>
);

const AnimatedFilmReel = ({ delay = 0, x = 0, y = 0 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      values="0; 360"
      dur="8s"
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
    <circle
      cx="20"
      cy="20"
      r="15"
      fill="none"
      stroke="rgba(245, 245, 233, 0.4)"
      strokeWidth="2"
    />
    <circle
      cx="20"
      cy="20"
      r="8"
      fill="none"
      stroke="rgba(245, 245, 233, 0.5)"
      strokeWidth="1"
    />
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <circle
        key={i}
        cx={20 + 10 * Math.cos((angle * Math.PI) / 180)}
        cy={20 + 10 * Math.sin((angle * Math.PI) / 180)}
        r="3"
        fill="rgba(245, 245, 233, 0.3)"
      />
    ))}
  </g>
);

const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      {/* Floating background icons */}
      {[...Array(8)].map((_, i) => (
        <g key={i} opacity="0.1">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values={`${Math.random() * 500},${Math.random() * 800}; ${
              Math.random() * 500
            },${Math.random() * 800 - 50}; ${Math.random() * 500},${
              Math.random() * 800
            }`}
            dur={`${15 + Math.random() * 10}s`}
            repeatCount="indefinite"
          />
          <AnimatedCamera delay={i * 2} x={0} y={0} />
        </g>
      ))}

      {[...Array(6)].map((_, i) => (
        <g key={i} opacity="0.08">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values={`${Math.random() * 500},${Math.random() * 800}; ${
              Math.random() * 500
            },${Math.random() * 800 - 30}; ${Math.random() * 500},${
              Math.random() * 800
            }`}
            dur={`${20 + Math.random() * 15}s`}
            repeatCount="indefinite"
          />
          <AnimatedArtifact
            delay={i * 3}
            x={0}
            y={0}
            type={i % 2 === 0 ? "vase" : "scroll"}
          />
        </g>
      ))}

      {[...Array(4)].map((_, i) => (
        <g key={i} opacity="0.06">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values={`${Math.random() * 500},${Math.random() * 800}; ${
              Math.random() * 500
            },${Math.random() * 800 - 20}; ${Math.random() * 500},${
              Math.random() * 800
            }`}
            dur={`${25 + Math.random() * 10}s`}
            repeatCount="indefinite"
          />
          <AnimatedFilmReel delay={i * 4} x={0} y={0} />
        </g>
      ))}
    </svg>
  </div>
);

// const ForegroundAnimations = () => (
//   <div className="absolute inset-0 pointer-events-none">
//     <svg
//       width="100%"
//       height="100%"
//       xmlns="http://www.w3.org/2000/svg"
//       className="absolute inset-0"
//     >
//       {/* Main featured animations */}
//       <AnimatedCamera delay={1} x={50} y={150} />
//       <AnimatedPerson delay={0} x={80} y={300} />
//       <AnimatedCamera delay={3} x={150} y={100} />
//       <AnimatedArtifact delay={2} x={200} y={250} type="vase" />
//       <AnimatedPerson delay={4} x={120} y={500} />
//       <AnimatedFilmReel delay={1.5} x={300} y={180} />
//       <AnimatedArtifact delay={3.5} x={180} y={400} type="scroll" />
//       <AnimatedCamera delay={2.5} x={250} y={350} />

//       {/* Additional scattered elements */}
//       <AnimatedPerson delay={5} x={60} y={600} />
//       <AnimatedFilmReel delay={4.5} x={320} y={450} />
//       <AnimatedArtifact delay={1} x={40} y={450} type="vase" />
//       <AnimatedCamera delay={4} x={280} y={520} />
//     </svg>
//   </div>
// );

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    username: z.string().trim().min(1, "Username is required."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = () => {
  const [formData, setFormData] = useState<RegisterSchema>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const { themeName, themeColors } = useTheme();
  const homepageGradients = {
    roseFlower:
      "linear-gradient(120deg, #f3f4f5 0%, #ffe5d0 40%, #ffd6e0 80%, #eeeff1 100%)",
    coffee: "linear-gradient(120deg, #B39885 0%, #F5F5E9 60%, #D1C6BB 100%)",
  };
  const cardGradients = {
    roseFlower:
      "linear-gradient(135deg, #e0e7ef 0%, #f3f4f5 60%, #ffe5d0 100%)",
    coffee: "linear-gradient(135deg, #F5F5E9 0%, #B39885 60%, #D1C6BB 100%)",
  };
  const homepageGradient =
    homepageGradients[themeName as keyof typeof homepageGradients] ||
    homepageGradients.roseFlower;
  const cardGradient =
    cardGradients[themeName as keyof typeof cardGradients] ||
    cardGradients.roseFlower;

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (registerError) {
      setRegisterError(null);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = registerSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors: { [key: string]: string } = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path && err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { firstName, lastName, email, username, password } =
        validationResult.data;

      await axios.post(
        "http://localhost:5000/api/auth/register",

        {
          firstName,
          lastName,
          email,
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("Registration successful! You can now log in.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error: ", error);
      let message = "Registration failed. Please try again.";

      if (error.response) {
        const data = error.response.data;
        if (data.detail) {
          message = data.detail;
        } else if (typeof data === "string") {
          message = data;
        }
      } else if (error.request) {
        message = "Network error. Please check your connection.";
      }
      setRegisterError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!registerError) return null;

    return (
      <div
        className="p-3 rounded-md border text-sm"
        style={{ borderColor: themeColors.error, color: themeColors.error }}
      >
        <div className="flex items-center justify-between">
          <span>{registerError}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div
        className="flex min-h-screen relative"
        style={{ background: homepageGradient }}
      >
        <div
          className="hidden lg:flex w-1/2 items-center justify-center p-8 text-white relative overflow-hidden"
          style={{
            background:
              themeName === "coffee"
                ? themeColors.primary
                : "linear-gradient(120deg, #232325 0%, #1b1b1d 80%, #1b1b1d 100%)",
          }}
        >
          <BackgroundPattern />
          <div className="text-center relative z-10">
            <div className="flex items-center">
              <h1 className="text-5xl font-bold font-inter mr-2">Welcome to</h1>
              <h2 className="text-6xl font-bold font-inter bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Past Lens
              </h2>
            </div>
            <p className="text-xl opacity-90 mb-2">
              Create an account to get started
            </p>
            <p className="text-lg opacity-70">
              Share your story and explore history
            </p>
            <div className="mt-8 flex justify-center space-x-8">
              <div className="w-3 h-3 rounded-full bg-yellow-200 animate-pulse"></div>
              <div
                className="w-3 h-3 rounded-full bg-orange-200 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full bg-yellow-200 animate-pulse"
                style={{ animationDelay: "1s" }}
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
              boxShadow: themeColors.cardShadow || "0 8px 32px #64646422",
            }}
          >
            <form
              onSubmit={handleRegister}
              className="w-full flex flex-col gap-5 mt-8"
            >
              <div>
                <h2
                  className="text-3xl font-extrabold mb-2 text-center"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Register
                </h2>
                <p
                  className="text-sm mt-1 text-center"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Enter your details to create a new account
                </p>
              </div>

              {renderErrorMessage()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="firstName"
                    className="font-semibold text-sm font-inter"
                    style={{ color: themeColors.text || themeColors.primary }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    autoComplete="off"
                    placeholder="e.g. John"
                    onChange={handleInputChange}
                    className="p-4 border rounded-md outline-none focus:ring-2"
                    style={{
                      borderColor: errors.firstName
                        ? themeColors.error
                        : "#6b4f2a",
                      boxShadow: errors.firstName
                        ? `0 0 0 2px ${themeColors.error}`
                        : undefined,
                    }}
                  />
                  <p
                    className="text-xs min-h-[1rem] font-inter"
                    style={{ color: themeColors.error }}
                  >
                    {errors.firstName}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="lastName"
                    className="font-semibold text-sm font-inter"
                    style={{ color: themeColors.text || themeColors.primary }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    autoComplete="off"
                    placeholder="e.g. Doe"
                    onChange={handleInputChange}
                    className="p-4 border rounded-md outline-none focus:ring-2"
                    style={{
                      borderColor: errors.lastName
                        ? themeColors.error
                        : "#6b4f2a",
                      boxShadow: errors.lastName
                        ? `0 0 0 2px ${themeColors.error}`
                        : undefined,
                    }}
                  />
                  <p
                    className="text-xs min-h-[1rem] font-inter"
                    style={{ color: themeColors.error }}
                  >
                    {errors.lastName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="font-semibold text-sm font-inter"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  autoComplete="off"
                  placeholder="e.g. you@example.com"
                  onChange={handleInputChange}
                  className="p-4 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: errors.email ? themeColors.error : "#6b4f2a",
                    boxShadow: errors.email
                      ? `0 0 0 2px ${themeColors.error}`
                      : undefined,
                  }}
                />
                <p
                  className="text-xs min-h-[1rem] font-inter"
                  style={{ color: themeColors.error }}
                >
                  {errors.email}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className="font-semibold text-sm font-inter"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  autoComplete="off"
                  placeholder="e.g. johndoe123"
                  onChange={handleInputChange}
                  className="p-4 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: errors.username
                      ? themeColors.error
                      : "#6b4f2a",
                    boxShadow: errors.username
                      ? `0 0 0 2px ${themeColors.error}`
                      : undefined,
                  }}
                />
                <p
                  className="text-xs min-h-[1rem] font-inter"
                  style={{ color: themeColors.error }}
                >
                  {errors.username}
                </p>
              </div>

              <div className="flex flex-col gap-1 relative">
                <label
                  htmlFor="password"
                  className="font-semibold text-sm font-inter"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  autoComplete="off"
                  name="password"
                  placeholder="Enter a secure password"
                  onChange={handleInputChange}
                  className="p-3 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: errors.password
                      ? themeColors.error
                      : "#6b4f2a",
                    boxShadow: errors.password
                      ? `0 0 0 2px ${themeColors.error}`
                      : undefined,
                  }}
                />
                {formData.password && (
                  <span
                    className="absolute right-3 top-9 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ color: themeColors.text || themeColors.primary }}
                  >
                    {showPassword ? (
                      <EyeClosed className="text-gray-500" size={18} />
                    ) : (
                      <Eye className="text-gray-500" size={18} />
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

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="font-semibold text-sm font-inter"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  autoComplete="off"
                  placeholder="Re-enter your password"
                  onChange={handleInputChange}
                  className="p-3 border rounded-md outline-none focus:ring-2"
                  style={{
                    borderColor: errors.confirmPassword
                      ? themeColors.error
                      : "#6b4f2a",
                    boxShadow: errors.confirmPassword
                      ? `0 0 0 2px ${themeColors.error}`
                      : undefined,
                  }}
                />
                <p
                  className="text-xs min-h-[1rem] font-inter"
                  style={{ color: themeColors.error }}
                >
                  {errors.confirmPassword}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`cursor-pointer mt-2 w-full font-semibold py-3 rounded-full transition-all duration-300 border-2 text-lg`}
                style={{
                  background: themeColors.buttonBg || themeColors.primary,
                  color: themeColors.buttonText || themeColors.cardBackground,
                  borderColor: themeColors.buttonBg || themeColors.primary,
                  opacity: isLoading ? 0.5 : 1,
                  boxShadow: themeColors.cardShadow || "0 2px 8px #1b1b1d22",
                }}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>

              <div className="flex items-center justify-center text-sm mt-2 font-inter">
                <span
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  className="ml-1 font-semibold hover:underline"
                  onClick={() => {
                    navigate("/login");
                  }}
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Log in
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

export default Register;
