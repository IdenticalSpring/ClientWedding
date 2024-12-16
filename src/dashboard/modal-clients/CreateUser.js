import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Grid,
  FormLabel,
} from "@mui/material";
import { userAPI } from "../../service/user";

const ModalAddGuest = ({ open, onClose, fetchGuests }) => {
  const [formData, setFormData] = useState({
    weddingId: "",
    name: "",
    email: "",
    phone: "",
    relationship: "",
    status: "Invited",
    note: "",
  });

  const [weddings, setWeddings] = useState([]); // State để lưu danh sách đám cưới

  // Lấy danh sách đám cưới từ API
  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const response = await userAPI.getAllWedding(); // Gọi API để lấy danh sách weddings
        setWeddings(response.data); // Lưu danh sách weddings vào state
      } catch (error) {
        console.error("Error fetching weddings:", error);
      }
    };

    fetchWeddings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { weddingId, name, email, phone, relationship, status, note } =
      formData;

    // Validate required fields
    if (!weddingId || !name || !email || !phone || !relationship || !status) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      // Call API to add guest
      const response = await userAPI.addGuest(formData);
      if (response?.status === 201 || response?.status === 200) {
        onClose();
        fetchGuests(); // Refresh danh sách khách mời sau khi thêm
        setFormData({
          weddingId: "",
          name: "",
          email: "",
          phone: "",
          relationship: "",
          status: "Invited",
          note: "",
        });
      }
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm khách mời</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Đám cưới</FormLabel>
              <Select
                name="weddingId"
                value={formData.weddingId}
                onChange={handleChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Chọn cô dâu & chú rể
                </MenuItem>
                {weddings.map((wedding) => (
                  <MenuItem key={wedding.id} value={wedding.id}>
                    {wedding.brideName} & {wedding.groomName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Họ và Tên</FormLabel>
              <TextField
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Email</FormLabel>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu123@email.com"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Số điện thoại</FormLabel>
              <TextField
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123456789"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Mối quan hệ</FormLabel>
              <TextField
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                placeholder="Bạn bè, gia đình, đồng nghiệp..."
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="Invited">Invited</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Ghi chú</FormLabel>
              <TextField
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Ghi chú thêm (nếu có)"
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
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
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="secondary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddGuest;
