import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { userAPI } from "../service/user";

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
        setUserId(decoded.sub);
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
          avatar: reader.result,
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
        avatar: userData.avatar,
      };

      await userAPI.updateUser(userId, updatedData);
      alert("Cập nhật thành công!");
      const token = Cookies.get("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserData({
          name: decoded.name || "",
          email: decoded.email || "",
          avatar: decoded.avatar || "",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <h2 style={{ color: "#D84B16" }}>Chỉnh sửa thông tin cá nhân</h2>
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
          sx={{ width: 100, height: 100 }}
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
          <PhotoCamera />
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
          sx={{
            "& .MuiInputLabel-root": { color: "#D84B16" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#D84B16" },
              "&:hover fieldset": { borderColor: "#D84B16" },
              "&.Mui-focused fieldset": { borderColor: "#D84B16" },
            },
          }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          margin="normal"
          type="email"
          sx={{
            "& .MuiInputLabel-root": { color: "#D84B16" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#D84B16" },
              "&:hover fieldset": { borderColor: "#D84B16" },
              "&.Mui-focused fieldset": { borderColor: "#D84B16" },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSaveChanges}
          sx={{
            mt: 2,
            backgroundColor: "#D84B16",
            "&:hover": { backgroundColor: "#BF4400" },
          }}
        >
          Lưu thay đổi
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleBack}
          sx={{
            mt: 2,
            borderColor: "#D84B16",
            color: "#D84B16",
            "&:hover": { borderColor: "#BF4400", color: "#BF4400" },
          }}
        >
          Quay lại
        </Button>
      </Box>
    </Container>
  );
}
