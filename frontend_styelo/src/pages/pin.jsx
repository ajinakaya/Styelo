import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import logo from "../assets/logo1.png";

const VerificationCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [email] = useState("ri@gmail.com"); 

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
   
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    const verificationCode = code.join("");
    console.log("Verification code:", verificationCode);
  };

  const handleResendCode = () => {
    console.log("Resend code to:", email);
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
              Enter your code
            </h1>
            <p className="text-gray-600">
              we sent a code to {email}
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl font-medium focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                maxLength={1}
              />
            ))}
          </div>

        
          <button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#3D3735] text-white rounded-lg text-base font-medium hover:bg-[#2D2623] transition-colors mb-4"
          >
            Continue
          </button>

          <div className="text-center mb-6">
            <span className="text-gray-600">Don't receive email? </span>
            <button
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Click here
            </button>
          </div>

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

export default VerificationCode;