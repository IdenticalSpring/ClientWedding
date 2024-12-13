import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../../service/user";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";

const ViewTemplate = () => {
  const { templateID, brideName, groomName } = useParams();
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
        // Lấy thông tin template từ API bằng templateID
        const response = await userAPI.getTemplateUserById(templateID);
        setTemplate(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
        showSnackbar("Không thể tải template!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateID]);

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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Template View
      </Typography>

      <Typography variant="h6" gutterBottom>
        {`Cô dâu: ${brideName} - Chú rể: ${groomName}`}
      </Typography>

      <Box>
        {template.sections.map((section, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              border: "1px solid #ccc",
              padding: 2,
              minHeight: section.metadata.style.minHeight,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {section.metadata?.components?.map((component) => (
              <Box key={component.id} sx={{ marginBottom: 2 }}>
                {/* Render each component based on its type */}
                {component.type === "text" && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: component.style.color,
                      fontSize: component.style.fontSize,
                      fontFamily: component.style.fontFamily,
                    }}
                  >
                    {component.text}
                  </Typography>
                )}
                {component.type === "image" && component.src && (
                  <img src={component.src} alt={component.alt} width="100%" />
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
