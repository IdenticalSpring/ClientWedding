import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getTemplateByUrl } from "../../service/templateService"; // Your service function

const ViewTemplate = () => {
  const { url } = useParams(); // Lấy tham số URL từ route
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy template khi component được mount hoặc url thay đổi
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplateByUrl(url); // Gọi API
        setTemplate(response.data); // Lưu dữ liệu template vào state
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false); // Dừng loading khi có kết quả
      }
    };

    fetchTemplate();
  }, [url]); // Chạy lại khi url thay đổi

  // Hàm quay lại trang quản lý template
  const handleBack = () => {
    navigate("/template");
  };

  // Hàm render các component động từ metadata
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
              fontSize: component.style.fontSize,
              color: component.style.color,
            }}
          >
            <Typography variant="body1">{component.text || "No text provided"}</Typography>
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
              opacity: component.style.opacity / 100 || "1",
            }}
          />
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
              backgroundColor: component.style.fillColor || "#ccc",
              borderRadius: component.style.borderRadius || "0%",
              opacity: component.style.opacity / 100 || "1",
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
              overflow: "hidden",
              borderRadius: component.style.borderRadius || "0%",
              opacity: component.style.opacity / 100 || "1",
            }}
          >
            <img
              src={component.src.startsWith("data:image") ? component.src : ""}
              alt="image component"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        );
      case "line":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height || 5,
              backgroundColor: component.style.lineColor,
              opacity: component.style.opacity / 100 || 1,
            }}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">Loading template...</Typography>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">Template not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        View Template: {template.name || "Untitled"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>{template.description || "No description provided."}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Sections</Typography>
          {template.sections && template.sections.length > 0 ? (
            template.sections.map((section) => (
              <Box
                key={section.id}
                sx={{
                  position: "relative",
                  border: "1px dashed #ccc",
                  padding: 2,
                  minHeight: "150px",
                  marginBottom: 2,
                  width: "766px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6">Section: {section.name || "Unnamed"}</Typography>
                {section.metadata?.components?.map(renderComponent)}
              </Box>
            ))
          ) : (
            <Typography>No sections available.</Typography>
          )}
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Back to Template Management
        </Button>
      </Box>
    </Box>
  );
};

export default ViewTemplate;
