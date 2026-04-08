import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AppContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
    });

    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          const msg = err.response?.data?.message || "Unauthorized request";
          toast.error(msg);
          // Clear auth state on any 401
          setToken("");
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
        return Promise.reject(err);
      },
    );

    return instance;
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log("Failed to fetch user:", err.response?.data?.message);
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [token]);  // removed api from deps to avoid infinite loop

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <AppContext.Provider
      value={{
        api,
        token,
        user,
        setUser,
        saveToken,
        logout,
        toast,
        navigate,
        loadingUser,
        BASE_URL: BASE_URL.replace("/api", ""),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);