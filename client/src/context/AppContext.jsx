import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "./api"; // Centralized API instance with baseURL and interceptors

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(
  sessionStorage.getItem("token") || ""
);
 

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const role = user?.role;
  

  // 🔐 Save token
  const saveToken = (t) => {
  setToken(t);
  sessionStorage.setItem("token", t);
};

  // 🚪 Logout
  const logout = () => {
    setToken("");
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out");
  };

  // 👤 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      
      setLoadingUser(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log("User fetch error:", err.response?.data?.message);

        // ❌ Invalid / expired token handling
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        api,
        token,
        role,
        user,
        setUser,
        saveToken,
        logout,
        loadingUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);