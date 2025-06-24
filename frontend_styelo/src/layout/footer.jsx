import React, { useState } from 'react';
import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-50 text-gray-800 font-['Poppins'] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold mb-3 text-[#B88E2F]">STYELO.</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Where brilliance meets innovation in furniture and decor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Pages</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Furniture</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Decors</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Payment Options</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#B88E2F] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Newsletter</h3>
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#B88E2F]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B88E2F] text-white text-sm font-medium hover:bg-[#A67E2A] transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#B88E2F] hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#B88E2F] hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#B88E2F] hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-500">
            © 2025 <span className="text-[#B88E2F] font-medium">Styelo</span>. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;