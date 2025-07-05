import React from "react";
import { Link } from "react-router-dom";
import { FaBed, FaCouch, FaUtensils, FaBriefcase } from "react-icons/fa";
import heroImg from "../assets/decor.png";
import decor from "../assets/decor1.png";
import decor2 from "../assets/decor2.png";
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";
import { FaArrowRight } from "react-icons/fa";

const Decors = () => {
  return (
    <>
      <Navbar />
      <div className=" bg-white min-h-screen font-poppins">
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-40 py-10 gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Design any space <br /> in your home
            </h1>
            <p className="text-gray-600 text-base max-w-lg">
              Plan and furnish any space in your home with Styelo products. Play
              with color and textures and import designs from our other planning
              tools.
            </p>
          </div>

          {/* Image */}
          <div className="flex-1">
            <img
              src={heroImg}
              alt="Decor preview"
              className="rounded-xl w-150 h-80 object-cover"
            />
          </div>
        </section>

        <hr className="border-gray-300 mx-6 md:mx-20" />

        {/* Room Selector */}
        <section className="px-6 md:px-20 pt-10 pb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Create a new design or open an existing one
          </h2>

          <div className="flex flex-wrap gap-3 mb-10">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
              <FaBed /> Bedroom
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
              <FaCouch /> Living room
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
              <FaUtensils /> Dining
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
              <FaBriefcase /> Workspace
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group cursor-pointer">
              <img
                src={decor}
                alt="Start new design"
                className="rounded-xl w-full h-69 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Start a new design
                    </h3>
                    <p className="text-sm">Set your imagination free</p>

                    <Link to="/room">
                      <div className="bg-white bg-opacity-20 h-7 w-7 rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                        <FaArrowRight className="text-black text-sm" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <img
                src={decor2}
                alt="Open design"
                className="rounded-xl w-full h-69 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Open a design</h3>
                    <p className="text-sm">Save</p>
                    <div className="bg-white bg-opacity-20 h-7 w-7 rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300">
                      <FaArrowRight className="text-black text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Decors;
