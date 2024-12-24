import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../../service/user";
import { Box, Typography, Snackbar, Alert } from "@mui/material";

const ViewInvitation = () => {
    const { id } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "",
    });

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const response = await userAPI.getInvitationById(id);
                const invitationData = response.data;

                const processedSections = processMetadataToSections(invitationData.metadata);

                setInvitation(invitationData);
                setSections(processedSections);
            } catch (error) {
                console.error("Error fetching invitation:", error);
                showSnackbar("Không thể tải lời mời!", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [id]);

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const renderComponent = (component) => {
        console.log("component", component);
        switch (component.type) {
            case "text":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            fontSize: component.style.fontSize,
                            fontFamily: component.style.fontFamily,
                            width: component.style.width,
                            height: component.style.height,
                            color: component.style.color,
                            backgroundColor: component.style.fillColor,
                        }}
                    >
                        <Typography variant={component.style.fontSize}>
                            {component.text || "No text provided"}
                        </Typography>
                    </Box>
                );
            case "circle":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            width: component.style.width,
                            height: component.style.height,
                            borderRadius: "50%",
                            backgroundColor: component.style.fillColor,
                            borderColor: component.style.borderColor || "",
                            borderWidth: component.style.borderWidth || "0px",
                            borderColor: component.style.borderColor || "",
                            borderStyle: component.style.borderStyle || "none",
                            opacity: component.style.opacity / 100 || "1",
                        }}
                    >
                        <img
                            src={component.src}
                            alt="image component"
                            style={{
                                width: component.style.width,
                                height: component.style.height,
                                objectFit: "cover",
                                borderRadius:
                                    component.type === "circle"
                                        ? "50%"
                                        : component.style.borderRadius,
                            }}
                        />
                    </Box>
                );
            case "rect":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            width: component.style.width,
                            height: component.style.height,
                            backgroundColor: component.style.fillColor || "#ccc", // Default color if not provided
                            borderRadius: component.style.borderRadius || "0%",
                            borderColor: component.style.borderColor || "",
                            borderWidth: component.style.borderWidth || "0px",
                            borderColor: component.style.borderColor || "",
                            borderStyle: component.style.borderStyle || "none",
                            opacity: component.style.opacity / 100 || "1",
                        }}
                    />
                );
            case "image":
                if (!component.src) {
                    return (
                        <Box
                            key={component.id}
                            sx={{
                                position: "absolute",
                                left: component.style.left,
                                top: component.style.top,
                                width: component.style.width,
                                height: component.style.height,
                                backgroundColor: component.style.fillColor || "#ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px dashed #aaa", // Hiển thị khung thay thế
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "#aaa" }}>
                                No image source
                            </Typography>
                        </Box>
                    );
                }
            // Handle line case
            case "line":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            width: component.style.width, // Width of the line
                            height: component.style.height || 5, // Line height, default to 1px if not specified
                            backgroundColor: component.style.lineColor, // Line color
                            opacity: component.style.opacity / 100 || 1, // Set opacity
                        }}
                    />
                );

            default:
                return null;
        }
    };

    if (loading) {
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
                <Typography variant="h6">Không tìm thấy lời mời.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                {invitation.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {invitation.message}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {sections.map((section, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            border: "1px solid #ccc",
                            padding: 2,
                            minHeight: section.style?.minHeight,
                            minWidth: section.style?.minWidth,
                            backgroundColor: section.style?.backgroundColor,
                        }}
                    >
                        {section.components.map(renderComponent)}
                    </Box>
                ))}
            </Box>

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

const processMetadataToSections = (metadata) => {
    const styles = metadata?.style || [];
    const components = metadata?.components || [];

    return styles.map((styleItem, index) => ({
        id: `section-${index + 1}`,
        style: styleItem,
        components: components[index] || [],
    }));
};

export default ViewInvitation;
