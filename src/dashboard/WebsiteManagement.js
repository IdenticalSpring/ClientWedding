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
  Tooltip,
} from "@mui/material";
import {
  CopyAll as CopyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material"; // Sử dụng icon
import Header from "../dashboard/components/Header";
import { userAPI } from "../service/user";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Chỉnh đúng import
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from "@mui/icons-material/Delete";
const WebsiteManagement = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [viewType, setViewType] = useState('template');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchTemplates = async () => {
      const token = Cookies.get("token");
      const decoded = jwtDecode(token);
      try {
        const response = await userAPI.getAllTemplateById(
          decoded.sub,
          page,
          rowsPerPage
        );
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

  const handleCopy = (template) => {
    const url = `${window.location.origin}/${template?.linkName}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Đã sao chép liên kết thành công!");
    });
  };

  const handleViewDetails = (template) => {
    navigate(`/${template?.linkName}`);
  };

  const handleInvitationActions = (template) => {
    sessionStorage.setItem("editInvitationData","");
    navigate(`/invitation/edit/${template.id}`);
  };

  const handleViewInvitation = (template) => {
    navigate(`/invitation/view/${template.linkName}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleEditTemplate = (templateId) => {
    // Điều hướng đến trang Edit Template và truyền thông tin qua state
    navigate(`/template/edit/${templateId}`, { state: { isEditAction: true } });
  };
  const handleDeleteTemplate = async (templateId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa template này không?"
    );
    if (confirmDelete) {
      try {
        await userAPI.deleteTemplate(templateId); // Gọi API xóa template
        alert("Template đã được xóa thành công!");
        setTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template.id !== templateId)
        );
      } catch (error) {
        console.error("Lỗi khi xóa template:", error);
        alert("Xóa template thất bại!");
      }
    }
  };

  return (
    <>
      <Header />

      <Box sx={{ alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Website Template đã lưu
        </Typography>


        {loading && <CircularProgress />}

        {error && <Typography color="error">{error}</Typography>}

        {templates.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Thiệp cưới</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template, index) => (
                  <TableRow key={index}>
                    {/* Tên template */}
                    <TableCell>{template.name}</TableCell>

                    {/* Mô tả */}
                    <TableCell>{template.description || "Chưa có mô tả"}</TableCell>

                    {/* Template Actions */}
                    <TableCell>
                      {template.linkName ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Sao chép liên kết">
                            <IconButton onClick={() => handleCopy(template)}>
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xem chi tiết">
                            <IconButton onClick={() => handleViewDetails(template)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa Template">
                            <IconButton onClick={() => handleEditTemplate(template.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            onClick={() => handleDeleteTemplate(template.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography color="error">Thiếu linkName</Typography>
                      )}
                    </TableCell>

                    {/* Thiệp cưới Actions */}
                    <TableCell>
                      {template.linkName ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Thêm/Sửa Thiệp Mời">
                            <IconButton onClick={() => handleInvitationActions(template)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xem Thiệp Mời">
                            <IconButton onClick={() => handleViewInvitation(template)}>
                              <PreviewIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography color="error">Thiếu linkName</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>;

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
