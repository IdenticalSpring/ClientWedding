import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  Skeleton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Header from "../dashboard/components/Header";
import { userAPI } from "../service/user";
import ModalConfirmDelete from "../dashboard/modal-clients/DeleteUser";
import ModalAddUser from "../dashboard/modal-clients/CreateUser";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {  useNavigate } from "react-router-dom";
import { Visibility as VisibilityIcon, CopyAll as CopyIcon} from "@mui/icons-material";
const Clients = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalGuests, setTotalGuests] = useState(0);
  const [weddingList, setWeddingList] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [openAddUserModal, setOpenAddUserModal] = useState(false); // Modal thêm khách mời

  // Gọi API để lấy danh sách đám cưới
  const fetchWeddings = async () => {
    try {
      const token = Cookies.get("token");
      const decoded = jwtDecode(token);
      const response = await userAPI.getAllWedding(decoded.sub);
      setWeddingList(response.data);
    } catch (error) {
      console.error("Error fetching weddings:", error);
    }
  };

  // Gọi API để lấy danh sách khách mời theo weddingId
  const fetchGuests = async (page, limit, weddingId) => {
    setLoading(true);
    try {
      const response = await userAPI.getGuestList(limit, page, weddingId);
      const { guests, total } = response.data;

      // Nếu `linkName` chưa tồn tại, map để thêm từ weddingDetail.templateUser
      const updatedGuests = guests.map((guest) => ({
        ...guest,
        linkName: guest.linkName || guest?.weddingDetail?.templateUser?.linkName || null,
      }));

      setGuests(updatedGuests);
      setTotalGuests(total);
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: "Không thể tải danh sách khách mời!",
      });
    } finally {
      setLoading(false);
    }
  };


  // Gọi API khi trang, số lượng bản ghi hoặc đám cưới thay đổi
  useEffect(() => {
    fetchWeddings();
  }, []);

  useEffect(() => {
    if (selectedWedding) {
      fetchGuests(page, pageSize, selectedWedding);
    }
  }, [selectedWedding, page, pageSize]);

  const handleOpenModal = (id) => {
    setGuestToDelete(id);
    setOpenModal(true);
  };
  const handlePreviewTemplate = (linkName,guestid) => {
    navigate(`/${linkName}/${guestid}`);
  };
  const handleEdit = (id) => {
    alert(`Chỉnh sửa khách mời có ID: ${id}`);
  };
  const handleCopyTemplate = (linkName, guestid) => {
    const url = `${window.location.origin}/${linkName}/${guestid}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Đã sao chép liên kết thành công!");
    });
  };
  const columns = [
    { field: "name", headerName: "Tên khách mời", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "relationship", headerName: "Mối quan hệ", flex: 1 },
    { field: "status", headerName: "Trạng thái", flex: 1 },

    {
      field: "actions",
      headerName: "Hành động",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Sửa"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Xóa"
          onClick={() => handleOpenModal(params.id)}
        />,
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="Hiện thiệp cưới"
          onClick={() => handlePreviewTemplate(params.row.linkName,params.id)} 
        />,
        <GridActionsCellItem
          icon={<CopyIcon />}
          label="Sao chép thiệp cưới"
          onClick={() => handleCopyTemplate(params.row.linkName, params.id)}
        />,
      ],
    },
  ];


  return (
    <>
      <Header />
      {/* <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý khách mời
        </Typography>
      </Box> */}

      {/* Dropdown để chọn đám cưới */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, marginTop: 2, }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="wedding-select-label">Chọn đám cưới</InputLabel>
          <Select
            labelId="wedding-select-label"
            value={selectedWedding}
            onChange={(e) => setSelectedWedding(e.target.value)}
            label="Chọn đám cưới"
          >
            {weddingList.map((wedding) => (
              <MenuItem key={wedding.id} value={wedding.id}>
                {wedding.brideName} & {wedding.groomName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
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
          startIcon={<AddIcon />}
          onClick={() => setOpenAddUserModal(true)} // Mở modal thêm khách mời
        >
          Thêm khách mời
        </Button>
      </Box>

      <Box
        sx={{
          height: 500,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <Typography variant="h6" color="text.secondary">
            Hãy chọn đám cưới để xem danh sách khách mời.
          </Typography>
        ) : guests.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            Không có khách mời nào trong đám cưới này.
          </Typography>
        ) : (
          <DataGrid
            rows={guests}
            columns={columns}
            pageSize={pageSize}
            rowCount={totalGuests}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onPageChange={(newPage) => setPage(newPage + 1)}
            paginationMode="server"
            disableSelectionOnClick
          />
        )}
      </Box>

      <ModalConfirmDelete
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={async (id) => {
          try {
            await userAPI.deleteGuest(id); // Gọi API xóa khách mời
            fetchGuests(page, pageSize, selectedWedding); // Gọi lại API để cập nhật danh sách khách mời
            setNotification({
              open: true,
              severity: "success",
              message: "Khách mời đã được xóa thành công!",
            });
          } catch (error) {
            setNotification({
              open: true,
              severity: "error",
              message:
                error.response?.data?.message || "Lỗi khi xóa khách mời!",
            });
          }
          setOpenModal(false);
        }}
        userToDelete={guestToDelete}
      />

      <ModalAddUser
        open={openAddUserModal}
        onClose={() => setOpenAddUserModal(false)}
        fetchGuests={() => fetchGuests(page, pageSize, selectedWedding)}
      />

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

export default Clients;
