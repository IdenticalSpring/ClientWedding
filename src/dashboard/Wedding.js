import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { userAPI } from "../service/user";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModalCreateWedding from "./modal-wedding/CreateWedding";
import Header from "./components/Header";
import {jwtDecode} from "jwt-decode";

const Wedding = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateWeddingModal, setOpenCreateWeddingModal] = useState(false);

  const fetchWeddings = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
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
    { field: "brideName", headerName: "Cô dâu", flex: 1 },
    { field: "groomName", headerName: "Chú rể", flex: 1 },
    { field: "eventDate", headerName: "Ngày tổ chức", flex: 1 },
    { field: "location", headerName: "Địa điểm", flex: 1 },
  ];

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mb: 2,
          alignItems: "center",
          marginTop: 2,
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
          onClick={() => setOpenCreateWeddingModal(true)}
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
