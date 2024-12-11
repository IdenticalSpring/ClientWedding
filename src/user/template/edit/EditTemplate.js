import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../../service/user";
import {
  Box,
  Typography,
  Grid
} from "@mui/material";
import SidebarContent from "../../components/sidebar/sidebarContent";
import RenderComponent from "../../components/render/RenderComponent";

const EditTemplate = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await userAPI.getTemplateById(id);
        setTemplate(response.data);
        if (response.data.sections && response.data.sections.length > 0) {
          setSelectedSection(response.data.sections[0]);
        }
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
              backgroundColor: component.style.fillColor || "#ccc",
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

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    console.log("Selected section:", section);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: 2,
          backgroundColor: "#f4f4f4",
        }}
      >
        <SidebarContent template={template} onSectionClick={handleSectionClick}/>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, padding: 2, maxWidth: "100%", boxSizing: "border-box" }}>
        {selectedSection ? (
          <Box
            sx={{
              position: "relative",
              border: "1px dashed #ccc",
              padding: 2,
              minHeight: "150px",
              width: "100%",
              backgroundColor: "#f9f9f9",
              boxSizing: "border-box"
            }}
          >
            {/* Render components inside the selected section */}
            {selectedSection.metadata?.components?.map((component) => (
              <RenderComponent key={component.id} component={component} />
            ))}
          </Box>
        ) : (
          <Typography>Select a section to edit.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default EditTemplate;
