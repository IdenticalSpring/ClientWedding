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
import SidebarRight from "../../components/sidebar/SidebarRight";
import RenderComponent from "../../components/render/RenderComponent";
import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
const EditTemplate = () => {
  const userId=sessionStorage.getItem('userId');
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState();
  const [loading, setLoading] = useState(true);
  const [idUser, setIdUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [nameError, setNameError] = useState(false);
  const location = useLocation();
  const handleLinkNameChange = (e) => setLinkName(e.target.value);


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

  const sortSectionsByPosition = (sections) => {
    return [...sections].sort((a, b) => {
      const positionA = parseInt(a.position, 10);
      const positionB = parseInt(b.position, 10);
      return positionA - positionB;
    });
  };

  useEffect(() => {
    if (location.state?.isEditAction) {
      // Chuyển sang gọi API `getTemplateUserById` nếu là hành động từ WebsiteManagement
      const fetchTemplate = async () => {
        try {
          const response = await userAPI.getTemplateUserById(id); // Gọi API từ WebsiteManagement
          const transformedSections = response.data?.section_user.map((section) => ({
            ...section,
            metadata: section.metadata || {}, // Đảm bảo metadata luôn tồn tại
            components: section.components || [], // Đảm bảo components luôn tồn tại
          }));
          const sortedSections = sortSectionsByPosition(transformedSections || []);
          setLinkName(response.data?.linkName || ""); 
          setTemplate({ ...response, sections: sortedSections });
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          toast.error("Đã xảy ra lỗi khi tải template.");
          navigate('/template');
        } finally {
          setLoading(false);
        }
      };

      fetchTemplate();
    } else {
      // Gọi API mặc định `getTemplateByIdEdit`
      const fetchTemplate = async () => {
        try {
          const response = await userAPI.getTemplateByIdEdit(id, userId);
          const sortedSections = sortSectionsByPosition(response.data.sections || []);
          console.log("🚀 ~ file", sortedSections)
          setTemplate({ ...response.data, sections: sortedSections });
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          toast.error("Đã xảy ra lỗi khi tải template.");
          navigate('/template');
        } finally {
          setLoading(false);
        }
      };

      fetchTemplate();
    }
  }, [id, location.state]);

  const handleView = () => {
    setIsPreview((prev) => !prev);
  };

  const handleStyleChange = (key, value) => {
    console.log("Handle style change:", key, value);
    if (selectedComponent) {
      setSelectedComponent((prev) => ({
        ...prev,
        style: { ...prev.style, [key]: value },
      }));

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

      setTemplate((prev) => ({
        ...prev,
        sections: updatedSections,
      }));
    }
  };

  const handleTextChange = (value) => {
    console.log("🚀 ~ handleTextChange ~ value:", value)

    if (selectedComponent) {
      setSelectedComponent((prev) => ({
        ...prev,
        text: value,
      }));

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageData = await userAPI.uploadImages(file);
        const imageURL = imageData.data.url;
        // Cập nhật src trong selectedComponent
        setSelectedComponent((prev) => ({
          ...prev,
          src: imageURL,
        }));

        // Cập nhật src trong template.sections
        const updatedSections = template.sections.map((section) => {
          if (section.id === selectedSection.id) {
            return {
              ...section,
              metadata: {
                ...section.metadata,
                components: section.metadata.components.map((comp) =>
                  comp.id === selectedComponent.id
                    ? { ...comp, src: imageURL }
                    : comp
                ),
              },
            };
          }
          return section;
        });

        setTemplate((prev) => ({
          ...prev,
          sections: updatedSections,
        }));

        showSnackbar("Upload ảnh thành công!", "success");
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        showSnackbar("Lỗi khi upload ảnh", "error");
      }
    }
  };

  const handleSave = async () => {
    if (!linkName) {
      setNameError(true);
      showSnackbar("Vui lòng nhập tên link vào template!", "error");
      return;
    }

    try {
      // Chuẩn bị dữ liệu sections
      const updatedSections = template.sections.map((section, index) => ({
        id: section.id, // Đảm bảo chỉ giữ lại ID
        position: String(index + 1), // Cập nhật vị trí
        metadata: section.metadata, // Chỉ gửi metadata
      }));

      if (location.state?.isEditAction) {
        // Cập nhật template
        console.log("Updating template...");
        const sanitizedTemplate = {
          id: template.id,
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
          description: template.description,
          linkName,
        };
        console.log("Sanitized Template:", sanitizedTemplate);

        await userAPI.updateTemplateUser(template.data?.id, sanitizedTemplate);

        // Cập nhật từng section
        for (const section of updatedSections) {
          console.log("Updating section:", section);
          await userAPI.updateSectionUser(section.id, {
            position: section.position,
            metadata: section.metadata,
          });
        }

        showSnackbar("Template và Sections đã được cập nhật!", "success");
      } else {
        // Tạo mới template
        console.log("Creating new template...");
        const sanitizedTemplate = {
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
          description: template.description,
          linkName,
        };
        console.log("Sanitized Template:", sanitizedTemplate);

        const savedTemplate = await userAPI.createTemplateUser(sanitizedTemplate, userId, linkName);
        const templateID = savedTemplate.data?.id;

        console.log("New Template ID:", templateID);
        if (!templateID) {
          throw new Error("Không thể lấy được templateId!");
        }

        // Tạo mới các sections
        const sectionsWithMetadata = updatedSections.map((section) => ({
          template_userId: templateID,
          position: section.position,
          metadata: section.metadata,
        }));

        for (const section of sectionsWithMetadata) {
          console.log("Creating section:", section);
          await userAPI.createSectionUser(section);
        }

        showSnackbar("Template đã được tạo thành công!", "success");
      }

      // Điều hướng đến URL mới
      const encodedLinkName = encodeURIComponent(linkName);
      navigate(`/${encodedLinkName}`);
    } catch (error) {
      console.error("Lỗi khi lưu template và sections:", error);
      showSnackbar(error.message || "Lưu thất bại!", "error");
    }
  };


  const handleBack = () => {
    navigate(-1);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
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

  const sortedSections = sortSectionsByPosition(template.sections || []);

  if (isPreview) {
    return (
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
              minHeight: section.metadata.style.minHeight,
              minWidth: section?.metadata?.style?.minWidth,
              boxSizing: "border-box",
              overflow: "hidden",
              marginBottom: 2,
            }}
          >
            {section.metadata?.components?.map((component) => (
              <RenderComponent
                key={component.id}
                component={component}
                sectionRef={sectionRef}
              />
            ))}
          </Box>
        ))}
        <Button
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
          }}
          variant="contained"
          onClick={() => setIsPreview(false)}
        >
          Thoát xem
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="primary" sx={{ zIndex: 1, height: "60px" }}>
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
            {isPreview ? "Thoát xem" : "Xem"}
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

      <Box ref={sectionRef} sx={{ display: "flex", flex: 1, alignItems: "center" }}>
        <Box
          sx={{
            width: "250px",
            borderRight: "1px solid #ccc",
            padding: 2,
            backgroundColor: "#f4f4f4",
          }}
        >
          <SidebarContent
            template={{ ...template, sections: sortedSections }}
            onSectionClick={handleSectionClick}
          />
        </Box>

        {selectedSection ? (
          <Box
            sx={{
              position: "relative",
              border: "1px dashed #ccc",
              padding: 2,
              minHeight: selectedSection.metadata.style.minHeight,
              minWidth: selectedSection?.metadata?.style?.minWidth,
              backgroundColor: "#f9f9f9",
              boxSizing: "border-box",
              overflow: "hidden",
              marginLeft: 2
            }}
          >
            {selectedSection.metadata?.components?.map((component) => {
              const updatedComponent = template.sections
                .find((section) => section.id === selectedSection.id)
                ?.metadata.components.find((comp) => comp.id === component.id);

              return (
                <RenderComponent
                  key={component.id}
                  component={updatedComponent || component}
                  sectionRef={sectionRef}
                  onClick={handleComponentClick}
                />
              );
            })}
          </Box>
        ) : (
          <Typography>Select a section to edit.</Typography>
        )}
        <SidebarRight
          selectedComponent={selectedComponent}
          handleTextChange={handleTextChange}
          handleStyleChange={handleStyleChange}
          handleFileUpload={handleFileUpload}
        />
      </Box>

      {/* Thêm các trường nhập tên cô dâu và chú rể ở cuối giao diện */}
      <Box sx={{ padding: 2 }}>
       
        <TextField
          label="Nhập tên Link"
          value={linkName}
          onChange={handleLinkNameChange}
          fullWidth
          error={nameError && !linkName}
          helperText={
            nameError && !linkName ? "Vui lòng nhập tên link!" : ""
          }
          sx={{ mb: 2 }}
        />
      </Box>
    </Box>
  );
};

export default EditTemplate;