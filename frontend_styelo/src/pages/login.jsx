import React, { useState } from "react";
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react";

import rightsideImage from "../assets/rightside.png";
import logo from "../assets/logo1.png";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    console.log("Sign in attempt:", { email, password });
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-[Dosis] relative">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex w-full h-full px-10 gap-x-16">
        {/* Left section */}
        <div className="w-[55%] flex items-center justify-end">
          <div className="w-full max-w-xl">
            {/* Sign In */}
            <h1 className="text-[54px] font-medium text-black mb-8 text-center">
              Sign in
            </h1>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-800 mb-3">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] pl-12 pr-4 border border-gray-300 rounded-lg text-base placeholder-gray-400 bg-white focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-base font-medium text-gray-800 mb-3">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] pl-12 pr-12 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-8">
              <button className="text-sm text-gray-600 hover:text-gray-700">
                Forget Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              style={{ width: "378.37px", height: "55.93px" }}
              className="bg-[#3D3735] text-white rounded-lg text-[20px] font-medium flex items-center justify-center mx-auto mb-2 hover:bg-[#2D2623] transition-colors"
            >
              Sign in
            </button>

            {/* Signup */}
            <p className="text-base text-center text-gray-700 mt-2">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-500 hover:underline transition-colors" >
                Signup
              </button>
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="w-[55%] h-full flex items-center justify-start">
          <img
            src={rightsideImage}
            alt="Visual"
            className="w-[565px] h-[687px] object-cover rounded-[60px] rounded-br-[30px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
