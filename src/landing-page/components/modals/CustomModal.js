// CustomModal.js
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

export const CustomModal = ({ open, onClose, content }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Đăng kí trợ lí</DialogTitle>
      <DialogContent
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        content Đăng kí trợ lí
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CustomModalSp = ({ open, onClose }) => {
  return (
    <Dialog
      open={open} // Điều kiện mở modal
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        position: "fixed", // Đặt modal ở vị trí cố định
        right: 0, // Đặt modal sát bên phải màn hình
        top: 0,
        bottom: 0,
        zIndex: 1000, // Đảm bảo modal luôn nằm trên các phần tử khác
      }}
    >
      <DialogTitle>Trung tâm trợ giúp</DialogTitle>
      <DialogContent
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        Content Trung tâm trợ giúp
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
