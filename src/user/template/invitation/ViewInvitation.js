import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { userAPI } from "../../../service/user";

const ViewInvitation = () => {
    const { linkName, id } = useParams();
    const location = useLocation();
    const [invitation, setInvitation] = useState(null);
    const isPreview = location.state?.isPreview || false;

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                let currentInvitation;

                if (isPreview) {
                    // Lấy dữ liệu từ sessionStorage nếu là chế độ xem trước
                    const storedInvitation = sessionStorage.getItem("editInvitationData");
                    if (storedInvitation) {
                        currentInvitation = JSON.parse(storedInvitation);
                    } else {
                        console.error("No invitation data found in sessionStorage.");
                    }
                } else if (linkName) {
                    // Lấy dữ liệu từ API theo linkName
                    const response = await userAPI.getTemplateUserBylinkName(linkName);
                    if (response?.data?.invitation) {
                        currentInvitation = response.data.invitation;
                    } else {
                        console.error("No invitation data found for linkName.");
                    }

                    // Nếu có `id`, lấy thông tin khách mời và gắn tên vào component
                    if (id) {
                        try {
                            const responseguest = await userAPI.getGuestID(id);
                            console.log("Guest Name:", responseguest.data.name);

                            // Gắn tên khách mời vào component có `id` chứa `-ten_khach`
                            if (currentInvitation?.metadata?.components) {
                                currentInvitation.metadata.components = currentInvitation.metadata.components.map(
                                    (componentList) =>
                                        componentList.map((component) => {
                                            if (component.id.includes("-ten_khach")) {
                                                return {
                                                    ...component,
                                                    text: responseguest.data.name, // Gắn tên khách mời vào đây
                                                };
                                            }
                                            return component;
                                        })
                                );
                            }
                        } catch (error) {
                            console.error("Error fetching guest data:", error);
                        }
                    }
                }

                setInvitation(currentInvitation);
            } catch (error) {
                console.error("Error fetching invitation:", error);
            }
        };

        fetchInvitation();
    }, [isPreview, linkName, id]);


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
