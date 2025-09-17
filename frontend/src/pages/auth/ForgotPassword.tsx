import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { z } from "zod";

// Define the colors based on the provided image
const coffeeColors = {
  primary: "#4F3325", // Dark brown for text and accents
  background: "#B39885", // Muted brown for the background
  cardBackground: "#F5F5E9", // Off-white for the login card
  hover: "#7E5C4E", // A slightly lighter brown for hover effects
  error: "#E53E3E", // Standard red for errors
  border: "#D1C6BB", // Light brown for borders
};

// Zod schema for validating the email input
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [formData, setFormData] = useState<ForgotPasswordSchema>({
    email: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = forgotPasswordSchema.safeParse(formData);

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
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { email } = validationResult.data;

      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.message) {
        setSuccessMessage(response.data.message);
        toast.success(response.data.message);
        setFormData({ email: "" });
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error("Forgot password error: ", error);
      let message = "Failed to send password reset email. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      } else if (error.request) {
        message = "Network error. Please check your connection.";
      }
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = () => {
    if (successMessage) {
      return (
        <div
          className="p-3 rounded-md border text-sm"
          style={{
            borderColor: coffeeColors.primary,
            color: coffeeColors.primary,
            backgroundColor: coffeeColors.cardBackground,
          }}
        >
          <span>{successMessage}</span>
        </div>
      );
    }
    if (errorMessage) {
      return (
        <div
          className="p-3 rounded-md border text-sm"
          style={{ borderColor: coffeeColors.error, color: coffeeColors.error }}
        >
          <span>{errorMessage}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: coffeeColors.background }}
    >
      <div
        className="w-full max-w-md p-8 rounded-lg shadow-xl"
        style={{ backgroundColor: coffeeColors.cardBackground }}
      >
        <form
          onSubmit={handleForgotPassword}
          className="w-full flex flex-col gap-5"
        >
          <div>
            <h2
              className="text-2xl font-bold font-inter"
              style={{ color: coffeeColors.primary }}
            >
              Forgot Password
            </h2>
            <p className="text-sm mt-1">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {renderMessage()}

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-semibold text-sm font-inter"
              style={{ color: coffeeColors.primary }}
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
              className={`p-4 border rounded-md outline-none focus:ring-2`}
              style={{
                borderColor: errors.email
                  ? coffeeColors.error
                  : coffeeColors.border,
                boxShadow: `0 0 0 2px ${errors.email ? coffeeColors.error : ""}`,
              }}
            />
            <p
              className="text-xs min-h-[1rem] font-inter"
              style={{ color: coffeeColors.error }}
            >
              {errors.email}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer mt-2 w-full font-semibold py-2 rounded-md transition-all duration-300 border-2`}
            style={{
              backgroundColor: coffeeColors.primary,
              color: coffeeColors.cardBackground,
              borderColor: coffeeColors.primary,
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? "Sending link..." : "Send Reset Link"}
          </button>

          <div className="flex items-center justify-center text-sm mt-2 font-inter">
            <span style={{ color: coffeeColors.primary }}>
              Remember your password?{" "}
            </span>
            <button
              type="button"
              className="ml-1 font-semibold hover:underline"
              onClick={() => {
                navigate("/login");
              }}
              style={{ color: coffeeColors.primary }}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ForgotPassword;
