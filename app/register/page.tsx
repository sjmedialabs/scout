"use client";

import { useState,useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, X } from "lucide-react";
import OtpVerify from "@/components/otp-verification";
import OtpVerifiedSuccess from "@/components/otp-verify-success";

export default function RegisterPage() {
  const [role, setRole] = useState<"agency" | "client">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  console.log("Query paraameter is:::::",type)

  const[showOtpVerifyUi,setShowOtpVerifyUi]=useState(false);
  const[showSuccesfullVerifiedUi,setShowSuccessfullVerifiedUi]=useState(false)
  

const handleSubmit = async () => {
  if(role==="agency"){
    if(companyName.trim()===""){
      alert("Company Name is required for the role agency:")
      return;
    }
  }
  if (loading) return
  setError("")
  setLoading(true)

  try {
    const resData = await register(
      email,
      password,
      name,
      role,
      role === "agency" ? companyName : undefined
    )
    console.log("Registration res:::::::",resData)

    localStorage.setItem("userDetails",JSON.stringify({
    email,name,role,companyName
    }))

    if(resData?.success){
         setShowOtpVerifyUi(true)   
    }

    // if (user.role === "client") {
    //   router.replace("/client/dashboard")
    // }

    // if (user.role === "agency") {
    //   router.replace("/agency/dashboard")
    // }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Registration failed")
  } finally {
    setLoading(false)
  }
}

 useEffect(()=>{
    if(type){
    type==="provider"?setRole("agency"):setRole("client")
  }
 },[])

  return (
        <div>
        {/* Modal Card */}
      <div className="relative min-h-screen w-full max-w-7xl bg-white mx-auto">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">

          {/* LEFT SECTION */}
          <div
            className="relative hidden lg:flex lg:col-span-6 min-h-screen flex-col justify-between p-10 text-white bg-cover bg-bottom-left bg-no-repeat"
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

          {/* RIGHT SECTION */}
          {
            (!showOtpVerifyUi && !showSuccesfullVerifiedUi) && (
              <div className="lg:col-span-6 min-h-screen overflow-y-auto p-8 sm:p-10">

            <div className="flex items-center mb-2">
                          <button
                              onClick={() => router.push("/")}
                            className="flex text-sm items-center justify-center rounded-full hover:text-orange-600 transition cursor-pointer"
            >
                            ← Back to website
                          </button>
                        </div>
            <h3 className="text-xl font-semibold text-center">Create Account</h3>
            <p className="mt-0.1 text-[12px] text-gray-400 text-center">
              Join Spark to connect with agencies or offer your services
            </p>

            {/* Account Type */}
            <div className="mt-1 text-center">
              <label className="text-sm font-bold text-gray-700 block">
                Account Type
              </label>
              <div className="mt-2 flex justify-center items-center gap-6 text-[10px] text-gray-400">
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="radio"
                    checked={role === "agency"}
                    onChange={() => setRole("agency")}
                    className="cursor-pointer"
                  />
                  Agency
                </label>
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                  <input
                    type="radio"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                    className="cursor-pointer"
                  />
                  Client
                </label>
              </div>
            </div>

            {/* Inputs */}
            <div className="mt-1 space-y-3 flex flex-col items-center">
              <div className="-mt-1 w-[420px] max-w-full">
                <label className="text-sm font-bold text-gray-600">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Name"
                  className="mt-0.1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-sm"
                />
              </div>

              <div className="w-[420px] max-w-full">
                <label className="text-sm font-bold text-gray-600">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter E-Mail"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-sm"
                />
              </div>

                  <div className="w-[420px] max-w-full">
      <label className="text-sm font-bold text-gray-600">Password</label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 pr-10 text-sm"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>


              <div className="w-[420px] max-w-full">
                <label className="text-sm font-bold text-gray-600">
                  Company Name {role === "agency" ? "(Required)" : "(Optional)"}
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your Company Name"
                  required={role === "agency"}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="mt-2 text-center text-[10px] text-red-500">
                {error}
              </p>
            )}

            {/* Button */}
            <div className="flex justify-center mb-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 cursor-pointer justify-center px-6 rounded-xl bg-black py-2  font-medium text-sm text-white hover:bg-orange-600 transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            </div>

            {/* Footer */}
            <p className="mt-1 text-sm text-black text-center">
              Already have an account?
              <span
                onClick={() => router.push("/login")}
                className="ml-1 cursor-pointer underline hover:text-orange-600 font-medium text-black"
              >
                Sign in here
              </span>
            </p>
          </div>
            )
          }

          {showOtpVerifyUi && (
            <div className="lg:col-span-6 h-full flex flex-col justify-center overflow-y-auto p-8 sm:p-10">
               <OtpVerify
                  email={email}
                  onVerified={()=>{
                    setShowOtpVerifyUi(false)
                    setShowSuccessfullVerifiedUi(true)
                    
                  }}
                />
            </div>
 
          )}

          {
            (showSuccesfullVerifiedUi && !showOtpVerifyUi) && (
              <div className="lg:col-span-6 min-h-screen flex flex-col justify-center p-8 sm:p-10">
                <OtpVerifiedSuccess/>
              </div>
            )
          }


        
        </div>
      </div>
      
        

    </div>
  );
}
 