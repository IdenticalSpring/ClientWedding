import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../../../service/user";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowBack, Visibility, Save } from "@mui/icons-material";
import SidebarContent from "../../components/sidebar/sidebarContent";
import RenderComponent from "../../components/render/RenderComponent";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  const sectionRef = useRef(null)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
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

  const handleView = () => {
    console.log("View");
  };

  const handleSave = async () => {
    try {
      const savedTemplate = await userAPI.createTemplateUser(
        template,
        template.thumbnailUrl
      );
      const templateID = savedTemplate.data?.id;

      if (!templateID) {
        throw new Error("Không thể lấy được templateId!");
      }

      const sectionsWithMetadata = template.sections.map((section) => ({
        templateId: templateID,
        metadata: {
          components: section.components,
        },
      }));

      for (const section of sectionsWithMetadata) {
        await userAPI.createSectionUser(section);
      }

      showSnackbar("Lưu template và sections thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi lưu template và sections:", error);
      showSnackbar(error.message || "Lưu thất bại!", "error");
    }
  };

  const handleBack = () => {
    navigate(-1);
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
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            startIcon={<Visibility />}
            onClick={handleView}
            sx={{ marginRight: 1 }}
          >
            Xem
          </Button>
          <Button color="inherit" startIcon={<Save />} onClick={handleSave}>
            Lưu
          </Button>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        </Toolbar>
      </AppBar>

      <Box ref={sectionRef} sx={{ display: "flex", flex: 1 }}>
        <Box
          sx={{
            width: "250px",
            borderRight: "1px solid #ccc",
            padding: 2,
            backgroundColor: "#f4f4f4",
          }}
        >
          <SidebarContent
            template={template}
            onSectionClick={handleSectionClick}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: 2,
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
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
              {selectedSection.metadata?.components?.map((component) => (
                <RenderComponent key={component.id} component={component} sectionRef={sectionRef} />
            ))}
            </Box>
          ) : (
            <Typography>Select a section to edit.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EditTemplate;
