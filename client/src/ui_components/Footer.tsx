import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { CiMail } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 py-16 mt-16">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-gray-900">Scribo</h1>

          <p className="text-sm text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-gray-900 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-900 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-gray-900 transition">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/archive" className="hover:text-gray-900 transition">
                Archived
              </Link>
            </li>
            <li>
              <Link to="/author" className="hover:text-gray-900 transition">
                Author
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-900 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Categories
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-gray-600">
            <li>Technology</li>
            <li>Business</li>
            <li>Travel</li>
            <li>Lifestyle</li>
            <li>Economy</li>
            <li>Sports</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Weekly Newsletter
          </h3>

          <p className="text-sm text-gray-600">
            Get blog articles and offers via email.
          </p>

          <div className="relative">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CiMail className="absolute right-3 top-2.5 text-gray-500 text-lg" />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white rounded-md py-2 text-sm font-medium">
            Subscribe
          </button>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mt-12 text-gray-700">
        <FaInstagram className="text-xl hover:text-black transition cursor-pointer" />
        <FaFacebookF className="text-xl hover:text-black transition cursor-pointer" />
        <BsTwitterX className="text-xl hover:text-black transition cursor-pointer" />
        <FaYoutube className="text-xl hover:text-black transition cursor-pointer" />
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Scribo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
