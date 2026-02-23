"use client";

import { useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, X } from "lucide-react";

export default function LoginPage() {
  // const [role, setRole] = useState<"agency" | "client" | "admin">("client");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("to");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
  if (loading) return;

  setError("");
  setLoading(true);

  try {
    const user = await login(email, password);

    // 🔒 Restrict login when coming from requirement "View Details"
    if (redirectTo === "requirement-details" && user.role !== "agency") {
  setError("Only service providers (agencies) can view requirement details.");
  setLoading(false);
  return;
}

// 🔒 Submit Proposal access — ONLY agency allowed
if (redirectTo === "submit-proposal") {
  if (user.role !== "agency") {
    setError("Only service providers (agencies) can submit proposals.");
    setLoading(false);
    return; // 🚫 STOP login flow completely
  }
}

    if (user.role === "client") {
      router.push("/client/dashboard");
    } 

//     else if (user.role === "agency") {
//   const id = searchParams.get("id");

//   if (redirectTo === "requirement-details" && id) {
//     router.push(`/agency/dashboard/project-inquiries/${id}`);
//   } else {
//     router.push("/agency/dashboard");
//   }
// }

else if (user.role === "agency") {
  const id = searchParams.get("id");

  if (redirectTo === "requirement-details" && id) {
    router.push(`/agency/dashboard/project-inquiries/${id}`);
  } 
  else if (redirectTo === "submit-proposal" && id) {
    router.push(`/agency/dashboard/project-inquiries/${id}`);
  }
  else {
    router.push("/agency/dashboard");
  }
}

else if (user.role === "admin") {
      router.push("/admin/dashboard");
    }

else {
      throw new Error("Invalid user role");
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed");
  } finally {
    setLoading(false);
  }
};


//  try {[]
//       // 🔑 Backend decides the role
//       const user = await login(email, password, role);

//       // ✅ Redirect based on role from backend
//       if (user.role === "client") {
//         router.push("/client/dashboard");
//       } else if (user.role === "agency") {
//         router.push("/agency/dashboard");
//       } else if (user.role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         throw new Error("Invalid user role");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    // <div className="fixed inset-0 flex items-center justify-center px-4">
      <div className="relative w-full max-w-7xl min-h-screen bg-white">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">

          {/* LEFT SECTION */}
          <div
            className="
                relative hidden lg:flex lg:col-span-6
                min-h-screen
                flex-col justify-between
                p-10 text-white
                bg-cover bg-bottom-left bg-no-repeat
              "
            style={{
              backgroundImage: "url('/images/Login-Image.png')",
            }}
          >
            <div className="relative max-w-sm -ml-2">
              <h2 className="text-2xl font-extrabold leading-tight pb-3">
                Built to Accelerate <br /> Business Success
              </h2>

              <ul className="mt-2 space-y-2 text-[10px] text-white">
                <li>Owering Smarter Business Connections</li>
                <li>700+ Categories. One Trusted Platform.</li>
                <li>Quality Work. Accelerated Results.</li>
                <li>Your Gateway to Global Talent & Businesses</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="lg:col-span-6 min-h-screen flex flex-col overflow-y-auto p-8 sm:p-4">
            <div className="flex items-center mb-2 justify-end">
              <button
                  onClick={() => router.push("/")}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition cursor-pointer"
>
                <X size={18} className="text-gray-700" />
              </button>
            </div>
            <h3 className="text-xl mt-20 font-semibold text-center">Sign in</h3>
            <p className="mt-0.1 text-[12px] text-gray-400 text-center">
              Enter your credentials to access your account
            </p>

            {/* Account Type */}
            {/* <div className="mt-2">
              <label className="text-xs font-bold text-gray-700">
                Account Type
              </label>
              <div className="mt-2 flex gap-4 text-[10px] text-gray-400">
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
                    checked={role === "agency"}
                    onChange={() => setRole("agency")}
                  />
                  Service Provider
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
            </div> */}

            {/* Inputs */}
            <div className="mt-1 space-y-4 flex flex-col">
              <div className="w-full max-w-full">
                <label className="text-sm font-bold text-gray-600">E-mail</label>
                 <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter E-Mail"
                  className="mt-1 w-full rounded-xl placeholder:text-xs border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-[12px]"
                />
                </div>
              </div>

              <div className="w-full max-w-full">
                <label className="text-sm font-bold text-gray-600">Password</label>
                <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="mt-1 w-full rounded-xl border placeholder:text-xs border-gray-200 bg-[#f6f9fe] px-4 py-2 pr-10 text-[12px]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              </div>
              <p
                onClick={() => router.push("/forgot-password")}
                className="mt-2 text-sm  hover:text-blue-400 underline cursor-pointer"
              >
                Forgot password?
              </p>
            </div>

            {error && (
              <p className="mt-2 text-[10px] text-red-500">
                {error}
              </p>
            )}

            {/* Button */}
            <div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 justify-center cursor-pointer rounded-xl bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
           </div> 

            {/* Footer */}
            <p className="mt-1 text-sm text-black">
              Don't have an account?
              <span
                onClick={() => router.push("/register")}
                className="ml-1 cursor-pointer underline hover:text-blue-400 font-medium text-black"
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>
    // </div>
  );
}
