import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const { token, user, logout } = useAppContext();
  const location = useLocation();
  const ref = useRef();

  const links = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/about", label: "About" },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  // close on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // outside click
  useEffect(() => {
    const fn = (e) => !ref.current?.contains(e.target) && setDrop(false);
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const avatar =
    user?.profilePhoto?.trim() || "https://www.gravatar.com/avatar/?d=mp";

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/10">
      <div className="w-full px-6 lg:px-12 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          {/* LOGO */}
          <img
            src="/logo.png"
            alt="CareerLink"
            className="h-10 w-auto object-contain mt-2 "
          />

          {/* TEXT */}
          <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent ml-0">
            CareerLink
          </span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-15">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative text-sm transition ${isActive(l.to)
                ? "text-indigo-400"
                : "text-gray-300 hover:text-white"
                }`}
            >
              {l.label}
              {isActive(l.to) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-sky-400" />
              )}
            </Link>
          ))}

          {/* PROFILE */}
          <div className="relative" ref={ref}>
            <img
              src={avatar}
              onClick={() => setDrop(!drop)}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-indigo-400 hover:scale-105 transition cursor-pointer"
            />

            {drop && (
              <div className="absolute right-0 mt-4 w-64 bg-[#0B0F1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">

                {token ? (
                  <>
                    {/* USER INFO */}
                    <div className="mb-4">
                      <p className="font-semibold text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* MENU */}
                    <div className="flex flex-col gap-1">
                      <Link
                        to="/seeker-dashboard"
                        className="px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={logout}
                        className="text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center border border-indigo-500 text-indigo-400 py-2 rounded-lg mb-2"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="block text-center bg-indigo-500 text-white py-2 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE BTN */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 py-4 bg-[#0B0F1A] border-t border-white/10 space-y-3">

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block py-2 text-gray-300 hover:text-white transition"
            >
              {l.label}
            </Link>
          ))}

          <div className="border-t border-white/10 pt-3">
            {token ? (
              <>
                <Link
                  to="/seeker-dashboard"
                  className="block py-2 text-indigo-400"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="text-red-400 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-300">
                  Login
                </Link>
                <Link to="/signup" className="block py-2 text-indigo-400">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}