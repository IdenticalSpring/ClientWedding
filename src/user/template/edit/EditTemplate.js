import React, { useEffect, useRef, useState } from "react";
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

  const sectionRef = useRef(null)

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
      <Box ref={sectionRef} sx={{ flex: 1, padding: 2, maxWidth: "100%", boxSizing: "border-box" }}>
        {selectedSection ? (
          <Box
            sx={{
              position: "relative",
              border: "1px dashed #ccc",
              padding: 2,
              minHeight: "200px",
              width: "100%",
              backgroundColor: "#f9f9f9",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {/* Render components inside the selected section */}
            {selectedSection.metadata?.components?.map((component) => (
              <RenderComponent key={component.id} component={component} sectionRef={sectionRef} />
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
