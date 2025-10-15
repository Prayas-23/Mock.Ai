import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/70 text-sm">
            © 2024 Mock.Ai. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;