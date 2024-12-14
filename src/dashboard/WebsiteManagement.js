import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Divider,
} from "@mui/material";
import {
  CopyAll as CopyIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import Header from "../dashboard/components/Header";
import { userAPI } from "../service/user";
import { useNavigate } from "react-router-dom";

const WebsiteManagement = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await userAPI.getAllTemplateById(1, page, rowsPerPage);
        if (response?.status === 200 || response?.status === 201) {
          setTemplates(response?.data?.data);
          setTotalCount(response?.data?.total || 0);
          setRowsPerPage(response?.data?.limit);
        }
      } catch (err) {
        setError("Không thể lấy dữ liệu templates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [page, rowsPerPage]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Đã sao chép thành công!");
    });
  };

  const handleViewDetails = (template) => {
    alert(`Chi tiết về template: ${template.name}`);
    console.log(template?.brideName);
    console.log(template?.groomName);
    
    navigate(`/view/${template?.id}/${template?.brideName}/${template?.groomName}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Header />
      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Website template đã lưu
        </Typography>

        {loading && <CircularProgress />}

        {error && <Typography color="error">{error}</Typography>}

        {templates.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ alignItems: "center" }}>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template, index) => (
                  <TableRow key={index}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>
                      {template.description || "Chưa có mô tả"}
                    </TableCell>
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton onClick={() => handleCopy(template.name)}>
                        <CopyIcon />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          marginX: 1,
                        }}
                      />
                      <IconButton onClick={() => handleViewDetails(template)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          !loading && <Typography>Không có template nào</Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
    </>
  );
};

export default WebsiteManagement;
