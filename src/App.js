import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./sign-up/SignUp";
import SignIn from "./sign-in/SignIn";
import LandingPage from "./landing-page/LandingPage";
import DashboardLayout from "./dashboard/Dashboard";
import GuestList from "./dashboard/Clients";
import PrivateRoute from "./components/privateRoute"; // import PrivateRoute
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
  // Giả sử bạn kiểm tra trạng thái đăng nhập từ sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu có token trong sessionStorage thì cho phép đăng nhập
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Các route không cần bảo vệ */}
        <Route path="*" element={<LandingPage />} />
        <Route path="/TrangChu/" element={<LandingPage />} />
        <Route path="/dangnhap/" element={<SignIn />} />
        <Route path="/dangky/" element={<SignUp />} />
        <Route path="/kichhoattaikhoan/" element={<ActivateAccountPage />} />

        {/* Các route cần bảo vệ với PrivateRoute */}
        <Route
          path="/quanly/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <DashboardLayout>
                  <Navigate to="/quanlywebsite/" replace />
                </DashboardLayout>
              }
            />
          }
        />
        <Route
          path="/quanlykhachmoi/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <DashboardLayout>
                  <GuestList />
                </DashboardLayout>
              }
            />
          }
        />
        <Route
          path="/quanlywebsite/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <DashboardLayout>
                  <WebsiteManagement />
                </DashboardLayout>
              }
            />
          }
        />
        <Route
          path="/quanlydamcuoi/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <DashboardLayout>
                  <WeddingList />
                </DashboardLayout>
              }
            />
          }
        />
        <Route
          path="/nguoidung/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />
          }
        />

        {/* New Template Page Route */}
        <Route path="/template/" element={<TemplatePage />} />
        <Route path="/template/:id" element={<TemplateDetail />} />
        <Route path="/template/edit/:id" element={<EditTemplate />} />
        <Route
          path="/:linkName"
          element={<ViewTemplate />}
        />
        <Route path="/invitation/edit/:id" element={<EditInvitation />} />
        <Route path="/invitation/view/:linkName" element={<ViewInvitation />} />
        <Route path="/view/:linkName/:id" element={<ViewInvitation />} />
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
