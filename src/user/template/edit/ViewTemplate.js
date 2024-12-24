import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../../service/user";
import { Box, Typography, Snackbar, Alert } from "@mui/material";

const ViewTemplate = () => {
  const { linkName} = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await userAPI.getTemplateUserBylinkName(linkName);
        setTemplate(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
        showSnackbar("Không thể tải template!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [linkName]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
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
        <Typography variant="h6">Loading template...</Typography>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Template not found.</Typography>
      </Box>
    );
  }

  const sortedSections = template?.section_user
    ?.slice()
    .sort((a, b) => a.position - b.position);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Template View
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {sortedSections.map((section, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              border: "1px solid #ccc",
              padding: 2,
              minHeight: section?.metadata?.style?.minHeight,
              minWidth: section?.metadata?.style?.minWidth,
              boxSizing: "border-box",
              marginBottom: 2,
              overflow: "hidden",
            }}
          >
            {section.metadata?.components?.map((component) => (
              <Box key={component.id} sx={{ marginBottom: 2 }}>
                {component.type === "text" && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: component.style.color,
                      fontSize: component.style.fontSize,
                      fontFamily: component.style.fontFamily,
                      position: "absolute",
                      top: component.style?.top || 0,
                      left: component.style?.left || 0,
                      bottom: component.style?.bottom || "auto",
                      right: component.style?.right || "auto",
                      width: component.style?.width,
                      height: component.style?.height,
                    }}
                  >
                    {component.text}
                  </Typography>
                )}
                {component.type === "image" && component.src && (
                  <img
                    src={component.src}
                    alt={component.alt}
                    width={component.style?.width || "100%"}
                    height={component.style?.height || "auto"}
                    style={{
                      zIndex: -1,
                      position: "absolute",
                      top: component.style?.top || 0,
                      left: component.style?.left || 0,
                      bottom: component.style?.bottom || "auto",
                      right: component.style?.right || "auto",
                      objectFit: "cover",
                    }}
                  />
                )}
                {component.type === "circle" && (
                  <Box
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: component.style?.fillColor,
                      position: "absolute",
                      top: component.style?.top || 0,
                      left: component.style?.left || 0,
                      bottom: component.style?.bottom || "auto",
                      right: component.style?.right || "auto",
                    }}
                  >
                    <img
                      src={component.src || ""}
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
                )}

                {component.type === "rect" && (
                  <Box
                    sx={{
                      width: component.style?.width || 100,
                      height: component.style?.height || 50,
                      backgroundColor: component.style?.fillColor || "green",
                      position: "absolute",
                      top: component.style?.top || 0,
                      left: component.style?.left || 0,
                      bottom: component.style?.bottom || "auto",
                      right: component.style?.right || "auto",
                    }}
                  />
                )}
              </Box>
            ))}
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

export default ViewTemplate;
