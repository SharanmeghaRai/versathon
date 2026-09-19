import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page that requires login with this component (see App.jsx).
// If nobody is logged in, it redirects to the login page instead.
export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-20 text-ink/50">Loading...</div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
