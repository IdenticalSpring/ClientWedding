import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { activateAccount } from "../service/user";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ActivateAccountPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // State để hiển thị loading khi gửi yêu cầu
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

  const handleActivate = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true); // Bắt đầu loading

    if (!token) {
      setError("Bắt buộc có mã kích hoạt");
      setLoading(false); // Dừng loading
      return;
    }

    try {
      const response = await activateAccount(token);
      setLoading(false); // Dừng loading khi nhận được phản hồi

      if (!response.success) {
        setSuccessMessage("Kích hoạt tài khoản thành công");
        setToken("");
        setTimeout(() => {
          navigate("/dangnhap/"); // Chuyển hướng đến trang đăng nhập
        }, 1500);
      } else {
        setError("Mã kích hoạt không hợp lệ.");
      }
    } catch (err) {
      setLoading(false); // Dừng loading khi có lỗi
      setError("Đã xảy ra lỗi khi kích hoạt tài khoản.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh", // Chiếm toàn bộ chiều cao màn hình
        backgroundColor: "#f7f7f7", // Màu nền trang
        padding: "20px",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#D84B16", marginBottom: "20px" }}
      >
        Kích hoạt tài khoản
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <TextField
          label="Mã kích hoạt"
          variant="outlined"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
          sx={{ backgroundColor: "#f7f7f7", borderRadius: "8px" }}
        />
        {successMessage && (
          <Typography color="green" align="center" sx={{ fontWeight: "bold" }}>
            {successMessage}
          </Typography>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ fontWeight: "bold" }}>
            {error}
          </Typography>
        )}
        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={() => navigate("/")}
            color="secondary"
            variant="outlined"
            sx={{
              fontWeight: "bold",
              padding: "8px 20px",
              textTransform: "none",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleActivate}
            color="primary"
            variant="text-container"
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
            disabled={loading} // Vô hiệu hóa nút khi đang load
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Kích hoạt"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
