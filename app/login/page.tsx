"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [role, setRole] = useState<"agency" | "client" | "admin">("agency");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const emailPlaceholder =
    role === "agency"
      ? "agency@example.com"
      : role === "client"
      ? "seeker@example.com"
      : "admin@example.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-3xl h-[97vh] overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="grid h-full grid-cols-1 lg:grid-cols-12">

          {/* LEFT SECTION (IMAGE + TEXT) */}
          <div
            className="relative hidden lg:flex lg:col-span-6 h-full flex-col justify-between p-10 text-white bg-cover"
            style={{
              backgroundImage: "url('/images/Login-Image.png')",
              backgroundPosition: "left bottom"
            }}
          >
            <div className="relative z-10 max-w-sm">
              <h2 className="text-2xl font-extrabold leading-tight">
                Built to Accelerate <br /> Business Success
              </h2>

              <ul className="mt-2 space-y-2 text-[10px] text-white">
                <li>owering Smarter Business Connections</li>
                <li>700+ Categories. One Trusted Platform.</li>
                <li>Quality Work. Accelerated Results.</li>
                <li>Your Gateway to Global Talent & Businesses</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SECTION (FORM) */}
          <div className="lg:col-span-6 h-full overflow-y-auto p-8 sm:p-10">
            <h3 className="text-lg font-semibold text-center">Sign in</h3>
            <p className="mt-0.1 text-[10px] text-gray-400 text-center">
              Enter your credentials to access your account
            </p>

            {/* Account Type */}
            <div className="mt-2">
              <label className="text-xs font-bold text-gray-700">
                Account Type
              </label>
              <div className="mt-2 flex gap-4 text-[10px] text-gray-400">
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

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                  />
                  Admin
                </label>
              </div>
            </div>

            {/* Inputs */}
            <div className="mt-1 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-[10px]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-[10px]"
                />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => login(email, password, role)}
              className="mt-4 w-full rounded-xl bg-black py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
            >
              Sign in
            </button>

            {/* Footer */}
            <p className="mt-1 text-center text-xs text-black">
              Don't have an account?
              <span className="ml-1 cursor-pointer underline hover:text-blue-400 font-medium text-black">
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
