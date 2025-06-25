import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Furniture", path: "/furniture" },
    { name: "Decors", path: "/decors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      
      {!isHomePage && <div className="h-22"></div>}
      
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
          isHomePage 
            ? (isScrolled ? 'bg-white shadow-sm  border-gray-300' : 'bg-white/30 border-b border-black/28')
            : 'bg-white shadow-sm border-b border-gray-300'
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-22 relative">
            {/* Left: Logo */}
            <div className="flex items-center">
              <img
                src={logo}
                alt="Styelo Logo"
                className="h-23 object-contain relative left-[-10px]"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-16 absolute left-1/3 transform translate-x-8">
              {navLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className={` text-[15px] font-medium transition ${
                    isActive(path)
                      ? "text-[#B88E2F]"
                      : `${
                          isHomePage && !isScrolled ? "text-black" : "text-black"
                        } hover:text-[#B88E2F]`
                  }`}
                >
                  {name}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-10">
              <User
                className={`w-5 h-5 cursor-pointer transition stroke-2 ${
                  isHomePage && !isScrolled ? "text-black" : "text-black"
                } hover:text-[#B88E2F]`}
              />
              <Search
                className={`w-5 h-5 cursor-pointer transition stroke-2 ${
                  isHomePage && !isScrolled ? "text-black" : "text-black"
                } hover:text-[#B88E2F]`}
              />
              <Heart
                className={`w-5 h-5 cursor-pointer transition stroke-2 ${
                  isHomePage && !isScrolled ? "text-black" : "text-black"
                } hover:text-[#B88E2F]`}
              />
              <ShoppingCart
                className={`w-5 h-5 cursor-pointer transition stroke-2 ${
                  isHomePage && !isScrolled ? "text-black" : "text-black"
                } hover:text-[#B88E2F]`}
              />

              {/* Mobile Toggle */}
              <button
                onClick={toggleMenu}
                className={`md:hidden p-2 transition ${
                  isHomePage && !isScrolled ? "text-black" : "text-black"
                } hover:text-[#B88E2F]`}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 stroke-2" />
                ) : (
                  <Menu className="w-5 h-5 stroke-2" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div
              className={`md:hidden mt-2 border-t pt-2 ${
                isHomePage
                  ? (isScrolled 
                      ? "border-gray-300 bg-white" 
                      : "border-white/30 bg-white/25 "
                    )
                  : "border-gray-300 bg-white"
              }`}
            >
              {navLinks.map(({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  className={`block px-3 py-2 font-medium transition ${
                    isActive(path)
                      ? "text-[#B88E2F]"
                      : `${
                          isHomePage && !isScrolled ? "text-black" : "text-black"
                        } hover:text-[#B88E2F]`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;