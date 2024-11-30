import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { userAPI } from "../service/user"; // Đảm bảo đường dẫn đúng
import ModalConfirmDelete from "./modal-clients/DeleteUser";

const GuestList = () => {
  const [guests, setGuests] = useState([]); // Lưu danh sách khách mời
  const [loading, setLoading] = useState(true); // Kiểm tra trạng thái tải
  const [openModal, setOpenModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null); // Khách mời muốn xóa
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Fetch dữ liệu khách mời
  const fetchAllGuests = async () => {
    try {
      const response = await userAPI.getGuestList(); // Giả sử đây là hàm gọi API
      console.log("API Response:", response.data); // Log ra để kiểm tra cấu trúc
      if (response.data && Array.isArray(response.data.guests)) {
        // Kiểm tra dữ liệu "guests" là mảng hợp lệ
        const guestList = response.data.guests.map((guest) => ({
          ...guest,
        }));
        setGuests(guestList); // Cập nhật dữ liệu vào state
      } else {
        throw new Error("Dữ liệu khách mời không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching guest list:", error);
      setNotification({
        open: true,
        severity: "error",
        message: "Đã có lỗi xảy ra khi tải danh sách khách mời.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGuests();
  }, []);

  // Tạo cấu trúc cột của DataGrid
  const columns = useMemo(
    () => [
      { field: "name", headerName: "Tên khách mời", flex: 1 },
      { field: "phone", headerName: "Số điện thoại", flex: 1.5 },
      { field: "relationship", headerName: "Mối quan hệ", flex: 1 },
      { field: "tableNumber", headerName: "Số bàn", flex: 1 },
      { field: "note", headerName: "Ghi chú", flex: 1 },
      {
        field: "actions",
        headerName: "Hành động",
        type: "actions",
        flex: 1,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Sửa"
            onClick={() => alert(`Sửa khách mời có ID: ${params.id}`)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Xóa"
            onClick={() => handleOpenModal(params.id)}
          />,
        ],
      },
    ],
    []
  );

  // Mở modal xác nhận xóa
  const handleOpenModal = (id) => {
    setGuestToDelete(id);
    setOpenModal(true);
  };

  return (
    <>
      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý khách mời
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Thêm khách mời
        </Button>
      </Box>
      <Box sx={{ height: 500 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={60}
                sx={{ marginBottom: 2 }}
              />
            ))}
          </Box>
        ) : (
          <DataGrid
            rows={guests}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        )}
      </Box>

      <ModalConfirmDelete
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={(id) => {
          setGuests(guests.filter((guest) => guest.id !== id));
          setNotification({
            open: true,
            severity: "success",
            message: "Khách mời đã được xóa thành công!",
          });
          setOpenModal(false);
        }}
        userToDelete={guestToDelete}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GuestList;
