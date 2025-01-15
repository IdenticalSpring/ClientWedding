import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Đúng cú pháp import
import SignUp from "./sign-up/SignUp";
import SignIn from "./sign-in/SignIn";
import LandingPage from "./landing-page/LandingPage";
import DashboardLayout from "./dashboard/Dashboard";
import GuestList from "./dashboard/Clients";
import PrivateRoute from "./components/privateRoute";
import WebsiteManagement from "./dashboard/WebsiteManagement";
import Profile from "./user/profile";
import ActivateAccountPage from "./sign-up/ActiveAccount";
import TemplatePage from "./user/template/TemplatePage";
import TemplateDetail from "./user/template/TemplateDetail";
import EditTemplate from "./user/template/edit/EditTemplate";
import ViewTemplate from "./user/template/edit/ViewTemplate";
import { ToastContainer } from "react-toastify";
import PaymentStatusToast from "./landing-page/components/PaymentStatusToast";
import WeddingList from "./dashboard/Wedding";
import ViewInvitation from "./user/template/invitation/ViewInvitation";
import EditInvitation from "./user/template/invitation/EditInvitation";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Trạng thái tải

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true); // Nếu token hợp lệ, cập nhật trạng thái đăng nhập
          } else {
            sessionStorage.removeItem("access_token"); // Xóa token nếu hết hạn
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          sessionStorage.removeItem("access_token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Đánh dấu việc kiểm tra đã hoàn tất
    };

    checkAuth();
  }, []);

  // Nếu đang kiểm tra trạng thái đăng nhập, hiển thị trạng thái tải
  if (loading) {
    return <div>Loading...</div>; // Bạn có thể thay bằng spinner hoặc một giao diện khác
  }

  return (
    <Router>
      <Routes>
        {/* Các route không cần bảo vệ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/TrangChu/" element={<LandingPage />} />
        <Route path="/dangnhap/" element={<SignIn />} />
        <Route path="/dangky/" element={<SignUp />} />
        <Route path="/kichhoattaikhoan/" element={<ActivateAccountPage />} />

        {/* Các route cần bảo vệ */}
        <Route
          path="/quanly/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<DashboardLayout><Navigate to="/quanlywebsite/" replace /></DashboardLayout>}
            />
          }
        />
        <Route
          path="/quanlykhachmoi/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<DashboardLayout><GuestList /></DashboardLayout>}
            />
          }
        />
        <Route
          path="/quanlywebsite/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<DashboardLayout><WebsiteManagement /></DashboardLayout>}
            />
          }
        />
        <Route
          path="/quanlydamcuoi/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<DashboardLayout><WeddingList /></DashboardLayout>}
            />
          }
        />
        <Route
          path="/nguoidung/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<DashboardLayout><Profile /></DashboardLayout>}
            />
          }
        />
        <Route
          path="/template/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<TemplatePage />}
            />
          }
        />
        <Route
          path="/template/:id"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<TemplateDetail />}
            />
          }
        />
        <Route
          path="/template/edit/:id"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<EditTemplate />}
            />
          }
        />
        <Route
          path="/:linkName"
              element={<ViewTemplate />}
        />
        <Route
          path="/:linkName/:guestId"
              element={<ViewTemplate />}
        />
        <Route
          path="/invitation/edit/:id"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<EditInvitation />}
            />
          }
        />
        <Route
          path="/invitation/view/:linkName"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<ViewInvitation />}
            />
          }
        />
        <Route
          path="/view/:linkName/:id"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<ViewInvitation />}
            />
          }
        />
      </Routes>
      <PaymentStatusToast />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
      />
    </Router>
  );
}

export default App;
