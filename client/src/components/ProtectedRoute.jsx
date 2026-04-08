import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

/**
 * Wraps a route so it's only accessible when logged in.
 * Optionally enforces a specific role ("employer" | "seeker").
 */
export default function ProtectedRoute({ children, role }) {
  const { token, user, loadingUser } = useAppContext();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}