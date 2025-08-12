import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, status } = useSelector((state) => state.auth);

  if (status && user) {
    console.log(user);
    console.log(status);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
