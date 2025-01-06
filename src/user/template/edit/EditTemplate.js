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
} from "@mui/material";
import { ArrowBack, Visibility, Save } from "@mui/icons-material";
import SidebarContent from "../../components/sidebar/sidebarContent";
import SidebarRight from "../../components/sidebar/SidebarRight";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Canvas from "../template-component/Canvas";
const EditTemplate = () => {
  const userId = sessionStorage.getItem("userId");
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const location = useLocation();
  const handleLinkNameChange = (e) => setLinkName(e.target.value);

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
  const handleWheel = (event) => {
    event.preventDefault();
    setScale((prevScale) => {
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(Math.max(prevScale + delta, 0.5), 3);
    });
  };

  const handleMouseDown = (event) => {
    if (!event.shiftKey) return;
    isPanning.current = true;
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (!isPanning.current) return;
    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  useEffect(() => {
    if (location.state?.isEditAction) {
      // Chuyển sang gọi API `getTemplateUserById` nếu là hành động từ WebsiteManagement
      const fetchTemplate = async () => {
        try {
          const response = await userAPI.getTemplateUserById(id); // Gọi API từ WebsiteManagement
          const transformedSections = response.data?.section_user.map(
            (section) => ({
              ...section,
              metadata: section.metadata || {}, // Đảm bảo metadata luôn tồn tại
              components: section.components || [], // Đảm bảo components luôn tồn tại
            })
          );
          const sortedSections = sortSectionsByPosition(
            transformedSections || []
          );
          setLinkName(response.data?.linkName || "");
          setTemplate({ ...response, sections: sortedSections });
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          toast.error("Đã xảy ra lỗi khi tải template.");
          navigate("/template");
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
          const sortedSections = sortSectionsByPosition(
            response.data.sections || []
          );
          setTemplate({ ...response.data, sections: sortedSections });
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          toast.error("Đã xảy ra lỗi khi tải template.");
          navigate("/template");
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
    if (selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        style: { ...selectedComponent.style, [key]: value },
      };

      setSelectedComponent(updatedComponent);

      // Cập nhật trực tiếp template.sections
      setTemplate((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === selectedSection.id
            ? {
                ...section,
                metadata: {
                  ...section.metadata,
                  components: section.metadata.components.map((comp) =>
                    comp.id === selectedComponent.id ? updatedComponent : comp
                  ),
                },
              }
            : section
        ),
      }));
    }
  };

  const handleTextChange = (value) => {
    if (selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        text: value,
      };

      setSelectedComponent(updatedComponent);

      // Cập nhật trực tiếp template.sections
      setTemplate((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === selectedSection.id
            ? {
                ...section,
                metadata: {
                  ...section.metadata,
                  components: section.metadata.components.map((comp) =>
                    comp.id === selectedComponent.id ? updatedComponent : comp
                  ),
                },
              }
            : section
        ),
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageData = await userAPI.uploadImages(file);
        const imageURL = imageData.data.url;

        const updatedComponent = {
          ...selectedComponent,
          src: imageURL,
        };

        setSelectedComponent(updatedComponent);

        // Cập nhật trực tiếp template.sections
        setTemplate((prev) => ({
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === selectedSection.id
              ? {
                  ...section,
                  metadata: {
                    ...section.metadata,
                    components: section.metadata.components.map((comp) =>
                      comp.id === selectedComponent.id ? updatedComponent : comp
                    ),
                  },
                }
              : section
          ),
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
        const sanitizedTemplate = {
          id: template.id,
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
          description: template.description,
          linkName,
        };
        await userAPI.updateTemplateUser(template.data?.id, sanitizedTemplate);
        // Cập nhật từng section
        for (const section of updatedSections) {
          await userAPI.updateSectionUser(section.id, {
            position: section.position,
            metadata: section.metadata,
          });
        }

        showSnackbar("Template và Sections đã được cập nhật!", "success");
      } else {
        const sanitizedTemplate = {
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
          description: template.description,
          templateId: `${id}`,
          linkName,
        };
        const savedTemplate = await userAPI.createTemplateUser(
          sanitizedTemplate,
          userId,
          linkName
        );
        const templateID = savedTemplate.data?.id;

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
          height: "100vh",
          backgroundColor: "#fff",
          overflowY: "auto",
          padding: 2,
        }}
      >
        {sortedSections.map((section, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              border: "1px dashed #ccc",
              marginBottom: 2,
              padding: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Canvas
              sections={[section]} // Render từng section
              isViewMode={true} // Đặt chế độ view
              setActiveComponent={() => {}} // Không cần chọn component khi preview
            />
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
          onClick={() => setIsPreview(false)} // Thoát preview
        >
          Thoát Xem
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar
        position="fixed"
        color="primary"
        sx={{ zIndex: 1100, height: "60px" }}
      >
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
      <Box
        sx={{
          display: "flex",
          height: "100%",
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            marginTop: "60px",
            width: "250px",
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            borderRight: "1px solid #ccc",
            padding: 2,
            backgroundColor: "#f4f4f4",
            overflowY: "auto",
          }}
        >
          <SidebarContent
            template={{ ...template, sections: sortedSections }}
            onSectionClick={handleSectionClick}
            sections={template.sections}
          />
        </Box>
        <Box
          sx={{
            marginLeft: "350px",
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          {selectedSection ? (
            <Box
              id="canvas"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              sx={{
                marginTop: "60px",
                flex: 1,
                position: "relative",
                cursor: isPanning.current ? "grabbing" : "grab",
                backgroundColor: "#FCFCFC",
              }}
            >
              <Canvas
                sections={template.sections} // Render chỉ section đã chọn
                isViewMode={false}
                setActiveComponent={(component) =>
                  setSelectedComponent(component)
                }
              />
            </Box>
          ) : (
            <Typography>Select a section to edit.</Typography>
          )}
        </Box>
        <Box
          sx={{
            marginTop: "60px",
            width: "300px",
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            borderLeft: "1px solid #ccc",
            padding: 2,
            backgroundColor: "#f9f9f9",
            overflowY: "auto",
          }}
        >
          <SidebarRight
            selectedComponent={selectedComponent}
            handleTextChange={handleTextChange}
            handleStyleChange={handleStyleChange}
            handleFileUpload={handleFileUpload}
          />
        </Box>
      </Box>
      {/* Thêm các trường nhập tên cô dâu và chú rể ở cuối giao diện */}
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Nhập tên Link"
          value={linkName}
          onChange={handleLinkNameChange}
          fullWidth
          error={nameError && !linkName}
          helperText={nameError && !linkName ? "Vui lòng nhập tên link!" : ""}
          sx={{ mb: 2 }}
        />
      </Box>
    </Box>
  );
};

export default EditTemplate;
