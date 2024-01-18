import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { state } = useAuth();
  const { token } = state;

  if (token) {
    return <Navigate to="/balance-page" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
