import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { userAPI } from "../../service/user";

const AddEventModal = ({ onAddEvent }) => {
  const [weddingList, setWeddingList] = useState([]);
  const [eventData, setEventData] = useState({
    weddingId: "",
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    metaData: "",
  });

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const response = await userAPI.getAllWedding();
        setWeddingList(response.data);
      } catch (error) {
        console.error("Error fetching weddings:", error);
      }
    };

    fetchWeddings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!eventData.weddingId) {
      setNotification({
        open: true,
        severity: "warning",
        message: "Vui lòng chọn đám cưới!",
      });
      return;
    }

    try {
      await onAddEvent(eventData);
      setNotification({
        open: true,
        severity: "success",
        message: "Sự kiện đã được thêm thành công!",
      });
      setEventData({
        weddingId: "",
        eventName: "",
        eventDate: "",
        location: "",
        description: "",
        metaData: "",
      });
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.response?.data || "Có lỗi xảy ra khi thêm sự kiện!",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 400,
          bgcolor: "#FFEBEE", // Màu nền nhẹ
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          zIndex: 1300,
          border: "2px solid #FFCDD2", // Viền màu đỏ nhạt
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#D32F2F", // Màu đỏ đậm cho chữ
          }}
        >
          Thêm sự kiện mới
        </Typography>

        {/* Dropdown WeddingID */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Đám cưới</InputLabel>
          <Select
            name="weddingId"
            value={eventData.weddingId}
            onChange={handleChange}
          >
            <MenuItem value="" disabled>
              Chọn cô dâu & chú rể
            </MenuItem>
            {weddingList.map((wedding) => (
              <MenuItem key={wedding.id} value={wedding.id}>
                {wedding.brideName} & {wedding.groomName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Các trường thông tin khác */}
        <TextField
          label="Tên sự kiện"
          name="eventName"
          value={eventData.eventName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ngày sự kiện"
          name="eventDate"
          type="datetime-local"
          value={eventData.eventDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Địa điểm"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mô tả"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="MetaData"
          name="metaData"
          value={eventData.metaData}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#D32F2F", // Đỏ đậm
            "&:hover": {
              backgroundColor: "#B71C1C", // Đỏ tối hơn khi hover
            },
          }}
        >
          Thêm sự kiện
        </Button>
      </Box>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEventModal;
