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
  TextField,
  Slider,
  Select,
  MenuItem,
} from "@mui/material";
import { ArrowBack, Visibility, Save } from "@mui/icons-material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import SidebarContent from "../../components/sidebar/sidebarContent";
import RenderComponent from "../../components/render/RenderComponent";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState();
  const [loading, setLoading] = useState(true);
  const [idUser, setIdUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const sectionRef = useRef(null);
  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  useEffect(() => {
    const token = Cookies.get("token");
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
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIdUser(decoded.sub);
        } catch (error) {
          console.error("Lỗi khi giải mã token:", error);
        }
      }
    };

    fetchTemplate();
  }, [id]);

  const handleView = () => {
    console.log("View");
  };

  const handleStyleChange = (key, value) => {
    if (selectedComponent) {
      // Cập nhật giá trị style của selectedComponent
      setSelectedComponent((prev) => ({
        ...prev,
        style: { ...prev.style, [key]: value },
      }));

      // Cập nhật giá trị trong template.sections
      const updatedSections = template.sections.map((section) => ({
        ...section,
        metadata: {
          ...section.metadata,
          components: section.metadata.components.map((comp) =>
            comp.id === selectedComponent.id
              ? {
                  ...comp,
                  style: { ...comp.style, [key]: value },
                }
              : comp
          ),
        },
      }));

      // Cập nhật template
      setTemplate((prev) => ({
        ...prev,
        sections: updatedSections,
      }));
    }
  };

  const handleTextChange = (value) => {
    if (selectedComponent) {
      // Cập nhật giá trị của selectedComponent
      setSelectedComponent((prev) => ({
        ...prev,
        text: value,
      }));

      // Cập nhật giá trị trong template.sections
      const updatedSections = template.sections.map((section) => ({
        ...section,
        metadata: {
          ...section.metadata,
          components: section.metadata.components.map((comp) =>
            comp.id === selectedComponent.id ? { ...comp, text: value } : comp
          ),
        },
      }));

      setTemplate((prev) => ({
        ...prev,
        sections: updatedSections,
      }));
    }
  };

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageURL = URL.createObjectURL(file);
  //     handleStyleChange("src", imageURL);
  //   }
  // };
  console.log("id", idUser);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Gọi API upload ảnh
        const imageData = await userAPI.uploadImages(file);

        // Lấy URL ảnh sau khi upload
        const imageURL = imageData.url;

        // Cập nhật src của component với URL ảnh mới
        handleStyleChange("src", imageURL);
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        showSnackbar("Lỗi khi upload ảnh", "error");
      }
    }
  };
  // console.log("templates: " + template.thumbnailUrl);
  const handleSave = async () => {
    try {
      const savedTemplate = await userAPI.createTemplateUser(template);
      console.log("Template:", savedTemplate);
      const templateID = savedTemplate.data?.id;

      if (!templateID) {
        throw new Error("Không thể lấy được templateId!");
      }

      const sectionsWithMetadata = template.sections.map((section) => ({
        template_userId: templateID,
        metadata: {
          components: section.metadata.components,
        },
        // userId: idUser,
      }));

      console.log("Sections đã cập nhật:", sectionsWithMetadata);
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
                minHeight: selectedSection.metadata.style.minHeight,
                width: "100%",
                backgroundColor: "#f9f9f9",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* {selectedSection.metadata?.components?.map((component) => (
                <RenderComponent
                  key={component.id}
                  component={component}
                  sectionRef={sectionRef}
                  onClick={handleComponentClick}
                />
              ))} */}
              {selectedSection.metadata?.components?.map((component) => {
                const updatedComponent = template.sections
                  .find((section) => section.id === selectedSection.id)
                  ?.metadata.components.find(
                    (comp) => comp.id === component.id
                  );

                return (
                  <RenderComponent
                    key={component.id}
                    component={updatedComponent || component}
                    sectionRef={sectionRef}
                    onClick={handleComponentClick}
                  />
                );
              })}
              {selectedComponent && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "300px",
                    background: "#fff",
                    padding: 2,
                    borderLeft: "1px solid #ccc",
                  }}
                >
                  <h3>Edit Component</h3>
                  {selectedComponent.type === "text" && (
                    <>
                      <TextField
                        label="Text"
                        value={selectedComponent.text || ""}
                        onChange={(e) => handleTextChange(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        type="color"
                        label="Font Color"
                        value={selectedComponent.style.color || "#000000"}
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Slider
                        value={selectedComponent.style.fontSize || 16}
                        onChange={(e, value) =>
                          handleStyleChange("fontSize", value)
                        }
                        min={10}
                        max={72}
                        step={1}
                        sx={{ mb: 2 }}
                      />
                      <Select
                        value={selectedComponent.style.fontFamily || "Arial"}
                        onChange={(e) =>
                          handleStyleChange("fontFamily", e.target.value)
                        }
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="Arial">Arial</MenuItem>
                        <MenuItem value="Courier New">Courier New</MenuItem>
                        <MenuItem value="Georgia">Georgia</MenuItem>
                        <MenuItem value="Times New Roman">
                          Times New Roman
                        </MenuItem>
                        <MenuItem value="Verdana">Verdana</MenuItem>
                      </Select>
                    </>
                  )}

                  {selectedComponent.type === "image" && (
                    <TextField
                      type="file"
                      onChange={handleFileUpload}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                </Box>
              )}
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
