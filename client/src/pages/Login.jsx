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

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      return toast.error("All fields are required");
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: cleanEmail,
        password: cleanPassword,
        role,
      });

      saveToken(res.data.token);

      setUser(res.data.user);
      sessionStorage.setItem("token", res.data.token);
      

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white relative overflow-hidden px-4">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 blur-[180px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500 blur-[180px] opacity-20 animate-pulse"></div>

      {/* CARD WRAPPER */}
      <div className="relative w-full max-w-md">

        {/* OUTER GLOW BORDER */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-3xl blur opacity-30"></div>

        {/* MAIN CARD */}
        <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Welcome Back <span className="text-indigo-400">👋</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Login to continue your journey
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-indigo-400 transition" size={18} />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500
                outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-indigo-400 transition" size={18} />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500
                outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition duration-300"
              />
            </div>

            {/* ROLE SELECT (FIXED VISIBILITY) */}
            <div className="relative group">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-indigo-400 transition" size={18} />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white
                outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition appearance-none cursor-pointer"
              >
                <option className="bg-[#0b0f1a]" value="seeker">
                  Job Seeker
                </option>
                <option className="bg-[#0b0f1a]" value="employer">
                  Employer
                </option>
              </select>

              {/* dropdown arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                ▼
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition"
              >
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold
              shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition duration-300 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center mt-6 text-gray-400 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;