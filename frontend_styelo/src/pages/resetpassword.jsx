import React, { useState } from "react";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

import logo from "../assets/logo1.png";

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    console.log("New password set:", newPassword);
  };

  const handleBackToLogin = () => {
    console.log("Navigate back to login");
  };

  return (
    <div className="w-screen h-screen white overflow-hidden font-[Dosis] relative">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Set new password
            </h1>
            <p className="text-gray-600">
              Must be at least 8 characters
            </p>
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-12 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-12 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
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

export default SetNewPassword;