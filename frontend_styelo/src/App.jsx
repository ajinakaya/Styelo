import axios from "axios";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPassword from "./pages/forgot passord";
import SetNewPassword from "./pages/resetpassword";
import VerificationCode from "./pages/pin";
import Home from "./pages/homepage";
import Footer from "./layout/footer";


axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

const App = () => {


  return (
      <>
       <ToastContainer
        position="bottom-right"
        autoClose={2000} // 2 seconds
      />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />
      <Route path="/pin" element={<VerificationCode />} />
      <Route path="/" element={<Home/>} />
      <Route path="/footer" element={<Footer />} />
     

    </Routes>
    </>
  );
}
export default App;