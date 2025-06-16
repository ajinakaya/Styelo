import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";

import logo from "../assets/logo1.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Reset password request for:", email);
  };

  const handleBackToLogin = () => {
    console.log("Navigate back to login");
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-[Dosis] relative">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600">
              No worries, we'll send you reset instruction
            </p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                placeholder=""
              />
            </div>
          </div>

         
          <button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#3D3735] text-white rounded-lg text-base font-medium hover:bg-[#2D2623] transition-colors mb-6"
          >
            Reset Password
          </button>

         
          <div className="text-center">
            <button
              onClick={handleBackToLogin}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;