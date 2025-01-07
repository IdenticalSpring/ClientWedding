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
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ModalCreateWedding = ({ open, onClose, fetchWeddings }) => {
  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    eventDate: "",
    location: "",
    bankAccount: "",
    cryptoWallet: "",
    metaData: "",
    template_userId: "", // Template ID được chọn
  });

  const [templates, setTemplates] = useState([]); // Danh sách template
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Lấy danh sách templates từ API
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const token = Cookies.get("token");
        const decoded = jwtDecode(token);
        const response = await userAPI.getAllTemplateById(decoded.sub, 1, 100); // Page và limit cố định
        setTemplates(response.data?.data || []); // Lưu danh sách template
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      brideName,
      groomName,
      eventDate,
      location,
      bankAccount,
      cryptoWallet,
      metaData,
      template_userId,
    } = formData;

    // Validate required fields
    if (
      !brideName ||
      !groomName ||
      !eventDate ||
      !location ||
      !template_userId
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      // Gọi API để tạo đám cưới
      const response = await userAPI.createWedding(formData);
      if (response?.status === 201 || response?.status === 200) {
        onClose();
        fetchWeddings(); // Refresh danh sách đám cưới
        setFormData({
          brideName: "",
          groomName: "",
          eventDate: "",
          location: "",
          bankAccount: "",
          cryptoWallet: "",
          metaData: "",
          template_userId: "",
        });
      }
    } catch (error) {
      console.error("Error creating wedding:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm đám cưới</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Tên cô dâu</FormLabel>
              <TextField
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
                placeholder="Tên cô dâu"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Tên chú rể</FormLabel>
              <TextField
                name="groomName"
                value={formData.groomName}
                onChange={handleChange}
                placeholder="Tên chú rể"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Ngày tổ chức</FormLabel>
              <TextField
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Địa điểm</FormLabel>
              <TextField
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Địa điểm tổ chức"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Chọn Template</FormLabel>
              <Select
                name="template_userId"
                value={formData.template_userId}
                onChange={handleChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Chọn template
                </MenuItem>
                {loadingTemplates ? (
                  <MenuItem value="" disabled>
                    Đang tải danh sách...
                  </MenuItem>
                ) : (
                  templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Số tài khoản ngân hàng</FormLabel>
              <TextField
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="Số tài khoản ngân hàng (nếu có)"
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Ví tiền điện tử</FormLabel>
              <TextField
                name="cryptoWallet"
                value={formData.cryptoWallet}
                onChange={handleChange}
                placeholder="Ví tiền điện tử (nếu có)"
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Thông tin thêm</FormLabel>
              <TextField
                name="metaData"
                value={formData.metaData}
                onChange={handleChange}
                placeholder="Thông tin thêm về đám cưới"
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

export default ModalCreateWedding;
