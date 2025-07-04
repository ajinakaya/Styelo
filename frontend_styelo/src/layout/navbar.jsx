import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search as SearchIcon,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/logo1.png";
import Search from "../components/search";
import CategoryContainer from "../components/categorycontainer";
import { useCart } from "../context/cartcontext";
import { useWishlist } from "../context/wishlistcontext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

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
    { name: "Furniture", action: "category" },
    { name: "Decors", path: "/decors" },
    { name: "About", path: "/aboutus" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {!isHomePage && <div className="h-22"></div>}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
          isHomePage
            ? isScrolled
              ? "bg-white shadow-sm  border-gray-300"
              : "bg-white/30 border-b border-black/28"
            : "bg-white shadow-sm border-b border-gray-300"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-22 relative">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Styelo Logo"
                  className="h-23 object-contain relative left-[-10px]"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-16 absolute left-1/3 transform translate-x-8">
              {navLinks.map(({ name, path, action }) =>
                action === "category" ? (
                  <button
                    key={name}
                    onClick={() => setShowCategory(true)}
                    className={`text-[15px] font-medium transition ${
                      isHomePage && !isScrolled
                        ? "text-black/90"
                        : "text-black/90"
                    } hover:text-[#B88E2F]`}
                  >
                    {name}
                  </button>
                ) : (
                  <Link
                    key={name}
                    to={path}
                    className={`text-[15px] font-medium transition ${
                      isActive(path)
                        ? "text-[#B88E2F]"
                        : `${
                            isHomePage && !isScrolled
                              ? "text-black/90"
                              : "text-black/90"
                          } hover:text-[#B88E2F]`
                    }`}
                  >
                    {name}
                  </Link>
                )
              )}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-9">
              <Link to="/account">
                <User className="w-5 h-5 cursor-pointer transition stroke-2 text-black hover:text-[#B88E2F]" />
              </Link>

              <button onClick={() => setShowSearch(true)}>
                <SearchIcon className="w-5 h-5 cursor-pointer transition stroke-2 text-black hover:text-[#B88E2F]" />
              </button>
              {/* Wishlist Icon with Count Badge */}
              <div className="relative">
                <Link to="/wishlist">
                  <Heart className="w-5 h-5 cursor-pointer transition stroke-2 text-black hover:text-[#B88E2F]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -bottom-1 -right-2 bg-[#B88E2F] text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="relative">
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5 cursor-pointer transition stroke-2 text-black hover:text-[#B88E2F]" />
                  {cartCount > 0 && (
                    <span className="absolute -bottom-1 -right-2 bg-[#B88E2F] text-white text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 transition text-black hover:text-[#B88E2F]"
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
                  ? isScrolled
                    ? "border-gray-300 bg-white"
                    : "border-white/30 bg-white/25"
                  : "border-gray-300 bg-white"
              }`}
            >
              {navLinks.map(({ name, path, action }) =>
                action === "category" ? (
                  <button
                    key={name}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowCategory(true);
                    }}
                    className="block w-full text-left px-3 py-2 font-medium text-black hover:text-[#B88E2F]"
                  >
                    {name}
                  </button>
                ) : (
                  <Link
                    key={name}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 font-medium transition ${
                      isActive(path)
                        ? "text-[#B88E2F]"
                        : "text-black hover:text-[#B88E2F]"
                    }`}
                  >
                    {name}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </header>

      {/* Popup Modals */}
      {showSearch && <Search onClose={() => setShowSearch(false)} />}
      {showCategory && (
        <CategoryContainer onClose={() => setShowCategory(false)} />
      )}
    </>
  );
};

export default Navbar;
