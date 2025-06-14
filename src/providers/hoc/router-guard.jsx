import { Navigate } from "react-router-dom";

export const RouterGuard  = ({ children }) => {
  const isLoggedIn = localStorage.getItem("profile");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
