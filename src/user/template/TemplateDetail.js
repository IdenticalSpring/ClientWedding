import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../service/user";
import { Box, Typography, Grid } from "@mui/material";
const TemplateDetail = (props) => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await userAPI.getTemplateById(id);

        setTemplate(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

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
              fontFamily: component.style.fontFamily,
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
                borderRadius: component.style.borderRadius || "0%",
                backgroundColor: component.style.fillColor,
                borderColor: component.style.borderColor || "",
                borderWidth: component.style.borderWidth || "0px",
                borderStyle: component.style.borderStyle || "none",
                opacity: component.style.opacity / 100 || "1",
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
              borderStyle: component.style.borderStyle || "none",
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
              borderColor: component.style.borderColor || "",
              borderWidth: component.style.borderWidth || "0px",
              borderStyle: component.style.borderStyle || "none",
              opacity: component.style.opacity / 100 || "1",
            }}
          >
            <img
              src={component.src ? component.src : ""}
              alt="image component"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Adjust image to fit box
              }}
            />
          </Box>
        );
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
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {template.sections && template.sections.length > 0 ? (
              template.sections.map((section) => (
                <Box
                  key={section.id}
                  sx={{
                    position: "relative",
                    border: "1px dashed #ccc",
                    padding: 2,
                    minHeight: section?.metadata?.style?.minHeight,
                    minWidth: section?.metadata?.style?.minWidth,
                    marginBottom: 2,
                    backgroundColor: "#f9f9f9",
                    overflow: "hidden",
                  }}
                >
                  {section.metadata?.components?.map(renderComponent)}
                </Box>
              ))
            ) : (
              <Typography>No sections available.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TemplateDetail;
