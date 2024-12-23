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
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleBrideNameChange = (e) => setBrideName(e.target.value);
  const handleGroomNameChange = (e) => setGroomName(e.target.value);

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
    const token = Cookies.get("token");
    const fetchTemplate = async () => {
      try {
        const response = await userAPI.getTemplateByIdEdit(id, userId);
        const sortedSections = sortSectionsByPosition(response.data.sections || []);
        setTemplate({ ...response.data, sections: sortedSections });
      } catch (error) {
        if (error?.response?.status === 400) {
          toast.error('Hãy nâng cấp gói VIP để sử dụng template này.');
        } else {
          toast.error('Đã xảy ra lỗi khi tải template.');
        }
        navigate('/template');
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
    // Kiểm tra nếu tên cô dâu và chú rể không rỗng
    if (!brideName || !groomName) {
      setNameError(true);
      showSnackbar("Vui lòng nhập tên cô dâu và chú rể!", "error");
      return;
    }

    try {
      const updatedSections = sections.map((section, index) => ({
        ...section,
        position: String(index + 1), // Chuyển đổi position thành chuỗi
      }));

      setSections(updatedSections);
      const savedTemplate = await userAPI.createTemplateUser(
        template,
        idUser,
        groomName,
        brideName
      );
      const templateID = savedTemplate.data?.id;

      if (!templateID) {
        throw new Error("Không thể lấy được templateId!");
      }

      const sectionsWithMetadata = template.sections.map((section) => ({
        template_userId: templateID,
        position: section.position,
        metadata: {
          components: section.metadata.components,
          style: section?.metadata?.style,
        },
      }));

      for (const section of sectionsWithMetadata) {
        await userAPI.createSectionUser(section);
      }

      // Cập nhật URL với tên cô dâu và chú rể
      const encodedBrideName = encodeURIComponent(brideName);
      const encodedGroomName = encodeURIComponent(groomName);
      // const viewURL = `${window.location.origin}/view/${templateID}/${encodedBrideName}/${encodedGroomName}`;
      // Sử dụng navigate để chuyển tới trang view
      navigate(`/view/${templateID}/${encodedBrideName}/${encodedGroomName}`);
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
          label="Tên cô dâu"
          value={brideName}
          onChange={handleBrideNameChange}
          fullWidth
          error={nameError && !brideName}
          helperText={
            nameError && !brideName ? "Vui lòng nhập tên cô dâu!" : ""
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label="Tên chú rể"
          value={groomName}
          onChange={handleGroomNameChange}
          fullWidth
          error={nameError && !groomName}
          helperText={
            nameError && !groomName ? "Vui lòng nhập tên chú rể!" : ""
          }
          sx={{ mb: 2 }}
        />
      </Box>
    </Box>
  );
};

export default EditTemplate;