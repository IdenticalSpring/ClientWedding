import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userAPI } from "../service/user";
import { Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModalCreateWedding from "./modal-wedding/CreateWedding";
import Header from "./components/Header";

const Wedding = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateWeddingModal, setOpenCreateWeddingModal] = useState(false); // Modal thêm đám cưới
  const fetchWeddings = async () => {
    try {
      const userId = 1; // Thay thế bằng userId thực tế
      const data = await userAPI.getAllWedding(userId);
      setWeddings(data.data);
    } catch (error) {
      console.error("Error fetching weddings:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeddings();
  }, []);

  const columns = [
    { field: "brideName", headerName: "Cô dâu", width: 90 },
    { field: "groomName", headerName: "Chú rể", width: 150 },
    { field: "eventDate", headerName: "Ngày tổ chức", width: 150 },
    { field: "location", headerName: "Địa điểm", width: 150 },
    // Thêm các cột khác nếu cần
  ];

  return (
    <>
      <Header />
      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý đám cưới
        </Typography>
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
          onClick={() => setOpenCreateWeddingModal(true)} // Mở modal thêm đám cưới
        >
          Thêm đám cưới
        </Button>
      </Box>
      <ModalCreateWedding
        open={openCreateWeddingModal}
        onClose={() => setOpenCreateWeddingModal(false)}
        fetchWeddings={() => fetchWeddings()}
      />
      <DataGrid
        rows={weddings}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        loading={loading}
        checkboxSelection
      />
    </>
  );
};

export default Wedding;
