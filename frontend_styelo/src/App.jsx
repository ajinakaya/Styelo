import axios from "axios";
import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPassword from "./pages/forgot passord";
import SetNewPassword from "./pages/resetpassword";
import VerificationCode from "./pages/pin";

const App = () => {


  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />
      <Route path="/pin" element={<VerificationCode />} />
     
    
    </Routes>
  );
}
export default App;