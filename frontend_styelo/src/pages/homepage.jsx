import React from "react";

import Navbar from "../layout/navbar";
import HeroSection from "../components/herosection";
import Footer from "../layout/footer";
import Bestsellers from "../components/bestseller"; 
import NewArrivals from "../components/new arrivals";  

export const Home = () => {
  return (
    <>
      
      <Navbar/>
      <HeroSection/>
      <NewArrivals/> 
      <Bestsellers/>
      <Footer/>
    </>
  );
};

export default Home;