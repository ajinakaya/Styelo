import React, { useState } from "react";
import { Eye, EyeOff, Mail, KeyRound, UserRound } from "lucide-react";



import rightsideImage from "../assets/rightside.png";
import logo from "../assets/logo1.png";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Register form:", form);
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden font-[Dosis] relative">
      {/* Logo */}
      <div className="absolute top-6 left-10">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      <div className="flex w-full h-full">
        {/* Left section - Form */}
        <div className="w-[50%] flex items-center justify-end px-10">
          <div className="w-full max-w-xl">
            {/* Title */}
            <h1 className="text-[40px] font-medium text-black mb-6 text-center">
              Create your account
            </h1>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-800 mb-2">
                Username
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full h-[52px] pl-12 pr-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-800 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full h-[52px] pl-12 pr-4 border border-gray-300 rounded-lg text-base bg-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full h-[52px] pl-12 pr-12 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:border-gray-400"
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

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-base font-medium text-gray-800 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full h-[52px] pl-12 pr-12 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:border-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-sm text-center text-gray-700 mb-4">
              By signing up, you agree to our{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Terms of use
              </span>{" "}
              and{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy policy
              </span>
            </p>

            {/* Submit */}
           <button
              onClick={handleSubmit}
              style={{ width: "378.37px", height: "55.93px" }}
              className="bg-[#3D3735] text-white rounded-lg text-[20px] font-medium flex items-center justify-center mx-auto mb-6 hover:bg-[#2D2623] transition-colors"
            >
              Sign up
            </button>

            {/* Already have account */}
            <p className="text-base text-center text-gray-700">
              Already have an account?{" "}
              <button className="text-blue-600 hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Right section - Image */}
        <div className="w-[50%] h-full flex items-center justify-start">
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

export default RegisterPage;
