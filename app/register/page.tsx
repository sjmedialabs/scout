"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState<"agency" | "client">("client");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT SECTION (IMAGE + TEXT) */}
          <div className="hidden lg:flex flex-col justify-between bg-[#8b2f3c] p-10 text-white">
            <div>
              <h2 className="text-4xl font-semibold leading-tight">
                Built to Accelerate <br /> Business Success
              </h2>

              <ul className="mt-6 space-y-4 text-sm text-white/90">
                <li>owering Smarter Business Connections</li>
                <li>700+ Categories. One Trusted Platform.</li>
                <li>Quality Work. Accelerated Results.</li>
                <li>Your Gateway to Global Talent & Businesses</li>
              </ul>
            </div>

            <img
              src="/signup-image.jpg"
              alt="Signup"
              className="mt-8 rounded-xl object-cover"
            />
          </div>

          {/* RIGHT SECTION (FORM) */}
          <div className="p-8 sm:p-10">
            <h3 className="text-2xl font-semibold text-center">Create Account</h3>
            <p className="mt-1 text-sm text-gray-400 text-center">
              Join Spark to connect with agencies or offer your services
            </p>

            {/* Account Type */}
            <div className="mt-8">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <div className="mt-3 flex gap-6 text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "agency"}
                    onChange={() => setRole("agency")}
                  />
                  Service Provider
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                  />
                  Service seeker
                </label>
              </div>
            </div>

            {/* Inputs */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Full name</label>
                <input
                  placeholder="example@mail.com"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Seeker@example.com"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  placeholder="••••"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Company Name (Optional)</label>
                <input
                  placeholder="Enter your Company Name"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Button */}
            <button className="mt-8 w-full rounded-xl bg-black py-3 text-sm font-medium text-white hover:bg-gray-900 transition">
              Create Account
            </button>

            {/* Footer */}
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?
              <span className="ml-1 cursor-pointer font-medium text-black">
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
