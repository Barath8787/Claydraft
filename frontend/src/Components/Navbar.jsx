import React, { useState } from "react";
import { Menu, Search, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { Link } from "react-router-dom";
function Navbar() {
  const [open, setOpen] = useState(false);
  const isAutheticator = true;
  return (
    <nav className="stricky w-full top-0 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto  px-4 h-16 flex items-center justify-between">
        {/* logo */}
        <Link
          to="/"
          className=" flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          <span>
            <ShoppingBag />
          </span>
          <span>ClayCraft</span>
        </Link>
        {/* desktop links */}
        <div className=" hidden md:flex items-center gap-8">
          <Link
            className="text-gray-700 hover:text-blue-600 transition font-semibold"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-600 transition font-semibold"
            to="/"
          >
            Products
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-600 transition font-semibold"
            to="/about"
          >
            About us
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-600 transition font-semibold"
            to="/contact"
          >
            Contact
          </Link>
        </div>

        {/* right section */}
        <div className="flex items-center gap-6">
          <form className="hidden sm:flex items-center border border-slate-300 rounded">
            <input
              type="text"
              placeholder="Search product"
              className="px-3 py-2 text-sm w-40 focus:outline-none"
            />
            <button className="px-3 text-gray-500 hover:text-blue-600 transition ">
              <Search size={18} />
            </button>
          </form>
          {/* cart */}
          <Link className="relative" to="/cart">
            {" "}
            <ShoppingCart />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold min-w-5 h-5 rounded-full flex items-center justify-center">
              6
            </span>
          </Link>
          {/* Register */}
          {!isAutheticator && (
            <Link
              to="/register"
              className=" hidden sm:flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <User size={18} />
              Register
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="md:hidden text-gray-700 "
          >
            {open ? <X /> : <Menu />}
          </button>

          <div
            className={`md:hidden overflow-y-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 transition-y-0" : "max-h-0 opacity-0 overflow-hidden transition-y-2"}`}
          >
            <div
              className={` flex flex-col absolute top-16 left-0 w-full bg-white shadow-md gap-3 px-4 py-4`}
            >
              <Link
                className="text-gray-700 hover:text-blue-600 transition font-semibold"
                to="/"
              >
                Home
              </Link>
              <Link
                className="text-gray-700 hover:text-blue-600 transition font-semibold"
                to="/"
              >
                Products
              </Link>
              <Link
                className="text-gray-700 hover:text-blue-600 transition font-semibold"
                to="/about"
              >
                About us
              </Link>
              <Link
                className="text-gray-700 hover:text-blue-600 transition font-semibold"
                to="/contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
