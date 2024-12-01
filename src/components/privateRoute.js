// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
    return <Navigate to="/dangnhap" />;
  }

  // Nếu người dùng đã đăng nhập, trả về element của route
  return element;
};

export default PrivateRoute;
