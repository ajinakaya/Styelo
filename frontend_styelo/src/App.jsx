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
import AboutUs from "./pages/about";
import ContactUs from "./pages/contact";
import ProductDetails from "./pages/detailspage";
import FurnitureFilter from "./pages/filter";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import PaymentUI from "./pages/payment";
import OrderConfirmation from "./pages/orderconfirmation";
import MyOrders from "./pages/myorder";
import RoomDesigner3D from "./pages/room";
import ProfileEdit from "./pages/profile";
import NotificationPage from "./pages/notification";



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
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/furniture" element={<FurnitureFilter />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<PaymentUI />} />
      <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/room-designer" element={<RoomDesigner3D />} />
      <Route path="/profile-edit" element={<ProfileEdit />} />
      <Route path="/notifications" element={<NotificationPage />} />
      
   
      

      

      
     

    </Routes>
    </>
  );
}
export default App;