import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Chú ý sửa import nếu bạn dùng thư viện này
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { userAPI } from "../service/user"; // Import hàm API
import Header from "../dashboard/components/Header";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.sub); // Lấy ID người dùng từ token
        setUserData({
          name: decoded.name || "",
          email: decoded.email || "",
          avatar: decoded.avatar || "",
        });
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await userAPI.getUserById(); // Gọi API lấy thông tin người dùng
      setUserData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prev) => ({
          ...prev,
          avatar: reader.result, // Hiển thị bản xem trước từ URL base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!userId) {
      alert("Không tìm thấy ID người dùng.");
      return;
    }

    try {
      const updatedData = {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar, // Nếu avatar là base64
      };

      await userAPI.updateUser(userId, updatedData); // Lưu thông tin
      alert("Cập nhật thành công!");
      fetchUserData(userId); // Tự động refresh sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  return (
    <>
      <Header />
      <Container
        maxWidth="sm"
        sx={{ mt: 4, backgroundColor: "#FFF4F4", p: 3, borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", color: "#D81B60", mb: 3 }}
        >
          Chỉnh sửa thông tin cá nhân
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            position: "relative",
          }}
        >
          <Avatar
            alt={userData.name}
            src={
              userData.avatar ||
              "https://th.bing.com/th/id/OIP.kQyrx9VbuWXWxCVxoreXOgHaHN?w=179&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            }
            sx={{ width: 120, height: 120, border: "2px solid #D81B60" }}
          />
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          >
            <PhotoCamera sx={{ color: "#D81B60" }} />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleAvatarChange}
            />
          </IconButton>
        </Box>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Tên"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            margin="normal"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            margin="normal"
            type="email"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <Button
            variant="text-container"
            fullWidth
            onClick={handleSaveChanges}
            sx={{
              minWidth: "fit-content",
              backgroundColor: "hsl(345, 75%, 42%)",
              color: "hsl(5, 90%, 95%)",
              "&:hover": {
                backgroundColor: "hsl(340, 80%, 38%)",
                opacity: 0.8,
              },
              alignSelf: "center",
            }}
          >
            Lưu thay đổi
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleBack}
            sx={{
              mt: 2,
              borderColor: "#D81B60",
              color: "#D81B60",
              ":hover": { backgroundColor: "#FCE4EC" },
            }}
          >
            Quay lại
          </Button>
        </Box>
      </Container>
    </>
  );
}
