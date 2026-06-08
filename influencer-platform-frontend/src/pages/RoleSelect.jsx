/*
 * CHANGES & REASONS:
 *
 * 1. Removed unused `React` import
 *    REASON: React 17+ with Vite/JSX transform does not require React in scope.
 *            Keeping it caused an ESLint "unused import" warning.
 *
 * 2. Removed unused `useState` import
 *    REASON: `useState` was imported but never used in this component → lint warning.
 */

import { Store, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#FFF8F0] relative overflow-hidden flex items-center justify-center px-6 py-8">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C08552]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#8C5A3C]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#C08552]/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Main Card */}
      <div className="w-full max-w-[1000px] h-[540px] rounded-[36px] overflow-hidden shadow-2xl bg-white grid md:grid-cols-2 relative z-10">

        {/* LEFT SECTION */}
        <div className="bg-[#4B2E2B] text-white p-12 flex flex-col justify-center relative overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-96 h-96 border border-[#C08552]/20 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 border border-[#C08552]/10 rounded-full"></div>

          <h1 className="text-4xl font-bold leading-tight relative z-10">
            Connect With <br />
            <span className="text-[#C08552]">Creators</span>
          </h1>

          <p className="text-base text-gray-300 mt-5 relative z-10">
            Grow your business or become a creator partner.
          </p>

          <button
            onClick={() => navigate("/getstarted")}
            className="mt-8 bg-[#C08552] text-white px-7 py-3 rounded-full w-fit font-semibold hover:scale-105 transition relative z-10"
          >
            Get Started
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-[#FFF8F0] p-8 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-[#4B2E2B] mb-6">
            Choose Your Role
          </h2>

          {/* Shop Owner Card */}
          <div className="bg-white border border-[#C08552]/20 rounded-3xl p-5 mb-4 hover:shadow-xl transition hover:-translate-y-1">

            <Store className="text-[#C08552]" size={32} />

            <h3 className="text-xl font-bold text-[#4B2E2B] mt-3">
              Shop Owner
            </h3>

            <p className="text-[#8C5A3C] mt-1 text-sm">
              Promote products through creators
            </p>

            <button
              onClick={() => navigate("/owner")}
              className="mt-4 bg-[#C08552] text-white px-6 py-2.5 rounded-full font-medium"
            >
              Continue
            </button>
          </div>

          {/* Creator Card */}
          <div className="bg-white border border-[#8C5A3C]/20 rounded-3xl p-5 hover:shadow-xl transition hover:-translate-y-1">

            <Video className="text-[#8C5A3C]" size={32} />

            <h3 className="text-xl font-bold text-[#4B2E2B] mt-3">
              Creator
            </h3>

            <p className="text-[#8C5A3C] mt-1 text-sm">
              Collaborate and earn from brands
            </p>

            <button
              onClick={() => navigate("/creator")}
              className="mt-4 bg-[#8C5A3C] text-white px-6 py-2.5 rounded-full font-medium"
            >
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}