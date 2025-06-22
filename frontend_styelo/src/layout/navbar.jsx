import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Furniture', path: '/furniture' },
    { name: 'Decors', path: '/decors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#f] shadow-sm border-b border-gray-300 font-['Poppins']">
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

          {/* Center: Navigation */}
          <nav className="hidden md:flex space-x-16">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`font-semibold transition ${
                  isActive(path)
                    ? 'text-[#B88E2F]'
                    : 'text-black hover:text-[#B88E2F]'
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center space-x-10">
            <User className="w-5 h-5 text-black hover:text-[#B88E2F] cursor-pointer" />
            <Search className="w-5 h-5 text-black hover:text-[#B88E2F] cursor-pointer" />
            <Heart className="w-5 h-5 text-black hover:text-[#B88E2F] cursor-pointer" />
            <ShoppingCart className="w-5 h-5 text-black hover:text-[#B88E2F] cursor-pointer" />

            {/* Mobile Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-black hover:text-[#B88E2F]"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 border-t border-gray-300 pt-2">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`block px-3 py-2 font-medium transition ${
                  isActive(path)
                    ? 'text-[#B88E2F]'
                    : 'text-black hover:text-[#B88E2F]'
                }`}
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
