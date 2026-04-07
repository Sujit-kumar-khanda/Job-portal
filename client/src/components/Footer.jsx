import React from "react";

export default function Footer() {
  return (
    <footer className="bg-indigo-50 text-gray-700 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold text-indigo-600 mb-3">JobSeeker</h3>
          <p className="text-sm">
            Find your dream job or hire the right talent effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-indigo-600 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-700 cursor-pointer transition">Jobs</li>
            <li className="hover:text-indigo-700 cursor-pointer transition">Employers</li>
            <li className="hover:text-indigo-700 cursor-pointer transition">Dashboard</li>
            <li className="hover:text-indigo-700 cursor-pointer transition">Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-indigo-600 mb-3">Contact</h4>
          <p className="text-sm">📧 support@jobseeker.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>
        </div>
      </div>

      <div className="text-center text-sm mt-8 text-gray-500">
        © {new Date().getFullYear()} JobSeeker. All rights reserved.
      </div>
    </footer>
  );
}
