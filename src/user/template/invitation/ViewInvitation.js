import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { userAPI } from "../../../service/user";

const ViewInvitation = () => {
  const { linkName, id } = useParams();
  const location = useLocation();
  const [invitation, setInvitation] = useState(null);
  const [sections, setSections] = useState([]); // Định nghĩa state sections
  const isPreview = location.state?.isPreview || false;
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

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
            showSnackbar(
              "No invitation data found in sessionStorage.",
              "error"
            );
          }
        } else if (linkName) {
          // Lấy dữ liệu từ API theo linkName
          const response = await userAPI.getTemplateUserBylinkName(linkName);
          if (response?.data?.invitation) {
            currentInvitation = response.data.invitation;
          } else {
            console.error("No invitation data found for linkName.");
            showSnackbar("No invitation data found for linkName.", "error");
          }

          // Nếu có `id`, lấy thông tin khách mời và gắn tên vào component
          if (id) {
            try {
              const responseguest = await userAPI.getGuestID(id);
              // Gắn tên khách mời vào component có `id` chứa `-ten_khach`
              if (currentInvitation?.metadata?.components) {
                currentInvitation.metadata.components =
                  currentInvitation.metadata.components.map((componentList) =>
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
              showSnackbar("Error fetching guest data.", "error");
            }
          }
        }

        // Xử lý dữ liệu để đặt vào sections
        if (currentInvitation?.metadata) {
          const processedSections = processMetadataToSections(
            currentInvitation.metadata
          );
          setSections(processedSections);
        }

        setInvitation(currentInvitation);
      } catch (error) {
        console.error("Error fetching invitation:", error);
        showSnackbar("Error fetching invitation.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [isPreview, linkName, id]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderComponent = (component) => {
    switch (component.type) {
      case "text":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              color: component.style.color || "#000",
              backgroundColor: component.style.fillColor || "transparent",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: component.style.fontSize
                  ? `${component.style.fontSize}px`
                  : "16px",
                fontFamily: component.style.fontFamily || "inherit",
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {component.text || "Sample Text"}
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
              backgroundColor: component.style.fillColor || "#000",
              borderRadius: "50%",
              border: component.style.border || "none",
              boxSizing: "border-box",
            }}
          />
        );
      case "image":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: component.style.fillColor || "transparent",
              boxSizing: "border-box",
            }}
          >
            {component.src ? (
              <img
                src={component.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Typography variant="caption" sx={{ color: "#aaa" }}>
                No image source
              </Typography>
            )}
          </Box>
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
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  if (!invitation && sections.length === 0) {
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
          width: invitation.metadata.style[0]?.minWidth || "500px",
          height: invitation.metadata.style[0]?.minHeight || "800px",
          backgroundColor:
            invitation.metadata.style[0]?.backgroundColor || "#f9f9f9",
          position: "relative",
          border: invitation.metadata.style[0]?.border || "1px solid #ddd",
          boxSizing: "border-box",
          padding: invitation.metadata.style[0]?.padding || "10px",
          fontFamily: invitation.metadata.style[0]?.fontFamily || "inherit",
        }}
      >
        {sections.map((section) => (
          <Box
            key={section.id}
            sx={{ position: "relative", width: "100%", height: "100%" }}
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
    id: `section-${index}`,
    style: styleItem,
    components: components[index] || [],
  }));
};

const processSectionUserToSections = (sectionUsers) => {
  return sectionUsers.map((sectionUser, index) => ({
    id: sectionUser.id || `section-${index}`,
    style: sectionUser.metadata?.style || {},
    components: sectionUser.metadata?.components || [],
  }));
};

export default ViewInvitation;
