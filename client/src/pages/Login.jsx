import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, UserCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { api, saveToken, setUser } = useAppContext();

  const [role, setRole] = useState("seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("All fields are required");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password, role });
      saveToken(res.data.token);
      setUser(res.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
            Welcome Back 👋
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Login to manage your jobs & applications
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              autoComplete="off"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* ROLE */}
          <div className="relative">
            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* FORGOT */}
          <div className="text-right">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-gray-700 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
