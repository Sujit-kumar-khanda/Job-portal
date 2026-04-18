import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Briefcase, Eye, EyeOff } from "lucide-react";
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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      const { token, user } = res.data;

      saveToken(token);
      setUser(user);
      sessionStorage.setItem("token", token);

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center px-16 bg-[#0b0f1a] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 blur-[150px] opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500 blur-[150px] opacity-20"></div>

      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center items-start pl-10">
          <h1 className="text-4xl font-bold leading-tight">
            Join the future of{" "}
            <span className="text-indigo-400">Career Growth</span>
          </h1>

          <p className="text-gray-400 mt-4">
            Create your profile and get discovered by top recruiters worldwide.
            Build your career with confidence.
          </p>

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="signup visual"
            className="mt-10 rounded-2xl shadow-xl opacity-90 hover:opacity-100 transition duration-300"
          />
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                        rounded-2xl p-6 shadow-xl max-w-md w-full ml-auto">

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Create your account
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Start your journey with us
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           text-white placeholder-gray-400"
              />
            </div>

            {/* EMAIL */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           text-white placeholder-gray-400"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-2.5 rounded-lg bg-black/40 border border-white/10
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           text-white placeholder-gray-400"
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* ROLE */}


            <div className="relative">
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl 
               bg-[#0B0F1A]/80 border border-white/10 
               cursor-pointer hover:border-indigo-400 transition"
              >
                <Briefcase size={18} className="text-gray-400" />
                <span className="text-white capitalize">{formData.role}</span>
              </div>

              {open && (
                <div className="absolute w-full mt-2 bg-[#0B0F1A]/95 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">

                  {["seeker", "employer"].map((role) => (
                    <div
                      key={role}
                      onClick={() => {
                        setFormData({ ...formData, role });
                        setOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-white/5 cursor-pointer capitalize"
                    >
                      {role === "seeker" ? "Job Seeker" : "Employer"}
                    </div>
                  ))}

                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500
                         font-medium hover:scale-[1.02] active:scale-95 transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center mt-5 text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;