import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative text-white pt-16 pb-10 overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-indigo-500 blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-sky-500 blur-[120px] opacity-20"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-sky-400 text-transparent bg-clip-text mb-4">
              CareerLink
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover verified opportunities and connect with top employers. 
              Build your future with confidence using a modern hiring platform.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="font-semibold text-indigo-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {["Jobs", "Employers", "Dashboard", "Contact"].map((item, i) => (
                <li
                  key={i}
                  className="relative w-fit cursor-pointer text-gray-400 hover:text-white transition"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-300 hover:w-full"></span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="font-semibold text-indigo-400 mb-4">
              Contact
            </h4>
            <div className="text-sm text-gray-400 space-y-2">
              <p>📧 support@CareerLink.com</p>
              <p>📞 +91 98765 43210</p>
              <p className="text-gray-500 text-xs mt-3">
                We usually respond within 24 hours.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30 my-10"></div>

        {/* Bottom */}
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CareerLink. Built for modern careers.
        </div>
      </div>
    </footer>
  );
}