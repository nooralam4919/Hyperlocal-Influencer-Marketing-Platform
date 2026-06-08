/*
 * CHANGES & REASONS:
 *
 * 1. Removed unused `React` import
 *    REASON: Not needed with Vite JSX transform.
 *
 * 2. Navigate uses hardcoded "/owner-dashboard" instead of reading role from prefs
 *    REASON: After createAccount(), updatePrefs() may not be reflected immediately
 *            in getCurrentUser() — so prefs.role could be empty/undefined.
 *            Since this is the Owner signup page, role is always "owner" here.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail } from "lucide-react";
import authService from "../Appwrite/Auth";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
// REMOVED: unused Owner_viewpage import — navigated via router, not rendered here
function CreatOwner() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const signup = async (data) => {
    setError("");

    try {
      // createAccount() returns fresh user with prefs already set
      const currentUser = await authService.createAccount({
        ...data,
        role: "owner",
      });

      if (currentUser) {
        dispatch(login({
          userData: {
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            prefs: currentUser.prefs,
          },
          role: currentUser.prefs?.role,
        }));

        navigate("/owner-dashboard");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] relative overflow-hidden">

      {/* Background */}
      <div className="absolute w-[500px] h-[500px] bg-[#C08552]/20 rounded-full blur-3xl top-[-120px] left-[-120px]"></div>

      <div className="absolute w-[380px] h-[380px] bg-[#8C5A3C]/20 rounded-full blur-3xl bottom-[-120px] right-[-120px]"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[92%] max-w-lg bg-white shadow-2xl rounded-3xl p-14 border border-[#C08552]/20"
      >

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-[#4B2E2B] mb-2">
          Owner Signup
        </h1>

        <p className="text-center text-[#8C5A3C] mb-8">
          Join and start your journey
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 border border-[#C08552]/30 py-3 rounded-xl mb-5 hover:bg-[#FFF8F0] transition">

          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="google"
          />

          Continue with Google

        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">

          <div className="flex-1 h-[1px] bg-[#C08552]/30"></div>

          <p className="text-sm text-[#8C5A3C]">
            OR
          </p>

          <div className="flex-1 h-[1px] bg-[#C08552]/30"></div>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(signup)}
          className="space-y-4"
        >

          {/* Name */}
          <div>

            <Input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}

          </div>

          {/* Email */}
          <div className="relative">

            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5A3C] z-10"
              size={18}
            />

            <Input
              type="email"
              placeholder="Email Address"
              className="pl-12"
              {...register("email", {
                required: "Email is required",

                pattern: {
                  value:
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message:
                    "Email address must be valid",
                },
              })}
            />

          </div>

          {errors.email && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.email.message}
            </p>
          )}

          {/* Password */}
          <div className="relative">

            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              className="pr-12"
              {...register("password", {
                required:
                  "Password is required",

                minLength: {
                  value: 8,
                  message:
                    "Minimum 8 characters required",
                },
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C5A3C]"
            >

              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}

            </button>

          </div>

          {errors.password && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.password.message}
            </p>
          )}

          {/* Confirm Password */}
          <div className="relative">

            <Input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              className="pr-12"
              {...register("confirmPassword", {
                required:
                  "Confirm password is required",

                validate: (value) =>
                  value === watch("password") ||
                  "Passwords do not match",
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C5A3C]"
            >

              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}

            </button>

          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full bg-[#C08552] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#8C5A3C] transition"
          >
            Create Account
          </motion.button>

        </form>

      </motion.div>

    </div>
  );
}

export default CreatOwner;