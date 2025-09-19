import React, { useState } from "react";
import Header from "../../components/custom/Header";
import { useTheme } from "../../context/themecontext";
import { useNavigate } from "react-router-dom";
import { EyeClosed, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/authcontext";
import { z } from "zod";

// Theme selection (default to roseFlower)
const homepageGradients = {
  roseFlower:
    "linear-gradient(120deg, #f3f4f5 0%, #ffe5d0 40%, #ffd6e0 80%, #eeeff1 100%)",
  coffee: "linear-gradient(120deg, #B39885 0%, #F5F5E9 60%, #D1C6BB 100%)",
};
const cardGradients = {
  roseFlower: "linear-gradient(135deg, #e0e7ef 0%, #f3f4f5 60%, #ffe5d0 100%)",
  coffee: "linear-gradient(135deg, #F5F5E9 0%, #B39885 60%, #D1C6BB 100%)",
};

// Micro Animation (emoji sparkles)
const MicroAnimation = () => (
  <>
    <span
      style={{
        position: "absolute",
        left: 24,
        top: 24,
        fontSize: "1.5rem",
        opacity: 0.18,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      ✨
    </span>
    <span
      style={{
        position: "absolute",
        right: 32,
        top: 32,
        fontSize: "1.2rem",
        opacity: 0.18,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      💡
    </span>
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: 80,
        transform: "translateX(-50%)",
        fontSize: "4rem",
        opacity: 0.12,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      ❤️
    </span>
  </>
);

// Simple JWT decode function to replace the external library
const jwtDecode = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginSchema = z.infer<typeof loginSchema>;

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

const AnimatedPerson = ({ delay = 0, x = 0, y = 0 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      values={`${x},${y}; ${x + 5},${y}; ${x},${y}`}
      dur="4s"
      begin={`${delay}s`}
      repeatCount="indefinite"
    />
    {/* Head */}
    <circle
      cx="20"
      cy="15"
      r="8"
      fill="rgba(245, 245, 233, 0.3)"
      stroke="rgba(245, 245, 233, 0.5)"
      strokeWidth="1"
    />
    {/* Hat */}
    <ellipse cx="20" cy="10" rx="10" ry="4" fill="rgba(245, 245, 233, 0.4)" />
    {/* Body */}
    <rect
      x="12"
      y="23"
      width="16"
      height="25"
      rx="3"
      fill="rgba(245, 245, 233, 0.3)"
      stroke="rgba(245, 245, 233, 0.4)"
      strokeWidth="1"
    />
    {/* Arms */}
    <rect
      x="5"
      y="25"
      width="12"
      height="4"
      rx="2"
      fill="rgba(245, 245, 233, 0.3)"
    />
    <rect
      x="23"
      y="25"
      width="12"
      height="4"
      rx="2"
      fill="rgba(245, 245, 233, 0.3)"
    />
    {/* Legs */}
    <rect
      x="14"
      y="45"
      width="5"
      height="15"
      rx="2"
      fill="rgba(245, 245, 233, 0.3)"
    />
    <rect
      x="21"
      y="45"
      width="5"
      height="15"
      rx="2"
      fill="rgba(245, 245, 233, 0.3)"
    />
  </g>
);

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

const ForegroundAnimations = () => (
  <div className="absolute inset-0 pointer-events-none">
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      {/* Main featured animations */}
      <AnimatedCamera delay={1} x={50} y={150} />
      <AnimatedPerson delay={0} x={80} y={300} />
      <AnimatedCamera delay={3} x={150} y={100} />
      <AnimatedArtifact delay={2} x={200} y={250} type="vase" />
      <AnimatedPerson delay={4} x={120} y={500} />
      <AnimatedFilmReel delay={1.5} x={300} y={180} />
      <AnimatedArtifact delay={3.5} x={180} y={400} type="scroll" />
      <AnimatedCamera delay={2.5} x={250} y={350} />

      {/* Additional scattered elements */}
      <AnimatedPerson delay={5} x={60} y={600} />
      <AnimatedFilmReel delay={4.5} x={320} y={450} />
      <AnimatedArtifact delay={1} x={40} y={450} type="vase" />
      <AnimatedCamera delay={4} x={280} y={520} />
    </svg>
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState<LoginSchema>({
    email: "",
    password: "",
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
      name === "login_email"
        ? "email"
        : name === "login_password"
          ? "password"
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
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { email, password } = validationResult.data;

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          emailOrUsername: email,
          password,
          remember_me: rememberMe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Destructure 'token' from the response data and rename it to 'access_token'
      const { token: access_token, refresh_token } = response.data;

      if (access_token) {
        const decodedToken: any = jwtDecode(access_token);
        const userData = {
          id: decodedToken.user_id || decodedToken.sub,
          user_name:
            decodedToken.user_name || decodedToken.name || decodedToken.email,
          user_email: decodedToken.user_email || decodedToken.email,
          role: decodedToken.role,
          accessToken: access_token,
          refreshToken: refresh_token,
        };

        console.log("Decoded user data from token:", userData);

        login();

        toast.success("Login successful!");
        setFormData({
          email: "",
          password: "",
        });
        setErrors({});

        navigate("/admin");
      } else {
        throw new Error("Access token not received from server.");
      }
    } catch (error: any) {
      console.error("Login error: ", error);
      let message = error?.response?.data?.message || "Login failed. Please try again.";
      let showContactSupport = false;

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 401 && data.detail) {
          message = data.detail;
          const detail = data.detail.toLowerCase();
          if (
            detail.includes("awaiting activation") ||
            detail.includes("deactivated") ||
            detail.includes("nolonger exists")
          ) {
            showContactSupport = true;
          }
        } else if (status >= 500) {
          message = "Server error. Please try again later.";
        } else if (data.detail) {
          message = data.detail;
        }
      } else if (error.request) {
        message = "Network error. Please check your connection.";
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
        style={{ borderColor: themeColors.error, color: themeColors.error }}
      >
        <div className="flex items-center justify-between">
          <span>{loginError.message}</span>
          {loginError.showContactSupport && (
            <button
              type="button"
              className="ml-2 underline font-medium hover:no-underline"
              onClick={() => {
                window.location.href = "mailto:support@company.com";
              }}
              style={{ color: themeColors.text || themeColors.primary }}
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
              themeName === "coffee"
                ? themeColors.primary
                : "linear-gradient(120deg, #232325 0%, #1b1b1d 80%, #1b1b1d 100%)",
          }}
        >
          <BackgroundPattern />
          {/* <ForegroundAnimations /> */}

          <div className="text-center relative z-10">
            <div className="flex items-center">
              <h1 className="text-5xl font-bold font-inter mr-2">Welcome to</h1>
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
              onSubmit={handleLogin}
              className="w-full flex flex-col gap-5 mt-8"
            >
              <div>
                <h2
                  className="text-3xl font-extrabold mb-2 text-center"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Log in
                </h2>
                <p
                  className="text-sm mt-1 text-center"
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Welcome to Past Lens, enter your credentials to explore
                  history
                </p>
              </div>

              {renderErrorMessage()}

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
                  name="login_email"
                  value={formData.email}
                  autoComplete="off"
                  placeholder="e.g. you@example.com"
                  onChange={handleInputChange}
                  className={`p-4 border rounded-md outline-none focus:ring-2`}
                  style={{
                    borderColor: errors.email ? themeColors.error : "#6b4f2a",
                    boxShadow: `0 0 0 2px ${
                      errors.email ? themeColors.error : ""
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
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  autoComplete="off"
                  name="login_password"
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                  className={`p-3 border rounded-md outline-none focus:ring-2`}
                  style={{
                    borderColor: errors.password
                      ? themeColors.error
                      : "#6b4f2a",
                    boxShadow: `0 0 0 2px ${
                      errors.password ? themeColors.error : ""
                    }
                    }`,
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

              <div
                className="flex items-center justify-between text-sm font-inter"
                style={{ color: themeColors.text || themeColors.primary }}
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-current cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  onClick={() => navigate("/forgot-password")}
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
                  background: themeColors.buttonBg || themeColors.primary,
                  color: themeColors.buttonText || themeColors.cardBackground,
                  borderColor: themeColors.buttonBg || themeColors.primary,
                  opacity: isLoading ? 0.5 : 1,
                  boxShadow: themeColors.cardShadow || "0 2px 8px #1b1b1d22",
                }}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>

              <div className="flex items-center justify-center text-sm mt-2 font-inter">
                <span
                  style={{ color: themeColors.text || themeColors.primary }}
                >
                  Don't have an account?{" "}
                </span>
                <button
                  type="button"
                  className="ml-1 font-semibold hover:underline"
                  onClick={() => {
                    navigate("/signup");
                  }}
                  style={{ color: themeColors.text || themeColors.primary }}
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
