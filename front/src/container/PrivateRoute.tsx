import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { state } = useAuth();
  const { token } = state;

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
