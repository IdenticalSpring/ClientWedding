import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// import FloatingButtons from "./components/FloatingButtons";
import AppAppBar from "../../layout/navbar";
import Footer from "../../layout/footer";
import AppTheme from "../../components/shared-theme/AppTheme";
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
              borderRadius: "50%",
              backgroundColor: component.style.fillColor,
              borderColor: component.style.borderColor || "",
              borderWidth: component.style.borderWidth || "0px",
              borderColor: component.style.borderColor || "",
              borderStyle: component.style.borderStyle || "none",
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
              borderColor: component.style.borderColor || "",
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
    <div style={{ marginTop: "50px" }}>
      <Box sx={{ padding: 2 }}>
        {/* <Typography variant="h4" gutterBottom>
            View Template: {template.name || "Untitled"}
          </Typography> */}
        <Grid container spacing={2}>
          {/* <Grid item xs={12}>
              <Typography variant="h6">Description</Typography>
              <Typography>
                {template.description || "No description provided."}
              </Typography>
            </Grid> */}
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
                  {/* <Typography variant="h6">
                      Section: {section.name || "Unnamed"}
                    </Typography> */}
                  {/* Render the components inside the section */}
                  {section.metadata?.components?.map(renderComponent)}
                </Box>
              ))
            ) : (
              <Typography>No sections available.</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default TemplateDetail;
