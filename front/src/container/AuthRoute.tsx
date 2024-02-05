import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { token } = useAuth();
  if (token) {
    console.log("AuthRoute:", token);
    return <Navigate to="/balance" replace />;
  }
  return <>{children}</>;
};

export default AuthRoute;
