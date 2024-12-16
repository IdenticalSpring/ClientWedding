// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Button,
//   Box,
//   Snackbar,
//   Alert,
//   Skeleton,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import Header from "../dashboard/components/Header";
// import { userAPI } from "../service/user"; // Gọi API từ AdminAPI
// import ModalConfirmDelete from "../dashboard/modal-clients/DeleteUser";
// import ModalAddUser from "../dashboard/modal-clients/CreateUser";

// const Clients = () => {
//   const [guests, setGuests] = useState([]); // Lưu danh sách khách mời
//   const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
//   const [page, setPage] = useState(1); // Trang hiện tại
//   const [pageSize, setPageSize] = useState(20); // Số lượng bản ghi mỗi trang
//   const [totalGuests, setTotalGuests] = useState(0); // Tổng số khách mời
//   const [weddingList, setWeddingList] = useState([]); // Danh sách đám cưới
//   const [selectedWedding, setSelectedWedding] = useState(""); // Đám cưới đã chọn
//   const [openModal, setOpenModal] = useState(false); // Modal xác nhận xóa
//   const [guestToDelete, setGuestToDelete] = useState(null); // Khách mời muốn xóa
//   const [notification, setNotification] = useState({
//     open: false,
//     severity: "success",
//     message: "",
//   });
//   const [openAddModal, setOpenAddModal] = useState(false); // Modal thêm khách mời

//   // Gọi API để lấy danh sách đám cưới
//   const fetchWeddings = async () => {
//     try {
//       const response = await userAPI.getAllWedding(); // Giả sử có API này
//       setWeddingList(response.data); // Lưu danh sách đám cưới
//     } catch (error) {
//       console.error("Error fetching weddings:", error);
//     }
//   };

//   // Gọi API để lấy danh sách khách mời theo weddingId
//   const fetchGuests = async (page, limit, weddingId) => {
//     setLoading(true);
//     try {
//       const response = await userAPI.getGuestList(limit, page, weddingId); // Gọi API với limit, page, weddingId
//       const { guests, total } = response.data;

//       setGuests(guests);
//       setTotalGuests(total);
//     } catch (error) {
//       console.error("Error fetching guests:", error);
//       setNotification({
//         open: true,
//         severity: "error",
//         message: "Không thể tải danh sách khách mời!",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Gọi API khi trang, số lượng bản ghi hoặc đám cưới thay đổi
//   useEffect(() => {
//     fetchWeddings(); // Lấy danh sách đám cưới khi lần đầu tải
//   }, []);

//   useEffect(() => {
//     if (selectedWedding) {
//       fetchGuests(page, pageSize, selectedWedding); // Gọi API với weddingId
//     }
//   }, [selectedWedding, page, pageSize]);

//   const handleOpenModal = (id) => {
//     setGuestToDelete(id);
//     setOpenModal(true);
//   };

//   const handleEdit = (id) => {
//     alert(`Chỉnh sửa khách mời có ID: ${id}`);
//   };

//   const columns = [
//     { field: "name", headerName: "Tên khách mời", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "relationship", headerName: "Mối quan hệ", flex: 1 },
//     { field: "status", headerName: "Trạng thái", flex: 1 },

//     {
//       field: "actions",
//       headerName: "Hành động",
//       type: "actions",
//       flex: 1,
//       getActions: (params) => [
//         <GridActionsCellItem
//           icon={<EditIcon />}
//           label="Sửa"
//           onClick={() => handleEdit(params.id)}
//         />,
//         <GridActionsCellItem
//           icon={<DeleteIcon />}
//           label="Xóa"
//           onClick={() => handleOpenModal(params.id)}
//         />,
//       ],
//     },
//   ];

//   return (
//     <>
//       <Header />
//       <Box sx={{ alignItems: "center" }}>
//         <Typography variant="h4" gutterBottom>
//           Quản lý khách mời
//         </Typography>
//       </Box>

//       {/* Dropdown để chọn đám cưới */}
//       <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
//         <FormControl sx={{ minWidth: 200 }}>
//           <InputLabel id="wedding-select-label">Chọn đám cưới</InputLabel>
//           <Select
//             labelId="wedding-select-label"
//             value={selectedWedding}
//             onChange={(e) => setSelectedWedding(e.target.value)}
//             label="Chọn đám cưới"
//           >
//             {weddingList.map((wedding) => (
//               <MenuItem key={wedding.id} value={wedding.id}>
//                 {wedding.brideName} & {wedding.groomName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: 2,
//           mb: 2,
//           alignItems: "center",
//         }}
//       >
//         <Button
//           variant="text-container"
//           sx={{
//             minWidth: "fit-content",
//             backgroundColor: "hsl(345, 75%, 42%)",
//             color: "hsl(5, 90%, 95%)",
//             "&:hover": {
//               backgroundColor: "hsl(340, 80%, 38%)",
//               opacity: 0.8,
//             },
//             alignSelf: "center",
//           }}
//           startIcon={<AddIcon />}
//           onClick={() => setOpenAddModal(true)}
//         >
//           Thêm khách mời
//         </Button>
//       </Box>

//       <Box sx={{ height: 500 }}>
//         {loading ? (
//           Array.from({ length: 5 }).map((_, index) => (
//             <Box
//               sx={{ display: "flex", flexDirection: "row", marginBottom: 2 }}
//               key={index}
//             >
//               <Skeleton
//                 variant="text"
//                 width="20%"
//                 height={40}
//                 sx={{ marginRight: 2 }}
//               />
//               <Skeleton
//                 variant="text"
//                 width="30%"
//                 height={40}
//                 sx={{ marginRight: 2 }}
//               />
//               <Skeleton
//                 variant="text"
//                 width="20%"
//                 height={40}
//                 sx={{ marginRight: 2 }}
//               />
//               <Skeleton
//                 variant="text"
//                 width="20%"
//                 height={40}
//                 sx={{ marginRight: 2 }}
//               />
//               <Skeleton variant="circular" width={40} height={40} />
//             </Box>
//           ))
//         ) : guests.length === 0 ? (
//           <Typography variant="h6" color="text.secondary">
//             Không có khách mời nào trong đám cưới này.
//           </Typography>
//         ) : (
//           <DataGrid
//             rows={guests}
//             columns={columns}
//             pageSize={pageSize}
//             rowCount={totalGuests}
//             onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
//             onPageChange={(newPage) => setPage(newPage + 1)}
//             paginationMode="server" // Phân trang trên server
//             disableSelectionOnClick
//           />
//         )}
//       </Box>

//       <ModalConfirmDelete
//         open={openModal}
//         onClose={() => setOpenModal(false)}
//         onDelete={(id) => {
//           setGuests(guests.filter((guest) => guest.id !== id));
//           setNotification({
//             open: true,
//             severity: "success",
//             message: "Khách mời đã được xóa thành công!",
//           });
//           setOpenModal(false);
//         }}
//         guestId={guestToDelete}
//       />

//       <ModalAddUser
//         open={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         fetchGuests={() => fetchGuests(page, pageSize, selectedWedding)}
//       />
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={() => setNotification({ ...notification, open: false })}
//       >
//         <Alert severity={notification.severity} sx={{ width: "100%" }}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default Clients;
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
import { userAPI } from "../service/user"; // Gọi API từ AdminAPI
import ModalConfirmDelete from "../dashboard/modal-clients/DeleteUser";
import ModalAddUser from "../dashboard/modal-clients/CreateUser";

const Clients = () => {
  const [guests, setGuests] = useState([]); // Lưu danh sách khách mời
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [page, setPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(20); // Số lượng bản ghi mỗi trang
  const [totalGuests, setTotalGuests] = useState(0); // Tổng số khách mời
  const [weddingList, setWeddingList] = useState([]); // Danh sách đám cưới
  const [selectedWedding, setSelectedWedding] = useState(""); // Đám cưới đã chọn
  const [openModal, setOpenModal] = useState(false); // Modal xác nhận xóa
  const [guestToDelete, setGuestToDelete] = useState(null); // Khách mời muốn xóa
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false); // Modal thêm khách mời

  // Gọi API để lấy danh sách đám cưới
  const fetchWeddings = async () => {
    try {
      const response = await userAPI.getAllWedding(); // Giả sử có API này
      setWeddingList(response.data); // Lưu danh sách đám cưới
    } catch (error) {
      console.error("Error fetching weddings:", error);
    }
  };

  // Gọi API để lấy danh sách khách mời theo weddingId
  const fetchGuests = async (page, limit, weddingId) => {
    setLoading(true);
    try {
      const response = await userAPI.getGuestList(limit, page, weddingId); // Gọi API với limit, page, weddingId
      const { guests, total } = response.data;

      setGuests(guests);
      setTotalGuests(total);
    } catch (error) {
      console.error("Error fetching guests:", error);
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
    fetchWeddings(); // Lấy danh sách đám cưới khi lần đầu tải
  }, []);

  useEffect(() => {
    if (selectedWedding) {
      fetchGuests(page, pageSize, selectedWedding); // Gọi API với weddingId
    }
  }, [selectedWedding, page, pageSize]);

  const handleOpenModal = (id) => {
    setGuestToDelete(id);
    setOpenModal(true);
  };

  const handleEdit = (id) => {
    alert(`Chỉnh sửa khách mời có ID: ${id}`);
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
      ],
    },
  ];

  return (
    <>
      <Header />
      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý khách mời
        </Typography>
      </Box>

      {/* Dropdown để chọn đám cưới */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
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
          onClick={() => setOpenAddModal(true)}
        >
          Thêm khách mời
        </Button>
      </Box>

      <Box sx={{ height: 500 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Box
              sx={{ display: "flex", flexDirection: "row", marginBottom: 2 }}
              key={index}
            >
              <Skeleton
                variant="text"
                width="20%"
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton
                variant="text"
                width="30%"
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton
                variant="text"
                width="20%"
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton
                variant="text"
                width="20%"
                height={40}
                sx={{ marginRight: 2 }}
              />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          ))
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
            paginationMode="server" // Phân trang trên server
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
        guestId={guestToDelete}
      />

      <ModalAddUser
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
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
