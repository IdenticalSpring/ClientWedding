import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./sign-up/SignUp";
import SignIn from "./sign-in/SignIn";
import LandingPage from "./landing-page/LandingPage";
import DashboardLayout from "./dashboard/Dashboard";
import GuestList from "./dashboard/Clients";
import PrivateRoute from "./components/privateRoute"; // import PrivateRoute

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

        {/* Các route cần bảo vệ với PrivateRoute */}
        <Route
          path="/quanly/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<DashboardLayout />}
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
      </Routes>
    </Router>
  );
}

export default App;
