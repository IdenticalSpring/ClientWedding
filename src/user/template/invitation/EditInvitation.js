import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import { ArrowBack, Visibility, Save } from "@mui/icons-material";
import SidebarRight from "../../components/sidebar/SidebarRight";
import RenderComponent from "../../components/render/RenderComponent";
import { userAPI } from "../../../service/user";
import { TextField } from "@mui/material";

const EditInvitation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");
    const [invitation, setInvitation] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
    const [isPreview, setIsPreview] = useState(false);
    const sectionRef = useRef(null);
    const title = invitation?.title || "";

    const handleTitleChange = (e) => {
        setInvitation((prev) => ({
            ...prev,
            title: e.target.value, // Cập nhật tiêu đề trong state
        }));
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        const storedInvitation = sessionStorage.getItem("editInvitationData");
        if (storedInvitation) {
            setInvitation(JSON.parse(storedInvitation));
        } else {
            const fetchInvitation = async () => {
                try {
                    const response = await userAPI.getTemplateUserById(id, userId);
                    setInvitation(response.data.invitation);
                } catch (error) {
                    console.error("Error fetching invitation:", error);
                    showSnackbar("Không thể tải lời mời!", "error");
                    navigate("/template");
                }
            };

            fetchInvitation();
        }
    }, [id, userId, navigate]);


    const handleComponentClick = (component) => {
        setSelectedComponent(component);
    };

    const handleStyleChange = (key, value) => {
        if (selectedComponent) {
            setSelectedComponent((prev) => ({
                ...prev,
                style: { ...prev.style, [key]: value },
            }));

            const updatedComponents = invitation.metadata.components.map((component) =>
                component[0]?.id === selectedComponent.id
                    ? { ...component[0], style: { ...component[0].style, [key]: value } }
                    : component
            );

            setInvitation((prev) => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    components: updatedComponents,
                },
            }));
        }
    };

    const handleTextChange = (value) => {
        if (selectedComponent) {
            // Cập nhật state của `selectedComponent`
            setSelectedComponent((prev) => ({
                ...prev,
                text: value,
            }));

            // Cập nhật trong toàn bộ `invitation.metadata.components`
            const updatedComponents = invitation.metadata.components.map((component) => {
                if (Array.isArray(component)) {
                    return component.map((comp) =>
                        comp.id === selectedComponent.id ? { ...comp, text: value } : comp
                    );
                }
                return component;
            });

            setInvitation((prev) => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    components: updatedComponents,
                },
            }));
        }
    };


    const handleSave = async () => {
        try {
            const payload = {
                title: invitation.title, 
                template_userId: invitation.template_userId, 
                metadata: invitation.metadata, 
            };


            const response = await userAPI.updateInvitation(invitation.id, payload);

            sessionStorage.removeItem("editInvitationData");
            showSnackbar("Lưu thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            showSnackbar("Lưu thất bại. Vui lòng thử lại.", "error");
        }
    };


const handlePreviewToggle = () => {
    sessionStorage.setItem("editInvitationData", JSON.stringify(invitation));
    navigate(`/invitation/view/${invitation.id}`, {
        state: { isPreview: true }, // Truyền state isPreview
    });
};



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const response = await userAPI.uploadImages(file);
                const imageUrl = response.data.url;

                setSelectedComponent((prev) => ({
                    ...prev,
                    src: imageUrl,
                }));

                const updatedComponents = invitation.metadata.components.map((component) => {
                    if (Array.isArray(component)) {
                        return component.map((comp) =>
                            comp.id === selectedComponent.id
                                ? { ...comp, src: imageUrl }
                                : comp
                        );
                    }
                    return component;
                });

                setInvitation((prev) => ({
                    ...prev,
                    metadata: {
                        ...prev.metadata,
                        components: updatedComponents,
                    },
                }));

                showSnackbar("Upload ảnh thành công!", "success");
            } catch (error) {
                console.error("Error uploading image:", error);
                showSnackbar("Lỗi khi upload ảnh!", "error");
            }
        }
    };


    if (!invitation) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h6">Đang tải lời mời...</Typography>
            </Box>
        );
    }

    const { metadata } = invitation;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* AppBar */}
            <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Chỉnh sửa lời mời
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<Visibility />}
                        onClick={handlePreviewToggle}
                    >
                        Xem trước
                    </Button>


                    <Button color="inherit" startIcon={<Save />} onClick={handleSave}>
                        Lưu
                    </Button>
                </Toolbar>
            </AppBar>
            <TextField
                label="Tiêu đề lời mời"
                value={title || ""}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
            />
            {/* Main Content */}
            <Box
                sx={{
                    display: "flex",
                    flexGrow: 1,
                    overflow: "hidden",
                    marginTop: "64px", // Đặt khoảng cách bằng chiều cao AppBar
                }}
            >
                
                {/* Main Editor */}
                <Box
                    sx={{
                        position: "relative",
                        border: "1px dashed #ccc",
                        padding: 2,
                        height: metadata.style[0]?.minHeight,
                        width: metadata.style[0]?.minWidth ,
                        backgroundColor: "#f9f9f9",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        marginLeft: 2
                    }}
                >
                    {metadata.components.flat().map((component) => (
                        <RenderComponent
                            key={component.id}
                            component={component}
                            sectionRef={sectionRef}
                            onClick={handleComponentClick}
                        />
                    ))}
                </Box>

                {/* Sidebar */}
                <SidebarRight
                    selectedComponent={selectedComponent}
                    handleStyleChange={handleStyleChange}
                    handleTextChange={handleTextChange}
                    handleFileUpload={handleFileUpload}
                />

            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );

};

export default EditInvitation;
