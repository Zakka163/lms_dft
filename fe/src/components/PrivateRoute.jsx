// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }
    const userRole = jwtDecode(token).role;
    console.log(userRole);
    
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/access-denied" />;
    }
    return children;
  };