import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-10 ">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo and About Section */}
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Villa Vista</h2>
            <p className="mt-2 text-gray-400">
              Discover the perfect getaway with our handpicked villas. Book with ease and enjoy luxurious stays.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-300 transition">Home</Link></li>
              <li><Link to="/" className="hover:text-gray-300 transition">Browse Villas</Link></li>
              <li><Link to="/account" className="hover:text-gray-300 transition">Profile</Link></li>
              
            </ul>
          </div>
  
          {/* Contact and Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-3  text-blue-800 ">Contact</h3>
            <p className="text-gray-400">Email: piyushpra50@gmail.com</p>
            <p className="text-gray-400">Phone: +91 703 979 3720</p>
  
            {/* Social Media Links */}
            <div className=" space-x-4 mt-4">
          <a 
            href="https://github.com/Prajapati-Piyush" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
          <a 
            href="https://leetcode.com/u/CipherAsh/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
          >
            <i className="fas fa-code text-xl"></i>
          </a>
        </div>
          </div>
  
        </div>
  
        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500">
          © {new Date().getFullYear()} VillaBooking. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  