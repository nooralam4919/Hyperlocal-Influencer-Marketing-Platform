/*
 * CHANGES & REASONS:
 *
 * 1. Added `await` to `authService.getCurrentUser()`
 *    REASON: It's an async function but was called without await,
 *            so `userData` was a Promise object, not the actual user → always truthy.
 *
 * 2. Fixed variable name: `currentUser` → `userData` in dispatch
 *    REASON: The variable is named `userData` in this scope.
 *            `currentUser` was undefined → crash on login.
 *
 * 3. Removed unused `React` import
 *    REASON: Not needed with Vite JSX transform.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import authService from "../Appwrite/Auth";
import { login } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function GetstartPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const CreateSignInAccount = async (data) => {
    setError("");

    try {
      const session = await authService.login(data);

      if (session) {
        const userData = await authService.getCurrentUser();

        if (userData) {
          const role = userData.prefs?.role;

          dispatch(
            login({
              userData: {
                $id: userData.$id,
                name: userData.name,
                email: userData.email,
                prefs: userData.prefs,
              },
              role,
            })
          );

          if (role === "owner") {
            navigate("/owner-dashboard");
          } else if (role === "creator") {
            navigate("/creator-dashboard");
          } else {
            // No role means old account — created before prefs fix
            setError("No role found. Please delete this account and sign up again.");
          }
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C08552]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#8C5A3C]/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#C08552]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-[#C08552]" size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#4B2E2B]">
            Welcome Back
          </h1>

          <p className="text-[#8C5A3C] mt-2">
            Login to continue your journey
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(CreateSignInAccount)}>

          {/* Name */}
          <div className="relative mb-4">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              type="text"
              placeholder="Full Name"
              className="pl-12"
              {...register("name")}
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              type="email"
              placeholder="Email Address"
              className="pl-12"
              {...register("email", {
                required: "Email is required",
              })}
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-12 pr-12"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mb-4">
              {errors.password.message}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-[#C08552] hover:bg-[#ad7142] text-white py-3.5 rounded-xl font-semibold transition-all duration-300"
          >
            Login
          </motion.button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#C08552] font-semibold cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default GetstartPage;



// User enters email/password
//           │
//           ▼
// CreateSignInAccount(data)
//           │
//           ▼
// authService.login(data)
//           │
//           ▼
// Session Created
//           │
//           ▼
// authService.getCurrentUser()
//           │
//           ▼
// userData returned
//           │
//           ▼
// role = userData.prefs.role
//           │
//           ▼
// dispatch(login(...))
//           │
//           ▼
// Redux Store Updated
//           │
//           ▼
// role checked
//           │
//       ┌───┴────┐
//       │        │
//  owner      creator
//       │        │
//       ▼        ▼
// /owner-    /creator-
// dashboard  dashboard