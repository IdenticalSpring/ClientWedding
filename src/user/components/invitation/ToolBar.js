import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, TextField, Input } from "@mui/material";
import StyleEditor from "./StyleEditor";
import {
  TextBox,
  ImageBox,
  Rectangle,
  Circle,
  Diamond,
  Line,
} from "../../../utils/draggableComponents";

const Toolbar = ({
  activeStyles,
  handleStyleChange,
  invitationData,
  setInvitationData,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (activeStyles) {
      setTabIndex(1);
    } else if (!activeStyles && tabIndex === 1) {
      setTabIndex(0);
    }
  }, [activeStyles]);

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !activeStyles) return;
    setTabIndex(newValue);
  };

  const handleInputChange = (field, value) => {
    setInvitationData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setInvitationData((prevData) => ({
      ...prevData,
      thumbnailUrl: file,
    }));
  };

  return (
    <Box
      sx={{
        width: "250px",
        padding: 1,
        borderRight: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 53px)",
        borderLeft: "1px solid #ddd",
        marginTop: "53px",
        zIndex: 1,
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="General" />
        {activeStyles && <Tab label="Style" />}
        <Tab label="Shape" />
      </Tabs>

      <Box sx={{ flexGrow: 1, width: "100%", mt: 2 }}>
        {/* Shape Tab */}
        {tabIndex === 2 && (
          <Box>
            <TextBox />
            <ImageBox />
            <Rectangle />
            <Circle />
            <Diamond />
            <Line />
          </Box>
        )}

        {/* Style Tab */}
        {activeStyles && tabIndex === 1 && (
          <Box>
            <StyleEditor
              activeStyles={activeStyles}
              handleStyleChange={handleStyleChange}
            />
          </Box>
        )}

        {/* General Tab */}
        {tabIndex === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={invitationData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Message"
              variant="outlined"
              value={invitationData.message || ""}
              onChange={(e) => handleInputChange("message", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Audience"
              variant="outlined"
              value={invitationData.audience || ""}
              onChange={(e) => handleInputChange("audience", e.target.value)}
              margin="normal"
            />

           
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
