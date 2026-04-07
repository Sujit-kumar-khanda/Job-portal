import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Briefcase } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { api, saveToken, setUser } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });
  const [loading, setLoading] = useState(false);

  const handleonChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password)
      return toast.error("All fields are required");

    try {
      setLoading(true);
      const res = await api.post("/auth/register", formData);

      saveToken(res.data.token);
      setUser(res.data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-8 sm:p-10">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Create Account ✨
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Join JobSeeker and unlock new opportunities
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Full name"
              name="name"
              value={formData.name}
              onChange={handleonChange}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.email}
              onChange={handleonChange}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="password"
              placeholder="Create password"
              name="password"
              value={formData.password}
              onChange={handleonChange}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* ROLE */}
          <div className="relative">
            <Briefcase
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleonChange}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-gray-700 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
