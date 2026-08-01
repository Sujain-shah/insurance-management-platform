import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "AGENT") {
      return <Navigate to="/customers" replace />;
    }

    if (role === "CUSTOMER") {
  return <Navigate to="/my-policies" replace />;
}

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;