import { Mail, Phone } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between p-4 gap-6">
        {/* contact information */}
        <div className="flex-1 min-w-62.5">
          <h3 className="text-xl font-semibold mb-4 text-white">Contact us:</h3>
          <p className="flex items-center justify-content md:justify-start gap-2 text-gray-400 mb-2">
            <Phone size={16} /> Phone: 9787-987-987
          </p>
          <p className="flex items-center justify-content md:justify-start gap-2 text-gray-400 mb-2">
            <Mail size={16} /> Email: info@yourcompany.com
          </p>
        </div>
        {/* social media links */}
        <div className="flex-1 min-w-62.5 ">
          <h3 className="text-xl font-semibold mb-4 text-white">Follow us:</h3>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
        {/* about information */}
        <div className="flex-1 min-w-62.5">
          <h3 className="text-xl font-semibold mb-4 text-white">About us:</h3>
          <p>
            We are a company dedicated to providing the best services to our
            customers.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        &copy; 2024 Your Company. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
