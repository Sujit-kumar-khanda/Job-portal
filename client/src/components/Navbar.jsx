import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { token, user, logout } = useAppContext();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // ✅ Close menus on route change
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // ✅ Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ESC (optimized)
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [dropdownOpen]);

  // ✅ Active link
  const isActivePath = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const navLink = (to, label) => {
    const isActive = isActivePath(to);

    return (
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className={`relative px-1 text-sm font-medium transition ${
          isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
        )}
      </Link>
    );
  };

  // ✅ PROFILE PHOTO LOGIC - Updated to use profilePhoto from context
  const baseURL = "http://localhost:5000"; // Same as in your profile hook
  const profilePhotoUrl = user?.profilePhoto
    ? `${baseURL}${user.profilePhoto}`
    : user?.avatar ||
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"; // Fallback to avatar or default

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition">
            <Briefcase className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-xl font-extrabold text-gray-800">
            JobSeeker
          </span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-15 ">
          {navLink("/", "Home")}
          {navLink("/jobs", "Jobs")}
          {!token && navLink("/why-us", "Why Us?")}
          {user?.role === "seeker" && navLink("/ai-roadmap", "AI Roadmap")}
          {navLink("/about", "About")}

          {/* ✅ PROFILE DROPDOWN FIXED */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profilePhotoUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-200 hover:border-indigo-400 transition"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-2xl p-5 border border-gray-100 animate-in fade-in zoom-in-95">
                {token ? (
                  <>
                    <p className="font-semibold text-gray-800">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">{user?.email}</p>

                    <Link
                      to={
                        user?.role === "employer"
                          ? "/employer-dashboard"
                          : "/seeker-dashboard"
                      }
                      className="block px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Dashboard
                    </Link>
                    {user?.role === "employer" && (
                      <Link
                        to="/employer-profile"
                        className="block px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Profile
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left mt-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Welcome 👋 <br /> Login to continue
                    </p>

                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 mb-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="block w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t px-6 py-6 flex flex-col gap-5 text-center">
          {navLink("/", "Home")}
          {navLink("/jobs", "Jobs")}
          {navLink("/about", "About")}

          {!token ? (
            <>
              <Link to="/login" className="px-4 py-2 border rounded-xl">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={logout} className="text-red-500">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
