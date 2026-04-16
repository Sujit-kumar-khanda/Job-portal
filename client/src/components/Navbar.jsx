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

  // Close menus on route change
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC close
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [dropdownOpen]);

  // Active link
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

  // ===============================
  // ✅ PROFILE PHOTO FIX (IMPORTANT)
  // ===============================

  const fallbackAvatar = "https://www.gravatar.com/avatar/?d=mp&f=y";

  const profilePhoto =
    typeof user?.profilePhoto === "string" && user.profilePhoto.trim() !== ""
      ? user.profilePhoto
      : fallbackAvatar;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-15 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition">
            <Briefcase className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-extrabold text-blue-600 heading">JobSeeker</span>
        </Link>

        

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-12">
          {navLink("/", "Home")}
          {navLink("/jobs", "Jobs")}
          {!token && navLink("/why-us", "Why Us?")}
          {navLink("/about", "About")}

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profilePhoto}
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-200 hover:border-indigo-400 transition"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackAvatar;
              }}
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-5 border">
                {token ? (
                  <>
                    <p className="font-semibold">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500 mb-3">{user?.email}</p>

                    <Link
                      to={
                        user?.role === "employer"
                          ? "/employer-dashboard"
                          : "/seeker-dashboard"
                      }
                      className="block px-3 py-2 rounded hover:bg-indigo-50"
                    >
                      Dashboard
                    </Link>

                    {user?.role === "employer" && (
                      <Link
                        to="/employer-profile"
                        className="block px-3 py-2 rounded hover:bg-indigo-50"
                      >
                        Profile
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left mt-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-center text-gray-500 mb-4">Welcome 👋</p>

                    <Link
                      to="/login"
                      className="block text-center border border-indigo-600 text-indigo-600 py-2 rounded mb-2"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="block text-center bg-indigo-600 text-white py-2 rounded"
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
        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden ${open ? "block" : "hidden"} bg-white border-t px-6 py-4`}
      >
        {navLink("/", "Home")}
        {navLink("/jobs", "Jobs")}
        {navLink("/about", "About")}

        {!token ? (
          <>
            <Link to="/login" className="block py-2">
              Login
            </Link>
            <Link to="/signup" className="block py-2">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/seeker-dashboard" className="block py-2">
              Dashboard
            </Link>
            <button onClick={logout} className="text-red-500 py-2">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
