import React, { useEffect, useState } from "react";
import { userAPI } from "../../service/user"; // Đảm bảo đúng đường dẫn
import { Box, Typography, Paper, CircularProgress, Button, Pagination } from "@mui/material";

const TemplateContent = () => {
    const [templates, setTemplates] = useState([]); // Khởi tạo với mảng trống
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Số trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [limit] = useState(20); // Số lượng item mỗi trang

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await userAPI.getAllTemplates(currentPage, limit);
                console.log("Fetched templates:", response.data.data); // Log templates
                setTemplates(response.data.data || []); // Gán templates từ API

                // Tính toán tổng số trang từ thông tin API trả về
                setTotalPages(Math.ceil(response.data.total / limit)); // Tổng số trang = tổng mẫu / limit
            } catch (error) {
                console.error("Error fetching templates:", error);
                setTemplates([]); // Gán mảng trống nếu có lỗi
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };

        fetchTemplates();
    }, [currentPage, limit]); // Khi currentPage hoặc limit thay đổi sẽ gọi lại API

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Cập nhật trang khi người dùng chọn
        setLoading(true); // Đặt lại trạng thái loading khi thay đổi trang
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!Array.isArray(templates) || templates.length === 0) {
        return (
            <Box sx={{ textAlign: "center", padding: "20px" }}>
                <Typography variant="h6" color="text.secondary">
                    Không có mẫu nào để hiển thị.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "20px" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                {templates.map((template) => (
                    <Paper
                        key={template.id}
                        sx={{
                            width: "300px",
                            height: "auto",
                            border: "1px solid #ccc",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            transition: "all 0.3s ease",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            textAlign: "center",
                            "&:hover": {
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <img
                            src={template.thumbnailUrl}
                            alt={template.name}
                            style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                            }}
                        />
                        <Box sx={{ padding: "15px" }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "1.2rem",
                                    marginBottom: "10px",
                                    fontWeight: "600",
                                    color: "primary.main",
                                }}
                            >
                                {template.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#666", fontSize: "0.9rem", marginBottom: "10px" }}
                            >
                                {template.description}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#444", fontSize: "0.9rem", marginBottom: "15px" }}
                            >
                                <strong>Giao diện:</strong> {template.accessType}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: "hsl(345, 75%, 42%)",
                                    "&:hover": {
                                        backgroundColor: "hsl(340, 80%, 38%)",
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                Thử ngay
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
};

export default TemplateContent;
