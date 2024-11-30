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
import { forgotPassword } from "../service/user"; // Import service gọi API
import ResetPassword from "./ResetPassword"; // Import ResetPassword component

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState(""); // State để lưu email
  const [error, setError] = useState(""); // State để lưu lỗi
  const [successMessage, setSuccessMessage] = useState(""); // State để lưu thông báo thành công
  const [loading, setLoading] = useState(false); // Thêm state loading khi gửi yêu cầu
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false); // Điều khiển trạng thái mở Dialog ResetPassword
  const [token, setToken] = useState(""); // Lưu token nhận được từ API

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset lỗi trước khi gửi yêu cầu
    setSuccessMessage(""); // Reset thông báo thành công
    setLoading(true); // Bắt đầu loading

    if (!email) {
      setError("Vui lòng nhập email");
      setLoading(false); // Dừng loading nếu có lỗi
      return;
    }

    try {
      const response = await forgotPassword(email); // Gọi API forgotPassword
      if (!response.success) {
        setSuccessMessage(
          "Chúng tôi đã gửi một đường dẫn đặt lại mật khẩu đến email của bạn."
        );
        setEmail(""); // Reset email sau khi gửi thành công
        setToken(response.token); // Lưu token nhận được từ API
        setResetPasswordOpen(true); // Mở Dialog ResetPassword
        setTimeout(() => handleClose(), 2000); // Đóng dialog sau 2 giây
      } else {
        setError("Email không hợp lệ hoặc không tồn tại.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng nhập địa chỉ email của bạn để nhận đường dẫn đặt lại mật
            khẩu.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            placeholder="Nhập email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email khi thay đổi
            fullWidth
            error={!!error}
            helperText={error}
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
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !email} // Disable khi đang loading hoặc email trống
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Tiếp tục"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hiển thị ResetPassword khi người dùng đã nhập email thành công */}
      <ResetPassword
        open={resetPasswordOpen}
        handleClose={() => setResetPasswordOpen(false)}
        token={token} // Truyền token cho ResetPassword
      />
    </>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
