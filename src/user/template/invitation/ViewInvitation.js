import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { userAPI } from "../../../service/user";

const ViewInvitation = () => {
    const { linkName } = useParams();
    const location = useLocation(); // Lấy thông tin từ state
    const [invitation, setInvitation] = useState(null);
    const isPreview = location.state?.isPreview || false; // Lấy isPreview từ state

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                if (isPreview) {
                    // Chế độ xem trước
                    const storedInvitation = sessionStorage.getItem("editInvitationData");
                    if (storedInvitation) {
                        setInvitation(JSON.parse(storedInvitation));
                    } else {
                        console.error("No invitation data found in sessionStorage.");
                    }
                } else if (linkName) {
                    // Chế độ bình thường
                    const response = await userAPI.getTemplateUserBylinkName(linkName);
                    if (response?.data?.invitation) {
                        setInvitation(response.data.invitation);
                    } else {
                        console.error("No invitation data found for linkName.");
                    }
                } else {
                    console.error("No valid data source found.");
                }
            } catch (error) {
                console.error("Error fetching invitation:", error);
            }
        };

        fetchInvitation();
    }, [isPreview, linkName]);

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
                <Typography variant="h6">Lời mời không tồn tại.</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f4f4f4",
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    width: invitation.metadata.style[0]?.minWidth || "800px",
                    height: invitation.metadata.style[0]?.minHeight || "500px",
                    backgroundColor: invitation.metadata.style[0]?.backgroundColor || "#f9f9f9",
                    position: "relative",
                    border: invitation.metadata.style[0]?.border || "1px solid #ddd",
                    boxSizing: "border-box",
                    padding: invitation.metadata.style[0]?.padding || "10px",
                }}
            >
                {invitation.metadata.components.flat().map((component) => (
                    <Box
                        key={component.id}
                        sx={{
                            ...component.style,
                            position: "absolute",
                        }}
                    >
                        {component.type === "text" && (
                            <Typography style={{ color: component.style.color }}>
                                {component.text}
                            </Typography>
                        )}
                        {component.type === "image" && (
                            <img
                                src={component.src}
                                alt=""
                                style={{
                                    width: component.style.width,
                                    height: component.style.height,
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ViewInvitation;
