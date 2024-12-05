import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import CircularProgress from "@mui/material/CircularProgress"; // Thêm loading indicator
import { resetPassword } from "../service/user"; // Import service gọi API

function ResetPassword({ open, handleClose }) {
  const [newPassword, setNewPassword] = useState(""); // State để lưu mật khẩu mới
  const [token, setToken] = useState(""); // State để lưu token nhập vào
  const [error, setError] = useState(""); // State để lưu lỗi
  const [loading, setLoading] = useState(false); // Thêm state loading khi gửi yêu cầu
  const [successMessage, setSuccessMessage] = useState(""); // State để lưu thông báo thành công

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset lỗi trước khi gửi yêu cầu
    setSuccessMessage(""); // Reset thông báo thành công
    setLoading(true); // Bắt đầu loading

    if (!newPassword || !token) {
      setError("Vui lòng nhập mật khẩu mới và mã token.");
      setLoading(false); // Dừng loading nếu có lỗi
      return;
    }

    try {
      const response = await resetPassword(token, newPassword); // Gọi API resetPassword
      if (!response.success) {
        setSuccessMessage("Mật khẩu của bạn đã được đặt lại thành công.");
        setTimeout(() => handleClose(), 2000); // Đóng dialog sau 2 giây
      } else {
        setError("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Đặt lại mật khẩu</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Vui lòng nhập mã token và mật khẩu mới để hoàn tất quá trình đặt lại
          mật khẩu.
        </DialogContentText>

        {/* Trường nhập Token */}
        <OutlinedInput
          required
          margin="dense"
          label="Mã Token"
          value={token}
          onChange={(e) => setToken(e.target.value)} // Cập nhật giá trị token khi thay đổi
          fullWidth
          error={!!error}
          helperText={error ? "Vui lòng nhập mã token." : ""}
        />

        {/* Trường nhập Mật khẩu mới */}
        <OutlinedInput
          required
          margin="dense"
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} // Cập nhật giá trị mật khẩu mới khi thay đổi
          fullWidth
          error={!!error}
          helperText={
            error && !newPassword ? "Vui lòng nhập mật khẩu mới." : ""
          }
        />

        {successMessage && (
          <DialogContentText
            sx={{ color: "green", textAlign: "center", mt: 2 }}
          >
            {successMessage}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
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
          onClick={handleSubmit}
          disabled={loading || !newPassword || !token} // Disable khi đang loading hoặc mật khẩu mới trống hoặc token trống
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ResetPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ResetPassword;
