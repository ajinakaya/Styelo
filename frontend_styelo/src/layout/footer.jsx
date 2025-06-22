import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black font-['Poppins'] border-t border-gray-200 pt-12 px-6 md:px-20">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
        {/* Brand Description */}
        <div>
          <h2 className="text-xl font-bold mb-4">STYELO.</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Welcome to Styelo, where brilliance meets innovation! <br />
            We are a leading company dedicated to delivering exceptional products
            and services to cater to your needs.
          </p>
        </div>

        {/* Pages */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-4">Pages</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#B88E2F]">Furniture</a></li>
            <li><a href="#" className="hover:text-[#B88E2F]">Decors</a></li>
            <li><a href="#" className="hover:text-[#B88E2F]">About</a></li>
            <li><a href="#" className="hover:text-[#B88E2F]">Contact</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-4">Help</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#B88E2F]">Payment Options</a></li>
            <li><a href="#" className="hover:text-[#B88E2F]">Returns</a></li>
            <li><a href="#" className="hover:text-[#B88E2F]">Privacy Policies</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-4">Newsletter</h3>
          <div className="flex items-center border-b border-gray-400 pb-1">
            <input
              type="email"
              placeholder="Enter Your Email Address"
              className="bg-transparent outline-none placeholder-gray-500 text-sm flex-1"
            />
            <button className="ml-2 text-sm font-bold hover:text-[#B88E2F]">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Border & Copyright */}
      <div className="border-t border-gray-300 py-4 text-center text-sm font-medium">
        © 2025 styelo. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
