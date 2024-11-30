import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { activateAccount } from "../service/user";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ActivateAccountDialog({ open, onClose }) {
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
          onClose(); // Đóng Dialog sau 1.5s
          navigate("/sign-in/"); // Chuyển hướng đến trang đăng nhập
        }, 1500);
      }
    } catch (err) {
      setLoading(false); // Dừng loading khi có lỗi
      setError("Đã xảy ra lỗi khi kích hoạt tài khoản.");
    }
  };

  const handleClose = () => {
    setToken("");
    setError("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Kích hoạt tài khoản
      </DialogTitle>
      <DialogContent sx={{ padding: "20px" }}>
        <Box display="flex" flexDirection="column" gap={2}>
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
            <Typography
              color="green"
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              {successMessage}
            </Typography>
          )}
          {error && (
            <Typography
              color="error"
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "20px" }}>
        <Button
          onClick={handleClose}
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
          variant="contained"
          sx={{
            fontWeight: "bold",
            padding: "8px 20px",
            textTransform: "none",
          }}
          disabled={loading} // Vô hiệu hóa nút khi đang load
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Kích hoạt"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
